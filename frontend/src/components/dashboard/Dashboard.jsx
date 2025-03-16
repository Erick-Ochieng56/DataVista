import React, { useState, useEffect } from 'react';
import CrimeStats from './CrimeStats';
import CrimeTrends from './CrimeTrends';
import { useCrimeData } from '../../hooks/useCrimeData';

const Dashboard = () => {
  const { crimeData, loading, error } = useCrimeData();
  const [timeRange, setTimeRange] = useState('week'); // week, month, year, all
  const [selectedArea, setSelectedArea] = useState('all');
  const [filteredData, setFilteredData] = useState([]);

  // Effect to filter data based on selected time range and area
  useEffect(() => {
    if (!crimeData.length) return;

    let filtered = [...crimeData];
    
    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(crime => new Date(crime.date) >= startDate);
      }
    }
    
    // Filter by area
    if (selectedArea !== 'all') {
      filtered = filtered.filter(crime => crime.area === selectedArea);
    }
    
    setFilteredData(filtered);
  }, [crimeData, timeRange, selectedArea]);

  // Get unique areas from crime data
  const areas = crimeData.length
    ? ['all', ...new Set(crimeData.map(crime => crime.area))]
    : ['all'];

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading crime data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Crime Analytics Dashboard</h1>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                id="timeRange"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area
              </label>
              <select
                id="area"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                {areas.map(area => (
                  <option key={area} value={area}>
                    {area === 'all' ? 'All Areas' : area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <CrimeStats data={filteredData} />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Crime Trends</h2>
        <CrimeTrends data={filteredData} timeRange={timeRange} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Crime by Type</h2>
          {/* Crime by Type Chart Component */}
          <div className="h-80">
            {filteredData.length > 0 ? (
              <CrimeByTypeChart data={filteredData} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Crime by Time of Day</h2>
          {/* Crime by Time Chart Component */}
          <div className="h-80">
            {filteredData.length > 0 ? (
              <CrimeByTimeChart data={filteredData} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Crime By Type Chart Component
const CrimeByTypeChart = ({ data }) => {
  // Group data by crime type
  const crimeByType = data.reduce((acc, crime) => {
    acc[crime.type] = (acc[crime.type] || 0) + 1;
    return acc;
  }, {});
  
  const chartData = Object.keys(crimeByType).map(type => ({
    name: type,
    value: crimeByType[type]
  }));
  
  // Render with a chart library like Recharts
  return (
    <div className="h-full">
      {/* Placeholder for actual chart implementation */}
      <div className="h-full flex flex-col justify-center">
        <div className="space-y-2">
          {chartData.map(item => (
            <div key={item.name} className="flex items-center">
              <div className="w-1/3 text-sm font-medium">{item.name}</div>
              <div className="w-2/3">
                <div className="relative h-5">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-r"
                    style={{ width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%` }}
                  ></div>
                  <div className="absolute top-0 right-2 text-xs font-medium">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Crime By Time Chart Component
const CrimeByTimeChart = ({ data }) => {
  // Group data by hour of day
  const crimeByHour = Array(24).fill(0);
  
  data.forEach(crime => {
    const hour = new Date(crime.date).getHours();
    crimeByHour[hour]++;
  });
  
  const chartData = crimeByHour.map((count, hour) => ({
    hour: hour,
    count: count
  }));
  
  // Render with a chart library like Recharts
  return (
    <div className="h-full">
      {/* Placeholder for actual chart implementation */}
      <div className="h-full flex items-end justify-between">
        {chartData.map(item => (
          <div key={item.hour} className="flex flex-col items-center">
            <div 
              className="bg-primary w-6 rounded-t" 
              style={{ 
                height: `${item.count ? (item.count / Math.max(...chartData.map(d => d.count))) * 100 : 0}%`,
                minHeight: item.count ? '4px' : '0' 
              }}
            ></div>
            <div className="text-xs mt-1">{item.hour}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;