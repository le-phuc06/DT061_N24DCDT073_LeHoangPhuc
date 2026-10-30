module DeTai

export Nut, DanhSachLienKet,
       kiem_tra_gia_tri, kiem_tra_dau_vao,
       khoi_tao_danh_sach, them_dau!, them_cuoi!, them_cuoi_khong_duoi!,
       them!, tim, tim_co_dem, xoa!, xoa_co_dem!,
       in_danh_sach, chuyen_thanh_mang, dem_nut_duyet, kiem_tra_bat_bien,
       giai_bai

const MIN_VAL = -1000
const MAX_VAL = 1000
const MAX_LEN = 1000

"""
    Nut

Cấu trúc nút cơ sở của danh sách liên kết đơn chứa số nguyên:
- `gia_tri::Int`: Giá trị số nguyên lưu tại nút, thuộc miền [-1000, 1000].
- `ke_tiep::Union{Nut, Nothing}`: Liên kết trỏ tới nút kế tiếp hoặc `nothing` nếu là nút cuối.
"""
mutable struct Nut
    gia_tri::Int
    ke_tiep::Union{Nut, Nothing}
    Nut(gia_tri::Int) = new(gia_tri, nothing)
    Nut(gia_tri::Int, ke_tiep::Union{Nut, Nothing}) = new(gia_tri, ke_tiep)
end

"""
    DanhSachLienKet

Cấu trúc quản lý danh sách liên kết đơn:
- `dau::Union{Nut, Nothing}`: Con trỏ tới nút đầu tiên (`nothing` khi danh sách rỗng).
- `duoi::Union{Nut, Nothing}`: Con trỏ tới nút cuối cùng (`nothing` khi danh sách rỗng), giúp `them_cuoi!` đạt O(1).
- `so_nut::Int`: Số lượng nút hiện có trong danh sách (`0 <= so_nut <= 1000`).
"""
mutable struct DanhSachLienKet
    dau::Union{Nut, Nothing}
    duoi::Union{Nut, Nothing}
    so_nut::Int
    DanhSachLienKet() = new(nothing, nothing, 0)
end

"""
    kiem_tra_gia_tri(x)

Xác thực một giá trị nguyên `x` có thuộc miền hợp lệ `[-1000, 1000]` của phiếu DT061 hay không.
"""
function kiem_tra_gia_tri(x)
    if !(x isa Integer)
        throw(ArgumentError("Giá trị phần tử phải là số nguyên (nhận được: $(typeof(x)))."))
    end
    if x < MIN_VAL || x > MAX_VAL
        throw(ArgumentError("Giá trị $x vượt ngoài miền cho phép [$MIN_VAL, $MAX_VAL]."))
    end
    return true
end

"""
    kiem_tra_dau_vao(mang)

Hàm validator kiểm tra hợp đồng dữ liệu đầu vào theo phiếu giao đề tài DT061:
- `mang` phải là mảng một chiều chứa số nguyên (`AbstractVector`).
- Số phần tử `0 <= length(mang) <= 1000`.
- Mọi phần tử thuộc đoạn `[-1000, 1000]`.
"""
function kiem_tra_dau_vao(mang)
    if !(mang isa AbstractVector)
        throw(ArgumentError("Dữ liệu đầu vào phải là mảng một chiều các số nguyên."))
    end
    n = length(mang)
    if n > MAX_LEN
        throw(ArgumentError("Độ dài dãy ban đầu ($n) vượt quá giới hạn tối đa $MAX_LEN phần tử."))
    end
    for (idx, x) in enumerate(mang)
        if !(x isa Integer)
            throw(ArgumentError("Phần tử tại vị trí $idx không phải số nguyên: $x."))
        end
        if x < MIN_VAL || x > MAX_VAL
            throw(ArgumentError("Phần tử tại vị trí $idx có giá trị $x ngoài miền [$MIN_VAL, $MAX_VAL]."))
        end
    end
    return true
end

