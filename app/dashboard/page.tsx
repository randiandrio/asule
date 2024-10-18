"use client";
import { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import React from "react";

function DashboardPage() {
  const [isLoading1, setLoading1] = useState(true);
  const [isLoading2, setLoading2] = useState(true);
  const [isLoading3, setLoading3] = useState(true);
  const [opt1, setOpt1] = useState({});
  const [opt2, setOpt2] = useState({});
  const [opt3, setOpt3] = useState({});

  const [title, setTitle] = useState("Perbidang");

  useEffect(() => {
    load1(title);
    load2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load1 = async (kelompok: String) => {
    fetch(`/dashboard/api/kelompok/${kelompok}`)
      .then((res) => res.json())
      .then((x) => {
        const option = {
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
            data: x.kelompok,
          },
          series: [
            {
              name: "Usulan",
              type: "bar",
              data: x.usulan,
            },
            {
              name: "Proses",
              type: "bar",
              data: x.proses,
            },
            {
              name: "Diterima",
              type: "bar",
              data: x.terima,
            },
            {
              name: "Ditolak",
              type: "bar",
              data: x.tolak,
            },
          ],
        };
        setOpt1(option);
        setLoading1(false);
      });
  };

  const load2 = async () => {
    fetch(`/dashboard/api/status`)
      .then((res) => res.json())
      .then((x) => {
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
              name: "Status Usulan",
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
              data: x.status,
            },
          ],
        };
        setOpt2(option2);
        setLoading2(false);

        const option3 = {
          tooltip: {
            trigger: "item",
          },

          series: [
            {
              name: "Komponen Belanja",
              type: "pie",
              radius: "80%",
              data: x.komponen,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };

        setOpt3(option3);
        setLoading3(false);
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-xl-7 col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Usulan {title}</h4>
              <div className="col-4">
                <select
                  required
                  className="form-control"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    load1(e.target.value);
                  }}
                >
                  <option value="Perbidang">Usulan Per Bidang</option>
                  <option value="Instalasi">Usulan Per Instalasi</option>
                  <option value="Ruangan">Usulan Per Ruangan</option>
                  <option value="Komponen Belanja">
                    Usulan Per Komponen Belanja
                  </option>
                </select>
              </div>
            </div>
            <div className="card-body" style={{ height: "750px" }}>
              {}
              <ReactEcharts style={{ height: "700px" }} option={opt1} />
            </div>
          </div>
        </div>

        <div className="col-xl-5 col-lg-12">
          <div className="row mx-1">
            <div className="card px-0 pb-3">
              <div className="card-header">
                <h4 className="card-title">Status Usulan</h4>
              </div>
              <div className="card-body" style={{ height: "300px" }}>
                <ReactEcharts style={{ height: "320px" }} option={opt2} />
              </div>
            </div>
            <div className="card px-0 pb-3">
              <div className="card-header">
                <h4 className="card-title">Komponen Belanja</h4>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <ReactEcharts style={{ height: "300px" }} option={opt3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
