import SearchBar from "@/components/SearchBar";
import CityInfo from "@/components/CityInfo";
import Forecast48h from "@/components/Forecast48h";
import Forecast5d from "@/components/Forecast5d";
import { getCity, getForecast } from "@@/utils/api/externe";
export default async function Home() {
  const cityInfos = await getCity("Beauvais");
  const cityName = cityInfos[0].city;
  const meteo = await getForecast(cityName);
  return (
    <>
      <section className=" flex flex-col justify-center pt-0 pb-[2.2rem] pl-0 gap-[2.12rem]">
        <SearchBar />
      </section>
      <section className="lg:flex lg:justify-between lg:gap-16">
        <div className="flex flex-col gap-12 lg:flex-1 lg:min-w-0">
          <CityInfo cityName={cityName} weather={meteo}/>
          <Forecast48h weather={meteo}/>
        </div>
        <div className="lg:flex-1 lg:min-w-0">
          <Forecast5d weather={meteo}/>
        </div>
      </section>
    </>
  );
}
