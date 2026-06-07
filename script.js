const SN = ["بررسی اولیه", "تکمیل مستندات", "طرح در کمیته", "در انتظار پرداخت"];
const SC = [
  ["#d97706", "#fffbeb"],
  ["#2563eb", "#eff6ff"],
  ["#7c3aed", "#f5f3ff"],
  ["#059669", "#ecfdf5"],
];
const TYPES = [
  "وام ازدواج",
  "وام مسکن",
  "وام اضطراری",
  "کمک هزینه تحصیلی",
  "وام خودرو",
  "بیمه تکمیلی",
];
const TYPE_COLORS = [
  ["#d97706", "#fffbeb"],
  ["#2563eb", "#eff6ff"],
  ["#dc2626", "#fef2f2"],
  ["#7c3aed", "#f5f3ff"],
  ["#0891b2", "#ecfeff"],
  ["#059669", "#ecfdf5"],
];
const DEPTS = [
  "فناوری اطلاعات",
  "مالی",
  "اداری",
  "بازرگانی",
  "حقوقی",
  "فروش",
  "پشتیبانی",
];
const NAMES = [
  "علی محمدی",
  "زهرا رضایی",
  "مجید کریمی",
  "فاطمه احمدی",
  "حسین موسوی",
  "مریم صادقی",
  "امیر حسینی",
  "نرگس جعفری",
  "سعید رستمی",
  "لیلا نوری",
  "محمد اکبری",
  "شیرین تهرانی",
  "رضا قاسمی",
  "آرزو یوسفی",
  "کامران بهرامی",
  "پریسا شاهی",
  "داود منصوری",
  "نیلوفر حیدری",
  "بهنام علیزاده",
  "ثمین خانی",
  "سارا نجفی",
  "توحید قنبری",
  "مینا صالحی",
  "یاسر عزیزی",
  "ندا ابراهیمی",
  "وحید طاهری",
];
const AMTS = [
  "۱۰,۰۰۰,۰۰۰",
  "۲۰,۰۰۰,۰۰۰",
  "۳۰,۰۰۰,۰۰۰",
  "۵۰,۰۰۰,۰۰۰",
  "۱۵,۰۰۰,۰۰۰",
  "۱۰۰,۰۰۰,۰۰۰",
  "۷۵,۰۰۰,۰۰۰",
];
const DATES = [
  "۱۴۰۳/۰۱/۱۵",
  "۱۴۰۳/۰۱/۲۲",
  "۱۴۰۳/۰۲/۰۳",
  "۱۴۰۳/۰۲/۱۰",
  "۱۴۰۳/۰۲/۱۸",
  "۱۴۰۳/۰۲/۲۵",
  "۱۴۰۳/۰۳/۰۱",
  "۱۴۰۳/۰۳/۰۸",
];
const PLAB = { h: "بالا", m: "متوسط", l: "پایین" };
const PRIS = ["h", "m", "l"];
const DESCS = [
  "درخواست حمایت مالی هنگام ازدواج می‌باشد.",
  "درخواست جهت تأمین هزینه‌های مسکن ارائه شده است.",
  "به دلیل مشکل اضطراری مالی ثبت شده است.",
  "برای پوشش هزینه‌های تحصیلی فرزند ارائه گردید.",
  "جهت خرید خودرو مورد نیاز تقاضا داده شده.",
  "بیمه تکمیلی درمانی درخواست شده است.",
];
const WYRS = [
  "۲ سال",
  "۵ سال",
  "۸ سال",
  "۳ سال",
  "۱۰ سال",
  "۱۲ سال",
  "۶ سال",
  "۱ سال",
];
const AVC = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#6366f1",
  "#06b6d4",
];

// ── State ──
let rqs = [],
  selSt = -1,
  selIds = new Set(),
  filtRqs = [],
  curPg = 1,
  pendIds = [],
  curId = null;
const PS = 8;

// ── Helpers ──
const fn = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
const avClr = (id) =>
  AVC[id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVC.length];

// ── Generate mock data ──
NAMES.forEach((nm, i) => {
  const tIdx = i % TYPES.length;
  rqs.push({
    id: "REQ-" + String(1000 + i),
    name: nm,
    dept: DEPTS[i % DEPTS.length],
    type: TYPES[tIdx],
    date: DATES[i % DATES.length],
    pri: PRIS[i % 3],
    amt: AMTS[i % AMTS.length],
    status: i % 4,
    eid: "پ-" + String(10000 + i),
    wyr: WYRS[i % WYRS.length],
    desc: DESCS[tIdx],
  });
});

function init() {
  updCnts();
  applyF();
}

function updCnts() {
  const tot = rqs.length;
  SN.forEach((_, i) => {
    const c = rqs.filter((r) => r.status === i).length;
    const pct = tot ? Math.round((c / tot) * 100) : 0;
    document.getElementById("cnt-" + i).textContent = fn(c);
    setTimeout(
      () => {
        const b = document.getElementById("bar-" + i);
        if (b) b.style.width = pct + "%";
      },
      400 + i * 120,
    );
  });
}

