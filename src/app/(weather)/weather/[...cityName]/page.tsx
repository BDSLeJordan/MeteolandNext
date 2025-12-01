"use client";
import { useParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import CityInfo from "@/components/CityInfo";
import Forecast48h from "@/components/Forecast48h";
import Forecast5d from "@/components/Forecast5d";
import { useEffect, useState } from "react";
import { weather } from "@@/utils/api";
import { WeatherApiData } from "@@/types/weather";
export default function WeatherPage() {
  const params = useParams();
  const cityName = params?.cityName
    ? Array.isArray(params.cityName)
      ? decodeURIComponent(params.cityName.join("/"))
      : decodeURIComponent(params.cityName)
    : "Ville inconnue";

  const [cityN, setCityN] = useState<string | undefined>(undefined);
  const [weatherData, setWeather] = useState<WeatherApiData>();
  useEffect(() => {
    (async () => {
      const city = await weather.getCityClient(cityName);
      const weatherFetch = await weather.getForecastClient(
        city.data?.cityData?.[0].city as string
      );
      setCityN(city.data?.cityData?.[0].city as string);
      setWeather(weatherFetch.data);
    })();
  }, [cityName]);
  return (
    <>
      <section className=" flex flex-col justify-center pt-0 pb-[2.2rem] pl-0 gap-[2.12rem]">
        <SearchBar />
      </section>
      <section className="lg:flex lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-12 lg:flex-1 lg:min-w-0">
          {weatherData && cityN ? (
            <>
              <CityInfo cityName={cityN} weather={weatherData} />
              <Forecast48h weather={weatherData} />
            </>
          ) : (
            <>
              <div className="text-textColor">Chargement...</div>
            </>
          )}
        </div>
        <div className="lg:flex-1 lg:min-w-0">
          {weatherData ? (
            <>
              <Forecast5d weather={weatherData} />
            </>
          ) : (
            <>
              <div></div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
