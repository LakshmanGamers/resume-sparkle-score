import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumeReview {
    overall_score: {
      score: number;
      level: string;
      summary: string;
    };
    score_breakdown: {
      category: string;
      score: number;
    }[];
    detailed_feedback: {
      title: string;
      score: number;
      strengths: string[];
      issues: string[];
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

const generatePdf = async (element: HTMLElement) => {
  if (!element) {
    console.error("Element to render is not provided.");
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    logging: true,
    backgroundColor: null, // Use element's background
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save('resume-analysis-report.pdf');
};

export default generatePdf; 