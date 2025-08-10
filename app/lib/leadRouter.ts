import prisma from '@/lib/db';
import { ServiceRequest, Provider, ProviderPlan, Prisma } from '@prisma/client';

// Type for the provider including relations needed for routing logic
type ProviderWithDetails = Prisma.ProviderGetPayload<{
  include: {
    city: true;
    serviceTypes: {
      include: {
        serviceType: true;
      };
    };
  };
}>;


/**
 * Finds the best matching provider for a given service request based on city, service type, and ranking.
 * @param lead The service request details.
 * @returns The best matching provider with details, or null if none found.
 */
async function findBestProviderForLead(lead: ServiceRequest): Promise<ProviderWithDetails | null> {
  const criteria = { cityId: lead.cityId, serviceTypeId: lead.serviceTypeId };
  console.log(`Searching for provider for lead ${lead.id} with criteria:`, criteria);
  console.log(`Searching for provider for lead ${lead.id} in city ${lead.cityId} for service ${lead.serviceTypeId}`);
  const provider = await prisma.provider.findFirst({
    where: {
      cityId: lead.cityId,
      serviceTypes: {
        some: {
          serviceTypeId: lead.serviceTypeId,
        },
      },
      // Consider adding other criteria like active status if applicable
      // status: 'ACTIVE',
    },
    orderBy: [
      { avgRating: 'desc' }, // Prioritize higher rating
      { totalReviews: 'desc' }, // Then more reviews
      // Add more tie-breaking criteria if necessary (e.g., creation date)
    ],
    include: {
      city: true, // Needed for logging/context potentially
      serviceTypes: { // Needed for confirmation, though filtered in where
        include: {
          serviceType: true,
        },
      },
    },
  });

  if (provider) {
    console.log(`Found provider ${provider.id} (${provider.businessName}) for lead ${lead.id}. Details:`, { plan: provider.plan, phone: provider.phoneNumber, email: provider.email, api: provider.apiEndpoint });
  } else {
    console.log(`No matching provider found for lead ${lead.id}`);
  }
  return provider;
}

/**
 * Determines if a lead should be delivered based on the provider's plan and sets the initial paid status.
 * @param provider The provider assigned to the lead.
 * @returns An object containing `shouldDeliver` (boolean) and `paidStatus` (boolean).
 */
function determineLeadDeliveryStatus(provider: ProviderWithDetails): { shouldDeliver: boolean; paidStatus: boolean } {
  console.log(`Determining delivery status for provider ${provider.id} with plan: ${provider.plan}`);
  let shouldDeliver = true;
  let paidStatus = false; // Default to unpaid for safety

  switch (provider.plan) {
    case ProviderPlan.PAY_PER_LEAD:
      console.log(`Provider ${provider.businessName} is on PAY_PER_LEAD plan (€${provider.pricePerLead ?? 'N/A'} per lead)`);
      // In a real system, this might involve checking provider's credit/balance.
      // For now, we assume the lead should be delivered but marked as unpaid.
      shouldDeliver = true;
      paidStatus = false; // Requires payment processing later
      break;
    case ProviderPlan.SUBSCRIPTION:
      console.log(`Provider ${provider.businessName} is on SUBSCRIPTION plan (€${provider.subscriptionFee ?? 'N/A'}/month)`);
      shouldDeliver = true;
      paidStatus = true; // Covered by subscription
      break;
    case ProviderPlan.FREE:
    default: // Treat unknown plans as FREE for safety
      console.log(`Provider ${provider.businessName} is on FREE plan (or unknown plan treated as FREE)`);
      shouldDeliver = true;
      paidStatus = true; // Free lead
      break;
  }
  console.log(`Delivery status determined: shouldDeliver=${shouldDeliver}, paidStatus=${paidStatus}`);
  return { shouldDeliver, paidStatus };
}

/**
 * Updates the service request record in the database with the assigned provider ID and paid status.
 * @param leadId The ID of the service request to update.
 * @param providerId The ID of the provider assigned.
 * @param paidStatus The calculated paid status of the lead.
 */
