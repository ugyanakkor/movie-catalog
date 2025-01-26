import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Movie } from '@/interfaces/movie-catalog.interface';
import {API_URL} from "@/components/pages/constants/movie-constants.ts";

export const EditMoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };
    fetchMovie();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!movie) return;

    try {
      await axios.put(`${API_URL}/${id}`, movie, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Movie</h1>
        {movie && (
          <form onSubmit={handleSubmit} className="p-4 border rounded">
            <div className="mb-4">
              <label className="block mb-2">Title:</label>
              <input
                type="text"
                value={movie.title}
                onChange={(e) => setMovie({ ...movie, title: e.target.value })}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Description:</label>
              <textarea
                value={movie.description}
                onChange={(e) =>
                  setMovie({ ...movie, description: e.target.value })
                }
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Age limit:</label>
              <input
                type="number"
                value={movie.ageLimit}
                onChange={(e) =>
                  setMovie({ ...movie, ageLimit: +e.target.value })
                }
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="submit">Save</Button>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditMoviePage;
