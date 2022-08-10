import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" exact element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
