"use client";
import { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import Image from "next/image";
import "moment/locale/id";
import { noRupiah } from "./helper";
import React from "react";

function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div className="row"></div>
    </>
  );
}

export default Dashboard;
