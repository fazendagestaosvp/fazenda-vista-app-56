
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { animalData, healthData, productionData } from "@/components/reports/ReportsData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const exportToPDF = (reportType: string) => {
  const pdf = new jsPDF();
  const today = new Date().toLocaleDateString();
  
  // Add title and date
  pdf.setFontSize(18);
  pdf.text("Relatório da Fazenda", 14, 22);
  pdf.setFontSize(11);
  pdf.text(`Gerado em: ${today}`, 14, 30);
  
  switch (reportType) {
    case "animais":
      // Animal Distribution table
      pdf.setFontSize(14);
      pdf.text("Distribuição de Animais", 14, 45);
      
      autoTable(pdf, {
        startY: 50,
        head: [["Categoria", "Quantidade"]],
        body: animalData.map(animal => [animal.categoria, animal.quantidade]),
        theme: "striped",
        headStyles: { fillColor: [155, 135, 245] }
      });
      
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text("Relatório de Bovinos e Equinos", 14, 20);
      
      autoTable(pdf, {
        startY: 25,
        head: [["Tipo", "Quantidade", "Peso Médio", "Taxa de Crescimento"]],
        body: [
          ["Bovinos", "25 animais", "475 kg", "2.3% mensal"],
          ["Equinos", "8 animais", "405 kg", "1.2% mensal"]
        ],
        theme: "striped",
        headStyles: { fillColor: [155, 135, 245] }
      });
      break;
      
    case "saude":
      // Health Status table
      pdf.setFontSize(14);
      pdf.text("Status de Saúde do Rebanho", 14, 45);
      
      autoTable(pdf, {
        startY: 50,
        head: [["Mês", "Saudáveis", "Em Tratamento", "Em Observação"]],
        body: healthData.map(data => [
          data.month, 
          data.saudaveis, 
          data.emTratamento, 
          data.emObservacao
        ]),
        theme: "striped",
        headStyles: { fillColor: [155, 135, 245] }
      });
      
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text("Próximas Vacinações", 14, 20);
      
      autoTable(pdf, {
        startY: 25,
        head: [["Vacina", "Data", "Status"]],
        body: [
          ["Febre Aftosa", "12/07/2025", "Agendada"],
          ["Brucelose", "25/08/2025", "Agendada"],
          ["Clostridioses", "10/06/2025", "Agendada"],
          ["Raiva", "03/09/2025", "Agendada"]
        ],
        theme: "striped",
        headStyles: { fillColor: [155, 135, 245] }
      });
      break;
      
    case "producao":
      // Production table
      pdf.setFontSize(14);
      pdf.text("Dados de Produção", 14, 45);
      
      autoTable(pdf, {
        startY: 50,
        head: [["Mês", "Produção de Leite (L)", "Ganho de Peso (kg/dia)"]],
        body: productionData.map(data => [
          data.month, 
          data.leite, 
          data.ganho.toFixed(2)
        ]),
        theme: "striped",
        headStyles: { fillColor: [155, 135, 245] }
      });
      
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text("Detalhes da Produção", 14, 20);
      
      autoTable(pdf, {
        startY: 25,
        head: [["Métricas", "Valores"]],
        body: [
          ["Produção Total", "860 litros/semana"],
          ["Média por Animal", "12.5 litros/dia"],
          ["Ganho Médio de Peso", "0.85 kg/dia"],
          ["Taxa de Natalidade", "12%"]
        ],
        theme: "striped",
        headStyles: { fillColor: [155, 135, 245] }
      });
      break;
  }
  
  pdf.save(`relatorio-${reportType}-${today}.pdf`);
};
