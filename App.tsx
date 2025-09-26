import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { TripList } from './components/TripList';
import { TripForm } from './components/TripForm';
import { PlusIcon } from './components/icons/PlusIcon';
import type { Trip } from './types';
import { TravelMode, TripPurpose, TripFrequency } from './types';
import { TripFilter } from './components/TripFilter';

interface FilterState {
  mode: TravelMode | '';
  purpose: TripPurpose | '';
  startDate: string;
  endDate: string;
}

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      tripNumber: 1,
      origin: { lat: 12.9716, lon: 77.5946 },
      startTime: new Date('2023-10-27T09:00:00').toISOString(),
      destination: { lat: 12.9784, lon: 77.6408 },
      endTime: new Date('2023-10-27T09:45:00').toISOString(),
      mode: TravelMode.CAR,
      distance: 8,
      purpose: TripPurpose.WORK,
      companions: 1,
      frequency: TripFrequency.DAILY,
      cost: 150,
    },
    {
      id: '2',
      tripNumber: 2,
      origin: { lat: 12.9784, lon: 77.6408 },
      startTime: new Date('2023-10-28T18:00:00').toISOString(),
      destination: { lat: 12.9716, lon: 77.5946 },
      endTime: new Date('2023-10-28T18:30:00').toISOString(),
      mode: TravelMode.BUS,
      distance: 8.5,
      purpose: TripPurpose.SHOPPING,
      companions: 0,
      frequency: TripFrequency.OCCASIONALLY,
      cost: 40,
    }
  ]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    mode: '',
    purpose: '',
    startDate: '',
    endDate: '',
  });

  const handleSaveTrip = (newTripData: Omit<Trip, 'id' | 'tripNumber'>) => {
    const newTrip: Trip = {
      ...newTripData,
      id: crypto.randomUUID(),
      tripNumber: trips.length + 1,
    };
    setTrips(prevTrips => [...prevTrips, newTrip]);
    setIsFormVisible(false);
  };

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      if (filters.mode && trip.mode !== filters.mode) {
        return false;
      }
      if (filters.purpose && trip.purpose !== filters.purpose) {
        return false;
      }
      const tripDate = new Date(trip.startTime);
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (tripDate < startDate) {
          return false;
        }
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (tripDate > endDate) {
          return false;
        }
      }
      return true;
    });
  }, [trips, filters]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <TripFilter 
            filters={filters} 
            onFilterChange={setFilters} 
            tripCount={filteredTrips.length}
        />
        <TripList trips={filteredTrips} />
      </main>
      
      {!isFormVisible && (
        <button
          onClick={() => setIsFormVisible(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Add New Trip"
        >
          <PlusIcon />
        </button>
      )}

      {isFormVisible && (
        <TripForm
          onSave={handleSaveTrip}
          onCancel={() => setIsFormVisible(false)}
        />
      )}
    </div>
  );
};

export default App;