import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full ml-5 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        {/* Large 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Sorry, the page you&apos;re looking for doesn&apos;t exist. It might
          have been moved or deleted.
        </p>

        {/* Decorative Element */}
        <div className="mb-12">
          <svg
            className="w-64 h-64 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-16 p-8 bg-white rounded-lg shadow-md max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Helpful Links
          </h3>
          <div className="space-y-2 text-left">
            <Link
              to="/"
              className="block text-blue-600 hover:text-blue-700 hover:underline"
            >
              → Dashboard
            </Link>
            <Link
              to="/students"
              className="block text-blue-600 hover:text-blue-700 hover:underline"
            >
              → Students
            </Link>
            <Link
              to="/placements"
              className="block text-blue-600 hover:text-blue-700 hover:underline"
            >
              → Placements
            </Link>
            <Link
              to="/supervisors"
              className="block text-blue-600 hover:text-blue-700 hover:underline"
            >
              → Supervisors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
