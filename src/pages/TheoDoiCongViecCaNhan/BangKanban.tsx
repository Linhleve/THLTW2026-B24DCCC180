import React, { useState } from 'react';
import {
  Card,
  Tag,
  Button,
  Popconfirm,
  Tooltip,
  Typography,
  Space,
  Badge,
  Row,
  Col,
} from 'antd';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { CongViec, TrangThaiCongViec, MucDoUuTien, CotKanban } from './kieuDuLieu';
import FormCongViec from './FormCongViec';

const { Text, Title } = Typography;

interface BangKanbanProps {
  danhSachCongViec: CongViec[];
  onThem: (duLieu: Omit<CongViec, 'maId' | 'ngayTao'>) => void;
  onSua: (maId: string, duLieu: Partial<Omit<CongViec, 'maId' | 'ngayTao'>>) => void;
  onXoa: (maId: string) => void;
  onSapXepLai: (danhSachMoi: CongViec[]) => void;
}

const cauHinhCotKanban: Omit<CotKanban, 'danhSachCongViec'>[] = [
  { id: 'canLam', tieuDe: '📋 Cần Làm', mauNen: '#e6f4ff', mauDuong: '#91caff' },
  { id: 'dangLam', tieuDe: '⚡ Đang Làm', mauNen: '#fffbe6', mauDuong: '#ffe58f' },
  { id: 'hoanThanh', tieuDe: '✅ Hoàn Thành', mauNen: '#f6ffed', mauDuong: '#b7eb8f' },
];

const MAU_UU_TIEN: Record<MucDoUuTien, string> = {
  cao: 'red',
  trungBinh: 'gold',
  thap: 'green',
};

const NHAN_UU_TIEN: Record<MucDoUuTien, string> = {
  cao: 'Cao',
  trungBinh: 'Trung Bình',
  thap: 'Thấp',
};

const kiemTraQuaHan = (hanChot?: string, trangThai?: TrangThaiCongViec): boolean => {
  if (!hanChot || trangThai === 'hoanThanh') return false;
  const ngayHomNay = new Date();
  ngayHomNay.setHours(0, 0, 0, 0);
  const ngayHanChot = new Date(hanChot);
  ngayHanChot.setHours(0, 0, 0, 0);
  return ngayHanChot < ngayHomNay;
};

