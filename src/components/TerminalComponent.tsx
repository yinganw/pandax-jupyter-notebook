import { Terminal, Jupyter } from "@datalayer/jupyter-react";
export const TerminalComponent = () => {
  return (
    <Jupyter
      startDefaultKernel={false}
      terminals
      jupyterServerUrl="http://localhost:8888"
      jupyterServerToken="pandax-local-dev"
    >
      <Terminal colormode="dark" height="800px" />{" "}
    </Jupyter>
  );
};

export default TerminalComponent;