"""
    them_dau!(ds::DanhSachLienKet, x::Int)

Thêm phần tử `x` vào đầu danh sách liên kết đơn trong thời gian O(1).
Cập nhật cả `dau`, `duoi` (nếu danh sách trước đó rỗng) và tăng `so_nut` lên 1.
"""
function them_dau!(ds::DanhSachLienKet, x::Int)
    kiem_tra_gia_tri(x)
    if ds.so_nut >= MAX_LEN
        throw(OverflowError("Danh sách đã đạt kích thước tối đa $MAX_LEN nút."))
    end
    nut_moi = Nut(x, ds.dau)
    ds.dau = nut_moi
    if ds.duoi === nothing
        ds.duoi = nut_moi
    end
    ds.so_nut += 1
    return ds
end

"""
    them_cuoi!(ds::DanhSachLienKet, x::Int)

Thêm phần tử `x` vào cuối danh sách liên kết đơn trong thời gian O(1) nhờ duy trì con trỏ `duoi`.
"""
function them_cuoi!(ds::DanhSachLienKet, x::Int)
    kiem_tra_gia_tri(x)
    if ds.so_nut >= MAX_LEN
        throw(OverflowError("Danh sách đã đạt kích thước tối đa $MAX_LEN nút."))
    end
    nut_moi = Nut(x, nothing)
    if ds.dau === nothing
        ds.dau = nut_moi
        ds.duoi = nut_moi
    else
        ds.duoi.ke_tiep = nut_moi
        ds.duoi = nut_moi
    end
    ds.so_nut += 1
    return ds
end

"""
    them_cuoi_khong_duoi!(ds::DanhSachLienKet, x::Int) -> (DanhSachLienKet, Int)

Thêm phần tử `x` vào cuối danh sách theo cách duyệt tuần tự từ `dau` (không dùng `duoi`),
trả về cặp `(ds, so_buoc)` để khảo sát chi phí O(n) đối chiếu với bản có con trỏ `duoi` O(1).
"""
function them_cuoi_khong_duoi!(ds::DanhSachLienKet, x::Int)
    kiem_tra_gia_tri(x)
    if ds.so_nut >= MAX_LEN
        throw(OverflowError("Danh sách đã đạt kích thước tối đa $MAX_LEN nút."))
    end
    nut_moi = Nut(x, nothing)
    so_buoc = 0
    if ds.dau === nothing
        ds.dau = nut_moi
        ds.duoi = nut_moi
        so_buoc = 1
    else
        hien_tai = ds.dau
        so_buoc = 1
        while hien_tai.ke_tiep !== nothing
            hien_tai = hien_tai.ke_tiep
            so_buoc += 1
        end
        hien_tai.ke_tiep = nut_moi
        ds.duoi = nut_moi
    end
    ds.so_nut += 1
    return ds, so_buoc
end

"""
    them!(ds::DanhSachLienKet, x::Int, vi_tri::Symbol=:cuoi)

Hàm tổng quát thêm phần tử `x` vào `:dau` hoặc `:cuoi` theo đúng gợi ý mục 5 trên phiếu giao đề tài.
"""
function them!(ds::DanhSachLienKet, x::Int, vi_tri::Symbol=:cuoi)
    if vi_tri === :dau
        return them_dau!(ds, x)
    elseif vi_tri === :cuoi
        return them_cuoi!(ds, x)
    else
        throw(ArgumentError("Vị trí thêm không hợp lệ: $vi_tri (chỉ hỗ trợ :dau hoặc :cuoi)."))
    end
end

"""
    khoi_tao_danh_sach(mang::AbstractVector{<:Integer}=Int[])

Khởi tạo danh sách liên kết đơn từ dãy số nguyên ban đầu `mang`.
"""
function khoi_tao_danh_sach(mang::AbstractVector{<:Integer}=Int[])
    kiem_tra_dau_vao(mang)
    ds = DanhSachLienKet()
    for x in mang
        them_cuoi!(ds, Int(x))
    end
    return ds
