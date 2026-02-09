"use client";

import dynamic from "next/dynamic";

const Converter = dynamic(() => import("@/app/Converter"), { ssr: false });

const Home = () => (
  <Converter />
);

export default Home;
