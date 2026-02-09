"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "./page.module.scss";

const Converter = dynamic(() => import("@/app/Converter"), { ssr: false });

export default function Home() {
  return (
    <main className={styles.main}>
      <header>
        <h1>HTTP-TO</h1>
        <p>HTTP request converter</p>
      </header>
      <div style={{ maxWidth: "100%" }}>
        <Converter />
      </div>
      <footer>
        <Link href="https://github.com/alfredosalzillo/http-to">github</Link>
      </footer>
    </main>
  );
}
