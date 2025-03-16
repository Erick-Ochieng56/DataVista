// src/pages/AnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TimeSeriesAnalysis from '../components/analytics/TimeSeriesAnalysis';
import HeatmapView from '../components/analytics/HeatmapView';
import PredictiveAnalysis from '../components/analytics/PredictiveAnalysis';
import { useCrimeData } from '../hooks/useCrimeData';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { loading, error, crimeData, fetchCrimeAnalytics } = useCrimeData();
  const [activeTab, setActiveTab] = useState('timeSeries');
  const [timeRange, setTimeRange] = useState('month');
  const [filters, setFilters] = useState({
    crimeTypes: [],
    locations: [],
    dateRange: { start: null, end: null }
  });

  useEffect(() => {
    fetchCrimeAnalytics(timeRange, filters);
  }, [timeRange, filters]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'timeSeries':
        return (
          <TimeSeriesAnalysis 
            data={crimeData?.timeSeries || []} 
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
            loading={loading}
          />
        );
      case 'heatmap':
        return (
          <HeatmapView 
            data={crimeData?.heatmapData || []} 
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
          />
        );
      case 'predictive':
        return (
          <PredictiveAnalysis 
            data={crimeData?.predictions || []} 
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
          />
        );
      default:
        return <div>Select an analysis type</div>;
    }
  };

  return (
    <Layout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crime Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Advanced analytics and predictive crime analysis tools
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="secondary" onClick={() => navigate('/reports')}>
              Generate Report
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-6 bg-red-50">
            <p className="text-red-600">Error loading analytics data: {error.message}</p>
          </Card>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'timeSeries' 
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('timeSeries')}
              >
                Time Series Analysis
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'heatmap' 
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('heatmap')}
              >
                Crime Heatmap
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'predictive' 
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('predictive')}
              >
                Predictive Analysis
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;