
// Types for reprodução animal

// Tipos de reprodução
export type MetodoReproducao = "TOURE" | "IATF" | "REPASSE";
export type StatusPrenhez = "PENDENTE" | "PRENHA" | "FALHADA" | "FINALIZADA";
export type TipoAnimal = "bovino" | "equino";

// Interface para o registro de reprodução
export interface ReproducaoAnimal {
  id: string;
  animalId: string;
  animalIdentificacao: string;
  animalNome: string;
  tipoAnimal: TipoAnimal;
  metodo: MetodoReproducao;
  dataInicio: Date;
  dataFim: Date | null;
  statusPrenhez: StatusPrenhez;
  destino: string;
  numeroProtocolo: string;
  ultrassons: UltrassomRegistro[];
  observacoes: string;
}

// Interface para os registros de ultrassom
export interface UltrassomRegistro {
  id: string;
  data: Date;
  numero: number; // 1º ou 2º ultrassom
  resultado: "POSITIVO" | "NEGATIVO";
  observacoes: string;
}
