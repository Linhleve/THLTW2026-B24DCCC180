import React, {useState} from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, message } from 'antd';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const sanPhamData: Product[] = [
    { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const SanPhamPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(sanPhamData);
    const [searchText, setSearchText] = useState("");
    const [hienThiModal, setHienThiModal] = useState(false);
    const [form] = Form.useForm();

    const danhSachLoc = products.filter((sp) =>
        sp.name.toLowerCase().includes(searchText.toLowerCase())
    );

    


    const columns = [
        {title : 'ID', dataIndex: 'id', key: 'id', align: 'center' as 'center' },
        {title : 'Tên Sản Phẩm', dataIndex: 'name', key: 'name', align: 'center' as 'center' },
        {title : 'Giá', dataIndex: 'price', key: 'price', render: (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }), align: 'center' as 'center' },
        {title : 'Số Lượng', dataIndex: 'quantity', key: 'quantity', align: 'center' as 'center' },
        {
            title: 'Thao Tác',
            key: 'action',
            render: (_: any, record: Product) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                    onConfirm={() => {
                        setProducts(products.filter((i) => i.id !== record.id))
                        message.success('Xóa sản phẩm thành công');
                    }}>
                        <Button>Xóa</Button>
                    </Popconfirm>
            ),
            align: "center" as "center",
        },
    ]
    return (
        <div style={{ padding:24}}>
            <h2>Quản lý sản phẩm</h2>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <Input.Search
                    placeholder="Tìm theo tên sản phẩm"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={() => setHienThiModal(true)}>
                    Thêm sản phẩm
                </Button>
            </div>

            <Table rowKey="id" columns={columns} dataSource={danhSachLoc}/>

            <Modal
                title="Thêm sản phẩm"
                visible={hienThiModal}
                onCancel={() => setHienThiModal(false)}
                onOk={() => {
                form.validateFields().then((values) => {
                    setProducts([
                    ...products,
                    { id: products.length + 1, ...values },
                    ]);
                    message.success("Thêm sản phẩm thành công");
                    form.resetFields();
                    setHienThiModal(false);
                });
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true, message: "Không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[{ required: true, type: "number", min: 1 }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[{ required: true, type: "number", min: 1 }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
  );

}
export default SanPhamPage;



