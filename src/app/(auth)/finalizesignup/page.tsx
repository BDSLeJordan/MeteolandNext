"use client";
import { auth } from "@@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FinalizeSignUpPage() {
  const [maxDate, setMaxDate] = useState("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [formData, setFormData] = useState({
    username: "",
    birthday_date: "",
    password: "",
    passwordConfirm: "",
  });
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorUsername, setErrorUsername] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    setMaxDate(`${y}-${m}-${d}`);

    
    // L'access_token est dans le hash (#)
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.substring(1));
    
    const at = hashParams.get("access_token");
    const rt = hashParams.get("refresh_token");
    const em = hashParams.get("email");

    if (at) setAccessToken(at);
    if (rt) setRefreshToken(rt);
    if (em) setEmail(em);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorUsername(null);
    setErrorPassword(null);
    setIsLoading(true);
    setSuccess(false);

    if (formData.password !== formData.passwordConfirm) {
      setErrorPassword("Les mots de passe ne correspondent pas.");
      return;
    }
    const infos = {
      password: formData.password,
      username: formData.username,
      birthday_date: formData.birthday_date,
      email: email,
    };

    try {
        const data = await auth.finalizeSignUp(infos, accessToken, refreshToken);
        console.log("Inscription finalisée:", data);
        setSuccess(true);
        setTimeout(() => {
            router.refresh();
        }, 3000);
    } catch (err: unknown) {
      const errMes = err instanceof Error ? err.message : String(err);
      console.error("Erreur lors de la finalisation de l'inscription. ", err);
      setErrorUsername(errMes || "Une erreur est survenue.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-40 tablet:mb-130 desktop:mb-10 max-[420px]:mb-45">
      <h2 className="text-3xl font-bold text-center text-textColor mb-20 tablet:text-5xl">
        Finalisation de l&apos;inscription
      </h2>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <form
          onSubmit={handleSubmit}
          id="formsignup"
          method="post"
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Nom d&apos;utilisateur
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Pseudo"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date de naissance
            </label>
            <input
              id="date"
              name="birthday_date"
              type="date"
              value={formData.birthday_date}
              onChange={handleChange}
              required
              max={maxDate}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="passwordsignup"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="passwordsignup"
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="passwordsignupConfirm"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="passwordsignupConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="Confirmer le mot de passe"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {errorPassword && (
            <p className="text-sm font-medium text-red-600">{errorPassword}</p>
          )}
          {errorUsername && (
            <p className="text-sm font-medium text-red-600">{errorUsername}</p>
          )}
          {success && (
            <p className="text-sm font-medium text-green-600">
              Inscription finalisée avec succès ! Vous allez être redirigé vers la page profil
            </p>
          )}
          <div>
            <button
              id="signup"
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Redirection en cours...': "S'inscrire" }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
