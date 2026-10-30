include(joinpath(@__DIR__, "src", "DeTai.jl"))
using .DeTai

println("================================================================================")
println("KHẢO SÁT BA QUY MÔ HỢP LỆ Q1 (n=5), Q2 (n=20), Q3 (n=100) — ĐỀ TÀI DT061")
println("================================================================================")
println(rpad("Bộ", 6), rpad("Quy mô n", 12), rpad("Thêm đầu", 12), rpad("Tìm cuối", 12), rpad("Xóa cuối", 12), rpad("Thêm cuối (không đuôi)", 24), "Thêm cuối (có đuôi)")
println(repeat("-", 96))

for (ten_bo, n) in [("Q1", 5), ("Q2", 20), ("Q3", 100)]
    mang = collect(1:n)
    ds = khoi_tao_danh_sach(mang)

    # Đếm bước tìm phần tử cuối n
    kq_tim, buoc_tim = tim_co_dem(ds, n)

    # Đếm bước xóa phần tử cuối n
    kq_xoa, buoc_xoa = xoa_co_dem!(ds, n)

    # Khôi phục lại nút cuối bằng thêm cuối không dùng con trỏ đuôi để đếm số bước duyệt
    _, buoc_them_cuoi_ko_duoi = them_cuoi_khong_duoi!(ds, n)

    # Thêm đầu O(1) và thêm cuối có con trỏ đuôi O(1)
    buoc_them_dau = 1
    buoc_them_cuoi_co_duoi = 1

    println(
        rpad(ten_bo, 6),
        rpad("n = $n", 12),
        rpad("$buoc_them_dau bước", 12),
        rpad("$buoc_tim bước", 12),
        rpad("$buoc_xoa bước", 12),
        rpad("$(buoc_them_cuoi_ko_duoi) bước (O(n))", 24),
        "$buoc_them_cuoi_co_duoi bước (O(1))"
    )
end
println("================================================================================")
println("Nhận xét: Khi n tăng từ 5 -> 20 (gấp 4 lần) và từ 20 -> 100 (gấp 5 lần),")
println("số bước duyệt của Tìm kiếm, Xóa nút cuối và Thêm cuối (không giữ đuôi) tăng")
println("tuyến tính đúng tỉ lệ O(n); trong khi Thêm đầu và Thêm cuối (giữ con trỏ đuôi) luôn cố định 1 bước O(1).")
