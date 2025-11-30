"use client";
import type { WeatherProps, DaysMap } from "@@/types/weather";
import WeatherSVG from "../WeatherSVG";
import { getWeekDay } from "@@/utils/csrUtils/dateUtils";
export default function Forecast5d({ weather }: WeatherProps) {
  const forecast = weather?.forecast;
  const daysMap: DaysMap = {};
  for (const item of forecast!) {
    const date = new Date(item.date + "Z");
    const dayKey = date.toISOString().split("T")[0];
    if (!daysMap[dayKey]) daysMap[dayKey] = [];
    daysMap[dayKey].push(item);
  }
  const dayKeys = Object.keys(daysMap).slice(0, 5);
  // console.log("Forecast5d: ",weather)
  return (
    <>
      <div>
        <p className="text-textColor text-2xl font-bold mt-6 mb-6 tablet:text-[2rem]">Prévisions sur 5 jours</p>
        {/*<!-- Injection dynamique des différentes jours -->*/}
        <div className=" flex flex-col gap-3.75 tablet:gap-7.5 lg:gap-11">
          {dayKeys.map((key) => {
            const dayData = daysMap[key];
            const temps = dayData
              .map((i) => i.temp)
              .filter(Boolean) as number[];
            const min = Math.min(...temps);
            const max = Math.max(...temps);

            const icones = dayData.reduce((acc, i) => {
              if (i.icone) {
                acc[i.icone] = (acc[i.icone] || 0) + 1;
              }
              return acc;
            }, {} as { [key: string]: number });
            const icone = Object.entries(icones).sort(
              (a, b) => b[1] - a[1]
            )[0]?.[0];
            const dayName = getWeekDay(key);
            return (
              <div key={key} className="flex h-11 justify-between items-center lg:h-[3.9rem]">
                <p className="text-textColor text-2xl font-medium tablet:text-[2rem] ">{dayName}</p>
                <div className="flex items-center gap-15">
                  <WeatherSVG iconCode={icone} section={3} />
                  <p className=" text-textColor text-2xl font-bold w-21.5 h-7.5 tablet:w-27 tablet:text-[2rem] lg:w-41.5 lg:text-[2.5rem]">
                    {min !== null && max !== null
                      ? `${Math.round(min)} - ${Math.round(max)}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
