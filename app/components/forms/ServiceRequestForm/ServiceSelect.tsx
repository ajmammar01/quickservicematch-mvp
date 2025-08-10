import { useEffect, useState, Fragment } from "react";
import { Listbox, Transition } from '@headlessui/react';

interface ServiceSelectProps {
  selectedCity?: string;
  initialValue?: string;
  onServiceSelect: (serviceId: string, serviceName: string) => void;
  required?: boolean;
  label?: string;
}

interface CityServiceCombo {
  city: string;
  service: string;
}

export default function ServiceSelect({ selectedCity, initialValue, onServiceSelect, required, label = "Service Type" }: ServiceSelectProps) {
  const [services, setServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/available-city-service-combos");
        const combos: CityServiceCombo[] = await response.json();

        const filteredServices = combos
          .filter(combo => combo.city === selectedCity)
          .map(combo => combo.service);

        const uniqueServices = Array.from(new Set(filteredServices));
        setServices(uniqueServices);

        if (initialValue && uniqueServices.includes(initialValue)) {
          onServiceSelect(initialValue, initialValue);
        }
      } catch (error) {
        setErrorMessage('Unable to load services. Please try again later.');
        console.error('Error loading services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCity) {
      loadServices();
    }
  }, [selectedCity, initialValue, onServiceSelect]);

  const handleServiceChange = (service: string) => {
    onServiceSelect(service, service);
  };

  if (isLoading) {
    return <div>Loading services...</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <Listbox value={initialValue || ''} onChange={handleServiceChange}>
        <div className="relative mt-1">
          <Listbox.Button className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 text-left">
            <span className="block truncate">
              {initialValue || 'Select a service'}
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
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none sm:text-sm">
              {services.map((service) => (
                <Listbox.Option
                  key={service}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-4 pr-9 ${
                      active 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
                        : 'text-gray-900 dark:text-white'
                    }`
                  }
                  value={service}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {service}
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
      {errorMessage && (
        <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
