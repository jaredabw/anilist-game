import { createContext, useContext, useState } from "react";
import { fetchMedia } from "../api";

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameData, setGameData] = useState({
    type: "",
    startId: "",
    endId: "",
    victory: false,
    path: [],
  });

  const [currentPage, setCurrentPage] = useState(null);

  const startGame = async (startType, endType, startId, endId) => {
    setGameData({ startType: null, startId: null, endType: null, endId: null, victory: false, path: [] });
    // Reset game data as I believe there was a race condition causing the game to immediately think it is victory when beginning after winning a game.
    const data = await fetchMedia(startId, startType);
    const startPage = { type: startType, id: Number(startId), name: data.Media.title.romaji, image: data.Media.coverImage.medium, relationshipFromPrev: null };
    setGameData({ startType, startId, endType, endId, victory: false, path: [startPage] });
    setCurrentPage(startPage);
  };

  const addToPath = (type, id, name, image, relationshipFromPrev) => {
    const newPage = { type, id, name, image, relationshipFromPrev };
    setGameData((prev) => {
      const newPath = [...prev.path, newPage];
      return {
        ...prev,
        victory: type == prev.endType && id == prev.endId,
        path: newPath,
      };
    });
    setCurrentPage(newPage);
  };

  const handleLinkClick = (e, nextType, nextId, nextName, nextImage, relationshipFromPrev) => {
    e.preventDefault();
    addToPath(nextType, nextId, nextName, nextImage, relationshipFromPrev);
  };

  const goBack = () => {
    setGameData((prev) => {
      if (prev.path.length <= 1) {
        return prev;
      }
      const newPath = prev.path.slice(0, prev.path.length - 1);
      const newCurrentPage = newPath[newPath.length - 1] || null;
      setCurrentPage(newCurrentPage);
      return { ...prev, path: newPath };
    });
  };

  const resetPathTo = (index) => {
    const newPath = gameData.path.slice(0, index + 1);
    setGameData((prev) => ({
      ...prev,
      path: newPath,
    }));
    const newCurrentPage = newPath[newPath.length - 1];
    setCurrentPage(newCurrentPage);
  };

  return (
    <GameContext.Provider value={{ gameData, currentPage, setCurrentPage, startGame, addToPath, goBack, resetPathTo, handleLinkClick }}>
      {children}
    </GameContext.Provider>
  );
};
