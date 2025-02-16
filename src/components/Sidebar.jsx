import { useEffect, useRef } from "react";
import { useGameContext } from "../context/GameContext";
import { titleCase } from "title-case";

const Sidebar = () => {
  const { gameData, goBack, resetPathTo } = useGameContext();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = sidebarRef.current.scrollHeight;
    }
  }, [gameData.path]);

  return (
    <div
      ref={sidebarRef}
      className="2xl:w-1/5 xl:w-1/6 w-1/5 bg-gray-800 text-white h-screen overflow-y-auto p-4 pt-0 sticky top-0"
    >
      <div className="sticky top-0 bg-gray-800 pt-4">
        <h2 className="text-xl font-bold mb-4">Current Path</h2>
        <button
          onClick={goBack}
          className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold rounded"
        >
          Back
        </button>
      </div>
      <ul>
        {gameData.path.map((entry, index) => (
          <div key={index}>
            {entry.relationshipFromPrev && (
              <div className="flex items-start ml-16 xl:ml-16 lg:ml-5 sm:ml-4 mb-1">
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
                <span className="text-gray-400 text-xs xl:ml-8 lg:ml-4 sm:ml-2 pr-4">
                  {entry.relationshipFromPrev}
                </span>
              </div>
            )}
            <button
              onClick={() => resetPathTo(index)}
              className="mb-1 bg-gray-700 rounded-md w-full text-left hover:bg-gray-600 hover:cursor-pointer flex items-stretch"
            >
              {entry.image && (
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="w-12 rounded-l-lg object-cover aspect-[2/3]"
                />
              )}
              <div className="p-2 flex-grow flex flex-col justify-center">
                <span className="block text-xs text-gray-300">
                  {titleCase(entry.type)}
                </span>
                {entry.name}
              </div>
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
