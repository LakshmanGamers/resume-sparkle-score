import { useState, useEffect } from "react";
import { ArrowLeft, Target, TrendingUp, CheckCircle, AlertCircle, Upload, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface JobMatch {
    match_score: {
        score: number;
        level: string;
        summary: string;
    };
    score_breakdown: {
        category: string;
        score: number;
        description: string;
    }[];
    keyword_analysis: {
        missing_keywords: {
            keyword: string;
            importance: string;
            suggestion: string;
        }[];
        matching_keywords: string[];
    };
    experience_alignment: {
        job_requirement: string;
        resume_evidence: string;
        is_match: boolean;
    }[];
    recommendations: {
        area: string;
        suggestion: string;
    }[];
}

const JobMatch = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchData, setMatchData] = useState<JobMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);

  useEffect(() => {
    const fileBase64 = sessionStorage.getItem("resumeFile");
    const mimeType = sessionStorage.getItem("resumeMimeType");

    if (fileBase64 && mimeType) {
      fetch(fileBase64)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "resume.pdf", { type: mimeType });
          setUploadedResume(file);
        });
    }
  }, []);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !uploadedResume) return;
    
    setIsAnalyzing(true);
    setError(null);
    setMatchData(null);

    const formData = new FormData();
    formData.append("resume", uploadedResume);
    formData.append("jobDescription", jobDescription);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/job-match`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get job match analysis from server.");
      }

      const data = await response.json();
      console.log("Job Match Analysis:", data);
      setMatchData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const renderResults = () => {
    if (!matchData && !error) return null;

    if (error) {
      return (
        <div className="text-center p-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700">Analysis Failed</h3>
            <p className="text-gray-600 mt-2">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => { setMatchData(null); setError(null); }} aria-label="Try job match analysis again">Try Again</Button>
        </div>
      );
    }
    
    return (
        <div className="max-w-4xl mx-auto">
            {/* Match Score Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Analysis Complete</span>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  {/* Overall Match Circle */}
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto relative mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="45" fill="none" stroke="url(#matchGradient)" strokeWidth="8"
                          strokeLinecap="round" strokeDasharray={`${(matchData.match_score.score / 100) * 283} 283`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-gray-900">{matchData.match_score.score}%</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2 mb-2">
                      {matchData.match_score.level}
                    </Badge>
                    <p className="text-sm text-gray-600">Job Match Score</p>
                  </div>

                  {/* Category Breakdown */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 mb-4">Match Breakdown</h3>
                    {matchData.score_breakdown.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{category.category}</span>
                            <span className={`text-sm font-bold ${getScoreColor(category.score)}`}>
                              {category.score}%
                            </span>
                          </div>
                           <Progress value={category.score} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                 <p className="text-gray-600">{matchData.match_score.summary}</p>
              </div>
            </div>

            {/* Keyword Analysis */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-red-600 mb-2">Missing Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {matchData.keyword_analysis.missing_keywords.map((kw, i) => <Badge key={i} variant="destructive">{kw.keyword}</Badge>)}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-green-600 mb-2">Matching Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {matchData.keyword_analysis.matching_keywords.map((kw, i) => <Badge key={i} className="bg-green-100 text-green-800">{kw}</Badge>)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

             {/* Experience Alignment */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Experience Alignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {matchData.experience_alignment.map((exp, i) => (
                       <div key={i}>
                           <p className="font-semibold">{exp.job_requirement}</p>
                           <p className={`text-sm ${exp.is_match ? 'text-green-600' : 'text-red-600'}`}>{exp.resume_evidence}</p>
                       </div>
                   ))}
                </CardContent>
            </Card>

             {/* Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {matchData.recommendations.map((rec, i) => (
                        <div key={i} className="border-l-4 border-blue-500 p-3 rounded-r-md">
                            <h4 className="font-semibold">{rec.area}</h4>
                            <p className="text-gray-700">{rec.suggestion}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Job Match Analysis</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!matchData && !error ? (
          /* Input Section */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
                <Target size={16} />
                <span className="text-sm font-medium">Job Match Analysis</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Compare Your Resume with a Job Description
              </h2>
              <p className="text-lg text-gray-600">
                Upload your resume and paste the job description to see how well they match
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span>Upload Resume</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!uploadedResume ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Drop your resume here or click to browse</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => e.target.files && setUploadedResume(e.target.files[0])}
                        className="hidden"
                        id="resume-upload"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                  ) : (
                    <div className="bg-green-50 rounded-lg p-6 text-center border border-green-200">
                      <FileText className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="font-medium text-green-800">{uploadedResume.name}</p>
                      <p className="text-sm text-green-600">Ready for analysis</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => setUploadedResume(null)}
                        aria-label="Upload a different resume file"
                      >
                        Upload Different File
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Job Description Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Job Description</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the complete job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[250px] resize-none"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {jobDescription.length} characters • {jobDescription.trim().split(/\s+/).filter(w => w).length} words
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8"
                onClick={handleAnalyze}
                disabled={!jobDescription.trim() || !uploadedResume || isAnalyzing}
              >
                {isAnalyzing ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing Match...</span>
                  </span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Job Match
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          renderResults()
        )}
      </main>
    </div>
  );
};

export default JobMatch;
