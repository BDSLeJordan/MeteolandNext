"use client";
import type {WeatherProps } from "@@/types/weather";
import WeatherSVG from "../WeatherSVG";
export default function CityInfo({ cityName, weather }: WeatherProps) {
  if(!cityName && !weather) return null;
  const descText = weather.forecast?.[0].description ?? "";
   const description = descText?.charAt(0).toUpperCase() + descText?.slice(1);
  return (
    <div className="flex justify-between">
      {/*<!-- Ville + température + description météo -->*/}
      <div>
        <p className=" text-textColor text-[2.5rem] font-bold m-0 tablet:text-6xl tablet:leading-11.25">{cityName}</p>
        <p className="text-textColor text-[3rem] font-bold mt-8 mb-8 tablet:text-7xl">
          {Math.round(weather?.forecast?.[0].temp as number)}
          <span className="text-[2.5rem] tablet:text-6xl">°C</span>
        </p>
        <p className="text-textColor text-2xl font-normal tablet:text-[2.625rem] tablet:leading-10">{description}</p>
      </div>
      {/*<!-- Emplacement pour l’icône météo SVG -->*/}
      <WeatherSVG iconCode={weather?.forecast?.[0].icone as string} section={1}/>
    </div>
  );
}
