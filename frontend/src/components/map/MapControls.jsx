import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MapControls = ({ filters, onFilterChange }) => {
  const [startDate, setStartDate] = useState(filters.dateRange.start);
  const [endDate, setEndDate] = useState(filters.dateRange.end);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onFilterChange({
      dateRange: {
        ...filters.dateRange,
        start: date
      }
    });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onFilterChange({
      dateRange: {
        ...filters.dateRange,
        end: date
      }
    });
  };

  const handleCrimeTypeChange = (e) => {
    onFilterChange({ crimeType: e.target.value });
  };

  const handleClusterToggle = () => {
    onFilterChange({ showClusters: !filters.showClusters });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="crimeType" className="block text-sm font-medium text-gray-700 mb-1">
            Crime Type
          </label>
          <select
            id="crimeType"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={filters.crimeType}
            onChange={handleCrimeTypeChange}
          >
            <option value="all">All Types</option>
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="burglary">Burglary</option>
            <option value="vandalism">Vandalism</option>
            <option value="drug">Drug-related</option>
            <option value="fraud">Fraud</option>
            <option value="homicide">Homicide</option>
            <option value="robbery">Robbery</option>
            <option value="violence">Violence</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholderText="Select start date"
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholderText="Select end date"
          />
        </div>
        
        <div className="flex items-end flex-1 min-w-[150px]">
          <div className="flex items-center">
            <input
              id="clusters"
              type="checkbox"
              checked={filters.showClusters}
              onChange={handleClusterToggle}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="clusters" className="ml-2 block text-sm text-gray-700">
              Show Clusters
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;