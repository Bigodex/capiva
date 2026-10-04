import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    return NextResponse.json({
      success: true,
      message: "MongoDB conectado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Falha ao conectar no MongoDB.",
      },
      {
        status: 500,
      }
    );
  }
}