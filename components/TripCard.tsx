import React from 'react';
import type { Trip } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { MapIcon } from './icons/MapIcon';
import { RouteIcon } from './icons/RouteIcon';
import { TagIcon } from './icons/TagIcon';
import { UsersIcon } from './icons/UsersIcon';
import { RepeatIcon } from './icons/RepeatIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';

interface TripCardProps {
  trip: Trip;
}

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 h-6 w-6 text-slate-500">{icon}</div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  </div>
);


export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const hasCompanions = trip.companions != null && Number(trip.companions) > 0;
  const hasCost = trip.cost != null && Number(trip.cost) > 0;
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg ${hasCost ? 'border-l-4 border-amber-400' : ''}`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-800">Trip #{trip.tripNumber}</h3>
          <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{trip.mode}</span>
        </div>

        <div className="flex items-center space-x-4 text-slate-600 mb-6">
          <div className="flex items-center">
            <LocationPinIcon className="w-5 h-5 text-green-500 mr-2" />
            <span className="font-semibold">{`${trip.origin.lat}, ${trip.origin.lon}`}</span>
          </div>
          <div className="flex-grow border-t border-slate-300 border-dashed"></div>
          <MapIcon className="w-6 h-6 text-slate-500" />
          <div className="flex-grow border-t border-slate-300 border-dashed"></div>
          <div className="flex items-center">
            <LocationPinIcon className="w-5 h-5 text-red-500 mr-2" />
            <span className="font-semibold">{`${trip.destination.lat}, ${trip.destination.lon}`}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4 text-sm">
            <InfoItem icon={<ClockIcon />} label="Start Time" value={new Date(trip.startTime).toLocaleString()} />
            <InfoItem icon={<ClockIcon />} label="End Time" value={new Date(trip.endTime).toLocaleString()} />
            <InfoItem icon={<RouteIcon />} label="Distance" value={`${trip.distance} km`} />
            <InfoItem icon={<TagIcon />} label="Purpose" value={trip.purpose} />
            <InfoItem 
                icon={<UsersIcon className={hasCompanions ? 'text-sky-600' : ''} />} 
                label="Companions" 
                value={trip.companions} 
            />
            <InfoItem icon={<RepeatIcon />} label="Frequency" value={trip.frequency} />
            <InfoItem 
                icon={<CurrencyDollarIcon className={hasCost ? 'text-amber-600' : ''} />}
                label="Cost" 
                value={`₹${trip.cost}`} 
            />
        </div>
      </div>
    </div>
  );
};