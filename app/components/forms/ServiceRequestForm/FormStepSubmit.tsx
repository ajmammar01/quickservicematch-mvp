'use client'

type FormStepSubmitProps = {
  currentStep: number
  isLoading: boolean
  setCurrentStep: (step: number) => void
}

export default function FormStepSubmit({ 
  currentStep, 
  isLoading, 
  setCurrentStep 
}: FormStepSubmitProps) {
  return (
    <div className={`mt-6 flex justify-between ${currentStep === 3 ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
      <button
        type="button"
        onClick={() => setCurrentStep(2)}
        className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
      >
        ← Back
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className={`px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : (
          'Find a provider'
        )}
      </button>
    </div>
  )
}