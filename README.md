# PandaX-notebook [WIP]

## Getting Started on PandaX notebook

### Install Jupyter server
```bash

pip install jupyter_server
jupyter --paths
jupyter server --generate-config
# run jupyter server to get local server URL and token for jupyter UI in the next step
jupyter server
```
You would see jupyter server log spits out the local URL and token. Save these to use in the next step.

```bash
To access the server, open this file in a browser:
        file:///Users/yinganwang/Library/Jupyter/runtime/jpserver-13723-open.html
    Or copy and paste one of these URLs:
        http://localhost:8888/?token=9c500efe182a8b089d1dc32c9c3637ecee9fa11a62bd0a09
        http://127.0.0.1:8888/?token=9c500efe182a8b089d1dc32c9c3637ecee9fa11a62bd0a09
# So in this case, the url is "http://localhost:8888" and the token is "9c500efe182a8b089d1dc32c9c3637ecee9fa11a62bd0a09"
```

### Set up Jupyter UI

```bash
npm i
```

In `src/components/NotebookComponent.tsx`, update the `useJupyter()` handler to point to the local jupyter server: 

```typescript
const { defaultKernel, serviceManager } = useJupyter({
    jupyterServerUrl: "http://localhost:8888",
    jupyterServerToken: "9c500efe182a8b089d1dc32c9c3637ecee9fa11a62bd0a09",
    startDefaultKernel: true,
  });
```


### Run Jupyter server

In the `pandax-meng` repo's root directory, run
```bash
# Can add notebook_dir to specify a root directory to read files in run_pandax_extension_server.sh
# Make sure to update the directory in run_pandax_extension_server.sh to be your local directory
chmod +x pandax-extension/run_pandax_extension_server.sh
./pandax-extension/run_pandax_jupyter.sh
```

#### Notes on `run_pandax_jupyter.sh`
Please run the script in the `pandax-meng` root server, so that the pandax extension gets access to all files in the repo, including the example notebooks and csv files.

It's also important to pass in ` --NotebookApp.allow_credentials=True` to allow cross-origin requests to the jupyter server. We should look into whether we could consolidate this into one port.

It is important to run `jupyter server` in the `pandax-meng` repo, so that you have access to the example notebook and csv. In the long run, we'd like the user to upload their own notebook.

### Start Jupyter frontend

In this directory, run the development server to start the frontend.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## PandaX notebook demo
click to watch video of the prototype.
[<img width="800" height="805" alt="image" src="https://github.com/user-attachments/assets/f76c8b71-178a-426e-8815-49a13eca10a3" />](https://streamable.com/t57bgp)


## Troubleshooting

If `npm run dev` fails with 
```bash
Syntax error: tailwindcss: /Users/yinganwang/Development/capstone/pandax-jupyter-notebook/node_modules/@jupyterlab/apputils-extension/style/base.css Can't resolve '~react-toastify/dist/ReactToastify.min.css' in '/Users/yinganwang/Development/capstone/pandax-jupyter-notebook/node_modules/@jupyterlab/apputils-extension/style'
```
go to `pandax-jupyter-notebook/node_modules/@jupyterlab/apputils-extension/style/notification.css` and remove the `~` in line 6:

```
@import '~react-toastify/dist/ReactToastify.min.css';
```


using Jupyter UI from 
[![Datalayer](https://assets.datalayer.tech/datalayer-25.svg)](https://datalayer.io)


##  Jupyter UI for Next.js
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Read more on the [documentation website](https://jupyter-ui.datalayer.tech/docs/examples/next-js) (ensure you have tne needed [development environment](https://jupyter-ui.datalayer.tech/docs/develop/setup)).


