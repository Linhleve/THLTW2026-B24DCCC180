import React, { useEffect, useState } from "react";
import { Input, InputNumber, Button, List, Divider, Card, Space, message } from "antd";
import "antd/dist/antd.css";

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
    if (!tenMonMoi.trim()) {
      message.warning("Vui lòng nhập tên môn học");
      return;
    }
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
    message.success("Đã lưu môn học");
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
    setLichDangNhap({
      ...lichDangNhap,
      [idMon]: { id: 0, ngayGio: "", thoiLuong: 0, noiDung: "", ghiChu: "" },
    });
  };

  const themLichHoc = (idMon: number) => {
    const lich = lichDangNhap[idMon];
    if (!lich?.ngayGio || lich.thoiLuong <= 0) {
      message.warning("Vui lòng nhập đầy đủ ngày giờ và thời lượng > 0");
      return;
    }

    const lichMoi: LichHoc = { ...lich, id: Date.now() };

    setDanhSachMon(
      danhSachMon.map((mon) =>
        mon.id === idMon
          ? { ...mon, danhSachLich: [...mon.danhSachLich, lichMoi] }
          : mon
      )
    );

    setLichDangNhap({
      ...lichDangNhap,
      [idMon]: { id: 0, ngayGio: "", thoiLuong: 0, noiDung: "", ghiChu: "" },
    });
    setIdFormThemLich(null);
    message.success("Đã thêm lịch học");
  };

  const xoaLich = (idMon: number, idLich: number) => {
    setDanhSachMon(
      danhSachMon.map((mon) =>
        mon.id === idMon
          ? { ...mon, danhSachLich: mon.danhSachLich.filter((lich) => lich.id !== idLich) }
          : mon
      )
    );
    message.info("Đã xóa lịch học");
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
    message.success("Đã lưu lịch học");
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
      <h1> Quản Lý Học Tập</h1>

      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="Tên môn học"
          value={tenMonMoi}
          onChange={(e) => setTenMonMoi(e.target.value)}
        />
        <Button type="primary" onClick={themMonHoc}>Thêm môn</Button>
      </Space>

      <Divider />

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={danhSachMon}
        renderItem={(mon) => {
          const tongGio = tinhTongGioThang(mon);
          const daDat = tongGio >= mon.mucTieuThang;

          return (
            <List.Item>
              <Card title={
                idDangSuaMon === mon.id ? (
                  <Space>
                    <Input value={tenMonDangSua} onChange={(e) => setTenMonDangSua(e.target.value)} />
                    <Button type="primary" onClick={() => luuSuaMon(mon.id)}>Lưu</Button>
                  </Space>
                ) : mon.tenMon
              }>
                <Space style={{ marginBottom: 10 }}>
                  <Button onClick={() => batDauSuaMon(mon)}>Sửa môn</Button>
                  <Button danger onClick={() => xoaMon(mon.id)}>Xóa môn</Button>
                </Space>

                <div style={{ marginBottom: 10 }}>
                <span>Mục tiêu tháng: </span>
                <InputNumber
                    min={0}
                    value={mon.mucTieuThang}
                    onChange={(value) => datMucTieu(mon.id, Number(value))}
                /> giờ
                <div>Tổng giờ tháng: {tongGio}h</div>
                <div>Trạng thái: {tongGio >= mon.mucTieuThang ? "Đã đạt ✅" : "Chưa đạt ❌"}</div>
                </div>

              
                {idFormThemLich === mon.id ? (
                  <Card type="inner" style={{ marginBottom: 10 }}>
                    <Space direction="vertical">
                      <Input
                        type="datetime-local"
                        value={lichDangNhap[mon.id]?.ngayGio || ""}
                        onChange={(e) => capNhatInputLich(mon.id, "ngayGio", e.target.value)}
                      />
                      <InputNumber
                        min={0}
                        placeholder="Thời lượng (giờ)"
                        value={lichDangNhap[mon.id]?.thoiLuong || ""}
                        onChange={(value) => capNhatInputLich(mon.id, "thoiLuong", Number(value))}
                      />
                      <Input
                        placeholder="Nội dung"
                        value={lichDangNhap[mon.id]?.noiDung || ""}
                        onChange={(e) => capNhatInputLich(mon.id, "noiDung", e.target.value)}
                      />
                      <Input
                        placeholder="Ghi chú"
                        value={lichDangNhap[mon.id]?.ghiChu || ""}
                        onChange={(e) => capNhatInputLich(mon.id, "ghiChu", e.target.value)}
                      />
                      <Space>
                        <Button type="primary" onClick={() => themLichHoc(mon.id)}>Lưu lịch</Button>
                        <Button onClick={() => setIdFormThemLich(null)}>Huỷ</Button>
                      </Space>
                    </Space>
                  </Card>
                ) : (
                  <Button type="dashed" onClick={() => moFormThemLich(mon.id)}>Thêm lịch</Button>
                )}

                
                <List
                  size="small"
                  dataSource={mon.danhSachLich}
                  renderItem={(lich) => (
                    <List.Item>
                      {idDangSuaLich === lich.id ? (
                        <Space direction="vertical">
                          <Input
                            type="datetime-local"
                            value={lich.ngayGio}
                            onChange={(e) => luuSuaLich(mon.id, { ...lich, ngayGio: e.target.value })}
                          />
                          <InputNumber
                            min={0}
                            value={lich.thoiLuong}
                            onChange={(value) => luuSuaLich(mon.id, { ...lich, thoiLuong: Number(value) })}
                          />
                          <Input
                            value={lich.noiDung}
                            onChange={(e) => luuSuaLich(mon.id, { ...lich, noiDung: e.target.value })}
                          />
                          <Input
                            value={lich.ghiChu}
                            onChange={(e) => luuSuaLich(mon.id, { ...lich, ghiChu: e.target.value })}
                          />
                          <Button type="primary" onClick={() => setIdDangSuaLich(null)}>Lưu xong</Button>
                        </Space>
                      ) : (
                        <>
                          Ngày giờ: {lich.ngayGio} | Thời lượng: {lich.thoiLuong}h | Nội dung: {lich.noiDung} | Ghi chú: {lich.ghiChu}
                          <Space>
                            <Button onClick={() => batDauSuaLich(lich.id)}>Sửa</Button>
                            <Button danger onClick={() => xoaLich(mon.id, lich.id)}>Xóa</Button>
                          </Space>
                        </>
                      )}
                    </List.Item>
                  )}
                />
              </Card>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default QuanLyTienDo;