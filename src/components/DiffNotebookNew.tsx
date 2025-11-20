function jsonDiffToGit(diffJsonObj, filename = "notebook.ipynb") {
  let result = "";
  result += `--- a/${filename}\n`;
  result += `+++ b/${filename}\n`;
  result += `@@ -1 +1 @@\n`;

  for (const part of diffJsonObj) {
    const lines = part.value.split("\n");

    for (let line of lines) {
      if (line === "") continue; // skip empty lines

      if (part.removed) {
        result += `-${line}\n`;
      } else if (part.added) {
        result += `+${line}\n`;
      } else {
        result += ` ${line}\n`;
      }
    }
  }

  return result;
}
