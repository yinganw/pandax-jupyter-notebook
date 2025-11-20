const renderSourceDiff = (cellDiff: any) => {
  // If the diff is an addrange, just show added code in green
  if (cellDiff.op === "addrange") {
    return cellDiff.valuelist.map((c: any) => (
      <pre
        key={c.id}
        style={{ backgroundColor: "#d4fcdc", margin: 0, padding: "4px" }}
      >
        {/* {c.source.join("")} */}
        {c.source}
      </pre>
    ));
  }

  // If patch, recursively highlight added/removed lines
  if (cellDiff.op === "patch" && cellDiff.diff) {
    return cellDiff.diff
      .filter((chunk: any) => chunk.key !== "id")
      .map((chunk: any, i: number) => {
        switch (chunk.op) {
          case "addrange":
            return (
              <pre
                key={i}
                style={{
                  backgroundColor: "#d4fcdc",
                  margin: 0,
                  padding: "4px",
                }}
              >
                {Array.isArray(chunk.valuelist)
                  ? chunk.valuelist
                      .map((c) => c.source?.join("") ?? "")
                      .join("\n")
                  : chunk.valuelist?.toString()}
              </pre>
            );
          case "removerange":
            return (
              <pre
                key={i}
                style={{ backgroundColor: "#fdd", margin: 0, padding: "4px" }}
              >
                {Array.isArray(chunk.valuelist)
                  ? chunk.valuelist
                      .map((c) => c.source?.join("") ?? "")
                      .join("\n")
                  : chunk.valuelist?.toString()}
              </pre>
            );
          case "replace":
            return (
              <pre
                key={i}
                style={{ backgroundColor: "#ffd", margin: 0, padding: "4px" }}
              >
                {chunk.value}
              </pre>
            );
          case "patch":
            return renderSourceDiff(chunk);
          default:
            return null;
        }
      });
  }

  return null;
};

export const getDiffCells = (diff: any, rewrittenNotebookJson: any) => {
  const cells: any[] = [];
  if (!Array.isArray(diff) || diff.length === 0) return cells;

  const cellRoot = diff.find((entry: any) => entry.key === "cells");
  if (!cellRoot || !Array.isArray(cellRoot.diff)) return cells;

  // preprocess cells by removing the first cell
  // const processedNotebook = rewrittenNotebookJson.shift();
  cellRoot.diff.forEach((cellOp: any) => {
    if (cellOp.key === "id") return;

    // 1. Render diff
    const diffNode = renderSourceDiff(cellOp);

    // 2. Get the updated/new notebook cell
    const newCell = rewrittenNotebookJson.cells[cellOp.key];
    // rewrittenNotebookJson.cells?.find((c: any) => c.id === cellOp.key) ?? null;

    const newSource = newCell?.source ?? [""];

    // 3. Create both diff + new code
    const combined = [
      // diff may return array or single element
      ...(Array.isArray(diffNode) ? diffNode : diffNode ? [diffNode] : []),

      // new code display block
      <pre
        key="final"
        style={{
          backgroundColor: "#eef",
          margin: 0,
          padding: "4px",
          borderTop: "1px solid #ccc",
        }}
      >
        {Array.isArray(newSource) ? newSource.join("") : newSource}
      </pre>,
    ];

    cells.push({
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: combined,
    });
  });

  return cells;
};

// export const getDiffCells = (diff: any) => {
//   const cells: any[] = [];
//   console.log("diff check", !Array.isArray(diff) || diff.length === 0);
//   if (!Array.isArray(diff) || diff.length === 0) return cells;

//   // Find the "cells" diff entry (usually index 0)
//   const cellRoot = diff.find((entry: any) => entry.key === "cells");
//   if (!cellRoot || !Array.isArray(cellRoot.diff)) return cells;

//   cellRoot.diff.forEach((cellOp: any) => {
//     console.log("each cellOp", cellOp);
//     if (cellOp.key === "id") return;
//     const sourceNode = renderSourceDiff(cellOp);

//     cells.push({
//       cell_type: "code",
//       execution_count: null,
//       metadata: {},
//       outputs: [],
//       source: sourceNode || [""],
//     });
//   });

//   return cells;
// };
