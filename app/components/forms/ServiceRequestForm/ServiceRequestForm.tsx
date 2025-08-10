'use client';

import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import FormStepSelector from './FormStepSelector';
import FormStepDetails from './FormStepDetails';
import FormStepSubmit from './FormStepSubmit';
import SuccessMessage from './SuccessMessage';
import { Location } from './types';

interface FormState {
  name: string;
  phoneNumber: string;
  address: string;
  description?: string;
  selectedCity: string;
  selectedService: string;
  location?: Location;
}

interface CityServiceCombo {
  city: string;
  service: string;
}

export default function ServiceRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [combos, setCombos] = useState<CityServiceCombo[]>([]);
  const [combosLoading, setCombosLoading] = useState(true);

  const [formState, setFormState] = useState<FormState>({
    name: '',
    phoneNumber: '',
    address: '',
    description: '',
    selectedCity: '',
    selectedService: '',
  });

  useEffect(() => {
    // Fetch real city/service combinations from the API
    const fetchCombos = async () => {
      setCombosLoading(true);
      try {
        const response = await fetch('/api/available-city-service-combos');
        if (response.ok) {
          const data = await response.json();
          setCombos(data);
        } else {
          console.error('Failed to fetch city/service combinations');
          // Fallback to minimal hardcoded data if API fails
          setCombos([
            { city: 'Amsterdam', service: 'Plumbing' },
            { city: 'Amsterdam', service: 'Electrician' },
            { city: 'Rotterdam', service: 'Plumbing' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching combinations:', error);
        // Fallback to minimal hardcoded data if API fails
        setCombos([
          { city: 'Amsterdam', service: 'Plumbing' },
          { city: 'Amsterdam', service: 'Electrician' },
          { city: 'Rotterdam', service: 'Plumbing' },
        ]);
      } finally {
        setCombosLoading(false);
      }
    };

    fetchCombos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));

    if (name === 'selectedCity' && value && currentStep === 1) {
      setCurrentStep(2);
    } else if (name === 'selectedService' && value && currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setFormState(prev => ({
      ...prev,
      location,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        name: formState.name,
        phoneNumber: formState.phoneNumber,
        city: formState.selectedCity,
        service: formState.selectedService,
        address: formState.location?.formatted_location || formState.address || '',
        description: formState.description || '',
      };

      console.log('Form submitted with payload:', payload);
      
      // Submit to the actual API
      const response = await fetch('/api/service-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setIsSuccess(true);
      setIsSubmitted(true);
      setCurrentStep(4);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormState({
      name: '',
      phoneNumber: '',
      address: '',
      description: '',
      selectedCity: '',
      selectedService: '',
    });
    setIsSuccess(false);
    setIsSubmitted(false);
    setCurrentStep(1);
  };

  return (
    <div className="relative mx-auto w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-500/50 shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8">
      {isSubmitted ? (
        <div className="transition-all duration-500">
          {isSuccess && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg text-green-700 dark:text-green-300 text-sm border border-green-200 dark:border-green-700 animate-fade-in">
              Form submitted successfully!
            </div>
          )}
          <SuccessMessage
            currentStep={currentStep}
            getSelectedCity={() => formState.selectedCity}
            getSelectedService={() => formState.selectedService}
            resetForm={resetForm}
          />
        </div>
      ) : combosLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading options...</p>
        </div>
      ) : (
        <>
          <ProgressBar currentStep={currentStep} totalSteps={4} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormStepSelector
              currentStep={currentStep}
              combos={combos}
              formState={formState}
              setFormState={setFormState}
              setCurrentStep={setCurrentStep}
            />

            <FormStepDetails
              currentStep={currentStep}
              formState={formState}
              handleChange={handleChange}
              handleLocationSelect={handleLocationSelect}
              setCurrentStep={setCurrentStep}
            />

            <FormStepSubmit
              currentStep={currentStep}
              isLoading={isLoading}
              setCurrentStep={setCurrentStep}
            />

            {error && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-700">
                {error}
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}
