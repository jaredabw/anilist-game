import { Link } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { titleCase } from "title-case";

const Victory = () => {
  const { gameData } = useGameContext();

  return (
    <div className="flex items-center justify-center w-1/3 rounded-xl p-24 bg-gray-800/90 text-white mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Victory!</h1>
        <p className="text-lg mb-2">
          You successfully navigated through AniList!
        </p>
        <p className="text-lg mb-6">
          It took you {gameData.path.length - 1} steps!
        </p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go Home
        </Link>
        <ul className="mt-8 w-7/8 justify-center mx-auto">
          {gameData.path.map((entry, index) => (
            <div key={index}>
              {entry.relationshipFromPrev && (
                <div className="flex items-start md:ml-8 lg:ml-12 mb-2">
                  <svg
                    className="w-4 h-4 text-gray-400 ml-2 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                  <span className="text-gray-400 text-xs ml-8 pr-4">
                    {entry.relationshipFromPrev}
                  </span>
                </div>
              )}
              <li
                key={index}
                className="mb-2 bg-gray-700 rounded-md text-left hover:bg-gray-600 flex items-stretch"
              >
                {entry.image && (
                  <img
                    src={entry.image}
                    alt={entry.name}
                    className="w-18 rounded-l-lg object-cover aspect-2/3"
                  />
                )}
                <div className="p-2 flex-grow flex flex-col justify-center text-lg">
                  <span className="block text-xs text-gray-300">
                    {titleCase(entry.type)}
                  </span>
                  {entry.name}
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Victory;
