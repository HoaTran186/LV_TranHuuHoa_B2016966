"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Introduce() {
  return (
    <div className="flex flex-col mb-5">
      <div className="mx-[12rem] -mt-1 h-10 fixed bg-white">
        <div className="flex space-x-60">
          <div className="font-bold text-3xl">Giới thiệu</div>
          <div className="flex space-x-16 text-[1rem] items-center">
            <div
              className="cursor-pointer hover:text-teal-500"
              onClick={() => {
                const introduceElement = document.getElementById("introduce");
                if (introduceElement) {
                  introduceElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }}
            >
              Giới thiệu
            </div>
            <div
              className="cursor-pointer hover:text-teal-500"
              onClick={() => {
                const missionElement = document.getElementById("mission");
                if (missionElement) {
                  missionElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }}
            >
              Chức năng nhiệm vụ
            </div>
            <div
              className="cursor-pointer hover:text-teal-500"
              onClick={() => {
                const researchElement = document.getElementById("research");
                if (researchElement) {
                  researchElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }}
            >
              Một số nội dung hợp tác nghiên cứu
            </div>
          </div>
        </div>
      </div>
      <div className="mt-24 mx-[12.5rem] space-y-5">
        <div className="space-y-2 ml-2">
          <p className="font-bold text-2xl -ml-2" id="introduce">
            Giới thiệu
          </p>
          <p className="font-bold text-teal-500 text-xl">---------</p>
          <div className="text-sm">
            <p>
              Trung tâm Chuyển giao Công nghệ và Dịch vụ là đơn vị trực thuộc
              Trường Đại học Cần Thơ.
            </p>
            <p>
              Tên giao dịch tiếng Việt: Trung tâm Chuyển giao công nghệ và Dịch
              vụ.
            </p>
            <p>Tên tiếng Anh: Center for Technology Transfer and Services.</p>
            <p>
              Địa chỉ: Khu II, Trường Đại học Cần Thơ, đường 3/2, phường Xuân
              Khánh, quận Ninh Kiều, thành phố Cần Thơ.
            </p>
            <p>Mã số thuế: 1800424257-008.</p>
            <p>Điện thoại: 0292. 3734.652 - 3872.889</p>
            <p>Website: http://ctts.ctu.edu.vn</p>
            <p>Email: ttcgcndv@ctu.edu.vn</p>
          </div>
        </div>
        <div className="space-y-2 ml-2">
          <p className="font-bold text-2xl -ml-2" id="mission">
            Chức năng nhiệm vụ
          </p>
          <p className="font-bold text-teal-500 text-xl">---------</p>
          <div className="text-sm">
            <p className="font-bold">a. Vị trí của Trung tâm</p>
            <div className="ml-3">
              <p>
                Trung tâm là đơn vị sự nghiệp có thu, tự đảm bảo chi phí hoạt
                động, trực thuộc Trường Đại học Cần Thơ.
              </p>
              <p>
                Trung tâm có tư cách pháp nhân (có con dấu, tài khoản, mã số
                thuế riêng) và hoạt động theo mô hình trung tâm.
              </p>
            </div>

            <p className="font-bold">b. Chức năng của Trung tâm</p>
            <div className="ml-3">
              <p>
                Thực hiện chức năng tham mưu, quản lý, kiểm tra, giám sát, hỗ
                trợ và tổ chức các hoạt động sản xuất - dịch vụ; phát triển và
                chuyển giao khoa học công nghệ của Trường để tạo nguồn thu cho
                Trường.
              </p>
            </div>

            <p className="font-bold">c. Nhiệm vụ và quyền hạn của Trung tâm</p>
            <div className="ml-3">
              <p>
                Tổ chức hoạt động chuyển giao công nghệ của Trường để đóng góp
                nguồn thu cho Trường.
              </p>
              <p>
                Thương mại hóa các tài sản sở hữu trí tuệ và khai thác tối đa
                hiệu quả sử dụng tài sản của Trường để tăng nguồn thu cho
                Trường.
              </p>
              <p>
                Tư vấn lập dự án phát triển kinh tế - xã hội cho địa phương.
              </p>
              <p>
                Tư vấn và lập chiến lược kinh doanh, kế hoạch phát triển từng
                giai đoạn cho doanh nghiệp.
              </p>
              <p>
                Tư vấn và thực hiện các đề tài, dự án về đất đai các lĩnh vực
                như: Quản lý và khai thác các nguồn tài nguyên đất đai; Đánh
                giá, quy hoạch sử dụng đất đai, đô thị, nông thôn; Phân tích
                thẩm định giá, thị trường bất động sản; Bảo tồn hệ sinh thái đất
                ngập nước, rừng ngập mặn; Hình thái, vi hình thái, phân loại đất
                và độ phì đất.
              </p>
              <p>
                Thực hiện các lớp tập huấn, bồi dưỡng kiến kiến chuyên ngành bao
                gồm các lĩnh vực: Nông nghiệp, Thủy sản, Môi trường, Kinh tế, …
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2 ml-2">
          <p className="font-bold text-2xl -ml-2" id="research">
            Một số nội dung hợp tác nghiên cứu tiêu biểu
          </p>
          <p className="font-bold text-teal-500 text-xl">---------</p>
          <div className="text-sm">
            <p>
              Hiện nay, đơn vị đang hợp tác cùng với cán bộ thuộc các Khoa của
              Trường Đại học Cần Thơ và các địa phương ĐBSCL, thực hiện các đề
              tài nghiên cứu khoa học và chuyển giao các quy trình, công nghệ
              phục vụ cho sự phát triển KT-XH của từng địa phương như sau:
            </p>
            <p>
              Nghiên cứu chế biến đa dạng các sản phẩm từ khóm Cầu Đúc Hậu Giang
              và tận dụng phế liệu cho quá trình ly trích enzyme bromelin.
            </p>
            <p>
              Xây dựng các mô hình canh tác hiệu quả trên đất phèn khu vực tái
              định cư khí điện đạm Cà Mau.
            </p>
            <p>
              Nghiên cứu một số biện pháp cải thiện năng suất và hiệu quả kinh
              tế vườn dừa cũ và khảo sát khả năng phát triển của một số giống
              dừa có giá trị kinh tế cao tại Cà Mau.
            </p>
            <p>
              Nghiên cứu hạn chế sự phát triển của vẹm sông sống bám trên ốc gạo
              Bến Tre.
            </p>
            <p>
              Xây dựng mô hình đánh giá chất lượng chôm chôm ứng với các điều
              kiện xử lý khác nhau sau thu hoạch tại Bến Tre.
            </p>
            <p>
              Chuyển giao kỹ thuật sinh sản nhân tạo cá Tra cho Cty CP XNK thủy
              sản CT (Casemex).
            </p>
            <p>
              Sử dụng enzyme cholinesterase để đánh giá nước nhiễm bẩn thuốc
              BVTV đến cá lóc đồng.
            </p>
            <p>
              Xây dựng quy trình sản xuất rượu vang thốt nốt từ thốt nốt tự
              nhiên
            </p>
            <p>
              Phát triển vùng canh tác gấc cho sản xuất dược liệu tại Tri Tôn,
              An Giang.
            </p>
            <p>Thực nghiệm sản xuất giống nhân tạo Cá linh giống An Giang.</p>
            <p>
              Lai tạo và tuyển chọn giống lúa thơm Bảy Núi chất lượng cao và
              chống chịu sâu bệnh tốt.
            </p>
            <p>
              Nghiên cứu quy trình kỹ thuật ương và nuôi thương phẩm cá Leo.
            </p>
            <p>
              Chuyển giao công nghệ nuôi, sơ chế trứng tế bào xác Artemia cho Sở
              KH&CN Sóc Trăng.
            </p>
            <p>
              Xây dựng quy trình quản lý hiện tượng thối trái Gấc tại vùng Bảy
              Núi - An Giang
            </p>
            <p>
              Xây dựng quy trình quản lý tổng hợp bệnh hại quan trọng trên cây
              Nghệ tại vùng Bảy Núi - An Giang.
            </p>
            <p>
              Xây dựng hệ thống quan trắc môi trường nước phục vụ cho sản xuất
              nông nghiệp huyện Long Mỹ - Hậu Giang
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
