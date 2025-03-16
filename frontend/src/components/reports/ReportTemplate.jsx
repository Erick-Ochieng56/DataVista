import React from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';

const ReportTemplate = ({ 
  template, 
  onSelect, 
  isSelected, 
  previewMode = false 
}) => {
  const {
    id,
    title,
    description,
    type,
    createdAt,
    sections,
    thumbnail
  } = template;

  if (previewMode) {
    return (
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            {section.type === 'text' && (
              <div className="prose max-w-none">
                {section.content}
              </div>
            )}
            {section.type === 'chart' && (
              <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-48">
                <p className="text-gray-500">Chart: {section.chartType}</p>
              </div>
            )}
            {section.type === 'table' && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      {section.headers.map((header, i) => (
                        <th key={i} className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.data.slice(0, 3).map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="py-2 px-4 border-b border-gray-200 text-sm">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.type === 'map' && (
              <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-48">
                <p className="text-gray-500">Map Visualization</p>
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 text-right">
          <p className="text-sm text-gray-500">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="h-full w-full object-cover rounded" />
          ) : (
            <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>
      
        <div className="ml-4 flex-1">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <span className="capitalize">{type}</span>
            <span className="mx-2">•</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

ReportTemplate.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    sections: PropTypes.array,
    thumbnail: PropTypes.string
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  previewMode: PropTypes.bool
};

export default ReportTemplate;