end

"""
    tim_co_dem(ds::DanhSachLienKet, x::Int) -> (Bool, Int)

Tìm giá trị `x` trong danh sách liên kết đơn `ds`, trả về `(ket_qua, so_buoc_duyet)`.
"""
function tim_co_dem(ds::DanhSachLienKet, x::Int)
    kiem_tra_gia_tri(x)
    hien_tai = ds.dau
    so_buoc = 0
    while hien_tai !== nothing
        so_buoc += 1
        if hien_tai.gia_tri == x
            return true, so_buoc
        end
        hien_tai = hien_tai.ke_tiep
    end
    return false, so_buoc
end

"""
    tim(ds::DanhSachLienKet, x::Int) -> Bool

Tìm giá trị `x` trong danh sách liên kết đơn `ds`. Trả về `true` nếu tồn tại, `false` nếu không tìm thấy.
"""
function tim(ds::DanhSachLienKet, x::Int)::Bool
    kq, _ = tim_co_dem(ds, x)
    return kq
end

"""
    xoa_co_dem!(ds::DanhSachLienKet, x::Int) -> (Bool, Int)

Xóa lần xuất hiện đầu tiên của giá trị `x` trong danh sách `ds` bằng hai biến `truoc` và `hien_tai`.
Cập nhật `dau` khi xóa nút đầu và cập nhật `duoi` khi xóa nút cuối.
Trả về `(da_xoa, so_buoc_duyet)`.
"""
function xoa_co_dem!(ds::DanhSachLienKet, x::Int)
    kiem_tra_gia_tri(x)
    if ds.dau === nothing
        return false, 0
    end
    if ds.dau.gia_tri == x
        ds.dau = ds.dau.ke_tiep
        ds.so_nut -= 1
        if ds.so_nut == 0
            ds.duoi = nothing
        end
        return true, 1
    end
    truoc = ds.dau
    hien_tai = ds.dau.ke_tiep
    so_buoc = 1
    while hien_tai !== nothing
        so_buoc += 1
        if hien_tai.gia_tri == x
            truoc.ke_tiep = hien_tai.ke_tiep
            if hien_tai === ds.duoi
                ds.duoi = truoc
            end
            ds.so_nut -= 1
            return true, so_buoc
        end
        truoc = hien_tai
        hien_tai = hien_tai.ke_tiep
    end
    return false, so_buoc
end

"""
    xoa!(ds::DanhSachLienKet, x::Int) -> Bool

Xóa lần xuất hiện đầu tiên của `x` trong danh sách `ds`. Nếu không có `x`, trả về `false` và giữ nguyên danh sách.
"""
function xoa!(ds::DanhSachLienKet, x::Int)::Bool
    kq, _ = xoa_co_dem!(ds, x)
    return kq
end

"""
    chuyen_thanh_mang(ds::DanhSachLienKet) -> Vector{Int}

Duyệt danh sách từ đầu tới cuối và thu về mảng các giá trị nguyên.
"""
function chuyen_thanh_mang(ds::DanhSachLienKet)::Vector{Int}
    kq = Int[]
    hien_tai = ds.dau
    dem = 0
    while hien_tai !== nothing
        dem += 1
        if dem > MAX_LEN + 5
            error("Phát hiện chu trình bất thường trong danh sách liên kết!")
        end
        push!(kq, hien_tai.gia_tri)
        hien_tai = hien_tai.ke_tiep
    end
    return kq
end

"""
    dem_nut_duyet(ds::DanhSachLienKet) -> Int

Đếm số nút thực tế bằng một lượt duyệt độc lập từ `dau` tới `nothing` (Bước 4 trên phiếu).
"""
function dem_nut_duyet(ds::DanhSachLienKet)::Int
    dem = 0
    hien_tai = ds.dau
    while hien_tai !== nothing
        dem += 1
        if dem > MAX_LEN + 5
            error("Phát hiện chu trình bất thường trong danh sách liên kết!")
        end
        hien_tai = hien_tai.ke_tiep
    end
    return dem
