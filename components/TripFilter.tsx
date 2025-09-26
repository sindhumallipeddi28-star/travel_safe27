import React from 'react';
import { TRAVEL_MODES, TRIP_PURPOSES } from '../constants';
import { TravelMode, TripPurpose } from '../types';

interface Filters {
  mode: TravelMode | '';
  purpose: TripPurpose | '';
  startDate: string;
  endDate: string;
}

interface TripFilterProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  tripCount: number;
}

export const TripFilter: React.FC<TripFilterProps> = ({ filters, onFilterChange, tripCount }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };
  
  const handleReset = () => {
    onFilterChange({
      mode: '',
      purpose: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-gray-700">Mode</label>
          <select id="mode" name="mode" value={filters.mode} onChange={handleChange} className="form-input mt-1">
            <option value="">All</option>
            {TRAVEL_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose</label>
          <select id="purpose" name="purpose" value={filters.purpose} onChange={handleChange} className="form-input mt-1">
            <option value="">All</option>
            {TRIP_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" id="startDate" name="startDate" value={filters.startDate} onChange={handleChange} className="form-input mt-1" />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" id="endDate" name="endDate" value={filters.endDate} onChange={handleChange} className="form-input mt-1" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-slate-500">Showing {tripCount} trip(s).</p>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset Filters
        </button>
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