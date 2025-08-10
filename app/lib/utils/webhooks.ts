/**
 * Utility functions for sending webhook notifications
 */

/**
 * Send lead data to an external webhook
 * @param leadData The lead data to send
 * @returns Promise that resolves when the webhook is sent
 */
export async function sendLeadWebhook(leadData: {
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  service: string;
  description?: string;
}): Promise<void> {
  try {
    const webhookUrl = 'https://hook.eu2.make.com/3cbtkc6fyvemqfcwopr41u27kvsqjyvt';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    console.log('Webhook sent successfully:', leadData);
  } catch (error) {
    // Log the error but don't throw it - we don't want to fail the main request if the webhook fails
    console.error('Error sending webhook:', error);
  }
}
