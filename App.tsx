
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TripList } from './components/TripList';
import { TripForm } from './components/TripForm';
import { PlusIcon } from './components/icons/PlusIcon';
import type { Trip } from './types';
import { TravelMode, TripPurpose } from './types';
import { TripFilter } from './components/TripFilter';

interface FilterState {
  mode: TravelMode | '';
  purpose: TripPurpose | '';
  startDate: string;
  endDate: string;
}

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    mode: '',
    purpose: '',
    startDate: '',
    endDate: '',
  });

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const query = new URLSearchParams();
    if (filters.mode) query.append('mode', filters.mode);
    if (filters.purpose) query.append('purpose', filters.purpose);
    if (filters.startDate) query.append('startDate', filters.startDate);
    if (filters.endDate) query.append('endDate', filters.endDate);

    try {
      const response = await fetch(`/api/trips?${query.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      const data: Trip[] = await response.json();
      setTrips(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleSaveTrip = async (newTripData: Omit<Trip, 'id' | 'tripNumber'>) => {
    try {
      setError(null);
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTripData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          const errorMessages = Object.values(errorData.errors || { general: 'Please check your input.' }).join(' ');
          throw new Error(`${errorData.message || 'Validation failed'}: ${errorMessages}`);
        }
        throw new Error('Failed to save trip to the server.');
      }

      await fetchTrips();
      setIsFormVisible(false);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'Could not save the trip. Please review your data.');
       console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <TripFilter 
            filters={filters} 
            onFilterChange={setFilters} 
            tripCount={trips.length}
        />
        {isLoading ? (
            <div className="text-center py-20">Loading trips...</div>
        ) : error && !isFormVisible ? ( // Only show main error when form is hidden
            <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
            <TripList trips={trips} />
        )}
      </main>
      
      {!isFormVisible && (
        <button
          onClick={() => {
            setIsFormVisible(true);
            setError(null); // Clear error on form open
          }}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Add New Trip"
        >
          <PlusIcon />
        </button>
      )}

      {isFormVisible && (
        <TripForm
          onSave={handleSaveTrip}
          onCancel={() => {
            setIsFormVisible(false);
            setError(null); // Clear error on form cancel
          }}
          serverError={error}
        />
      )}
    </div>
  );
};

export default App;
