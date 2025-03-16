import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useCrimeData } from '../../hooks/useCrimeData';
import { useGeolocation } from '../../hooks/useGeolocation';
import MapControls from './MapControls';
import ClusterMarker from './ClusterMarker';
import LocationSearch from './LocationSearch';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CrimeTypeIcon = ({ type }) => {
  const getIconByType = (type) => {
    // Create different icons for different crime types
    const iconOptions = {
      theft: L.icon({
        iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        className: 'marker-icon-theft',
      }),
      violence: L.icon({
        iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        className: 'marker-icon-violence',
      }),
      // Add more crime types as needed
    };
    
    return iconOptions[type] || L.icon({
      iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  return getIconByType(type);
};

// Component to handle map view updates
const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

const CrimeMap = () => {
  const { crimeData, loading, error } = useCrimeData();
  const { location } = useGeolocation();
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default: San Francisco
  const [mapZoom, setMapZoom] = useState(13);
  const [filters, setFilters] = useState({
    crimeType: 'all',
    dateRange: {
      start: null,
      end: null,
    },
    showClusters: true,
  });

  // Set map center to user's location when available
  useEffect(() => {
    if (location) {
      setMapCenter([location.latitude, location.longitude]);
    }
  }, [location]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleLocationSelect = (coords) => {
    setMapCenter(coords);
    setMapZoom(15);
  };

  // Filter crime data based on selected filters
  const filteredCrimes = crimeData.filter(crime => {
    if (filters.crimeType !== 'all' && crime.type !== filters.crimeType) {
      return false;
    }
    
    if (filters.dateRange.start && new Date(crime.date) < new Date(filters.dateRange.start)) {
      return false;
    }
    
    if (filters.dateRange.end && new Date(crime.date) > new Date(filters.dateRange.end)) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading crime data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading crime data: {error}</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex flex-wrap gap-4">
        <LocationSearch onLocationSelect={handleLocationSelect} />
        <MapControls filters={filters} onFilterChange={handleFilterChange} />
      </div>
      
      <div className="flex-1 rounded-lg overflow-hidden shadow-lg border border-gray-300">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapViewUpdater center={mapCenter} zoom={mapZoom} />
          
          {filters.showClusters ? (
            <ClusterMarker crimes={filteredCrimes} />
          ) : (
            filteredCrimes.map((crime) => (
              <Marker 
                key={crime.id} 
                position={[crime.latitude, crime.longitude]}
                icon={CrimeTypeIcon({ type: crime.type })}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{crime.type}</h3>
                    <p>{crime.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(crime.date).toLocaleDateString()} at {new Date(crime.date).toLocaleTimeString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default CrimeMap;