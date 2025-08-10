export interface City {
  id: string;
  name: string;
  country: string;
}

export interface ServiceType {
  id: string;
  name: string;
}

export interface DropdownData {
  cities: City[];
  services: ServiceType[];
}

export async function fetchDropdownData(): Promise<DropdownData> {
  try {
    // For static site generation, use a more direct approach instead of fetch
    // First, check if we're in a server context or browser context
    if (typeof window === 'undefined') {
      // Server-side rendering or static site generation
      // Use direct database access via prisma during build time
      const prisma = require('@/lib/db').default;
      
      // Fetch cities and service types directly from the database
      const [cities, services] = await Promise.all([
        prisma.city.findMany({ orderBy: { name: 'asc' }}),
        prisma.serviceType.findMany({ orderBy: { name: 'asc' }})
      ]);
      
      return { cities, services };
    } else {
      // Client-side rendering - use fetch API
      const [citiesResponse, servicesResponse] = await Promise.all([
        fetch('/api/cities'),
        fetch('/api/service-types')
      ]);

      if (!citiesResponse.ok || !servicesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const cities: City[] = await citiesResponse.json();
      const services: ServiceType[] = await servicesResponse.json();

      return { cities, services };
    }
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    // Return empty arrays instead of throwing an error to prevent build failures
    return { cities: [], services: [] };
  }
}
