// 🚧 Hidden for MVP - Advanced provider service
// This file contains provider management logic that requires additional
// database models and relations not in the current MVP schema.

import prisma from "@/lib/db"
import { Provider } from "@prisma/client"

// MVP: Get all providers with basic fields
export async function getAllProviders() {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return providers
  } catch (error) {
    console.error("Error fetching providers:", error)
    throw new Error("Failed to fetch providers")
  }
}

// MVP: Get provider by ID
export async function getProviderById(id: number) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { id }
    })
    
    return provider
  } catch (error) {
    console.error(`Error fetching provider with ID ${id}:`, error)
    throw new Error("Failed to fetch provider")
  }
}

// MVP: Create provider with basic fields
export async function createProvider(data: any) {
  try {
    const provider = await prisma.provider.create({
      data: {
        name: data.name,
        service: data.service,
        city: data.city,
        country: data.country,
        contact: data.contact,
        website: data.website,
        whatsapp: data.whatsapp,
        contactMethod: data.contactMethod,
      }
    })
    
    return provider
  } catch (error) {
    console.error("Error creating provider:", error)
    throw new Error("Failed to create provider")
  }
}

// MVP: Update provider
export async function updateProvider(id: number, data: any) {
  try {
    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: {
        name: data.name,
        service: data.service,
        city: data.city,
        country: data.country,
        contact: data.contact,
        website: data.website,
        whatsapp: data.whatsapp,
        contactMethod: data.contactMethod,
      }
    })
    
    return updatedProvider
  } catch (error) {
    console.error(`Error updating provider with ID ${id}:`, error)
    throw new Error("Failed to update provider")
  }
}

// MVP: Delete provider
export async function deleteProvider(id: number) {
  try {
    // Check if there are service requests assigned to this provider
    const serviceRequestsCount = await prisma.serviceRequest.count({
      where: { providerId: id }
    })
    
    if (serviceRequestsCount > 0) {
      throw new Error(`Cannot delete provider because it has ${serviceRequestsCount} assigned service requests`)
    }
    
    const deletedProvider = await prisma.provider.delete({
      where: { id }
    })
    
    return deletedProvider
  } catch (error) {
    console.error(`Error deleting provider with ID ${id}:`, error)
    throw error
  }
}
