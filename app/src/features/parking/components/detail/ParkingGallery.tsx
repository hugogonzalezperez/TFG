import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { Badge } from '../../../../ui';

interface ParkingGalleryProps {
  images: string[];
  isVerified?: boolean;
}

export function ParkingGallery({ images, isVerified }: ParkingGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (images.length === 0) return null;

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="relative bg-black group/gallery">
      <div className="max-w-7xl mx-auto overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative aspect-video lg:aspect-[21/9]">
              <img
                src={img}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-2 shadow-lg transition-all opacity-0 group-hover/gallery:opacity-100 hidden md:block"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-2 shadow-lg transition-all opacity-0 group-hover/gallery:opacity-100 hidden md:block"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}

        {isVerified && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-secondary text-white shadow-lg">
              <Shield className="h-3 w-3 mr-1" />
              Verificado
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
