import { prisma } from '@/lib/db';
import { Provider } from '@prisma/client';

/**
 * Find the best provider for a given service in a specific city
 * 
 * This function searches for providers that:
 * 1. Are located in the specified city
 * 2. Offer the requested service type
 * 
 * Providers are ranked by:
 * 1. Highest average review rating (avgRating)
 * 2. Most reviews (totalReviews)
 * 
 * @param serviceTypeId - The ID of the requested service type
 * @param cityId - The ID of the city where service is needed
 * @returns The best matched provider or null if no matches found
 */
export async function findBestProvider(serviceTypeId: string, cityId: string): Promise<Provider | null> {
  // Search for providers in the specified city that offer the requested service
  const provider = await prisma.provider.findFirst({
    where: {
      // Must be in the requested city
      cityId,
      // Must offer the requested service
      serviceTypes: {
        some: {
          serviceTypeId,
        },
      },
    },
    // Order by rating and number of reviews (descending)
    orderBy: [
      { avgRating: 'desc' },
      { totalReviews: 'desc' },
    ],
    // Only take the top result
    take: 1,
  });

  // Return the provider or null if none found
  return provider;
}
