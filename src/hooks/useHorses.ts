
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
];

export function useHorses() {
  const [horses, setHorses] = useState(initialHorses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHorse, setSelectedHorse] = useState<typeof initialHorses[0] | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddHorseDialogOpen, setIsAddHorseDialogOpen] = useState(false);

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
    standardVaccinations
  };
}
