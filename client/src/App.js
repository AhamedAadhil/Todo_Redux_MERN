import "./App.css";
import Completed from "./pages/Completed";
import Home from "./pages/Home";
import Incompleted from "./pages/Incompleted";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/incompleted" element={<Incompleted />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
