import React, { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface FieldConfig {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date';
}

interface BookRecord {
  id: string;
  year: number;
  nextEntry: number;
}

interface DecisionRecord {
  id: string;
  decisionNumber: string;
  issueDate: string;
  summary: string;
  bookId: string;
}

interface DiplomaRecord {
  id: string;
  bookId: string;
  entryNumber: number;
  diplomaNumber: string;
  studentId: string;
  fullName: string;
  birthDate: string;
  decisionId: string;
  extraFields: Record<string, string>;
}

const defaultFieldConfigs: FieldConfig[] = [
  { id: 'diemTrungBinh', name: 'Điểm trung bình', type: 'number' },
  { id: 'xepHang', name: 'Xếp hạng', type: 'string' },
  { id: 'noiSinh', name: 'Nơi sinh', type: 'string' },
];

const initialBooks: BookRecord[] = [
  { id: 'book-2025', year: 2025, nextEntry: 5 },
  { id: 'book-2026', year: 2026, nextEntry: 1 },
];

const initialDecisions: DecisionRecord[] = [
  {
    id: 'decision-1',
    decisionNumber: 'QĐ-2025-01',
    issueDate: '2025-06-20',
    summary: 'Quyết định tốt nghiệp đợt 1 năm 2025',
    bookId: 'book-2025',
  },
  {
    id: 'decision-2',
    decisionNumber: 'QĐ-2025-02',
    issueDate: '2025-12-10',
    summary: 'Quyết định tốt nghiệp đợt 2 năm 2025',
    bookId: 'book-2025',
  },
];

const fieldTypeOptions = [
  { label: 'Chuỗi', value: 'string' },
  { label: 'Số', value: 'number' },
  { label: 'Ngày', value: 'date' },
];

const QuanLySo: React.FC = () => {
  const [books, setBooks] = useState<BookRecord[]>(initialBooks);
  const [decisions, setDecisions] = useState<DecisionRecord[]>(initialDecisions);
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>(defaultFieldConfigs);
  const [diplomas, setDiplomas] = useState<DiplomaRecord[]>([]);
  const [searchResults, setSearchResults] = useState<DiplomaRecord[]>([]);
  const [lookupCounts, setLookupCounts] = useState<Record<string, number>>({});
  const [fieldForm] = Form.useForm();
  const [bookForm] = Form.useForm();
  const [decisionForm] = Form.useForm();
  const [diplomaForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [editFieldForm] = Form.useForm();
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const booksById = useMemo(
    () => books.reduce((acc, book) => ({ ...acc, [book.id]: book }), {} as Record<string, BookRecord>),
    [books],
  );

  const handleOpenEdit = (field: FieldConfig) => {
    setEditingField(field);
    editFieldForm.setFieldsValue(field);
    setIsEditModalOpen(true);
  };

  const handleEditField = () => {
    editFieldForm
      .validateFields()
      .then((values) => {
        if (!editingField) return;
        setFieldConfigs((prev) =>
          prev.map((item) => (item.id === editingField.id ? { ...item, ...values } : item)),
        );
        setIsEditModalOpen(false);
        setEditingField(null);
        editFieldForm.resetFields();
        message.success('Cập nhật trường thông tin thành công');
      })
      .catch(() => {});
  };

  const handleAddField = (values: { name: string; type: FieldConfig['type'] }) => {
    setFieldConfigs((prev) => [
      ...prev,
      {
        id: 'field-' + values.name + '-' + Date.now(),
        name: values.name,
        type: values.type,
      },
    ]);
    fieldForm.resetFields();
    message.success('Đã thêm trường mới');
  };

  const handleDeleteField = (id: string) => {
    setFieldConfigs((prev) => prev.filter((field) => field.id !== id));
    message.info('Đã xoá trường cấu hình');
  };

  const handleAddBook = (values: { year: number }) => {
    const exists = books.some((book) => book.year === values.year);
    if (exists) {
      message.warning('Đã tồn tại sổ cho năm này');
      return;
    }
    const newBook: BookRecord = {
      id: 'book-' + values.year + '-' + Date.now(),
      year: values.year,
      nextEntry: 1,
    };
    setBooks((prev) => [newBook, ...prev]);
    bookForm.resetFields();
    message.success('Mở sổ ' + values.year + ' thành công');
  };

  const handleAddDecision = (values: {
    decisionNumber: string;
    issueDate: Moment;
    summary: string;
    bookId: string;
  }) => {
    const newDecision: DecisionRecord = {
      id: 'decision-' + Date.now(),
      decisionNumber: values.decisionNumber,
      issueDate: values.issueDate.format('YYYY-MM-DD'),
      summary: values.summary,
      bookId: values.bookId,
    };
    setDecisions((prev) => [newDecision, ...prev]);
    decisionForm.resetFields();
    message.success('Đã lưu quyết định');
  };

  const handleAddDiploma = (values: {
    bookId: string;
    decisionId: string;
    diplomaNumber: string;
    studentId: string;
    fullName: string;
    birthDate: Moment;
  }) => {
    const book = booksById[values.bookId];
    if (!book) {
      message.error('Bạn cần chọn sổ văn bằng trước');
      return;
    }
    const extraFields = fieldConfigs.reduce<Record<string, string>>((acc, field) => {
      const fieldValue = (values as Record<string, unknown>)['field_' + field.id];
      if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
        return acc;
      }
      let formatted = '';
      if (field.type === 'date' && (fieldValue as Moment).isValid()) {
        formatted = (fieldValue as Moment).format('YYYY-MM-DD');
      } else {
        formatted = String(fieldValue);
      }
      acc[field.name] = formatted;
      return acc;
    }, {});

    const newDiploma: DiplomaRecord = {
      id: 'diploma-' + Date.now(),
      bookId: values.bookId,
      entryNumber: book.nextEntry,
      diplomaNumber: values.diplomaNumber,
      studentId: values.studentId,
      fullName: values.fullName,
      birthDate: values.birthDate.format('YYYY-MM-DD'),
      decisionId: values.decisionId,
      extraFields,
    };
    setDiplomas((prev) => [newDiploma, ...prev]);
    setBooks((prev) =>
      prev.map((item) =>
        item.id === values.bookId ? { ...item, nextEntry: item.nextEntry + 1 } : item,
      ),
    );
    diplomaForm.resetFields();
    message.success('Thông tin văn bằng đã được lưu');
  };

  const handleSearch = (values: Record<string, unknown>) => {
    const normalized = {
      diplomaNumber: (values.diplomaNumber as string | undefined)?.trim(),
      entryNumber: values.entryNumber,
      studentId: (values.studentId as string | undefined)?.trim(),
      fullName: (values.fullName as string | undefined)?.trim(),
      birthDate: values.birthDate,
    };
    const activeFields = Object.values(normalized).filter((value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.length > 0;
      return true;
    }).length;

    if (activeFields < 2) {
      message.warning('Vui lòng nhập tối thiểu hai tham số tìm kiếm');
      return;
    }

    const results = diplomas.filter((record) => {
      if (normalized.diplomaNumber && !record.diplomaNumber.includes(normalized.diplomaNumber)) {
        return false;
      }
      if (normalized.entryNumber && record.entryNumber !== Number(normalized.entryNumber)) {
        return false;
      }
      if (normalized.studentId && !record.studentId.includes(normalized.studentId)) {
        return false;
      }
      if (normalized.fullName && !record.fullName.toLowerCase().includes(normalized.fullName.toLowerCase())) {
        return false;
      }
      if (
        normalized.birthDate &&
        moment(record.birthDate).format('YYYY-MM-DD') !== (normalized.birthDate as Moment).format('YYYY-MM-DD')
      ) {
        return false;
      }
      return true;
    });

    if (results.length) {
      setLookupCounts((prev) => {
        const next = { ...prev };
        results.forEach((record) => {
          next[record.decisionId] = (next[record.decisionId] || 0) + 1;
        });
        return next;
      });
    }

    setSearchResults(results);
    message.info(results.length + ' kết quả tìm thấy');
  };

  const decisionLookupData = useMemo(
    () =>
      decisions.map((decision) => ({
        ...decision,
        count: lookupCounts[decision.id] || 0,
        bookYear: booksById[decision.bookId]?.year,
      })),
    [decisions, lookupCounts, booksById],
  );

  const diplomaColumns = [
    {
      title: 'Sổ/Năm',
      dataIndex: 'bookId',
      key: 'book',
      render: (value: string) => booksById[value]?.year || 'N/A',
      align: 'center' as const,    
    },
    {
      title: 'Số vào sổ',
      dataIndex: 'entryNumber',
      key: 'entryNumber',
      align: 'center' as const,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'diplomaNumber',
      key: 'diplomaNumber',
      align: 'center' as const,
    },
    {
      title: 'MSV',
      dataIndex: 'studentId',
      key: 'studentId',
      align: 'center' as const,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center' as const,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      key: 'birthDate',
      align: 'center' as const,
    },
    {
      title: 'Quyết định',
      dataIndex: 'decisionId',
      key: 'decisionId',
      align: 'center' as const,
      render: (value: string) => decisions.find((item) => item.id === value)?.decisionNumber || 'N/A',
    },
    {
      title: 'Trường thông tin mở rộng',
      dataIndex: 'extraFields',
      key: 'extraFields',
      align: 'center' as const,
      render: (value: Record<string, string>) =>
        Object.entries(value)
          .map(([key, next]) => key + ': ' + next)
          .join('; '),
    },
  ];

  const decisionColumns = [
    {
      title: 'Số QĐ',
      dataIndex: 'decisionNumber',
      key: 'decisionNumber',
      align: 'center' as const,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issueDate',
      key: 'issueDate',
      align: 'center' as const,
    },
    {
      title: 'Trích yếu',
      dataIndex: 'summary',
      key: 'summary',
      align: 'center' as const,
    },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'bookId',
      key: 'bookId',
      render: (value: string) => booksById[value]?.year || 'N/A',
      align: 'center' as const,
    },
  ];

  const fieldColumns = [
    {
      title: 'Tên trường',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'type',
      key: 'type',
      align: 'center' as const,
      render: (value: FieldConfig['type']) => value.toUpperCase(),
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center' as const,
      render: (_: unknown, record: FieldConfig) => (
        <Space>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}>
            Sửa
          </Button>
          <Button type='link' icon={<DeleteOutlined />} danger onClick={() => handleDeleteField(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const lookupColumns = [
    {
      title: 'Số QĐ',
      dataIndex: 'decisionNumber',
      key: 'decisionNumber',
      align: 'center' as const,
    },
    {
      title: 'Sổ/Năm',
      dataIndex: 'bookYear',
      key: 'bookYear',
      align: 'center' as const,
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'count',
      key: 'count',
      align: 'center' as const,
    },
  ];

  const currentBookId = diplomaForm.getFieldValue('bookId') as string;
  const currentBook = booksById[currentBookId];
  return (
    <Card title='Quản lý sổ văn bằng và Tra cứu' extra={<Statistic value={diplomas.length} suffix='văn bằng' />}>
      <Tabs defaultActiveKey='tab-quan-ly' type='card' destroyInactiveTabPane>
        <TabPane tab='Sổ và Quyết định' key='tab-quan-ly'>
          <Row gutter={16}>
            <Col span={12}>
              <Card title='Quản lý sổ' size='small'>
                <Form form={bookForm} layout='inline' onFinish={handleAddBook}>
                  <Form.Item label='Năm' name='year' rules={[{ required: true, message: 'Chọn năm để mở sổ' }]}> 
                    <InputNumber min={2000} max={2100} />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType='submit' type='primary' icon={<PlusOutlined />}>
                      Mở sổ mới
                    </Button>
                  </Form.Item>
                </Form>
                <Table
                  style={{ marginTop: 16}}
                  size='small'
                  dataSource={books}
                  rowKey='id'
                  pagination={false}
                  columns={[
                    { title: 'Năm', dataIndex: 'year', key: 'year', align: 'center' },
                    { title: 'Số vào sổ kế tiếp', dataIndex: 'nextEntry', key: 'nextEntry', align: 'center' },
                    {
                      title: 'Số đã cấp',
                      key: 'issued',
                      render: (_: unknown, record: BookRecord) => Math.max(record.nextEntry - 1, 0).toString(),
                      align: 'center',  
                    },
                  ]}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Quyết định tốt nghiệp' size='small'>
                <Form form={decisionForm} layout='vertical' onFinish={handleAddDecision}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label='Số quyết định'
                        name='decisionNumber'
                        rules={[{ required: true, message: 'Nhập số quyết định' }]}
                      >
                        <Input placeholder='Ví dụ QĐ-2026-01' />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label='Ngày ban hành'
                        name='issueDate'
                        rules={[{ required: true, message: 'Chọn ngày ban hành' }]}
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label='Sổ văn bằng'
                        name='bookId'
                        rules={[{ required: true, message: 'Chọn sổ văn bằng liên kết' }]}
                      >
                        <Select placeholder='Chọn năm' options={books.map((book) => ({ value: book.id, label: book.year }))} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label='Trích yếu' name='summary'>
                        <TextArea rows={2} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button type='primary' htmlType='submit'>
                    Lưu quyết định
                  </Button>
                </Form>
                <Divider />
                <Table size='small' dataSource={decisions} columns={decisionColumns} rowKey='id' pagination={false} />
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab='Cấu hình biểu mẫu' key='tab-form'>
          <Card size='small'>
            <Form form={fieldForm} layout='inline' onFinish={handleAddField}>
              <Form.Item name='name' label='Tên trường' rules={[{ required: true, message: 'Cần đặt tên trường' }]}> 
                <Input placeholder='VD: Dân tộc' />
              </Form.Item>
              <Form.Item name='type' label='Loại dữ liệu' rules={[{ required: true }]}> 
                <Select style={{ width: 140 }} options={fieldTypeOptions} />
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit' icon={<PlusOutlined />}>
                  Thêm trường
                </Button>
              </Form.Item>
            </Form>
            <Table
              style={{ marginTop: 16 }}
              size='small'
              dataSource={fieldConfigs}
              columns={fieldColumns}
              rowKey='id'
              pagination={false}
            />
          </Card>
          <Modal
            title='Sửa trường'
            visible={isEditModalOpen}
            onOk={handleEditField}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingField(null);
            }}
          >
            <Form form={editFieldForm} layout='vertical'>
              <Form.Item label='Tên trường' name='name' rules={[{ required: true }]}> 
                <Input />
              </Form.Item>
              <Form.Item label='Kiểu dữ liệu' name='type' rules={[{ required: true }]}> 
                <Select options={fieldTypeOptions} />
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>
        <TabPane tab='Thông tin văn bằng' key='tab-diploma'>
          <Card size='small'>
            <Form form={diplomaForm} layout='vertical' onFinish={handleAddDiploma}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label='Sổ văn bằng'
                    name='bookId'
                    rules={[{ required: true, message: 'Chọn sổ đang cấp' }]}
                  >
                    <Select placeholder='Chọn năm' options={books.map((book) => ({ value: book.id, label: book.year }))} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Quyết định'
                    name='decisionId'
                    rules={[{ required: true, message: 'Chọn quyết định yêu cầu' }]}
                  >
                    <Select
                      placeholder='Chọn quyết định'
                      options={decisions.map((decision) => ({ value: decision.id, label: decision.decisionNumber }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Statistic title='Số vào sổ tiếp theo' value={currentBook ? currentBook.nextEntry : 0} />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label='Số hiệu văn bằng'
                    name='diplomaNumber'
                    rules={[{ required: true, message: 'Nhập số hiệu văn bằng' }]}
                  >
                    <Input placeholder='Ví dụ 12345' />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Mã sinh viên'
                    name='studentId'
                    rules={[{ required: true, message: 'Nhập mã sinh viên' }]}
                  >
                    <Input placeholder='MSV' />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Họ tên'
                    name='fullName'
                    rules={[{ required: true, message: 'Nhập họ tên sinh viên' }]}
                  >
                    <Input placeholder='Họ tên' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label='Ngày sinh'
                    name='birthDate'
                    rules={[{ required: true, message: 'Chọn ngày sinh' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation='left'>Trường dữ liệu mở rộng</Divider>
              <Row gutter={16}>
                {fieldConfigs.map((field) => (
                  <Col span={8} key={field.id}>
                    <Form.Item label={field.name} name={'field_' + field.id}>
                      {field.type === 'string' && <Input placeholder={'Nhập ' + field.name} />}
                      {field.type === 'number' && <InputNumber style={{ width: '100%' }} />}
                      {field.type === 'date' && <DatePicker style={{ width: '100%' }} />}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
              <Button type='primary' htmlType='submit'>
                Lưu thông tin văn bằng
              </Button>
            </Form>
            <Divider />
            <Table size='small' dataSource={diplomas} columns={diplomaColumns} pagination={{ pageSize: 5 }} rowKey='id' />
          </Card>
        </TabPane>
        <TabPane tab='Tra cứu' key='tab-search'>
          <Card size='small'>
            <Alert message='Yêu cầu nhập tối thiểu 2 tham số' type='info' style={{ marginBottom: 16 }} />
            <Form form={searchForm} layout='vertical' onFinish={handleSearch}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label='Số hiệu văn bằng' name='diplomaNumber'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='Số vào sổ' name='entryNumber'>
                    <InputNumber style={{ width: '100%' }} min={1} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='Mã sinh viên' name='studentId'>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label='Họ tên' name='fullName'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='Ngày sinh' name='birthDate'>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Space>
                <Button type='primary' htmlType='submit'>
                  Tra cứu
                </Button>
                <Button
                  onClick={() => {
                    searchForm.resetFields();
                    setSearchResults([]);
                  }}
                >
                  Làm mới
                </Button>
              </Space>
            </Form>
            <Divider />
            <Table
              size='small'
              dataSource={searchResults}
              columns={diplomaColumns}
              pagination={{ pageSize: 5 }}
              rowKey='id'
            />
            <Divider />
            <Table size='small' dataSource={decisionLookupData} columns={lookupColumns} pagination={false} rowKey='id' />
          </Card>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default QuanLySo;
