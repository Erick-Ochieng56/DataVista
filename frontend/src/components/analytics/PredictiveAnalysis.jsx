// src/components/analytics/PredictiveAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrimeData } from '../../hooks/useCrimeData';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';
import Dropdown from '../common/Dropdown';

const PredictiveAnalysis = () => {
  const navigate = useNavigate();
  const { fetchPredictions, loadingPredictions, predictions } = useCrimeData();
  
  const [selectedModel, setSelectedModel] = useState('hotspot');
  const [timeRange, setTimeRange] = useState('next-week');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(5);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const modelOptions = [
    { value: 'hotspot', label: 'Hotspot Analysis' },
    { value: 'time-series', label: 'Time Series Forecasting' },
    { value: 'regression', label: 'Regression Analysis' }
  ];
  
  const timeRangeOptions = [
    { value: 'next-week', label: 'Next Week' },
    { value: 'next-month', label: 'Next Month' },
    { value: 'next-quarter', label: 'Next Quarter' }
  ];

  const crimeTypeOptions = [
    { value: 'theft', label: 'Theft' },
    { value: 'assault', label: 'Assault' },
    { value: 'burglary', label: 'Burglary' },
    { value: 'homicide', label: 'Homicide' },
    { value: 'vehicle', label: 'Vehicle Theft' }
  ];

  const handleGeneratePrediction = async () => {
    setIsGenerating(true);
    try {
      await fetchPredictions({
        model: selectedModel,
        timeRange,
        location,
        radius,
        crimeTypes
      });
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCrimeTypeChange = (type) => {
    if (crimeTypes.includes(type)) {
      setCrimeTypes(crimeTypes.filter(t => t !== type));
    } else {
      setCrimeTypes([...crimeTypes, type]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Predictive Crime Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Model Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Analysis Model</label>
              <Dropdown 
                options={modelOptions} 
                value={selectedModel}
                onChange={(value) => setSelectedModel(value)}
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
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="Enter address or coordinates"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Radius (miles)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Crime Types</h3>
          <div className="space-y-2">
            {crimeTypeOptions.map((type) => (
              <div key={type.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`crime-type-${type.value}`}
                  checked={crimeTypes.includes(type.value)}
                  onChange={() => handleCrimeTypeChange(type.value)}
                  className="mr-2"
                />
                <label htmlFor={`crime-type-${type.value}`}>{type.label}</label>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={handleGeneratePrediction}
              variant="primary"
              disabled={isGenerating || !location || crimeTypes.length === 0}
              className="w-full"
            >
              {isGenerating ? <Loader size="sm" /> : 'Generate Prediction'}
            </Button>
          </div>
        </div>
      </div>
      
      {loadingPredictions ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : predictions && predictions.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Prediction Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Location</th>
                  <th className="py-2 px-4 border-b text-left">Crime Type</th>
                  <th className="py-2 px-4 border-b text-left">Risk Level</th>
                  <th className="py-2 px-4 border-b text-left">Probability</th>
                  <th className="py-2 px-4 border-b text-left">Timeframe</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b">{pred.location}</td>
                    <td className="py-2 px-4 border-b">{pred.crimeType}</td>
                    <td className="py-2 px-4 border-b">
                      <span 
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          pred.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                          pred.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {pred.riskLevel}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">{pred.probability}%</td>
                    <td className="py-2 px-4 border-b">{pred.timeframe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PredictiveAnalysis;