
import { Camera, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HorseImageUploaderProps {
  imageUrl: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  inputId: string;
  placeholder: string;
}

export function HorseImageUploader({
  imageUrl,
  onUpload,
  onRemove,
  inputId,
  placeholder
}: HorseImageUploaderProps) {
  return imageUrl ? (
    <div className="relative w-full h-48">
      <img
        src={imageUrl}
        alt="Imagem do cavalo"
        className="w-full h-full object-cover rounded-md"
      />
      <div className="absolute bottom-2 right-2 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => document.getElementById(inputId)?.click()}
          className="bg-white"
        >
          <Camera className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <input
        id={inputId}
        type="file"
        hidden
        accept="image/*"
        onChange={onUpload}
      />
    </div>
  ) : (
    <div className="w-full flex flex-col items-center justify-center h-48 bg-gray-100 rounded-md">
      <Upload className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">{placeholder}</p>
      <Input
        type="file"
        id={inputId}
        className="hidden"
        accept="image/*"
        onChange={onUpload}
      />
      <Button
        variant="outline"
        className="mt-2"
        onClick={() => document.getElementById(inputId)?.click()}
      >
        Escolher Imagem
      </Button>
    </div>
  );
}
