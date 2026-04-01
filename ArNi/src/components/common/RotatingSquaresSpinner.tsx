const RotatingSquaresSpinner : React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 flex flex-wrap">
        <div className="w-6 h-6 bg-blue-500 animate-spin"></div>
        <div className="w-6 h-6 bg-blue-500 animate-spin delay-200"></div>
        <div className="w-6 h-6 bg-blue-500 animate-spin delay-400"></div>
        <div className="w-6 h-6 bg-blue-500 animate-spin delay-600"></div>
      </div>
    </div>
  );
};

export default RotatingSquaresSpinner;

