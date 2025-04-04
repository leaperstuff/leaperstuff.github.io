
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const WhiteboardPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("pen");
  const { toast } = useToast();

  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get the parent div dimensions
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    const context = canvas.getContext('2d');
    if (context) {
      context.lineCap = "round";
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      contextRef.current = context;
    }
    
    // Load saved canvas from localStorage
    const savedCanvas = localStorage.getItem('leaperWhiteboard');
    if (savedCanvas) {
      const image = new Image();
      image.onload = () => {
        contextRef.current?.drawImage(image, 0, 0);
      };
      image.src = savedCanvas;
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!canvas || !contextRef.current || !container) return;
      
      // Save the current drawing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempContext = tempCanvas.getContext('2d');
      if (tempContext) {
        tempContext.drawImage(canvas, 0, 0);
      }
      
      // Resize the canvas
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Restore the drawing
      contextRef.current.drawImage(tempCanvas, 0, 0);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update brush properties when they change
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (tool === "pen") {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    }
    
    lastPosRef.current = { x, y };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (tool === "pen") {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
    } else if (tool === "eraser") {
      contextRef.current.clearRect(
        x - brushSize / 2, 
        y - brushSize / 2,
        brushSize, 
        brushSize
      );
    }
    
    lastPosRef.current = { x, y };
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    
    // Save canvas to localStorage
    if (canvasRef.current) {
      try {
        localStorage.setItem('leaperWhiteboard', canvasRef.current.toDataURL());
      } catch (e) {
        console.error("Error saving whiteboard:", e);
      }
    }
  };

  const clearCanvas = () => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(
        0, 0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      localStorage.removeItem('leaperWhiteboard');
      
      toast({
        title: "Whiteboard cleared",
        description: "Your whiteboard has been cleared.",
      });
    }
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `leaperstuff-whiteboard-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    
    toast({
      title: "Whiteboard downloaded",
      description: "Your whiteboard has been downloaded as a PNG file.",
    });
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 mb-4 justify-between items-center">
          <div className="flex flex-wrap gap-3 items-center">
            <Select 
              value={tool} 
              onValueChange={(value) => setTool(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Tool" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pen">Pen</SelectItem>
                <SelectItem value="eraser">Eraser</SelectItem>
              </SelectContent>
            </Select>
            
            {tool === "pen" && (
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-9 rounded border border-gray-300 cursor-pointer"
              />
            )}
            
            <div className="flex items-center gap-2 w-48">
              <span className="text-xs">Size:</span>
              <Slider
                value={[brushSize]}
                min={1}
                max={50}
                step={1}
                onValueChange={(values) => setBrushSize(values[0])}
                className="w-full"
              />
              <span className="text-xs w-5">{brushSize}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearCanvas}
            >
              Clear
            </Button>
            <Button
              onClick={downloadCanvas}
              className="bg-leaper-500 hover:bg-leaper-600 text-black"
            >
              Download
            </Button>
          </div>
        </div>
        
        <div className="whiteboard-container bg-white border border-gray-200 rounded-lg overflow-hidden w-full" style={{ height: 'calc(100vh - 300px)' }}>
          <canvas
            ref={canvasRef}
            className="whiteboard-canvas w-full h-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        </div>
      </Card>
    </div>
  );
};

export default WhiteboardPage;
