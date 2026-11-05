import type { AnalysisMapItem, ClassificationClass } from "@/types/api";

// ---- Filtros (botões acima do mapa) ----

export type Period = "7d" | "30d" | "12m" | "tudo";

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "12m", label: "12 meses" },
  { value: "tudo", label: "Tudo" },
];

// O valor vai direto para o parâmetro "status" da API
export const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "finalizada", label: "Finalizadas" },
  { value: "em_espera,processando", label: "Em andamento" },
  { value: "falhou", label: "Falharam" },
];

export const CLASSE_OPTIONS: { value: ClassificationClass | ""; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "infectado", label: "Pinta preta" },
  { value: "saudavel", label: "Saudável" },
];

// Converte o período escolhido em from/to (ISO 8601). "Tudo" não filtra.
export function getPeriodRange(period: Period): { from?: string; to?: string } {
  if (period === "tudo") return {};
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 365;
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from: from.toISOString(), to: to.toISOString() };
}

// ---- Cores e textos dos pontos ----

// No Android o pino padrão só muda o matiz da cor: cinza vira vermelho,
// por isso cada estado usa um matiz bem diferente
export const PIN_COLORS = {
  infectado: "#DC2626", // vermelho
  saudavel: "#16A34A", // verde
  andamento: "#F5A623", // laranja
  falhou: "#7C3AED", // roxo
};

export const MAP_LEGEND = [
  { color: PIN_COLORS.infectado, label: "Pinta preta" },
  { color: PIN_COLORS.saudavel, label: "Saudável" },
  { color: PIN_COLORS.andamento, label: "Em andamento" },
  { color: PIN_COLORS.falhou, label: "Falhou" },
];

export function getPinColor(item: AnalysisMapItem) {
  if (item.status === "falhou") return PIN_COLORS.falhou;
  if (item.status !== "finalizada") return PIN_COLORS.andamento;
  return item.classe === "infectado"
    ? PIN_COLORS.infectado
    : PIN_COLORS.saudavel;
}

export function getMapLabel(item: AnalysisMapItem) {
  if (item.status === "falhou") return "Análise falhou";
  if (item.status !== "finalizada") return "Em andamento";
  return item.classe === "infectado" ? "Pinta preta detectada" : "Saudável";
}