const TheNhiemVu: React.FC<{
  congViec: CongViec;
  chiSo: number;
  onSua: () => void;
  onXoa: () => void;
}> = ({ congViec, chiSo, onSua, onXoa }) => {
  const laQuaHan = kiemTraQuaHan(congViec.hanChot, congViec.trangThai);

  return (
    <Draggable draggableId={congViec.maId} index={chiSo}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ marginBottom: 10, ...provided.draggableProps.style }}
        >
          <Card
            size="small"
            bordered
            style={{
              opacity: snapshot.isDragging ? 0.9 : 1,
              cursor: 'grab',
            }}
            actions={[
              <Tooltip title="Chỉnh sửa" key="sua">
                <EditOutlined onClick={onSua} />
              </Tooltip>,
              <Popconfirm
                key="xoa"
                title="Xác nhận xóa công việc này?"
                onConfirm={onXoa}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Xóa">
                  <DeleteOutlined />
                </Tooltip>
              </Popconfirm>,
            ]}
          >
            <Space direction="vertical" size={4}>
              <Text strong type={laQuaHan ? 'danger' : undefined}>
                {congViec.tenCongViec}
              </Text>

              {congViec.moTa && (
                <Typography.Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ marginBottom: 0, fontSize: 12 }}
                >
                  {congViec.moTa}
                </Typography.Paragraph>
              )}

              <Space size={4} wrap>
                <Tag color={MAU_UU_TIEN[congViec.mucDoUuTien]}>
                  {NHAN_UU_TIEN[congViec.mucDoUuTien]}
                </Tag>
                {laQuaHan && <Tag color="red">Quá Hạn!</Tag>}
              </Space>

              {congViec.hanChot && (
                <Space size={4}>
                  <CalendarOutlined />
                  <Text type={laQuaHan ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
                    {moment(congViec.hanChot).format('DD/MM/YYYY')}
                  </Text>
                </Space>
              )}

              {congViec.nhanTag && congViec.nhanTag.length > 0 && (
                <Space size={2} wrap>
                  {congViec.nhanTag.slice(0, 3).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                  {congViec.nhanTag.length > 3 && (
                    <Tag>+{congViec.nhanTag.length - 3}</Tag>
                  )}
                </Space>
              )}
            </Space>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

const BangKanban: React.FC<BangKanbanProps> = ({
  danhSachCongViec,
  onThem,
  onSua,
  onXoa,
  onSapXepLai,
}) => {
  const [hienThiForm, datHienThiForm] = useState(false);
  const [congViecDangSua, datCongViecDangSua] = useState<CongViec | undefined>(undefined);
  const [trangThaiMacDinh, datTrangThaiMacDinh] = useState<TrangThaiCongViec>('canLam');

  const xuLyMoFormThem = (trangThai: TrangThaiCongViec) => {
    datCongViecDangSua(undefined);
    datTrangThaiMacDinh(trangThai);
    datHienThiForm(true);
  };

  const xuLyMoFormSua = (congViec: CongViec) => {
    datCongViecDangSua(congViec);
    datHienThiForm(true);
  };

  const xuLyDongForm = () => {
    datHienThiForm(false);
    datCongViecDangSua(undefined);
  };

  const xuLyLuuCongViec = (duLieu: Omit<CongViec, 'maId' | 'ngayTao'>) => {
    if (congViecDangSua) {
      onSua(congViecDangSua.maId, duLieu);
    } else {
      onThem(duLieu);
    }
    xuLyDongForm();
  };

  const xuLyKeoTha = (ketQua: DropResult) => {
    const { destination, source, draggableId } = ketQua;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const trangThaiMoi = destination.droppableId as TrangThaiCongViec;
    const trangThaiCu = source.droppableId as TrangThaiCongViec;
    const danhSachMoi = [...danhSachCongViec];

    if (trangThaiCu === trangThaiMoi) {
      const congViecTrongCot = danhSachMoi.filter((cv) => cv.trangThai === trangThaiCu);
      const congViecKhac = danhSachMoi.filter((cv) => cv.trangThai !== trangThaiCu);
      const [phanTuDiChuyen] = congViecTrongCot.splice(source.index, 1);
      congViecTrongCot.splice(destination.index, 0, phanTuDiChuyen);
      onSapXepLai([...congViecKhac, ...congViecTrongCot]);
    } else {
      const viTriCongViec = danhSachMoi.findIndex((cv) => cv.maId === draggableId);
      if (viTriCongViec !== -1) {
        danhSachMoi[viTriCongViec] = { ...danhSachMoi[viTriCongViec], trangThai: trangThaiMoi };
        onSapXepLai(danhSachMoi);
      }
    }
  };

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Title level={3}>🗂️ Bảng Kanban</Title>
      </Col>

      <Col span={24}>
        <DragDropContext onDragEnd={xuLyKeoTha}>
          <Row gutter={16} align="top">
            {cauHinhCotKanban.map((cauHinhCot) => {
              const congViecTrongCot = danhSachCongViec.filter(
                (cv) => cv.trangThai === cauHinhCot.id,
              );
              return (
                <Col xs={24} md={8} key={cauHinhCot.id}>
                  <Card
                    title={
                      <Space>
                        <Title level={5} style={{ margin: 0 }}>
                          {cauHinhCot.tieuDe}
                        </Title>
                        <Badge count={congViecTrongCot.length} showZero />
                      </Space>
                    }
                    extra={
                      <Button
                        type="text"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => xuLyMoFormThem(cauHinhCot.id)}
                      />
                    }
                    bordered
                  >
                    <Droppable droppableId={cauHinhCot.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            minHeight: 400,
                            background: snapshot.isDraggingOver ? '#f0f8ff' : undefined,
                            borderRadius: 4,
                            padding: 4,
                            transition: 'background 0.2s',
                          }}
                        >
                          {congViecTrongCot.map((cv, chiSo) => (
                            <TheNhiemVu
                              key={cv.maId}
                              congViec={cv}
                              chiSo={chiSo}
                              onSua={() => xuLyMoFormSua(cv)}
                              onXoa={() => onXoa(cv.maId)}
                            />
                          ))}
                          {provided.placeholder}
                          {congViecTrongCot.length === 0 && !snapshot.isDraggingOver && (
                            <Typography.Text type="secondary">
                              Chưa có công việc
                            </Typography.Text>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </DragDropContext>
      </Col>

      <FormCongViec
        hienThi={hienThiForm}
        congViecDangSua={congViecDangSua}
        trangThaiMacDinh={trangThaiMacDinh}
        onDong={xuLyDongForm}
        onLuu={xuLyLuuCongViec}
      />
    </Row>
  );
};

export default BangKanban;
