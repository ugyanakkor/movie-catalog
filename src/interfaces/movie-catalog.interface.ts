export interface Movie {
  _id?: string;
  title: string;
  description: string;
  ageLimit: number;
}
export interface MovieFormProps {
  onSubmit: (movie: Movie) => void;
  onCancel: () => void;
}
