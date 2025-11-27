/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

"use client";

import {
  useJupyter,
  JupyterReactTheme,
  Notebook2,
  NotebookToolbar,
  CellSidebarExtension,
  CellSidebarButton,
  Button,
} from "@datalayer/jupyter-react";
import { Box } from "@primer/react";
import { PrimerTheme } from "./PrimerTheme";
import { useMemo, useState } from "react";
import { getDiffCells } from "./DiffNotebookComponent";

type INotebookComponentProps = {
  colorMode?: "light" | "dark";
  theme?: PrimerTheme;
};

const NOTEBOOK_PATH =
  "notebooks/spscientist/student-performance-in-exams/src/small_bench_meng_demo.ipynb";

export const NotebookComponent = (props: INotebookComponentProps) => {
  //  const { colorMode, theme } = props;
  const { defaultKernel, serviceManager } = useJupyter({
    jupyterServerUrl: "http://localhost:8888",
    jupyterServerToken: "a5b83a33dbb0ae9449267d629547bc19767aa17fe719069b",
    // jupyterServerUrl: "https://oss.datalayer.run/api/jupyter-server",
    startDefaultKernel: true,
  });
  const extensions = useMemo(
    () => [new CellSidebarExtension({ factory: CellSidebarButton })],
    []
  );
  const [currentNotebookPath, setCurrentNotebookPath] =
    useState<string>(NOTEBOOK_PATH);
  const [isRewriteSuccessful, setIsRewriteSuccessful] =
    useState<boolean>(false);

  const [diff, setDiff] = useState(null);
  const [newNotebookJson, setNewNotebookJson] = useState(null);
  // const [diffJson, setDiffJson] = useState(null);

  return (
    <>
      {defaultKernel && serviceManager ? (
        <>
          <div style={{ fontSize: 20 }}>Welcome to PandaX Notebook!</div>

          <JupyterReactTheme>
            <Box
              sx={{
                width: "100%",
                // let notebook grow naturally
                "& .jp-NotebookPanel": {
                  height: "800px",
                  maxHeight: "800px", // max viewport height
                  width: "100%",
                  overflowY: "auto", // scroll only if content exceeds maxHeight
                },
                "& .jp-Notebook": {
                  flex: "1 1 auto",
                  minHeight: "200px", // minimum height to avoid zero-height
                  overflowY: "auto",
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "24px",
                  width: "100%",
                }}
              >
                {/* Left: Original Notebook */}
                <div style={{ flex: 1, minWidth: "48%" }}>
                  <Notebook2
                    path={NOTEBOOK_PATH}
                    id="notebook-nextjs-1"
                    cellSidebarMargin={120}
                    height="100% !important"
                    kernelId={defaultKernel.id}
                    serviceManager={serviceManager}
                    extensions={extensions}
                    Toolbar={NotebookToolbar}
                    children={
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                          gap: "12px",
                          padding: "12px",
                          backgroundColor: "#f5f5f5",
                          marginBottom: "8px",
                        }}
                      >
                        <p>Orignal notebook path: {NOTEBOOK_PATH}</p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "12px",
                            marginBottom: "8px",
                          }}
                        >
                          <p>PandaX tools:</p>
                          <Button
                            style={{
                              backgroundColor: "#0366d6",
                              color: "#fff",
                              fontWeight: "600",
                              padding: "8px 16px",
                              borderRadius: "6px",
                              border: "none",
                              cursor: "pointer",
                              transition: "all 0.2s ease-in-out",
                            }}
                            onMouseOver={(e) =>
                              !!!isRewriteSuccessful
                                ? (e.currentTarget.style.backgroundColor =
                                    "#0356b6")
                                : null
                            }
                            onMouseOut={(e) =>
                              !!!isRewriteSuccessful
                                ? (e.currentTarget.style.backgroundColor =
                                    "#0366d6")
                                : null
                            }
                            onClick={async () => {
                              try {
                                const res = await fetch("/api/analyze", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    path: currentNotebookPath,
                                  }),
                                });

                                if (!res.ok) throw new Error("API call failed");
                                const newNotebookPath = await res.json();
                                setCurrentNotebookPath(
                                  newNotebookPath.rewritten_notebook_path
                                );
                                setDiff(newNotebookPath.diff);
                                setNewNotebookJson(
                                  newNotebookPath.rewritten_notebook_json
                                );
                                // setDiffJson(newNotebookPath.diffJsonObj);
                                setIsRewriteSuccessful(true);
                              } catch (err) {
                                console.error(err);
                                alert("Failed to optimize notebook");
                              }
                            }}
                          >
                            Run analysis & Show Diff
                          </Button>
                        </div>
                      </div>
                    }
                  />
                </div>
                {isRewriteSuccessful && (
                  <div style={{ flex: 1, minWidth: "48%" }}>
                    <Notebook2
                      path={currentNotebookPath}
                      id="notebook-nextjs-1"
                      cellSidebarMargin={120}
                      height="100% !important"
                      kernelId={defaultKernel.id}
                      serviceManager={serviceManager}
                      extensions={extensions}
                      Toolbar={NotebookToolbar}
                      // children={
                      //   <div>
                      //     <div
                      //       style={{
                      //         display: "flex",
                      //         flexDirection: "column",
                      //         alignItems: "start",
                      //         gap: "12px",
                      //         padding: "12px",
                      //         backgroundColor: "#f5f5f5",
                      //         marginBottom: "8px",
                      //       }}
                      //     >
                      //       <p>
                      //         {isRewriteSuccessful
                      //           ? "Rewritten notebook path:"
                      //           : "Orignal notebook path:"}{" "}
                      //         {currentNotebookPath}
                      //       </p>
                      //       <div
                      //         style={{
                      //           display: "flex",
                      //           alignItems: "center",
                      //           justifyContent: "flex-start",
                      //           gap: "12px",
                      //           marginBottom: "8px",
                      //         }}
                      //       >
                      //         <p>PandaX tools:</p>
                      //         <Button
                      //           style={{
                      //             backgroundColor: isRewriteSuccessful
                      //               ? "#cccccc"
                      //               : "#0366d6", // primary blue
                      //             color: "#fff",
                      //             fontWeight: "600",
                      //             padding: "8px 16px",
                      //             borderRadius: "6px",
                      //             border: "none",
                      //             cursor: "pointer",
                      //             transition: "all 0.2s ease-in-out",
                      //           }}
                      //           onMouseOver={(e) =>
                      //             !!!isRewriteSuccessful
                      //               ? (e.currentTarget.style.backgroundColor =
                      //                   "#0356b6")
                      //               : null
                      //           }
                      //           onMouseOut={(e) =>
                      //             !!!isRewriteSuccessful
                      //               ? (e.currentTarget.style.backgroundColor =
                      //                   "#0366d6")
                      //               : null
                      //           }
                      //           onClick={async () => {
                      //             try {
                      //               const res = await fetch("/api/analyze", {
                      //                 method: "POST",
                      //                 headers: {
                      //                   "Content-Type": "application/json",
                      //                 },
                      //                 body: JSON.stringify({
                      //                   path: currentNotebookPath,
                      //                 }),
                      //               });
                      //               if (!res.ok)
                      //                 throw new Error("API call failed");
                      //               const newNotebookPath = await res.json();
                      //               setCurrentNotebookPath(
                      //                 newNotebookPath.rewritten_notebook_path
                      //               );
                      //               setIsRewriteSuccessful(true);
                      //             } catch (err) {
                      //               console.error(err);
                      //               alert("Failed to optimize notebook");
                      //             }
                      //           }}
                      //           disabled={isRewriteSuccessful}
                      //         >
                      //           {isRewriteSuccessful
                      //             ? "Rewritten notebook"
                      //             : "Run analysis & Show Diff"}
                      //         </Button>
                      //       </div>
                      //     </div>
                      //   </div>
                      // }
                      children={
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          {diff &&
                            getDiffCells(diff, newNotebookJson).map(
                              (cell, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: 6,
                                  }}
                                >
                                  <pre style={{ margin: 0, padding: "4px" }}>
                                    {cell.source}
                                  </pre>
                                </div>
                              )
                            )}
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </Box>
          </JupyterReactTheme>
        </>
      ) : (
        <p>Loading Jupyter Notebook...</p>
      )}
    </>
  );
};

NotebookComponent.defaultProps = {
  colorMode: "light" as "light" | "dark",
  theme: undefined,
};

export default NotebookComponent;
