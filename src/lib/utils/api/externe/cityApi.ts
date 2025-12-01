import { CityObject } from "@@/types/api";

export default async function getCity(city:string) {
  // Vérifie si l'entrée est un code postal (5 chiffres)
  const isPostcode = /^\d{5}$/.test(city);

  // Vérifie si l'entrée est un nom de ville (lettres, accents, tirets, apostrophes, espaces)
  const isCityName = /^[a-zA-ZÀ-ÿ' -]{1,}$/.test(city.trim());

  // Si ni un code postal ni un nom de ville valide, on lance une erreur
  if (!isPostcode && !isCityName) {
    throw new Error("Format de ville invalide");
  }

  // URL de base de l’API Geo du gouvernement français
  const baseUrl = "https://geo.api.gouv.fr/communes?";

  // Génère les bons paramètres en fonction du type d’entrée
  const queryParam = isPostcode
    ? `codePostal=${city}` // Si c’est un code postal, on cherche par codePostal
    : `nom=${encodeURIComponent(city)}`; // Sinon on encode et cherche par nom

  try {
    const response = await fetch(`${baseUrl}${queryParam}&fields=code,nom,centre,codesPostaux`);
    if (!response.ok) throw new Error("Erreur ville");

    const data = await response.json();


    // On filtre et transforme les résultats
    const cityData = data
      .filter((item:CityObject) => {
        // Si c’est un code postal, on vérifie qu’il est bien dans la liste des codes de la commune
        if (isPostcode) {
          return item.codesPostaux.includes(city);
        } else {
          // Sinon, on fait une égalité stricte sur le nom (insensible à la casse)
          return item.nom.toLowerCase() === city.trim().toLowerCase();
        }
      })
      .slice(0, 5) // On limite à 5 résultats max
      .map((item:CityObject) => ({
        city: item.nom,
        postcode: item.codesPostaux[0]
      }));
    // On retourne le tableau d’objets contenant les villes filtrées
    return cityData;
  } catch (err) {
    console.log("Erreur dans cityApi.js :", err);
    throw err;
  }
}