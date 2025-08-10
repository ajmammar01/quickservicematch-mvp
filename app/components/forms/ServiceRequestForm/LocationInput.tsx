'use client'

import { useState } from 'react'
import { Location } from './types'

interface LocationInputProps {
  onLocationSelect: (location: Location) => void
  initialValue?: string
  className?: string
  placeholder?: string
  label?: string
  required?: boolean
}

export default function LocationInput({
  onLocationSelect,
  initialValue = '',
  className = '',
  placeholder = 'Enter address or ZIP code',
  label = 'Address or ZIP Code',
  required = false
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState(initialValue)

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    // Update the location as user types
    onLocationSelect({
      formatted_location: value,
      place_id: '',
      lat: 0,
      lng: 0
    })
  }

  return (
    <div>
      <label htmlFor="manual-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <input
        type="text"
        id="manual-location"
        value={inputValue}
        onChange={handleInputChange}
        className={`w-full rounded-md border px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition duration-150 ${className}`}
        placeholder={placeholder}
        required={required}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Enter your full address or postal code
      </p>
    </div>
  )
}