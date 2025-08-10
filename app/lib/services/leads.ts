// 🚧 Hidden for MVP - Advanced lead management service
// This file contains lead management logic that requires additional
// database models and relations not in the current MVP schema.

import prisma from '@/lib/db'
import { ServiceRequest, RequestStatus, LeadStatus } from '@prisma/client'
import { z } from 'zod'

// MVP: Simplified lead filters
export interface LeadFilters {
  status?: RequestStatus
  leadStatus?: LeadStatus
  city?: string
  service?: string
  fromDate?: Date
  toDate?: Date
  searchTerm?: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

// MVP: Simplified lead creation schema
export const leadCreationSchema = z.object({
  name: z.string().min(2, { message: "Name is required (minimum 2 characters)" }),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  service: z.string().min(1, { message: "Service is required" }),
  leadSource: z.string().optional(),
})

export type LeadCreationInput = z.infer<typeof leadCreationSchema>

// MVP: Create a new lead
export async function createLead(leadData: LeadCreationInput): Promise<ServiceRequest> {
  return await prisma.serviceRequest.create({
    data: {
      name: leadData.name,
      phone: leadData.phoneNumber,
      email: leadData.email,
      address: leadData.address,
      description: leadData.description,
      city: leadData.city,
      service: leadData.service,
      status: RequestStatus.PENDING,
      leadStatus: LeadStatus.NEW,
    },
  })
}

// MVP: Update lead status
export async function updateLeadStatus(
  id: string, 
  leadStatus: LeadStatus
): Promise<ServiceRequest> {
  return await prisma.serviceRequest.update({
    where: { id },
    data: { leadStatus },
  })
}

// MVP: Assign a provider to a lead
export async function assignProviderToLead(
  leadId: string,
  providerId: number
): Promise<ServiceRequest> {
  return await prisma.serviceRequest.update({
    where: { id: leadId },
    data: {
      providerId,
      status: RequestStatus.ASSIGNED,
      leadStatus: LeadStatus.CONTACTED,
    },
  })
}

// MVP: Get leads with basic filtering
export async function getLeads(
  filters: LeadFilters = {}, 
  pagination: PaginationOptions = {}
) {
  const { page = 1, limit = 10 } = pagination
  const where: any = {}
  
  // MVP: Basic filters only
  if (filters.status) where.status = filters.status
  if (filters.leadStatus) where.leadStatus = filters.leadStatus
  if (filters.city) where.city = filters.city
  if (filters.service) where.service = filters.service
  
  if (filters.fromDate || filters.toDate) {
    where.createdAt = {}
    if (filters.fromDate) where.createdAt.gte = filters.fromDate
    if (filters.toDate) where.createdAt.lte = filters.toDate
  }
  
  const totalCount = await prisma.serviceRequest.count({ where })
  
  // MVP: Simple query without relations
  const leads = await prisma.serviceRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
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

// MVP: Get lead by ID
export async function getLeadById(id: string) {
  return await prisma.serviceRequest.findUnique({
    where: { id },
  })
}

// MVP: Basic lead statistics
export async function getLeadStats(fromDate?: Date, toDate?: Date) {
  const dateFilter: any = {}
  if (fromDate) dateFilter.gte = fromDate
  if (toDate) dateFilter.lte = toDate
  
  const totalLeads = await prisma.serviceRequest.count({
    where: fromDate || toDate ? { createdAt: dateFilter } : undefined
  })
  
  const convertedLeads = await prisma.serviceRequest.count({
    where: {
      leadStatus: LeadStatus.CONVERTED,
      ...(fromDate || toDate ? { createdAt: dateFilter } : {})
    }
  })
  
  return {
    conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) : 0,
    totalLeads,
    convertedLeads
  }
}
