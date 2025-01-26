import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Movie } from '@/interfaces/movie-catalog.interface';
import { API_URL } from '@/components/pages/constants/movie-constants.ts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchMovie = async (id: string): Promise<Movie> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const updateMovie = async (id: string, movie: Movie): Promise<Movie> => {
  const response = await axios.put(`${API_URL}/${id}`, movie, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const EditMoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery<Movie, Error>({
    queryKey: ['movie', id],
    queryFn: () => fetchMovie(id!),
    enabled: !!id,
  });

  const updateMovieMutation = useMutation({
    mutationFn: async (movie: Movie) => updateMovie(id!, movie),
    onSuccess: () => {
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['movie', id] });
      }
      navigate('/');
    },
    onError: (error: Error) => {
      console.error('Error updating movie:', error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!movie) return;
    updateMovieMutation.mutate(movie);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (movie) {
      queryClient.setQueryData(['movie', id], {
        ...movie,
        title: e.target.value,
      });
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (movie) {
      queryClient.setQueryData(['movie', id], {
        ...movie,
        description: e.target.value,
      });
    }
  };

  const handleAgeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (movie) {
      const ageLimit = +e.target.value;
      queryClient.setQueryData(['movie', id], {
        ...movie,
        ageLimit,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

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
                onChange={handleTitleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Description:</label>
              <textarea
                value={movie.description}
                onChange={handleDescriptionChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Age limit:</label>
              <input
                type="number"
                value={movie.ageLimit}
                onChange={handleAgeLimitChange}
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