async function updateLeadWithProvider(leadId: string, providerId: string, paidStatus: boolean): Promise<void> {
  const updateData = { providerId, paid }; // Using shorthand 'paid' which was likely intended instead of 'paidStatus'
  console.log(`Attempting to update lead ${leadId} with data:`, updateData);
  console.log(`Updating lead ${leadId} with provider ${providerId} and paid status ${paidStatus}`);
  try {
    await prisma.serviceRequest.update({
      where: { id: leadId },
      data: updateData, // Use the prepared data object
    });
    console.log(`Lead ${leadId} successfully updated in database.`);
  } catch (error) {
    console.error(`DATABASE ERROR: Failed to update lead ${leadId}. Data:`, updateData, 'Error:', error);
    // Re-throw the error to be caught by the main routeLead handler
    throw error;
  }
}


/**
 * Sends notifications to the provider via configured channels (WhatsApp, Email, API).
 * @param provider The provider to notify.
 * @param lead The service request details.
 */
async function notifyProvider(provider: ProviderWithDetails, lead: ServiceRequest): Promise<void> {
  console.log(`Initiating notifications for lead ${lead.id} to provider ${provider.businessName} (Phone: ${provider.phoneNumber}, Email: ${provider.email}, API: ${provider.apiEndpoint})`);
  console.log(`Initiating notifications for lead ${lead.id} to provider ${provider.businessName}`);
  // In a real system, these might be async operations returning Promises.
  // Consider Promise.allSettled for independent success/failure.
  try {
    sendWhatsApp(provider, lead);
    sendEmail(provider, lead);
    // Consider Promise.allSettled if individual notification failures shouldn't stop others
    sendWhatsApp(provider, lead);
    sendEmail(provider, lead);
    sendToAPI(provider, lead);
    console.log(`Notification attempts finished for lead ${lead.id} to provider ${provider.businessName}`);
  } catch (error) {
      console.error(`NOTIFICATION ERROR: Error during notification process for lead ${lead.id} to provider ${provider.businessName}:`, error);
      // Decide if this error should prevent the overall process from succeeding.
      // For now, we log it but don't re-throw, allowing other steps to potentially complete.
  }
}


// --- Existing Notification Stubs (Minor improvements) ---

/**
 * Send lead notification via WhatsApp (Stub)
 */
function sendWhatsApp(provider: Provider, lead: ServiceRequest): void {
  // Basic check if phone number exists
  if (provider.phoneNumber) {
    console.log(`WhatsApp: Sending lead ${lead.id} to ${provider.businessName} at ${provider.phoneNumber}`);
    // console.log(`WhatsApp message content: New service request from ${lead.name} for ${lead.address}`);
    // Actual WhatsApp API integration would go here
  } else {
    console.log(`WhatsApp: Skipped for provider ${provider.businessName} (no phone number).`);
  }
}

/**
 * Send lead notification via Email (Stub)
 */
function sendEmail(provider: Provider, lead: ServiceRequest): void {
  // Basic check if email exists
  if (provider.email) {
    console.log(`Email: Sending lead ${lead.id} to ${provider.businessName} at ${provider.email}`);
    // console.log(`Email subject: New Service Request`);
    // console.log(`Email content: Customer ${lead.name} is requesting service at ${lead.address}`);
    // Actual Email sending logic (e.g., using nodemailer or an email service) would go here
  } else {
    console.log(`Email: Skipped for provider ${provider.businessName} (no email address).`);
  }
}

/**
 * Send lead to provider's API endpoint if available (Stub)
 */
function sendToAPI(provider: Provider, lead: ServiceRequest): void {
  // Check if provider.apiEndpoint exists before attempting
  if (provider.apiEndpoint) {
      console.log(`API: Sending lead ${lead.id} to ${provider.businessName} API endpoint: ${provider.apiEndpoint}`);
      // console.log(`API payload would include customer details, location, and service type`);
      // Actual API call logic would go here (e.g., using fetch or axios)
      // Remember to handle potential errors from the API call
  } else {
      console.log(`API: Skipped for provider ${provider.businessName} (no API endpoint configured).`);
  }
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

    // 3. Update the lead record with the assigned provider and paid status
    // This is done regardless of delivery status to record the match attempt.
    // This is done regardless of delivery status to record the match attempt.
    await updateLeadWithProvider(lead.id, provider.id, paidStatus); // Use paidStatus here

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
    // Optional: Update lead status to 'ROUTING_FAILED' or similar
    try {
      // Attempt to update status, but log failure clearly if it happens
      await prisma.serviceRequest.update({ where: { id: lead.id }, data: { status: 'ROUTING_FAILED' /*, providerId: null */ } });
    } catch (updateError) {
      console.error(`Failed to update lead ${lead.id} status after routing error:`, updateError);
    }
  }
}
