import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home.jsx";
import GameLayout from "./layouts/GameLayout.jsx";
import { GameProvider } from "./context/GameContext.jsx";

const App = () => {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<GameLayout />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
};

export default App;
