import React, { useState } from "react";
import { Button, Form, Input, Select, Table, Tabs, Modal, message } from "antd";

const { Option } = Select;

interface MonHoc {
  maMon: string;
  tenMon: string;
  tinChi: number;
}

interface KhoiKienThuc {
  maKhoi: string;
  tenKhoi: string;
}

interface CauHoi {
  maCauHoi: string;
  maMon: string;
  noiDung: string;
  mucDo: string;
  maKhoi: string;
}

interface DeThi {
  maDe: string;
  maMon: string;
  danhSachCauHoi: CauHoi[];
}

const danhSachMucDo = ["Dễ", "Trung bình", "Khó", "Rất khó"];

const NganHangCauHoi: React.FC = () => {
  const [danhSachMon, setDanhSachMon] = useState<MonHoc[]>([]);
  const [danhSachKhoi, setDanhSachKhoi] = useState<KhoiKienThuc[]>([]);
  const [danhSachCauHoi, setDanhSachCauHoi] = useState<CauHoi[]>([]);
  const [danhSachDe, setDanhSachDe] = useState<DeThi[]>([]);
  const [deThiDangXem, setDeThiDangXem] = useState<DeThi | null>(null);

  const [locMon, setLocMon] = useState("");
  const [locMucDo, setLocMucDo] = useState("");
  const [locKhoi, setLocKhoi] = useState("");

  const [form] = Form.useForm();

  const themMon = (giaTri: any) => {
    setDanhSachMon([...danhSachMon, giaTri]);
    form.resetFields();
  };

  const xoaMon = (maMon: string) => {
    setDanhSachMon(danhSachMon.filter((mon) => mon.maMon !== maMon));
  };

  const themKhoi = (giaTri: any) => {
    setDanhSachKhoi([...danhSachKhoi, giaTri]);
    form.resetFields();
  };

  const xoaKhoi = (maKhoi: string) => {
    setDanhSachKhoi(danhSachKhoi.filter((khoi) => khoi.maKhoi !== maKhoi));
  };

  const themCauHoi = (giaTri: any) => {
    setDanhSachCauHoi([...danhSachCauHoi, giaTri]);
    form.resetFields();
  };

  const xoaCauHoi = (maCauHoi: string) => {
    setDanhSachCauHoi(danhSachCauHoi.filter((cau) => cau.maCauHoi !== maCauHoi));
  };

  const cauHoiDaLoc = danhSachCauHoi.filter((cau) => {
    return (
      (!locMon || cau.maMon === locMon) &&
      (!locMucDo || cau.mucDo === locMucDo) &&
      (!locKhoi || cau.maKhoi === locKhoi)
    );
  });

  const tronNgau = (mang: CauHoi[]) => {
    return [...mang].sort(() => Math.random() - 0.5);
  };

  const xoaDe = (maDe: string) => {
    setDanhSachDe(danhSachDe.filter((de) => de.maDe !== maDe));
  };

  const taoDe = (giaTri: any) => {
    const cauHoiTheoMon = danhSachCauHoi.filter((cau) => cau.maMon === giaTri.maMon);
    let daDuocChon: CauHoi[] = [];

    for (let mucDo of danhSachMucDo) {
      const soLuong = Number(giaTri[mucDo] || 0);
      if (soLuong === 0) continue;

      const danhSach = cauHoiTheoMon.filter((cau) => cau.mucDo === mucDo);
      if (danhSach.length < soLuong) {
        message.error(`Không đủ câu hỏi mức ${mucDo}`);
        return;
      }

      const cauHoiNgauNhien = tronNgau(danhSach).slice(0, soLuong);
      daDuocChon = [...daDuocChon, ...cauHoiNgauNhien];
    }

    const deMoi: DeThi = {
      maDe: Date.now().toString(),
      maMon: giaTri.maMon,
      danhSachCauHoi: daDuocChon,
    };

    setDanhSachDe([...danhSachDe, deMoi]);
    message.success("Tạo đề thi thành công");
  };

  return (
    <>
      <Tabs defaultActiveKey="1">

        <Tabs.TabPane tab="Môn học" key="1">
          <Form layout="inline" onFinish={themMon}>
            <Form.Item name="maMon" rules={[{ required: true }]}>
              <Input placeholder="Mã môn" />
            </Form.Item>
            <Form.Item name="tenMon">
              <Input placeholder="Tên môn" />
            </Form.Item>
            <Form.Item name="tinChi">
              <Input type="number" placeholder="Tín chỉ" />
            </Form.Item>
            <Button type="primary" htmlType="submit">Thêm</Button>
          </Form>

          <Table
            rowKey="maMon"
            dataSource={danhSachMon}
            columns={[
              { title: "Mã môn", dataIndex: "maMon", align: "center" },
              { title: "Tên môn", dataIndex: "tenMon", align: "center" },
              { title: "Tín chỉ", dataIndex: "tinChi", align: "center" },
              {
                title: "Thao tác", align: "center",
                render: (_, ban: MonHoc) => (
                  <Button danger onClick={() => xoaMon(ban.maMon)}>Xóa</Button>
                ),
              },
            ]}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Khối kiến thức" key="2">
          <Form layout="inline" onFinish={themKhoi}>
            <Form.Item name="maKhoi">
              <Input placeholder="Mã khối" />
            </Form.Item>
            <Form.Item name="tenKhoi">
              <Input placeholder="Tên khối" />
            </Form.Item>
            <Button type="primary" htmlType="submit">Thêm</Button>
          </Form>

          <Table
            rowKey="maKhoi"
            dataSource={danhSachKhoi}
            columns={[
              { title: "Mã khối", dataIndex: "maKhoi", align: "center" },
              { title: "Tên khối", dataIndex: "tenKhoi", align: "center" },
              {
                title: "Thao tác", align: "center",
                render: (_, ban: KhoiKienThuc) => (
                  <Button danger onClick={() => xoaKhoi(ban.maKhoi)}>Xóa</Button>
                ),
              },
            ]}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Câu hỏi" key="3">
          <Form layout="vertical" onFinish={themCauHoi}>
            <Form.Item name="maCauHoi" label="Mã câu hỏi">
              <Input />
            </Form.Item>
            <Form.Item name="maMon" label="Môn học">
              <Select>
                {danhSachMon.map((mon) => (
                  <Option key={mon.maMon} value={mon.maMon}>{mon.tenMon}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="noiDung" label="Nội dung">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="mucDo" label="Mức độ">
              <Select>
                {danhSachMucDo.map((md) => (
                  <Option key={md} value={md}>{md}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="maKhoi" label="Khối kiến thức">
              <Select>
                {danhSachKhoi.map((khoi) => (
                  <Option key={khoi.maKhoi} value={khoi.maKhoi}>{khoi.tenKhoi}</Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">Thêm câu hỏi</Button>
          </Form>

          <br />

          <Select
            placeholder="Môn"
            style={{ width: 150, marginRight: 10 }}
            onChange={setLocMon}
            allowClear
          >
            {danhSachMon.map((mon) => (
              <Option key={mon.maMon} value={mon.maMon}>{mon.maMon}</Option>
            ))}
          </Select>

          <Select
            placeholder="Độ khó"
            style={{ width: 150, marginRight: 10 }}
            onChange={setLocMucDo}
            allowClear
          >
            {danhSachMucDo.map((md) => (
              <Option key={md}>{md}</Option>
            ))}
          </Select>

          <Select
            placeholder="Khối"
            style={{ width: 150 }}
            onChange={setLocKhoi}
            allowClear
          >
            {danhSachKhoi.map((khoi) => (
              <Option key={khoi.maKhoi} value={khoi.maKhoi}>{khoi.maKhoi}</Option>
            ))}
          </Select>

          <br /><br />

          <Table
            rowKey="maCauHoi"
            dataSource={cauHoiDaLoc}
            columns={[
              { title: "Mã", dataIndex: "maCauHoi", align: "center" },
              { title: "Môn", dataIndex: "maMon", align: "center" },
              { title: "Nội dung", dataIndex: "noiDung", align: "center" },
              { title: "Độ khó", dataIndex: "mucDo", align: "center" },
              { title: "Khối", dataIndex: "maKhoi", align: "center" },
              {
                title: "Thao tác", align: "center",
                render: (_, ban: CauHoi) => (
                  <Button danger onClick={() => xoaCauHoi(ban.maCauHoi)}>Xóa</Button>
                ),
              },
            ]}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Tạo đề thi" key="4">
          <Form layout="vertical" onFinish={taoDe}>
            <Form.Item name="maMon" label="Môn học">
              <Select>
                {danhSachMon.map((mon) => (
                  <Option key={mon.maMon} value={mon.maMon}>{mon.tenMon}</Option>
                ))}
              </Select>
            </Form.Item>
            {danhSachMucDo.map((md) => (
              <Form.Item key={md} name={md} label={`Số câu ${md}`}>
                <Input type="number" />
              </Form.Item>
            ))}
            <Button type="primary" htmlType="submit">Tạo đề</Button>
          </Form>

          <br />

          <Table
            rowKey="maDe"
            dataSource={danhSachDe}
            columns={[
              { title: "Mã đề", dataIndex: "maDe", align: "center" },
              { title: "Môn", dataIndex: "maMon", align: "center" },
              {
                title: "Số câu", align: "center",
                render: (_, ban: DeThi) => ban.danhSachCauHoi.length,
              },
              {
                title: "Chi tiết", align: "center",
                render: (_, ban: DeThi) => (
                  <Button onClick={() => setDeThiDangXem(ban)}>Xem</Button>
                ),
              },
              {
                title: "Thao tác", align: "center",
                render: (_, ban: DeThi) => (
                  <Button danger onClick={() => xoaDe(ban.maDe)}>Xóa</Button>
                ),
              },
            ]}
          />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        visible={!!deThiDangXem}
        onCancel={() => setDeThiDangXem(null)}
        footer={null}
        title={`Chi tiết đề thi — Môn: ${deThiDangXem?.maMon ?? ""} (${deThiDangXem?.danhSachCauHoi.length ?? 0} câu)`}
        width={860}
        centered
        destroyOnClose
        bodyStyle={{
          maxHeight: "65vh",
          overflowY: "auto",
          padding: "12px 16px",
        }}
      >
        <Table
          rowKey="maCauHoi"
          dataSource={deThiDangXem?.danhSachCauHoi}
          columns={[
            { title: "Mã", dataIndex: "maCauHoi", width: 90, align: "center" },
            { title: "Nội dung", dataIndex: "noiDung", ellipsis: true, align: "center" },
            { title: "Độ khó", dataIndex: "mucDo", width: 110, align: "center" },
            { title: "Khối", dataIndex: "maKhoi", width: 110, align: "center" },
          ]}
          scroll={{ x: 560 }}
          pagination={false}
          size="small"
        />
      </Modal>
    </>
  );
};

export default NganHangCauHoi;