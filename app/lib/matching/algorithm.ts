import { Provider, ServiceRequest } from "@/types";

/**
 * AI Matching Algorithm
 * 
 * This algorithm scores and ranks service providers based on multiple factors:
 * - Reviews and ratings
 * - Reliability metrics
 * - Pricing
 * - Location/proximity
 * - Availability
 * - Service relevance
 */

// Weighting factors for scoring
const SCORE_WEIGHTS = {
  // Core factors (70%)
  reviewScore: 0.25,       // 25%
  reliabilityScore: 0.25,  // 25%
  pricingScore: 0.20,      // 20%
  
  // Secondary factors (30%)
  proximityScore: 0.10,    // 10%
  availabilityScore: 0.10, // 10%
  relevanceScore: 0.10,    // 10%
};

/**
 * Main matching function - finds the best provider for a service request
 */
export async function findBestProvider(
  request: ServiceRequest,
  providers: Provider[]
): Promise<Provider | null> {
  // 1. Filter providers by basic criteria
  const eligibleProviders = filterEligibleProviders(request, providers);
  
  if (eligibleProviders.length === 0) {
    return null;
  }
  
  // 2. Score each eligible provider
  const scoredProviders = scoreProviders(request, eligibleProviders);
  
  // 3. Sort by total score (descending)
  scoredProviders.sort((a, b) => b.matchScore! - a.matchScore!);
  
  // 4. Return the highest-scoring provider
  return scoredProviders[0];
}

/**
 * Filter providers by basic eligibility criteria
 */
function filterEligibleProviders(
  request: ServiceRequest,
  providers: Provider[]
): Provider[] {
  return providers.filter(provider => {
    // Service category match
    const hasService = provider.serviceCategories.includes(request.serviceCategory);
    if (!hasService) return false;
    
    // City/location match
    const servesCity = provider.serviceAreas.some(area => 
      area.city.toLowerCase() === request.city.toLowerCase()
    );
    if (!servesCity) return false;
    
    // If district is specified, check if provider serves that district
    if (request.district) {
      const servesDistrict = provider.serviceAreas.some(area => 
        area.city.toLowerCase() === request.city.toLowerCase() &&
        area.districts.some(d => d.toLowerCase() === request.district!.toLowerCase())
      );
      if (!servesDistrict) return false;
    }
    
    // If urgency is emergency, check if provider offers emergency service
    if (request.urgency === 'emergency' && !provider.availability.emergencyService) {
      return false;
    }
    
    return true;
  });
}

/**
 * Score providers based on multiple factors
 */
function scoreProviders(
  request: ServiceRequest,
  providers: Provider[]
): Provider[] {
  return providers.map(provider => {
    // Calculate individual scores
    const reviewScore = calculateReviewScore(provider);
    const reliabilityScore = calculateReliabilityScore(provider);
    const pricingScore = calculatePricingScore(provider, request.serviceCategory);
    const proximityScore = calculateProximityScore(provider, request.city, request.district);
    const availabilityScore = calculateAvailabilityScore(provider, request.urgency);
    const relevanceScore = calculateRelevanceScore(provider, request.serviceType);
    
    // Calculate total weighted score
    const totalScore = 
      (reviewScore * SCORE_WEIGHTS.reviewScore) +
      (reliabilityScore * SCORE_WEIGHTS.reliabilityScore) +
      (pricingScore * SCORE_WEIGHTS.pricingScore) +
      (proximityScore * SCORE_WEIGHTS.proximityScore) +
      (availabilityScore * SCORE_WEIGHTS.availabilityScore) +
      (relevanceScore * SCORE_WEIGHTS.relevanceScore);
    
    // Create a new provider object with the score (to avoid mutating original)
    return {
      ...provider,
      matchScore: Math.round(totalScore),
    };
  });
}

/**
 * Calculate review score (0-100) based on rating and review count
 */
function calculateReviewScore(provider: Provider): number {
  const { overallRating, reviewCount } = provider;
  
  // Base score from rating (0-100)
  const ratingScore = (overallRating / 5) * 100;
  
  // Bonus for high review count (up to 15 points)
  let reviewCountBonus = 0;
  if (reviewCount >= 100) reviewCountBonus = 15;
  else if (reviewCount >= 50) reviewCountBonus = 10;
  else if (reviewCount >= 20) reviewCountBonus = 5;
  else if (reviewCount >= 10) reviewCountBonus = 2;
  
  // Combine scores (rating is 60% of weight, review count is 40%)
  const combinedScore = (ratingScore * 0.6) + ((reviewCountBonus / 15) * 100 * 0.4);
  
  // Cap at 100
  return Math.min(combinedScore, 100);
}

