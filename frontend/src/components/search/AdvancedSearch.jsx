// components/search/AdvancedSearch.jsx
import React, { useState, useEffect } from 'react';
import { useCrimeData } from '../../hooks/useCrimeData';
import { UseGeolocation } from '../../hooks/useGeolocation';
import Button from '../common/Button';
import MapControls from '../map/MapControls';
import LocationSearch from '../map/LocationSearch';

const AdvancedSearch = ({ onSearch }) => {
  const { getAgencies } = useCrimeData();
  const { getCurrentLocation } = UseGeolocation();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({
    location: {
      lat: null,
      lng: null,
      address: '',
    },
    radius: 5, // Default radius in kilometers
    agencyId: '',
    keywords: '',
    includeRelated: false,
    timePeriod: 'all', // all, today, week, month, year, custom
    customPeriod: {
      start: '',
      end: '',
    },
  });

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const agencyList = await getAgencies();
        setAgencies(agencyList);
      } catch (error) {
        console.error('Error fetching agencies:', error);
      }
    };

    fetchAgencies();
  }, [getAgencies]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSearchParams(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setSearchParams(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleLocationSelect = (location) => {
    setSearchParams(prev => ({
      ...prev,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address,
      }
    }));
  };

  // Remove the unused handleRadiusChange function

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    try {
      const position = await getCurrentLocation();
      if (position) {
        setSearchParams(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location',
          }
        }));
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const resetForm = () => {
    setSearchParams({
      location: {
        lat: null,
        lng: null,
        address: '',
      },
      radius: 5,
      agencyId: '',
      keywords: '',
      includeRelated: false,
      timePeriod: 'all',
      customPeriod: {
        start: '',
        end: '',
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6">Advanced Search</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Location</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <LocationSearch onSelect={handleLocationSelect} />
            </div>
            <div className="flex items-end">
              <Button 
                type="button"
                variant="secondary"
                onClick={handleGetCurrentLocation}
                isLoading={loading}
              >
                Use Current Location
              </Button>
            </div>
          </div>

          {searchParams.location.lat && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Radius (km)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  name="radius"
                  min="1"
                  max="50"
                  value={searchParams.radius}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <span className="ml-3 w-12 text-center">{searchParams.radius}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agency
            </label>
            <select
              name="agencyId"
              value={searchParams.agencyId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Agencies</option>
              {agencies.map(agency => (
                <option key={agency.id} value={agency.id}>{agency.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <input
              type="text"
              name="keywords"
              value={searchParams.keywords}
              onChange={handleInputChange}
              placeholder="Enter keywords..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Time Period</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {['all', 'today', 'week', 'month', 'year', 'custom'].map(period => (
              <div key={period} className="flex items-center">
                <input
                  type="radio"
                  id={`period-${period}`}
                  name="timePeriod"
                  value={period}
                  checked={searchParams.timePeriod === period}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`period-${period}`} className="ml-2 block text-sm text-gray-700 capitalize">
                  {period === 'all' ? 'All Time' : period}
                </label>
              </div>
            ))}
          </div>

          {searchParams.timePeriod === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="customPeriod.start"
                  value={searchParams.customPeriod.start}
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
                  name="customPeriod.end"
                  value={searchParams.customPeriod.end}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeRelated"
              name="includeRelated"
              checked={searchParams.includeRelated}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="includeRelated" className="ml-2 block text-sm text-gray-700">
              Include related crimes
            </label>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" variant="primary">
            Search
          </Button>
          <Button type="button" variant="secondary" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;