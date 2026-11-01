# DT061 — Cài đặt danh sách liên kết đơn với thêm, tìm và xóa

Dự án đề tài cá nhân học phần **Cấu trúc dữ liệu và giải thuật (INT13185 — Nhóm 03)** thực hiện tại **Học viện Công nghệ Bưu chính Viễn thông Cơ sở tại TP. Hồ Chí Minh (PTIT HCM)** — **Khoa Kỹ thuật Điện tử 2**.

## 1. Thông tin chung về đề tài và sinh viên thực hiện

- **Họ và tên sinh viên**: Lê Hoàng Phúc
- **Mã số sinh viên (MSSV)**: `N24DCDT073`
- **Lớp**: `D24CQDT01-N`
- **Khoa / Ngành**: Khoa Kỹ thuật Điện tử 2 — Ngành Kỹ thuật Điện tử - Điện tử
- **Học phần và nhóm**: Cấu trúc dữ liệu và giải thuật (`INT13185` — Nhóm 03)
- **Giảng viên hướng dẫn**: ThS. Hồ Nhựt Minh
- **Mã đề và tên đề tài**: `DT061` — Cài đặt danh sách liên kết đơn với thêm, tìm và xóa
- **Giáo trình căn cứ**: `Giao-trinh-Cau-truc-du-lieu-va-Giai-thuat-INT1306.pdf` (Chương 5: Danh sách liên kết, Ngăn xếp, Hàng đợi; mục 5.1 và mục 5.2.1–5.2.4; Bài tập 5.1; trang in 114–121, 123; trang PDF 126–133, 135)
- **Kho mã nguồn GitHub**: `https://github.com/le-phuc06/DT061_N24DCDT073_LeHoangPhuc`
- **Ngôn ngữ và công nghệ sử dụng**: Julia `1.12.6` (thuật toán lõi, kiểm thử tự động, khảo sát quy mô và máy chủ web nội bộ) kết hợp bộ mã nguồn ứng dụng Web mô phỏng trực quan (`HTML5`, `CSS3 / TailwindCSS`, `JavaScript ES6`, `Chart.js`).

## 2. Cấu trúc thư mục mã nguồn cá nhân (Phân tách rõ Thuật toán, Kiểm thử, Giao diện Web và Minh chứng)

Toàn bộ mã nguồn cá nhân được tổ chức thành các thư mục chuyên biệt để người đọc dễ dàng tra cứu đâu là phần thuật toán lõi, đâu là phần kiểm thử và đâu là phần giao diện Web mô phỏng:

