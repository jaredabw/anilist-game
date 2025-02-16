import Sidebar from "../components/Sidebar";
import { useGameContext } from "../context/GameContext";
import MediaPage from "../pages/MediaPage";
import CharacterPage from "../pages/CharacterPage";
import StaffPage from "../pages/StaffPage";
import Victory from "../components/Victory";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const GameLayout = () => {
  const { gameData, currentPage } = useGameContext();
  const contentRef = useRef(null);
  const [showVictory, setShowVictory] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  useEffect(() => {
    if (gameData.victory) {
      setShowVictory(true);
      setTimeout(() => {
        setOpacity(1);
      }, 500);
    }
  }, [gameData.victory]);

  let PageComponent = null;
  if (currentPage?.type === "anime" || currentPage?.type === "manga") {
    PageComponent = <MediaPage type={currentPage.type} id={currentPage.id} />;
  } else if (currentPage?.type === "character") {
    PageComponent = <CharacterPage id={currentPage.id} />;
  } else if (currentPage?.type === "staff") {
    PageComponent = <StaffPage id={currentPage.id} />;
  } else if (currentPage?.type === "studio") {
    PageComponent = (
      <p>Studio page not currently implemented. Please go back.</p>
    );
  } else if (currentPage?.type === "genre") {
    PageComponent = (
      <p>Genre page not currently implemented. Please go back.</p>
    );
  } else if (currentPage?.type === "tag") {
    PageComponent = <p>Tag page not currently implemented. Please go back.</p>;
  } else if (currentPage?.type === "season") {
    PageComponent = (
      <p>Season page not currently implemented. Please go back.</p>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden">
      <Sidebar />
      <div ref={contentRef} className="flex-1 p-4 overflow-y-auto">
        {PageComponent || (
          <p>
            No game started! Go back to{" "}
            <Link
              to={window.location.href.split("/").slice(0, -1).join("/")}
              className="text-blue-500"
            >
              Home
            </Link>
            !
          </p>
        )}
      </div>
      {showVictory && (
        <>
          <div
            className="absolute inset-0 bg-black/50 flex items-center"
            style={{
              transition: "opacity 3s",
              opacity: opacity,
            }}
          >
            <div className="w-full h-full overflow-y-auto p-8">
              <Victory />
            </div>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default GameLayout;