/**
 * Calculate reliability score (0-100) based on performance metrics
 */
function calculateReliabilityScore(provider: Provider): number {
  const { metrics } = provider;
  
  // Completion rate component (50% weight)
  const completionComponent = metrics.completionRate;
  
  // Cancellation rate component (30% weight, heavily penalized)
  // 0% cancellation = 100 points, 25% cancellation = 0 points
  const cancellationComponent = Math.max(0, 100 - (metrics.cancellationRate * 400));
  
  // Response time component (20% weight)
  // <30 min = 100 points, 30-60 min = 75 points, 1-2 hrs = 50 points, >2 hrs = 25 points
  let responseTimeComponent = 25;
  if (metrics.avgResponseTime < 30) responseTimeComponent = 100;
  else if (metrics.avgResponseTime < 60) responseTimeComponent = 75;
  else if (metrics.avgResponseTime < 120) responseTimeComponent = 50;
  
  // Calculate weighted score
  const reliabilityScore = 
    (completionComponent * 0.5) +
    (cancellationComponent * 0.3) +
    (responseTimeComponent * 0.2);
  
  return reliabilityScore;
}

/**
 * Calculate pricing score (0-100)
 * This uses a bell curve that rewards providers who are slightly below average market price
 */
function calculatePricingScore(provider: Provider, serviceCategory: string): number {
  // In a real implementation, this would compare to actual market rates
  // For this example, we'll use the pricing tier as a proxy
  
  // Pricing tier is 1-5 where 3 is average
  // We want to reward providers who are slightly below average (tier 2)
  // Score: tier 1 = 80, tier 2 = 100, tier 3 = 90, tier 4 = 70, tier 5 = 50
  switch (provider.pricingTier) {
    case 1: return 80;  // Budget - good value but might lack quality
    case 2: return 100; // Value - best price-to-quality ratio
    case 3: return 90;  // Average price
    case 4: return 70;  // Premium
    case 5: return 50;  // Luxury
    default: return 0;
  }
}

/**
 * Calculate proximity score (0-100) based on location
 */
function calculateProximityScore(
  provider: Provider,
  city: string,
  district?: string
): number {
  // Find the matching service area
  const serviceArea = provider.serviceAreas.find(
    area => area.city.toLowerCase() === city.toLowerCase()
  );
  
  if (!serviceArea) return 0;
  
  // If provider explicitly serves the district, give max points
  if (district && serviceArea.districts.some(d => d.toLowerCase() === district.toLowerCase())) {
    return 100;
  }
  
  // Otherwise, score based on service radius
  // Closer to city center = higher score
  // This is a simplified version - in a real implementation, we'd use actual distances
  return Math.min(100, (100 / serviceArea.radius) * 10);
}

/**
 * Calculate availability score (0-100) based on provider availability
 */
function calculateAvailabilityScore(provider: Provider, urgency: string): number {
  // If emergency request and provider offers emergency service, high score
  if (urgency === 'emergency' && provider.availability.emergencyService) {
    return 100;
  }
  
  // Calculate days until next available date
  const now = new Date();
  const daysUntilAvailable = Math.max(0, Math.floor(
    (provider.availability.nextAvailableDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  ));
  
  // Score based on wait time
  if (daysUntilAvailable === 0) return 100; // Available today
  if (daysUntilAvailable === 1) return 90;  // Available tomorrow
  if (daysUntilAvailable <= 3) return 80;   // Available within 3 days
  if (daysUntilAvailable <= 7) return 60;   // Available within a week
  if (daysUntilAvailable <= 14) return 40;  // Available within two weeks
  return 20; // Available after two weeks
}

/**
 * Calculate relevance score (0-100) based on service specialization
 */
function calculateRelevanceScore(provider: Provider, serviceType: string): number {
  // Check if provider explicitly offers this service type
  const exactMatch = provider.services.some(
    s => s.toLowerCase() === serviceType.toLowerCase()
  );
  
  if (exactMatch) return 100;
  
  // Otherwise, give partial score for matching the category
  return 70;
}
