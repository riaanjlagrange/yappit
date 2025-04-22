import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
