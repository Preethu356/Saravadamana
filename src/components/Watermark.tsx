import watermarkLogo from "@/assets/watermark-logo.png";

const Watermark = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <img 
          src={watermarkLogo} 
          alt="Sarvadamana Watermark" 
          className="w-96 h-96 object-contain"
        />
      </div>
    </div>
  );
};

export default Watermark;
