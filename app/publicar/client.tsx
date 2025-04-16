"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { ArrowLeft, Home, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createService } from "./actions";

const departamentos = [
  "Montevideo",
  "Canelones",
  "Maldonado",
  "Rocha",
  "Colonia",
];

const ciudades = {
  Montevideo: ["Centro", "Pocitos", "Carrasco", "Punta Carretas"],
  Canelones: ["Ciudad de la Costa", "Pando", "Las Piedras"],
  Maldonado: ["Punta del Este", "Maldonado", "San Carlos"],
  Rocha: ["Rocha", "La Paloma", "Castillos"],
  Colonia: ["Colonia del Sacramento", "Carmelo", "Nueva Helvecia"],
};

const formSchema = z.object({
  categoria: z.string({
    required_error: "Por favor selecciona una categoría",
  }),
  titulo: z
    .string()
    .min(10, "El título debe tener al menos 10 caracteres")
    .max(100, "El título no puede tener más de 100 caracteres"),
  descripcion: z.string().optional(),
  precio: z.string().optional(),
  moneda: z.string().optional(),
  departamento: z.string().optional(),
  ciudad: z.string().optional(),
  proveedor: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  telefonoPrincipal: z.string().optional(),
  telefonoSecundario: z.string().optional(),
  whatsapp: z.boolean().default(false),
  email: z.string().email("Por favor ingresa un email válido"),
  contactoPor: z.enum(["email", "llamada-whatsapp", "todos"]).optional(),
});
const PublicarClientSide = ({ categories }: { categories: Category[] }) => {
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [imagenesPreview, setImagenesPreview] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>("");
  const router = useRouter();
  const { startUpload } = useUploadThing("serviceImage");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whatsapp: false,
      contactoPor: "email",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagenes.length > 10) {
      alert("Solo puedes subir hasta 10 imágenes");
      return;
    }

    // Create object URLs for previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagenesPreview([...imagenesPreview, ...newPreviews]);

    // Store files in state
    const newImagenes = [...imagenes, ...files];
    setImagenes(newImagenes);

    // Start upload immediately
    setIsUploading(true);
    try {
      const uploadResult = await startUpload(files);
      if (uploadResult) {
        const urls = uploadResult.map((result) => result.url);
        setImageUrls([...imageUrls, ...urls]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error al subir imágenes. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    // Remove the image from all states
    const newImagenes = imagenes.filter((_, i) => i !== index);
    const newPreviews = imagenesPreview.filter((_, i) => i !== index);
    const newUrls = imageUrls.filter((_, i) => i !== index);

    setImagenes(newImagenes);
    setImagenesPreview(newPreviews);
    setImageUrls(newUrls);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Use the already uploaded image URLs
      // No need to upload again
      console.log(imageUrls);

      // Create service with the pre-uploaded images
      const result = await createService(
        {
          ...values,
          precio: values.precio ? Number(values.precio) : undefined,
        },
        imageUrls
      );

      if (result.success) {
        // Redirect to the service page or show success message
        router.push("/"); // or wherever you want to redirect
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error message to user
      alert("Error creating service. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
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
            <h1 className="text-lg font-semibold flex items-center ml-2">
              Publicar Anuncio
            </h1>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Categoría */}
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((categoria) => (
                        <SelectItem key={categoria.slug} value={categoria.slug}>
                          {categoria.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Imágenes */}
            <div className="space-y-4">
              <Label>Imágenes (máximo 10)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagenesPreview.map((preview, index) => (
                  <Card key={index} className="relative group">
                    <CardContent className="p-0">
                      <Image
                        width={100}
                        height={100}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index >= imageUrls.length && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-xs">Subiendo...</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {imagenes.length < 10 && (
                  <Card className="relative">
                    <CardContent className="p-0">
                      <label
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-violet-500 transition-colors ${
                          isUploading ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-6 w-6 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-400">
                            {isUploading ? "Subiendo..." : "Subir imagen"}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Título y Descripción */}
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del anuncio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Instalación profesional de aires acondicionados"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu servicio en detalle..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Precio y Moneda */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="moneda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UYU">UYU</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ubicación */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedDepartamento(value);
                        form.setValue("ciudad", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departamentos.map((dep) => (
                          <SelectItem key={dep} value={dep}>
                            {dep}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedDepartamento}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar ciudad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedDepartamento &&
                          ciudades[
                            selectedDepartamento as keyof typeof ciudades
                          ]?.map((ciudad) => (
                            <SelectItem key={ciudad} value={ciudad}>
                              {ciudad}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Información del proveedor */}
            <FormField
              control={form.control}
              name="proveedor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del proveedor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tu nombre o nombre de la empresa"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contacto */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="telefonoPrincipal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono principal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 099123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefonoSecundario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono secundario (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 099123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Contactar por WhatsApp
                      </FormLabel>
                      <FormDescription>
                        Permitir contacto por WhatsApp
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactoPor"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>¿Cómo prefieres ser contactado?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={!form.watch("telefonoPrincipal")}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="email" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Solo por email
                          </FormLabel>
                        </FormItem>
                        {form.watch("telefonoPrincipal") && (
                          <>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="llamada-whatsapp" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Por llamada y WhatsApp
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="todos" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Por email, llamada y WhatsApp
                              </FormLabel>
                            </FormItem>
                          </>
                        )}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isUploading}>
              Publicar anuncio
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default PublicarClientSide;
