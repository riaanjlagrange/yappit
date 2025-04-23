import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="container mx-auto pt-32 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
