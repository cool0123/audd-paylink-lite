const STORAGE_KEY = "audd-paylink-lite-payments";
const DEFAULT_PAYMENTS = [
  {
    id: "audd-harbour-coffee-4250",
    merchant: "Harbour Coffee",
    note: "Wholesale coffee beans invoice #1042",
    amount: 42.5,
    wallet: "MerchantDemoWallet111111111111111111111111111",
    status: "pending",
    reference: "Awaiting Solana transfer reference",
    createdAt: "2026-05-14T06:00:00.000Z",
  },
  {
    id: "audd-studio-retainer-30000",
    merchant: "North Pier Studio",
    note: "Design retainer deposit",
    amount: 300,
    wallet: "StudioDemoWallet22222222222222222222222222222",
    status: "paid",
    reference: "solana:demo-tx-6Vg4...AUDD",
    createdAt: "2026-05-14T06:05:00.000Z",
  },
  {
    id: "audd-creator-kit-8950",
    merchant: "Creator Kit Shop",
    note: "Digital template bundle",
    amount: 89.5,
    wallet: "CreatorDemoWallet333333333333333333333333333",
    status: "expired",
    reference: "Expired before payment",
    createdAt: "2026-05-14T06:10:00.000Z",
  },
];

const form = document.querySelector("#paylink-form");
const merchantInput = document.querySelector("#merchant");
const amountInput = document.querySelector("#amount");
const noteInput = document.querySelector("#note");
const walletInput = document.querySelector("#wallet");
const previewTitle = document.querySelector("#preview-title");
const previewNote = document.querySelector("#preview-note");
const previewAmount = document.querySelector("#preview-amount");
const paylinkOutput = document.querySelector("#paylink-output");
const copyButton = document.querySelector("#copy-link");
const tableBody = document.querySelector("#payment-table");
const csvPreview = document.querySelector("#csv-preview");
const exportButton = document.querySelector("#export-csv");
const markPaidButton = document.querySelector("#mark-paid");
const qr = document.querySelector("#qr");

let payments = loadPayments();
let currentLink = payments[0];

function loadPayments() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [...DEFAULT_PAYMENTS];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : [...DEFAULT_PAYMENTS];
  } catch {
    return [...DEFAULT_PAYMENTS];
  }
}

function savePayments() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
}

function formatAmount(amount) {
  return `${Number(amount).toFixed(2)} AUDD`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

function createPayment({ merchant, amount, note, wallet }) {
  const cents = Math.round(Number(amount) * 100);
  const id = `audd-${slugify(merchant)}-${cents}`;
  return {
    id,
    merchant,
    note,
    amount: Number(amount),
    wallet,
    status: "pending",
    reference: "Awaiting Solana transfer reference",
    createdAt: new Date().toISOString(),
  };
}

function paymentUrl(payment) {
  const base = `${window.location.origin}${window.location.pathname}`.replace(/\/$/, "");
  return `${base}#pay/${payment.id}`;
}

function updatePreview(payment) {
  currentLink = payment;
  previewTitle.textContent = payment.merchant;
  previewNote.textContent = payment.note;
  previewAmount.textContent = formatAmount(payment.amount);
  paylinkOutput.textContent = paymentUrl(payment);
  renderQr(payment.id);
}

function renderQr(seed) {
  const bits = hashBits(seed, 81);
  qr.innerHTML = "";
  bits.forEach((enabled) => {
    const cell = document.createElement("span");
    cell.style.opacity = enabled ? "1" : "0.08";
    qr.append(cell);
  });
}

function hashBits(seed, length) {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Array.from({ length }, (_, index) => {
    hash ^= index + 31;
    hash = Math.imul(hash, 16777619);
    return (hash >>> 0) % 3 !== 0;
  });
}

function renderTable() {
  tableBody.innerHTML = "";
  payments.forEach((payment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><button class="link-button" type="button" data-id="${payment.id}">${payment.id}</button></td>
      <td>${escapeHtml(payment.note)}</td>
      <td>${formatAmount(payment.amount)}</td>
      <td><span class="badge ${payment.status}">${payment.status}</span></td>
      <td>${escapeHtml(payment.reference)}</td>
    `;
    tableBody.append(row);
  });
}

function renderCsvPreview() {
  csvPreview.textContent = toCsv(payments);
}

function toCsv(rows) {
  const header = ["id", "merchant", "amount_audd", "status", "reference", "created_at"];
  const body = rows.map((row) =>
    [row.id, row.merchant, row.amount.toFixed(2), row.status, row.reference, row.createdAt]
      .map(csvCell)
      .join(","),
  );
  return [header.join(","), ...body].join("\n");
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function addPayment(payment) {
  const existingIndex = payments.findIndex((item) => item.id === payment.id);
  if (existingIndex >= 0) {
    payments[existingIndex] = payment;
  } else {
    payments = [payment, ...payments];
  }
  savePayments();
  updatePreview(payment);
  renderTable();
  renderCsvPreview();
}

function markLatestAsPaid() {
  const targetIndex = payments.findIndex((payment) => payment.status === "pending");
  if (targetIndex < 0) return;
  payments[targetIndex] = {
    ...payments[targetIndex],
    status: "paid",
    reference: `solana:demo-tx-${Math.random().toString(36).slice(2, 8)}...AUDD`,
  };
  savePayments();
  updatePreview(payments[targetIndex]);
  renderTable();
  renderCsvPreview();
}

function downloadCsv() {
  const blob = new Blob([toCsv(payments)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "audd-paylink-settlement.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function initialize() {
  renderTable();
  renderCsvPreview();
  updatePreview(currentLink);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const payment = createPayment({
      merchant: merchantInput.value.trim(),
      amount: amountInput.value,
      note: noteInput.value.trim(),
      wallet: walletInput.value.trim(),
    });
    addPayment(payment);
  });

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    const payment = payments.find((item) => item.id === button.dataset.id);
    if (payment) updatePreview(payment);
  });

  copyButton.addEventListener("click", async () => {
    const url = paymentUrl(currentLink);
    try {
      await navigator.clipboard.writeText(url);
      copyButton.textContent = "Copied";
    } catch {
      copyButton.textContent = "Copy manually";
    }
    window.setTimeout(() => {
      copyButton.textContent = "Copy demo link";
    }, 1200);
  });

  exportButton.addEventListener("click", downloadCsv);
  markPaidButton.addEventListener("click", markLatestAsPaid);
}

initialize();
