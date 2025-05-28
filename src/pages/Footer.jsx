const Footer = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
          CryptoInvest
        </div>
        <p className="text-gray-400 mb-6">
          The future of decentralized finance is here
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
