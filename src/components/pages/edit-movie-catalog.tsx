import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Movie } from '@/interfaces/movie-catalog.interface';
import { API_URL } from '@/components/pages/constants/movie-constants.ts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Movie>({
    defaultValues: {
      title: '',
      description: '',
      ageLimit: 16,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (movie: Movie) => updateMovie(id!, movie),
    onSuccess: () => {
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['movie', id] });
      }
    },
    onError: (error: Error) => {
      console.error('Error updating movie:', error);
    },
  });

  const onSubmit = async (data: Movie) => {
    try {
      await mutateAsync(data);
      navigate('/'); // Move navigation here for better control
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  React.useEffect(() => {
    if (movie) {
      setValue('title', movie.title);
      setValue('description', movie.description);
      setValue('ageLimit', movie.ageLimit);
    }
  }, [movie, setValue]);

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 border rounded"
          >
            <div className="mb-4">
              <label className="block mb-2">Title:</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="p-2 border rounded w-full"
                required
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Description:</label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                })}
                className="p-2 border rounded w-full"
                required
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Age limit:</label>
              <input
                type="number"
                {...register('ageLimit', {
                  required: 'Age limit is required',
                  min: 1,
                })}
                className="p-2 border rounded w-full"
                required
              />
              {errors.ageLimit && (
                <p className="text-red-500">{errors.ageLimit.message}</p>
              )}
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
