import React, { useState, useEffect, useCallback } from 'react';
import { CrimeDataContext } from './CrimeDataContext';
import { crimeService } from '../services/crimeService';
import { useAuth } from './AuthContext';

export const CrimeDataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [crimeData, setCrimeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    crimeType: '',
    startDate: '',
    endDate: '',
    location: '',
    radius: 5,
    severity: []
  });
  const [stats, setStats] = useState({
    totalCrimes: 0,
    byType: {},
    byTime: {},
    hotspots: []
  });

  const fetchCrimeData = useCallback(async (parameters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await crimeService.getCrimeData(parameters);
      setCrimeData(response.data);
      setFilteredData(response.data);
      calculateStats(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching crime data:', error);
      setError('Failed to fetch crime data. Please try again later.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = (data) => {
    const totalCrimes = data.length;
    const byType = data.reduce((acc, crime) => {
      acc[crime.type] = (acc[crime.type] || 0) + 1;
      return acc;
    }, {});

    const byTime = data.reduce((acc, crime) => {
      const hour = new Date(crime.date).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const locations = {};
    data.forEach(crime => {
      const key = `${Math.round(crime.latitude * 100) / 100},${Math.round(crime.longitude * 100) / 100}`;
      locations[key] = (locations[key] || 0) + 1;
    });

    const hotspots = Object.entries(locations)
      .filter(([, count]) => count > 3)
      .map(([coords, count]) => {
        const [lat, lng] = coords.split(',').map(Number);
        return { latitude: lat, longitude: lng, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setStats({ totalCrimes, byType, byTime, hotspots });
  };

  const applyFilters = useCallback(() => {
    const filtered = crimeData.filter(crime => {
      if (filters.crimeType && crime.type !== filters.crimeType) return false;
      if (filters.startDate && new Date(crime.date) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(crime.date) > new Date(filters.endDate)) return false;
      if (filters.severity.length > 0 && !filters.severity.includes(crime.severity)) return false;
      return true;
    });

    setFilteredData(filtered);
    calculateStats(filtered);
  }, [crimeData, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      crimeType: '',
      startDate: '',
      endDate: '',
      location: '',
      radius: 5,
      severity: []
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCrimeData();
    }
  }, [isAuthenticated, fetchCrimeData]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const getPrediction = async (latitude, longitude, date) => {
    try {
      const response = await crimeService.getPrediction({ latitude, longitude, date });
      return response.data;
    } catch (error) {
      console.error('Error getting prediction:', error);
      throw error;
    }
  };

  return (
    <CrimeDataContext.Provider value={{
      crimeData,
      filteredData,
      loading,
      error,
      filters,
      stats,
      fetchCrimeData,
      updateFilters,
      resetFilters,
      getPrediction
    }}>
      {children}
    </CrimeDataContext.Provider>
  );
};
