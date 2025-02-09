import { DollarSign, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Constants
const NO_IMAGE =
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=500&h=300&fit=crop";
const ERROR_IMAGE =
  "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500&h=300&fit=crop";

interface ServiceCardProps {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: string | null;
  moneda: string | null;
  departamento: string | null;
  ciudad: string | null;
  telefonoPrincipal: string | null;
  whatsapp: boolean;
  imagen: string | null;
  tieneImagenes: boolean;
}

export default function ServiceCard({
  id,
  titulo,
  descripcion,
  precio,
  moneda,
  departamento,
  ciudad,
  telefonoPrincipal,
  whatsapp,
  imagen,
  tieneImagenes,
}: ServiceCardProps) {
  const imageSource = tieneImagenes ? imagen || NO_IMAGE : NO_IMAGE;

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-violet-500 transition-colors flex flex-col h-full">
      <Link href={`/servicio/${id}`} className="flex flex-col flex-grow">
        <div className="relative h-48 w-full">
          <Image
            src={imageSource}
            alt={titulo}
            fill
            className={`object-cover ${
              !tieneImagenes ? "opacity-50 grayscale" : ""
            }`}
          />
          {!tieneImagenes && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-400">Sin imágenes</span>
              </div>
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-base font-semibold mb-2 line-clamp-2">
              {titulo}
            </h3>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {descripcion}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <MapPin className="w-3 h-3" />
              <span className="truncate">
                {ciudad}, {departamento}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="font-semibold text-green-400">
                {precio?.toLocaleString()} {moneda}
              </span>
            </div>
          </div>
        </div>
      </Link>
      {whatsapp && telefonoPrincipal && (
        <div className="p-3 pt-0">
          <div className="pt-3 border-t border-gray-800">
            <Link
              href={`https://wa.me/${telefonoPrincipal.replace(/\s+/g, "")}`}
              target="_blank"
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white text-sm"
            >
              Contactar por WhatsApp
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
