const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            About CryptoInvest
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Leading the revolution in decentralized finance with cutting-edge
            blockchain technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              We're dedicated to democratizing access to financial opportunities
              through blockchain technology. Our platform provides secure,
              transparent, and efficient investment solutions that empower
              individuals to take control of their financial future.
            </p>

            <h3 className="text-2xl font-bold text-white">Why Trust Us?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    Audited Smart Contracts
                  </h4>
                  <p className="text-gray-400">
                    All our contracts are thoroughly audited by leading security
                    firms
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    Regulatory Compliance
                  </h4>
                  <p className="text-gray-400">
                    Full compliance with international financial regulations
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">24/7 Support</h4>
                  <p className="text-gray-400">
                    Round-the-clock customer support for all your needs
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Our Journey</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  2021
                </div>
                <div>
                  <h4 className="text-white font-semibold">Platform Launch</h4>
                  <p className="text-gray-400 text-sm">
                    Started with a vision to democratize DeFi
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  2022
                </div>
                <div>
                  <h4 className="text-white font-semibold">$100M+ TVL</h4>
                  <p className="text-gray-400 text-sm">
                    Reached first major milestone
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  2023
                </div>
                <div>
                  <h4 className="text-white font-semibold">Global Expansion</h4>
                  <p className="text-gray-400 text-sm">
                    Expanded to 50+ countries worldwide
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  2024
                </div>
                <div>
                  <h4 className="text-white font-semibold">$2.5B+ TVL</h4>
                  <p className="text-gray-400 text-sm">
                    Leading DeFi platform with 50K+ users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
