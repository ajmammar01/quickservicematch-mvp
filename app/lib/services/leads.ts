// Lead Management Service
import { PrismaClient, ServiceRequest, RequestStatus, LeadStatus } from '@prisma/client'
import { z } from 'zod'

// Initialize Prisma Client
const prisma = new PrismaClient()

// Types for filtering leads
export interface LeadFilters {
  status?: RequestStatus
  leadStatus?: LeadStatus
  cityId?: string
  serviceTypeId?: string
  fromDate?: Date
  toDate?: Date
  searchTerm?: string
}

// Types for pagination
export interface PaginationOptions {
  page?: number
  limit?: number
}

// Type for lead creation
export const leadCreationSchema = z.object({
  name: z.string().min(2, { message: "Name is required (minimum 2 characters)" }),
  phoneNumber: z.string().min(7, { message: "Valid phone number is required" }),
  address: z.string().min(2, { message: "Address is required" }),
  locationData: z.string().optional(),
  description: z.string().optional(),
  cityId: z.string().min(1, { message: "City is required" }),
  serviceTypeId: z.string().min(1, { message: "Service type is required" }),
  leadSource: z.string().optional(),
})

export type LeadCreationInput = z.infer<typeof leadCreationSchema>

// Create a new lead
export async function createLead(leadData: LeadCreationInput): Promise<ServiceRequest> {
  return await prisma.serviceRequest.create({
    data: {
      ...leadData,
      status: RequestStatus.PENDING,
      leadStatus: LeadStatus.NEW,
      submittedAt: new Date(),
    },
  })
}

// Update lead status
export async function updateLeadStatus(
  id: string, 
  leadStatus: LeadStatus,
  notes?: string
): Promise<ServiceRequest> {
  return await prisma.serviceRequest.update({
    where: { id },
    data: { 
      leadStatus,
      lastContactedAt: new Date(),
      notes: notes ? 
        (lead => `${lead.notes ? lead.notes + '\n---\n' : ''}${new Date().toISOString()}: ${notes}`) :
        undefined
    },
  })
}

// Assign a provider to a lead
export async function assignProviderToLead(
  leadId: string,
  providerId: string
): Promise<ServiceRequest> {
  return await prisma.serviceRequest.update({
    where: { id: leadId },
    data: {
      providerId,
      status: RequestStatus.ASSIGNED,
      leadStatus: LeadStatus.CONTACTED,
      lastContactedAt: new Date(),
    },
  })
}

// Get leads with filtering and pagination
export async function getLeads(
  filters: LeadFilters = {}, 
  pagination: PaginationOptions = {}
) {
  const { page = 1, limit = 10 } = pagination
  const where: any = {}
  
  // Apply filters
  if (filters.status) where.status = filters.status
  if (filters.leadStatus) where.leadStatus = filters.leadStatus
  if (filters.cityId) where.cityId = filters.cityId
  if (filters.serviceTypeId) where.serviceTypeId = filters.serviceTypeId
  
  // Date range filtering
  if (filters.fromDate || filters.toDate) {
    where.submittedAt = {}
    if (filters.fromDate) where.submittedAt.gte = filters.fromDate
    if (filters.toDate) where.submittedAt.lte = filters.toDate
  }
  
  // Search term across multiple fields
  if (filters.searchTerm) {
    where.OR = [
      { name: { contains: filters.searchTerm, mode: 'insensitive' } },
      { phoneNumber: { contains: filters.searchTerm, mode: 'insensitive' } },
      { address: { contains: filters.searchTerm, mode: 'insensitive' } },
      { description: { contains: filters.searchTerm, mode: 'insensitive' } },
    ]
  }
  
  // Get total count for pagination
  const totalCount = await prisma.serviceRequest.count({ where })
  
  // Get the leads with relations
  const leads = await prisma.serviceRequest.findMany({
    where,
    include: {
      city: {
        select: { name: true, country: true }
      },
      serviceType: {
        select: { name: true, description: true }
      },
      provider: {
        select: { 
          id: true, 
          name: true, 
          businessName: true,
          phoneNumber: true,
          email: true,
          avgRating: true,
          totalReviews: true
        }
      }
    },
    orderBy: { submittedAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })
  
  return {
    leads,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  }
}

// Get lead by ID
export async function getLeadById(id: string) {
  return await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      city: true,
      serviceType: true,
      provider: true,
    },
  })
}

// Get lead statistics (for dashboard)
export async function getLeadStats(fromDate?: Date, toDate?: Date) {
  const dateFilter: any = {}
  if (fromDate) dateFilter.gte = fromDate
  if (toDate) dateFilter.lte = toDate
  
  // Get counts by lead status
  const leadStatusCounts = await prisma.serviceRequest.groupBy({
    by: ['leadStatus'],
    _count: true,
    where: fromDate || toDate ? { submittedAt: dateFilter } : undefined
  })
  
  // Get counts by city
  const cityLeadCounts = await prisma.serviceRequest.groupBy({
    by: ['cityId'],
    _count: true,
    where: fromDate || toDate ? { submittedAt: dateFilter } : undefined
  })
  
  // Get counts by service type
  const serviceTypeLeadCounts = await prisma.serviceRequest.groupBy({
    by: ['serviceTypeId'],
    _count: true,
    where: fromDate || toDate ? { submittedAt: dateFilter } : undefined
  })
  
  // Get conversion rate (leads with status CONVERTED / total leads)
  const totalLeads = await prisma.serviceRequest.count({
    where: fromDate || toDate ? { submittedAt: dateFilter } : undefined
  })
  
  const convertedLeads = await prisma.serviceRequest.count({
    where: {
      leadStatus: LeadStatus.CONVERTED,
      ...(fromDate || toDate ? { submittedAt: dateFilter } : {})
    }
  })
  
  return {
    leadStatusCounts,
    cityLeadCounts,
    serviceTypeLeadCounts,
    conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) : 0,
    totalLeads,
    convertedLeads
  }
}
