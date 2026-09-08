/* ============================================================
 * HomeServer App — view: Impressão
 * Extraída de app.js (split 2026-09-07). Padrão globals:
 * depende de el()/icon()/button()/api()/toast() em runtime.
 * ============================================================ */

/* ---------- Tela: Impressão (admin) ---------- */

const printState = { mode: "text", file: null };

function printerBadge(status) {
  if (!status || status.state === "unknown") {
    return el("span", { class: "badge danger" }, "Erro");
  }
  if (status.state === "disabled" || status.accepting === false) {
    return el("span", { class: "badge danger" }, "Indisponível");
  }
  if (status.activeJobs > 0 || status.state === "printing") {
    return el("span", { class: "badge warn" }, "Ocupada");
  }
  return el("span", { class: "badge ok" }, "Pronta");
}

function printerReady(status) {
  return Boolean(status && status.state !== "disabled" && status.state !== "unknown" && status.accepting !== false);
}

async function renderPrint() {
  const v = document.getElementById("view");
  v.innerHTML = "";

  v.appendChild(el("h3", { class: "section" }, "Impressão"));

  // Status da impressora
  let printers = [];
  let statusMap = {};
  try {
    const data = await api("/api/v1/print");
    printers = data.printers || [];
    statusMap = data.status || {};
  } catch (err) {
    v.appendChild(el("div", { class: "banner danger" }, "Erro ao consultar a impressora: " + err.message));
  }

  // ---- Card 1: Impressora e configuração ----
  const card1 = el("div", { class: "print-card" },
    el("h4", { class: "print-card-title" }, "1. Impressora e configuração"));

  const pRow = el("div", { class: "print-prow" });
  const selPrinter = el("select", { id: "pr-printer", class: "select-field", style: "flex:1" });
  (printers.length ? printers : ["MG3110"]).forEach((p) =>
    selPrinter.appendChild(el("option", { value: p }, p)));
  pRow.appendChild(el("label", { class: "print-label", style: "min-width:90px" }, "Impressora"));
  pRow.appendChild(selPrinter);

  const statusWrap = el("span", { id: "pr-status", style: "display:inline-flex" });
  const selP = printers[0] || "MG3110";
  statusWrap.appendChild(printerBadge(statusMap[selP]));
  pRow.appendChild(statusWrap);
  card1.appendChild(pRow);

  if (statusMap[selP] && statusMap[selP].lastJob) {
    card1.appendChild(el("p", { class: "power-hint", id: "pr-last" },
      "Última impressão: " + timeAgo(statusMap[selP].lastJob)));
  }

  // Configurações rápidas
  const cfg = el("div", { class: "grid print-config" });
  const selColor = el("select", { id: "pr-color", class: "select-field" },
    el("option", { value: "color" }, "Colorida"),
    el("option", { value: "mono" }, "Preto e branco"));
  cfg.appendChild(field("Cor", selColor));

  const selMedia = el("select", { id: "pr-media", class: "select-field" },
    el("option", { value: "A4" }, "A4"),
    el("option", { value: "A5" }, "A5"),
    el("option", { value: "Letter" }, "Letter"),
    el("option", { value: "Legal" }, "Legal"));
  cfg.appendChild(field("Papel", selMedia));

  const selOrient = el("select", { id: "pr-orient", class: "select-field" },
    el("option", { value: "portrait" }, "Retrato"),
    el("option", { value: "landscape" }, "Paisagem"));
  cfg.appendChild(field("Orientação", selOrient));

  const inPages = el("input", { id: "pr-pages", class: "select-field", placeholder: "ex.: 1-3" });
  cfg.appendChild(field("Páginas", inPages));

  const selQuality = el("select", { id: "pr-quality", class: "select-field" },
    el("option", { value: "economico" }, "Econômico"),
    el("option", { value: "normal", selected: "selected" }, "Normal"),
    el("option", { value: "alta" }, "Alta qualidade"));
  cfg.appendChild(field("Qualidade", selQuality));

  card1.appendChild(cfg);
  v.appendChild(card1);

  selPrinter.addEventListener("change", () => {
    const name = selPrinter.value;
    const s = statusMap[name];
    statusWrap.innerHTML = "";
    statusWrap.appendChild(printerBadge(s));
    const last = document.getElementById("pr-last");
    if (last) {
      last.textContent = s && s.lastJob ? "Última impressão: " + timeAgo(s.lastJob) : "";
    }
    updatePrintDisabled();
  });

  // ---- Card 2: Conteúdo ----
  const card2 = el("div", { class: "print-card" },
    el("h4", { class: "print-card-title" }, "2. Conteúdo a imprimir"));

  const toggle = el("div", { class: "radio-row" },
    el("label", {},
      el("input", { type: "radio", name: "pr-mode", value: "text", checked: "checked" }), " Texto"),
    el("label", {},
      el("input", { type: "radio", name: "pr-mode", value: "file" }), " Arquivo"));
  card2.appendChild(toggle);

  const textArea = el("textarea", {
    id: "pr-text", class: "print-textarea", rows: 6,
    placeholder: "Digite o texto a imprimir…",
  });
  card2.appendChild(textArea);

  const fileRow = el("div", { class: "file-row", hidden: true, id: "pr-filerow" },
    el("label", { class: "btn btn-secondary", style: "cursor:pointer" },
      icon("paperclip", "ic"), " Escolher arquivo",
      el("input", { id: "pr-file", type: "file", accept: ".pdf,.txt,.png,.jpg,.jpeg", style: "display:none" })),
    el("span", { class: "power-hint", id: "pr-filename" }, "PDF, texto ou imagem"));
  card2.appendChild(fileRow);

  const previewBox = el("div", { class: "print-preview", id: "pr-preview", hidden: true });
  card2.appendChild(previewBox);

  v.appendChild(card2);

  document.querySelectorAll('input[name="pr-mode"]').forEach((r) => {
    r.addEventListener("change", () => {
      printState.mode = r.value;
      const isText = r.value === "text";
      textArea.hidden = !isText;
      fileRow.hidden = isText;
      previewBox.hidden = true;
      document.getElementById("pr-preview").innerHTML = "";
    });
  });

  document.getElementById("pr-file").addEventListener("change", () => {
    const f = document.getElementById("pr-file").files[0];
    printState.file = f || null;
    document.getElementById("pr-filename").textContent = f ? "Arquivo: " + f.name : "PDF, texto ou imagem";
    document.getElementById("pr-preview").hidden = true;
    document.getElementById("pr-preview").innerHTML = "";
  });

  // ---- Card 3: Ações ----
  const card3 = el("div", { class: "print-card print-actions" },
    el("button", { class: "btn btn-secondary", id: "pr-preview-btn" }, icon("eye", "ic"), " Visualizar"),
    el("button", { class: "btn btn-primary", id: "pr-submit" }, icon("printer", "ic"), " Imprimir"));
  v.appendChild(card3);

  const previewBtn = document.getElementById("pr-preview-btn");
  const submitBtn = document.getElementById("pr-submit");

  function updatePrintDisabled() {
    const name = document.getElementById("pr-printer").value;
    submitBtn.disabled = !printerReady(statusMap[name]);
  }
  updatePrintDisabled();

  previewBtn.addEventListener("click", renderPreview);
  submitBtn.addEventListener("click", submitPrint);

  // ---- Card 4: Fila de impressão ----
  const card4 = el("div", { class: "print-card" },
    el("h4", { class: "print-card-title" }, "Fila de impressão"),
    el("div", { id: "print-jobs" }, el("div", { class: "loader" }, "Carregando…")));
  v.appendChild(card4);

  renderPrintJobs();
}

