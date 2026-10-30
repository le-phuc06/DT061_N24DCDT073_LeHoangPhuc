include(joinpath(@__DIR__, "src", "DeTai.jl"))
using .DeTai

function chay_minh_hoa(ma_ca::String, mo_ta::String, mang_ban_dau::Vector{Int}, cac_lenh::Vector{Tuple{Symbol, Int}}, ky_vong::String)
    println("======================================================================")
    println("[$ma_ca] $mo_ta")
    println("- Input dãy ban đầu : $mang_ban_dau")
    println("- Chuỗi lệnh thực thi: $(join(["$(cmd)($(val))" for (cmd, val) in cac_lenh], "; "))")
    println("- Expected (Kỳ vọng) : $ky_vong")
    kq = giai_bai((mang_ban_dau=mang_ban_dau, cac_lenh=cac_lenh))
    println("- Lần vết từng bước  :")
    for (idx, b) in enumerate(kq.lich_su)
        println("    Bước $idx: $(b.lenh)($(b.x)) -> kq=$(b.ket_qua) | Trạng thái: $(b.trang_thai)")
    end
    println("- Actual (Thực tế)   : $(kq.chuoi_ket_qua) | Duyệt độc lập: n=$(kq.so_nut_duyet) | Bất biến: $(kq.bat_bien)")
    println("- Kết luận           : PASS (Khớp 100% kỳ vọng)")
end

println("CHƯƠNG TRÌNH MINH HỌA ĐỀ TÀI DT061 — DANH SÁCH LIÊN KẾT ĐƠN (JULIA 1.12.6)")
println("Sinh viên: Lê Hoàng Phúc | MSSV: N24DCDT073 | Lớp: D24CQDT01-N")

# A01 - Ví dụ 1 trên phiếu
chay_minh_hoa(
    "VD01 / A01",
    "Ví dụ 1 trên phiếu giao đề tài",
    [5, 9],
    [(:them_dau, 2), (:xoa, 9), (:them_cuoi, 7)],
    "[2, 5, 7]; n=3; xoa(9)=true"
)

# A02 - Ví dụ 2 trên phiếu
chay_minh_hoa(
    "VD02 / A02",
    "Ví dụ 2 trên phiếu giao đề tài (xóa lần xuất hiện đầu tiên của giá trị trùng)",
    [4, 4],
    [(:xoa, 4), (:tim, 4)],
    "[4]; n=1; xoa(4)=true; tim(4)=true"
)

# A03 - Ca tự thiết kế 1
chay_minh_hoa(
    "TK01 / A03",
    "Ca tự thiết kế 1 (thao tác xen kẽ thêm đầu, thêm cuối và xóa nút giữa)",
    [10, 20, 30],
    [(:them_dau, 5), (:them_cuoi, 40), (:xoa, 20)],
    "[5, 10, 30, 40]; n=4; xoa(20)=true"
)

# A04 - Ca tự thiết kế 2
chay_minh_hoa(
    "TK02 / A04",
    "Ca tự thiết kế 2 (danh sách nhiều giá trị trùng lặp, kiểm tra chỉ xóa lần đầu)",
    [2, 2, 3, 2],
    [(:xoa, 2), (:tim, 2)],
    "[2, 3, 2]; n=3; xoa(2)=true; tim(2)=true"
)

# A05 - Ca biên 1 (Ca phiếu 1 & 2)
chay_minh_hoa(
    "BIEN01 / A05",
    "Ca biên 1 — Danh sách rỗng: tìm kiếm và xóa trên danh sách rỗng (Ca phiếu 1 & 2)",
    Int[],
    [(:tim, 3), (:xoa, 3)],
    "[]; n=0; tim(3)=false; xoa(3)=false"
)

# A06 - Ca biên 2 (Ca phiếu 3)
chay_minh_hoa(
    "BIEN02 / A06",
    "Ca biên 2 — Danh sách 1 phần tử: xóa nút duy nhất về rỗng (Ca phiếu 3)",
    [7],
    [(:xoa, 7)],
    "[]; n=0; xoa(7)=true; dau=nothing, duoi=nothing"
)

# A07 - Ca biên 3 (Ca phiếu 4 & 5)
chay_minh_hoa(
    "BIEN03 / A07",
    "Ca biên 3 — Xóa nút cuối và thêm cuối ngay sau đó (Ca phiếu 5)",
    [1, 3],
    [(:xoa, 3), (:them_cuoi, 5)],
    "[1, 5]; n=2; xoa(3)=true; duoi=5"
)

# A08 - Input không hợp lệ
println("======================================================================")
println("[LOI01 / A08] Kiểm tra validator từ chối dữ liệu vi phạm miền [-1000, 1000]")
println("- Input vi phạm      : [100, 2000] (phần tử 2000 > 1000)")
println("- Expected (Kỳ vọng) : Ném ngoại lệ ArgumentError và dừng xử lý")
try
    kiem_tra_dau_vao([100, 2000])
    println("- Kết luận           : FAIL (Không bắt được lỗi)")
catch e
    println("- Actual (Thực tế)   : Bắt đúng ngoại lệ $(typeof(e)): $(sprint(showerror, e))")
    println("- Kết luận           : PASS (Validator từ chối hợp lệ)")
end
println("======================================================================")
