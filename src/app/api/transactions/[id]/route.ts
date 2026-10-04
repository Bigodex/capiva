import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do lançamento inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const deletedTransaction =
      await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json(
        {
          success: false,
          message: "Lançamento não encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lançamento excluído com sucesso.",
    });
  } catch (error) {
    console.error(
      "Erro ao excluir lançamento:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Não foi possível excluir o lançamento.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID do lançamento inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = String(body.title).trim();

      if (!title) {
        return NextResponse.json(
          {
            success: false,
            message: "O título é obrigatório.",
          },
          {
            status: 400,
          }
        );
      }

      updateData.title = title;
    }

    if (body.description !== undefined) {
      updateData.description = String(
        body.description
      ).trim();
    }

    if (body.amount !== undefined) {
      const amount = Number(body.amount);

      if (
        Number.isNaN(amount) ||
        amount <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "O valor deve ser maior que zero.",
          },
          {
            status: 400,
          }
        );
      }

      updateData.amount = amount;
    }

    if (body.type !== undefined) {
      const allowedTypes = [
        "income",
        "expense",
        "investment",
      ];

      if (!allowedTypes.includes(body.type)) {
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

      updateData.type = body.type;
    }

    if (body.category !== undefined) {
      const category = String(
        body.category
      ).trim();

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A categoria é obrigatória.",
          },
          {
            status: 400,
          }
        );
      }

      updateData.category = category;
    }

    if (body.date !== undefined) {
      const date = new Date(body.date);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Data inválida.",
          },
          {
            status: 400,
          }
        );
      }

      updateData.date = date;
    }

    const transaction =
      await Transaction.findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          message: "Lançamento não encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lançamento atualizado com sucesso.",
      data: transaction,
    });
  } catch (error) {
    console.error(
      "Erro ao atualizar lançamento:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Não foi possível atualizar o lançamento.",
      },
      {
        status: 500,
      }
    );
  }
}