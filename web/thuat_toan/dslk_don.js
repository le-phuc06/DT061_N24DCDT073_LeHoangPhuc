// ============================================================================
// Tệp: web/thuat_toan/dslk_don.js
// Vai trò: [THUẬT TOÁN LÕI TRÊN WEB] Cài đặt cấu trúc Nut, DanhSachLienKet,
//          validator kiem_tra_dau_vao và các giải thuật thêm, tìm, xóa, bất biến.
// Đề tài: DT061 — Cài đặt danh sách liên kết đơn với thêm, tìm và xóa
// Sinh viên: Lê Hoàng Phúc | MSSV: N24DCDT073 | Lớp: D24CQDT01-N
// ============================================================================

// ============================================================================
// Tệp: web/app.js — Mã nguồn Logic Mô phỏng & Kiểm thử Danh sách Liên kết Đơn
// Đề tài: DT061 — Cài đặt danh sách liên kết đơn với thêm, tìm và xóa
// Sinh viên: Lê Hoàng Phúc | MSSV: N24DCDT073 | Lớp: D24CQDT01-N
// ============================================================================

// =========================================================================
    // 1. SINGLY LINKED LIST ENGINE (Exact Mirror of Julia Module `DeTai` in JS)
    // =========================================================================
    const MIN_VAL = -1000;
    const MAX_VAL = 1000;
    const MAX_LEN = 1000;

    class Nut {
      constructor(gia_tri, ke_tiep = null) {
        this.id = 'n_' + Math.random().toString(36).slice(2, 9);
        this.gia_tri = gia_tri;
        this.ke_tiep = ke_tiep;
      }
    }

    class DanhSachLienKet {
      constructor() {
        this.dau = null;
        this.duoi = null;
        this.so_nut = 0;
      }
    }

    function kiem_tra_gia_tri(x) {
      if (typeof x !== 'number' || !Number.isInteger(x)) {
        throw new Error(`ArgumentError: Giá trị phần tử phải là số nguyên (nhận được: ${x}).`);
      }
      if (x < MIN_VAL || x > MAX_VAL) {
        throw new Error(`ArgumentError: Giá trị ${x} vượt ngoài miền cho phép [${MIN_VAL}, ${MAX_VAL}].`);
      }
      return true;
    }

    function kiem_tra_dau_vao(mang) {
      if (!Array.isArray(mang)) {
        throw new Error('ArgumentError: Dữ liệu đầu vào phải là mảng một chiều các số nguyên.');
      }
      if (mang.length > MAX_LEN) {
        throw new Error(`ArgumentError: Độ dài dãy ban đầu (${mang.length}) vượt quá giới hạn tối đa ${MAX_LEN} phần tử.`);
      }
      for (let i = 0; i < mang.length; i++) {
        const x = mang[i];
        if (typeof x !== 'number' || !Number.isInteger(x)) {
          throw new Error(`ArgumentError: Phần tử tại vị trí ${i + 1} không phải số nguyên: ${x}.`);
        }
        if (x < MIN_VAL || x > MAX_VAL) {
          throw new Error(`ArgumentError: Phần tử tại vị trí ${i + 1} có giá trị ${x} ngoài miền [${MIN_VAL}, ${MAX_VAL}].`);
        }
      }
      return true;
    }

    function them_dau(ds, x) {
      kiem_tra_gia_tri(x);
      if (ds.so_nut >= MAX_LEN) {
        throw new Error(`OverflowError: Danh sách đã đạt kích thước tối đa ${MAX_LEN} nút.`);
      }
      const nut_moi = new Nut(x, ds.dau);
      ds.dau = nut_moi;
      let note = `Tạo Nut(${x}) trỏ tới đầu cũ; cập nhật dau = Nut(${x})`;
      if (ds.duoi === null) {
        ds.duoi = nut_moi;
        note += ` và duoi = Nut(${x}) (vì danh sách trước đó rỗng)`;
      }
      ds.so_nut += 1;
      return { kq: true, so_buoc: 1, nut_tac_dong: nut_moi.id, giai_thich: note + `; tăng so_nut = ${ds.so_nut}.` };
    }

    function them_cuoi(ds, x) {
      kiem_tra_gia_tri(x);
      if (ds.so_nut >= MAX_LEN) {
        throw new Error(`OverflowError: Danh sách đã đạt kích thước tối đa ${MAX_LEN} nút.`);
      }
      const nut_moi = new Nut(x, null);
      let note = '';
      if (ds.dau === null) {
        ds.dau = nut_moi;
        ds.duoi = nut_moi;
        note = `Danh sách rỗng: gán cả dau = Nut(${x}) và duoi = Nut(${x})`;
      } else {
        const oldTailVal = ds.duoi.gia_tri;
        ds.duoi.ke_tiep = nut_moi;
        ds.duoi = nut_moi;
        note = `Nối trực tiếp duoi(${oldTailVal}).ke_tiep = Nut(${x}); cập nhật duoi = Nut(${x}) trong O(1)`;
      }
      ds.so_nut += 1;
      return { kq: true, so_buoc: 1, nut_tac_dong: nut_moi.id, giai_thich: note + `; tăng so_nut = ${ds.so_nut}.` };
    }

    function them_cuoi_khong_duoi(ds, x) {
      kiem_tra_gia_tri(x);
      if (ds.so_nut >= MAX_LEN) {
        throw new Error(`OverflowError: Danh sách đã đạt kích thước tối đa ${MAX_LEN} nút.`);
      }
      const nut_moi = new Nut(x, null);
      let so_buoc = 1;
      const visited = [];
      let note = '';
      if (ds.dau === null) {
        ds.dau = nut_moi;
        ds.duoi = nut_moi;
        note = `Danh sách rỗng: gán dau = duoi = Nut(${x}) (1 bước)`;
      } else {
        let hien_tai = ds.dau;
        visited.push(hien_tai.id);
        while (hien_tai.ke_tiep !== null) {
          hien_tai = hien_tai.ke_tiep;
          visited.push(hien_tai.id);
          so_buoc += 1;
        }
        hien_tai.ke_tiep = nut_moi;
        ds.duoi = nut_moi;
        note = `Duyệt tuần tự từ dau qua ${so_buoc} nút tới nút cuối (${hien_tai.gia_tri}), nối ke_tiep = Nut(${x}) — chi phí O(n)`;
      }
      ds.so_nut += 1;
      return { kq: true, so_buoc, visited, nut_tac_dong: nut_moi.id, giai_thich: note + `; so_nut = ${ds.so_nut}.` };
    }

    function tim_co_dem(ds, x) {
      kiem_tra_gia_tri(x);
      let hien_tai = ds.dau;
      let so_buoc = 0;
      const visited = [];
      while (hien_tai !== null) {
        so_buoc += 1;
        visited.push(hien_tai.id);
        if (hien_tai.gia_tri === x) {
          return {
            kq: true,
            so_buoc,
            visited,
            nut_tac_dong: hien_tai.id,
            giai_thich: `Duyệt từ dau qua ${so_buoc} nút: gặp hien_tai.gia_tri == ${x} tại vị trí ${so_buoc}, dừng sớm và trả về true.`
          };
        }
        hien_tai = hien_tai.ke_tiep;
      }
      return {
        kq: false,
        so_buoc,
        visited,
        nut_tac_dong: null,
        giai_thich: ds.so_nut === 0
          ? `Danh sách rỗng (dau === nothing): vòng lặp không chạy (0 bước), trả về false.`
          : `Duyệt hết ${so_buoc} nút tới nothing không gặp ${x}, trả về false.`
      };
    }

    function xoa_co_dem(ds, x) {
      kiem_tra_gia_tri(x);
      const visited = [];
      if (ds.dau === null) {
        return {
          kq: false,
          so_buoc: 0,
          visited,
          giai_thich: `Danh sách đang rỗng (dau === nothing): trả về false ngay, giữ nguyên [].`
        };
      }
      visited.push(ds.dau.id);
      if (ds.dau.gia_tri === x) {
        const nextVal = ds.dau.ke_tiep ? ds.dau.ke_tiep.gia_tri : 'nothing';
        ds.dau = ds.dau.ke_tiep;
        ds.so_nut -= 1;
        let tailNote = '';
        if (ds.so_nut === 0) {
          ds.duoi = null;
          tailNote = '; vì so_nut về 0 nên đặt luôn duoi = nothing';
        }
        return {
          kq: true,
          so_buoc: 1,
          visited,
          giai_thich: `Khớp ngay tại nút đầu (dau.gia_tri == ${x}): dịch dau sang ${nextVal}, giảm so_nut = ${ds.so_nut}${tailNote}.`
        };
      }
      let truoc = ds.dau;
      let hien_tai = ds.dau.ke_tiep;
      let so_buoc = 1;
      while (hien_tai !== null) {
        so_buoc += 1;
        visited.push(hien_tai.id);
        if (hien_tai.gia_tri === x) {
          const nextDesc = hien_tai.ke_tiep ? `Nut(${hien_tai.ke_tiep.gia_tri})` : 'nothing';
          truoc.ke_tiep = hien_tai.ke_tiep;
          let tailUpdate = '';
          if (hien_tai === ds.duoi) {
            ds.duoi = truoc;
            tailUpdate = `; vì xóa nút cuối nên lùi con trỏ duoi về truoc = Nut(${truoc.gia_tri})`;
          }
          ds.so_nut -= 1;
          return {
            kq: true,
            so_buoc,
            visited,
            giai_thich: `Dừng tại truoc = Nut(${truoc.gia_tri}), hien_tai = Nut(${x}): nối tắt truoc.ke_tiep = ${nextDesc}${tailUpdate}; giảm so_nut = ${ds.so_nut}.`
          };
        }
        truoc = hien_tai;
        hien_tai = hien_tai.ke_tiep;
      }
      return {
        kq: false,
        so_buoc,
        visited,
        giai_thich: `Duyệt hết ${so_buoc} nút tới nothing không thấy ${x}: trả về false và giữ nguyên danh sách.`
      };
    }

    function chuyen_thanh_mang(ds) {
      const kq = [];
      let hien_tai = ds.dau;
      let guard = 0;
      while (hien_tai !== null && guard <= MAX_LEN + 5) {
        kq.push(hien_tai.gia_tri);
        hien_tai = hien_tai.ke_tiep;
        guard += 1;
      }
      return kq;
    }

    function dem_nut_duyet(ds) {
      let dem = 0;
      let hien_tai = ds.dau;
      while (hien_tai !== null && dem <= MAX_LEN + 5) {
        dem += 1;
        hien_tai = hien_tai.ke_tiep;
      }
      return dem;
    }

    function kiem_tra_bat_bien(ds) {
      if (ds.so_nut < 0 || ds.so_nut > MAX_LEN) return false;
      if (ds.so_nut === 0) return ds.dau === null && ds.duoi === null;
      if (ds.dau === null || ds.duoi === null) return false;
      if (ds.duoi.ke_tiep !== null) return false;
      let hien_tai = ds.dau;
      let dem = 1;
      while (hien_tai.ke_tiep !== null) {
        dem += 1;
        if (dem > MAX_LEN) return false;
        hien_tai = hien_tai.ke_tiep;
      }
      return dem === ds.so_nut && hien_tai === ds.duoi;
    }

    function in_danh_sach(ds) {
      const mang = chuyen_thanh_mang(ds);
      return `[${mang.join(', ')}]; n=${ds.so_nut}`;
    }

    function khoi_tao_danh_sach(mang) {
      kiem_tra_dau_vao(mang);
      const ds = new DanhSachLienKet();
      for (const x of mang) {
        them_cuoi(ds, x);
      }
      return ds;
    }
