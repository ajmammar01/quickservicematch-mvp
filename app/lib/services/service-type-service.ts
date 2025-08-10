import prisma from "@/lib/db"
import { ServiceType } from "@prisma/client"

export async function getAllServiceTypes(): Promise<ServiceType[]> {
  try {
    const serviceTypes = await prisma.serviceType.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    return serviceTypes
  } catch (error) {
    console.error("Error fetching service types:", error)
    throw new Error("Failed to fetch service types")
  }
}

export async function getServiceTypeById(id: string): Promise<ServiceType | null> {
  try {
    const serviceType = await prisma.serviceType.findUnique({
      where: { id }
    })
    
    return serviceType
  } catch (error) {
    console.error(`Error fetching service type with ID ${id}:`, error)
    throw new Error("Failed to fetch service type")
  }
}

export async function createServiceType(data: { name: string; description?: string; defaultLeadValue: number }): Promise<ServiceType> {
  try {
    const serviceType = await prisma.serviceType.create({
      data
    })
    
    return serviceType
  } catch (error) {
    console.error("Error creating service type:", error)
    throw new Error("Failed to create service type")
  }
}

export async function updateServiceType(id: string, data: { name?: string; description?: string; defaultLeadValue?: number }): Promise<ServiceType> {
  try {
    const serviceType = await prisma.serviceType.update({
      where: { id },
      data
    })
    
    return serviceType
  } catch (error) {
    console.error(`Error updating service type with ID ${id}:`, error)
    throw new Error("Failed to update service type")
  }
}

export async function deleteServiceType(id: string): Promise<ServiceType> {
  try {
    // Check if there are any service requests using this service type
    const requestsCount = await prisma.serviceRequest.count({
      where: { serviceTypeId: id }
    })
    
    if (requestsCount > 0) {
      throw new Error(`Cannot delete service type because it has ${requestsCount} associated service requests`)
    }
    
    // Check if there are any providers offering this service
    const providersCount = await prisma.providerServiceType.count({
      where: { serviceTypeId: id }
    })
    
    if (providersCount > 0) {
      throw new Error(`Cannot delete service type because it is offered by ${providersCount} providers`)
    }
    
    const serviceType = await prisma.serviceType.delete({
      where: { id }
    })
    
    return serviceType
  } catch (error) {
    console.error(`Error deleting service type with ID ${id}:`, error)
    throw new Error(error instanceof Error ? error.message : "Failed to delete service type")
  }
}
