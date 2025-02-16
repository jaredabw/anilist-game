import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "./context/GameContext";

const Home = () => {
  const [startType, setStartType] = useState("anime");
  const [endType, setEndType] = useState("anime");
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const navigate = useNavigate();
  const { startGame } = useGameContext();

  const handleStartGame = () => {
    if (!startId || !endId) {
      alert("Enter valid IDs for start and end");
      return;
    }
    startGame(startType, endType, startId, endId);
    navigate("/game");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'e' || e.key === '-' || e.key === '+') {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-6">AniList Game</h1>
      <div className="text-center text-lg mb-6">
        Navigate from one page to another in the shortest amount of clicks!
      </div>
      <div className="mb-4 flex items-center space-x-4">
        <select
          value={startType}
          onChange={(e) => setStartType(e.target.value)}
          className="p-2 border rounded bg-gray-700 text-white"
        >
          <option value="anime">Anime</option>
          <option value="manga">Manga</option>
        </select>
        <input
          type="number"
          placeholder="Enter start ID"
          value={startId}
          onChange={(e) => setStartId(e.target.value)}
          onKeyDown={handleKeyDown}
          className="p-2 border rounded bg-gray-700 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <select
          value={endType}
          onChange={(e) => setEndType(e.target.value)}
          className="p-2 border rounded bg-gray-700 text-white"
        >
          <option value="anime">Anime</option>
          <option value="manga">Manga</option>
        </select>
        <input
          type="number"
          placeholder="Enter end ID"
          value={endId}
          onChange={(e) => setEndId(e.target.value)}
          onKeyDown={handleKeyDown}
          className="p-2 border rounded bg-gray-700 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <div className="mb-4 text-xs text-gray-400 text-center">
        ID is found in the anilist.co URL:
        <br />
        https://anilist.co/anime/
        <span className="text-blue-100">20912</span>/Hibike-Euphonium/
      </div>

      <button
        onClick={handleStartGame}
        className="bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-lg hover:cursor-pointer"
      >
        Start Game
      </button>
    </div>
  );
};

export default Home;
