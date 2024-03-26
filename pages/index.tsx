import Link from "next/link";

const HomePage = () => {
  return (
    <div className="max-w-xl mx-auto my-8">
      <h1 className="text-2xl font-bold text-center mb-8">Home</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Select an exercise:
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
              <Link href="/exercise1">
                <span className="cursor-pointer">Exercise 1: Normal Range</span>
              </Link>
            </li>
            <li className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
              <Link href="/exercise2">
                <span className="cursor-pointer">
                  Exercise 2: Fixed Value Range
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
