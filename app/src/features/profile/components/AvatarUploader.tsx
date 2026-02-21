import { useState } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploaderProps {
  userId: string;
  onUploadComplete: (url: string) => void;
  disabled?: boolean;
}

export function AvatarUploader({ userId, onUploadComplete, disabled }: AvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Por favor sube un archivo de imagen válido.');
        return;
      }

      // Limite de tamaño (ej: 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no puede superar los 2MB.');
        return;
      }

      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Subir archivo
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true // Permitir sobrescribir si coincidiera nombre (raro con Date.now)
        });

      if (uploadError) {
        throw uploadError;
      }

      // 2. Obtener URL pública
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // 3. Notificar al padre
      onUploadComplete(data.publicUrl);

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert('Error al subir la imagen: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor="avatar-upload"
        className={`
          absolute bottom-0 right-0 p-2 rounded-full shadow-lg transition-colors cursor-pointer
          ${disabled || isUploading
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary/90'
          }
        `}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
      </label>
    </div>
  );
}
