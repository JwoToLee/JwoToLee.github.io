
import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, Pen } from "lucide-react";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
  currentSignature?: string;
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSignature
}) => {
  const [signatureMode, setSignatureMode] = useState<"draw" | "upload">("draw");
  const [signature, setSignature] = useState<string | null>(currentSignature || null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 2;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.strokeStyle = '#000000';
      }
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    context.beginPath();
    context.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling when drawing on touch devices
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    context.lineTo(clientX - rect.left, clientY - rect.top);
    context.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      setSignature(dataURL);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        setSignature(null);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      toast.error("Please upload a JPG or PNG image");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setSignature(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (signature) {
      onSave(signature);
      onClose();
      toast.success("Signature saved successfully");
    } else {
      toast.error("Please draw or upload a signature first");
    }
  };

  const resetUpload = () => {
    setSignature(null);
    setFileInputKey(Date.now());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Signature</DialogTitle>
          <DialogDescription>
            Draw your signature or upload a signature image
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="draw" value={signatureMode} onValueChange={(v) => setSignatureMode(v as "draw" | "upload")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw" className="flex items-center gap-2">
              <Pen className="h-4 w-4" />
              Draw
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="draw" className="space-y-4 py-4">
            <div className="border border-gray-300 rounded-md p-2">
              <canvas
                ref={canvasRef}
                width={450}
                height={200}
                className="border border-gray-200 rounded w-full touch-none bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
              />
            </div>
            <Button variant="outline" onClick={clearCanvas} type="button" className="w-full">
              Clear
            </Button>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <input
                key={fileInputKey}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={handleFileUpload}
              />
              {signature && signatureMode === "upload" && (
                <div className="mt-4 space-y-2">
                  <div className="border border-gray-200 rounded-md p-2 bg-white">
                    <img 
                      src={signature} 
                      alt="Uploaded Signature" 
                      className="max-h-[200px] mx-auto"
                    />
                  </div>
                  <Button variant="outline" onClick={resetUpload} type="button" className="w-full">
                    Reset
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {currentSignature && !signature && (
          <div className="py-2">
            <p className="text-sm font-medium mb-2">Current Signature:</p>
            <div className="border border-gray-200 rounded-md p-2 bg-white">
              <img 
                src={currentSignature} 
                alt="Current Signature" 
                className="max-h-[150px] mx-auto"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!signature}>
            Save Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;