async function renderPrintJobs() {
  const box = document.getElementById("print-jobs");
  if (!box) return;

  try {
    const data = await api("/api/v1/print/jobs");
    const jobs = data.jobs || [];
    box.innerHTML = "";

    if (!jobs.length) {
      box.appendChild(el("p", { class: "power-hint" }, "Nenhum trabalho na fila."));
      return;
    }

    const feed = el("div", { class: "feed" });
    jobs.forEach((job) => {
      const printing = job.status === "printing";
      const row = el("div", { class: "feed-item" },
        el("span", { class: "status-dot " + (printing ? "warn" : "ok") }),
        el("span", { class: "app-name" }, job.id),
        el("span", { class: "app-host" },
          printing ? "Imprimindo…" : "Concluído" +
          (job.date ? " · " + timeAgo(job.date) : "")));
      if (printing) {
        const c = el("button", { class: "btn btn-secondary", style: "height:var(--hs-touch-compact)" }, "Cancelar");
        c.addEventListener("click", async () => {
          if (!confirm("Cancelar o trabalho " + job.id + "?")) return;
          try {
            await apiOrFail("/api/v1/print/jobs/" + job.id, { method: "DELETE" });
            toast("Trabalho cancelado.", "success");
            renderPrintJobs();
          } catch (_) {}
        });
        row.appendChild(c);
      }
      feed.appendChild(row);
    });
    box.appendChild(feed);
  } catch (err) {
    box.innerHTML = "";
    box.appendChild(el("p", { class: "power-hint" }, "Não foi possível carregar a fila."));
  }
}

