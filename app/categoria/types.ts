export interface Service {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: number | null;
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
