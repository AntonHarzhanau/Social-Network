import { cn } from "@/shared/lib/utils";
import { useRef, useState, type ChangeEvent } from "react";

interface DnDZoneProps {
  onFilesSelected: (files: File[]) => void;
}

const DnDZone = ({ onFilesSelected }: DnDZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList: FileList) => {
    const arr = Array.from(fileList);
    onFilesSelected(arr);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div
      className={cn(
        "h-52 rounded-2xl flex justify-center items-center border-2 border-dashed cursor-pointer transition text-sm text-center px-4",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/40 hover:bg-muted/40",
      )}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div>
        <div className="font-medium">Drag & drop files here</div>
        <div className="text-xs text-muted-foreground mt-1">
          or click to select
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default DnDZone;
