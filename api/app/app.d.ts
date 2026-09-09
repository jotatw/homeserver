/**
 * Definições de tipos do frontend do HomeServer App (app/).
 *
 * O app é vanilla JS zero-build com padrão "globals": cada arquivo declara
 * funções/constantes no escopo global e resolve símbolos em runtime. Este
 * arquivo é a fonte da verdade desses globais — qualquer arquivo novo deve
 * consumir os tipos daqui em vez de redeclarar.
 *
 * Typecheck: `npx tsc -p tsconfig.app.json --noEmit` (não faz build; os
 * arquivos JS continuam servidos como estão).
 */

/** Payload de GET /api/v1/status. */
interface HsStatus {
  cpu: { percent?: number };
  memory: { percent?: number; total?: number; used?: number };
  disk: { percent?: number; total?: number; used?: number };
  uptime: string;
  backup?: { last?: string };
  [k: string]: unknown;
}

/** Item de GET /api/v1/services. */
interface HsService {
  name: string;
  status?: string;
  url?: string;
  port?: number;
  [k: string]: unknown;
}

/** Payload de GET /api/v1/hardware. */
interface HsHardware {
  network?: unknown[];
  temperature?: { chip: string; label: string; temp: number }[];
  disks?: unknown[];
  disk_smart?: unknown[];
  usb?: unknown[];
}

/** Item de GET /api/v1/events. */
interface HsEvent {
  type?: string;
  message?: string;
  created_at?: string;
  [k: string]: unknown;
}

/** Sessão autenticada (auth.js). */
interface HsUser {
  username: string;
  admin: boolean;
  role: "user" | "admin";
}

/**
 * Cria um elemento DOM. `html` em attrs é SOMENTE para constantes internas
 * (SVGs de ICONS) — dados externos vão como filhos string (createTextNode,
 * seguro contra XSS) ou escapados com esc().
 */
declare function el(
  tag: string,
  attrs?: Record<string, string | boolean | EventListener | undefined>,
  ...children: Array<Node | string | null | undefined>
): HTMLElement;

/** SVG monoline por nome (ICONS). Fallback: "box". */
declare function icon(name: string, cls?: string): HTMLSpanElement;

/** Escapa texto para interpolação em HTML — OBRIGATÓRIO para dados externos. */
declare function esc(str: unknown): string;

/** Toast efêmero (5s). kind: "info" | "success" | "warn" | "error". */
declare function toast(message: string, kind?: "info" | "success" | "warn" | "error"): void;

/**
 * Fetch autenticado contra a API. Desempacota o envelope {ok, data} e
 * retorna `data` diretamente; lança Error com a mensagem da API em falha
 * (401 limpa a sessão e redireciona ao login).
 */
declare function api<T = unknown>(path: string, options?: RequestInit): Promise<T>;

/** Como api(), mas mostra toast de erro antes de re-lançar. */
declare function apiOrFail<T = unknown>(path: string, options?: RequestInit): Promise<T>;

/** Sessão/autenticação (auth.js) — global `auth`. */
declare var auth: {
  token: string;
  user: HsUser | null;
  isAdmin(): boolean;
  isExpired(): boolean;
  check(): Promise<boolean>;
  login(username: string, password: string): Promise<void>;
  logout(): Promise<void>;
};

/** Botão padrão do design system. */
declare function button(opts: {
  label?: string;
  variant?: "primary" | "secondary" | "danger";
  icon?: string;
  onClick?: EventListener;
  title?: string;
  type?: "button" | "submit";
}): HTMLButtonElement;

/** Badge genérico ("ok" | "warn" | "danger" | "info"). */
declare function badge(text: string, kind?: string): HTMLSpanElement;

/** Card de métrica com barra opcional (limiares de cor: 60 warn, 85 danger). */
declare function statCard(label: string, value: string, pct?: number): HTMLDivElement;

/** Linha de feed "ícone + rótulo + valor". */
declare function feedRow(iconName: string, label: string, value: string): HTMLDivElement;

/** Card de atalho (href "#..." abre na SPA; externo abre em nova aba). */
declare function actionCard(iconName: string, title: string, href: string): HTMLAnchorElement;

/** Título de seção padrão (<h3 class="section">). */
declare function sectionTitle(text: string): HTMLHeadingElement;

/** Estado vazio com mensagem (e ação opcional). */
declare function emptyState(message: string, actionEl?: HTMLElement): HTMLParagraphElement;

/** Estado canônico de serviço a partir do status bruto da API. */
declare function serviceState(status?: string): {
  label: string;
  kind: "ok" | "warn" | "danger" | "info";
  glyph: string;
};

/** Bytes → string legível ("3.0 GB"). */
declare function human(bytes: number): string;

/** Data ISO → tempo relativo em pt-BR ("há 5 h"). */
declare function timeAgo(dateStr: string): string;

/**
 * Store compartilhado de polling (store.js). Uma requisição por chave por
 * tick (10s), pausa quando document.hidden. subscribe chama fn imediatamente
 * com o cache, se houver.
 */
declare var hsStore: {
  subscribe(key: "status" | "services" | "hardware", fn: (data: any) => void): void;
  unsubscribe(key: string, fn: (data: any) => void): void;
  start(): void;
  stop(): void;
};
