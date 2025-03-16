// src/pages/AlertsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AlertList from '../components/alerts/AlertList';
import AlertForm from '../components/alerts/AlertForm';
import AlertDetail from '../components/alerts/AlertDetail';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import alertService from '../services/alertService';

const AlertsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    fetchAlerts();
  }, []);
  
  useEffect(() => {
    if (id) {
      fetchAlertDetails(id);
    }
  }, [id]);
  
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAlertDetails = async (alertId) => {
    try {
      const alert = await alertService.getAlertById(alertId);
      setSelectedAlert(alert);
    } catch (error) {
      console.error('Error fetching alert details:', error);
      navigate('/alerts');
    }
  };
  
  const handleCreateAlert = () => {
    setSelectedAlert(null);
    setIsEditing(true);
    setShowModal(true);
  };
  
  const handleEditAlert = (alert) => {
    setSelectedAlert(alert);
    setIsEditing(true);
    setShowModal(true);
  };
  
  const handleViewAlert = (alert) => {
    navigate(`/alerts/${alert.id}`);
  };
  
  const handleDeleteAlert = async (alertId) => {
    try {
      await alertService.deleteAlert(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      if (selectedAlert && selectedAlert.id === alertId) {
        setSelectedAlert(null);
        navigate('/alerts');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };
  
  const handleSubmitAlert = async (alertData) => {
    try {
      if (alertData.id) {
        const updatedAlert = await alertService.updateAlert(alertData.id, alertData);
        setAlerts(alerts.map(alert => alert.id === updatedAlert.id ? updatedAlert : alert));
        setSelectedAlert(updatedAlert);
      } else {
        const newAlert = await alertService.createAlert(alertData);
        setAlerts([...alerts, newAlert]);
      }
      setShowModal(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving alert:', error);
    }
  };
  
  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };
  
  return (
    <Layout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crime Alerts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Set up and manage notifications for specific crime types and locations
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button variant="primary" onClick={handleCreateAlert}>
              Create New Alert
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AlertList 
              alerts={alerts}
              loading={loading}
              onView={handleViewAlert}
              onEdit={handleEditAlert}
              onDelete={handleDeleteAlert}
            />
          </div>
          <div className="lg:col-span-2">
            {selectedAlert ? (
              <AlertDetail 
                alert={selectedAlert} 
                onEdit={() => handleEditAlert(selectedAlert)}
                onDelete={() => handleDeleteAlert(selectedAlert.id)}
              />
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-gray-900">No alert selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select an alert from the list or create a new one to view details
                  </p>
                  <div className="mt-6">
                    <Button variant="secondary" onClick={handleCreateAlert}>
                      Create New Alert
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Modal isOpen={showModal} onClose={closeModal} title={selectedAlert?.id ? "Edit Alert" : "Create Alert"}>
          <AlertForm 
            alert={selectedAlert} 
            onSubmit={handleSubmitAlert}
            onCancel={closeModal}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default AlertsPage;