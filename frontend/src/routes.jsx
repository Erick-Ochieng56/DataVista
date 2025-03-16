// src/routes.jsx
import React from 'react';
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route
} from 'react-router-dom';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import SearchPage from './pages/SearchPage';
import UserProfilePage from './pages/UserProfilePage';
import Login from './components/user/Login';
import Register from './components/user/Register';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<Login/>} />
      <Route path="register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="map" element={
        <ProtectedRoute>
          <MapPage />
        </ProtectedRoute>
      } />
      <Route path="dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="analytics" element={
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      } />
      <Route path="alerts" element={
        <ProtectedRoute>
          <AlertsPage />
        </ProtectedRoute>
      } />
      <Route path="reports" element={
        <ProtectedRoute>
          <ReportsPage />
        </ProtectedRoute>
      } />
      <Route path="search" element={
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      } />
      <Route path="profile" element={
        <ProtectedRoute>
          <UserProfilePage />
        </ProtectedRoute>
      } />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);