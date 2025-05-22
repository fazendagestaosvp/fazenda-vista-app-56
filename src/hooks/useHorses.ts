
import { useState } from "react";

// Define the standard vaccinations
const standardVaccinations = [
  "Herpes",
  "Leptospirose",
  "Mórmon",
  "Influenza",
  "Encefalomielite",
  "Garrotilho"
];

// Sample horse data
const initialHorses = [
  {
    id: "HC-101",
    name: "Ventania",
    age: 5,
    breed: "Quarto de Milha",
    color: "Alazão",
    gender: "Fêmea",
    status: "Ativo - Domado",
    sire: "Relâmpago (HC-056)",
    dam: "Aurora (HC-043)",
    birthDate: new Date(2020, 5, 12),
    sireImage: "",
    damImage: "",
    vaccinations: [
      { name: "Herpes", date: new Date(2023, 2, 15), applied: true },
      { name: "Leptospirose", date: new Date(2023, 5, 20), applied: true },
      { name: "Mórmon", date: null, applied: false },
      { name: "Influenza", date: new Date(2023, 8, 10), applied: true },
      { name: "Encefalomielite", date: new Date(2023, 11, 5), applied: true },
      { name: "Garrotilho", date: null, applied: false },
    ],
    customVaccinations: [],
  },
  {
    id: "HC-102",
    name: "Trovão Negro",
    age: 7,
    breed: "Mangalarga",
    color: "Preto",
    gender: "Macho",
    status: "Em treinamento - Em doma",
    sire: "Tempestade (HC-034)",
    dam: "Estrela (HC-028)",
    birthDate: new Date(2018, 3, 15),
    sireImage: "",
    damImage: "",
    vaccinations: [
      { name: "Herpes", date: new Date(2022, 1, 10), applied: true },
      { name: "Leptospirose", date: new Date(2022, 4, 12), applied: true },
      { name: "Mórmon", date: new Date(2022, 7, 15), applied: true },
      { name: "Influenza", date: new Date(2022, 10, 8), applied: true },
      { name: "Encefalomielite", date: new Date(2023, 1, 7), applied: true },
      { name: "Garrotilho", date: new Date(2023, 4, 9), applied: true },
    ],
    customVaccinations: [
      { name: "Tétano", date: new Date(2023, 3, 25), applied: true },
    ],
  },
  {
    id: "HC-103",
    name: "Lua Cheia",
    age: 3,
    breed: "Crioulo",
    color: "Tordilho",
    gender: "Fêmea",
    status: "Vendido - Potro",
    sire: "Luar (HC-067)",
    dam: "Noite (HC-052)",
    birthDate: new Date(2022, 1, 8),
    sireImage: "",
    damImage: "",
    vaccinations: [
      { name: "Herpes", date: new Date(2023, 2, 15), applied: true },
      { name: "Leptospirose", date: new Date(2023, 5, 20), applied: true },
      { name: "Mórmon", date: null, applied: false },
      { name: "Influenza", date: new Date(2023, 8, 10), applied: true },
      { name: "Encefalomielite", date: null, applied: false },
      { name: "Garrotilho", date: null, applied: false },
    ],
    customVaccinations: [],
  },
  // Adding more sample horses for pagination testing
  {
    id: "HC-104",
    name: "Estrela Guia",
    age: 6,
    breed: "Árabe",
    color: "Branco",
    gender: "Fêmea",
    status: "Ativo - Domado",
    sire: "Sol (HC-022)",
    dam: "Lua (HC-018)",
    birthDate: new Date(2019, 2, 25),
    sireImage: "",
    damImage: "",
    vaccinations: standardVaccinations.map(name => ({
      name,
      date: new Date(2023, 5, 15),
      applied: true
    })),
    customVaccinations: [],
  },
  {
    id: "HC-105",
    name: "Tornado",
    age: 4,
    breed: "Quarto de Milha",
    color: "Castanho",
    gender: "Macho",
    status: "Em treinamento - Em doma",
    sire: "Furacão (HC-045)",
    dam: "Brisa (HC-039)",
    birthDate: new Date(2021, 7, 10),
    sireImage: "",
    damImage: "",
    vaccinations: standardVaccinations.map(name => ({
      name,
      date: null,
      applied: false
    })),
    customVaccinations: [],
  },
  {
    id: "HC-106",
    name: "Tempestade",
    age: 8,
    breed: "Mangalarga",
    color: "Preto",
    gender: "Macho",
    status: "Ativo - Domado",
    sire: "Raio (HC-023)",
    dam: "Trovão (HC-027)",
    birthDate: new Date(2017, 4, 18),
    sireImage: "",
    damImage: "",
    vaccinations: standardVaccinations.map(name => ({
      name,
      date: new Date(2023, 3, 5),
      applied: true
    })),
    customVaccinations: [],
  },
  {
    id: "HC-107",
    name: "Sereno",
    age: 5,
    breed: "Crioulo",
    color: "Baio",
    gender: "Macho",
    status: "Ativo - Domado",
    sire: "Calmo (HC-019)",
    dam: "Tranquila (HC-026)",
    birthDate: new Date(2020, 11, 12),
    sireImage: "",
    damImage: "",
    vaccinations: standardVaccinations.map(name => ({
      name,
      date: new Date(2023, 9, 10),
      applied: true
    })),
    customVaccinations: [],
  },
  {
    id: "HC-108",
    name: "Aurora",
    age: 3,
    breed: "Árabe",
    color: "Alazão",
    gender: "Fêmea",
    status: "Em treinamento - Potro",
    sire: "Amanhecer (HC-037)",
    dam: "Madrugada (HC-041)",
    birthDate: new Date(2022, 9, 5),
    sireImage: "",
    damImage: "",
    vaccinations: standardVaccinations.map(name => ({
      name,
      date: null,
      applied: false
    })),
    customVaccinations: [],
  },
  {
    id: "HC-109",
    name: "Relâmpago",
    age: 7,
    breed: "Quarto de Milha",
    color: "Castanho",
    gender: "Macho",
    status: "Ativo - Domado",
    sire: "Corisco (HC-012)",
    dam: "Faísca (HC-015)",
    birthDate: new Date(2018, 6, 23),
    sireImage: "",
    damImage: "",
    vaccinations: standardVaccinations.map(name => ({
      name,
      date: new Date(2023, 2, 1),
      applied: true
    })),
    customVaccinations: [],
  },
  {
    id: "HC-110",
    name: "Fantasia",
    age: 4,
    breed: "Mangalarga",
    color: "Tordilho",
    gender: "Fêmea",
    status: "Em treinamento - Em doma",
    sire: "Sonho (HC-031)",
    dam: "Ilusão (HC-035)",
    birthDate: new Date(2021, 3, 15),
    sireImage: "",
    damImage: "",
    vaccinations: standardVaccinations.map(name => ({
      name,
      date: new Date(2023, 4, 20),
      applied: true
    })),
    customVaccinations: [],
  },
  {
    id: "HC-111",
    name: "Encanto",
    age: 6,
    breed: "Crioulo",
    color: "Preto",
    gender: "Macho",
    status: "Ativo - Domado",
    sire: "Feitiço (HC-024)",
    dam: "Magia (HC-029)",
    birthDate: new Date(2019, 8, 30),
    sireImage: "",
    damImage: "",
    vaccinations: standardVaccinations.map(name => ({
      name,
      date: new Date(2023, 7, 15),
      applied: true
    })),
    customVaccinations: [],
  },
  {
    id: "HC-112",
    name: "Ventania",
    age: 3,
    breed: "Árabe",
    color: "Baio",
    gender: "Fêmea",
    status: "Em treinamento - Potro",
    sire: "Furacão (HC-045)",
    dam: "Brisa (HC-039)",
    birthDate: new Date(2022, 5, 8),
    sireImage: "",
    damImage: "",
    vaccinations: standardVaccinations.map(name => ({
      name,
      date: null,
      applied: false
    })),
    customVaccinations: [],
  },
];

export function useHorses() {
  const [horses, setHorses] = useState(initialHorses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHorse, setSelectedHorse] = useState<typeof initialHorses[0] | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddHorseDialogOpen, setIsAddHorseDialogOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleOpenHorseDetails = (horse: typeof initialHorses[0]) => {
    setSelectedHorse(horse);
    setIsDetailsDialogOpen(true);
  };

  const handleAddHorse = (newHorse: any) => {
    setHorses(prevHorses => [...prevHorses, newHorse]);
  };

  const handleUpdateHorse = (updatedHorse: any) => {
    setHorses(prevHorses => 
      prevHorses.map(horse => 
        horse.id === updatedHorse.id ? updatedHorse : horse
      )
    );
    setSelectedHorse(updatedHorse);
  };

  // Pagination calculation
  const totalPages = Math.ceil(horses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return {
    horses,
    searchTerm,
    setSearchTerm,
    selectedHorse,
    setSelectedHorse,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    isAddHorseDialogOpen,
    setIsAddHorseDialogOpen,
    handleOpenHorseDetails,
    handleAddHorse,
    handleUpdateHorse,
    standardVaccinations,
    // Pagination properties and methods
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem
  };
}
