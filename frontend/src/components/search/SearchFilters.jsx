// components/search/SearchFilters.jsx
import React, { useState, useEffect } from 'react';
import { useCrimeData } from '../../hooks/useCrimeData';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';

const SearchFilters = ({ onFilterChange }) => {
  const { getCrimeTypes, getCrimeStatus } = useCrimeData();
  const [filters, setFilters] = useState({
    crimeType: '',
    dateRange: {
      start: '',
      end: '',
    },
    status: '',
    severity: '',
  });
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const types = await getCrimeTypes();
        const statuses = await getCrimeStatus();
        setCrimeTypes(types);
        setStatusOptions(statuses);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, [getCrimeTypes, getCrimeStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilters({
      crimeType: '',
      dateRange: {
        start: '',
        end: '',
      },
      status: '',
      severity: '',
    });
    onFilterChange({});
  };

  const severityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filter Crimes</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crime Type
            </label>
            <Dropdown
              name="crimeType"
              value={filters.crimeType}
              options={crimeTypes.map(type => ({ value: type.id, label: type.name }))}
              onChange={handleInputChange}
              placeholder="All Types"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Dropdown
              name="status"
              value={filters.status}
              options={statusOptions.map(status => ({ value: status.id, label: status.name }))}
              onChange={handleInputChange}
              placeholder="All Statuses"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="dateRange.start"
              value={filters.dateRange.start}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="dateRange.end"
              value={filters.dateRange.end}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <Dropdown
              name="severity"
              value={filters.severity}
              options={severityOptions}
              onChange={handleInputChange}
              placeholder="All Severities"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <Button type="submit" variant="primary">
            Apply Filters
          </Button>
          <Button type="button" variant="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;