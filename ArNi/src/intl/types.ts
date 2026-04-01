export interface MessageKeyValue {
    [key: string]: Record<string,string>;
}

export interface Region {
  id: number;
  creationTime: string;
  updateTime: string;
  country: Country;
  state: string;
  city: string;
  zone: string;
  countryID: number;
}

export interface Country {
  id: number;
  creationTime: string;
  updateTime: string;
  name: string;
  state: string;
  city: string;
  zone: string;
  countryID: number;
}
