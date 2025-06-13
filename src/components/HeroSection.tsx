import { useState, useRef } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onFileUpload: (file: File) => void;
}

const HeroSection = ({ onFileUpload }: HeroSectionProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        onFileUpload(file);
      }, 1500);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            🎯 Instantly Score Your{" "}
            <span className="text-blue-600">
              Resume with AI
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Upload your resume and get personalized feedback in seconds. 
            No signup required, completely private.
          </p>
        </div>

        {/* Upload Area */}
        <div className="max-w-lg mx-auto mb-12">
          <div
            className={`
              relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer
              ${isDragOver 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }
              ${isUploading ? 'animate-pulse' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
            aria-label="Upload your resume by dragging and dropping a PDF file or by clicking to browse"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            
            <div className="flex flex-col items-center space-y-4">
              {isUploading ? (
                <>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-blue-600 font-medium">Analyzing your resume...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF files only • Max 10MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleButtonClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </span>
            ) : (
              "Upload Resume"
            )}
          </Button>
        </div>

        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Your resume is analyzed locally and never stored on our servers. 
          <a href="#privacy" className="text-blue-600 hover:underline ml-1">
            Learn more about privacy
          </a>
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
