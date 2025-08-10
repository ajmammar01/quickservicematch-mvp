'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CityServiceCombo, FormState } from './types';

type FormStepSelectorProps = {
  currentStep: number;
  combos: CityServiceCombo[];
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setCurrentStep: (step: number) => void;
};

export default function FormStepSelector({ 
  currentStep, 
  combos, 
  formState, 
  setFormState, 
  setCurrentStep 
}: FormStepSelectorProps) {
  
  const availableCities = Array.from(new Set((combos || []).map(combo => combo.city)));

  const availableServices = (combos || [])
    .filter(combo => combo.city === formState.selectedCity)
    .map(combo => combo.service);

  const handleCityChange = (selectedCity: string) => {
    setFormState(prev => ({ ...prev, selectedCity, selectedService: '' }));
    if (selectedCity) {
      setCurrentStep(2);
    }
  };

  const handleServiceSelect = (service: string) => {
    setFormState(prev => ({ ...prev, selectedService: service }));
    setCurrentStep(3);
  };

  return (
    <>
      {/* Step 1: Select City */}
      <div className={`transition-all duration-500 ${currentStep === 1 ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Where do you need service?</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Select your city to find local providers</p>
        </div>

        <div className="relative">
          <Listbox value={formState.selectedCity} onChange={handleCityChange}>
            <div className="relative mt-1">
              <Listbox.Button className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 text-left">
                <span className="block truncate">
                  {formState.selectedCity || 'Select your city'}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                  {availableCities.map((city) => (
                    <Listbox.Option
                      key={city}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-4 pr-9 ${
                          active 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                            : 'text-gray-900 dark:text-white'
                        }`
                      }
                      value={city}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {city}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                active ? 'text-blue-600 dark:text-blue-300' : 'text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Step 2: Select Service */}
      <div className={`transition-all duration-500 ${currentStep === 2 ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What service do you need?</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">You selected {formState.selectedCity}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {availableServices.map((service) => (
            <div
              key={service}
              onClick={() => handleServiceSelect(service)}
              className={`border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${
                formState.selectedService === service
                  ? 'border-blue-600 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 ring-2 ring-blue-600 dark:ring-blue-400 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50/30 dark:hover:from-gray-700/50 dark:hover:to-blue-900/10 bg-white dark:bg-gray-700 hover:shadow-sm'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">{service}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => formState.selectedService && setCurrentStep(3)}
            disabled={!formState.selectedService}
            className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium transition-all duration-300 hover:shadow-md ${!formState.selectedService ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Continue →
          </button>
        </div>
      </div>
    </>
  );
}
