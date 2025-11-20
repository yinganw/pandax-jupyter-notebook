// app/api/optimize/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const maxDuration = 60 * 15;

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

    // const diffPath = path.join(
    //   process.cwd(),
    //   "notebooks/spscientist/student-performance-in-exams/src/diff.json"
    // );
    const diffPath =
      "/Users/yinganwang/Development/capstone/pandax-meng/notebooks/spscientist/student-performance-in-exams/src/diff.json";

    // Read JSON file
    const diffRaw = await fs.readFile(diffPath, "utf-8");
    const diff = JSON.parse(diffRaw);

    const rewritten_nb_path =
      "notebooks/spscientist/student-performance-in-exams/src/rewritten_cpu/o4_mini_high.ipynb";
    const rewritten_nb_abs_path =
      "/Users/yinganwang/Development/capstone/pandax-meng/" + rewritten_nb_path;
    const raw = await fs.readFile(rewritten_nb_abs_path, "utf-8");
    const rewrittenJson = JSON.parse(raw);
    const rewrittenCellsJson = rewrittenJson["cells"].slice(1);
    rewrittenJson["cells"] = rewrittenCellsJson;
    // Preprocess cells
    // remove first cel

    return NextResponse.json(
      {
        rewritten_notebook_path:
          "notebooks/spscientist/student-performance-in-exams/src/rewritten_cpu/o4_mini_high.ipynb",
        diff,
        rewritten_notebook_json: rewrittenJson,
      },
      { status: 200 }
    );

    // // Call Panda-X Jupyter server extension
    // // http://host.docker.internal:5000/simple_ext1/default for docker dev container
    // const response = await fetch("http://localhost:8888/simple_ext1/default", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ path: notebookPath }),
    //   signal: AbortSignal.timeout(10 * 60 * 1000),
    // });

    // const data = await response.json();
    // return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error calling Panda-X", err);
    return NextResponse.json(
      { error: "Failed to call Panda-X" },
      { status: 500 }
    );
  }
}
