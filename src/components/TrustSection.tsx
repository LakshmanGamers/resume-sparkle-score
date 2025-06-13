
import { Shield, Lock, Eye } from "lucide-react";

const TrustSection = () => {
  const features = [
    {
      icon: Shield,
      title: "No Data Storage",
      description: "We don't store your resume or personal information"
    },
    {
      icon: Lock,
      title: "Secure Analysis",
      description: "All processing happens securely in the cloud"
    },
    {
      icon: Eye,
      title: "Complete Privacy",
      description: "No tracking, no ads, no data collection"
    }
  ];

  return (
    <section id="privacy" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
            <Shield size={16} />
            <span className="text-sm font-medium">100% Private & Secure</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your privacy is our priority
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We believe great resume feedback shouldn't come at the cost of your privacy
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
