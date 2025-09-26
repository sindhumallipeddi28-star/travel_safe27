import React from 'react';
import type { Trip } from '../types';
import { TripCard } from './TripCard';

interface TripListProps {
  trips: Trip[];
}

export const TripList: React.FC<TripListProps> = ({ trips }) => {
  if (trips.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-slate-700">No Trips Found</h2>
        <p className="text-slate-500 mt-2">Try adjusting your filters or add a new trip.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
};