end

"""
    kiem_tra_bat_bien(ds::DanhSachLienKet) -> Bool

Kiểm tra toàn diện các bất biến cấu trúc của Danh sách liên kết đơn:
1. `so_nut >= 0` và `so_nut == dem_nut_duyet(ds)`.
2. Nếu `so_nut == 0` thì `dau === nothing` và `duoi === nothing`.
3. Nếu `so_nut > 0` thì `dau !== nothing`, `duoi !== nothing`, `duoi.ke_tiep === nothing`,
   và nút cuối cùng khi duyệt từ `dau` đúng là `duoi`.
"""
function kiem_tra_bat_bien(ds::DanhSachLienKet)::Bool
    if ds.so_nut < 0 || ds.so_nut > MAX_LEN
        return false
    end
    if ds.so_nut == 0
        return ds.dau === nothing && ds.duoi === nothing
    end
    if ds.dau === nothing || ds.duoi === nothing
        return false
    end
    if ds.duoi.ke_tiep !== nothing
        return false
    end
    hien_tai = ds.dau
    dem = 1
    while hien_tai.ke_tiep !== nothing
        dem += 1
        if dem > MAX_LEN
            return false
        end
        hien_tai = hien_tai.ke_tiep
    end
    return (dem == ds.so_nut) && (hien_tai === ds.duoi)
end

"""
    in_danh_sach(ds::DanhSachLienKet) -> String

Biểu diễn chuỗi trạng thái danh sách từ đầu tới cuối và số nút theo chuẩn phiếu: `[e1, e2, ...]; n=...`.
"""
function in_danh_sach(ds::DanhSachLienKet)::String
    mang = chuyen_thanh_mang(ds)
    noi_dung = join(mang, ", ")
    return "[$noi_dung]; n=$(ds.so_nut)"
end

"""
    giai_bai(du_lieu)

Thực thi dãy lệnh `(ten_lenh, gia_tri)` trên mảng khởi tạo ban đầu `du_lieu.mang_ban_dau`.
Trả về NamedTuple gồm danh sách cuối, mảng phần tử, số nút, kết quả từng lệnh và kiểm tra bất biến.
"""
function giai_bai(du_lieu)
    if du_lieu === nothing
        throw(ArgumentError("Dữ liệu đầu vào không được là nothing."))
    end
    mang_ban_dau = du_lieu.mang_ban_dau
    cac_lenh = du_lieu.cac_lenh
    ds = khoi_tao_danh_sach(mang_ban_dau)
    lich_su = Vector{NamedTuple}()

    for (ten_lenh, x) in cac_lenh
        if ten_lenh === :them_dau
            them_dau!(ds, x)
            push!(lich_su, (lenh=:them_dau, x=x, ket_qua=true, trang_thai=in_danh_sach(ds)))
        elseif ten_lenh === :them_cuoi
            them_cuoi!(ds, x)
            push!(lich_su, (lenh=:them_cuoi, x=x, ket_qua=true, trang_thai=in_danh_sach(ds)))
        elseif ten_lenh === :tim
            kq = tim(ds, x)
            push!(lich_su, (lenh=:tim, x=x, ket_qua=kq, trang_thai=in_danh_sach(ds)))
        elseif ten_lenh === :xoa
            kq = xoa!(ds, x)
            push!(lich_su, (lenh=:xoa, x=x, ket_qua=kq, trang_thai=in_danh_sach(ds)))
        else
            throw(ArgumentError("Lệnh không hợp lệ: $ten_lenh"))
        end
    end

    return (
        ds = ds,
        mang_cuoi = chuyen_thanh_mang(ds),
        so_nut = ds.so_nut,
        so_nut_duyet = dem_nut_duyet(ds),
        bat_bien = kiem_tra_bat_bien(ds),
        chuoi_ket_qua = in_danh_sach(ds),
        lich_su = lich_su
    )
end

end # module DeTai
