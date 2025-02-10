import Image from "next/image";

const NO_IMAGE =
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&h=600&fit=crop";

interface ServiceGalleryProps {
  images: string[];
  title: string;
}

export default function ServiceGallery({ images, title }: ServiceGalleryProps) {
  const mainImage = images[0] || NO_IMAGE;

  return (
    <div className="space-y-4">
      <div className="aspect-square relative rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          alt={title}
          width={800}
          height={600}
          className="rounded-lg object-cover w-full max-h-[500px]"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="aspect-square relative rounded-lg overflow-hidden"
          >
            <Image
              src={image}
              alt={`${title} - Imagen ${index + 1}`}
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
