
import { ReproducaoAnimal } from "@/types/reproducao.types";

// Dados iniciais de exemplo
export const initialReproducoes: ReproducaoAnimal[] = [
  {
    id: "1",
    animalId: "BG-101",
    animalIdentificacao: "BG-101",
    animalNome: "Estrela",
    tipoAnimal: "bovino",
    metodo: "IATF",
    dataInicio: new Date(2025, 3, 15),
    dataFim: null,
    statusPrenhez: "PENDENTE",
    destino: "Rebanho principal",
    numeroProtocolo: "R2023-001",
    ultrassons: [],
    observacoes: "Primeira tentativa de IATF"
  },
  {
    id: "2",
    animalId: "BG-103",
    animalIdentificacao: "BG-103",
    animalNome: "Luna",
    tipoAnimal: "bovino",
    metodo: "TOURE",
    dataInicio: new Date(2025, 2, 10),
    dataFim: null,
    statusPrenhez: "PRENHA",
    destino: "Rebanho principal",
    numeroProtocolo: "R2023-002",
    ultrassons: [
      {
        id: "U1",
        data: new Date(2025, 3, 10),
        numero: 1,
        resultado: "POSITIVO",
        observacoes: "Prenhez confirmada em primeiro exame"
      }
    ],
    observacoes: "Monta natural com touro Netuno"
  },
  {
    id: "3",
    animalId: "EQ-101",
    animalIdentificacao: "EQ-101",
    animalNome: "Vendaval",
    tipoAnimal: "equino",
    metodo: "REPASSE",
    dataInicio: new Date(2025, 2, 20),
    dataFim: null,
    statusPrenhez: "FALHADA",
    destino: "Repasse",
    numeroProtocolo: "R2023-003",
    ultrassons: [
      {
        id: "U2",
        data: new Date(2025, 3, 20),
        numero: 1,
        resultado: "NEGATIVO",
        observacoes: "Não confirmada prenhez, encaminhada para repasse"
      }
    ],
    observacoes: "Segunda tentativa após falha em IATF"
  },
];
