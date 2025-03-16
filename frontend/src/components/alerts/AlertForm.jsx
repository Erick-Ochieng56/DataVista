import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { alertService } from '../../services/alertService';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';
import { useAuth } from '../../hooks/useAuth';
import LocationSearch from '../map/LocationSearch';

const AlertForm = () => {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(alertId);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [crimeTypes, setCrimeTypes] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    alertType: 'location',
    isActive: true,
    criteria: {
      crimeTypes: [],
      location: {
        address: '',
        coordinates: null,
        radius: 1
      },
      threshold: 5,
      timeWindow: '24h'
    },
    notifications: {
      email: true,
      push: false,
      sms: false
    }
  });

  // Fetch crime types for dropdown
  useEffect(() => {
    const fetchCrimeTypes = async () => {
      try {
        // This would come from your API
        const types = await alertService.getCrimeTypes();
        setCrimeTypes(types);
      } catch {
        setError('Failed to load crime types');
      }
    };
    
    fetchCrimeTypes();
  }, []);

  // If editing, fetch existing alert data
  useEffect(() => {
    const fetchAlertData = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const data = await alertService.getAlertById(alertId);
        setFormData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch alert data');
      } finally {
        setLoading(false);
      }
    };

    fetchAlertData();
  }, [alertId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleCrimeTypeChange = (e) => {
    const { value, checked } = e.target;
    
    setFormData({
      ...formData,
      criteria: {
        ...formData.criteria,
        crimeTypes: checked
          ? [...formData.criteria.crimeTypes, value]
          : formData.criteria.crimeTypes.filter(type => type !== value)
      }
    });
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      criteria: {
        ...formData.criteria,
        location: {
          ...formData.criteria.location,
          address: location.address,
          coordinates: {
            lat: location.lat,
            lng: location.lng
          }
        }
      }
    });
  };

  const handleRadiusChange = (e) => {
    const radius = parseFloat(e.target.value);
    setFormData({
      ...formData,
      criteria: {
        ...formData.criteria,
        location: {
          ...formData.criteria.location,
          radius
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Alert name is required');
      return;
    }

    if (formData.criteria.crimeTypes.length === 0) {
      setError('Please select at least one crime type');
      return;
    }

    if (formData.alertType === 'location' && !formData.criteria.location.coordinates) {
      setError('Please select a location');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      if (isEditMode) {
        await alertService.updateAlert(alertId, formData);
      } else {
        await alertService.createAlert({
          ...formData,
          userId: user.id
        });
      }
      
      navigate('/alerts');
    } catch (err) {
      setError(err.message || 'Failed to save alert');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="mb-6 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? 'Edit Alert' : 'Create New Alert'}
        </h2>

        {error && (
          <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter alert name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Type
            </label>
            <select
              name="alertType"
              value={formData.alertType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="location">Location-based</option>
              <option value="threshold">Threshold-based</option>
              <option value="trend">Trend-based</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Alert Criteria</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crime Types *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {crimeTypes.map(type => (
                  <label key={type.id} className="flex items-center">
                    <input
                      type="checkbox"
                      value={type.id}
                      checked={formData.criteria.crimeTypes.includes(type.id)}
                      onChange={handleCrimeTypeChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.alertType === 'location' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <LocationSearch onSelectLocation={handleLocationSelect} />
                  {formData.criteria.location.address && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {formData.criteria.location.address}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radius (miles)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={formData.criteria.location.radius}
                    onChange={handleRadiusChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>0.1</span>
                    <span>{formData.criteria.location.radius.toFixed(1)} miles</span>
                    <span>10</span>
                  </div>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Threshold (number of incidents)
              </label>
              <input
                type="number"
                name="criteria.threshold"
                value={formData.criteria.threshold}
                onChange={handleChange}
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Window
              </label>
              <select
                name="criteria.timeWindow"
                value={formData.criteria.timeWindow}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">24 Hours</option>
                <option value="48h">48 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h3>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notifications.email"
                  checked={formData.notifications?.email || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notifications.push"
                  checked={formData.notifications?.push || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Push Notifications</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notifications.sms"
                  checked={formData.notifications?.sms || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              onClick={() => navigate('/alerts')}
              variant="outline"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Alert' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AlertForm;