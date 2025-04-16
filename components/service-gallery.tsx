"use client";

import Image from "next/image";
import { useState } from "react";

const NO_IMAGE =
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&h=600&fit=crop";

interface ServiceGalleryProps {
  images: string[];
  title: string;
}

export default function ServiceGallery({ images, title }: ServiceGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const mainImage = images.length > 0 ? images[selectedImage] : NO_IMAGE;

  return (
    <div className="space-y-4">
      <div className="aspect-video relative rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          alt={title}
          width={800}
          height={600}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square relative rounded-lg overflow-hidden transition-all duration-200 ${
                selectedImage === index
                  ? "ring-2 ring-violet-500 scale-105"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${title} - Imagen ${index + 1}`}
                width={120}
                height={120}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