```text
DT061_N24DCDT073_LeHoangPhuc/
├── .gitignore                        # Cấu hình Git bỏ qua các tệp tạm và bộ nhớ đệm
├── README.md                         # Tài liệu tổng quan đề tài, giải thích cấu trúc thư mục và hướng dẫn chạy
├── demo.jl                           # [KỊCH BẢN MINH HỌA CLI] Chạy 2 ví dụ trên phiếu và các ca thực nghiệm A01–A08
├── scales.jl                         # [KHẢO SÁT ĐỘ PHỨC TẠP CLI] Đo đếm số bước thực nghiệm trên 3 quy mô Q1(5), Q2(20), Q3(100)
├── chay_web.jl                       # [MÁY CHỦ KHỞI CHẠY WEB] Máy chủ HTTP viết bằng Julia mở ứng dụng Web tại localhost:8080
│
├── src/                              # [THƯ MỤC THUẬT TOÁN LÕI BẰNG JULIA]
│   └── DeTai.jl                      # Cài đặt cấu trúc Nut, DanhSachLienKet, thêm đầu O(1), thêm cuối O(1), tìm O(n), xóa lần đầu O(n), validator
│
├── test/                             # [THƯ MỤC KIỂM THỬ TỰ ĐỘNG BẰNG JULIA]
│   └── runtests.jl                   # Bộ kiểm thử đơn vị 12 ca độc lập với 50/50 phép kiểm (@test / @test_throws) đạt PASS 100%
│
├── web/                              # [THƯ MỤC MÃ NGUỒN ỨNG DỤNG WEB MÔ PHỎNG TRỰC QUAN]
│   ├── index.html                    # [KHUNG GIAO DIỆN CHÍNH] Trang chính tích hợp 4 phân hệ: Mô phỏng, Kiểm thử 12 ca, Biểu đồ quy mô, Mã nguồn
│   ├── giao_dien/                    # [PHẦN GIAO DIỆN & HIỂN THỊ TRỰC QUAN (UI & VISUALIZATION)]
│   │   ├── style.css                 # Định dạng bố cục, màu sắc con trỏ dau/duoi và hiệu ứng hoạt ảnh khi duyệt/chèn/xóa nút
│   │   └── dieu_khien_ui.js          # Điều khiển sự kiện nút bấm, vẽ sơ đồ nút liên kết, sinh bảng lần vết và vẽ biểu đồ Chart.js
│   ├── thuat_toan/                   # [PHẦN THUẬT TOÁN DSLK ĐƠN TRÊN WEB (ALGORITHM ENGINE)]
│   │   └── dslk_don.js               # Cài đặt lớp Nut, DanhSachLienKet, them_dau, them_cuoi, tim_co_dem, xoa_co_dem, kiem_tra_bat_bien
│   └── du_lieu/                      # [PHẦN DỮ LIỆU KIỂM THỬ & ĐỐI CHIẾU (TEST CASES & DATA)]
│       └── bo_12_ca_kiem_thu.js      # Lưu cấu hình 12 ca kiểm thử độc lập (VD01 -> KT12), 5 ca bắt buộc trên phiếu và mã nguồn đối chiếu
│
└── docs/                             # [THƯ MỤC MINH CHỨNG KẾT QUẢ & NHẬT KÝ THỰC THI]
    ├── anh_ket_qua/                  # Lưu trữ đầy đủ 11 ảnh chụp màn hình thực thi cá nhân (01_vi_du_1.png -> 11_github_repo_commit.png)
    └── logs/                         # Lưu trữ 3 tệp nhật ký xuất từ Terminal (demo.log, tests.log, scales.log)
```

### Giải thích chi tiết vai trò của từng thư mục trong mã nguồn:
- **Thư mục `src/` (Thuật toán lõi Julia)**: Chứa tệp `src/DeTai.jl` là nơi tự cài đặt toàn bộ cấu trúc dữ liệu `Nut`, `DanhSachLienKet`, bộ kiểm tra hợp đồng đầu vào `kiem_tra_dau_vao` và các giải thuật thêm đầu, thêm cuối, tìm kiếm, xóa lần xuất hiện đầu tiên.
- **Thư mục `test/` (Kiểm thử tự động Julia)**: Chứa tệp `test/runtests.jl` thực thi 12 ca kiểm thử độc lập với 50 phép kiểm tự động (`@test` và `@test_throws`).
- **Thư mục `web/` (Ứng dụng Web mô phỏng trực quan tự thiết kế)** được chia thành 3 thư mục con rõ ràng theo kiến trúc tách biệt Thuật toán – Dữ liệu – Giao diện:
  - **Thư mục `web/thuat_toan/` (`dslk_don.js`) — Phần Thuật toán trên Web**: Chứa mã nguồn cài đặt cấu trúc nút `Nut(gia_tri, ke_tiep)`, khung quản lý `DanhSachLienKet(dau, duoi, so_nut)`, hàm kiểm tra điều kiện biên `[-1000, 1000]` và các thuật toán `them_dau`, `them_cuoi`, `them_cuoi_khong_duoi`, `tim_co_dem`, `xoa_co_dem` (sử dụng 2 biến con trỏ `truoc` và `hien_tai`), `dem_nut_duyet`, `kiem_tra_bat_bien`.
  - **Thư mục `web/du_lieu/` (`bo_12_ca_kiem_thu.js`) — Phần Dữ liệu kiểm thử**: Chứa dữ liệu đầu vào, chuỗi lệnh và kết quả kỳ vọng (`Expected`) của toàn bộ 12 ca kiểm thử độc lập (`VD01` đến `KT12`) cùng 5 ca kiểm bắt buộc trên phiếu giao đề tài.
  - **Thư mục `web/giao_dien/` (`style.css` và `dieu_khien_ui.js`) — Phần Giao diện và Trực quan hóa**: Đảm nhiệm việc vẽ sơ đồ khối các nút và mũi tên con trỏ `dau`, `duoi`, `nothing` lên màn hình, tạo hiệu ứng đổi màu từng nút khi thuật toán duyệt qua, tự động xuất bảng lần vết từng bước và vẽ biểu đồ cột so sánh số bước $O(1)$ với $O(n)$.
  - **Tệp `web/index.html` và `chay_web.jl`**: `web/index.html` là trang giao diện chính kết nối 3 phần trên; `chay_web.jl` là máy chủ HTTP nội bộ viết bằng Julia giúp khởi chạy trang web trực tiếp từ dòng lệnh.
