// 🚧 Hidden for MVP - Dashboard service
// This file contains dashboard logic that requires additional
// database models and relations not in the current MVP schema.

import prisma from "@/lib/db"
import { LeadStatus } from "@prisma/client"

export async function getDashboardStats() {
  try {
    // MVP: Basic stats only
    const totalLeads = await prisma.serviceRequest.count()
    
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const newLeads = await prisma.serviceRequest.count({
      where: {
        createdAt: {
          gte: oneWeekAgo
        }
      }
    })
    
    const convertedLeads = await prisma.serviceRequest.count({
      where: {
        leadStatus: LeadStatus.CONVERTED
      }
    })
    
    const conversionRate = totalLeads > 0 ? convertedLeads / totalLeads : 0
    
    const userExperiencesCount = await prisma.userExperience.count()
    const suggestionsCount = await prisma.suggestion.count()
    
    // MVP: Simple recent leads without relations
    const recentLeads = await prisma.serviceRequest.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return {
      totalLeads,
      newLeads,
      convertedLeads,
      conversionRate,
      userExperiencesCount,
      suggestionsCount,
      recentLeads
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    throw new Error("Failed to get dashboard statistics")
  }
}
