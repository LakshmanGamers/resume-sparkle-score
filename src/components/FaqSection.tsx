import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const faqs = [
    {
      question: "What is Resume Sparkle Score?",
      answer: "Resume Sparkle Score is an AI-powered platform that analyzes your resume and provides detailed feedback to help you improve it. We score your resume based on various factors and give you actionable insights to make it stand out to recruiters."
    },
    {
      question: "How does the resume analysis work?",
      answer: "Our AI model, trained on thousands of successful resumes, scans your resume for key elements like clarity, impact, and use of keywords. It then generates a score and a personalized report with suggestions for improvement."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data privacy very seriously. Your resume is only used for the analysis and is not shared with any third parties. You can request to have your data deleted at any time."
    },
    {
      question: "What kind of feedback will I receive?",
      answer: "You will receive a comprehensive report that includes an overall score, a breakdown of your resume's strengths and weaknesses, and specific suggestions for improving each section. We focus on aspects like action verbs, quantifiable achievements, and formatting."
    },
    {
      question: "Can I use Resume Sparkle Score for any industry?",
      answer: "Yes! Our AI is designed to be versatile and can analyze resumes for a wide range of industries and job roles. The core principles of a great resume are universal, and our feedback is tailored to be relevant for your specific career path."
    }
  ];
  
  const FaqSection = () => {
    return (
      <section id="faq" className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Have questions? We have answers.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  };
  
  export default FaqSection; 