- **Thư mục `docs/` (Minh chứng thực nghiệm)**: Gồm `docs/anh_ket_qua/` chứa 11 ảnh chụp kết quả chạy thực tế (`A01` đến `A11`) và `docs/logs/` chứa nhật ký văn bản xuất ra từ `demo.jl`, `runtests.jl` và `scales.jl`.

## 3. Nội dung chuyên môn đã thực hiện trong đề tài DT061

### 3.1. Mô hình dữ liệu và các thao tác tự cài đặt
- **Biểu diễn nút và danh sách**: Mỗi nút `Nut` lưu giá trị nguyên `gia_tri::Int` trong đoạn `[-1000, 1000]` và con trỏ `ke_tiep::Union{Nut, Nothing}` (nút cuối luôn trỏ tới `nothing`). Cấu trúc `DanhSachLienKet` quản lý đồng thời con trỏ đầu `dau`, con trỏ cuối `duoi` và số lượng nút `so_nut` (`0 <= so_nut <= 1000`).
- **Thêm vào đầu (`them_dau!`)**: Cấp phát nút mới trỏ vào `dau` cũ, cập nhật lại `dau` (và `duoi` nếu danh sách trước đó rỗng), tăng `so_nut` lên 1 trong thời gian hằng số $O(1)$ (1 bước).
- **Thêm vào cuối (`them_cuoi!` và `them_cuoi_khong_duoi!`)**: Bản chính thức sử dụng con trỏ `duoi` để nối trực tiếp nút mới vào cuối danh sách trong thời gian $O(1)$ (1 bước). Đồng thời cài đặt thêm hàm `them_cuoi_khong_duoi!` duyệt tuần tự từ `dau` mất $O(n)$ bước để đối chiếu hiệu quả tối ưu theo đúng mục 7 của phiếu giao đề tài.
- **Tìm kiếm tuần tự (`tim` và `tim_co_dem`)**: Duyệt từ `dau` qua từng nút theo liên kết `ke_tiep` với chi phí $O(n)$; trả về `true` ngay khi gặp nút đầu tiên có `gia_tri == x`, hoặc trả về `false` nếu danh sách rỗng hay duyệt hết không thấy.
- **Xóa lần xuất hiện đầu tiên (`xoa!` và `xoa_co_dem!`)**: Sử dụng cặp biến con trỏ `truoc` và `hien_tai` duyệt tìm nút đầu tiên mang giá trị `x` trong thời gian $O(n)$:
  - Nếu nút cần xóa nằm ngay ở `dau`: dịch `dau = dau.ke_tiep`, giảm `so_nut` đi 1; nếu `so_nut == 0` thì cập nhật luôn `duoi = nothing` để không bị treo con trỏ đuôi.
  - Nếu nút cần xóa nằm ở giữa hoặc cuối: nối tắt `truoc.ke_tiep = hien_tai.ke_tiep`; nếu `hien_tai === duoi` (xóa nút cuối) thì lùi con trỏ đuôi về `duoi = truoc`.
  - Nếu danh sách rỗng hoặc không có giá trị `x`: trả về `false` và giữ nguyên toàn bộ danh sách.

