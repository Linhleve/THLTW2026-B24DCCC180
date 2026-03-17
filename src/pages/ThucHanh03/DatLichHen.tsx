import React, { useState, useMemo } from "react";
import "antd/dist/antd.css";
import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  TimePicker,
  Select,
  DatePicker,
  message,
  Space,
  Rate,
} from "antd";
import moment from "moment";

const { TabPane } = Tabs;
const { Option } = Select;

interface NhanVien {
  id: number;
  ten: string;
  soKhachMoiNgay: number;
  gioLamViec: { batDau: string; ketThuc: string };
}

interface DichVu {
  id: number;
  ten: string;
  gia: number;
  thoiGian: number;
}

interface LichHen {
  id: number;
  nhanVienId: number;
  dichVuId: number;
  ngay: string;
  gio: string;
  trangThai: string;
  danhGia?: number;
  phanHoi?: string;
}

const DatLichHen: React.FC = () => {
  const [dsNhanVien, setDsNhanVien] = useState<NhanVien[]>([]);
  const [dsDichVu, setDsDichVu] = useState<DichVu[]>([]);
  const [dsLichHen, setDsLichHen] = useState<LichHen[]>([]);

  const [modalNVVisible, setModalNVVisible] = useState(false);
  const [nvSua, setNvSua] = useState<NhanVien | null>(null);
  const [modalDVVisible, setModalDVVisible] = useState(false);
  const [dvSua, setDvSua] = useState<DichVu | null>(null);

  const [formNV] = Form.useForm();
  const [formDV] = Form.useForm();
  const [formLH] = Form.useForm();
  const [formDanhGia] = Form.useForm();

  const TRANG_THAI = {
    CHO_DUYET: "Chờ duyệt",
    XAC_NHAN: "Xác nhận",
    HOAN_THANH: "Hoàn thành",
    HUY: "Hủy",
  };

  const hienThiModalNV = (nv?: NhanVien) => {
    setNvSua(nv || null);
    formNV.setFieldsValue(
      nv
        ? {
            ten: nv.ten,
            soKhachMoiNgay: nv.soKhachMoiNgay,
            gioLamViec: [
              moment(nv.gioLamViec.batDau, "HH:mm"),
              moment(nv.gioLamViec.ketThuc, "HH:mm"),
            ],
          }
        : {
            ten: "",
            soKhachMoiNgay: 1,
            gioLamViec: [moment("09:00", "HH:mm"), moment("17:00", "HH:mm")],
          }
    );
    setModalNVVisible(true);
  };

  const luuNhanVien = (giaTri: any) => {
    if (!giaTri.gioLamViec || giaTri.gioLamViec.length !== 2) {
      return message.error("Chọn giờ làm việc hợp lệ");
    }

    const nvMoi: NhanVien = {
      id: nvSua?.id || Date.now(),
      ten: giaTri.ten,
      soKhachMoiNgay: giaTri.soKhachMoiNgay,
      gioLamViec: {
        batDau: giaTri.gioLamViec[0].format("HH:mm"),
        ketThuc: giaTri.gioLamViec[1].format("HH:mm"),
      },
    };

    if (nvSua) {
      setDsNhanVien(dsNhanVien.map((e) => (e.id === nvSua.id ? nvMoi : e)));
      message.success("Cập nhật nhân viên thành công");
    } else {
      setDsNhanVien([...dsNhanVien, nvMoi]);
      message.success("Thêm nhân viên thành công");
    }

    setModalNVVisible(false);
  };

  const xoaNhanVien = (id: number) => {
    setDsNhanVien(dsNhanVien.filter((e) => e.id !== id));
    message.success("Xóa nhân viên thành công");
  };

  const hienThiModalDV = (dv?: DichVu) => {
    setDvSua(dv || null);
    formDV.setFieldsValue(
      dv
        ? { ten: dv.ten, gia: dv.gia, thoiGian: dv.thoiGian }
        : { ten: "", gia: 0, thoiGian: 30 }
    );
    setModalDVVisible(true);
  };

  const luuDichVu = (giaTri: any) => {
    if (!giaTri.ten || giaTri.gia < 0 || giaTri.thoiGian <= 0) {
      return message.error("Thông tin dịch vụ không hợp lệ");
    }

    const dvMoi: DichVu = {
      id: dvSua?.id || Date.now(),
      ten: giaTri.ten,
      gia: giaTri.gia,
      thoiGian: giaTri.thoiGian,
    };

    if (dvSua) {
      setDsDichVu(dsDichVu.map((s) => (s.id === dvSua.id ? dvMoi : s)));
      message.success("Cập nhật dịch vụ thành công");
    } else {
      setDsDichVu([...dsDichVu, dvMoi]);
      message.success("Thêm dịch vụ thành công");
    }

    setModalDVVisible(false);
  };

  const xoaDichVu = (id: number) => {
    setDsDichVu(dsDichVu.filter((s) => s.id !== id));
    message.success("Xóa dịch vụ thành công");
  };

  const trungLich = (nvId: number, ngay: string, gio: string) =>
    dsLichHen.some((l) => l.nhanVienId === nvId && l.ngay === ngay && l.gio === gio);

  const demLichMoiNgay = (nvId: number, ngay: string) =>
    dsLichHen.filter((l) => l.nhanVienId === nvId && l.ngay === ngay).length;

  const themLichHen = (giaTri: any) => {
    const ngay = giaTri.ngay.format("YYYY-MM-DD");
    const gio = giaTri.gio.format("HH:mm");
    if (!giaTri.nhanVienId || !giaTri.dichVuId) return message.error("Chọn nhân viên và dịch vụ");
    const nv = dsNhanVien.find((e) => e.id === giaTri.nhanVienId);
    if (!nv) return message.error("Nhân viên không hợp lệ");
    if (trungLich(giaTri.nhanVienId, ngay, gio)) return message.error("Trùng lịch!");
    if (demLichMoiNgay(giaTri.nhanVienId, ngay) >= nv.soKhachMoiNgay)
      return message.error("Nhân viên đã đầy lịch trong ngày này");

    setDsLichHen([
      ...dsLichHen,
      {
        id: Date.now(),
        nhanVienId: giaTri.nhanVienId,
        dichVuId: giaTri.dichVuId,
        ngay,
        gio,
        trangThai: TRANG_THAI.CHO_DUYET,
      },
    ]);
    message.success("Đặt lịch thành công");
    formLH.resetFields();
  };

  const capNhatTrangThai = (id: number, trangThai: string) =>
    setDsLichHen((prev) => prev.map((l) => (l.id === id ? { ...l, trangThai } : l)));

  const themDanhGia = (id: number, danhGia: number, phanHoi: string) =>
    setDsLichHen((prev) =>
      prev.map((l) => (l.id === id ? { ...l, danhGia, phanHoi } : l))
    );

  const danhGiaNhanVien = dsNhanVien.map((nv) => {
    const lichHoanThanh = dsLichHen.filter(
      (l) => l.nhanVienId === nv.id && l.trangThai === TRANG_THAI.HOAN_THANH && l.danhGia
    );
    const tb = lichHoanThanh.length
      ? lichHoanThanh.reduce((sum, l) => sum + (l.danhGia || 0), 0) / lichHoanThanh.length
      : 0;
    return { ...nv, tbDanhGia: tb.toFixed(1), phanHois: lichHoanThanh.map((l) => l.phanHoi).filter(f => f) };
  });

  const thongKe = useMemo(() => {
    const soLuongTheoNgay: Record<string, number> = {};
    const doanhThuTheoDV: Record<string, number> = {};
    const doanhThuTheoNV: Record<string, number> = {};

    dsLichHen.forEach((l) => {
      soLuongTheoNgay[l.ngay] = (soLuongTheoNgay[l.ngay] || 0) + 1;
      const dv = dsDichVu.find((s) => s.id === l.dichVuId);
      if (dv) doanhThuTheoDV[dv.ten] = (doanhThuTheoDV[dv.ten] || 0) + dv.gia;
      const nv = dsNhanVien.find((e) => e.id === l.nhanVienId);
      if (nv && dv) doanhThuTheoNV[nv.ten] = (doanhThuTheoNV[nv.ten] || 0) + dv.gia;
    });

    return { soLuongTheoNgay, doanhThuTheoDV, doanhThuTheoNV };
  }, [dsLichHen, dsDichVu, dsNhanVien]);

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="1️⃣ Quản lý nhân viên & dịch vụ" key="1">
        <h3>Nhân viên</h3>
        <Button type="primary" style={{ marginBottom: 10 }} onClick={() => hienThiModalNV()}>
          Thêm nhân viên
        </Button>
        <Table
          dataSource={dsNhanVien}
          columns={[
            { title: "Tên nhân viên", dataIndex: "ten", key: "ten", align: "center" },
            { title: "Số khách/ngày", dataIndex: "soKhachMoiNgay", key: "soKhachMoiNgay", align: "center" },
            {
              title: "Giờ làm việc",
              key: "gioLamViec",
              align: "center",
              render: (_text, record: NhanVien) =>
                `${record.gioLamViec.batDau}-${record.gioLamViec.ketThuc}`,
            },
            {
              title: "Hành động",
              key: "hanhDong",
              align: "center",
              render: (_text, record: NhanVien) => (
                <Space>
                  <Button onClick={() => hienThiModalNV(record)}>Sửa</Button>
                  <Button danger onClick={() => xoaNhanVien(record.id)}>Xóa</Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
          pagination={false}
        />

        <h3 style={{ marginTop: 20 }}>Dịch vụ</h3>
        <Button type="primary" style={{ marginBottom: 10 }} onClick={() => hienThiModalDV()}>
          Thêm dịch vụ
        </Button>
        <Table
          dataSource={dsDichVu}
          columns={[
            { title: "Tên dịch vụ", dataIndex: "ten", key: "ten", align: "center" },
            { title: "Giá", dataIndex: "gia", key: "gia", align: "center" },
            { title: "Thời gian (phút)", dataIndex: "thoiGian", key: "thoiGian", align: "center" },
            {
              title: "Hành động",
              key: "hanhDong",
              align: "center",
              render: (_text, record: DichVu) => (
                <Space>
                  <Button onClick={() => hienThiModalDV(record)}>Sửa</Button>
                  <Button danger onClick={() => xoaDichVu(record.id)}>Xóa</Button>
                </Space>
              ),
            },
          ]}
          rowKey="id"
          pagination={false}
        />

        <Modal
          visible={modalNVVisible}
          title={nvSua ? "Sửa nhân viên" : "Thêm nhân viên"}
          onCancel={() => setModalNVVisible(false)}
          onOk={() => formNV.submit()}
        >
          <Form form={formNV} layout="vertical" onFinish={luuNhanVien}>
            <Form.Item label="Tên nhân viên" name="ten" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Số khách/ngày" name="soKhachMoiNgay" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Giờ làm việc" name="gioLamViec" rules={[{ required: true }]}>
              <TimePicker.RangePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          visible={modalDVVisible}
          title={dvSua ? "Sửa dịch vụ" : "Thêm dịch vụ"}
          onCancel={() => setModalDVVisible(false)}
          onOk={() => formDV.submit()}
        >
          <Form form={formDV} layout="vertical" onFinish={luuDichVu}>
            <Form.Item label="Tên dịch vụ" name="ten" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Giá" name="gia" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Thời gian (phút)" name="thoiGian" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </TabPane>

      <TabPane tab="2️⃣ Quản lý lịch hẹn" key="2">
        <h3>📅 Danh sách lịch hẹn</h3>
        <Form form={formLH} layout="vertical" onFinish={themLichHen} style={{ marginBottom: 20 }}>
          <Form.Item label="Nhân viên" name="nhanVienId" rules={[{ required: true }]}>
            <Select placeholder="Chọn nhân viên">
              {dsNhanVien.map((nv) => (
                <Option key={nv.id} value={nv.id}>{nv.ten}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Dịch vụ" name="dichVuId" rules={[{ required: true }]}>
            <Select placeholder="Chọn dịch vụ">
              {dsDichVu.map((dv) => (
                <Option key={dv.id} value={dv.id}>{dv.ten}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ngày" name="ngay" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Giờ" name="gio" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Button type="primary" htmlType="submit">Đặt lịch</Button>
        </Form>

        <Table
          dataSource={dsLichHen.map((l) => {
            const nv = dsNhanVien.find((e) => e.id === l.nhanVienId);
            const dv = dsDichVu.find((s) => s.id === l.dichVuId);
            return {
              key: l.id,
              ngay: l.ngay,
              gio: l.gio,
              nhanVien: nv?.ten,
              dichVu: dv?.ten,
              trangThai: l.trangThai,
              lich: l,
            };
          })}
          columns={[
            { title: "Ngày", dataIndex: "ngay", key: "ngay", align: "center" },
            { title: "Giờ", dataIndex: "gio", key: "gio", align: "center" },
            { title: "Nhân viên", dataIndex: "nhanVien", key: "nhanVien", align: "center" },
            { title: "Dịch vụ", dataIndex: "dichVu", key: "dichVu", align: "center" },
            {
              title: "Trạng thái",
              dataIndex: "trangThai",
              key: "trangThai",
              align: "center",
              render: (text: string) => {
                let color = "default";
                if (text === TRANG_THAI.CHO_DUYET) color = "orange";
                else if (text === TRANG_THAI.XAC_NHAN) color = "blue";
                else if (text === TRANG_THAI.HOAN_THANH) color = "green";
                else if (text === TRANG_THAI.HUY) color = "red";
                return <span style={{ color }}>{text}</span>;
              },
            },
            {
              title: "Hành động",
              key: "hanhDong",
              align: "center",
              render: (_text, record) => {
                const l: LichHen = record.lich;
                const actions = [];
                if (l.trangThai === TRANG_THAI.CHO_DUYET) {
                  actions.push(
                    <Button key="xacnhan" onClick={() => capNhatTrangThai(l.id, TRANG_THAI.XAC_NHAN)}>Xác nhận</Button>
                  );
                  actions.push(
                    <Button key="huy" danger onClick={() => capNhatTrangThai(l.id, TRANG_THAI.HUY)}>Hủy</Button>
                  );
                } else if (l.trangThai === TRANG_THAI.XAC_NHAN) {
                  actions.push(
                    <Button key="hoanthanh" onClick={() => capNhatTrangThai(l.id, TRANG_THAI.HOAN_THANH)}>Hoàn thành</Button>
                  );
                  actions.push(
                    <Button key="huy" danger onClick={() => capNhatTrangThai(l.id, TRANG_THAI.HUY)}>Hủy</Button>
                  );
                } else if (l.trangThai === TRANG_THAI.HOAN_THANH) {
                  actions.push(
                    <Form
                      key="danhgia"
                      form={formDanhGia}
                      layout="inline"
                      onFinish={(giaTri) => themDanhGia(l.id, giaTri.rating, giaTri.phanHoi)}
                    >
                      <Form.Item name="rating" rules={[{ required: true }]}>
                        <Rate />
                      </Form.Item>
                      <Form.Item name="phanHoi">
                        <Input placeholder="Phản hồi" />
                      </Form.Item>
                      <Button htmlType="submit">Gửi</Button>
                    </Form>
                  );
                }
                return <Space>{actions}</Space>;
              },
            },
          ]}
          pagination={{ pageSize: 5 }}
        />
      </TabPane>

      <TabPane tab="3️⃣ Đánh giá" key="3">
        <h3>⭐ Đánh giá nhân viên</h3>
        <Table
          dataSource={danhGiaNhanVien.map((nv) => ({
            key: nv.id,
            ten: nv.ten,
            tbDanhGia: nv.tbDanhGia,
            phanHois: nv.phanHois.join(" | ") || "-",
          }))}
          columns={[
            { title: "Nhân viên", dataIndex: "ten", key: "ten", align: "center" },
            { title: "Đánh giá trung bình", dataIndex: "tbDanhGia", key: "tbDanhGia", align: "center" },
            { title: "Phản hồi khách hàng", dataIndex: "phanHois", key: "phanHois", align: "center" },
          ]}
          pagination={false}
        />
      </TabPane>

      <TabPane tab="4️⃣ Thống kê" key="4">
        <h3>📊 Số lượng lịch hẹn theo ngày</h3>
        <Table
          dataSource={Object.entries(thongKe.soLuongTheoNgay).map(([ngay, sl]) => ({ key: ngay, ngay, sl }))} 
          columns={[
            { title: "Ngày", dataIndex: "ngay", key: "ngay", align: "center" },
            { title: "Số lượng lịch hẹn", dataIndex: "sl", key: "sl", align: "center" },
          ]}
          pagination={false}
        />

        <h3 style={{ marginTop: 20 }}>💰 Doanh thu theo dịch vụ</h3>
        <Table
          dataSource={Object.entries(thongKe.doanhThuTheoDV).map(([dv, dt]) => ({ key: dv, dv, dt }))} 
          columns={[
            { title: "Dịch vụ", dataIndex: "dv", key: "dv", align: "center" },
            { title: "Doanh thu (VNĐ)", dataIndex: "dt", key: "dt", align: "center" },
          ]}
          pagination={false}
        />

        <h3 style={{ marginTop: 20 }}>👤 Doanh thu theo nhân viên</h3>
        <Table
          dataSource={Object.entries(thongKe.doanhThuTheoNV).map(([nv, dt]) => ({ key: nv, nv, dt }))} 
          columns={[
            { title: "Nhân viên", dataIndex: "nv", key: "nv", align: "center" },
            { title: "Doanh thu (VNĐ)", dataIndex: "dt", key: "dt", align: "center" },
          ]}
          pagination={false}
        />
      </TabPane>
    </Tabs>
  );
};

export default DatLichHen;