import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <div className="bg-indigo-50 min-h-screen relative">
        <NavBar />
        <div className="container mx-auto w-3/4 pt-32 min-h-screen">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
