import { fetchDropdownData } from '@/utils/fetchDropdownData';

export interface City {
  name: string;
  slug: string;
}

export async function getCities(): Promise<City[]> {
  const { cities } = await fetchDropdownData();
  
  // Handle empty cities array to prevent build errors
  if (!cities || cities.length === 0) {
    console.warn('No cities found, returning fallback data');
    return [
      { name: 'Amsterdam', slug: 'amsterdam' },
      { name: 'Berlin', slug: 'berlin' },
      { name: 'London', slug: 'london' }
    ];
  }
  
  return cities.map(city => ({
    name: city.name, // Access the name property of the city object
    slug: city.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }));
}