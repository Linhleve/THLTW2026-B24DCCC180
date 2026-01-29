import { Table, Tag, Button, Input, Select, Modal, Popconfirm, Form, InputNumber } from "antd";

import { useState, useEffect, useMemo } from "react";


interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

const productsdata = [
        { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
        { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
        { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
        { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
        { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
        { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
        { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
        { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const categories = ["LapTop", "Điện Thoại", "Máy Tinh Bảng", "Phụ Kiện"];

const ProductTable = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchName, setSearchName] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [form] = Form.useForm<Product>();


    useEffect(() => {
        const loadProducts = (): Product[] => {
            const getdata = localStorage.getItem("products");
            // Nếu Local Storage trống hoặc là mảng rỗng
            if (!getdata || getdata === "[]") {
                localStorage.setItem("products", JSON.stringify(productsdata));
                return productsdata;
            }
            return JSON.parse(getdata);
        };
        const datas = loadProducts();
        setProducts(datas);
    }, []);

    const saveProducts = (products: Product[]) => {
        localStorage.setItem("products", JSON.stringify(products));
        setProducts(products);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchName.toLowerCase()) &&
            (filterCategory ? p.category.toLowerCase().includes(filterCategory.toLowerCase()) : true)
    );
}, [products, searchName, filterCategory]);

    const deleteProduct = (id: number) => {
        const updatedProducts = products.filter(p => p.id !== id);
        saveProducts(updatedProducts);
    }

    const updateProduct = (value: Product) => {
        if (!editProduct) return;
        const update = products.map(p => p.id === editProduct.id ? {... editProduct, ...value } : p);
        saveProducts(update);
        setEditProduct(null);
        form.resetFields();
    };

    const columns = [
        {title: "ID", dataIndex: "id", key: "id", align: 'center' as 'center' },
        {title: "Tên Sản Phẩm", dataIndex: "name", key: "name", align: 'center' as 'center' },
        {title: "Danh Mục", dataIndex: "category", key: "category", align: 'center' as 'center' },
        {title: "Giá", dataIndex: "price", key: "price", render: (price: number) => price.toLocaleString("vi-VN", {style: "currency", currency: "VND"}), align: 'center' as 'center' },
        {title: "Số lượng tồn kho", dataIndex: "quantity", key: "quantity", align: 'center' as 'center' },
        {title: "Trạng Thái", dataIndex: "quantity", key: "status",
            render: (quantity: number) => {
                if (quantity === 0) return <Tag color="red">Hết hàng</Tag>;
                if (quantity >= 1 && quantity <= 10) return <Tag color="yellow">Sắp hết</Tag>;
                return <Tag color="green">Còn hàng</Tag>;
            }, 
            align: 'center' as 'center'
        },
        {title: "Thao Tác", key: "action",
            render: (_: any, record: Product) => (
                <>
                <Button type="link" onClick={() => {setEditProduct(record); form.setFieldsValue(record);}}>Sửa</Button>
                <Popconfirm
                    title="Xác nhận xóa sản phẩm?"
                    onConfirm={() => {
                        deleteProduct(record.id);
                    }}
                    okText="Có"
                    cancelText="Không"
                >
                    <Button type="link" danger>Xóa</Button>
                </Popconfirm>
                </>
            ),
            align: 'center' as 'center'
        },
    ]; 
    
    return (
       <div>
            <div style={{ marginBottom: 16}}>
                <Input
                    placeholder="Tìm kiếm theo tên sản phẩm"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                    style={{ width: 300, marginRight: 8}}
                >
                </Input>
                <Select
                    placeholder="Lọc theo danh mục"
                    value={filterCategory || undefined}
                    onChange={value => setFilterCategory(value)}
                    style={{ width: 200 }}
                    allowClear
                >
                    {categories.map(category => (
                        <Select.Option key={category} value={category}>
                            {category}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            
            <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />
            
            <Modal 
                title = "Chỉnh Sửa Sản Phẩm"
                visible = {!!editProduct}
                onCancel = {() => {
                    setEditProduct(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText = "Lưu"
                cancelText = "Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={updateProduct}
                >
                    <Form.Item 
                        label = "Tên sản phẩm"
                        name = "name"
                        rules={[{required: true, message: "Hãy nhập tên sảm phẩm."}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item 
                        label = "Danh mục"
                        name = "category"
                        rules={[{required: true, message: "Hãy chọn danh mục."}]}
                    >
                        <Select>
                            {categories.map(c => (
                                <Select.Option key={c} value={c}>{c}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item> 
                    <Form.Item
                        label = "Giá"
                        name = "price"
                        rules={[{required: true, message: "Hãy nhập giá bán."}]}
                    >
                        <InputNumber
                            style={{ width: "100%"}}
                            min = {0}
                        />
                    </Form.Item>
                    <Form.Item
                        label = "Số lượng tồn kho"
                        name = "quantity"
                        rules={[{required: true, message: "Hãy nhập số lượng tồn kho."}]}
                    >
                        <InputNumber
                            min = {0}
                            style={{ width: "100%"}}
                        />
                    </Form.Item>
                </Form>    
            </Modal>
       </div> 
    )
};  

export default ProductTable;