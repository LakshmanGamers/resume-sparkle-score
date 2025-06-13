import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, FileText, Target, Award, TrendingUp, CheckCircle, AlertTriangle, User, Briefcase, GraduationCap, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import LoadingScreen from "@/components/LoadingScreen";
import generatePdf from "@/lib/pdfGenerator";

interface ResumeReview {
  overall_score: {
    score: number;
    level: string;
    summary: string;
  };
  score_breakdown: {
    category: string;
    score: number;
    weight: number;
    description: string;
  }[];
  detailed_feedback: {
    title: string;
    score: number;
    icon: string;
    strengths: string[];
    issues: string[];
    improvements: string[];
  }[];
  quick_wins: string[];
  industry_benchmarking: {
    performance_vs_average: string;
    improvement_potential: string;
    salary_impact: string;
  };
  recommendations_by_priority: {
    high_impact_low_effort: string[];
    medium_priority: string[];
    long_term_improvements: string[];
  };
}

const Analysis = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<ResumeReview | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const analysisContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const fileBase64 = sessionStorage.getItem("resumeFile");
      const mimeType = sessionStorage.getItem("resumeMimeType");

      if (fileBase64 && mimeType) {
        try {
          const fileResponse = await fetch(fileBase64);
          const blob = await fileResponse.blob();
          const file = new File([blob], "resume", { type: mimeType });
          
          const formData = new FormData();
          formData.append("resume", file);

          const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
          const response = await fetch(`${backendUrl}/review`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to fetch analysis");
          }

          const data = await response.json();
          console.log("Gemini Analysis:", data);
          setAnalysisResult(data);
          if (data?.overall_score?.score >= 75) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }
        } catch (error) {
          console.error("Error fetching analysis:", error);
          setAnalysisResult(null); // Ensure state is null on error
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  // Show loading screen first
  if (isLoading) {
    return <LoadingScreen onComplete={() => {}} />;
  }

  if (!analysisResult) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Analysis Failed</h2>
          <p className="mt-2 text-gray-600">
            Could not retrieve or parse resume analysis. Please try uploading again.
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/'}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const {
    overall_score,
    score_breakdown,
    detailed_feedback,
    quick_wins,
    industry_benchmarking,
    recommendations_by_priority,
  } = analysisResult;

  const handleDownload = async () => {
    if (analysisContentRef.current) {
      setIsDownloading(true);
      await generatePdf(analysisContentRef.current);
      setIsDownloading(false);
    }
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { label: "Excellent! 🏆", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 75) return { label: "Great Job! ✅", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 60) return { label: "Good Start ⚠️", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "Needs Work ❌", color: "text-red-600", bg: "bg-red-100" };
  };

  const scoreLevel = getScoreLevel(overall_score?.score || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" ref={analysisContentRef}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 animate-pulse"></div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">resume.pdf</span>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Analyzed
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/job-match'}>
                <Target className="w-4 h-4 mr-2" />
                Compare with Job
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download Report"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Score Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Resume Analysis Complete</span>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Overall Score */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto relative mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8"
                      strokeLinecap="round" strokeDasharray={`${((overall_score?.score || 0) / 100) * 283} 283`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{overall_score?.score || 0}</span>
                  </div>
                </div>
                <Badge className={`${scoreLevel.bg} ${scoreLevel.color} text-lg px-4 py-2 mb-2`}>
                  {scoreLevel.label}
                </Badge>
                <p className="text-sm text-gray-600">Overall Resume Score</p>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">Score Breakdown</h3>
                {score_breakdown?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        <span className="text-sm text-gray-600">{item.score}/100</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {overall_score?.summary}
            </p>
          </div>
        </div>

        {/* Quick Wins Section */}
        <Card className="mb-8 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Quick Wins (Do Today)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              {quick_wins?.map((win, index) => <li key={index}>{win}</li>)}
            </ul>
          </CardContent>
        </Card>

        {/* Detailed Feedback Section */}
        <div className="space-y-8">
          {detailed_feedback?.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span className="text-xl font-bold">{section.title}</span>
                  <Badge variant="outline" className="text-lg">{section.score}/100</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Strengths</h4>
                    <ul className="list-disc space-y-1 pl-5 text-gray-700">
                      {section.strengths?.map((item, i) => <li key={i}>{item}</li>)}
                      {section.strengths?.length === 0 && <li>No specific strengths identified in this section.</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Areas for Improvement</h4>
                    <ul className="list-disc space-y-1 pl-5 text-gray-700">
                      {section.issues?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industry Benchmarking */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-gray-900">Industry Benchmarking</h3>
              {industry_benchmarking && (
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-2xl font-bold text-blue-600">{industry_benchmarking.performance_vs_average.match(/[\d.-]+%?/)?.[0]}</span>
                  <p className="text-gray-600">{industry_benchmarking.performance_vs_average.replace(/[\d.-]+%?/, '').trim()}</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-green-600">{industry_benchmarking.improvement_potential.match(/[\d.-]+%?/)?.[0]}</span>
                  <p className="text-gray-600">{industry_benchmarking.improvement_potential.replace(/[\d.-]+%?/, '').trim()}</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-purple-600">{industry_benchmarking.salary_impact.match(/[\d.-]+%?/)?.[0]}</span>
                  <p className="text-gray-600">{industry_benchmarking.salary_impact.replace(/[\d.-]+%?/, '').trim()}</p>
                </div>
              </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations by Priority */}
        {recommendations_by_priority && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gray-700" />
              <span>Action Plan: Recommendations by Priority</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recommendations_by_priority.high_impact_low_effort?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-green-700 flex items-center"><Star className="w-4 h-4 mr-2" /> High Impact, Low Effort</h4>
                <ul className="list-disc space-y-2 pl-6 text-gray-800 bg-green-50 p-4 rounded-md">
                  {recommendations_by_priority.high_impact_low_effort.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
            
            {recommendations_by_priority.medium_priority?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-yellow-700 flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> Medium Priority</h4>
                <ul className="list-disc space-y-2 pl-6 text-gray-800 bg-yellow-50 p-4 rounded-md">
                  {recommendations_by_priority.medium_priority.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}

            {recommendations_by_priority.long_term_improvements?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-blue-700 flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Long-term Improvements</h4>
                <ul className="list-disc space-y-2 pl-6 text-gray-800 bg-blue-50 p-4 rounded-md">
                  {recommendations_by_priority.long_term_improvements.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Action Buttons */}
        <div className="max-w-md mx-auto mt-12 space-y-4">
          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            onClick={() => window.location.href = '/job-match'}
            aria-label="Compare your resume with a job description"
          >
            <Target className="w-4 h-4 mr-2" />
            Compare with Job Description
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={handleDownload} disabled={isDownloading} aria-label="Download detailed resume analysis report">
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download Detailed Report"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Analysis;
