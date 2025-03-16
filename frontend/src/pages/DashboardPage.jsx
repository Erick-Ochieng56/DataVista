// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../components/dashboard/Dashboard';
import { useCrimeData } from '../hooks/useCrimeData';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';

const DashboardPage = () => {
  const { fetchCrimeStats, fetchCrimeTrends, loadingStats, crimeStats } = useCrimeData();
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          fetchCrimeStats(),
          fetchCrimeTrends()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    loadDashboardData();
  }, []);
  
  return (
    <Layout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of crime statistics and trends
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link 
              to="/reports/generate" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Generate Report
            </Link>
            <Link 
              to="/alerts" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage Alerts
            </Link>
          </div>
        </div>
        
        {loadingStats ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : (
          <Dashboard />
        )}
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <Link to="/map" className="block p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">Crime Map</h3>
                <p className="mt-2 text-sm text-gray-500">
                  View geographic distribution of incidents
                </p>
              </Link>
            </Card>
            
            <Card>
              <Link to="/analytics" className="block p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
                <p className="mt-2 text-sm text-gray-500">
                  In-depth crime data analysis
                </p>
              </Link>
            </Card>
            
            <Card>
              <Link to="/search" className="block p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">Search</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Find specific incidents
                </p>
              </Link>
            </Card>
            
            <Card>
              <Link to="/alerts/new" className="block p-6 hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-medium text-gray-900">Create Alert</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Set up new crime notifications
                </p>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;