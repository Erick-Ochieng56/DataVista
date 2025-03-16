import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';
import Modal from '../common/Modal';
import Dropdown from '../common/Dropdown';
import ReportTemplate from './ReportTemplate';
import { useCrimeData } from '../../hooks/useCrimeData';

const ReportGenerator = () => {
  const { reportId } = useParams();
  const isEditMode = Boolean(reportId);
  const navigate = useNavigate();
  const { getCrimeStats, getLocationData } = useCrimeData();

  // State for report
  const [report, setReport] = useState({
    title: '',
    description: '',
    type: 'statistical',
    timeframe: 'last30days',
    location: 'all',
    sections: [],
    isPublic: false
  });

  // State for UI control
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!isEditMode);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Fetch existing report if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      // Replace with actual API call
      const fetchReport = async () => {
        try {
          // Simulate API call
          setTimeout(() => {
            const mockReport = {
              id: reportId,
              title: 'Monthly Crime Analysis',
              description: 'Detailed analysis of crime patterns over the last month',
              type: 'statistical',
              timeframe: 'last30days',
              location: 'downtown',
              sections: [
                {
                  id: '1',
                  title: 'Executive Summary',
                  type: 'text',
                  content: 'This report provides an analysis of crime trends in the downtown area over the last 30 days.'
                },
                {
                  id: '2',
                  title: 'Crime by Category',
                  type: 'chart',
                  chartType: 'bar',
                  dataSource: 'crimeByCategoryLastMonth'
                },
                {
                  id: '3',
                  title: 'Time of Day Analysis',
                  type: 'chart',
                  chartType: 'line',
                  dataSource: 'crimeByTimeOfDayLastMonth'
                },
                {
                  id: '4',
                  title: 'Hotspot Map',
                  type: 'map',
                  mapType: 'heatmap',
                  dataSource: 'crimeLocationLastMonth'
                },
                {
                  id: '5',
                  title: 'Detailed Statistics',
                  type: 'table',
                  headers: ['Crime Type', 'Count', '% Change', 'Avg Response Time'],
                  data: [
                    ['Theft', '143', '+12%', '8.5 min'],
                    ['Assault', '87', '-3%', '6.2 min'],
                    ['Vandalism', '65', '+8%', '12.4 min'],
                    ['Burglary', '42', '-15%', '7.8 min']
                  ]
                }
              ],
              isPublic: true
            };
            
            setReport(mockReport);
            setShowTemplateSelector(false);
            setLoading(false);
          }, 1000);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      
      fetchReport();
    }
  }, [reportId, isEditMode]);

  // Fetch available report templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockTemplates = [
            {
              id: 'template1',
              title: 'Crime Trend Analysis',
              description: 'Standard report template for analyzing crime trends over time',
              type: 'statistical',
              createdAt: '2023-05-15T12:00:00Z',
              sections: [
                { title: 'Executive Summary', type: 'text' },
                { title: 'Crime by Category', type: 'chart', chartType: 'bar' },
                { title: 'Time of Day Analysis', type: 'chart', chartType: 'line' },
                { title: 'Hotspot Map', type: 'map' },
                { title: 'Detailed Statistics', type: 'table' }
              ]
            },
            {
              id: 'template2',
              title: 'Geographic Crime Report',
              description: 'Template focusing on geographical analysis of crime patterns',
              type: 'geographic',
              createdAt: '2023-04-22T09:30:00Z',
              sections: [
                { title: 'Area Overview', type: 'text' },
                { title: 'Crime Distribution Map', type: 'map' },
                { title: 'Neighborhood Comparison', type: 'chart', chartType: 'bar' },
                { title: 'High Risk Locations', type: 'table' }
              ]
            },
            {
              id: 'template3',
              title: 'Incident Response Analysis',
              description: 'Template for analyzing response times and effectiveness',
              type: 'analytical',
              createdAt: '2023-03-10T15:45:00Z',
              sections: [
                { title: 'Response Time Overview', type: 'text' },
                { title: 'Response Time by District', type: 'chart', chartType: 'bar' },
                { title: 'Incident Resolution Rate', type: 'chart', chartType: 'pie' },
                { title: 'Case Resolution Details', type: 'table' }
              ]
            }
          ];
          
          setAvailableTemplates(mockTemplates);
        }, 800);
      } catch (err) {
        setError('Failed to load templates');
      }
    };
    
    fetchTemplates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReport({
      ...report,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    const template = availableTemplates.find(t => t.id === templateId);
    
    if (template) {
      // Pre-populate report with template data
      setReport(prevReport => ({
        ...prevReport,
        title: `New ${template.title}`,
        description: template.description,
        type: template.type,
        sections: template.sections.map(section => ({
          ...section,
          id: Math.random().toString(36).substr(2, 9)
        }))
      }));
    }
  };

  const handleTemplateConfirm = () => {
    setShowTemplateSelector(false);
  };

  const handleSectionChange = (sectionId, field, value) => {
    setReport(prevReport => ({
      ...prevReport,
      sections: prevReport.sections.map(section => 
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleAddSection = (type) => {
    const newSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      type
    };
    
    // Add specific properties based on section type
    if (type === 'chart') {
      newSection.chartType = 'bar';
      newSection.dataSource = '';
    } else if (type === 'table') {
      newSection.headers = ['Header 1', 'Header 2', 'Header 3'];
      newSection.data = [['Data 1', 'Data 2', 'Data 3']];
    } else if (type === 'text') {
      newSection.content = '';
    } else if (type === 'map') {
      newSection.mapType = 'heatmap';
      newSection.dataSource = '';
    }
    
    setReport(prevReport => ({
      ...prevReport,
      sections: [...prevReport.sections, newSection]
    }));
  };

  const handleRemoveSection = (sectionId) => {
    setReport(prevReport => ({
      ...prevReport,
      sections: prevReport.sections.filter(section => section.id !== sectionId)
    }));
  };

  const handleMoveSectionUp = (sectionId) => {
    const sectionIndex = report.sections.findIndex(section => section.id === sectionId);
    if (sectionIndex <= 0) return;
    
    const newSections = [...report.sections];
    const temp = newSections[sectionIndex];
    newSections[sectionIndex] = newSections[sectionIndex - 1];
    newSections[sectionIndex - 1] = temp;
    
    setReport(prevReport => ({
      ...prevReport,
      sections: newSections
    }));
  };

  const handleMoveSectionDown = (sectionId) => {
    const sectionIndex = report.sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1 || sectionIndex >= report.sections.length - 1) return;
    
    const newSections = [...report.sections];
    const temp = newSections[sectionIndex];
    newSections[sectionIndex] = newSections[sectionIndex + 1];
    newSections[sectionIndex + 1] = temp;
    
    setReport(prevReport => ({
      ...prevReport,
      sections: newSections
    }));
  };

  const handleGeneratePreview = async () => {
    setGeneratingPreview(true);
    
    try {
      // Here we would normally fetch actual data from backend APIs
      // For the preview, we're simulating data based on the report configuration
      
      // Simulate fetching crime stats based on timeframe and location
      const crimeStats = await getCrimeStats({
        timeframe: report.timeframe,
        location: report.location
      });
      
      // Simulate fetching location data for maps
      const locationData = await getLocationData({
        timeframe: report.timeframe,
        location: report.location
      });
      
      // Create preview with actual data
      const previewTemplate = {
        ...report,
        sections: report.sections.map(section => {
          if (section.type === 'chart' && section.dataSource) {
            // Simulate chart data
            return {
              ...section,
              data: crimeStats[section.dataSource] || []
            };
          } else if (section.type === 'map') {
            // Simulate map data
            return {
              ...section,
              mapData: locationData || []
            };
          }
          return section;
        })
      };
      
      setPreviewData(previewTemplate);
      setShowPreview(true);
    } catch (err) {
      setError('Failed to generate preview');
    } finally {
      setGeneratingPreview(false);
    }
  };

  const handleSaveReport = async () => {
    if (!report.title.trim()) {
      setError('Report title is required');
      return;
    }
    
    setSaving(true);
    
    try {
      // Replace with actual API call
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode ? `/api/reports/${reportId}` : '/api/reports';
      
      // Simulate API call
      setTimeout(() => {
        setSaving(false);
        navigate('/reports');
      }, 1500);
    } catch (err) {
      setError('Failed to save report');
      setSaving(false);
    }
  };

  const handleGenerateAndDownload = async () => {
    setSaving(true);
    
    try {
      // Replace with actual API call
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });
      
      // Simulate file download
      setTimeout(() => {
        setSaving(false);
        
        // In a real implementation, we'd handle the file download
        alert('Report generated and downloaded successfully!');
      }, 2000);
    } catch (err) {
      setError('Failed to generate report file');
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text={isEditMode ? "Loading report..." : "Loading templates..."} />;
  }

  if (showTemplateSelector) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select a Report Template</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {availableTemplates.map(template => (
            <ReportTemplate
              key={template.id}
              template={template}
              onSelect={handleSelectTemplate}
              isSelected={selectedTemplate === template.id}
            />
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/reports')}
            className="mr-2"
          >
            Cancel
          </Button>
          
          <Button
            variant="primary"
            onClick={handleTemplateConfirm}
            disabled={!selectedTemplate}
          >
            Continue with Selected Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {isEditMode ? 'Edit Report' : 'Create New Report'}
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/reports')}
          >
            Cancel
          </Button>
          
          <Button
            variant="success"
            onClick={handleSaveReport}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Report'}
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-800">{error}</p>
          <Button 
            variant="text" 
            className="text-red-700 mt-2" 
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}
      
      <Card className="mb-6">
        <h3 className="font-medium text-gray-900 mb-4">Report Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Title
            </label>
            <input
              type="text"
              name="title"
              type="text"
              name="title"
              value={report.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter report title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <Dropdown
              name="type"
              value={report.type}
              onChange={handleInputChange}
              options={[
                { value: 'statistical', label: 'Statistical Analysis' },
                { value: 'geographic', label: 'Geographic Analysis' },
                { value: 'analytical', label: 'Incident Response Analysis' },
                { value: 'custom', label: 'Custom Report' }
              ]}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Frame
            </label>
            <Dropdown
              name="timeframe"
              value={report.timeframe}
              onChange={handleInputChange}
              options={[
                { value: 'last7days', label: 'Last 7 Days' },
                { value: 'last30days', label: 'Last 30 Days' },
                { value: 'last90days', label: 'Last 90 Days' },
                { value: 'lastYear', label: 'Last Year' },
                { value: 'custom', label: 'Custom Date Range' }
              ]}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Focus
            </label>
            <Dropdown
              name="location"
              value={report.location}
              onChange={handleInputChange}
              options={[
                { value: 'all', label: 'All Areas' },
                { value: 'downtown', label: 'Downtown' },
                { value: 'north', label: 'North District' },
                { value: 'south', label: 'South District' },
                { value: 'east', label: 'East District' },
                { value: 'west', label: 'West District' },
                { value: 'custom', label: 'Custom Area' }
              ]}
              className="w-full"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={report.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide a brief description of this report"
            />
          </div>
          
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={report.isPublic}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
              Make this report public to all users in your organization
            </label>
          </div>
        </div>
      </Card>
      
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Report Sections</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleAddSection('text')}>
              Add Text
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddSection('chart')}>
              Add Chart
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddSection('table')}>
              Add Table
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddSection('map')}>
              Add Map
            </Button>
          </div>
        </div>
        
        {report.sections.length === 0 ? (
          <div className="bg-gray-50 p-6 text-center rounded-md">
            <p className="text-gray-500">No sections added yet. Use the buttons above to add content to your report.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {report.sections.map((section, index) => (
              <div key={section.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="bg-gray-100 text-gray-500 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      {index + 1}
                    </div>
                    <h4 className="font-medium">{section.title}</h4>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleMoveSectionUp(section.id)}
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => handleMoveSectionDown(section.id)}
                      disabled={index === report.sections.length - 1}
                      className={`p-1 rounded ${index === report.sections.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => handleRemoveSection(section.id)}
                      className="p-1 text-red-500 rounded hover:bg-red-50"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {section.type === 'text' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        value={section.content || ''}
                        onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter text content for this section"
                      />
                    </div>
                  )}
                  
                  {section.type === 'chart' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chart Type
                        </label>
                        <Dropdown
                          value={section.chartType || 'bar'}
                          onChange={(e) => handleSectionChange(section.id, 'chartType', e.target.value)}
                          options={[
                            { value: 'bar', label: 'Bar Chart' },
                            { value: 'line', label: 'Line Chart' },
                            { value: 'pie', label: 'Pie Chart' },
                            { value: 'scatter', label: 'Scatter Plot' }
                          ]}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data Source
                        </label>
                        <Dropdown
                          value={section.dataSource || ''}
                          onChange={(e) => handleSectionChange(section.id, 'dataSource', e.target.value)}
                          options={[
                            { value: '', label: 'Select a data source' },
                            { value: 'crimeByCategoryLastMonth', label: 'Crime by Category (Last Month)' },
                            { value: 'crimeByTimeOfDayLastMonth', label: 'Crime by Time of Day (Last Month)' },
                            { value: 'crimeByOfficerLastMonth', label: 'Crime by Officer (Last Month)' },
                            { value: 'crimeByDistrictLastMonth', label: 'Crime by District (Last Month)' }
                          ]}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                  
                  {section.type === 'map' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Map Type
                        </label>
                        <Dropdown
                          value={section.mapType || 'heatmap'}
                          onChange={(e) => handleSectionChange(section.id, 'mapType', e.target.value)}
                          options={[
                            { value: 'heatmap', label: 'Heat Map' },
                            { value: 'markers', label: 'Marker Map' },
                            { value: 'choropleth', label: 'Choropleth Map' }
                          ]}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data Source
                        </label>
                        <Dropdown
                          value={section.dataSource || ''}
                          onChange={(e) => handleSectionChange(section.id, 'dataSource', e.target.value)}
                          options={[
                            { value: '', label: 'Select a data source' },
                            { value: 'crimeLocationLastMonth', label: 'Crime Locations (Last Month)' },
                            { value: 'crimeLocationsByType', label: 'Crime Locations by Type' },
                            { value: 'crimeLocationsByDistrict', label: 'Crime Locations by District' }
                          ]}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                  
                  {section.type === 'table' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Table Headers
                      </label>
                      <div className="flex space-x-2 mb-2">
                        {section.headers && section.headers.map((header, headerIndex) => (
                          <input
                            key={headerIndex}
                            type="text"
                            value={header}
                            onChange={(e) => {
                              const newHeaders = [...section.headers];
                              newHeaders[headerIndex] = e.target.value;
                              handleSectionChange(section.id, 'headers', newHeaders);
                            }}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          />
                        ))}
                        <button
                          onClick={() => {
                            const newHeaders = [...(section.headers || []), 'New Column'];
                            handleSectionChange(section.id, 'headers', newHeaders);
                          }}
                          className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 text-sm hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {section.headers && section.headers.map((header, idx) => (
                                <th 
                                  key={idx}
                                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {header}
                                </th>
                              ))}
                              <th className="w-12"></th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {section.data && section.data.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="px-3 py-2">
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) => {
                                        const newData = [...section.data];
                                        newData[rowIndex][cellIndex] = e.target.value;
                                        handleSectionChange(section.id, 'data', newData);
                                      }}
                                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    />
                                  </td>
                                ))}
                                <td className="px-2 py-2 text-center">
                                  <button
                                    onClick={() => {
                                      const newData = [...section.data];
                                      newData.splice(rowIndex, 1);
                                      handleSectionChange(section.id, 'data', newData);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <button
                        onClick={() => {
                          const emptyRow = Array(section.headers?.length || 0).fill('');
                          const newData = [...(section.data || []), emptyRow];
                          handleSectionChange(section.id, 'data', newData);
                        }}
                        className="mt-2 px-3 py-1 bg-gray-100 rounded-md text-gray-700 text-sm hover:bg-gray-200"
                      >
                        Add Row
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="primary"
          onClick={handleGeneratePreview}
          disabled={report.sections.length === 0 || generatingPreview}
        >
          {generatingPreview ? 'Generating Preview...' : 'Preview Report'}
        </Button>
        
        <Button
          variant="success"
          onClick={handleGenerateAndDownload}
          disabled={report.sections.length === 0 || saving}
        >
          {saving ? 'Generating...' : 'Generate & Download'}
        </Button>
      </div>
      
      {/* Report Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Report Preview"
        size="xl"
      >
        {previewData && (
          <div className="p-4 bg-white rounded-md">
            <h1 className="text-2xl font-bold mb-2">{previewData.title}</h1>
            <p className="text-gray-600 mb-6">{previewData.description}</p>
            
            {previewData.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                
                {section.type === 'text' && (
                  <div className="prose max-w-none">
                    <p>{section.content}</p>
                  </div>
                )}
                
                {section.type === 'chart' && (
                  <div className="bg-gray-50 p-4 rounded-md h-64 flex items-center justify-center">
                    <p className="text-gray-500">
                      [Chart Visualization: {section.chartType} - {section.dataSource}]
                    </p>
                  </div>
                )}
                
                {section.type === 'map' && (
                  <div className="bg-gray-50 p-4 rounded-md h-64 flex items-center justify-center">
                    <p className="text-gray-500">
                      [Map Visualization: {section.mapType} - {section.dataSource}]
                    </p>
                  </div>
                )}
                
                {section.type === 'table' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {section.headers.map((header, idx) => (
                            <th 
                              key={idx}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {section.data.map((row, rowIdx) => (
                          <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            Close Preview
          </Button>
        </div>
      </Modal>
    </div>
  );
};

ReportGenerator.propTypes = {
  reportId: PropTypes.string
};

export default ReportGenerator;