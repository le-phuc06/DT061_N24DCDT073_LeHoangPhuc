# DT061 — Cài đặt danh sách liên kết đơn với thêm, tìm và xóa

Dự án đề tài cá nhân học phần **Cấu trúc dữ liệu và giải thuật (INT13185 — Nhóm 03)** tại Học viện Công nghệ Bưu chính Viễn thông Cơ sở tại TP. Hồ Chí Minh.

## Thông tin và căn cứ

- **Họ tên, MSSV, lớp**: Lê Hoàng Phúc — `N24DCDT073` — `D24CQDT01-N`
- **Giảng viên hướng dẫn**: ThS. Hồ Nhựt Minh
- **Mã và tên đề tài**: `DT061` — Cài đặt danh sách liên kết đơn với thêm, tìm và xóa
- **Giáo trình**: `Giao-trinh-Cau-truc-du-lieu-va-Giai-thuat-INT1306.pdf`
- **Chương, mục, bài tập, trang in và trang PDF đúng đề**: Chương 5, mục 5.2.1–5.2.4; Bài 5.1; trang in 115–121, 123; trang PDF 127–133, 135
- **URL GitHub thật**: `https://github.com/le-phuc06/DT061_N24DCDT073_LeHoangPhuc`
- **SHA chạy C**: `99431c2c235dce16e5f9e27cdd76c472dc1b15fc`
- **Permalink tệp thuật toán tại C**: `https://github.com/le-phuc06/DT061_N24DCDT073_LeHoangPhuc/blob/7457a6dfd31c5d73cddc58fa446d797c63824f71/src/DeTai.jl`
- **Permalink tệp kiểm thử tại C**: `https://github.com/le-phuc06/DT061_N24DCDT073_LeHoangPhuc/blob/e1f9150b61e7b571f6c78f50aa9877c6c5961d38/test/runtests.jl`
- **Phiên bản ngôn ngữ**: Julia `1.12.6`

## Hợp đồng đầu vào / đầu ra và cấu trúc dữ liệu tự cài

1. **Cấu trúc dữ liệu tự xây dựng (`src/DeTai.jl`)**:
   - `mutable struct Nut`: Lưu giá trị nguyên `gia_tri::Int` và liên kết `ke_tiep::Union{Nut, Nothing}` (nút cuối luôn trỏ tới `nothing`).
   - `mutable struct DanhSachLienKet`: Quản lý con trỏ đầu `dau::Union{Nut, Nothing}`, con trỏ cuối `duoi::Union{Nut, Nothing}` và số lượng nút `so_nut::Int`.
2. **Hợp đồng dữ liệu**:
   - Dãy ban đầu có độ dài `0 <= n <= 1000`, mỗi phần tử nguyên thuộc đoạn `[-1000, 1000]`.
   - Hàm validator `kiem_tra_dau_vao(mang)` và `kiem_tra_gia_tri(x)` kiểm tra nghiêm ngặt miền dữ liệu và ném ngoại lệ `ArgumentError` nếu vi phạm.
3. **Các thao tác chính**:
   - `them_dau!(ds, x)`: Thêm nút chứa `x` vào đầu danh sách với độ phức tạp $O(1)$.
   - `them_cuoi!(ds, x)`: Thêm nút chứa `x` vào cuối danh sách với độ phức tạp $O(1)$ nhờ con trỏ `duoi` (kèm hàm `them_cuoi_khong_duoi!` $O(n)$ để đối chiếu khảo sát).
   - `them!(ds, x, vi_tri)`: Hàm tổng quát thêm vào `:dau` hoặc `:cuoi`.
   - `tim(ds, x)`: Duyệt tuần tự kiểm tra giá trị `x` với độ phức tạp $O(n)$.
   - `xoa!(ds, x)`: Xóa lần xuất hiện đầu tiên của `x` bằng cặp biến `truoc`, `hien_tai` trong $O(n)$; cập nhật `dau` khi xóa nút đầu và cập nhật `duoi` khi xóa nút cuối; trả `false` và giữ nguyên danh sách nếu không tìm thấy.
   - `in_danh_sach(ds)` & `kiem_tra_bat_bien(ds)`: Xuất trạng thái danh sách `[e1, e2, ...]; n=...` và kiểm chứng bất biến bằng lượt duyệt độc lập.

## Hướng dẫn chạy chương trình và kiểm thử

Mở terminal tại thư mục gốc của kho mã nguồn:

```powershell
julia --version
julia --startup-file=no demo.jl
julia --startup-file=no test/runtests.jl
julia --startup-file=no scales.jl
```

- **Kết quả kiểm thử thực tế**: **12/12 ca kiểm thử độc lập PASS** (`VD01`, `VD02`, `TK01`, `TK02`, `BIEN01`, `BIEN02`, `BIEN03`, `LOI01`, `KT09`, `KT10`, `KT11`, `KT12`) với **50/50 phép kiểm (`@test`) đạt 100%**.
- **Kết quả khảo sát quy mô**: Khảo sát trên 3 quy mô hợp lệ $n = 5, 20, 100$ trong `scales.jl`, ghi log tại `docs/logs/scales.log`.

## Danh mục 11 ảnh minh chứng (`docs/anh_ket_qua/`)

| Mã ảnh | Hình trong báo cáo | Tên tệp | Mục tiêu minh chứng |
|---|---|---|---|
| A01 | Hình 4.1 | `01_vi_du_1.png` | Thực thi Ví dụ 1 trên phiếu: `[5,9]; them_dau(2); xoa(9); them_cuoi(7) -> [2, 5, 7]; n=3` |
| A02 | Hình 4.2 | `02_vi_du_2.png` | Thực thi Ví dụ 2 trên phiếu: `[4,4]; xoa(4); tim(4) -> [4]; n=1; tim=true` |
| A03 | Hình 4.3 | `03_tu_thiet_ke_1.png` | Ca tự thiết kế 1 (`TK01`): Thêm đầu, thêm cuối và xóa nút ở giữa |
| A04 | Hình 4.4 | `04_tu_thiet_ke_2.png` | Ca tự thiết kế 2 (`TK02`): Danh sách nhiều phần tử trùng, chỉ xóa lần đầu |
| A05 | Hình 4.5 | `05_bien_1.png` | Ca biên 1 (`BIEN01` — Ca phiếu 1 & 2): Tìm và xóa trên danh sách rỗng `[]` |
| A06 | Hình 4.6 | `06_bien_2.png` | Ca biên 2 (`BIEN02` — Ca phiếu 3): Xóa nút duy nhất `[7] -> []; n=0` |
| A07 | Hình 4.7 | `07_bien_3.png` | Ca biên 3 (`BIEN03` — Ca phiếu 5): Xóa nút cuối và thêm cuối `[1,3] -> [1,5]` |
| A08 | Hình 4.8 | `08_input_khong_hop_le.png` | Kiểm tra validator (`LOI01`): Từ chối input `[100, 2000]` bằng `ArgumentError` |
| A09 | Hình 4.9 | `09_tong_ket_kiem_thu.png` | Chạy `test/runtests.jl`: 12/12 ca kiểm độc lập PASS, 50/50 asserts đạt |
| A10 | Hình 4.10 | `10_clone_sach_chay_lai.png` | Clone sạch commit `C` sang thư mục mới, kiểm tra SHA HEAD và chạy lại demo + test |
| A11 | Hình 4.11 | `11_github_repo_commit.png` | Giao diện kho GitHub thật và commit `C` (`c8f1e24a`) của sinh viên |
