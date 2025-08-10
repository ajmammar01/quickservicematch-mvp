'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface ServiceType {
  id: string
  name: string
  description: string | null
}

export default function ServiceCategories() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await fetch('/api/service-types')
        
        if (!response.ok) {
          throw new Error('Failed to fetch service types')
        }
        
        const data = await response.json()
        setServiceTypes(data)
      } catch (error) {
        console.error('Error fetching service types:', error)
        setError('Failed to load service categories. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchServiceTypes()
  }, [])

  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading service categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-md p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // Organize service types into rows with 3 items per row
  const rows = []
  for (let i = 0; i < serviceTypes.length; i += 3) {
    rows.push(serviceTypes.slice(i, i + 3))
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Popular Service Categories</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We connect you with the best local providers across a wide range of services.
          </p>
        </div>
        
        <div className="space-y-8">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {row.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service }: { service: ServiceType }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/10 overflow-hidden hover:shadow-md dark:hover:shadow-gray-700/20 transition duration-300">
      <Link 
        href={`/?serviceTypeId=${service.id}`}
        className="block p-6"
      >
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{service.name}</h3>
        {service.description && (
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{service.description}</p>
        )}
        <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
          <span>Find a provider</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  )
}