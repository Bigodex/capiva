import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

/* =========================
   GET - LISTAR LANÇAMENTOS
========================= */

export async function GET() {
  try {
    await connectToDatabase();

    const transactions = await Transaction.find()
      .sort({
        date: -1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error(
      "Erro ao buscar lançamentos:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Não foi possível buscar os lançamentos.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   POST - CRIAR LANÇAMENTO
========================= */

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const {
      title,
      description,
      amount,
      type,
      category,
      date,
    } = body;

    /* =========================
       VALIDAÇÕES
    ========================= */

    if (
      !title ||
      amount === undefined ||
      !type ||
      !category ||
      !date
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Preencha todos os campos obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    const parsedAmount = Number(amount);

    if (
      Number.isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "O valor do lançamento deve ser maior que zero.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedTypes = [
      "income",
      "expense",
      "investment",
    ];

    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tipo de lançamento inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A data informada é inválida.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       CRIAÇÃO
    ========================= */

    const transaction =
      await Transaction.create({
        title: String(title).trim(),
        description:
          String(description ?? "").trim(),
        amount: parsedAmount,
        type,
        category: String(category).trim(),
        date: parsedDate,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Lançamento criado com sucesso.",
        data: transaction,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao criar lançamento:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Não foi possível criar o lançamento.",
      },
      {
        status: 500,
      }
    );
  }
}