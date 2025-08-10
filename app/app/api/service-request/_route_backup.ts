import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

// Create a validation schema for the request payload
const serviceRequestSchema = z.object({
  name: z.string().min(2, { message: "Name is required (minimum 2 characters)" }),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  service: z.string().min(1, { message: "Service is required" }),
  description: z.string().optional(),
  location: z.object({
    formatted_location: z.string().optional(),
    place_id: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
  leadSource: z.string().optional(),
})

// Type based on the schema
type ServiceRequestInput = z.infer<typeof serviceRequestSchema>

export async function POST(request: Request) {
  console.log('🚀 Service request API called');
  
  try {
    // Parse and validate the request body
    const body = await request.json()
    console.log('📥 Received body:', JSON.stringify(body, null, 2));
    
    const result = serviceRequestSchema.safeParse(body)

    if (!result.success) {
      const errorMessage = result.error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      ).join(', ')

      console.error('❌ Validation failed:', errorMessage);
      return NextResponse.json(
        { error: 'Validation failed', details: errorMessage },
        { status: 400 }
      )
    }

    const validatedData = result.data
    console.log('✅ Validated data:', JSON.stringify(validatedData, null, 2));

    // Create the service request in database
    console.log('💾 Saving to database...');
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phoneNumber,
        city: validatedData.city,
        service: validatedData.service,
        description: validatedData.description || '',
        address: validatedData.address || '',
        status: 'PENDING',
        leadStatus: 'NEW',
      },
    })
    console.log('✅ Saved to database with ID:', serviceRequest.id);

    // Send lead info to Make.com webhook
    const webhookUrl = process.env.MAKE_WEBHOOK_URL
    const apiKey = process.env.MAKE_WEBHOOK_API_KEY

    if (!webhookUrl) {
      console.error('❌ MAKE_WEBHOOK_URL is not defined in environment variables');
      return NextResponse.json({ 
        success: true,
        warning: 'Lead saved but webhook URL not configured',
        leadId: serviceRequest.id 
      })
    }

    // Prepare webhook payload with all relevant data
    const webhookPayload = {
      // Lead Information
      leadId: serviceRequest.id,
      timestamp: new Date().toISOString(),
      
      // Customer Details
      name: validatedData.name,
      phone: validatedData.phoneNumber || 'Not provided',
      email: validatedData.email || 'Not provided',
      
      // Service Details
      city: validatedData.city,
      service: validatedData.service,
      address: validatedData.address || validatedData.location?.formatted_location || 'Not provided',
      description: validatedData.description || 'No additional details',
      
      // Additional metadata
      source: 'QuickServiceMatch Platform',
      status: 'NEW_LEAD',
    }

    console.log('📤 Sending webhook to:', webhookUrl);
    console.log('📋 Webhook payload:', JSON.stringify(webhookPayload, null, 2));

    try {
      // Build headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      // Only add API key header if it exists
      if (apiKey && apiKey !== 'abcd123') { // Skip if using placeholder key
        headers['x-make-apikey'] = apiKey;
        console.log('🔑 Using API key authentication');
      } else {
        console.log('⚠️ No valid API key provided, sending without authentication');
      }

      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(webhookPayload),
      })

      const responseStatus = webhookResponse.status;
      const responseText = await webhookResponse.text();
      
      console.log('📨 Webhook response status:', responseStatus);
      console.log('📨 Webhook response:', responseText);

      if (!webhookResponse.ok) {
        console.error('❌ Webhook failed with status:', responseStatus);
        console.error('❌ Response details:', responseText);
        
        // Try to parse error details
        try {
          const errorDetails = JSON.parse(responseText);
          console.error('❌ Error details:', errorDetails);
        } catch {
          // Response wasn't JSON, that's okay
        }
        
        // Even if webhook fails, we've saved to DB, so return success
        return NextResponse.json({
          success: true,
          warning: 'Lead saved but webhook notification failed',
          leadId: serviceRequest.id,
          webhookError: `Status ${responseStatus}: ${responseText.substring(0, 100)}...`
        })
      }

      console.log('✅ Webhook sent successfully!');
      
      // Update the service request to mark webhook as sent
      await prisma.serviceRequest.update({
        where: { id: serviceRequest.id },
        data: { leadSentAt: new Date() }
      })

      return NextResponse.json({
        success: true,
        message: 'Lead saved and notification sent successfully',
        leadId: serviceRequest.id
      })

    } catch (webhookError) {
      console.error('❌ Webhook error:', webhookError);
      if (webhookError instanceof Error) {
        console.error('Error details:', {
          message: webhookError.message,
          stack: webhookError.stack,
          cause: webhookError.cause
        });
      }
      
      // Webhook failed but DB save succeeded
      return NextResponse.json({
        success: true,
        warning: 'Lead saved but webhook notification failed',
        leadId: serviceRequest.id,
        error: webhookError instanceof Error ? webhookError.message : 'Unknown webhook error'
      })
    }

  } catch (error) {
    console.error('❌ Error in service request API:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to submit service request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve service requests (for admin/dashboard usage)
// 🚧 Hidden for MVP - Dashboard functionality
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const city = searchParams.get('city')
    const service = searchParams.get('service')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (status) where.status = status
    if (city) where.city = city
    if (service) where.service = service

    if (fromDate || toDate) {
      where.createdAt = {}
      if (fromDate) where.createdAt.gte = new Date(fromDate)
      if (toDate) where.createdAt.lte = new Date(toDate)
    }

    const totalCount = await prisma.serviceRequest.count({ where })

    const requests = await prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      requests,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
      { status: 500 }
    )
  }
}
</parameter>
</invoke>