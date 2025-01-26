import React, { useState } from 'react';
import { MovieFormProps } from '@/interfaces/movie-catalog.interface.ts';
import { Button } from '@/components/ui/button.tsx';

export const MovieForm: React.FC<MovieFormProps> = ({ onSubmit }) => {
  const defaultAgeLimit = 16;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ageLimit, setAgeLimit] = useState<number | null>(defaultAgeLimit);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const movie = { title, description, ageLimit };
    onSubmit({ ...movie, ageLimit: movie.ageLimit ?? 16 });

    setTitle('');
    setDescription('');
    setAgeLimit(defaultAgeLimit);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-4">
        <label className="block mb-2">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Age limit:</label>
        <input
          type="number"
          value={ageLimit ?? ''}
          onChange={(event) => {
            const inputValue = event.target.value;
            setAgeLimit(inputValue === '' ? null : parseInt(inputValue, 10));
          }}
          className="p-2 border rounded w-full"
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button type="submit">{'Add'}</Button>
      </div>
    </form>
  );
};
