// src/components/analytics/TimeSeriesAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useCrimeData } from '../../hooks/useCrimeData';
import Card from '../common/Card';
import Dropdown from '../common/Dropdown';
import Loader from '../common/Loader';

const TimeSeriesAnalysis = () => {
  const { fetchTimeSeriesData, loadingTimeSeries, timeSeriesData } = useCrimeData();
  
  const [timeRange, setTimeRange] = useState('1-year');
  const [crimeType, setCrimeType] = useState('all');
  const [location, setLocation] = useState('');
  const [forecastEnabled, setForecastEnabled] = useState(false);
  const [intervalType, setIntervalType] = useState('monthly');
  
  const timeRangeOptions = [
    { value: '3-months', label: 'Last 3 Months' },
    { value: '6-months', label: 'Last 6 Months' },
    { value: '1-year', label: 'Last Year' },
    { value: '5-years', label: 'Last 5 Years' }
  ];
  
  const crimeTypeOptions = [
    { value: 'all', label: 'All Crime Types' },
    { value: 'theft', label: 'Theft' },
    { value: 'assault', label: 'Assault' },
    { value: 'burglary', label: 'Burglary' },
    { value: 'homicide', label: 'Homicide' },
    { value: 'vehicle', label: 'Vehicle Theft' }
  ];
  
  const intervalTypeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];
  
  useEffect(() => {
    loadTimeSeriesData();
  }, []);
  
  const loadTimeSeriesData = async () => {
    try {
      await fetchTimeSeriesData({
        timeRange,
        crimeType,
        location,
        forecastEnabled,
        intervalType
      });
    } catch (error) {
      console.error('Error loading time series data:', error);
    }
  };
  
  const handleApplyFilters = () => {
    loadTimeSeriesData();
  };
  
  const renderChart = () => {
    if (loadingTimeSeries) {
      return (
        <div className="flex justify-center items-center h-80">
          <Loader size="lg" />
        </div>
      );
    }
    
    if (!timeSeriesData || timeSeriesData.length === 0) {
      return (
        <div className="flex justify-center items-center h-80 text-gray-500">
          No data available for the selected filters
        </div>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={timeSeriesData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#1E40AF"
            name="Actual Crime Count"
            activeDot={{ r: 8 }}
          />
          {forecastEnabled && (
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#EF4444"
              name="Forecasted Crime Count"
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Time Series Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-2">Time Range</label>
          <Dropdown 
            options={timeRangeOptions} 
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Crime Type</label>
          <Dropdown 
            options={crimeTypeOptions} 
            value={crimeType}
            onChange={(value) => setCrimeType(value)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Interval</label>
          <Dropdown 
            options={intervalTypeOptions} 
            value={intervalType}
            onChange={(value) => setIntervalType(value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-2">Location (Optional)</label>
          <input
            type="text"
            placeholder="Enter address or leave blank for all"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center mt-8">
            <input
              type="checkbox"
              id="forecastEnabled"
              checked={forecastEnabled}
              onChange={(e) => setForecastEnabled(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="forecastEnabled">Enable Forecast Projection</label>
          </div>
          
          <button
            onClick={handleApplyFilters}
            className="ml-auto mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Crime Trends Over Time</h3>
            {renderChart()}
          </div>
        </Card>
      </div>
      
      {timeSeriesData && timeSeriesData.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Peak Crime Periods</h3>
              <div className="text-3xl font-bold text-blue-600">
                {timeSeriesData.reduce((max, point) => (point.count > max.count ? point : max), timeSeriesData[0]).date}
              </div>
              <p className="text-gray-500 mt-2">Highest recorded crimes in selected period</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Average Incidents</h3>
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(timeSeriesData.reduce((sum, point) => sum + point.count, 0) / timeSeriesData.length)}
              </div>
              <p className="text-gray-500 mt-2">Average incidents per {intervalType.slice(0, -2)}</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Trend Direction</h3>
              {timeSeriesData.length > 2 && (
                <>
                  <div className={`text-3xl font-bold ${
                    timeSeriesData[timeSeriesData.length - 1].count > timeSeriesData[0].count
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}>
                    {timeSeriesData[timeSeriesData.length - 1].count > timeSeriesData[0].count
                      ? 'Increasing'
                      : 'Decreasing'}
                  </div>
                  <p className="text-gray-500 mt-2">Based on beginning vs. end of time range</p>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TimeSeriesAnalysis;