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
import { Toggle } from "@/components/ui/toggle";
import {
  ArrowRight,
  DollarSign,
  Home,
  Image as ImageIcon,
  MapPin,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Datos de ejemplo para los filtros
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

// Imágenes por defecto
const NO_IMAGE =
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=500&h=300&fit=crop";
const ERROR_IMAGE =
  "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500&h=300&fit=crop";

// Valores especiales para los selectores
const TODOS_DEPARTAMENTOS = "todos-departamentos";
const TODAS_CIUDADES = "todas-ciudades";

interface Servicio {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: string | null;
  moneda: string | null;
  departamento: string | null;
  ciudad: string | null;
  proveedor: string;
  telefonoPrincipal: string | null;
  whatsapp: boolean;
  imagen: string | null;
  tieneImagenes: boolean;
}

interface CategoryClientProps {
  slug: string;
  servicios: Servicio[];
}

// Componente para la imagen con manejo de errores
function ServiceImage({
  src,
  alt,
  tieneImagenes,
}: {
  src: string;
  alt: string;
  tieneImagenes: boolean;
}) {
  const [error, setError] = useState(false);
  const imageSource = error ? ERROR_IMAGE : tieneImagenes ? src : NO_IMAGE;
  const message = error ? "Error al cargar la imagen" : "Sin imágenes";

  return (
    <div className="relative h-48 w-full">
      <Image
        src={imageSource}
        alt={alt}
        fill
        className={`object-cover ${
          !tieneImagenes || error ? "opacity-50 grayscale" : ""
        }`}
        onError={() => setError(true)}
      />
      {(!tieneImagenes || error) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-400">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryClient({
  slug,
  servicios,
}: CategoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [departamento, setDepartamento] = useState(TODOS_DEPARTAMENTOS);
  const [ciudad, setCiudad] = useState(TODAS_CIUDADES);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [moneda, setMoneda] = useState("UYU");
  const [soloConImagenes, setSoloConImagenes] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Filtrar servicios basado en los criterios
  const serviciosFiltrados = servicios.filter((servicio) => {
    const cumpleBusqueda =
      servicio.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      servicio.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const cumpleDepartamento =
      departamento === TODOS_DEPARTAMENTOS ||
      servicio.departamento === departamento;
    const cumpleCiudad =
      ciudad === TODAS_CIUDADES || servicio.ciudad === ciudad;
    const cumplePrecioMin =
      !precioMin ||
      (servicio.precio && parseInt(servicio.precio) >= parseInt(precioMin));
    const cumplePrecioMax =
      !precioMax ||
      (servicio.precio && parseInt(servicio.precio) <= parseInt(precioMax));
    const cumpleMoneda = !moneda || servicio.moneda === moneda;
    const cumpleImagenes = !soloConImagenes || servicio.tieneImagenes;

    return (
      cumpleBusqueda &&
      cumpleDepartamento &&
      cumpleCiudad &&
      cumplePrecioMin &&
      cumplePrecioMax &&
      cumpleMoneda &&
      cumpleImagenes
    );
  });

  // Manejar cambio de departamento
  const handleDepartamentoChange = (value: string) => {
    setDepartamento(value);
    setCiudad(TODAS_CIUDADES); // Resetear ciudad cuando cambia el departamento
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header con barra de búsqueda */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Barra de búsqueda y botón de inicio */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="shrink-0"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                </Link>
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar servicios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <span className="hidden sm:inline mr-2">Buscar</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="space-y-2">
                <Label>Departamento</Label>
                <Select
                  value={departamento}
                  onValueChange={handleDepartamentoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TODOS_DEPARTAMENTOS}>Todos</SelectItem>
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
                <Select value={ciudad} onValueChange={setCiudad}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TODAS_CIUDADES}>Todas</SelectItem>
                    {departamento !== TODOS_DEPARTAMENTOS &&
                      ciudades[departamento as keyof typeof ciudades]?.map(
                        (city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        )
                      )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Precio mínimo</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Precio máximo</Label>
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Moneda</Label>
                <Select value={moneda} onValueChange={setMoneda}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UYU">UYU</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end">
                <Toggle
                  pressed={soloConImagenes}
                  onPressedChange={setSoloConImagenes}
                  className="w-full data-[state=on]:bg-violet-600"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Solo con imágenes
                </Toggle>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {serviciosFiltrados.map((servicio) => (
            <Link href={`/servicio/${servicio.id}`} key={servicio.id}>
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-violet-500 transition-colors flex flex-col h-full">
                <ServiceImage
                  src={servicio.imagen || NO_IMAGE}
                  alt={servicio.titulo}
                  tieneImagenes={servicio.tieneImagenes}
                />
                <div className="p-3 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-base font-semibold mb-2 line-clamp-2">
                      {servicio.titulo}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {servicio.descripcion}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {servicio.ciudad}, {servicio.departamento}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="font-semibold text-green-400">
                        {servicio.precio?.toLocaleString()} {servicio.moneda}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <Link
                      href={`https://wa.me/${
                        servicio.whatsapp
                          ? servicio.telefonoPrincipal?.replace(/\s+/g, "")
                          : ""
                      }`}
                      target="_blank"
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white text-sm"
                    >
                      Contactar por WhatsApp
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
