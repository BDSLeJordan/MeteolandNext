import { ApiResponse } from "@@/types/api";

import { CityApiData, WeatherApiData } from "@@/types/weather";
async function getCityClient(
  city: string
): Promise<ApiResponse<CityApiData>> {
  try {
    const res = await fetch("/api/city/fetchcity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    });
    const data = await res.json().catch(() => {});

    if (!res.ok) {
      const errorData = data;
      return {
        success: false,
        error:
          errorData.message ||
          "Erreur inconnue lors de la récupération de la ville",
      };
    }

    return {success:true,message:"Ville trouvée",data:data}
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error("Erreur lors de la récupération de la ville: ", error);
    return { success: false, error: errMes };
  }
}

async function getForecastClient(
  city: string
): Promise<ApiResponse<WeatherApiData>> {
  try {
    const res = await fetch("/api/weather/forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    });
    const data = await res.json().catch(() => {});
    if (!res.ok) {
      const errorData = data;
      return {
        success: false,
        error:
          errorData.message ||
          "Erreur inconnue lors de la récupération de la météo",
      };
    }

    return {success:true,message:"Météo trouvée",data:data.weatherData}
  } catch (error: unknown) {
    const errMes = error instanceof Error ? error.message : String(error);
    console.error("Erreur lors de la récupération de la météo: ", error);
    return { success: false, error: errMes };
  }
}

export {getCityClient,getForecastClient}

