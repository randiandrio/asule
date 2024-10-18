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

  const option1 = {
    title: {
      text: "World Population",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: "category",
      data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
    },
    series: [
      {
        name: "2011",
        type: "bar",
        data: [18203, 23489, 29034, 104970, 131744, 630230],
      },
      {
        name: "2012",
        type: "bar",
        data: [19325, 23438, 31000, 121594, 134141, 681807],
      },
    ],
  };

  const option2 = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div className="row">
        <div className="col-xl-8 col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Grafik Relawan</h4>
            </div>
            <div className="card-body" style={{ height: "750px" }}>
              <ReactEcharts style={{ height: "700px" }} option={option1} />
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-12">
          <div className="row mx-1">
            <div className="card px-0 pb-3">
              <div className="card-header">
                <h4 className="card-title">Gender Relawan</h4>
              </div>
              <div className="card-body" style={{ height: "300px" }}>
                <ReactEcharts style={{ height: "320px" }} option={option2} />
              </div>
            </div>
            <div className="card px-0 pb-3">
              <div className="card-header">
                <h4 className="card-title">Umur Relawan</h4>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <ReactEcharts style={{ height: "300px" }} option={option2} />
              </div>
            </div>
          </div>
          <div className="row mx-1">
            <div className="card px-0 pb-3">
              <div className="card-header">
                <h4 className="card-title">Gender Relawan</h4>
              </div>
              <div className="card-body" style={{ height: "300px" }}>
                <ReactEcharts style={{ height: "320px" }} option={option2} />
              </div>
            </div>
            <div className="card px-0 pb-3">
              <div className="card-header">
                <h4 className="card-title">Umur Relawan</h4>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <ReactEcharts style={{ height: "300px" }} option={option2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
