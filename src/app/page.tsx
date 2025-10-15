'use client';

import Image from "next/image";
import dynamic from 'next/dynamic';

const JupyterComponentNoSSR = dynamic(
  () => import('../components/NotebookComponent'),
  { 
    ssr: false,
    loading: () => <p>Loading Jupyter Component...</p>
  }
);

export default function Home() {
  return (
    <>
      <JupyterComponentNoSSR />
    </>
  );
}
