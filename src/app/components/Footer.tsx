export function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center opacity-30">
        {/* Gannet bird silhouette - simplified SVG */}
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 48 48" 
          fill="none" 
          className="mb-2"
        >
          <path 
            d="M24 8C20 8 16 12 14 16C12 20 10 24 12 28C14 32 18 34 22 34L24 40L26 34C30 34 34 32 36 28C38 24 36 20 34 16C32 12 28 8 24 8Z" 
            fill="currentColor"
            className="text-gray-400"
          />
        </svg>
        <p className="text-xs tracking-wider font-medium text-gray-400">
          WEST COAST RANGERS FC
        </p>
      </div>
    </footer>
  );
}