function selStatus(i) {
  if (selSt === i) {
    selSt = -1;
    document.getElementById("card-" + i).classList.remove("active");
  } else {
    document
      .querySelectorAll(".scard")
      .forEach((c) => c.classList.remove("active"));
    document.getElementById("card-" + i).classList.add("active");
    selSt = i;
  }
  selIds.clear();
  curPg = 1;
  applyF();
}

function applyF() {
  const q = document.getElementById("srch").value.trim().toLowerCase();
  const ft = document.getElementById("ftype").value;
  const fd = document.getElementById("fdept").value;
  const fp = document.getElementById("fpri").value;

  filtRqs = rqs.filter((r) => {
    if (selSt !== -1 && r.status !== selSt) return false;
    if (ft && r.type !== ft) return false;
    if (fd && r.dept !== fd) return false;
    if (fp && r.pri !== fp) return false;
    if (
      q &&
      !r.name.includes(q) &&
      !r.dept.toLowerCase().includes(q) &&
      !r.id.toLowerCase().includes(q)
    )
      return false;
    return true;
  });
  curPg = 1;
  renderTbl();
  updPanel();
  updChips(q, ft, fd, fp);
}

function updPanel() {
  const ti = document.getElementById("ptxt");
  const ba = document.getElementById("pbadge");
  if (selSt === -1) {
    ti.textContent = "همه درخواست‌ها";
    ba.style.cssText = "background:#f1f5f9;color:#475569";
  } else {
    ti.textContent = SN[selSt];
    ba.style.cssText = `background:${SC[selSt][1]};color:${SC[selSt][0]}`;
  }
  ba.textContent = fn(filtRqs.length) + " درخواست";
}

function updChips(q, ft, fd, fp) {
  const el = document.getElementById("fchips");
  el.innerHTML = "";
  const add = (lbl, clr) => {
    const c = document.createElement("div");
    c.className = "fchip";
    c.innerHTML = `${lbl} <span class="fx">✕</span>`;
    c.onclick = clr;
    el.appendChild(c);
  };
  if (q)
    add(`جستجو: "${q}"`, () => {
      document.getElementById("srch").value = "";
      applyF();
    });
  if (ft)
    add(ft, () => {
      document.getElementById("ftype").value = "";
      applyF();
    });
  if (fd)
    add(fd, () => {
      document.getElementById("fdept").value = "";
      applyF();
    });
  if (fp)
    add(PLAB[fp], () => {
      document.getElementById("fpri").value = "";
      applyF();
    });
}

function renderTbl() {
  const tb = document.getElementById("tbody");
  const em = document.getElementById("emp");
  const s = (curPg - 1) * PS;
  const items = filtRqs.slice(s, s + PS);

  if (!filtRqs.length) {
    tb.innerHTML = "";
    em.style.display = "block";
  } else {
    em.style.display = "none";
    tb.innerHTML = items
      .map((r) => {
        const ti = TYPES.indexOf(r.type);
        const [tc, tbg] = ti >= 0 ? TYPE_COLORS[ti] : ["#64748b", "#f1f5f9"];
        return `
        <tr class="${selIds.has(r.id) ? "sel" : ""}" id="tr-${r.id}">
          <td><input type="checkbox" ${selIds.has(r.id) ? "checked" : ""} onchange="togSel('${r.id}')"></td>
          <td style="font-family:monospace;font-size:11px;color:#94a3b8">${r.id}</td>
          <td>
            <div class="emp-cell">
              <div class="emp-name">${r.name}</div>
            </div>
          </td>
          <td><span class="tbadge">${r.dept}</span></td>
          <td><span class="tchip" style="background:${tbg};color:${tc}">${r.type}</span></td>
          <td><span class="pri" style="background:${SC[r.status][1]};color:${SC[r.status][0]}">${SN[r.status]}</span></td>
          <td style="color:var(--txl);font-size:11px">${r.date}</td>
          <td><span class="pri ${r.pri}">${PLAB[r.pri]}</span></td>
          <td>
            <div class="abts">
              <button class="ibtn v" onclick="openDetail('${r.id}')">👁 <span class="ilbl">مشاهده</span></button>
              ${
                r.status > 0
                  ? `<button class="ibtn b" onclick="openConfirm('${r.id}', false)">↩ <span class="ilbl">برگشت</span></button>`
                  : '<div style="width:28px"></div>'
              }
            </div>
          </td>
        </tr>`;
      })
      .join("");
  }
  renderPagi();
  updBulk();
  document.getElementById("chkAll").checked =
    items.length > 0 && items.every((r) => selIds.has(r.id));
}

function renderPagi() {
  const tot = filtRqs.length;
  const pages = Math.ceil(tot / PS);
  const s = Math.min((curPg - 1) * PS + 1, tot);
  const e = Math.min(curPg * PS, tot);

  document.getElementById("paginfo").textContent = tot
    ? `نمایش ${fn(s)} تا ${fn(e)} از ${fn(tot)} درخواست`
    : "";

  const pb = document.getElementById("pbts");
  pb.innerHTML = "";
  if (pages <= 1) return;
  for (let i = 1; i <= pages; i++) {
    const b = document.createElement("button");
    b.className = "pbtn" + (i === curPg ? " act" : "");
    b.textContent = fn(i);
    b.onclick = () => {
      curPg = i;
      renderTbl();
    };
    pb.appendChild(b);
  }
}

