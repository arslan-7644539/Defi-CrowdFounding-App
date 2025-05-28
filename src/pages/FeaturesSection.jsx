const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the future of decentralized finance with cutting-edge
            technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Secure & Transparent",
              description:
                "Built on blockchain technology ensuring complete transparency and security of your investments.",
              icon: "🔒",
            },
            {
              title: "Low Fees",
              description:
                "Enjoy minimal transaction fees compared to traditional investment platforms.",
              icon: "💰",
            },
            {
              title: "24/7 Trading",
              description:
                "Trade and invest anytime, anywhere with our always-available decentralized platform.",
              icon: "🌍",
            },
          ].map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
