// src/pages/MapPage.jsx
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import CrimeMap from '../components/map/CrimeMap';
import LocationSearch from '../components/map/LocationSearch';
import MapControls from '../components/map/MapControls';
import SearchFilters from '../components/search/SearchFilters';
import Card from '../components/common/Card';

const MapPage = () => {
  const [mapFilters, setMapFilters] = useState({
    crimeTypes: [],
    startDate: null,
    endDate: null,
    radius: 5,
    showClusters: true,
    showHeatmap: false
  });
  
  const [searchLocation, setSearchLocation] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  
  const handleFilterChange = (filters) => {
    setMapFilters({ ...mapFilters, ...filters });
  };
  
  const handleLocationSelect = (location) => {
    setSearchLocation(location);
  };
  
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  
  return (
    <Layout>
      <div className="h-screen flex flex-col">
        <div className="py-4 px-4 sm:px-6 lg:px-8 bg-white shadow z-10">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Crime Map</h1>
            <div className="w-full md:w-auto mt-4 md:mt-0">
              <LocationSearch onSelect={handleLocationSelect} />
            </div>
          </div>
        </div>
        
        <div className="flex-grow flex">
          {isPanelOpen && (
            <div className="w-full md:w-80 bg-white shadow-md z-10 overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-medium mb-4">Filters</h2>
                <SearchFilters onChange={handleFilterChange} values={mapFilters} />
              </div>
            </div>
          )}
          
          <div className="flex-grow relative">
            <button 
              onClick={togglePanel}
              className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow"
            >
              {isPanelOpen ? '←' : '→'}
            </button>
            
            <MapControls 
              showClusters={mapFilters.showClusters}
              showHeatmap={mapFilters.showHeatmap}
              onChange={handleFilterChange}
              className="absolute top-4 right-4 z-10"
            />
            
            <CrimeMap 
              filters={mapFilters}
              centerLocation={searchLocation}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;