function togSel(id) {
  selIds.has(id) ? selIds.delete(id) : selIds.add(id);
  renderTbl();
}

function togAll() {
  const all = document.getElementById("chkAll").checked;
  filtRqs
    .slice((curPg - 1) * PS, curPg * PS)
    .forEach((r) => (all ? selIds.add(r.id) : selIds.delete(r.id)));
  renderTbl();
}

function clearSel() {
  selIds.clear();
  renderTbl();
}

function updBulk() {
  const bar = document.getElementById("bbar");
  const cnt = document.getElementById("bcnt");
  if (selIds.size > 0) {
    bar.classList.add("show");
    cnt.textContent = fn(selIds.size) + " درخواست انتخاب شده";
  } else {
    bar.classList.remove("show");
  }
}

function bulkBack() {
  openConfirm(null, false);
}

function openM(id) {
  document.getElementById(id).classList.add("show");
}
function closeM(id) {
  document.getElementById(id).classList.remove("show");
}

function openDetail(id) {
  const r = rqs.find((x) => x.id === id);
  if (!r) return;
  curId = id;

  const chip = document.getElementById("msc");
  chip.textContent = SN[r.status];
  chip.style.cssText = `background:${SC[r.status][1]};color:${SC[r.status][0]}`;

  document.getElementById("psteps").innerHTML = SN.map((s, i) => {
    const cls = i < r.status ? "done" : i === r.status ? "cur" : "";
    return `<div class="step ${cls}">
      <div class="scirc">${i < r.status ? "✓" : fn(i + 1)}</div>
      <div class="slbl">${s}</div>
    </div>`;
  }).join("");

  const ti = TYPES.indexOf(r.type);

  document.getElementById("dgrid").innerHTML = `
    <div class="ditem"><label>شناسه درخواست</label><div class="dval" style="font-family:monospace;font-size:12px;color:#64748b">${r.id}</div></div>
    <div class="ditem"><label>کد پرسنلی</label><div class="dval">${r.eid}</div></div>
    <div class="ditem"><label>نام کارمند</label>
      <div class="dval" style="display:flex;align-items:center;gap:8px">
        ${r.name}
      </div>
    </div>
    <div class="ditem"><label>واحد سازمانی</label><div class="dval">${r.dept}</div></div>
    <div class="ditem"><label>نوع درخواست</label><div class="dval">${r.type}</div></div>
    <div class="ditem"><label>تاریخ ثبت</label><div class="dval">${r.date}</div></div>
    <div class="ditem"><label>مبلغ درخواستی (ریال)</label><div class="dval">${r.amt}</div></div>
    <div class="ditem"><label>سابقه کاری</label><div class="dval">${r.wyr}</div></div>
    <div class="ditem"><label>اولویت</label><div class="dval"><span class="pri ${r.pri}">${PLAB[r.pri]}</span></div></div>
    <div class="ditem"><label>وضعیت فعلی</label><div class="dval" style="color:${SC[r.status][0]};font-weight:800">${SN[r.status]}</div></div>
    <div class="dsep"></div>
    <div class="ditem full"><label>توضیحات</label><div class="dval desc">${r.desc}</div></div>`;

  document.getElementById("dbackBtn").style.display =
    r.status > 0 ? "inline-flex" : "none";
  openM("mDetail");
}

function openConfirm(id, fromDetail) {
  if (id) {
    pendIds = [id];
    curId = id;
  } else
    pendIds = [...selIds].filter((i) => {
      const r = rqs.find((x) => x.id === i);
      return r && r.status > 0;
    });

  if (!pendIds.length) {
    showToast("⚠️ هیچ درخواست واجد شرایطی یافت نشد");
    return;
  }

  if (pendIds.length === 1) {
    const r = rqs.find((x) => x.id === pendIds[0]);
    document.getElementById("ctxt").textContent =
      `درخواست ${r.id} (${r.name}) از مرحله «${SN[r.status]}» به مرحله «${SN[r.status - 1]}» بازگشت داده می‌شود. آیا تأیید می‌کنید؟`;
  } else {
    document.getElementById("ctxt").textContent =
      `${fn(pendIds.length)} درخواست به مرحله قبل بازگشت داده می‌شوند. آیا تأیید می‌کنید؟`;
  }

  if (!fromDetail) closeM("mDetail");
  openM("mConfirm");
}

function doBack() {
  pendIds.forEach((id) => {
    const r = rqs.find((x) => x.id === id);
    if (r && r.status > 0) r.status--;
  });
  const c = pendIds.length;
  pendIds = [];
  closeM("mConfirm");
  closeM("mDetail");
  selIds.clear();
  updCnts();
  applyF();
  showToast("✓ " + fn(c) + " درخواست با موفقیت به مرحله قبل بازگشت داده شد");
}

let tTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(tTimer);
  tTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

document.querySelectorAll(".mover").forEach((o) =>
  o.addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("show");
  }),
);

init();
