import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alertService } from '../../services/alertService';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

const AlertList = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await alertService.getUserAlerts(user.id);
        setAlerts(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user.id]);

  const handleToggleActive = async (alertId, currentStatus) => {
    try {
      await alertService.updateAlert(alertId, { isActive: !currentStatus });
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, isActive: !currentStatus } 
          : alert
      ));
    } catch (err) {
      setError(`Failed to update alert status: ${err.message}`);
    }
  };

  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await alertService.deleteAlert(alertId);
        setAlerts(alerts.filter(alert => alert.id !== alertId));
      } catch (err) {
        setError(`Failed to delete alert: ${err.message}`);
      }
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && alert.isActive) || 
      (filterStatus === 'inactive' && !alert.isActive);
    
    const typeMatch = filterType === 'all' || alert.alertType === filterType;
    
    return statusMatch && typeMatch;
  });

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crime Alerts</h2>
        <Button
          onClick={() => navigate('/alerts/create')}
          variant="primary"
        >
          Create New Alert
        </Button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="location">Location</option>
              <option value="threshold">Threshold</option>
              <option value="trend">Trend</option>
            </select>
          </div>
          
          <p className="text-sm text-gray-600">
            {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'} found
          </p>
        </div>
      </Card>

      {filteredAlerts.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-600 mb-4">No alerts found matching your criteria.</p>
          <Button
            onClick={() => navigate('/alerts/create')}
            variant="outline"
          >
            Create Your First Alert
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAlerts.map(alert => (
            <Card key={alert.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 md:mb-0">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lg text-gray-800">
                      <Link to={`/alerts/${alert.id}`} className="hover:text-blue-600">
                        {alert.name}
                      </Link>
                    </h3>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                      alert.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
                      {alert.alertType === 'location' && 'Location-based'}
                      {alert.alertType === 'threshold' && 'Threshold-based'}
                      {alert.alertType === 'trend' && 'Trend-based'}
                    </span>
                    
                    {alert.criteria?.crimeTypes?.slice(0, 2).map(type => (
                      <span key={type} className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">
                        {typeof type === 'string' ? type : type.name || 'Unknown'}
                      </span>
                    ))}
                    
                    {alert.criteria?.crimeTypes?.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">
                        +{alert.criteria.crimeTypes.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    {alert.criteria?.location?.address && (
                      <div>
                        Location: {alert.criteria.location.address.substring(0, 30)}
                        {alert.criteria.location.address.length > 30 ? '...' : ''}
                        {alert.criteria.location.radius && ` (${alert.criteria.location.radius} miles)`}
                      </div>
                    )}
                    
                    <div>Created: {formatDate(alert.createdAt)}</div>
                    
                    {alert.lastTriggered && (
                      <div>Last triggered: {formatDate(alert.lastTriggered)}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleToggleActive(alert.id, alert.isActive)}
                    variant="outline"
                    size="sm"
                  >
                    {alert.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  
                  <Button
                    onClick={() => navigate(`/alerts/edit/${alert.id}`)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  
                  <Button
                    onClick={() => handleDelete(alert.id)}
                    variant="danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertList;