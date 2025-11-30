"use client";
import type { WeatherProps } from "@@/types/weather";
import { date } from "@@/utils/csrUtils";
import { useCarouselDrag } from "@/hooks/useCarouselDrag";
import WeatherSVG from "../WeatherSVG";
export default function Carousel({ weather }: WeatherProps) {
  const slice = weather?.forecast?.slice(0, 16);
  const { containerRef, wrapperRef } = useCarouselDrag();

  return (
    <div ref={containerRef} className="overflow-hidden relative w-full">
      <div
        ref={wrapperRef}
        className="flex transition-transform duration-300 ease-out cursor-grab gap-[0.44rem]"
      >
        {slice?.map((forecast) => (
          <div
            key={forecast.date}
            className="shrink-0 basis-[13.5%] snap-start bg-background-grey pt-1.5 pr-4.25 pb-1.75 pl-3.75
            rounded-xl flex flex-col items-center gap-3.5  tablet:px-4.25 tablet:py-3 tablet:gap-8 tablet:basis-[17.5%]"
          >
            <p className="text-textColor text-sm font-medium m-0 tablet:text-[1.75rem]">
              {date.toLocalHour(forecast.date as string)}
            </p>
            <WeatherSVG iconCode={forecast.icone as string} section={2} />
            <p className="text-textColor text-sm font-medium m-0 tablet:text-[1.75rem]">
              {Math.round(forecast.temp as number)}
              <span>°C</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
