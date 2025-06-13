import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    console.log("File uploaded:", file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result;
      if (typeof base64 === 'string') {
        sessionStorage.setItem("resumeFile", base64);
        sessionStorage.setItem("resumeMimeType", file.type);
        window.location.href = "/analysis";
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <main>
        <HeroSection onFileUpload={handleFileUpload} />
        <HowItWorks />
        <TrustSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
