import { useState } from "react";
import { Button, Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";

const { Title, Text } = Typography;

type LuaChon = "Kéo" | "Búa" | "Bao";
type KetQua = "Thắng" | "Thua" | "Hòa";

const danhSachLuaChon: LuaChon[] = ["Kéo", "Búa", "Bao"];

const tinhKetQua = (nguoiChoi: LuaChon, mayTinh: LuaChon): KetQua => {
  if (nguoiChoi === mayTinh) return "Hòa";
  if (
    (nguoiChoi === "Kéo" && mayTinh === "Bao") ||
    (nguoiChoi === "Búa" && mayTinh === "Kéo") ||
    (nguoiChoi === "Bao" && mayTinh === "Búa")
  )
    return "Thắng";
  return "Thua";
};

const mauKetQua: Record<KetQua, string> = {
  Thắng: "success",
  Thua: "error",
  Hòa: "default",
};

interface DongLichSu {
  key: number;
  soVan: number;
  nguoiChoi: LuaChon;
  mayTinh: LuaChon;
  ketQua: KetQua;
}

export default function TroChoiOanTuTi() {
  const [lichSu, setLichSu] = useState<DongLichSu[]>([]);
  const [vanVuaRoi, setVanVuaRoi] = useState<DongLichSu | null>(null);
  const [thongKe, setThongKe] = useState({ soLanThang: 0, soLanThua: 0, soLanHoa: 0 });

  const batDauChoi = (luaChonNguoiChoi: LuaChon) => {
    const luaChonMay = danhSachLuaChon[Math.floor(Math.random() * 3)];
    const ketQua = tinhKetQua(luaChonNguoiChoi, luaChonMay);
    const soVan = lichSu.length + 1;
    const dongMoi: DongLichSu = { key: soVan, soVan, nguoiChoi: luaChonNguoiChoi, mayTinh: luaChonMay, ketQua };
    setVanVuaRoi(dongMoi);
    setLichSu((truoc) => [dongMoi, ...truoc]);
    setThongKe((cu) => ({
      soLanThang: cu.soLanThang + (ketQua === "Thắng" ? 1 : 0),
      soLanThua: cu.soLanThua + (ketQua === "Thua" ? 1 : 0),
      soLanHoa: cu.soLanHoa + (ketQua === "Hòa" ? 1 : 0),
    }));
  };

  const xoaLichSu = () => {
    setLichSu([]);
    setThongKe({ soLanThang: 0, soLanThua: 0, soLanHoa: 0 });
    setVanVuaRoi(null);
  };

  const columns = [
    { title: "Ván", dataIndex: "soVan", width: 60 },
    { title: "Bạn", dataIndex: "nguoiChoi" },
    { title: "Máy", dataIndex: "mayTinh" },
    {
      title: "Kết quả",
      dataIndex: "ketQua",
      render: (v: KetQua) => <Tag color={mauKetQua[v]}>{v}</Tag>,
    },
  ];

  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 16px" }}>
      <Title level={2} style={{ textAlign: "center" }}>Oẳn Tù Tì</Title>

      <Card style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={4}>Chọn của bạn</Title>
        <Row gutter={16} justify="center">
          {danhSachLuaChon.map((luaChon) => (
            <Col key={luaChon}>
              <Button size="large" onClick={() => batDauChoi(luaChon)} style={{ fontSize: 20, height: 72, width: 90 }}>
                {luaChon}
              </Button>
            </Col>
          ))}
        </Row>
      </Card>

      {vanVuaRoi && (
        <Card style={{ textAlign: "center", marginBottom: 24 }}>
          <Row justify="center" align="middle" gutter={24}>
            <Col>
              <Text style={{ fontSize: 16 }}>Bạn</Text>
              <div style={{ fontSize: 32 }}>{vanVuaRoi.nguoiChoi}</div>
            </Col>
            <Col>
              <Text style={{ fontSize: 28 }}>VS</Text>
            </Col>
            <Col>
              <Text style={{ fontSize: 16 }}>Máy</Text>
              <div style={{ fontSize: 32 }}>{vanVuaRoi.mayTinh}</div>
            </Col>
          </Row>
          <Tag color={mauKetQua[vanVuaRoi.ketQua]} style={{ marginTop: 12, fontSize: 18, padding: "4px 20px" }}>
            {vanVuaRoi.ketQua === "Thắng" ? "Bạn thắng!" : vanVuaRoi.ketQua === "Thua" ? "Bạn thua!" : "Hòa!"}
          </Tag>
        </Card>
      )}

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}><Card><Statistic title="Thắng" value={thongKe.soLanThang} valueStyle={{ color: "#52c41a" }} /></Card></Col>
        <Col span={8}><Card><Statistic title="Thua" value={thongKe.soLanThua} valueStyle={{ color: "#ff4d4f" }} /></Card></Col>
        <Col span={8}><Card><Statistic title="Hòa" value={thongKe.soLanHoa} /></Card></Col>
      </Row>

      {lichSu.length > 0 && (
        <Card title="Lịch sử" extra={<Button size="small" onClick={xoaLichSu}>Xóa</Button>}>
          <Table dataSource={lichSu} columns={columns} pagination={{ pageSize: 5 }} size="small" />
        </Card>
      )}
    </div>
  );
}