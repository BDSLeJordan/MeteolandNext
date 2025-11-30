'use client';

import { useState } from 'react';
import { auth } from '@@/utils/api';
// import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = await auth.signupUser(formData.email);
      if(data.data?.emailConfirmed === false){
        console.log("Inscription réussie:", data)
        setSuccess(true);
      }
      else{
        console.log("Email déjà confirmé:", data)
        setError("Vous possédez déjà un compte avec cet email. Veuillez vous connecter.")
      }
    } catch (err: unknown) {
      const errMes = err instanceof Error? err.message:String(err)
      setError(errMes || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-60 max-[420px]:mb-45">
        <h2 className="text-3xl font-bold text-center text-textColor mb-20 tablet:text-5xl">
          Inscription
        </h2>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          {success && <p className="text-sm font-medium text-green-600">Veuillez vérifier votre boîte mail pour confirmer votre email.</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? 'Inscription en cours...' : "S'inscrire"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          Déjà un compte ?
          <span className="ml-1 font-medium text-indigo-600">
            <a href="/signin">Connectez-vous</a>
          </span>
        </p>
      </div>
    </div>
  );
}