function renderPreview() {
  const box = document.getElementById("pr-preview");
  const isText = printState.mode === "text";

  if (isText) {
    const text = document.getElementById("pr-text").value;
    if (!text.trim()) {
      toast("Digite um texto para visualizar.", "warn");
      return;
    }
    box.innerHTML = "";
    box.appendChild(el("pre", { class: "print-pre" }, text));
    box.hidden = false;
    return;
  }

  const f = printState.file;
  if (!f) {
    toast("Escolha um arquivo para visualizar.", "warn");
    return;
  }

  box.innerHTML = "";
  const url = URL.createObjectURL(f);

  if (f.type === "image/png" || f.type === "image/jpeg") {
    box.appendChild(el("img", { src: url, class: "print-img", alt: f.name }));
    box.hidden = false;
  } else if (f.type === "application/pdf" || /\.pdf$/i.test(f.name)) {
    box.appendChild(el("iframe", { src: url, class: "print-pdf", title: "Pré-visualização" }));
    box.hidden = false;
  } else if (f.type === "text/plain" || /\.txt$/i.test(f.name)) {
    const reader = new FileReader();
    reader.onload = () => {
      box.innerHTML = "";
      box.appendChild(el("pre", { class: "print-pre" }, String(reader.result)));
      box.hidden = false;
    };
    reader.readAsText(f);
  } else {
    box.innerHTML = "";
    box.appendChild(el("p", { class: "power-hint" },
      "Pré-visualização indisponível. O arquivo ainda poderá ser enviado para impressão."));
    box.hidden = false;
  }
}

async function submitPrint() {
  const submitBtn = document.getElementById("pr-submit");
  submitBtn.disabled = true;
  submitBtn.textContent = "Imprimindo…";

  try {
    const body = {
      printer: document.getElementById("pr-printer").value,
      color: document.getElementById("pr-color").value,
      media: document.getElementById("pr-media").value,
      orientation: document.getElementById("pr-orient").value,
      quality: document.getElementById("pr-quality").value,
      pages: document.getElementById("pr-pages").value.trim() || undefined,
    };
    const file = printState.file;
    const text = document.getElementById("pr-text").value;

    if (printState.mode === "file") {
      if (!file) {
        throw new Error("Escolha um arquivo para imprimir.");
      }
      if (file.size > 20 * 1024 * 1024) {
        const mb = (file.size / 1024 / 1024).toFixed(1);
        if (!confirm("Arquivo com " + mb + " MB.\nO arquivo é grande e pode demorar para ser processado.\nDeseja continuar?")) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = icon("printer", "ic").outerHTML + " Imprimir";
          return;
        }
      }
      body.file = { name: file.name, data: await fileToBase64(file) };
    } else {
      if (!text.trim()) {
        throw new Error("Digite um texto para imprimir.");
      }
      body.text = text;
    }

    await apiOrFail("/api/v1/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    toast("Enviado para a impressora.", "success");
    // Recarrega o status (última impressão atualizada).
    renderPrint();
  } catch (err) {
    toast(err.message || "Falha ao imprimir.", "error");
    submitBtn.disabled = false;
    submitBtn.innerHTML = icon("printer", "ic").outerHTML + " Imprimir";
  }
}

function field(labelText, control) {
  const wrap = el("div", { class: "print-field" },
    el("label", { class: "print-label" }, labelText));
  wrap.appendChild(control);
  return wrap;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
