import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';

interface BillImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export const BillImageUploader = ({ images, onImagesChange }: BillImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (images.length + newFiles.length > 3) {
        console.error("You can only upload a maximum of 3 images.");
        return;
      }
      const updatedImages = [...images, ...newFiles];
      onImagesChange(updatedImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {images.length === 0 ? (
        <Card
          className="border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center p-12">
            <ImagePlus className="w-16 h-16 text-gray-400 mb-3" />
            <p className="text-base font-medium text-gray-700">Добавить фото чека</p>
            <p className="text-sm text-gray-500 mt-1">до 3-х изображений</p>
          </div>
        </Card>
      ) : (
        <Carousel className="w-full" opts={{ align: "start", loop: false }}>
          <CarouselContent className="-ml-3">
            {images.map((image, index) => (
              <CarouselItem key={index} className="relative basis-11/12 pl-3">
                <Card className="overflow-hidden shadow-md">
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Чек ${index + 1}`}
                      className="object-cover w-full h-56 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-3 right-3 rounded-full h-9 w-9 bg-red-500 hover:bg-red-600 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              </CarouselItem>
            ))}
            {images.length < 3 && (
              <CarouselItem className="relative basis-11/12 pl-3">
                <Card
                  className="border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all h-56 flex items-center justify-center shadow-sm"
                  onClick={triggerFileInput}
                >
                  <div className="flex flex-col items-center justify-center">
                    <ImagePlus className="w-12 h-12 text-gray-400" />
                    <p className="text-sm font-medium text-gray-600 mt-2">Добавить еще</p>
                  </div>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*"
      />
    </div>
  );
};