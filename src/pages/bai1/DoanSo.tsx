import React, { useState } from "react";

const TroChoiDoanSo: React.FC = () => {
  const taoSoNgauNhien = () => Math.floor(Math.random() * 100) + 1;

  const [soCanDoan, setSoCanDoan] = useState<number>(taoSoNgauNhien());
  const [soDuDoan, setSoDuDoan] = useState<string>("");
  const [thongBao, setThongBao] = useState<string>("Bạn có 10 lượt đoán!");
  const [soLuotConLai, setSoLuotConLai] = useState<number>(10);
  const [daKetThuc, setDaKetThuc] = useState<boolean>(false);

  const xuLyDoanSo = () => {
    if (daKetThuc) return;

    const giaTriDuDoan = parseInt(soDuDoan);

    if (isNaN(giaTriDuDoan) || giaTriDuDoan < 1 || giaTriDuDoan > 100) {
      setThongBao("Vui lòng nhập số từ 1 đến 100!");
      return;
    }

    if (giaTriDuDoan < soCanDoan) {
      setThongBao("Bạn đoán quá thấp!");
    } else if (giaTriDuDoan > soCanDoan) {
      setThongBao("Bạn đoán quá cao!");
    } else {
      setThongBao("Chúc mừng! Bạn đã đoán đúng!");
      setDaKetThuc(true);
      return;
    }

    const luotMoi = soLuotConLai - 1;
    setSoLuotConLai(luotMoi);

    if (luotMoi === 0) {
      setThongBao(`Bạn đã hết lượt! Số đúng là ${soCanDoan}`);
      setDaKetThuc(true);
    }

    setSoDuDoan("");
  };

  const choiLai = () => {
    setSoCanDoan(taoSoNgauNhien());
    setSoLuotConLai(10);
    setThongBao("Bạn có 10 lượt đoán!");
    setSoDuDoan("");
    setDaKetThuc(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Trò chơi đoán số (1 - 100)</h2>

      <p>{thongBao}</p>
      <p>Còn lại: {soLuotConLai} lượt</p>

      <input
        type="number"
        value={soDuDoan}
        onChange={(e) => setSoDuDoan(e.target.value)}
        disabled={daKetThuc}
        placeholder="Nhập số từ 1 đến 100"
      />

      <button onClick={xuLyDoanSo} disabled={daKetThuc} style ={{ marginLeft: 10 }}>
        Đoán
      </button>

      <button onClick={choiLai} style={{ marginLeft: "10px" }}>
        Chơi lại
      </button>

      <ul style= {{marginTop: 40}}>
        <li>Hệ thống sẽ tạo một số ngẫu nhiên từ 1 đến 100.</li>
        <li>Bạn có 10 lượt để đoán số đó.</li>
        <li>Sau mỗi lượt đoán, hệ thống sẽ thông báo nếu số bạn đoán quá cao, quá thấp hoặc chính xác.</li>
      </ul>
    </div>
  );
};

export default TroChoiDoanSo;