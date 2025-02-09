import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          ¿Ofreces un Servicio?
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Publica tu anuncio gratis y conecta con personas que buscan tus
          servicios.
        </p>
        <Link
          href="/publicar"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-md transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Publicar Anuncio
        </Link>
      </div>
    </section>
  );
}
