import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-900 text-white">
      <h1 className="text-4xl text-neonOceanBlue">Welcome to Notes Manager</h1>
      <p className="mt-4 text-xl">Your personal notes, secure and accessible</p>
      <div className="mt-8 flex flex-col sm:flex-row space-x-0 sm:space-x-4">
        <Link
          to="/login"
          className="bg-neonOceanBlue text-smokeWhite px-6 py-3 rounded hover:bg-smokeWhite hover:text-neonOceanBlue transition flex items-center justify-center mb-4 sm:mb-0"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-smokeWhite text-neonOceanBlue px-6 py-3 rounded hover:bg-neonOceanBlue hover:text-smokeWhite transition flex items-center justify-center"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