### 3.2. Kiểm chứng thực nghiệm trên 2 ví dụ, 12 ca kiểm thử và 3 quy mô dữ liệu
- **Ví dụ 1 (`VD01`)**: Khởi tạo `[5, 9]`, thực hiện `them_dau(2); xoa(9); them_cuoi(7)` cho kết quả `[2, 5, 7]; n=3` và `xoa(9)=true`.
- **Ví dụ 2 (`VD02`)**: Khởi tạo `[4, 4]`, thực hiện `xoa(4); tim(4)` cho kết quả `[4]; n=1`, `xoa(4)=true` và `tim(4)=true` (chỉ xóa nút `4` đầu tiên).
- **Năm ca bắt buộc trên phiếu giao đề tài**:
  - Ca phiếu 1 (`[]; tim(3) -> false`) và Ca phiếu 2 (`[]; xoa(3) -> false, vẫn rỗng`): được kiểm chứng tại ca `BIEN01`.
  - Ca phiếu 3 (`[7]; xoa(7) -> [], n=0`): được kiểm chứng tại ca `BIEN02`.
  - Ca phiếu 4 (`[2, 2, 3]; xoa(2) -> [2, 3]`): được kiểm chứng tại ca `TK02`.
  - Ca phiếu 5 (`[1, 3]; xoa(3); them_cuoi(5) -> [1, 5]`): được kiểm chứng tại ca `BIEN03`.
- **Khảo sát 3 quy mô hợp lệ `Q1 (n = 5)`, `Q2 (n = 20)`, `Q3 (n = 100)`**: Khi `n` tăng từ `5` lên `20` (gấp 4 lần) và từ `20` lên `100` (gấp 5 lần), số bước đi qua nút của thao tác tìm nút cuối, xóa nút cuối và thêm cuối không giữ đuôi tăng tuyến tính đúng bằng `5`, `20` và `100 bước` ($O(n)$); trong khi thêm đầu và thêm cuối có giữ con trỏ `duoi` luôn giữ nguyên `1 bước` ($O(1)$).

## 4. Hướng dẫn cách chạy chương trình Julia và ứng dụng Web

### 4.1. Cách chạy chương trình thuật toán và kiểm thử trên Terminal
Mở cửa sổ **PowerShell** hoặc **Terminal** tại thư mục gốc của dự án (`DT061_N24DCDT073_LeHoangPhuc`) và chạy các lệnh sau:

```powershell
# Bước 1: Kiểm tra phiên bản Julia
julia --version

# Bước 2: Chạy minh họa 2 ví dụ trên phiếu và các ca thực nghiệm A01–A08
julia --startup-file=no demo.jl

# Bước 3: Chạy bộ kiểm thử tự động 12 ca độc lập (đạt 12/12 ca PASS, 50/50 phép kiểm @test)
julia --startup-file=no test/runtests.jl

# Bước 4: Chạy khảo sát số bước thực nghiệm trên 3 quy mô Q1(n=5), Q2(n=20), Q3(n=100)
julia --startup-file=no scales.jl
```

### 4.2. Cách khởi chạy ứng dụng Web mô phỏng trực quan (`web/`)
Bạn có thể chạy ứng dụng Web theo 1 trong 2 cách sau:

- **Cách 1 — Chạy thông qua máy chủ Web Julia (`chay_web.jl`) từ Terminal**:
  Tại thư mục gốc của dự án, gõ lệnh:
  ```powershell
  julia --startup-file=no chay_web.jl
  ```
  Tệp `chay_web.jl` sẽ khởi tạo máy chủ HTTP cục bộ đọc trực tiếp các thư mục `web/index.html`, `web/giao_dien/`, `web/thuat_toan/`, `web/du_lieu/` tại địa chỉ `http://localhost:8080` và tự động mở trình duyệt web.

- **Cách 2 — Mở trực tiếp tệp giao diện trên trình duyệt (không cần dùng Terminal)**:
  Mở thư mục `web/` và nhấp đúp chuột vào tệp `web/index.html` bằng trình duyệt Google Chrome, Microsoft Edge hoặc Brave để sử dụng ngay toàn bộ các chức năng: mô phỏng con trỏ trực quan, nạp nhanh 12 ca kiểm thử, nhập input tùy chỉnh để xuất bảng lần vết từng bước và xem biểu đồ khảo sát độ phức tạp.
