// app/api/optimize/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Call Panda-X Flask API
    // http://host.docker.internal:5000/analyze for docker dev container
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error calling Panda-X", err);
    return NextResponse.json(
      { error: "Failed to call Panda-X" },
      { status: 500 }
    );
  }
}
