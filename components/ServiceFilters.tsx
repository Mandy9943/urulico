"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// Constants
const departamentos = [
  "Artigas",
  "Canelones",
  "Cerro Largo",
  "Colonia",
  "Durazno",
  "Flores",
  "Florida",
  "Lavalleja",
  "Maldonado",
  "Montevideo",
  "Paysandú",
  "Río Negro",
  "Rivera",
  "Rocha",
  "Salto",
  "San José",
  "Soriano",
  "Tacuarembó",
  "Treinta y Tres",
];

const ciudades = {
  Artigas: ["Artigas", "Bella Unión", "Tomás Gomensoro", "Baltasar Brum"],
  Canelones: [
    "Canelones",
    "Ciudad de la Costa",
    "Las Piedras",
    "Pando",
    "La Paz",
    "Santa Lucía",
    "Progreso",
    "Sauce",
    "Toledo",
    "Atlántida",
    "San Ramón",
  ],
  "Cerro Largo": ["Melo", "Río Branco", "Fraile Muerto", "Isidoro Noblía"],
  Colonia: [
    "Colonia del Sacramento",
    "Carmelo",
    "Juan Lacaze",
    "Nueva Helvecia",
    "Rosario",
    "Nueva Palmira",
    "Tarariras",
  ],
  Durazno: ["Durazno", "Sarandí del Yí", "Carmen", "La Paloma"],
  Flores: ["Trinidad", "Ismael Cortinas"],
  Florida: ["Florida", "Sarandí Grande", "Casupá", "Fray Marcos"],
  Lavalleja: ["Minas", "José Pedro Varela", "Solís de Mataojo", "Mariscala"],
  Maldonado: [
    "Maldonado",
    "Punta del Este",
    "San Carlos",
    "Pan de Azúcar",
    "Piriápolis",
    "Aiguá",
  ],
  Montevideo: [
    "Centro",
    "Ciudad Vieja",
    "Cordón",
    "Pocitos",
    "Punta Carretas",
    "Carrasco",
    "Malvín",
    "Buceo",
    "Parque Rodó",
    "Prado",
    "La Blanqueada",
    "Tres Cruces",
    "Palermo",
    "Barrio Sur",
    "Aguada",
    "La Comercial",
    "Villa Española",
    "Unión",
    "Maroñas",
    "Cerrito",
  ],
  Paysandú: ["Paysandú", "Guichón", "Quebracho", "Tambores"],
  "Río Negro": ["Fray Bentos", "Young", "Nuevo Berlín", "San Javier"],
  Rivera: ["Rivera", "Tranqueras", "Vichadero", "Minas de Corrales"],
  Rocha: ["Rocha", "Chuy", "Castillos", "Lascano", "La Paloma", "La Pedrera"],
  Salto: ["Salto", "Constitución", "Belén", "San Antonio"],
  "San José": [
    "San José de Mayo",
    "Ciudad del Plata",
    "Libertad",
    "Ecilda Paullier",
  ],
  Soriano: ["Mercedes", "Dolores", "Cardona", "José Enrique Rodó"],
  Tacuarembó: ["Tacuarembó", "Paso de los Toros", "San Gregorio de Polanco"],
  "Treinta y Tres": ["Treinta y Tres", "Vergara", "Santa Clara de Olimar"],
};

export default function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoria = useParams().slug;
  const currentDepartamento = searchParams.get("departamento") || "";

  // Obtener las ciudades del departamento seleccionado
  const availableCities =
    currentDepartamento && currentDepartamento !== "todos"
      ? ciudades[currentDepartamento as keyof typeof ciudades] || []
      : [];

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Remover categoria de los searchParams ya que está en la URL
      newSearchParams.delete("categoria");

      formData.forEach((value, key) => {
        if (value && value !== "todos" && value !== "todas") {
          newSearchParams.set(key, value.toString());
        } else {
          newSearchParams.delete(key);
        }
      });
      console.log(newSearchParams.toString());

      router.push(`/categoria/${categoria}?${newSearchParams.toString()}`);
    },
    [router, searchParams, categoria]
  );

  // Manejar cambio de departamento
  const handleDepartamentoChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remover categoria de los searchParams ya que está en la URL
    newSearchParams.delete("categoria");

    if (value && value !== "todos") {
      newSearchParams.set("departamento", value);
    } else {
      newSearchParams.delete("departamento");
    }

    // Limpiar ciudad cuando cambia el departamento
    newSearchParams.delete("ciudad");

    console.log(newSearchParams.toString());

    router.push(`/categoria/${categoria}?${newSearchParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3"
    >
      <div className="space-y-2">
        <Label>Departamento</Label>
        <Select
          name="departamento"
          defaultValue={currentDepartamento}
          onValueChange={handleDepartamentoChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {departamentos.map((dep) => (
              <SelectItem key={dep} value={dep}>
                {dep}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Ciudad</Label>
        <Select
          name="ciudad"
          defaultValue={searchParams.get("ciudad") || ""}
          disabled={!availableCities.length}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {availableCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Precio mínimo</Label>
        <Input
          type="number"
          name="precioMin"
          placeholder="0"
          defaultValue={searchParams.get("precioMin") || ""}
        />
      </div>

      <div className="space-y-2">
        <Label>Precio máximo</Label>
        <Input
          type="number"
          name="precioMax"
          placeholder="Máximo"
          defaultValue={searchParams.get("precioMax") || ""}
        />
      </div>

      <div className="space-y-2">
        <Label>Moneda</Label>
        <Select
          name="moneda"
          defaultValue={searchParams.get("moneda") || "UYU"}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UYU">UYU</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Aplicar Filtros
        </Button>
      </div>
    </form>
  );
}
