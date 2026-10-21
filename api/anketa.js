// Коннектор: анкета на сайті → CRM платформи B&M Budget.
// Ключ BM_CRM_KEY лежить у Vercel env проєкту vse-ai і ніколи не потрапляє в браузер.
// Контракт приймача: docs/CRM-INTAKE.md у репозиторії платформи.

const INTAKE_URL = "https://bm-budget-platform.vercel.app/api/crm/intake";
const MAX_ANSWERS = 40;
const MAX_ANSWER_LEN = 600;

function str(v, max) {
  if (v === undefined || v === null) return "";
  return String(v).trim().slice(0, max);
}

function normalizeAnswers(raw) {
  // Приймаємо масив [{q, a}] або обʼєкт {питання: відповідь}; віддаємо масив у тому ж порядку.
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object"
      ? Object.entries(raw).map(([q, a]) => ({ q, a }))
      : [];
  const out = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const q = str(item.q, 200);
    const a = Array.isArray(item.a) ? item.a.map((x) => str(x, MAX_ANSWER_LEN)).filter(Boolean).join(", ") : str(item.a, MAX_ANSWER_LEN);
    if (!q || !a) continue;
    out.push({ q, a });
    if (out.length >= MAX_ANSWERS) break;
  }
  return out;
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body) {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return {};
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method" });
  }

  const key = process.env.BM_CRM_KEY;
  if (!key) return res.status(503).json({ ok: false, error: "no-key" });

  const form = readBody(req);
  if (!form) return res.status(400).json({ ok: false, error: "bad-json" });

  // Honeypot: приховане поле, яке людина не заповнює.
  if (str(form.company, 10)) return res.status(200).json({ ok: true, skipped: true });

  const name = str(form.name, 120);
  const telegram = str(form.telegram, 120);
  const phone = str(form.phone, 40);
  const email = str(form.email, 160);
  if (!name && !telegram && !phone && !email) {
    return res.status(400).json({ ok: false, error: "no-contact" });
  }

  const payload = {
    source: str(form.src, 40) || "other",
    sourceDetail: str(form.sourceDetail, 200),
    name,
    telegram,
    phone,
    email,
    answers: normalizeAnswers(form.answers),
  };
  const tariff = str(form.tariff, 20);
  if (["standard", "premium", "vip", "none"].includes(tariff)) payload.tariff = tariff;
  const externalId = str(form.submissionId, 120);
  if (externalId) payload.externalId = externalId;
  if (form.dry === true) payload.dry = true;
  // notify:false — карточку створити/доповнити, але менеджеру в бот не писати
  // (перша відправка з самими контактами; сповіщення йде лише з повною анкетою).
  if (form.notify === false) payload.notify = false;

  let upstream;
  try {
    upstream = await fetch(INTAKE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return res.status(502).json({ ok: false, error: "upstream-network" });
  }

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    console.error("crm intake failed", upstream.status, data);
    return res.status(502).json({ ok: false, error: "upstream", status: upstream.status });
  }
  return res.status(200).json({
    ok: true,
    created: data.created === true,
    duplicate: data.duplicate === true,
    dry: payload.dry === true,
    leadId: data.leadId ?? null,
    url: data.url ?? null,
  });
}
