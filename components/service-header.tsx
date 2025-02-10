"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";

interface ServiceHeaderProps {
  initialQuery?: string;
}

export default function ServiceHeader({
  initialQuery = "",
}: ServiceHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" asChild className="shrink-0">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild className="shrink-0">
            <Link href="/">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar servicios..."
              className="w-full bg-black/20 border border-gray-800/50 rounded-lg pl-10 pr-12 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-2 hover:bg-gray-800/50"
            >
              Buscar
            </Button>
          </form>
          <Button asChild className="bg-violet-600 hover:bg-violet-700">
            <Link href="/publicar">
              <PlusCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Publicar anuncio</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
