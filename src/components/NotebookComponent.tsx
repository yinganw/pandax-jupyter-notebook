/*
 * Copyright (c) 2021-2023 Datalayer, Inc.
 *
 * MIT License
 */

'use client'

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

const NOTEBOOK_PATH = "test.ipynb";

export const NotebookComponent = (props: INotebookComponentProps) => {
  //  const { colorMode, theme } = props;
  const { defaultKernel, serviceManager } = useJupyter({
    // jupyterServerUrl: "https://oss.datalayer.run/api/jupyter-server",
    jupyterServerUrl: "http://localhost:8888",
    jupyterServerToken: "9c500efe182a8b089d1dc32c9c3637ecee9fa11a62bd0a09",
    // "60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6",
    startDefaultKernel: true,
  });
  const extensions = useMemo(
    () => [new CellSidebarExtension({ factory: CellSidebarButton })],
    []
  );
  const [analysisResult, setAnalysisResult] = useState<string>("");

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
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "12px",
                      padding: "12px",
                      backgroundColor: "#f5f5f5",
                      marginBottom: "8px",
                    }}
                  >
                    <p>PandaX tools:</p>
                    <Button
                      style={{
                        backgroundColor: "#0366d6", // primary blue
                        color: "#fff",
                        fontWeight: "600",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#0356b6")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#0366d6")
                      }
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/analyze", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              notebookPath: NOTEBOOK_PATH,
                            }),
                          });

                          if (!res.ok) throw new Error("API call failed");

                          const result = await res.json();
                          setAnalysisResult(result);
                        } catch (err) {
                          console.error(err);
                          alert("Failed to optimize notebook");
                        }
                      }}
                    >
                      Run analysis
                    </Button>
                    {analysisResult && <text>{analysisResult}</text>}
                  </div>
                }
              />
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
  colorMode: 'light' as 'light' | 'dark',
  theme: undefined,
};

export default NotebookComponent;
