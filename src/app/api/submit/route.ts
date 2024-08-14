import { NextRequest, NextResponse } from "next/server";

import axios from "axios";

const client_token = process.env.NEXT_PUBLIC_API_TOKEN;
const client_host = process.env.NEXT_PUBLIC_API_HOST;

export async function POST(request: NextRequest) {
  try {
    const data2 = await request.json();

    const response = await axios({
      url: `${client_host}/api/checkout/`,
      data: data2,
      method: "POST",
      headers: {
        Authorization: `Token ${client_token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ data: response.data }, { status: 201 });
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
