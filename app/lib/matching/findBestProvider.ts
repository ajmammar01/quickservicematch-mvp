// 🚧 Hidden for MVP - Advanced provider matching
// This file contains provider matching logic that requires additional
// database models and relations not in the current MVP schema.

import { prisma } from '@/lib/db';
import { Provider } from '@prisma/client';

/**
 * MVP: Simplified provider matching by city and service name
 * 
 * @param service - The service name (string)
 * @param city - The city name (string)
 * @returns The best matched provider or null if no matches found
 */
export async function findBestProvider(service: string, city: string): Promise<Provider | null> {
  // MVP: Simple matching by city and service name
  const provider = await prisma.provider.findFirst({
    where: {
      city: city,
      service: service,
    },
    // Order by creation date (newest first)
    orderBy: {
      createdAt: 'desc',
    },
  });

  return provider;
}
