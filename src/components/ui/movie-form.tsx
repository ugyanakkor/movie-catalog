import React from 'react';
import { useForm } from 'react-hook-form';
import { MovieFormProps } from '@/interfaces/movie-catalog.interface.ts';
import { Button } from '@/components/ui/button.tsx';

type FormData = {
  title: string;
  description: string;
  ageLimit: number;
};

export const MovieForm: React.FC<MovieFormProps> = ({ onSubmit }) => {
  const defaultAgeLimit = 16;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      ageLimit: defaultAgeLimit,
    },
  });

  const onSubmitForm = (data: FormData): void => {
    onSubmit({ ...data, ageLimit: data.ageLimit ?? defaultAgeLimit });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="p-4 border rounded">
      <div className="mb-4">
        <label className="block mb-2">Title:</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="p-2 border rounded w-full"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Description:</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          className="p-2 border rounded w-full"
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
            min: { value: 1, message: 'Age limit must be at least 1' },
          })}
          className="p-2 border rounded w-full"
        />
        {errors.ageLimit && (
          <p className="text-red-500">{errors.ageLimit.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
};
