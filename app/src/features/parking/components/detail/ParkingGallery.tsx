import { useState } from 'react';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { Badge } from '../../../../ui';

interface ParkingGalleryProps {
  images: string[];
  isVerified?: boolean;
}

export function ParkingGallery({ images, isVerified }: ParkingGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="relative aspect-video lg:aspect-[21/9]">
          <img
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}

          {isVerified && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-secondary text-white">
                <Shield className="h-3 w-3 mr-1" />
                Verificado
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
