export interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface UserData {
  username?: string;
  lastname?: string;
  firstname?: string;
  birthday_date: string;
  email?: string;
  number_phone: string;
  location: string;
}

export interface SessionData {
  isAuthenticated?: boolean;
  session: boolean;
  user?: UserData;
}

export interface WeatherObject {
  dt_txt: string;
  weather: Array<{
    description:string;
    icon:string;
  }>;
  main:{
    temp:number;
  };
  rain?:{
    "3h"?:number;
  };
  wind:{
    speed:number;
  }
}

export interface CityObject{
  codesPostaux:Array<string>;
  nom:string;
}