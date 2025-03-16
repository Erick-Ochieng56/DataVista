// pages/SearchPage.jsx
import React, { useState, useEffect,useCallback  } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SearchFilters from '../components/search/SearchFilters';
import AdvancedSearch from '../components/search/AdvancedSearch';
import SearchResults from '../components/search/SearchResults';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useCrimeData } from '../hooks/useCrimeData';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchCrimes, exportResults } = useCrimeData();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Load initial search from URL parameters if they exist
  useEffect(() => {
    const initialFilters = {};
    for (const [key, value] of searchParams.entries()) {
      initialFilters[key] = value;
    }
    
    if (Object.keys(initialFilters).length > 0) {
      handleSearch(initialFilters);
      setAppliedFilters(initialFilters);
    }
  }, [handleSearch, searchParams]);

  const handleFilterChange = async (filters) => {
    setAppliedFilters(filters);
    await handleSearch(filters);
    
    // Update URL with filters
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && typeof value !== 'object') {
        newSearchParams.set(key, value);
      } else if (value && typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue) {
            newSearchParams.set(`${key}_${subKey}`, subValue);
          }
          // pages/SearchPage.jsx (continued)
        });
    }
  });
  setSearchParams(newSearchParams);
};

const handleAdvancedSearch = async (params) => {
  setAppliedFilters(params);
  await handleSearch(params);
  
  // Update URL with search parameters
  const newSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && typeof value !== 'object' && key !== 'location') {
      newSearchParams.set(key, value);
    } else if (key === 'location' && value.lat && value.lng) {
      newSearchParams.set('lat', value.lat);
      newSearchParams.set('lng', value.lng);
      newSearchParams.set('radius', params.radius);
    } else if (value && typeof value === 'object' && key !== 'location') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subValue) {
          newSearchParams.set(`${key}_${subKey}`, subValue);
        }
      });
    }
  });
  setSearchParams(newSearchParams);
};

const handleSearch = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchCrimes(params);
      setSearchResults(results);
    } catch (err) {
      setError(err.message || 'An error occurred while searching');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchCrimes]);

const handleViewMap = () => {
  // Construct the map URL with current search parameters
  const mapParams = new URLSearchParams(searchParams);
  mapParams.set('search_results', 'true');
  
  // Navigate to the map page with the search results
  window.location.href = `/map?${mapParams.toString()}`;
};

const handleExport = async () => {
  try {
    await exportResults(searchResults);
  } catch (err) {
    setError(err.message || 'An error occurred during export');
  }
};

const toggleAdvancedSearch = () => {
  setShowAdvanced(!showAdvanced);
};

return (
  <Layout>
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search Crimes</h1>
        <Button 
          variant="secondary"
          onClick={toggleAdvancedSearch}
        >
          {showAdvanced ? 'Basic Search' : 'Advanced Search'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            {showAdvanced ? (
              <AdvancedSearch onSearch={handleAdvancedSearch} />
            ) : (
              <SearchFilters onFilterChange={handleFilterChange} />
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <SearchResults 
            results={searchResults}
            loading={loading}
            error={error}
            onViewMap={handleViewMap}
            onExport={handleExport}
          />
          
          {searchResults.length > 0 && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-3">Applied Filters</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(appliedFilters).map(([key, value]) => {
                  if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
                    return null;
                  }
                  
                  if (typeof value === 'object' && key !== 'location') {
                    return Object.entries(value).map(([subKey, subValue]) => {
                      if (!subValue) return null;
                      return (
                        <span 
                          key={`${key}_${subKey}`} 
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                          {`${subKey}: ${subValue}`}
                        </span>
                      );
                    });
                  }
                  
                  if (key === 'location' && value.address) {
                    return (
                      <span 
                        key="location" 
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {`Location: ${value.address} (${appliedFilters.radius || 5}km)`}
                      </span>
                    );
                  }
                  
                  return (
                    <span 
                      key={key} 
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {`${key}: ${value}`}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </Layout>
);
};

export default SearchPage;