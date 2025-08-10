import prisma from "@/lib/db"
import { LeadStatus } from "@prisma/client"

export async function getDashboardStats() {
  try {
    // Get total leads count
    const totalLeads = await prisma.serviceRequest.count()
    
    // Get new leads count (last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const newLeads = await prisma.serviceRequest.count({
      where: {
        submittedAt: {
          gte: oneWeekAgo
        }
      }
    })
    
    // Get converted leads count
    const convertedLeads = await prisma.serviceRequest.count({
      where: {
        leadStatus: LeadStatus.CONVERTED
      }
    })
    
    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? convertedLeads / totalLeads : 0
    
    // Get user experiences count
    const userExperiencesCount = await prisma.userExperience.count()
    
    // Get suggestions count
    const suggestionsCount = await prisma.suggestion.count()
    
    // Get recent service requests
    const recentLeads = await prisma.serviceRequest.findMany({
      take: 5,
      orderBy: {
        submittedAt: 'desc'
      },
      include: {
        city: {
          select: {
            name: true
          }
        },
        serviceType: {
          select: {
            name: true
          }
        },
        provider: {
          select: {
            businessName: true
          }
        }
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
