export interface OpenMeteoCurrent {
  time: string;
  uv_index: number;
  temperature_2m: number;
  weather_code: number;
}

export interface OpenMeteoHourly {
  time: string[];
  uv_index: number[];
  temperature_2m: number[];
  weather_code: number[];
}

export interface OpenMeteoResponse {
  current: OpenMeteoCurrent;
  hourly: OpenMeteoHourly;
}

export interface HourlyForecastEntry {
  time: string;
  uv: number;
  temp: number;
  weatherCode: number;
}