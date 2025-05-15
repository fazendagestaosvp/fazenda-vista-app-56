
// Data for the reports components

// Dados de distribuição de animais
export const animalData = [
  { categoria: "Vacas", quantidade: 16, cor: "#9b87f5" },
  { categoria: "Touros", quantidade: 4, cor: "#7E69AB" },
  { categoria: "Bezerros", quantidade: 5, cor: "#6E59A5" },
  { categoria: "Novilhas", quantidade: 8, cor: "#B67B24" },
  { categoria: "Cavalos", quantidade: 6, cor: "#D19A39" },
  { categoria: "Éguas", quantidade: 2, cor: "#E5BB5A" },
];

// Dados de evolução de peso
export const weightData = [
  { month: "Jan", bovinos: 455, equinos: 380 },
  { month: "Fev", bovinos: 458, equinos: 383 },
  { month: "Mar", bovinos: 463, equinos: 390 },
  { month: "Abr", bovinos: 468, equinos: 395 },
  { month: "Mai", bovinos: 471, equinos: 400 },
  { month: "Jun", bovinos: 475, equinos: 405 },
];

// Dados de saúde dos animais
export const healthData = [
  { month: "Jan", saudaveis: 32, emTratamento: 3, emObservacao: 2 },
  { month: "Fev", saudaveis: 33, emTratamento: 2, emObservacao: 2 },
  { month: "Mar", saudaveis: 34, emTratamento: 1, emObservacao: 2 },
  { month: "Abr", saudaveis: 33, emTratamento: 2, emObservacao: 2 },
  { month: "Mai", saudaveis: 32, emTratamento: 3, emObservacao: 2 },
  { month: "Jun", saudaveis: 34, emTratamento: 1, emObservacao: 2 },
];

// Dados de produção (leite e ganho de peso)
export const productionData = [
  { month: "Jan", leite: 820, ganho: 0.82 },
  { month: "Fev", leite: 830, ganho: 0.83 },
  { month: "Mar", leite: 835, ganho: 0.84 },
  { month: "Abr", leite: 845, ganho: 0.84 },
  { month: "Mai", leite: 855, ganho: 0.85 },
  { month: "Jun", leite: 860, ganho: 0.85 },
];

// Metas de saúde e produção
export const metasProducao = {
  leite: 900,
  ganhoPeso: 0.90,
  taxaNatalidade: 85,
  taxaMortalidade: 2,
};
