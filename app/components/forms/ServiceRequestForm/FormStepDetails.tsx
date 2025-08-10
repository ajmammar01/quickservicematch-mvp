'use client';

import { FormState, Location } from './types';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';

type FormStepDetailsProps = {
  currentStep: number;
  formState: FormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleLocationSelect: (location: Location) => void;
  setCurrentStep: (step: number) => void;
};

export default function FormStepDetails({
  currentStep,
  formState,
  handleChange,
  handleLocationSelect,
  setCurrentStep
}: FormStepDetailsProps) {
  return (
    <div className={`transition-all duration-500 ${currentStep === 3 ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your details</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {formState.selectedService} service in {formState.selectedCity}
        </p>
      </div>
      
      <div className="space-y-5">
        <div className="relative group transition-all duration-300">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
            required
            placeholder="John Smith"
          />
        </div>
        
        <div className="relative group transition-all duration-300">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formState.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
            required
            placeholder="+1 123 456 7890"
          />
        </div>
        
        <div className="relative group transition-all duration-300">
          <GooglePlacesAutocomplete
            onLocationSelect={handleLocationSelect}
            initialValue={formState.location?.formatted_location || ''}
            required={true}
            className="w-full"
          />
        </div>
        
        <div className="relative group transition-all duration-300">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Describe your issue (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formState.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
            placeholder="Please provide any details that might help the service provider"
          />
        </div>
      </div>
    </div>
  );
}
