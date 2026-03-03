import React, { useEffect, useState } from "react";

interface LichHoc {
  id: number;
  ngayGio: string;
  thoiLuong: number;
  noiDung: string;
  ghiChu: string;
}

interface MonHoc {
  id: number;
  tenMon: string;
  mucTieuThang: number;
  danhSachLich: LichHoc[];
}

const QuanLyTienDo: React.FC = () => {
  const [danhSachMon, setDanhSachMon] = useState<MonHoc[]>([]);
  const [tenMonMoi, setTenMonMoi] = useState("");

  const [idDangSuaMon, setIdDangSuaMon] = useState<number | null>(null);
  const [tenMonDangSua, setTenMonDangSua] = useState("");

  const [lichDangNhap, setLichDangNhap] = useState<{ [key: number]: LichHoc }>({});
  const [idFormThemLich, setIdFormThemLich] = useState<number | null>(null);
  const [idDangSuaLich, setIdDangSuaLich] = useState<number | null>(null);


  useEffect(() => {
    const duLieu = localStorage.getItem("quanLyHocTap");
    if (duLieu) setDanhSachMon(JSON.parse(duLieu));
  }, []);

  useEffect(() => {
    localStorage.setItem("quanLyHocTap", JSON.stringify(danhSachMon));
  }, [danhSachMon]);


  const themMonHoc = () => {
    if (!tenMonMoi.trim()) return;
    const monMoi: MonHoc = {
      id: Date.now(),
      tenMon: tenMonMoi,
      mucTieuThang: 0,
      danhSachLich: [],
    };
    setDanhSachMon([...danhSachMon, monMoi]);
    setTenMonMoi("");
  };

  const xoaMon = (id: number) => {
    setDanhSachMon(danhSachMon.filter((mon) => mon.id !== id));
  };

  const batDauSuaMon = (mon: MonHoc) => {
    setIdDangSuaMon(mon.id);
    setTenMonDangSua(mon.tenMon);
  };

  const luuSuaMon = (id: number) => {
    setDanhSachMon(
      danhSachMon.map((mon) =>
        mon.id === id ? { ...mon, tenMon: tenMonDangSua } : mon
      )
    );
    setIdDangSuaMon(null);
  };

  const datMucTieu = (id: number, soGio: number) => {
    setDanhSachMon(
      danhSachMon.map((mon) =>
        mon.id === id ? { ...mon, mucTieuThang: soGio } : mon
      )
    );
  };


  const capNhatInputLich = (idMon: number, truong: keyof LichHoc, giaTri: any) => {
    setLichDangNhap({
      ...lichDangNhap,
      [idMon]: { ...lichDangNhap[idMon], [truong]: giaTri },
    });
  };

  const moFormThemLich = (idMon: number) => {
    setIdFormThemLich(idMon);
    setLichDangNhap({ ...lichDangNhap, [idMon]: {} as LichHoc });
  };

  const themLichHoc = (idMon: number) => {
    const lich = lichDangNhap[idMon];
    if (!lich?.ngayGio || !lich?.thoiLuong) return;

    const lichMoi: LichHoc = { ...lich, id: Date.now() };

    setDanhSachMon(
      danhSachMon.map((mon) =>
        mon.id === idMon
          ? { ...mon, danhSachLich: [...mon.danhSachLich, lichMoi] }
          : mon
      )
    );

    setLichDangNhap({ ...lichDangNhap, [idMon]: {} as LichHoc });
    setIdFormThemLich(null);
  };

  const xoaLich = (idMon: number, idLich: number) => {
    setDanhSachMon(
      danhSachMon.map((mon) =>
        mon.id === idMon
          ? { ...mon, danhSachLich: mon.danhSachLich.filter((lich) => lich.id !== idLich) }
          : mon
      )
    );
  };

  const batDauSuaLich = (idLich: number) => setIdDangSuaLich(idLich);

  const luuSuaLich = (idMon: number, lichSua: LichHoc) => {
    setDanhSachMon(
      danhSachMon.map((mon) =>
        mon.id === idMon
          ? {
              ...mon,
              danhSachLich: mon.danhSachLich.map((lich) => (lich.id === lichSua.id ? lichSua : lich)),
            }
          : mon
      )
    );
    setIdDangSuaLich(null);
  };

  const tinhTongGioThang = (mon: MonHoc) => {
    const thang = new Date().getMonth();
    const nam = new Date().getFullYear();
    return mon.danhSachLich
      .filter((lich) => {
        const ngay = new Date(lich.ngayGio);
        return ngay.getMonth() === thang && ngay.getFullYear() === nam;
      })
      .reduce((tong, lich) => tong + lich.thoiLuong, 0);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản Lý Học Tập</h1>

      <h2>Thêm môn học</h2>
      <input
        value={tenMonMoi}
        onChange={(e) => setTenMonMoi(e.target.value)}
        placeholder="Tên môn học"
      />
      <button onClick={themMonHoc} style={{ marginLeft: 10 }}>Thêm</button>
      <hr />

      {danhSachMon.map((mon) => {
        const tongGio = tinhTongGioThang(mon);
        const daDat = tongGio >= mon.mucTieuThang;

        return (
          <div key={mon.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
            {idDangSuaMon === mon.id ? (
              <>
                <input
                  value={tenMonDangSua}
                  onChange={(e) => setTenMonDangSua(e.target.value)}
                />
                <button onClick={() => luuSuaMon(mon.id)}>Lưu</button>
              </>
            ) : (
              <>
                <h2>{mon.tenMon}</h2>
                <button onClick={() => batDauSuaMon(mon)}>Sửa môn</button>
              </>
            )}
            <button onClick={() => xoaMon(mon.id)} style={{ marginLeft: 10 }}>Xoá môn</button>

            
            <h3>Mục tiêu tháng:</h3>
            <input
              type="number"
              defaultValue={mon.mucTieuThang}
              onBlur={(e) => datMucTieu(mon.id, Number(e.target.value))}
            />
            <p>Tổng giờ tháng: {tongGio}</p>
            <p>Trạng thái: {daDat ? "Đã đạt" : "Chưa đạt"}</p>
            <hr />

            {idFormThemLich === mon.id ? (
              <div style={{ margin: "10px 0", padding: 10, border: "2px dashed gray" }}>
                <h4>Thêm lịch học cho {mon.tenMon}</h4>
                <input
                  type="datetime-local"
                  value={lichDangNhap[mon.id]?.ngayGio || ""}
                  onChange={(e) => capNhatInputLich(mon.id, "ngayGio", e.target.value)}
                  style={{ marginBottom: 10, display: "block" }}
                />
                <input
                  type="number"
                  placeholder="Thời lượng (giờ)"
                  value={lichDangNhap[mon.id]?.thoiLuong || ""}
                  onChange={(e) => capNhatInputLich(mon.id, "thoiLuong", Number(e.target.value))}
                  style={{ marginBottom: 10, display: "block" }}
                />
                <input
                  placeholder="Nội dung"
                  value={lichDangNhap[mon.id]?.noiDung || ""}
                  onChange={(e) => capNhatInputLich(mon.id, "noiDung", e.target.value)}
                  style={{ marginBottom: 10, display: "block" }}
                />
                <input
                  placeholder="Ghi chú"
                  value={lichDangNhap[mon.id]?.ghiChu || ""}
                  onChange={(e) => capNhatInputLich(mon.id, "ghiChu", e.target.value)}
                  style={{ marginBottom: 10, display: "block" }}
                />
                <button onClick={() => themLichHoc(mon.id)} style={{ marginLeft: 10 }}>Lưu lịch</button>
                <button onClick={() => setIdFormThemLich(null)} style={{ marginLeft: 5 }}>Huỷ</button>
              </div>
            ) : (
              <button onClick={() => moFormThemLich(mon.id)}>Thêm lịch</button>
            )}

            
            <ul>
              {mon.danhSachLich.map((lich) => (
                <li key={lich.id} style={{ marginBottom: 5 }}>
                  {idDangSuaLich === lich.id ? (
                    <div style={{ border: "1px solid #aaa", padding: 5 }}>
                      <input
                        type="datetime-local"
                        value={lich.ngayGio}
                        onChange={(e) =>
                          luuSuaLich(mon.id, { ...lich, ngayGio: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        placeholder="Thời lượng (giờ)"
                        value={lich.thoiLuong}
                        onChange={(e) =>
                          luuSuaLich(mon.id, { ...lich, thoiLuong: Number(e.target.value) })
                        }
                      />
                      <input
                        placeholder="Nội dung"
                        value={lich.noiDung}
                        onChange={(e) =>
                          luuSuaLich(mon.id, { ...lich, noiDung: e.target.value })
                        }
                      />
                      <input
                        placeholder="Ghi chú"
                        value={lich.ghiChu}
                        onChange={(e) =>
                          luuSuaLich(mon.id, { ...lich, ghiChu: e.target.value })
                        }
                      />
                      <button onClick={() => setIdDangSuaLich(null)}>Lưu xong</button>
                    </div>
                  ) : (
                    <>
                      Ngày giờ: {lich.ngayGio}  |  Thòi lượng: {lich.thoiLuong}h  |  Nội dung: {lich.noiDung}  |  Ghi chú: {lich.ghiChu}
                      <button onClick={() => batDauSuaLich(lich.id)} style={{ marginLeft: 10 }}>Sửa</button>
                      <button onClick={() => xoaLich(mon.id, lich.id)} style={{ marginLeft: 5 }}>Xoá</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default QuanLyTienDo;