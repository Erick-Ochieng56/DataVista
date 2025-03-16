// src/components/analytics/HeatmapView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useCrimeData } from '../../hooks/useCrimeData';
import Dropdown from '../common/Dropdown';
import Loader from '../common/Loader';
import Button from '../common/Button';

const HeatmapView = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const { fetchHeatmapData, loadingHeatmap } = useCrimeData();
  
  const [crimeType, setCrimeType] = useState('all');
  const [timeRange, setTimeRange] = useState('1-year');
  const [timeOfDay, setTimeOfDay] = useState('all');
  const [intensity, setIntensity] = useState(0.6);
  const [radius, setRadius] = useState(25);
  const [heatmapData, setHeatmapData] = useState([]);
  
  const crimeTypeOptions = [
    { value: 'all', label: 'All Crime Types' },
    { value: 'theft', label: 'Theft' },
    { value: 'assault', label: 'Assault' },
    { value: 'burglary', label: 'Burglary' },
    { value: 'homicide', label: 'Homicide' },
    { value: 'vehicle', label: 'Vehicle Theft' }
  ];
  
  const timeRangeOptions = [
    { value: '1-month', label: 'Last Month' },
    { value: '3-months', label: 'Last 3 Months' },
    { value: '6-months', label: 'Last 6 Months' },
    { value: '1-year', label: 'Last Year' }
  ];
  
  const timeOfDayOptions = [
    { value: 'all', label: 'All Hours' },
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-12AM)' },
    { value: 'night', label: 'Night (12AM-6AM)' }
  ];
  
  useEffect(() => {
    // Initialize map when component mounts
    initMap();
    return () => {
      // Clean up map when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);
  
  useEffect(() => {
    // Load initial data
    loadHeatmapData();
  }, []);
  
  useEffect(() => {
    // Update heatmap when data changes
    if (mapInstanceRef.current && heatmapLayerRef.current && heatmapData.length > 0) {
      updateHeatmap();
    }
  }, [heatmapData, intensity, radius]);
  
  const initMap = () => {
    if (!mapRef.current) return;
    
    // Using Leaflet for the map
    // Note: You need to include Leaflet CSS and JS in your index.html
    const L = window.L;
    if (!L) {
      console.error('Leaflet not loaded');
      return;
    }
    
    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([37.7749, -122.4194], 13);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current);
    
    // Initialize empty heatmap layer
    heatmapLayerRef.current = L.heatLayer([], {
      radius: radius,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: { 0.4: 'blue', 0.65: 'lime', 0.8: 'yellow', 1.0: 'red' }
    }).addTo(mapInstanceRef.current);
  };
  
  const loadHeatmapData = async () => {
    try {
      const data = await fetchHeatmapData({
        crimeType,
        timeRange,
        timeOfDay
      });
      
      setHeatmapData(data);
    } catch (error) {
      console.error('Error loading heatmap data:', error);
    }
  };
  
  const updateHeatmap = () => {
    const L = window.L;
    if (!L || !heatmapLayerRef.current) return;
    
    // Transform data for heatmap layer
    const points = heatmapData.map(point => {
      return [
        point.latitude,
        point.longitude,
        point.intensity * intensity
      ];
    });
    
    // Update heatmap layer with new data and settings
    heatmapLayerRef.current.setLatLngs(points);
    heatmapLayerRef.current.setOptions({
      radius: radius
    });
  };
  
  const handleApplyFilters = () => {
    loadHeatmapData();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-6">Crime Heatmap Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Crime Type</label>
            <Dropdown 
              options={crimeTypeOptions} 
              value={crimeType}
              onChange={(value) => setCrimeType(value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Time Range</label>
            <Dropdown 
              options={timeRangeOptions} 
              value={timeRange}
              onChange={(value) => setTimeRange(value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Time of Day</label>
            <Dropdown 
              options={timeOfDayOptions} 
              value={timeOfDay}
              onChange={(value) => setTimeOfDay(value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Intensity: {intensity}</label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Radius: {radius}px</label>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={handleApplyFilters}
              variant="primary"
              className="w-full"
              disabled={loadingHeatmap}
            >
              {loadingHeatmap ? <Loader size="sm" /> : 'Apply Filters'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {loadingHeatmap && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <Loader size="lg" />
          </div>
        )}
        <div ref={mapRef} className="h-96 w-full"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Heatmap Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Hotspot Concentration</h4>
            <p>The map reveals {heatmapData.length > 0 ? `${Math.round(heatmapData.length * 0.2)} major` : 'multiple'} crime hotspots concentrated in specific areas.</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Temporal Patterns</h4>
            <p>Crime incidents show {timeOfDay === 'night' ? 'significant nighttime' : timeOfDay === 'morning' ? 'morning' : 'varying'} patterns across the selected areas.</p>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Crime Type Distribution</h4>
            <p>{crimeType === 'all' ? 'Multiple crime types' : crimeType.charAt(0).toUpperCase() + crimeType.slice(1)} are most common in the highlighted regions of the map.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapView;