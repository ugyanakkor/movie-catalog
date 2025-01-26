import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Movie } from '@/interfaces/movie-catalog.interface.ts';

const API_URL =
  'https://crudcrud.com/api/9f191d6b2a8449339f3047f858eaca3a/movies';
const App = () => {
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [filter, setFilter] = useState<number>(0);

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(API_URL);
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  // Delete a movie
  const deleteMovie = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMovies(movies.filter((movie) => movie._id !== id));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  // Filter movies by age rating
  const filteredMovies = filter
    ? movies.filter((movie) => movie.ageLimit >= filter)
    : movies;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Movie Catalog</h1>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Add new movie</h2>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Age limit filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={0}>All</option>
            <option value={12}>12+</option>
            <option value={16}>16+</option>
            <option value={18}>18+</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMovies.map((movie) => (
            <Card key={movie._id} className="shadow-lg">
              <CardContent>
                <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                <p className="text-gray-600 mb-2">{movie.description}</p>
                <p className="text-sm text-gray-500">
                  Age limit: {movie.ageLimit}+
                </p>
                <div className="mt-4 flex justify-between">
                  <Button onClick={() => null}>Edit</Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (movie._id) {
                        deleteMovie(movie._id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default App;