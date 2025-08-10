// 🚧 Hidden for MVP - Advanced lead routing system
// This file contains advanced provider matching logic that requires additional
// database models (ProviderPlan, provider relations, etc.) not in the current MVP schema.

import prisma from '@/lib/db';
import { ServiceRequest, Provider, Prisma } from '@prisma/client';

// MVP: ProviderPlan enum not available in current schema
enum ProviderPlan {
  FREE = 'FREE',
  PAY_PER_LEAD = 'PAY_PER_LEAD', 
  SUBSCRIPTION = 'SUBSCRIPTION'
}

// MVP: Simplified provider type since relations don't exist in current schema
type ProviderWithDetails = Provider & {
  plan?: string;
  businessName?: string;
  avgRating?: number;
  totalReviews?: number;
  pricePerLead?: number;
  subscriptionFee?: number;
  apiEndpoint?: string;
  phoneNumber?: string;
  email?: string;
};


/**
 * MVP: Simplified provider matching - finds provider by city and service
 */
async function findBestProviderForLead(lead: ServiceRequest): Promise<ProviderWithDetails | null> {
  console.log(`MVP: Searching for provider for lead ${lead.id} in city ${lead.city} for service ${lead.service}`);
  
  // MVP: Simple matching by city and service (string matching)
  const provider = await prisma.provider.findFirst({
    where: {
      city: lead.city,
      service: lead.service,
    },
    orderBy: {
      createdAt: 'desc', // Latest provider first
    },
  });

  if (provider) {
    console.log(`Found provider ${provider.id} (${provider.name}) for lead ${lead.id}`);
  } else {
    console.log(`No matching provider found for lead ${lead.id}`);
  }
  
  return provider as ProviderWithDetails;
}

/**
 * MVP: Simplified delivery status - always deliver for MVP
 */
function determineLeadDeliveryStatus(provider: ProviderWithDetails): { shouldDeliver: boolean; paidStatus: boolean } {
  console.log(`MVP: All leads delivered for provider ${provider.id} (${provider.name})`);
  return { 
    shouldDeliver: true, 
    paidStatus: true // MVP: All leads are free
  };
}

/**
 * MVP: Updates service request with provider ID
 */
async function updateLeadWithProvider(leadId: string, providerId: number, paidStatus: boolean): Promise<void> {
  console.log(`MVP: Updating lead ${leadId} with provider ${providerId}`);
  try {
    await prisma.serviceRequest.update({
      where: { id: leadId },
      data: { 
        providerId,
        status: 'ASSIGNED'
      },
    });
    console.log(`Lead ${leadId} successfully updated in database.`);
  } catch (error) {
    console.error(`DATABASE ERROR: Failed to update lead ${leadId}:`, error);
    throw error;
  }
}


/**
 * MVP: Simplified notification logging
 */
async function notifyProvider(provider: ProviderWithDetails, lead: ServiceRequest): Promise<void> {
  console.log(`MVP: Notifying provider ${provider.name} about lead ${lead.id}`);
  try {
    sendWhatsApp(provider, lead);
    sendEmail(provider, lead);
    console.log(`MVP: Notification attempts finished for lead ${lead.id}`);
  } catch (error) {
    console.error(`NOTIFICATION ERROR for lead ${lead.id}:`, error);
  }
}


// --- Existing Notification Stubs (Minor improvements) ---

/**
 * MVP: WhatsApp notification stub
 */
function sendWhatsApp(provider: ProviderWithDetails, lead: ServiceRequest): void {
  if (provider.whatsapp) {
    console.log(`WhatsApp: Sending lead ${lead.id} to ${provider.name} at ${provider.whatsapp}`);
  } else {
    console.log(`WhatsApp: Skipped for provider ${provider.name} (no WhatsApp number).`);
  }
}

/**
 * MVP: Email notification stub  
 */
function sendEmail(provider: ProviderWithDetails, lead: ServiceRequest): void {
  if (provider.contact) {
    console.log(`Email: Sending lead ${lead.id} to ${provider.name} at ${provider.contact}`);
  } else {
    console.log(`Email: Skipped for provider ${provider.name} (no email address).`);
  }
}

/**
 * MVP: API notification stub (not used in MVP)
 */
function sendToAPI(provider: ProviderWithDetails, lead: ServiceRequest): void {
  console.log(`API: Skipped for provider ${provider.name} (MVP - no API endpoints).`);
}


// --- Refactored Main Orchestration Function ---

/**
 * Routes a lead to the appropriate provider.
 * This function orchestrates finding the provider, handling monetization,
 * updating the lead record, and notifying the provider.
 * @param lead The lead/service request to route.
 */
export async function routeLead(lead: ServiceRequest): Promise<void> {
  console.log(`Processing lead routing for request ID: ${lead.id}`);
  try {
    // 1. Find the best provider for the lead's criteria
    const provider = await findBestProviderForLead(lead);
    if (!provider) {
      // Logging handled within findBestProviderForLead
      // Optionally, update lead status to 'NO_PROVIDER_FOUND'
      // await prisma.serviceRequest.update({ where: { id: lead.id }, data: { status: 'NO_PROVIDER_FOUND' } });
      return;
    }

    // 2. Determine delivery status and initial paid status based on provider's plan
    const { shouldDeliver, paidStatus } = determineLeadDeliveryStatus(provider);

    // 3. Update the lead record with the assigned provider
    await updateLeadWithProvider(lead.id, provider.id, paidStatus);

    // 4. If the lead should be delivered, notify the provider
    if (shouldDeliver) {
      await notifyProvider(provider, lead);
      console.log(`Lead ${lead.id} delivery process completed for provider ${provider.businessName}. Paid status: ${paidStatus ? 'Paid' : 'Unpaid'}`);
    } else {
      console.log(`Lead ${lead.id} matched to provider ${provider.businessName} but NOT delivered due to payment/plan requirements.`);
      // Optionally, update lead status to 'PENDING_PAYMENT' or similar
      // await prisma.serviceRequest.update({ where: { id: lead.id }, data: { status: 'PENDING_PAYMENT' } });
    }

    console.log(`Successfully processed routing for lead ID: ${lead.id}`);

  } catch (error) {
    console.error(`CRITICAL ROUTING ERROR for lead ${lead.id}:`, error instanceof Error ? `${error.name}: ${error.message}` : error);
    // MVP: Update lead status to cancelled on error
    try {
      await prisma.serviceRequest.update({ 
        where: { id: lead.id }, 
        data: { status: 'CANCELLED' } 
      });
    } catch (updateError) {
      console.error(`Failed to update lead ${lead.id} status after routing error:`, updateError);
    }
  }
}
