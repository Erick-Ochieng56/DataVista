import React, { useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';

const LocationSearch = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getCurrentLocation } = useGeolocation();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      
      if (!response.ok) throw new Error('Failed to search location');
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Error searching location. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = (result) => {
    onLocationSelect([parseFloat(result.lat), parseFloat(result.lon)]);
    setSearchResults([]);
    setSearchQuery(result.display_name.split(',')[0]);
  };

  const handleMyLocationClick = () => {
    getCurrentLocation((position) => {
      onLocationSelect([position.latitude, position.longitude]);
    });
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          Search
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleMyLocationClick}
        >
          My Location
        </button>
      </form>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      {searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
          <ul className="py-1">
            {searchResults.map((result) => (
              <li
                key={result.place_id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLocationClick(result)}
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;