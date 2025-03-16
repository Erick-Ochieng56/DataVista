// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SearchFilters from '../components/search/SearchFilters';
import SearchResults from '../components/search/SearchResults';
import AdvancedSearch from '../components/search/AdvancedSearch';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import CrimeService from '../services/CrimeService';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
  const [filters, setFilters] = useState({
    crimeTypes: queryParams.getAll('crimeType') || [],
    startDate: queryParams.get('startDate') || '',
    endDate: queryParams.get('endDate') || '',
    radius: queryParams.get('radius') || 5,
    latitude: queryParams.get('lat') || '',
    longitude: queryParams.get('lng') || '',
    sortBy: queryParams.get('sortBy') || 'date',
    sortOrder: queryParams.get('sortOrder') || 'desc',
  });
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(queryParams.get('pageSize')) || 20);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Search whenever query params change
  useEffect(() => {
    if (searchQuery || filters.crimeTypes.length > 0 || filters.latitude) {
      performSearch();
    }
  }, [page, pageSize, filters.sortBy, filters.sortOrder]);
  
  // Update URL with current search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (page > 1) params.set('page', page.toString());
    if (pageSize !== 20) params.set('pageSize', pageSize.toString());
    
    filters.crimeTypes.forEach(type => params.append('crimeType', type));
    
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.radius) params.set('radius', filters.radius.toString());
    if (filters.latitude) params.set('lat', filters.latitude.toString());
    if (filters.longitude) params.set('lng', filters.longitude.toString());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [searchQuery, filters, page, pageSize]);
  
  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = {
        query: searchQuery,
        page,
        pageSize,
        ...filters
      };
      
      const { data, total } = await CrimeService.searchCrimes(searchParams);
      setResults(data);
      setTotalResults(total);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    setPage(1); // Reset to first page when performing a new search
    performSearch();
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };
  
  const toggleAdvancedSearch = () => {
    setShowAdvanced(!showAdvanced);
  };
  
  return (
    <Layout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crime Search</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search for crime incidents by location, type, date range, and more
          </p>
        </div>
        
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-grow">
              <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="search-query"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by description, location, case number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleSearch}>
                Search
              </Button>
              <Button variant="secondary" onClick={toggleAdvancedSearch}>
                {showAdvanced ? 'Hide Filters' : 'Advanced Search'}
              </Button>
            </div>
          </div>
          
          {showAdvanced && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <AdvancedSearch 
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
              />
            </div>
          )}
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleSearch}
            />
          </div>
          
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-60">
                <Loader size="lg" />
              </div>
            ) : (
              <SearchResults 
                results={results}
                totalResults={totalResults}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={(sortBy, sortOrder) => 
                  handleFilterChange({ sortBy, sortOrder })}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;