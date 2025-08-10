export type City = {
  id: string;
  name: string;
  country: string;
};

export type ServiceType = {
  id: string;
  name: string;
};

export type Location = {
  formatted_location: string;
  place_id?: string;
  lat?: number;
  lng?: number;
};

export type CityServiceCombo = {
  city: string;
  service: string;
};

export type FormState = {
  name: string;
  phoneNumber: string;
  address: string;
  description?: string;
  selectedCity: string;
  selectedService: string;
  location?: Location;
};
