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
  "Montevideo",
  "Canelones",
  "Maldonado",
  "Colonia",
  "San José",
  "Paysandú",
  "Salto",
  "Rivera",
  "Tacuarembó",
  "Rocha",
];

const ciudades = {
  Montevideo: [
    "Centro",
    "Pocitos",
    "Cordón",
    "Punta Carretas",
    "Malvín",
    "Carrasco",
  ],
  Canelones: ["Las Piedras", "Ciudad de la Costa", "Pando", "La Paz"],
  Maldonado: ["Punta del Este", "Maldonado", "San Carlos"],
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
