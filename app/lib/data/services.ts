import { fetchDropdownData } from '@/utils/fetchDropdownData';

export interface Service {
  name: string;
  slug: string;
}

export async function getServices(): Promise<Service[]> {
  const { services } = await fetchDropdownData();
  
  // Handle empty services array to prevent build errors
  if (!services || services.length === 0) {
    console.warn('No services found, returning fallback data');
    return [
      { name: 'Plumbing', slug: 'plumbing' },
      { name: 'Electrician', slug: 'electrician' },
      { name: 'Home Cleaning', slug: 'home-cleaning' },
      { name: 'HVAC', slug: 'hvac' }
    ];
  }
  
  return services.map(service => ({
    name: service.name,
    slug: service.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }));
}
