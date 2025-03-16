import React, { useMemo } from 'react';

const CrimeStats = ({ data }) => {
  const stats = useMemo(() => {
    if (!data.length) {
      return {
        totalCrimes: 0,
        changePercentage: 0,
        crimeRate: 0,
        mostCommonType: 'N/A',
        hottestSpot: 'N/A',
        solvedPercentage: 0
      };
    }

    // Calculate total crimes
    const totalCrimes = data.length;
    
    // Calculate crime rate (per 100,000 population)
    const population = 1000000; // This would come from your actual data
    const crimeRate = (totalCrimes / population) * 100000;
    
    // Calculate change percentage (comparing to previous period)
    // This is a placeholder; in a real app, you'd compare with previous period data
    const previousPeriodCrimes = totalCrimes * 0.9; // Simulating previous period as 90% of current
    const changePercentage = ((totalCrimes - previousPeriodCrimes) / previousPeriodCrimes) * 100;
    
    // Find most common crime type
    const typeCounts = data.reduce((acc, crime) => {
      acc[crime.type] = (acc[crime.type] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonType = Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b, 'N/A');
    
    // Find hottest crime spot
    const locationCounts = data.reduce((acc, crime) => {
      const location = crime.area || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    
    const hottestSpot = Object.keys(locationCounts).reduce((a, b) => 
      locationCounts[a] > locationCounts[b] ? a : b, 'N/A');
    
    // Calculate solved percentage
    const solvedCrimes = data.filter(crime => crime.status === 'solved').length;
    const solvedPercentage = (solvedCrimes / totalCrimes) * 100;
    
    return {
      totalCrimes,
      changePercentage,
      crimeRate,
      mostCommonType,
      hottestSpot,
      solvedPercentage
    };
  }, [data]);

  const statCards = [
    {
      title: 'Total Crimes',
      value: stats.totalCrimes.toLocaleString(),
      change: stats.changePercentage.toFixed(1),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Crime Rate',
      value: stats.crimeRate.toFixed(1),
      suffix: 'per 100k',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Most Common Crime',
      value: stats.mostCommonType,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Hottest Crime Spot',
      value: stats.hottestSpot,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Crimes Solved',
      value: `${stats.solvedPercentage.toFixed(1)}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((card, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-primary bg-opacity-10 text-primary mr-3">
              {card.icon}
            </div>
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
          </div>
          <div className="flex items-end">
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            {card.suffix && (
              <div className="ml-1 text-sm text-gray-500">{card.suffix}</div>
            )}
          </div>
          {card.change && (
            <div className={`mt-1 text-sm font-medium ${
              parseFloat(card.change) >= 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {parseFloat(card.change) >= 0 ? `↑ ${card.change}%` : `↓ ${Math.abs(parseFloat(card.change))}%`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CrimeStats;