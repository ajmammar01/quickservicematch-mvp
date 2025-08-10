'use client'

import { useEffect, useRef, useState } from 'react'
import { Location } from './types'

interface GooglePlacesAutocompleteProps {
  onLocationSelect: (location: Location) => void
  initialValue?: string
  className?: string
  placeholder?: string
  label?: string
  required?: boolean
}

declare global {
  interface Window {
    google: any
    initPlacesAutocomplete: () => void
  }
}

export default function GooglePlacesAutocomplete({
  onLocationSelect,
  initialValue = '',
  className = '',
  placeholder = 'Enter address or ZIP code',
  label = 'Address or ZIP Code',
  required = false
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [inputValue, setInputValue] = useState(initialValue)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isScriptLoaded || !inputRef.current) return

    window.initPlacesAutocomplete = () => {
      if (!inputRef.current) return

      setIsScriptLoaded(true)
      
      try {
        autocompleteRef.current = new window.google.places.Autocomplete(inputRef.current, {
          types: ['address'], // Allow full addresses
          fields: ['formatted_address', 'geometry', 'place_id']
        })

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace()
          
          if (!place || !place.geometry) {
            console.warn("No location data available for this selection")
            return
          }

          const locationData: Location = {
            formatted_location: place.formatted_address,
            place_id: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }

          setInputValue(place.formatted_address)
          setErrorMessage('')
          onLocationSelect(locationData)
        })
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error)
        setErrorMessage('Unable to initialize location services. Please enter your location manually.')
      }
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

    if (!apiKey) {
      console.warn('Google Places API key is missing')
      setErrorMessage('Location services are currently unavailable. Please enter your location manually.')
      return
    }

    if (!document.querySelector('#google-places-script')) {
      const script = document.createElement('script')
      script.id = 'google-places-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initPlacesAutocomplete`
      script.async = true
      script.defer = true
      script.onerror = () => {
        setErrorMessage('Location services failed to load. Please enter your location manually.')
      }
      document.head.appendChild(script)
    } else if (window.google) {
      window.initPlacesAutocomplete()
    }

    return () => {
      window.initPlacesAutocomplete = () => {}
    }
  }, [onLocationSelect])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    if (value.length > 0) {
      onLocationSelect({
        formatted_location: value,
        place_id: '',
        lat: 0,
        lng: 0
      })
    } else {
      onLocationSelect({
        formatted_location: '',
        place_id: '',
        lat: 0,
        lng: 0
      })
    }
  }

  return (
    <div>
      <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <input
        ref={inputRef}
        type="text"
        id="location"
        value={inputValue}
        onChange={handleInputChange}
        className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 ${className}`}
        placeholder={placeholder}
        required={required}
      />
      {errorMessage && (
        <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">{errorMessage}</p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Enter your full address or ZIP code
      </p>
    </div>
  )
}
