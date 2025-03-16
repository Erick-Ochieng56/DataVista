// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import CrimeStats from '../components/dashboard/CrimeStats';

const HomePage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Crime Analysis System
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl">
              Advanced crime analysis and prediction platform designed for law enforcement and security agencies.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link to="/dashboard">
                <Button variant="white">
                  Dashboard
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="outline">
                  Crime Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-lg font-semibold mb-4">Real-time Crime Mapping</div>
            <p className="text-gray-600">
              Visualize crime incidents on an interactive map. Identify patterns, hotspots, and trends to allocate resources effectively.
            </p>
            <Link to="/map" className="text-blue-600 hover:text-blue-800 font-medium inline-block mt-4">
              Explore Map →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-lg font-semibold mb-4">Predictive Analytics</div>
            <p className="text-gray-600">
              Leverage advanced algorithms to predict crime patterns. Stay one step ahead with accurate forecasting and risk assessment.
            </p>
            <Link to="/analytics" className="text-blue-600 hover:text-blue-800 font-medium inline-block mt-4">
              View Analytics →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-lg font-semibold mb-4">Custom Reports</div>
            <p className="text-gray-600">
              Generate comprehensive reports tailored to your needs. Export and share insights with stakeholders.
            </p>
            <Link to="/reports" className="text-blue-600 hover:text-blue-800 font-medium inline-block mt-4">
              Create Reports →
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Current Crime Overview</h2>
          <CrimeStats />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;