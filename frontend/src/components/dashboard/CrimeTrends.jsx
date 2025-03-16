import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const CrimeTrends = ({ data, timeRange }) => {
  const trendData = useMemo(() => {
    if (!data.length) return [];
    
    // Determine date grouping based on time range
    let dateFormat;
    let groupingFunction;

    switch (timeRange) {
      case 'week':
        // Group by day
        dateFormat = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
        groupingFunction = (date) => date.toISOString().split('T')[0];
        break;
      case 'month':
        // Group by day
        dateFormat = (date) => date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
        groupingFunction = (date) => date.toISOString().split('T')[0];
        break;
      case 'year':
        // Group by month
        dateFormat = (date) => date.toLocaleDateString('en-US', { month: 'short' });
        groupingFunction = (date) => `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      default:
        // Group by month
        dateFormat = (date) => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        groupingFunction = (date) => `${date.getFullYear()}-${date.getMonth() + 1}`;
    }
    
    // Group crimes by date and type
    const groupedData = {};
    const crimeTypes = new Set();
    
    data.forEach(crime => {
      const date = new Date(crime.date);
      const dateKey = groupingFunction(date);
      const type = crime.type;
      
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {
          date: dateKey,
          displayDate: dateFormat(date),
          total: 0
        };
      }
      
      groupedData[dateKey][type] = (groupedData[dateKey][type] || 0) + 1;
      groupedData[dateKey].total += 1;
      crimeTypes.add(type);
    });
    
    // Sort by date
    const sortedData = Object.values(groupedData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    return {
      data: sortedData,
      types: Array.from(crimeTypes)
    };
  }, [data, timeRange]);

  // Get colors for each crime type
  const getColorForType = (type, index) => {
    const colors = [
      '#3498db', // blue
      '#e74c3c', // red
      '#2ecc71', // green
      '#f39c12', // yellow
      '#9b59b6', // purple
      '#1abc9c', // teal
      '#d35400', // orange
      '#34495e', // dark blue
      '#7f8c8d', // gray
      '#2c3e50', // navy
    ];
    
    // If we have a predefined color for this type, use it
    const typeColorMap = {
      theft: '#FF5733',
      assault: '#C70039',
      burglary: '#900C3F',
      vandalism: '#581845',
      drug: '#FFC300',
      fraud: '#DAF7A6',
      homicide: '#FF0000',
      robbery: '#FF5733',
      violence: '#C70039',
    };
    
    return typeColorMap[type] || colors[index % colors.length];
  };

  if (!trendData.data || trendData.data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No data available for the selected time range
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={trendData.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, name === 'total' ? 'Total Crimes' : name]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          
          {/* Total crimes line */}
          <Line
            type="monotone"
            dataKey="total"
            name="Total Crimes"
            stroke="#000000"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          
          {/* Line for each crime type */}
          {trendData.types.map((type, index) => (
            <Line
              key={type}
              type="monotone"
              dataKey={type}
              name={type.charAt(0).toUpperCase() + type.slice(1)}
              stroke={getColorForType(type, index)}
              dot={{ r: 2 }}
              strokeWidth={1.5}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrimeTrends;