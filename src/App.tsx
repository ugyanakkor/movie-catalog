import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EditMoviePage from '@/components/pages/edit-movie-catalog';
import MovieCatalogPage from '@/components/pages/movie-catalog.tsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieCatalogPage />} />
        <Route path="/edit/:id" element={<EditMoviePage />} />
      </Routes>
    </Router>
  );
};

export default App;
