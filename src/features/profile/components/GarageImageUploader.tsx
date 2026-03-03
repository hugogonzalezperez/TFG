import { useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { Camera, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface GarageImageUploaderProps {
  userId: string; // Needed for path organization
  garageId?: string; // Optional, can use 'temp' or random if new
  currentImages: string[];
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export function GarageImageUploader({
  userId,
  garageId = 'new',
  currentImages = [],
  onImagesChange,
  maxImages = 5
}: GarageImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const files = Array.from(event.target.files);

      // Validaciones básicas
      if (currentImages.length + files.length > maxImages) {
        toast.error(`Solo puedes tener un máximo de ${maxImages} fotos.`);
        return;
      }

      setIsUploading(true);
      const newUrls: string[] = [];

      // Subida secuencial para evitar race conditions raras en UI
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${garageId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('garage_images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Error uploading file:', file.name, uploadError);
          continue; // Skip failed uploads
        }

        const { data } = supabase.storage.from('garage_images').getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
      }

      console.log('Uploaded images:', newUrls);
      onImagesChange([...currentImages, ...newUrls]);

    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error('Error general en la subida.');
    } finally {
      // Reset input value to allow selecting same files again if needed
      event.target.value = '';
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    // Note: This only removes from the list/DB reference. 
    // Ideally we should also delete from Storage, but that requires extra RLS for delete.
    onImagesChange(currentImages.filter(url => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Grid de Fotos */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {currentImages.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-border">
              <img src={url} alt={`Garage ${index}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(url)}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="h-3 w-3" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Botón de Subida */}
      {currentImages.length < maxImages && (
        <div className="relative">
          <label
            className={`
                border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors
                ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
            ) : (
              <Camera className="h-8 w-8 text-muted-foreground mb-2" />
            )}

            <p className="text-sm font-medium">
              {isUploading ? 'Subiendo...' : 'Añadir fotos'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {maxImages - currentImages.length} restantes (Max 2MB)
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
