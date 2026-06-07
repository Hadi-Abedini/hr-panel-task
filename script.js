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
const inits = (nm) => {
  const p = nm.trim().split(" ");
  return p.length >= 2 ? p[0][0] + p[1][0] : p[0].slice(0, 2);
};
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
