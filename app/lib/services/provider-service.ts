import prisma from "@/lib/db"
import { Provider } from "@prisma/client"

export async function getAllProviders() {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: {
        businessName: 'asc'
      },
      include: {
        city: {
          select: {
            name: true,
            country: true
          }
        },
        serviceTypes: {
          include: {
            serviceType: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    
    return providers
  } catch (error) {
    console.error("Error fetching providers:", error)
    throw new Error("Failed to fetch providers")
  }
}

export async function getProviderById(id: string) {
  try {
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        city: true,
        serviceTypes: {
          include: {
            serviceType: true
          }
        }
      }
    })
    
    return provider
  } catch (error) {
    console.error(`Error fetching provider with ID ${id}:`, error)
    throw new Error("Failed to fetch provider")
  }
}

export async function createProvider(data: any) {
  try {
    // Extract service type IDs from the data
    const { serviceTypeIds, ...providerData } = data
    
    // Create the provider with service type connections
    const provider = await prisma.provider.create({
      data: {
        ...providerData,
        serviceTypes: {
          create: serviceTypeIds.map((id: string) => ({
            serviceType: { connect: { id } }
          }))
        }
      },
      include: {
        city: true,
        serviceTypes: {
          include: {
            serviceType: true
          }
        }
      }
    })
    
    return provider
  } catch (error) {
    console.error("Error creating provider:", error)
    throw new Error("Failed to create provider")
  }
}

export async function updateProvider(id: string, data: any) {
  try {
    // Extract service type IDs from the data
    const { serviceTypeIds, ...providerData } = data
    
    // Start a transaction to update provider and service types
    return await prisma.$transaction(async (tx) => {
      // If service types are provided, update the relationships
      if (serviceTypeIds) {
        // Delete existing service type relationships
        await tx.providerServiceType.deleteMany({
          where: { providerId: id }
        })
        
        // Create new service type relationships
        await Promise.all(
          serviceTypeIds.map((serviceTypeId: string) =>
            tx.providerServiceType.create({
              data: {
                providerId: id,
                serviceTypeId
              }
            })
          )
        )
      }
      
      // Update the provider data
      const updatedProvider = await tx.provider.update({
        where: { id },
        data: providerData,
        include: {
          city: true,
          serviceTypes: {
            include: {
              serviceType: true
            }
          }
        }
      })
      
      return updatedProvider
    })
  } catch (error) {
    console.error(`Error updating provider with ID ${id}:`, error)
    throw new Error("Failed to update provider")
  }
}

export async function deleteProvider(id: string) {
  try {
    // Start a transaction to delete provider and related data
    return await prisma.$transaction(async (tx) => {
      // First delete service type relationships
      await tx.providerServiceType.deleteMany({
        where: { providerId: id }
      })
      
      // Check if there are any service requests assigned to this provider
      const serviceRequestsCount = await tx.serviceRequest.count({
        where: { providerId: id }
      })
      
      if (serviceRequestsCount > 0) {
        throw new Error(`Cannot delete provider because it has ${serviceRequestsCount} assigned service requests`)
      }
      
      // Finally delete the provider
      const deletedProvider = await tx.provider.delete({
        where: { id }
      })
      
      return deletedProvider
    })
  } catch (error) {
    console.error(`Error deleting provider with ID ${id}:`, error)
    throw error
  }
}
