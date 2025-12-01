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

type INotebookComponentProps = {
  colorMode?: "light" | "dark";
  theme?: PrimerTheme;
};

const NOTEBOOK_PATH =
  "./notebooks/spscientist/student-performance-in-exams/src/small_bench_meng.ipynb";

export const NotebookComponent = (props: INotebookComponentProps) => {
  const { defaultKernel, serviceManager } = useJupyter({
    jupyterServerUrl: "http://localhost:8888",
    jupyterServerToken: "pandax-local-dev",
    // jupyterServerUrl: "https://oss.datalayer.run/api/jupyter-server",
    startDefaultKernel: true,
  });
  console.log("defaultKernel", defaultKernel);
  const extensions = useMemo(
    () => [new CellSidebarExtension({ factory: CellSidebarButton })],
    []
  );
  const [currentNotebookPath, setCurrentNotebookPath] =
    useState<string>(NOTEBOOK_PATH);
  const [startCellIdx, setStartCellIdx] = useState<number | "">(0);
  const [numRewriteTries, setNumRewriteTries] = useState<number | "">(2);
  const [isRewriteSuccessful, setIsRewriteSuccessful] =
    useState<boolean>(false);
  const [originalExecutionTime, setOriginalExecutionTime] = useState(null);
  const [rewrittenExecutionTime, setRewrittenExecutionTime] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isOptimizeButtonDisabled =
    isLoading || startCellIdx === "" || numRewriteTries === "";

  const handleOnClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // startIdx:
        body: JSON.stringify({
          path: currentNotebookPath,
          startCellIdx,
          numRewriteTries,
        }),
      });

      if (!res.ok) throw new Error("API call failed");

      const data = await res.json();
      setCurrentNotebookPath(data.rewritten_notebook_path);
      setOriginalExecutionTime(data.original_execution_times);
      setRewrittenExecutionTime(data.rewritten_execution_times);
      setIsRewriteSuccessful(true);
    } catch (err) {
      console.error(err);
      alert("Failed to optimize notebook");
    } finally {
      setIsLoading(false);
    }
  };

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
                    id="original-notebook"
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
                            flexDirection: "column",
                            alignItems: "start",
                            gap: "12px",
                            marginBottom: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexFlow: "center",
                              justifyContent: "flex-start",
                              gap: "12px",
                              marginBottom: "8px",
                            }}
                          >
                            <label>
                              Start Optimizing from Cell Index:
                              <input
                                type="number"
                                value={startCellIdx}
                                onChange={(e) => {
                                  if (e.target.value === "") {
                                    setStartCellIdx(e.target.value);
                                  } else {
                                    setStartCellIdx(Number(e.target.value));
                                  }
                                }}
                                style={{
                                  marginLeft: "8px",
                                  width: "80px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                  padding: "4px 6px",
                                }}
                              />
                            </label>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexFlow: "center",
                              justifyContent: "flex-start",
                              gap: "12px",
                              marginBottom: "8px",
                            }}
                          >
                            <label>
                              Number of tries for each rewrite step:
                              <input
                                type="number"
                                value={numRewriteTries}
                                onChange={(e) => {
                                  if (e.target.value === "") {
                                    setNumRewriteTries(e.target.value);
                                  } else {
                                    setNumRewriteTries(Number(e.target.value));
                                  }
                                }}
                                style={{
                                  marginLeft: "8px",
                                  width: "80px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                  padding: "4px 6px",
                                }}
                              />
                            </label>
                          </div>
                          <Button
                            style={{
                              backgroundColor: isOptimizeButtonDisabled
                                ? "#cccccc"
                                : "#0366d6",
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
                                    isOptimizeButtonDisabled
                                      ? "#cccccc"
                                      : "#0356b6")
                                : null
                            }
                            onMouseOut={(e) =>
                              !!!isRewriteSuccessful
                                ? (e.currentTarget.style.backgroundColor =
                                    isOptimizeButtonDisabled
                                      ? "#cccccc"
                                      : "#0356b6")
                                : null
                            }
                            onClick={handleOnClick}
                            disabled={isOptimizeButtonDisabled}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-2 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                  ></path>
                                </svg>
                                <p>Optimizing...</p>
                              </div>
                            ) : (
                              "Optimize Notebook"
                            )}
                          </Button>
                        </div>
                        {originalExecutionTime && (
                          <div>
                            <div>
                              {Object.keys(originalExecutionTime)
                                .filter((key) => key !== "total")
                                .map((key) => {
                                  const original = originalExecutionTime[key];

                                  return (
                                    <p key={key}>
                                      Cell {key}: {original} ms
                                    </p>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    }
                  />
                </div>
                {isRewriteSuccessful && (
                  <div style={{ flex: 1, minWidth: "48%" }}>
                    <Notebook2
                      path={currentNotebookPath}
                      id="rewritten-notebook"
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
                          <p>
                            {isRewriteSuccessful
                              ? "Rewritten notebook path:"
                              : "Orignal notebook path:"}{" "}
                            {currentNotebookPath}
                          </p>
                          {rewrittenExecutionTime && (
                            <div>
                              {originalExecutionTime &&
                                Object.keys(rewrittenExecutionTime)
                                  .filter((key) => key !== "total")
                                  .map((key) => {
                                    const rewritten =
                                      rewrittenExecutionTime[key];
                                    const original = originalExecutionTime[key];

                                    return (
                                      <p key={key}>
                                        Cell {key}: went from {original} ms to{" "}
                                        {rewritten} ms after rewriting
                                      </p>
                                    );
                                  })}
                            </div>
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
