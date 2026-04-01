// In LocationService.ts
export interface Country {
  id?: string | number;
  name?: string; // Add the '?' here to allow undefined
}

export interface Region {
  id?: string | number;
  state: string;
  city: string;
  zone: string;
  country?: Country; 
  countryID?: string | number;
}