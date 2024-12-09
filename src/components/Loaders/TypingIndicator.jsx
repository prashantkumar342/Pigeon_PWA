

const TypingIndicator = () => {
  return (
    <div className="flex items-center h-6">
      <div className="w-1.5 h-1.5 mx-0.5 bg-gray-800 rounded-full animate-typing"></div>
      <div className="w-1.5 h-1.5 mx-0.5 bg-gray-800 rounded-full animate-typing delay-150"></div>
      <div className="w-1.5 h-1.5 mx-0.5 bg-gray-800 rounded-full animate-typing delay-300"></div>
    </div>
  );
};

export default TypingIndicator;
