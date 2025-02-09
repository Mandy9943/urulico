import useSWR from "swr";
import { getServices } from "../actions";

export interface Service {
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

export interface ServicesResponse {
  services: Service[];
  total: number;
}

export function useServices(searchParams: string) {
  const { data, error, isLoading } = useSWR<ServicesResponse>(
    searchParams ? `/api/services?${searchParams}` : null,
    () => getServices(searchParams)
  );

  return {
    services: data?.services ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError: error,
  };
}
