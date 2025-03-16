// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import alertService from '../services/alertService';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, loading: authLoading, logout } = useAuth();
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    agency: '',
    notificationPreferences: {
      email: true,
      push: false,
      sms: false,
    }
  });
  
  const [userAlerts, setUserAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        jobTitle: user.jobTitle || '',
        agency: user.agency || '',
        notificationPreferences: user.notificationPreferences || {
          email: true,
          push: false,
          sms: false,
        }
      });
      
      fetchUserAlerts();
    }
  }, [user]);
  
  const fetchUserAlerts = async () => {
    if (!user) return;
    
    setAlertsLoading(true);
    try {
      const alerts = await alertService.getUserAlerts(user.id);
      setUserAlerts(alerts);
    } catch (error) {
      console.error('Error fetching user alerts:', error);
    } finally {
      setAlertsLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };
  
  const handleNotificationChange = (key) => {
    setProfileData({
      ...profileData,
      notificationPreferences: {
        ...profileData.notificationPreferences,
        [key]: !profileData.notificationPreferences[key]
      }
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    
    // Clear error for this field if it exists
    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: null });
    }
  };
  
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!profileData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (profileData.phone && !/^\+?[0-9]{10,15}$/.test(profileData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setProfileLoading(true);
    try {
      await updateUserProfile(profileData);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setFormErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setProfileLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setProfileLoading(true);
    try {
      await updateUserProfile({ password: passwordData.newPassword }, passwordData.currentPassword);
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
      }, 2000);
      
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordErrors({ submit: 'Failed to update password. Please check your current password.' });
    } finally {
      setProfileLoading(false);
    }
  };
  
  const handleViewAlert = (alertId) => {
    navigate(`/alerts/${alertId}`);
  };
  
  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <Layout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Personal Information</h2>
                  <p className="mt-1 text-sm text-gray-500">Update your personal and contact information</p>
                </div>
                
                {updateSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-green-600">Profile updated successfully!</p>
                  </div>
                )}
                
                {formErrors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600">{formErrors.submit}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        formErrors.firstName ? 'border-red-300' : ''
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        formErrors.lastName ? 'border-red-300' : ''
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        formErrors.email ? 'border-red-300' : ''
                      }`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                        formErrors.phone ? 'border-red-300' : ''
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      id="jobTitle"
                      value={profileData.jobTitle}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="agency" className="block text-sm font-medium text-gray-700">
                      Agency
                    </label>
                    <input
                      type="text"
                      name="agency"
                      id="agency"
                      value={profileData.agency}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose how you'd like to receive notifications
                  </p>
                  
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        name="email-notifications"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={profileData.notificationPreferences.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                      <label htmlFor="email-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                        Email
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="push-notifications"
                        name="push-notifications"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={profileData.notificationPreferences.push}
                        onChange={() => handleNotificationChange('push')}
                      />
                      <label htmlFor="push-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                        Push Notifications
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="sms-notifications"
                        name="sms-notifications"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={profileData.notificationPreferences.sms}
                        onChange={() => handleNotificationChange('sms')}
                      />
                      <label htmlFor="sms-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                        SMS
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
  <Button
    type="submit"
    color="primary"
    disabled={profileLoading}
    className="ml-3"
  >
    {profileLoading ? "Saving..." : "Save Changes"}
  </Button>
</div>
              </form>
            </Card>
            
            <Card className="mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Security</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your password and security settings
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="button" 
                    onClick={() => setShowPasswordModal(true)}
                    color="secondary"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium text-gray-900 text-red-600">Danger Zone</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Permanently delete your account and all of your data
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="button" 
                    onClick={() => setShowDeleteModal(true)}
                    color="danger"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">My Alerts</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your crime alerts
                  </p>
                </div>
                
                {alertsLoading ? (
                  <div className="flex justify-center">
                    <Loader size="md" />
                  </div>
                ) : userAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {userAlerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className="border-b border-gray-200 pb-4">
                        <h3 className="text-md font-medium">{alert.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {alert.description.length > 80
                            ? `${alert.description.substring(0, 80)}...`
                            : alert.description}
                        </p>
                        <div className="mt-2 flex">
                          <Button
                            size="sm"
                            color="secondary"
                            onClick={() => handleViewAlert(alert.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {userAlerts.length > 5 && (
                      <div className="text-center pt-2">
                        <Button
                          type="button"
                          color="text"
                          onClick={() => navigate('/alerts')}
                        >
                          View All ({userAlerts.length}) Alerts
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">You don't have any alerts set up.</p>
                    <Button
                      type="button"
                      color="primary"
                      className="mt-3"
                      onClick={() => navigate('/alerts/new')}
                    >
                      Create Alert
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-600">Password updated successfully!</p>
            </div>
          )}
          
          {passwordErrors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{passwordErrors.submit}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                passwordErrors.currentPassword ? 'border-red-300' : ''
              }`}
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                passwordErrors.newPassword ? 'border-red-300' : ''
              }`}
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                passwordErrors.confirmPassword ? 'border-red-300' : ''
              }`}
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              color="secondary"
              onClick={() => setShowPasswordModal(false)}
              className="mr-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={profileLoading}
            >
              {profileLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 font-medium">Warning: This action cannot be undone</p>
            <p className="text-red-600 mt-1">
              Deleting your account will permanently remove all your data, including your profile,
              saved alerts, and any reports you've generated.
            </p>
          </div>
          
          <p className="text-gray-700">Please type your email to confirm account deletion.</p>
          
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              color="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="mr-3"
            >
              Cancel
            </Button>
            <Button
              type="button"
              color="danger"
              onClick={() => {
                // Implement account deletion logic here
                // After successful deletion, redirect to login page
                logout();
                navigate('/login');
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserProfilePage;