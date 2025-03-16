// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ReportGenerator from '../components/reports/ReportGenerator';
import ReportHistory from '../components/reports/ReportHistory';
import ReportTemplate from '../components/reports/ReportTemplate';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import reportService from '../services/reportService';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchTemplates();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports();
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Failed to load report history');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await reportService.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const handleCreateReport = () => {
    setSelectedReport(null);
    setShowGeneratorModal(true);
  };

  const handleViewReport = async (reportId) => {
    try {
      const report = await reportService.getReportById(reportId);
      setSelectedReport(report);
    } catch (err) {
      console.error('Error fetching report details:', err);
    }
  };

  const handleDownloadReport = async (reportId, format) => {
    try {
      await reportService.downloadReport(reportId, format);
    } catch (err) {
      console.error('Error downloading report:', err);
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await reportService.deleteReport(reportId);
      setReports(reports.filter(report => report.id !== reportId));
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport(null);
      }
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  const handleSubmitReport = async (reportData) => {
    try {
      const newReport = await reportService.generateReport(reportData);
      setReports([newReport, ...reports]);
      setShowGeneratorModal(false);
      setSelectedReport(newReport);
    } catch (err) {
      console.error('Error generating report:', err);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  return (
    <Layout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crime Reports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate, view, and download custom crime analysis reports
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="primary" onClick={handleCreateReport}>
              Generate New Report
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-6 bg-red-50">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Report Templates</h2>
              <div className="space-y-4">
                {templates.map(template => (
                  <ReportTemplate 
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onSelect={() => handleSelectTemplate(template)}
                  />
                ))}
              </div>
            </Card>

            <Card className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Report History</h2>
              <ReportHistory 
                reports={reports}
                loading={loading}
                onView={handleViewReport}
                onDownload={handleDownloadReport}
                onDelete={handleDeleteReport}
              />
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedReport ? (
              <Card>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">
                      {selectedReport.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Generated on {new Date(selectedReport.createdAt).toLocaleDateString()} • {selectedReport.crimeCount} crimes analyzed
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleDownloadReport(selectedReport.id, 'pdf')}
                    >
                      Download PDF
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleDownloadReport(selectedReport.id, 'excel')}
                    >
                      Download Excel
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <iframe 
                    src={selectedReport.previewUrl} 
                    className="w-full h-[600px] border border-gray-200 rounded"
                    title="Report Preview"
                  />
                </div>
              </Card>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-gray-900">No report selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a report from history or generate a new report
                  </p>
                  <div className="mt-6">
                    <Button variant="secondary" onClick={handleCreateReport}>
                      Generate New Report
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal 
          isOpen={showGeneratorModal} 
          onClose={() => setShowGeneratorModal(false)}
          title="Generate Crime Report"
          size="lg"
        >
          <ReportGenerator 
            onSubmit={handleSubmitReport}
            onCancel={() => setShowGeneratorModal(false)}
            templates={templates}
            selectedTemplate={selectedTemplate}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default ReportsPage;