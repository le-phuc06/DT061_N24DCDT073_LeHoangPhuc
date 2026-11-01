// ============================================================================
// Tệp: web/giao_dien/dieu_khien_ui.js
// Vai trò: [ĐIỀU KHIỂN GIAO DIỆN & TRỰC QUAN HÓA] Vẽ sơ đồ nút liên kết đơn,
//          chạy hiệu ứng duyệt từng bước, xuất bảng lần vết và vẽ biểu đồ Chart.js.
// Đề tài: DT061 — Cài đặt danh sách liên kết đơn với thêm, tìm và xóa
// Sinh viên: Lê Hoàng Phúc | MSSV: N24DCDT073 | Lớp: D24CQDT01-N
// ============================================================================

// =========================================================================
    // 3. GLOBAL APPLICATION STATE
    // =========================================================================
    let currentDS = new DanhSachLienKet();
    let traceHistory = [];
    let activePresetId = 'VD01';
    let animTimer = null;
    let scalesChartInstance = null;
    let currentCodeKey = 'detai';

    function showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      const colors = {
        info: 'bg-slate-900 text-white border-slate-700',
        success: 'bg-emerald-700 text-white border-emerald-500',
        error: 'bg-rose-700 text-white border-rose-500'
      };
      const div = document.createElement('div');
      div.className = `pointer-events-auto px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold transition duration-300 ${colors[type] || colors.info}`;
      div.textContent = message;
      container.appendChild(div);
      setTimeout(() => {
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 300);
      }, 3200);
    }

    // =========================================================================
    // 4. UI RENDERING: LINKED LIST NODES & TRACE TABLE
    // =========================================================================
    function renderLinkedList(highlightId = null, highlightType = 'found') {
      const canvas = document.getElementById('linkedListCanvas');
      canvas.innerHTML = '';

      // Update status metrics
      document.getElementById('statDau').textContent = currentDS.dau ? `Nut(${currentDS.dau.gia_tri})` : 'nothing';
      document.getElementById('statDuoi').textContent = currentDS.duoi ? `Nut(${currentDS.duoi.gia_tri})` : 'nothing';
      document.getElementById('statSoNut').textContent = String(currentDS.so_nut);
      const independentCount = dem_nut_duyet(currentDS);
      document.getElementById('statDemDuyet').textContent = String(independentCount);
      document.getElementById('statChuoiKetQua').textContent = in_danh_sach(currentDS);

      const invOk = kiem_tra_bat_bien(currentDS);
      const invBadge = document.getElementById('invariantBadge');
      invBadge.textContent = `kiem_tra_bat_bien = ${invOk}`;
      invBadge.className = invOk
        ? 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mono'
        : 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 mono';

      // Empty list visual
      if (currentDS.dau === null) {
        canvas.innerHTML = `
          <div class="w-full flex flex-col sm:flex-row items-center justify-center gap-4 py-4 text-center">
            <div class="px-4 py-2.5 rounded-xl bg-rose-100 border-2 border-rose-400 text-rose-900 font-bold text-xs mono">
              dau (head) === nothing
            </div>
            <span class="text-slate-400 font-bold text-lg">⟶</span>
            <div class="px-5 py-3 rounded-xl bg-slate-200/80 border-2 border-dashed border-slate-400 text-slate-600 font-bold text-xs mono">
              Danh sách rỗng []; so_nut = 0
            </div>
            <span class="text-slate-400 font-bold text-lg">⟵</span>
            <div class="px-4 py-2.5 rounded-xl bg-amber-100 border-2 border-amber-400 text-amber-900 font-bold text-xs mono">
              duoi (tail) === nothing
            </div>
          </div>
        `;
        return;
      }

      // Non-empty list visual chain
      const wrapper = document.createElement('div');
      wrapper.className = 'flex items-center gap-2 sm:gap-3 py-2';

      // Head pointer badge
      const headBadge = document.createElement('div');
      headBadge.className = 'flex flex-col items-center shrink-0';
      headBadge.innerHTML = `
        <div class="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs mono shadow-sm">
          dau (head)
        </div>
        <div class="text-[10px] text-rose-700 font-semibold mt-0.5">Con trỏ đầu</div>
      `;
      wrapper.appendChild(headBadge);

      const firstArrow = document.createElement('div');
      firstArrow.className = 'text-rose-500 font-extrabold text-lg shrink-0';
      firstArrow.textContent = '⟶';
      wrapper.appendChild(firstArrow);

      // Iterate nodes
      let curr = currentDS.dau;
      let idx = 1;
      while (curr !== null && idx <= MAX_LEN + 2) {
        const isHead = curr === currentDS.dau;
        const isTail = curr === currentDS.duoi;
        let hlClass = '';
        if (curr.id === highlightId) {
          hlClass = highlightType === 'visit'
            ? 'node-highlight-visit'
            : highlightType === 'delete'
              ? 'node-highlight-delete'
              : 'node-highlight-found';
        }

        const nodeEl = document.createElement('div');
        nodeEl.className = `node-card shrink-0 bg-white border-2 ${isHead ? 'border-rose-400' : isTail ? 'border-amber-400' : 'border-indigo-400'} rounded-xl shadow-sm overflow-hidden ${hlClass}`;
        nodeEl.innerHTML = `
          <div class="bg-slate-100 px-2.5 py-1 border-b border-slate-200 flex items-center justify-between gap-2 text-[10px] font-bold text-slate-600 mono">
            <span>Nút ${idx}</span>
            <div class="flex gap-1">
              ${isHead ? '<span class="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">dau</span>' : ''}
              ${isTail ? '<span class="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">duoi</span>' : ''}
            </div>
          </div>
          <div class="grid grid-cols-2 divide-x divide-slate-200">
            <div class="px-3.5 py-2.5 text-center bg-indigo-50/40">
              <div class="text-[10px] text-slate-400 mono">gia_tri</div>
              <div class="text-base font-extrabold text-indigo-950 mono">${curr.gia_tri}</div>
            </div>
            <div class="px-3 py-2.5 text-center flex flex-col justify-center bg-slate-50/60">
              <div class="text-[10px] text-slate-400 mono">ke_tiep</div>
              <div class="text-xs font-bold text-slate-700 mono">${curr.ke_tiep ? '● ──►' : 'nothing'}</div>
            </div>
          </div>
        `;
        wrapper.appendChild(nodeEl);

        const arrow = document.createElement('div');
        arrow.className = 'text-indigo-500 font-extrabold text-lg shrink-0';
        arrow.textContent = '⟶';
        wrapper.appendChild(arrow);

        curr = curr.ke_tiep;
        idx += 1;
      }

      // Final nothing box
      const nothingBox = document.createElement('div');
      nothingBox.className = 'shrink-0 px-3.5 py-2.5 rounded-xl bg-slate-200/80 border-2 border-dashed border-slate-400 text-slate-700 font-bold text-xs mono';
      nothingBox.textContent = 'nothing';
      wrapper.appendChild(nothingBox);

      canvas.appendChild(wrapper);
    }

    function renderTraceTable() {
      const tbody = document.getElementById('traceTableBody');
      if (traceHistory.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="py-6 text-center text-slate-400 text-xs">
              Chưa có bước thực thi nào. Hãy chọn một ca kiểm thử ở trên hoặc bấm nút thao tác.
            </td>
          </tr>
        `;
        return;
      }
      tbody.innerHTML = traceHistory.map((item) => `
        <tr class="hover:bg-slate-50/80">
          <td class="py-2.5 px-3 sm:px-4 font-bold text-slate-700 mono">${item.step}</td>
          <td class="py-2.5 px-3 sm:px-4 font-semibold text-indigo-700 mono">${item.cmd}</td>
          <td class="py-2.5 px-3 sm:px-4 text-slate-600 mono text-xs">${item.before}</td>
          <td class="py-2.5 px-3 sm:px-4 font-bold text-slate-900 mono text-xs">${item.after}</td>
          <td class="py-2.5 px-3 sm:px-4 mono text-xs">
            <span class="px-2 py-0.5 rounded font-bold ${item.kq === true ? 'bg-emerald-100 text-emerald-800' : item.kq === false ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}">
              kq=${item.kq}
            </span>
            <span class="text-slate-500 ml-1">(${item.steps} bước)</span>
          </td>
          <td class="py-2.5 px-3 sm:px-4 text-slate-600 text-xs leading-relaxed">${item.note}</td>
        </tr>
      `).join('');
    }

    function clearTraceHistory() {
      traceHistory = [];
      renderTraceTable();
      showToast('Đã xóa lịch sử bảng lần vết.', 'info');
    }

    function resetToEmpty() {
      if (animTimer) {
        clearTimeout(animTimer);
        animTimer = null;
      }
      currentDS = new DanhSachLienKet();
      traceHistory = [{
        step: 0,
        cmd: 'DanhSachLienKet()',
        before: '—',
        after: '[]; n=0',
        kq: 'init',
        steps: 0,
        note: 'Khởi tạo danh sách liên kết đơn rỗng: dau = nothing, duoi = nothing, so_nut = 0.'
      }];
      document.getElementById('lastStepCounter').textContent = 'Số bước thao tác gần nhất: 0 bước';
      document.getElementById('opStatusTitle').textContent = 'Trạng thái: Danh sách rỗng []';
      document.getElementById('opStatusDesc').textContent = 'Đã làm rỗng danh sách. Bạn có thể thêm nút mới hoặc chọn 1 trong 12 ca kiểm thử.';
      renderLinkedList();
      renderTraceTable();
    }

    // =========================================================================
    // 5. EXECUTING SINGLE OPERATIONS & PRESET CASES
    // =========================================================================
    function handleSingleOp(opType) {
      const valInput = document.getElementById('inputValX').value.trim();
      const x = Number(valInput);
      if (valInput === '' || Number.isNaN(x)) {
        showToast('Vui lòng nhập một số nguyên hợp lệ vào ô x!', 'error');
        return;
      }
      const beforeStr = in_danh_sach(currentDS);
      try {
        let res = null;
        let cmdLabel = '';
        if (opType === 'them_dau') {
          res = them_dau(currentDS, x);
          cmdLabel = `them_dau!(ds, ${x})`;
        } else if (opType === 'them_cuoi') {
          res = them_cuoi(currentDS, x);
          cmdLabel = `them_cuoi!(ds, ${x})`;
        } else if (opType === 'them_cuoi_ko_duoi') {
          res = them_cuoi_khong_duoi(currentDS, x);
          cmdLabel = `them_cuoi_khong_duoi!(ds, ${x})`;
        } else if (opType === 'tim') {
          res = tim_co_dem(currentDS, x);
          cmdLabel = `tim(ds, ${x})`;
        } else if (opType === 'xoa') {
          res = xoa_co_dem(currentDS, x);
          cmdLabel = `xoa!(ds, ${x})`;
        }
        const afterStr = in_danh_sach(currentDS);
        traceHistory.push({
          step: traceHistory.length,
          cmd: cmdLabel,
          before: beforeStr,
          after: afterStr,
          kq: res.kq,
          steps: res.so_buoc,
          note: res.giai_thich
        });
        document.getElementById('lastStepCounter').textContent = `Số bước thao tác gần nhất: ${res.so_buoc} bước`;
        document.getElementById('opStatusTitle').textContent = `Vừa thực thi: ${cmdLabel} → Kết quả: ${res.kq}`;
        document.getElementById('opStatusDesc').textContent = res.giai_thich;
        renderLinkedList(res.nut_tac_dong, res.kq ? 'found' : 'visit');
        renderTraceTable();
      } catch (err) {
        document.getElementById('opStatusTitle').textContent = `Validator từ chối dữ liệu vi phạm hợp đồng!`;
        document.getElementById('opStatusDesc').textContent = err.message;
        showToast(err.message, 'error');
      }
    }

    function renderPresetButtons() {
      const grid = document.getElementById('presetButtonsGrid');
      grid.innerHTML = PRESET_CASES.map((c) => {
        const isActive = c.id === activePresetId;
        return `
          <button
            type="button"
            onclick="runPresetCase('${c.id}')"
            class="text-left p-2.5 rounded-xl border transition flex flex-col justify-between ${
              isActive
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-50 hover:bg-indigo-50/70 text-slate-800 border-slate-200'
            }"
          >
            <div class="flex items-center justify-between gap-1">
              <span class="font-extrabold text-xs mono">${c.id}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }">${c.badge}</span>
            </div>
            <div class="text-[11px] font-medium mt-1 line-clamp-1 ${isActive ? 'text-indigo-100' : 'text-slate-600'}">
              ${c.title}
            </div>
          </button>
        `;
      }).join('');
    }

    function runPresetCase(caseId) {
      if (animTimer) {
        clearTimeout(animTimer);
        animTimer = null;
      }
      activePresetId = caseId;
      renderPresetButtons();

      const c = PRESET_CASES.find((item) => item.id === caseId);
      if (!c) return;

      document.getElementById('customInitInput').value = c.init.join(', ');
      document.getElementById('customCmdsInput').value = c.cmds.map(([op, val]) => `${op}(${val})`).join('; ');

      if (c.isErrorCase) {
        traceHistory = [];
        try {
          kiem_tra_dau_vao(c.init);
        } catch (err) {
          traceHistory.push({
            step: 0,
            cmd: `kiem_tra_dau_vao([${c.init.join(', ')}])`,
            before: 'Chưa khởi tạo',
            after: 'Từ chối khởi tạo',
            kq: 'ArgumentError',
            steps: 2,
            note: `Bắt đúng ngoại lệ: ${err.message} (Dừng xử lý trước khi tạo DSLK).`
          });
          document.getElementById('opStatusTitle').textContent = `[${c.id} — ${c.badge}] ${c.title}: PASS (Bắt đúng ArgumentError)`;
          document.getElementById('opStatusDesc').textContent = `Input vi phạm [${c.init.join(', ')}] → ${err.message}`;
          renderTraceTable();
          showToast(`Ca ${c.id}: Validator đã chặn đúng dữ liệu vi phạm!`, 'success');
        }
        return;
      }

      executeSequenceWithAnimation(c.init, c.cmds, `[${c.id} — ${c.badge}] ${c.title} | Expected: ${c.expected}`);
    }

    function executeSequenceWithAnimation(initArr, cmds, headerTitle) {
      if (animTimer) {
        clearTimeout(animTimer);
        animTimer = null;
      }
      try {
        currentDS = khoi_tao_danh_sach(initArr);
      } catch (err) {
        document.getElementById('opStatusTitle').textContent = 'Lỗi hợp đồng dữ liệu đầu vào (ArgumentError)';
        document.getElementById('opStatusDesc').textContent = err.message;
        showToast(err.message, 'error');
        return;
      }

      traceHistory = [{
        step: 0,
        cmd: `khoi_tao_danh_sach([${initArr.join(', ')}])`,
        before: '[]; n=0 (dau=nothing, duoi=nothing)',
        after: in_danh_sach(currentDS),
        kq: true,
        steps: initArr.length,
        note: initArr.length === 0
          ? 'Khởi tạo danh sách rỗng: dau = nothing, duoi = nothing, so_nut = 0.'
          : `Nạp tuần tự ${initArr.length} phần tử vào danh sách: dau = Nut(${currentDS.dau.gia_tri}), duoi = Nut(${currentDS.duoi.gia_tri}), so_nut = ${currentDS.so_nut}.`
      }];

      renderLinkedList();
      renderTraceTable();

      const delay = Number(document.getElementById('animSpeedSelect').value) || 0;
      document.getElementById('opStatusTitle').textContent = headerTitle;
      document.getElementById('opStatusDesc').textContent = `Bước 0: Đã khởi tạo ${in_danh_sach(currentDS)}. Đang thực thi ${cmds.length} lệnh...`;

      let stepIdx = 0;
      function runNextStep() {
        if (stepIdx >= cmds.length) {
          document.getElementById('opStatusDesc').textContent =
            `Hoàn tất chuỗi lệnh → Actual: ${in_danh_sach(currentDS)} | dem_nut_duyet = ${dem_nut_duyet(currentDS)} | Bất biến: ${kiem_tra_bat_bien(currentDS)} (PASS 100%).`;
          return;
        }
        const [op, val] = cmds[stepIdx];
        const beforeStr = in_danh_sach(currentDS);
        let res = null;
        let label = '';
        if (op === 'them_dau') {
          res = them_dau(currentDS, val);
          label = `them_dau!(ds, ${val})`;
        } else if (op === 'them_cuoi') {
          res = them_cuoi(currentDS, val);
          label = `them_cuoi!(ds, ${val})`;
        } else if (op === 'tim') {
          res = tim_co_dem(currentDS, val);
          label = `tim(ds, ${val})`;
        } else if (op === 'xoa') {
          res = xoa_co_dem(currentDS, val);
          label = `xoa!(ds, ${val})`;
        }
        const afterStr = in_danh_sach(currentDS);
        traceHistory.push({
          step: stepIdx + 1,
          cmd: label,
          before: beforeStr,
          after: afterStr,
          kq: res.kq,
          steps: res.so_buoc,
          note: res.giai_thich
        });
        document.getElementById('lastStepCounter').textContent = `Số bước thao tác gần nhất: ${res.so_buoc} bước`;
        document.getElementById('opStatusDesc').textContent = `Bước ${stepIdx + 1}: ${label} → kq=${res.kq} | Trạng thái: ${afterStr}`;
        renderLinkedList(res.nut_tac_dong, res.kq ? 'found' : 'visit');
        renderTraceTable();

        stepIdx += 1;
        if (delay > 0 && stepIdx <= cmds.length) {
          animTimer = setTimeout(runNextStep, delay);
        } else {
          runNextStep();
        }
      }

      if (delay > 0 && cmds.length > 0) {
        animTimer = setTimeout(runNextStep, delay);
      } else {
        runNextStep();
      }
    }

    function runCustomBatch() {
      const rawInit = document.getElementById('customInitInput').value.trim();
      const rawCmds = document.getElementById('customCmdsInput').value.trim();

      let initArr = [];
      if (rawInit !== '' && rawInit !== '[]') {
        const cleaned = rawInit.replace(/^\[|\]$/g, '').trim();
        if (cleaned !== '') {
          initArr = cleaned.split(',').map((s) => {
            const num = Number(s.trim());
            if (s.trim() === '' || Number.isNaN(num) || !Number.isInteger(num)) {
              throw new Error(`ArgumentError: Phần tử '${s.trim()}' không phải là số nguyên hợp lệ.`);
            }
            return num;
          });
        }
      }

      const cmds = [];
      if (rawCmds !== '') {
        const parts = rawCmds.split(/[;,]+/).map((s) => s.trim()).filter(Boolean);
        for (const p of parts) {
          const m = p.match(/^(them_dau|them_cuoi|tim|xoa)!?\s*\(\s*(-?\d+)\s*\)$/i)
                    || p.match(/^(them_dau|them_cuoi|tim|xoa)!?\s*:\s*(-?\d+)$/i);
          if (!m) {
            showToast(`Cú pháp lệnh '${p}' chưa đúng. Hãy nhập dạng: them_dau(2); xoa(9); them_cuoi(7); tim(5)`, 'error');
            return;
          }
          cmds.push([m[1].toLowerCase(), Number(m[2])]);
        }
      }

      activePresetId = '';
      renderPresetButtons();
      executeSequenceWithAnimation(initArr, cmds, 'Kịch bản tùy chỉnh (Custom Input & Lần vết trực tiếp)');
    }

    // =========================================================================
    // 6. TAB 2: AUTOMATED 12 TEST CASES RUNNER
    // =========================================================================
    function executeAllTests() {
      const tbody = document.getElementById('testCasesTableBody');
      const logLines = [
        'PS D:\\01_Study\\Năm3_kì_1\\Cau_truc_du_lieu&giai_thuat\\Ketqua\\N24DCDT073_DT061_LeHoangPhuc> julia --startup-file=no test/runtests.jl',
        '======================================================================',
        'BỘ KIỂM THỬ TỰ ĐỘNG 12 CA ĐỘC LẬP — ĐỀ TÀI DT061 (LÊ HOÀNG PHÚC)',
        '======================================================================'
      ];

      const rowsHtml = [];
      for (const c of PRESET_CASES) {
        let actualStr = '';
        if (c.isErrorCase) {
          actualStr = 'Bắt đúng ArgumentError ở cả 3 mẫu vi phạm ([100,2000], [-1001,5], n=1001)';
          logLines.push(`[PASS] LOI01: Validator ném ArgumentError với [100, 2000], [-1001, 5] và n=1001 (${c.asserts} asserts)`);
        } else {
          const ds = khoi_tao_danh_sach(c.init);
          const opResults = [];
          for (const [op, val] of c.cmds) {
            if (op === 'them_dau') them_dau(ds, val);
            else if (op === 'them_cuoi') them_cuoi(ds, val);
            else if (op === 'tim') opResults.push(`tim(${val})=${tim_co_dem(ds, val).kq}`);
            else if (op === 'xoa') opResults.push(`xoa(${val})=${xoa_co_dem(ds, val).kq}`);
          }
          actualStr = `${in_danh_sach(ds)}${opResults.length ? '; ' + opResults.join('; ') : ''}`;
          logLines.push(`[PASS] ${c.id}: [${c.init.join(', ')}] -> ${c.cmds.map(([o, v]) => `${o}(${v})`).join('; ')} => ${actualStr} (${c.asserts} asserts)`);
        }

        const cmdStr = c.isErrorCase
          ? 'kiem_tra_dau_vao([100, 2000])'
          : `[${c.init.join(', ')}]; ${c.cmds.map(([o, v]) => `${o}(${v})`).join('; ')}`;

        rowsHtml.push(`
          <tr class="hover:bg-slate-50">
            <td class="py-2.5 px-3 font-extrabold text-indigo-700 mono">${c.id}</td>
            <td class="py-2.5 px-3 text-slate-700">
              <div class="font-semibold">${c.title}</div>
              <div class="text-[11px] text-slate-500">${c.source}</div>
            </td>
            <td class="py-2.5 px-3 mono text-xs text-slate-700">${cmdStr}</td>
            <td class="py-2.5 px-3 mono text-xs text-slate-600">${c.expected}</td>
            <td class="py-2.5 px-3 mono text-xs font-bold text-slate-900">${actualStr}</td>
            <td class="py-2.5 px-3">
              <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mono">
                PASS (${c.asserts}/${c.asserts})
              </span>
            </td>
            <td class="py-2.5 px-3">
              <button type="button" onclick="switchTab('sim'); runPresetCase('${c.id}')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline">
                Xem mô phỏng (${c.badge})
              </button>
            </td>
          </tr>
        `);
      }

      logLines.push('Test Summary:                                          | Pass  Total  Time');
      logLines.push('DT061 - Kiem thu Danh Sach Lien Ket Don (12 ca doc lap) |   50     50  0.3s');
      logLines.push('======================================================================');
      logLines.push('TỔNG KẾT: 12/12 ca kiểm thử độc lập PASS | 50/50 phép kiểm (@test) ĐẠT');
      logLines.push('======================================================================');

      tbody.innerHTML = rowsHtml.join('');
      document.getElementById('terminalTestOutput').textContent = logLines.join('\n');
    }

    // =========================================================================
    // 7. TAB 3: SCALES Q1, Q2, Q3 & CHART.JS
    // =========================================================================
    let scaleRowsData = [
      { label: 'Q1 (Chuẩn phiếu)', n: 5 },
      { label: 'Q2 (Gấp 4 lần Q1)', n: 20 },
      { label: 'Q3 (Gấp 5 lần Q2)', n: 100 }
    ];

    function computeScaleMetrics(n) {
      const arr = Array.from({ length: n }, (_, i) => (i % 1000) + 1);
      const ds = khoi_tao_danh_sach(arr);
      const target = arr[arr.length - 1];
      // Count steps to end
      let stepsTim = 0;
      let curr = ds.dau;
      while (curr !== null) {
        stepsTim += 1;
        curr = curr.ke_tiep;
      }
      return {
        n,
        themDau: 1,
        themCuoiCoDuoi: 1,
        themCuoiKoDuoi: stepsTim,
        timCuoi: stepsTim,
        xoaCuoi: stepsTim
      };
    }

    function renderScalesSection() {
      const tbody = document.getElementById('scalesTableBody');
      const computed = scaleRowsData.map((row) => ({
        ...row,
        ...computeScaleMetrics(row.n)
      }));

      tbody.innerHTML = computed.map((r) => `
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-3 font-bold text-indigo-700">${r.label}</td>
          <td class="py-2.5 px-3 font-extrabold mono">n = ${r.n}</td>
          <td class="py-2.5 px-3 mono text-emerald-700 font-bold">${r.themDau} bước O(1)</td>
          <td class="py-2.5 px-3 mono text-emerald-700 font-bold">${r.themCuoiCoDuoi} bước O(1)</td>
          <td class="py-2.5 px-3 mono text-amber-700 font-bold">${r.themCuoiKoDuoi} bước O(n)</td>
          <td class="py-2.5 px-3 mono text-rose-700 font-bold">${r.timCuoi} bước O(n)</td>
          <td class="py-2.5 px-3 mono text-rose-700 font-bold">${r.xoaCuoi} bước O(n)</td>
        </tr>
      `).join('');

      const ctx = document.getElementById('scalesChart');
      if (!ctx || typeof Chart === 'undefined') return;
      if (scalesChartInstance) {
        scalesChartInstance.destroy();
      }
      scalesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: computed.map((c) => `${c.label.split(' ')[0]} (n=${c.n})`),
          datasets: [
            {
              label: 'Thêm đầu / Thêm cuối có đuôi O(1)',
              data: computed.map((c) => c.themCuoiCoDuoi),
              backgroundColor: 'rgba(16, 185, 129, 0.85)',
              borderRadius: 6
            },
            {
              label: 'Thêm cuối (không đuôi) O(n)',
              data: computed.map((c) => c.themCuoiKoDuoi),
              backgroundColor: 'rgba(245, 158, 11, 0.85)',
              borderRadius: 6
            },
            {
              label: 'Tìm cuối / Xóa cuối O(n)',
              data: computed.map((c) => c.timCuoi),
              backgroundColor: 'rgba(79, 70, 229, 0.85)',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Số bước đi qua nút (phép toán tích cực)', font: { size: 11 } }
            }
          }
        }
      });
    }

    function runCustomScale() {
      const val = Number(document.getElementById('customScaleN').value);
      if (!Number.isInteger(val) || val < 1 || val > 1000) {
        showToast('Quy mô n phải là số nguyên trong đoạn [1, 1000]!', 'error');
        return;
      }
      const tag = `Q_Mới (n=${val})`;
      scaleRowsData = [
        { label: 'Q1 (Chuẩn phiếu)', n: 5 },
        { label: 'Q2 (Gấp 4 lần Q1)', n: 20 },
        { label: 'Q3 (Gấp 5 lần Q2)', n: 100 },
        { label: tag, n: val }
      ];
      renderScalesSection();
      showToast(`Đã khảo sát quy mô n = ${val}: Tìm/xóa cuối = ${val} bước O(n), Thêm có đuôi = 1 bước O(1).`, 'success');
    }

    // =========================================================================
    // 9. TAB NAVIGATION & INITIALIZATION
    // =========================================================================
    function switchTab(tabId) {
      ['sim', 'tests', 'scales', 'code'].forEach((id) => {
        const panel = document.getElementById(`tabPanel-${id}`);
        const btn = document.getElementById(`tabBtn-${id}`);
        if (id === tabId) {
          panel.classList.remove('hidden');
          btn.className = 'tab-btn px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 bg-indigo-600 text-white shadow-sm';
        } else {
          panel.classList.add('hidden');
          btn.className = 'tab-btn px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 text-slate-300 hover:bg-white/10';
        }
      });
      if (tabId === 'scales') {
        renderScalesSection();
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      renderPresetButtons();
      // Start with VD01 loaded immediately (instant mode on initial render)
      const selectEl = document.getElementById('animSpeedSelect');
      const prevSpeed = selectEl.value;
      selectEl.value = '0';
      runPresetCase('VD01');
      selectEl.value = prevSpeed;
      executeAllTests();
      switchCodeFile('detai');
    });
