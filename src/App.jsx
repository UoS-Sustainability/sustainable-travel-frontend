import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Ticketing from './pages/Ticketing';
import Zones from './pages/Zones';
import TravelMap from './pages/TravelMap';
import Sustainability from './pages/Sustainability';

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ticketing" element={<Ticketing />} />
          <Route path="/zones" element={<Zones />} />
          <Route path="/map" element={<TravelMap />} />
          <Route path="/sustainability" element={<Sustainability />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
