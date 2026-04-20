
/**
 * CircularLoadingIndicator Component
 * @param {string} size - Tailwing sizing class (e.g., 'size-6', 'size-10', 'size-16')
 * @param {string} color - Tailwind text color class (determines the color of the spinner itself)
 */
const CircularLoadingIndicator = ({ 
  size = 'size-8', 
  color = 'text-gray-900 dark:text-gray-100' 
}) => {
  return (
    <div className="flex items-center justify-center">
      {/* Container to handle the alignment of the text/description relative to the spinner */}
      <div role="status" className={`flex flex-col items-center gap-2`}>
        {/* SVG is the best choice for sharp, lightweight icons */}
        <svg 
          className={`animate-spin ${size} ${color}`}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          {/* Track Circle (The fainter background circle) */}
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          
          {/* Active Arc (The spinning segment) */}
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        
        {/* Accessibility support (screen readers) */}
        <span className="sr-only">Loading...</span>
        
        {/* Example: Optional loading text below the spinner */}
        {/* <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading your data...</span> */}
      </div>
    </div>
  );
};

export default CircularLoadingIndicator;