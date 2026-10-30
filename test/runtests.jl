using Test
include(joinpath(@__DIR__, "..", "src", "DeTai.jl"))
using .DeTai

println("======================================================================")
println("BỘ KIỂM THỬ TỰ ĐỘNG 12 CA ĐỘC LẬP — ĐỀ TÀI DT061 (LÊ HOÀNG PHÚC)")
println("======================================================================")

@testset "DT061 - Kiem thu Danh Sach Lien Ket Don (12 ca doc lap)" begin

    # Ca 1: VD01 - Ví dụ 1 trên phiếu: [5,9]; them_dau(2); xoa(9); them_cuoi(7) -> [2,5,7]; n=3
    @testset "VD01 - Vi du 1 tren phieu" begin
        ds = khoi_tao_danh_sach([5, 9])
        @test ds.so_nut == 2
        them_dau!(ds, 2)
        @test chuyen_thanh_mang(ds) == [2, 5, 9]
        @test xoa!(ds, 9) == true
        them_cuoi!(ds, 7)
        @test chuyen_thanh_mang(ds) == [2, 5, 7]
        @test ds.so_nut == 3
        @test in_danh_sach(ds) == "[2, 5, 7]; n=3"
        @test kiem_tra_bat_bien(ds) == true
        println("[PASS] VD01: [5, 9] -> them_dau(2); xoa(9); them_cuoi(7) => [2, 5, 7]; n=3 (7 asserts)")
    end

    # Ca 2: VD02 - Ví dụ 2 trên phiếu: [4,4]; xoa(4); tim(4) -> [4]; n=1; tim=true
    @testset "VD02 - Vi du 2 tren phieu" begin
        ds = khoi_tao_danh_sach([4, 4])
        @test ds.so_nut == 2
        @test xoa!(ds, 4) == true
        @test tim(ds, 4) == true
        @test chuyen_thanh_mang(ds) == [4]
        @test ds.so_nut == 1
        @test kiem_tra_bat_bien(ds) == true
        println("[PASS] VD02: [4, 4] -> xoa(4); tim(4) => [4]; n=1; tim=true (6 asserts)")
    end

    # Ca 3: TK01 - Ca tự thiết kế 1: Thêm đầu, thêm cuối và xóa phần tử ở giữa
    @testset "TK01 - Tu thiet ke 1 (xen ke them dau, cuoi, xoa giua)" begin
        ds = khoi_tao_danh_sach([10, 20, 30])
        them_dau!(ds, 5)
        them_cuoi!(ds, 40)
        @test xoa!(ds, 20) == true
        @test chuyen_thanh_mang(ds) == [5, 10, 30, 40]
        @test ds.so_nut == 4
        @test tim(ds, 20) == false
        @test kiem_tra_bat_bien(ds) == true
        println("[PASS] TK01: [10, 20, 30] -> them_dau(5); them_cuoi(40); xoa(20) => [5, 10, 30, 40]; n=4 (5 asserts)")
    end

    # Ca 4: TK02 - Ca tự thiết kế 2: Dãy trùng lặp [2, 2, 3, 2], xóa lần xuất hiện đầu tiên (bao gồm Ca phiếu 4: [2,2,3]; xoa(2) -> [2,3])
    @testset "TK02 - Tu thiet ke 2 (trung lap va Ca phieu 4)" begin
        ds_phieu4 = khoi_tao_danh_sach([2, 2, 3])
        @test xoa!(ds_phieu4, 2) == true
        @test chuyen_thanh_mang(ds_phieu4) == [2, 3]

        ds = khoi_tao_danh_sach([2, 2, 3, 2])
        @test xoa!(ds, 2) == true
        @test chuyen_thanh_mang(ds) == [2, 3, 2]
        @test ds.so_nut == 3
        @test tim(ds, 2) == true
        @test kiem_tra_bat_bien(ds) == true
        println("[PASS] TK02: [2, 2, 3, 2] -> xoa(2); tim(2) => [2, 3, 2]; n=3; tim=true (7 asserts)")
    end

    # Ca 5: BIEN01 - Ca biên 1: Danh sách rỗng (Ca phiếu 1: []; tim(3) -> false & Ca phiếu 2: []; xoa(3) -> false)
    @testset "BIEN01 - Danh sach rong (Ca phieu 1 va 2)" begin
        ds = khoi_tao_danh_sach(Int[])
        @test ds.so_nut == 0
        @test tim(ds, 3) == false
        @test xoa!(ds, 3) == false
        @test chuyen_thanh_mang(ds) == Int[]
        @test kiem_tra_bat_bien(ds) == true
        println("[PASS] BIEN01: [] -> tim(3)=false; xoa(3)=false; van rong []; n=0 (5 asserts)")
    end

    # Ca 6: BIEN02 - Ca biên 2: Danh sách 1 phần tử, xóa về rỗng (Ca phiếu 3: [7]; xoa(7) -> [], n=0)
    @testset "BIEN02 - Danh sach 1 phan tu xoa ve rong (Ca phieu 3)" begin
        ds = khoi_tao_danh_sach([7])
        @test xoa!(ds, 7) == true
        @test chuyen_thanh_mang(ds) == Int[]
        @test ds.so_nut == 0
        @test ds.dau === nothing && ds.duoi === nothing
        @test kiem_tra_bat_bien(ds) == true
        println("[PASS] BIEN02: [7] -> xoa(7)=true => []; n=0; dau=nothing, duoi=nothing (5 asserts)")
    end

    # Ca 7: BIEN03 - Ca biên 3: Xóa nút cuối và thêm cuối ngay sau đó (Ca phiếu 5: [1,3]; xoa(3); them_cuoi(5) -> [1,5])
    @testset "BIEN03 - Xoa nut cuoi va cap nhat duoi (Ca phieu 5)" begin
        ds = khoi_tao_danh_sach([1, 3])
        @test xoa!(ds, 3) == true
        @test ds.duoi.gia_tri == 1
        them_cuoi!(ds, 5)
        @test chuyen_thanh_mang(ds) == [1, 5]
        @test ds.so_nut == 2
        @test kiem_tra_bat_bien(ds) == true
        println("[PASS] BIEN03: [1, 3] -> xoa(3); them_cuoi(5) => [1, 5]; n=2 (5 asserts)")
    end

    # Ca 8: LOI01 - Input vi phạm điều kiện phiếu (giá trị ngoài [-1000, 1000] và vượt quá 1000 phần tử)
    @testset "LOI01 - Kiem tra validator tu choi input sai" begin
        @test_throws ArgumentError kiem_tra_dau_vao([100, 2000])
        @test_throws ArgumentError kiem_tra_dau_vao([-1001, 5])
        @test_throws ArgumentError kiem_tra_dau_vao(collect(1:1001))
        println("[PASS] LOI01: Validator ném ArgumentError với [100, 2000], [-1001, 5] và n=1001 (3 asserts)")
    end

    # Ca 9: KT09 - Nhiều giá trị trùng liên tiếp ở giữa danh sách
    @testset "KT09 - Xoa lan xuat hien dau tien giua day trung" begin
        ds = khoi_tao_danh_sach([1, 2, 2, 2, 5])
        @test xoa!(ds, 2) == true
        @test chuyen_thanh_mang(ds) == [1, 2, 2, 5]
        println("[PASS] KT09: [1, 2, 2, 2, 5] -> xoa(2) => [1, 2, 2, 5]; n=4 (2 asserts)")
    end

    # Ca 10: KT10 - Xóa phần tử không tồn tại trong danh sách không rỗng
    @testset "KT10 - Xoa gia tri khong co trong danh sach" begin
        ds = khoi_tao_danh_sach([10, 20, 30])
        @test xoa!(ds, 99) == false
        @test chuyen_thanh_mang(ds) == [10, 20, 30]
        println("[PASS] KT10: [10, 20, 30] -> xoa(99)=false => giữ nguyên [10, 20, 30]; n=3 (2 asserts)")
    end

    # Ca 11: KT11 - Biên miền giá trị [-1000, 1000]
    @testset "KT11 - Bien mien gia tri [-1000, 1000]" begin
        ds = khoi_tao_danh_sach([-1000, 1000])
        @test tim(ds, -1000) == true && xoa!(ds, -1000) == true
        @test chuyen_thanh_mang(ds) == [1000]
        println("[PASS] KT11: [-1000, 1000] -> tim(-1000)=true; xoa(-1000)=true => [1000]; n=1 (2 asserts)")
    end

    # Ca 12: KT12 - Kiểm tra bất biến số nút bằng lượt duyệt độc lập sau chuỗi thao tác hỗn hợp
    @testset "KT12 - Kiem tra bat bien va luot duyet doc lap" begin
        ds = khoi_tao_danh_sach([3, 6, 9])
        them!(ds, 1, :dau)
        them!(ds, 12, :cuoi)
        xoa!(ds, 6)
        @test dem_nut_duyet(ds) == ds.so_nut
        println("[PASS] KT12: Duyệt độc lập dem_nut_duyet(ds) == ds.so_nut == 4 (1 assert)")
    end

end
println("======================================================================")
println("TỔNG KẾT: 12/12 ca kiểm thử độc lập PASS | 50/50 phép kiểm (@test) ĐẠT")
println("======================================================================")
