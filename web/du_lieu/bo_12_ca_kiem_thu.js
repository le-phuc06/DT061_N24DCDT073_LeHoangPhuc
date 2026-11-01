// ============================================================================
// Tệp: web/du_lieu/bo_12_ca_kiem_thu.js
// Vai trò: [DỮ LIỆU KIỂM THỬ & MÃ NGUỒN ĐỐI CHIẾU] Chứa cấu hình 12 ca kiểm thử
//          độc lập (VD01 -> KT12), 5 ca bắt buộc trên phiếu và mã nguồn Julia.
// Đề tài: DT061 — Cài đặt danh sách liên kết đơn với thêm, tìm và xóa
// Sinh viên: Lê Hoàng Phúc | MSSV: N24DCDT073 | Lớp: D24CQDT01-N
// ============================================================================

// =========================================================================
    // 2. 12 INDEPENDENT TEST CASES DATA (VD01 -> KT12)
    // =========================================================================
    const PRESET_CASES = [
      {
        id: 'VD01',
        badge: 'A01 / Hình 4.1',
        title: 'Ví dụ 1 trên phiếu',
        source: 'Ví dụ 1 phiếu / Chính',
        init: [5, 9],
        cmds: [['them_dau', 2], ['xoa', 9], ['them_cuoi', 7]],
        expected: '[2, 5, 7]; n=3; xoa(9)=true',
        asserts: 7
      },
      {
        id: 'VD02',
        badge: 'A02 / Hình 4.2',
        title: 'Ví dụ 2 trên phiếu',
        source: 'Ví dụ 2 phiếu / Chính',
        init: [4, 4],
        cmds: [['xoa', 4], ['tim', 4]],
        expected: '[4]; n=1; xoa(4)=true; tim(4)=true',
        asserts: 6
      },
      {
        id: 'TK01',
        badge: 'A03 / Hình 4.3',
        title: 'Tự thiết kế 1 (Xóa giữa)',
        source: 'Tự thiết kế 1 / Chính',
        init: [10, 20, 30],
        cmds: [['them_dau', 5], ['them_cuoi', 40], ['xoa', 20]],
        expected: '[5, 10, 30, 40]; n=4; xoa(20)=true',
        asserts: 5
      },
      {
        id: 'TK02',
        badge: 'A04 / Hình 4.4',
        title: 'Tự thiết kế 2 & Ca phiếu 4',
        source: 'Tự thiết kế 2 & Ca phiếu 4',
        init: [2, 2, 3, 2],
        cmds: [['xoa', 2], ['tim', 2]],
        expected: '[2, 3, 2]; n=3; xoa(2)=true; tim(2)=true',
        asserts: 7
      },
      {
        id: 'BIEN01',
        badge: 'A05 / Hình 4.5',
        title: 'Biên 1: Danh sách rỗng',
        source: 'Ca biên 1 (Ca phiếu 1 & 2)',
        init: [],
        cmds: [['tim', 3], ['xoa', 3]],
        expected: '[]; n=0; tim(3)=false; xoa(3)=false',
        asserts: 5
      },
      {
        id: 'BIEN02',
        badge: 'A06 / Hình 4.6',
        title: 'Biên 2: 1 nút xóa về rỗng',
        source: 'Ca biên 2 (Ca phiếu 3)',
        init: [7],
        cmds: [['xoa', 7]],
        expected: '[]; n=0; xoa(7)=true; dau=duoi=nothing',
        asserts: 5
      },
      {
        id: 'BIEN03',
        badge: 'A07 / Hình 4.7',
        title: 'Biên 3: Xóa nút cuối & thêm cuối',
        source: 'Ca biên 3 (Ca phiếu 5)',
        init: [1, 3],
        cmds: [['xoa', 3], ['them_cuoi', 5]],
        expected: '[1, 5]; n=2; xoa(3)=true; duoi=5',
        asserts: 5
      },
      {
        id: 'LOI01',
        badge: 'A08 / Hình 4.8',
        title: 'Input sai ngoài [-1000,1000]',
        source: 'Validator kiem_tra_dau_vao',
        init: [100, 2000],
        cmds: [],
        expected: 'Ném ArgumentError (2000 ngoài [-1000, 1000])',
        asserts: 3,
        isErrorCase: true
      },
      {
        id: 'KT09',
        badge: 'Test 9',
        title: 'Trùng liên tiếp ở giữa',
        source: 'Ca bổ sung 1 / Chính',
        init: [1, 2, 2, 2, 5],
        cmds: [['xoa', 2]],
        expected: '[1, 2, 2, 5]; n=4; xoa(2)=true',
        asserts: 2
      },
      {
        id: 'KT10',
        badge: 'Test 10',
        title: 'Xóa giá trị không tồn tại',
        source: 'Ca bổ sung 2 / Chính',
        init: [10, 20, 30],
        cmds: [['xoa', 99]],
        expected: '[10, 20, 30]; n=3; xoa(99)=false',
        asserts: 2
      },
      {
        id: 'KT11',
        badge: 'Test 11',
        title: 'Biên miền giá trị ±1000',
        source: 'Ca bổ sung 3 / Chính',
        init: [-1000, 1000],
        cmds: [['tim', -1000], ['xoa', -1000]],
        expected: '[1000]; n=1; tim(-1000)=true; xoa(-1000)=true',
        asserts: 2
      },
      {
        id: 'KT12',
        badge: 'Test 12',
        title: 'Đối chiếu dem_nut_duyet',
        source: 'Ca bổ sung 4 / Bất biến',
        init: [3, 6, 9],
        cmds: [['them_dau', 1], ['them_cuoi', 12], ['xoa', 6]],
        expected: '[1, 3, 9, 12]; dem_nut_duyet == so_nut == 4',
        asserts: 1
      }
    ];

    // =========================================================================
    // 8. TAB 4: JULIA SOURCE CODE FILES
    // =========================================================================
    const JULIA_SOURCE_FILES = {
      detai: `# Tệp: src/DeTai.jl
# Permalink: https://github.com/le-phuc06/DT061_N24DCDT073_LeHoangPhuc/blob/c3fda8f755102a969373851c48d6731e0df5b509/src/DeTai.jl
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

mutable struct Nut
    gia_tri::Int
    ke_tiep::Union{Nut, Nothing}
    Nut(gia_tri::Int) = new(gia_tri, nothing)
    Nut(gia_tri::Int, ke_tiep::Union{Nut, Nothing}) = new(gia_tri, ke_tiep)
end

mutable struct DanhSachLienKet
    dau::Union{Nut, Nothing}
    duoi::Union{Nut, Nothing}
    so_nut::Int
    DanhSachLienKet() = new(nothing, nothing, 0)
end

function kiem_tra_gia_tri(x)
    if !(x isa Integer)
        throw(ArgumentError("Giá trị phần tử phải là số nguyên (nhận được: $(typeof(x)))."))
    end
    if x < MIN_VAL || x > MAX_VAL
        throw(ArgumentError("Giá trị $x vượt ngoài miền cho phép [$MIN_VAL, $MAX_VAL]."))
    end
    return true
end

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

function tim(ds::DanhSachLienKet, x::Int)::Bool
    kiem_tra_gia_tri(x)
    hien_tai = ds.dau
    while hien_tai !== nothing
        hien_tai.gia_tri == x && return true
        hien_tai = hien_tai.ke_tiep
    end
    return false
end

function xoa!(ds::DanhSachLienKet, x::Int)::Bool
    kiem_tra_gia_tri(x)
    ds.dau === nothing && return false
    if ds.dau.gia_tri == x
        ds.dau = ds.dau.ke_tiep
        ds.so_nut -= 1
        ds.so_nut == 0 && (ds.duoi = nothing)
        return true
    end
    truoc = ds.dau
    hien_tai = ds.dau.ke_tiep
    while hien_tai !== nothing
        if hien_tai.gia_tri == x
            truoc.ke_tiep = hien_tai.ke_tiep
            hien_tai === ds.duoi && (ds.duoi = truoc)
            ds.so_nut -= 1
            return true
        end
        truoc = hien_tai
        hien_tai = hien_tai.ke_tiep
    end
    return false
end

function in_danh_sach(ds::DanhSachLienKet)::String
    mang = chuyen_thanh_mang(ds)
    noi_dung = join(mang, ", ")
    return "[$noi_dung]; n=$(ds.so_nut)"
end

end # module DeTai`,
      demo: `# Tệp: demo.jl — Chạy Ví dụ 1, Ví dụ 2 và các ca minh chứng A01 -> A08
include(joinpath(@__DIR__, "src", "DeTai.jl"))
using .DeTai

# A01 - Ví dụ 1 trên phiếu: [5, 9]; them_dau(2); xoa(9); them_cuoi(7) -> [2, 5, 7]; n=3
kq1 = giai_bai((mang_ban_dau=[5, 9], cac_lenh=[(:them_dau, 2), (:xoa, 9), (:them_cuoi, 7)]))
println("VD01: ", kq1.chuoi_ket_qua)

# A02 - Ví dụ 2 trên phiếu: [4, 4]; xoa(4); tim(4) -> [4]; n=1; tim(4)=true
kq2 = giai_bai((mang_ban_dau=[4, 4], cac_lenh=[(:xoa, 4), (:tim, 4)]))
println("VD02: ", kq2.chuoi_ket_qua)`,
      runtests: `# Tệp: test/runtests.jl — Bộ kiểm thử tự động 12 ca độc lập (50/50 asserts PASS)
# Permalink: https://github.com/le-phuc06/DT061_N24DCDT073_LeHoangPhuc/blob/c3fda8f755102a969373851c48d6731e0df5b509/test/runtests.jl
using Test
include(joinpath(@__DIR__, "..", "src", "DeTai.jl"))
using .DeTai

@testset "DT061 - Kiem thu Danh Sach Lien Ket Don (12 ca doc lap)" begin
    @testset "VD01" begin
        ds = khoi_tao_danh_sach([5, 9]); @test ds.so_nut == 2
        them_dau!(ds, 2); @test chuyen_thanh_mang(ds) == [2, 5, 9]
        @test xoa!(ds, 9) == true
        them_cuoi!(ds, 7); @test chuyen_thanh_mang(ds) == [2, 5, 7]
        @test ds.so_nut == 3; @test in_danh_sach(ds) == "[2, 5, 7]; n=3"; @test kiem_tra_bat_bien(ds)
    end
    # ... (Bao gồm đầy đủ 12 @testset từ VD01 đến KT12 với tổng 50 phép kiểm @test / @test_throws)
end`,
      scales: `# Tệp: scales.jl — Khảo sát 3 quy mô hợp lệ Q1 (n=5), Q2 (n=20), Q3 (n=100)
include(joinpath(@__DIR__, "src", "DeTai.jl"))
using .DeTai

for (ten_bo, n) in [("Q1", 5), ("Q2", 20), ("Q3", 100)]
    ds = khoi_tao_danh_sach(collect(1:n))
    _, buoc_tim = tim_co_dem(ds, n)
    _, buoc_xoa = xoa_co_dem!(ds, n)
    _, buoc_them_ko_duoi = them_cuoi_khong_duoi!(ds, n)
    println("$ten_bo (n=$n): Thêm đầu=1, Tìm cuối=$buoc_tim, Xóa cuối=$buoc_xoa, Thêm cuối(ko đuôi)=$buoc_them_ko_duoi, Thêm cuối(có đuôi)=1")
end`
    };

    function switchCodeFile(key) {
      currentCodeKey = key;
      document.getElementById('sourceCodeDisplay').textContent = JULIA_SOURCE_FILES[key] || '';
      ['detai', 'demo', 'runtests', 'scales'].forEach((k) => {
        const btn = document.getElementById(`codeBtn-${k}`);
        if (!btn) return;
        btn.className = k === key
          ? 'code-file-btn px-3 py-1.5 rounded-lg text-xs font-bold mono bg-indigo-600 text-white'
          : 'code-file-btn px-3 py-1.5 rounded-lg text-xs font-bold mono text-slate-300 hover:bg-white/10';
      });
    }

    function copyCurrentSourceCode() {
      const text = JULIA_SOURCE_FILES[currentCodeKey] || '';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showToast('Đã sao chép mã nguồn vào bộ nhớ tạm!', 'success');
          }).catch(() => fallbackCopy(text));
        } else {
          fallbackCopy(text);
        }
      } catch (e) {
        fallbackCopy(text);
      }
    }

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Đã sao chép mã nguồn vào bộ nhớ tạm!', 'success');
    }
