'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FormState } from './types'

type SuccessMessageProps = {
  currentStep: number
  getSelectedCity: () => string
  getSelectedService: () => string
  resetForm: () => void
}

export default function SuccessMessage({
  currentStep,
  getSelectedCity,
  getSelectedService,
  resetForm
}: SuccessMessageProps) {
  const router = useRouter()

  const handleGoHome = () => {
    // Use window.location for a full page navigation to ensure it works
    window.location.href = '/'
  }

  return (
    <div className={`transition-all duration-500 ${currentStep === 4 ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
      <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-xl mx-auto">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-800/50 dark:to-emerald-800/50 border border-green-200 dark:border-green-700">
          <span className="text-2xl">🎉</span>
        </div>
        <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Request Received!</h3>
        <p className="mt-3 text-md text-gray-700 dark:text-gray-300 leading-relaxed">
          We're matching you with the best provider now. You'll be contacted via phone or WhatsApp within 15 minutes.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-400 dark:focus:ring-offset-gray-800 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
          >
            🔁 Submit another request
          </button>
          <button
            type="button"
            onClick={handleGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-400 dark:focus:ring-offset-gray-800 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
          >
            🏠 Back to homepage
          </button>
        </div>
      </div>
    </div>
  )
}
