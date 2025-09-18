import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, FileText, CheckCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "uploaded" | "processing" | "completed";
}

export default function FileUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "file-1",
      name: "training_data.csv",
      size: 2.4 * 1024 * 1024,
      status: "completed"
    },
    {
      id: "file-2", 
      name: "model_predictions.json",
      size: 1.8 * 1024 * 1024,
      status: "processing"
    }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return apiRequest("POST", "/api/upload", {
        modelId: "model-1", // In real app, this would be dynamic
        filename: file.name,
        size: file.size
      });
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded and is being processed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 100MB limit.`,
          variant: "destructive",
        });
        return;
      }

      const newFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        status: "uploading"
      };

      setUploadedFiles(prev => [...prev, newFile]);
      
      // Simulate upload process
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => f.id === newFile.id ? { ...f, status: "processing" } : f)
        );
        
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === newFile.id ? { ...f, status: "completed" } : f)
          );
        }, 2000);
      }, 1000);

      uploadMutation.mutate(file);
    });
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'csv':
        return "📊";
      case 'json':
        return "📄";
      case 'parquet':
        return "📦";
      default:
        return "📁";
    }
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader className="w-4 h-4 animate-spin text-blue-600" />;
      case "processing":
        return <Loader className="w-4 h-4 animate-spin text-primary" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle data-testid="title-file-upload">Upload Model Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "upload-zone rounded-lg p-8 text-center mb-4 cursor-pointer transition-colors",
            isDragOver && "drag-over"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          data-testid="upload-zone"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv,.json,.parquet"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="file-input"
          />
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CloudUpload className="text-primary text-2xl w-8 h-8" />
          </div>
          <p className="text-foreground font-medium mb-2">Drop your files here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
          <p className="text-xs text-muted-foreground">Supports: CSV, JSON, Parquet (Max 100MB)</p>
        </div>

        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-muted rounded-md"
              data-testid={`uploaded-file-${file.id}`}
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">{getFileIcon(file.name)}</span>
                <div>
                  <p className="text-sm font-medium text-foreground" data-testid={`filename-${file.id}`}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {
                      file.status === "uploading" ? "Uploading..." :
                      file.status === "processing" ? "Processing..." :
                      file.status === "completed" ? "Uploaded" : "Unknown"
                    }
                  </p>
                </div>
              </div>
              <div data-testid={`status-${file.id}`}>
                {getStatusIcon(file.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
