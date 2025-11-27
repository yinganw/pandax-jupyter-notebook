// app/api/optimize/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const maxDuration = 60 * 15;

import { diffJson } from "diff";

const oldObj = {
  cells: [
    {
      cell_type: "code",
      execution_count: null,
      id: "2a4fe3b5-f1e6-4f35-ad08-271948e0785f",
      metadata: {},
      outputs: [],
      source:
        '# \nimport numpy as np\nimport os\nif "IREWR_WITH_MODIN" in os.environ and os.environ["IREWR_WITH_MODIN"] == "True":\n    import os\n    os.environ["MODIN_ENGINE"] = "ray"\n    import ray\n    ray.init(num_cpus=int(os.environ[\'MODIN_CPUS\']), runtime_env={\'env_vars\': {\'__MODIN_AUTOIMPORT_PANDAS__\': \'1\'}})\n    import modin.pandas as pd\nelse:\n    import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\nimport time',
    },
    {
      cell_type: "code",
      execution_count: null,
      id: "0027486f-fe07-4689-8170-e06a6bb69544",
      metadata: {},
      outputs: [],
      source: "passmark = 40",
    },
    {
      cell_type: "code",
      execution_count: null,
      id: "dd8f8e8c-0e38-44a8-a6ae-77411d6f0d58",
      metadata: {},
      outputs: [],
      source:
        '### cell 0 ###\n\ndf = pd.read_csv("./notebooks/spscientist/student-performance-in-exams/input/StudentsPerformance.csv")\nfactor = 10\ndf = pd.concat([df]*factor)\ndf.info()',
    },
    {
      cell_type: "code",
      execution_count: null,
      id: "6d306e0f-466a-47ab-84e4-2410b4e804f3",
      metadata: {},
      outputs: [],
      source: "### cell 1 ###\n\ndf.isna().sum()",
    },
    {
      cell_type: "code",
      execution_count: null,
      id: "40731e4c-613e-4265-98d6-bd9ec59cf5f5",
      metadata: {},
      outputs: [],
      source:
        "### cell 2 ###\n\ndf['math score'] = pd.to_numeric(df['math score'], errors='coerce')\ndf['Math_PassStatus'] = np.where(df['math score']<passmark, 'F', 'P')\ndf.Math_PassStatus.value_counts()",
    },
  ],
  metadata: {
    language_info: {
      name: "python",
    },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

const newObj = {
  cells: [
    // {
    //   cell_type: "code",
    //   execution_count: null,
    //   id: "b2c01ea6-5fab-48c5-902c-f8dd39d123b7",
    //   metadata: {},
    //   outputs: [],
    //   source:
    //     "import sys, os\n%load_ext ElasticNotebook\nfrom elastic.core.common.pandas import compare_df, convert_col\nimport pickle",
    // },
    {
      cell_type: "code",
      execution_count: null,
      id: "312de6d6-a0ed-497c-b5f0-362af22f3247",
      metadata: {},
      outputs: [],
      source:
        '%%RecordEvent\n%%RecordEvent\n# \nimport numpy as np\nimport os\nif "IREWR_WITH_MODIN" in os.environ and os.environ["IREWR_WITH_MODIN"] == "True":\n    import os\n    os.environ["MODIN_ENGINE"] = "ray"\n    import ray\n    ray.init(num_cpus=int(os.environ[\'MODIN_CPUS\']), runtime_env={\'env_vars\': {\'__MODIN_AUTOIMPORT_PANDAS__\': \'1\'}})\n    import modin.pandas as pd\nelse:\n    import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\nimport time',
    },
    {
      cell_type: "code",
      execution_count: null,
      id: "b2fcc7cb-7e36-441b-9591-cc8022cc116f",
      metadata: {},
      outputs: [],
      source: "%%RecordEvent\n%%RecordEvent\npassmark = 40",
    },
    {
      cell_type: "code",
      execution_count: null,
      id: "3ef557f5-cdcd-454e-ace9-aeea7f49526f",
      metadata: {},
      outputs: [],
      source:
        '### cell 0 ###\n\ndf = pd.read_csv("./notebooks/spscientist/student-performance-in-exams/input/StudentsPerformance.csv")\nfactor = 1000\ndf = pd.concat([df]*factor)\ndf.info()',
    },
    {
      cell_type: "code",
      execution_count: null,
      id: "f701d749-20da-4ae7-8ee0-8beb3aaefdc5",
      metadata: {},
      outputs: [],
      source: "### cell 1 ###\n\ndf.isna().sum()",
    },
    {
      cell_type: "code",
      execution_count: null,
      id: "0422f079-95e7-41e3-b484-b5d0fb07b01a",
      metadata: {},
      outputs: [],
      source:
        "### cell 2 ###\n\n# Convert once and reuse the result\nconv = pd.to_numeric(df['math score'], errors='coerce')\n\ndf['math score'] = conv\n# Vectorized pass/fail assignment using the pre-computed numeric values\ndf['Math_PassStatus'] = np.where(conv < passmark, 'F', 'P')\n# Display the counts\ndf['Math_PassStatus'].value_counts()",
    },
  ],
  metadata: {
    language_info: {
      name: "python",
    },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

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

    // const diffJsonObj = diffJson(oldObj, newObj);

    return NextResponse.json(
      {
        rewritten_notebook_path:
          "notebooks/spscientist/student-performance-in-exams/src/rewritten_cpu/o4_mini_high.ipynb",
        diff,
        rewritten_notebook_json: rewrittenJson,
        // diffJsonObj,
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
