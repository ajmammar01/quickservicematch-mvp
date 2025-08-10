// Common types for the service matching platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Preferences
  preferredProviders?: string[];
  blacklistedProviders?: string[];
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  website?: string;
  
  // Services & Location
  services: string[];
  serviceCategories: string[];  // e.g., ['plumbing', 'electrical']
  serviceAreas: ServiceArea[];
  
  // Availability
  availability: ProviderAvailability;
  
  // Pricing
  pricingTier: number;  // 1-5 scale (budget to premium)
  hourlyRate?: number;
  flatRates?: FlatRate[];
  minimumCharge?: number;
  
  // Performance Metrics
  metrics: ProviderMetrics;
  
  // Reviews & Ratings
  overallRating: number;        // 1-5 scale
  reviewCount: number;
  reviewStats: ReviewStats;
  
  // Tags & Badges
  tags: string[];               // e.g., ['licensed', 'insured', 'eco-friendly']
  certifications: string[];     // e.g., ['ISO9001', 'Master Plumber']
  verificationStatus: 'pending' | 'verified' | 'premium';
  
  // Matching Data
  matchScore?: number;           // 0-100 (calculated)
  successfulMatches: number;    // total successful matches
  recentPerformance?: RecentPerformance;
  
  // Business Details
  businessHours: BusinessHours;
  yearsInBusiness: number;
  employeeCount: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastActive: Date;
}

export interface ServiceArea {
  city: string;
  districts: string[];
  radius: number;  // service radius in km
}

export interface ProviderAvailability {
  weekdays: [number, number][]; // e.g., [[9, 17]] for 9am-5pm
  weekends: [number, number][];
  emergencyService: boolean;
  nextAvailableDate: Date;
}

export interface FlatRate {
  serviceName: string;
  price: number;
}

export interface ProviderMetrics {
  avgResponseTime: number;    // minutes
  completionRate: number;     // percentage
  repeatCustomerRate: number; // percentage
  cancellationRate: number;   // percentage
  escalationRate: number;     // percentage of cases requiring manager intervention
  reliabilityScore: number;   // 0-100 (calculated)
}

export interface ReviewStats {
  qualityRating: number;      // 1-5 scale
  reliabilityRating: number;  // 1-5 scale 
  valueRating: number;        // 1-5 scale
  communicationRating: number;// 1-5 scale
}

export interface RecentPerformance {
  last30DaysRating: number;
  last30DaysCompletionRate: number;
}

export interface BusinessHours {
  [day: string]: {
    open: string;
    close: string;
  };
}

export interface ServiceRequest {
  id: string;
  userId: string;
  
  // Request Details
  serviceType: string;
  serviceCategory: string;
  city: string;
  district?: string;
  description: string;
  urgency: 'standard' | 'urgent' | 'emergency';
  preferredDates?: Date[];
  
  // Matching Status
  status: 'pending' | 'matching' | 'matched' | 'completed' | 'cancelled';
  matchedProviderId?: string;
  matchedAt?: Date;
  requestSentAt?: Date;
  
  // Provider Response
  providerResponse?: ProviderResponse;
  
  // Completion Details
  completionDetails?: CompletionDetails;
  
  // User Feedback
  feedback?: Feedback;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderResponse {
  status: 'accepted' | 'declined' | 'no_response';
  responseTime: number; // minutes
  estimatedArrival?: Date;
  estimatedCost?: number;
  message?: string;
}

export interface CompletionDetails {
  completedAt: Date;
  actualCost?: number;
  serviceNotes?: string;
}

export interface Feedback {
  overallRating: number;       // 1-5 scale
  qualityRating: number;       // 1-5 scale
  reliabilityRating: number;   // 1-5 scale
  valueRating: number;         // 1-5 scale
  communicationRating: number; // 1-5 scale
  comments?: string;
  wouldRecommend: boolean;
  submittedAt: Date;
}

// Form types
export interface ServiceRequestFormData {
  service: string;
  city: string;
  name: string;
  email: string;
  message: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
