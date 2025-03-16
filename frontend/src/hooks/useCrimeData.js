import { useContext } from 'react';
import { CrimeDataContext } from '../context/CrimeDataContext';

export const useCrimeData = () => {
  const context = useContext(CrimeDataContext);
  if (!context) {
    throw new Error('useCrimeData must be used within a CrimeDataProvider');
  }
  return context;
};
