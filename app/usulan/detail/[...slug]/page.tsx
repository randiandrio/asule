/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { apiFile, tglJamIndo } from "@/app/helper";
import { NextRequest } from "next/server";
import { useEffect } from "react";
import { useState } from "react";
import Disposisi from "../../action/disposisi";
import Tolak from "../../action/tolak";
import { Lampiran, User } from "@prisma/client";
import { useSession } from "next-auth/react";

const DetailUsulanPage = ({ params }: { params: { slug: string[] } }) => {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any>();
  const [user, setUser] = useState<User>();
  const [disposisi, setDisposisi] = useState<boolean>(true);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    fetch(`/usulan/api/detail/${params.slug[0]}`)
      .then((res) => res.json())
      .then((x) => {
        setData(x.data);
        setUser(x.user);
        setDisposisi(x.disposisi);
        console.log(x);
        setLoading(false);
      });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <div className="row">
          <div className="col-xl-8 col-lg-8">
            <div className="card">
              <div className="card-header flex-wrap" id="default-tab">
                <div>
                  <h4 className="card-title">Detail Usulan</h4>
                </div>
              </div>
              <div className="card-body">
                <table>
                  <tr>
                    <td width={190}>Judul</td>
                    <td width={20}>:</td>
                    <td>{data.judul}</td>
                  </tr>
                  <tr>
                    <td>Diinput Oleh</td>
                    <td>:</td>
                    <td>{data.user.nama}</td>
                  </tr>
                  <tr>
                    <td>Komponen Belanja</td>
                    <td>:</td>
                    <td>{data.komponen.nama}</td>
                  </tr>
                  <tr>
                    <td>Uraian Komponen Belanja</td>
                    <td>:</td>
                    <td>{data.uraian}</td>
                  </tr>
                  <tr>
                    <td>Volume</td>
                    <td>:</td>
                    <td>
                      {data.volume} {data.satuan}
                    </td>
                  </tr>
                  <tr>
                    <td>Spesifikasi</td>
                    <td>:</td>
                    <td>{data.spesifikasi}</td>
                  </tr>
                  <tr>
                    <td>Merk</td>
                    <td>:</td>
                    <td>{data.merk}</td>
                  </tr>
                  <tr>
                    <td>Keterangan</td>
                    <td>:</td>
                    <td>{data.keterangan}</td>
                  </tr>
                  <tr>
                    <td>Landasan Usulan</td>
                    <td>:</td>
                    <td>{data.landasan}</td>
                  </tr>
                </table>

                <h4 className="mt-4">File Lampiran</h4>

                <ul>
                  {data.lampiran.map((x: Lampiran, index: Number) => (
                    <li key={x.id}>
                      <a href={`${apiFile}/${x.nama}`} target="_blank">
                        <h5>Lampiran {Number(index) + 1}</h5>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {session?.user.role == "user" && disposisi && (
                <div className="card-footer">
                  <div className="row">
                    <div className="col-6">
                      <Disposisi
                        reload={reload}
                        id={Number(params.slug[0])}
                        jabatanId={Number(user?.jabatanId)}
                        accPimpinan={data.accPimpinan}
                      />
                    </div>
                    <div className="col-6">
                      <Tolak reload={reload} id={Number(params.slug[0])} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-xl-4 col-lg-4">
            <div className="card">
              <div className="card-header flex-wrap" id="default-tab">
                <div>
                  <h4 className="card-title">Riwayat Disposisi</h4>
                </div>
              </div>
              <div className="card-body">
                <div className="accordion accordion-primary" id="accordion-one">
                  {data.disposisi.map(
                    (x: any, index: Number) =>
                      Number(index) > 0 && (
                        <div key={x.id} className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className={
                                data.disposisi.length - 1 == Number(index)
                                  ? "accordion-button"
                                  : "accordion-button collapsed"
                              }
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#default-collapse-${x.id}`}
                              aria-expanded="true"
                              aria-controls={`default-collapse-${x.id}`}
                            >
                              {Number(index)}. {x.user.nama}
                            </button>
                          </h2>
                          <div
                            id={`default-collapse-${x.id}`}
                            className={
                              data.disposisi.length - 1 == Number(index)
                                ? "accordion-collapse collapse show"
                                : "accordion-collapse collapse"
                            }
                            data-bs-parent="#accordion-one"
                          >
                            <div className="accordion-body">
                              <table>
                                <tr>
                                  <td width={120}>Tgl. Diterima</td>
                                  <td width={20}>:</td>
                                  <td>{tglJamIndo(x.createdAt)}</td>
                                </tr>
                                <tr>
                                  <td>Tgl. Response</td>
                                  <td>:</td>
                                  <td>
                                    {x.status > 0
                                      ? tglJamIndo(x.updatedAt)
                                      : "Menunggu Response"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Nama</td>
                                  <td>:</td>
                                  <td>{x.user.nama}</td>
                                </tr>
                                <tr>
                                  <td>Jabatan</td>
                                  <td>:</td>
                                  <td>{x.user.jabatan.nama}</td>
                                </tr>
                                <tr>
                                  <td>Status</td>
                                  <td>:</td>
                                  <td>
                                    {x.status > 0
                                      ? "Telah Diresponse"
                                      : "Menunggu Response"}
                                  </td>
                                </tr>

                                <tr>
                                  <td>Keterangan</td>
                                  <td>:</td>
                                  <td>
                                    {x.ditolak > 0
                                      ? "Ditolak"
                                      : x.status > 0
                                      ? "Diterima"
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Catatan</td>
                                  <td>:</td>
                                  <td>{x.catatan == "" ? "" : x.catatan}</td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUsulanPage;
