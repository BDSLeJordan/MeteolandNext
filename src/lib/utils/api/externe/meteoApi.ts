import { WeatherObject } from "@@/types/api";
export default async function getForecast(city:string) {
  try {
    // Requête vers l’API OpenWeather pour récupérer les prévisions 5 jours toutes les 3h
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},fr&units=metric&lang=fr&appid=${process.env.METEO_API_KEY}`
    );

    if (!response.ok) throw new Error("Erreur météo");

    const data = await response.json();

    // On extrait et transforme chaque prévision du tableau `list` fourni par OpenWeather
    const forecast = data.list.map((item:WeatherObject) => ({
      date: item.dt_txt,
      description: item.weather[0].description,
      icone: item.weather[0].icon,
      temp: item.main.temp.toFixed(1),
      rain_mm: item.rain?.["3h"] || 0,
      wind_kmh: (item.wind.speed * 3.6).toFixed(1),
    }));

    // On récupère aussi le nom de la ville pour l’afficher côté front
    const cityData = {
      name: data.city.name
    };

    // On retourne un objet contenant les prévisions et les infos sur la ville
    return { forecast, cityData };
  } catch (err) {
    console.log("Erreur dans meteoApi.js :", err);
    throw err;
  }
}
