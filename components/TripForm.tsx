import React, { useState } from 'react';
import type { Trip } from '../types';
import { TRAVEL_MODES, TRIP_PURPOSES, TRIP_FREQUENCIES } from '../constants';
import { TravelMode, TripPurpose, TripFrequency } from '../types';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface TripFormProps {
  onSave: (trip: Omit<Trip, 'id' | 'tripNumber'>) => void;
  onCancel: () => void;
}

const initialFormData: Omit<Trip, 'id' | 'tripNumber'> = {
  origin: { lat: '', lon: '' },
  startTime: '',
  destination: { lat: '', lon: '' },
  endTime: '',
  mode: TravelMode.CAR,
  distance: '',
  purpose: TripPurpose.WORK,
  companions: 0,
  frequency: TripFrequency.DAILY,
  cost: '',
};

export const TripForm: React.FC<TripFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        // FIX: The type of `prev[parent]` with a general key is a union that includes non-object types.
        // Casting `parent` to the specific keys `'origin' | 'destination'` narrows the property's type
        // to an object, which can be safely spread.
        [parent]: {
          ...(prev[parent as 'origin' | 'destination']),
          [child]: value ? parseFloat(value) : '',
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          origin: {
            lat: parseFloat(position.coords.latitude.toFixed(6)),
            lon: parseFloat(position.coords.longitude.toFixed(6)),
          },
          startTime: new Date().toISOString().slice(0, 16)
        }));
        setIsLocating(false);
      },
      () => {
        setGeoError('Unable to retrieve your location. Please grant permission and try again.');
        setIsLocating(false);
      }
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        distance: Number(formData.distance),
        companions: Number(formData.companions),
        cost: Number(formData.cost)
    };
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <div className="flex items-center gap-2">
                  <input type="number" name="origin.lat" value={formData.origin.lat} onChange={handleChange} placeholder="Latitude" className="form-input" required />
                  <input type="number" name="origin.lon" value={formData.origin.lon} onChange={handleChange} placeholder="Longitude" className="form-input" required />
                  <button type="button" onClick={handleGetCurrentLocation} disabled={isLocating} className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-wait">
                    {isLocating ? <SpinnerIcon /> : <LocationPinIcon />}
                  </button>
                </div>
                 {geoError && <p className="text-red-500 text-xs mt-1">{geoError}</p>}
              </div>
              
              {/* Destination */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="flex items-center gap-2">
                  <input type="number" name="destination.lat" value={formData.destination.lat} onChange={handleChange} placeholder="Latitude" className="form-input" required />
                  <input type="number" name="destination.lon" value={formData.destination.lon} onChange={handleChange} placeholder="Longitude" className="form-input" required />
                </div>
              </div>

              {/* Timings */}
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="datetime-local" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} className="form-input" required />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="datetime-local" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} className="form-input" required />
              </div>

              {/* Trip Details */}
              <div>
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700">Mode of Transport</label>
                <select id="mode" name="mode" value={formData.mode} onChange={handleChange} className="form-input" required>
                  {TRAVEL_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Distance (km)</label>
                <input type="number" id="distance" name="distance" value={formData.distance} onChange={handleChange} className="form-input" required />
              </div>
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Trip Purpose</label>
                <select id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} className="form-input" required>
                  {TRIP_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="companions" className="block text-sm font-medium text-gray-700">Companions</label>
                <input type="number" id="companions" name="companions" min="0" value={formData.companions} onChange={handleChange} className="form-input" required />
              </div>
               <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
                <select id="frequency" name="frequency" value={formData.frequency} onChange={handleChange} className="form-input" required>
                  {TRIP_FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Cost (₹)</label>
                <input type="number" id="cost" name="cost" min="0" value={formData.cost} onChange={handleChange} className="form-input" required />
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Trip
            </button>
          </div>
        </form>
      </div>
       <style>{`
          .form-input {
            display: block;
            width: 100%;
            padding: 0.5rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            color: #334155;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #cbd5e1;
            border-radius: 0.375rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          }
          .form-input:focus {
            color: #334155;
            background-color: #fff;
            border-color: #3b82f6;
            outline: 0;
            box-shadow: 0 0 0 0.25rem rgb(59 130 246 / 25%);
          }
        `}</style>
    </div>
  );
};