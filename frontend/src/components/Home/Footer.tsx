const Footer = () => {
  return (
    <footer className="bg-[#0A1E3A] text-white py-10 text-sm">
      <div className="container w-full grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo và thông tin công ty */}
        <div className="col-span-1 space-y-1 mx-10">
          <img
            src="/images/Logo/logo.png"
            alt="Logo InnoTrade"
            className="w-24 mb-4"
          />
          <p>Công ty TNHH Du Lịch và Dịch Vụ Mixivivu</p>
          <p>
            Tầng 7, số nhà 25, ngõ 38 phố Yên Lãng, phường Láng Hạ, quận Đống
            Đa, TP. Hà Nội
          </p>
          <p>
            Mã số doanh nghiệp: 0110376372 do Sở Kế hoạch và Đầu tư Thành phố Hà
            Nội cấp ngày 05/06/2023
          </p>
        </div>

        {/* Giới thiệu */}
        <div>
          <h4 className="font-bold mb-4 space-y-5">GIỚI THIỆU</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Điều khoản và điều kiện
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Chính sách riêng tư
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Hướng dẫn sử dụng
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Hình thức thanh toán
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Liên hệ
              </a>
            </li>
            <li>Hotline: 0922222016</li>
            <li>Email: info@mixivivu.com</li>
          </ul>
        </div>

        {/* Điểm đến */}
        <div>
          <h4 className="font-bold mb-4">ĐIỂM ĐẾN</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Vịnh Hạ Long
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Vịnh Lan Hạ
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Đảo Cát Bà
              </a>
            </li>
          </ul>
        </div>

        {/* Du thuyền */}
        <div>
          <h4 className="font-bold mb-4">DU THUYỀN</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Quy định chung và lưu ý
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Câu hỏi thường gặp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Phần dưới cùng */}
      {/* <div className="container mx-auto mt-8 text-center text-sm">
        <p>Hotline: 0922222016 | Email: info@mixivivu.com</p>
      </div> */}
    </footer>
  );
};

export default Footer;
