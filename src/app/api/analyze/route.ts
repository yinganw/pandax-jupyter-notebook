// app/api/optimize/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const notebookPath = body.path;
    if (!notebookPath) {
      return NextResponse.json(
        { error: "Missing notebook path" },
        { status: 400 }
      );
    }
    const startCellIdx = body.startCellIdx ?? 0;
    const numRewriteTries = body.numRewriteTries ?? 5;

    // Call Panda-X Jupyter server extension
    // http://host.docker.internal:5000/simple_ext1/default for docker dev container
    const response = await fetch("http://localhost:8888/simple_ext1/default", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: notebookPath,
        startCellIdx,
        numRewriteTries,
      }),
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
