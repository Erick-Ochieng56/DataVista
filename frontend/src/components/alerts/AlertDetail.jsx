import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { alertService } from '../../services/alertService';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/formatters';

const AlertDetail = () => {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlertDetail = async () => {
      try {
        setLoading(true);
        const data = await alertService.getAlertById(alertId);
        setAlert(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch alert details');
      } finally {
        setLoading(false);
      }
    };

    if (alertId) {
      fetchAlertDetail();
    }
  }, [alertId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await alertService.deleteAlert(alertId);
        navigate('/alerts');
      } catch (err) {
        setError(err.message || 'Failed to delete alert');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/alerts/edit/${alertId}`);
  };

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>Error: {error}</p>
        <Button onClick={() => navigate('/alerts')}>Back to Alerts</Button>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
        <p>Alert not found</p>
        <Button onClick={() => navigate('/alerts')}>Back to Alerts</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{alert.name}</h2>
          <div className="flex space-x-2">
            <Button onClick={handleEdit} variant="primary">Edit</Button>
            <Button onClick={handleDelete} variant="danger">Delete</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Alert Type</p>
            <p className="font-medium">{alert.alertType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              alert.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {alert.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created On</p>
            <p className="font-medium">{formatDate(alert.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Triggered</p>
            <p className="font-medium">
              {alert.lastTriggered ? formatDate(alert.lastTriggered) : 'Never'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Alert Criteria</p>
          <div className="bg-gray-50 p-4 rounded-md">
            {alert.criteria && (
              <div className="space-y-2">
                {alert.criteria.crimeTypes && (
                  <div>
                    <span className="font-medium">Crime Types:</span> {alert.criteria.crimeTypes.join(', ')}
                  </div>
                )}
                {alert.criteria.location && (
                  <div>
                    <span className="font-medium">Location:</span> {alert.criteria.location.address || 'Custom Area'}
                    {alert.criteria.location.radius && (
                      <span> (Within {alert.criteria.location.radius} miles)</span>
                    )}
                  </div>
                )}
                {alert.criteria.threshold && (
                  <div>
                    <span className="font-medium">Threshold:</span> {alert.criteria.threshold} incidents
                  </div>
                )}
                {alert.criteria.timeWindow && (
                  <div>
                    <span className="font-medium">Time Window:</span> {alert.criteria.timeWindow}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Notification Settings</p>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="space-y-2">
              <div>
                <span className="font-medium">Email Notifications:</span> {alert.notifications?.email ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">Push Notifications:</span> {alert.notifications?.push ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">SMS Notifications:</span> {alert.notifications?.sms ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={() => navigate('/alerts')} variant="outline">Back to Alerts</Button>
        </div>
      </Card>
    </div>
  );
};

export default AlertDetail;
