import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useCrimeData } from '../../hooks/useCrimeData';
import { reportService } from '../../services/reportService';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';
import Modal from '../common/Modal';
import Dropdown from '../common/Dropdown';

const ReportHistory = ({ filter = 'all' }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState(filter);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { crimeData } = useCrimeData();
  const navigate = useNavigate();

  // Report types based on your Django models
  const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'statistical', label: 'Statistical' },
    { value: 'geographic', label: 'Geographic' },
    { value: 'analytical', label: 'Analytical' },
    { value: 'predictive', label: 'Predictive Analysis' }
  ];

  // Fetch reports based on filter, sort, and pagination
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await reportService.getReports({
          filter: filterType,
          sortBy,
          sortOrder,
          page,
          pageSize: 10
        });
        
        setReports(response.results);
        setTotalPages(Math.ceil(response.count / 10));
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch reports');
        setLoading(false);
      }
    };

    // Use actual API in production
    if (process.env.NODE_ENV === 'development') {
      // Simulate API call with timeout
      setTimeout(() => {
        const mockReports = [
          {
            id: '1',
            title: 'Monthly Crime Trends',
            description: 'Analysis of crime patterns over the last 30 days',
            type: 'statistical',
            createdAt: '2023-06-15T14:30:00Z',
            updatedAt: '2023-06-15T14:30:00Z',
            status: 'completed',
            fileUrl: '/reports/monthly-crime-trends.pdf',
            creator: 'John Doe',
            region: 'Downtown',
            crimeTypes: ['Theft', 'Assault', 'Vandalism']
          },
          {
            id: '2',
            title: 'Neighborhood Safety Report',
            description: 'Detailed safety analysis for downtown area',
            type: 'geographic',
            createdAt: '2023-06-10T09:15:00Z',
            updatedAt: '2023-06-10T09:15:00Z',
            status: 'completed',
            fileUrl: '/reports/neighborhood-safety.pdf',
            creator: 'Jane Smith',
            region: 'North District',
            crimeTypes: ['Burglary', 'Auto Theft']
          },
          {
            id: '3',
            title: 'Crime Hotspots Q2',
            description: 'Identification of high-crime areas in Q2',
            type: 'analytical',
            createdAt: '2023-05-28T11:45:00Z',
            updatedAt: '2023-05-28T11:45:00Z',
            status: 'completed',
            fileUrl: '/reports/crime-hotspots-q2.pdf',
            creator: 'Mike Johnson',
            region: 'City-wide',
            crimeTypes: ['All']
          },
          {
            id: '4',
            title: 'Predictive Crime Analysis 2023',
            description: 'Forecast of criminal activity patterns for next quarter',
            type: 'predictive',
            createdAt: '2023-05-20T10:30:00Z',
            updatedAt: '2023-05-21T16:45:00Z',
            status: 'completed',
            fileUrl: '/reports/predictive-analysis-2023.pdf',
            creator: 'Sarah Williams',
            region: 'Southwest District',
            crimeTypes: ['Robbery', 'Assault']
          }
        ];
        
        // Filter mock data if necessary
        let filteredReports = mockReports;
        if (filterType !== 'all') {
          filteredReports = mockReports.filter(report => report.type === filterType);
        }
        
        // Sort the filtered reports
        filteredReports.sort((a, b) => {
          if (sortBy === 'date') {
            return sortOrder === 'asc' 
              ? new Date(a.createdAt) - new Date(b.createdAt)
              : new Date(b.createdAt) - new Date(a.createdAt);
          } else if (sortBy === 'title') {
            return sortOrder === 'asc'
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          } else if (sortBy === 'type') {
            return sortOrder === 'asc'
              ? a.type.localeCompare(b.type)
              : b.type.localeCompare(a.type);
          }
          return 0;
        });
        
        setReports(filteredReports);
        setTotalPages(1); // Mock single page
        setLoading(false);
      }, 800);
    } else {
      fetchReports();
    }
  }, [filterType, sortBy, sortOrder, page]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    // Reset to first page when changing sort
    setPage(1);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    // Reset to first page when changing filter
    setPage(1);
  };

  const handleViewReport = (report) => {
    window.open(report.fileUrl, '_blank');
  };

  const handleEditReport = (reportId) => {
    navigate(`/reports/edit/${reportId}`);
  };

  const handleDeleteReport = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await reportService.deleteReport(selectedReport.id);
      setReports(reports.filter(report => report.id !== selectedReport.id));
      setShowDeleteModal(false);
      setSelectedReport(null);
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCreateNewReport = () => {
    navigate('/reports/new');
  };

  const getReportTypeLabel = (type) => {
    const found = reportTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  const getReportStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <Loader text="Loading reports..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Report History</h2>
        <Button 
          variant="primary" 
          onClick={handleCreateNewReport}
        >
          Create New Report
        </Button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          <span className="text-sm text-gray-600">Filter by:</span>
          <Dropdown
            options={reportTypes}
            value={filterType}
            onChange={handleFilterChange}
            className="w-40"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button 
            className={`text-sm px-3 py-1 rounded ${sortBy === 'date' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            onClick={() => handleSort('date')}
          >
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`text-sm px-3 py-1 rounded ${sortBy === 'title' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            onClick={() => handleSort('title')}
          >
            Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`text-sm px-3 py-1 rounded ${sortBy === 'type' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
            onClick={() => handleSort('type')}
          >
            Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterType !== 'all' 
              ? `No ${getReportTypeLabel(filterType).toLowerCase()} reports found. Try a different filter or create a new report.`
              : 'Get started by creating a new report.'}
          </p>
          <div className="mt-6">
            <Button 
              variant="primary" 
              onClick={handleCreateNewReport}
            >
              Create New Report
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium text-gray-900">{report.title}</h3>
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getReportStatusClass(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{report.description}</p>
                  <div className="flex flex-wrap items-center text-xs text-gray-500">
                    <span className="font-medium mr-2">Type:</span>
                    <span className="capitalize mr-4">{getReportTypeLabel(report.type)}</span>
                    
                    <span className="font-medium mr-2">Created:</span>
                    <span className="mr-4">{new Date(report.createdAt).toLocaleDateString()}</span>
                    
                    {report.region && (
                      <>
                        <span className="font-medium mr-2">Region:</span>
                        <span className="mr-4">{report.region}</span>
                      </>
                    )}
                    
                    {report.creator && (
                      <>
                        <span className="font-medium mr-2">By:</span>
                        <span>{report.creator}</span>
                      </>
                    )}
                  </div>
                  
                  {report.crimeTypes && report.crimeTypes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {report.crimeTypes.map(type => (
                        <span key={type} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleViewReport(report)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleEditReport(report.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="small"
                    onClick={() => handleDeleteReport(report)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="inline-flex items-center rounded-md shadow-sm">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 border ${page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Previous
              </button>
              <span className="px-4 py-2 border bg-white text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 border ${page === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
  
        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedReport && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete the report "{selectedReport.title}"? This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  };
  
  ReportHistory.propTypes = {
    filter: PropTypes.string,
  };
  
  export default ReportHistory;
  