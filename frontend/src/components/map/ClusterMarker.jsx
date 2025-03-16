import React from 'react';
import { MarkerClusterGroup } from 'react-leaflet-markercluster';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';

const ClusterMarker = ({ crimes }) => {
  // Create a custom icon for crime markers
  const crimeIcon = (type) => {
    const iconMap = {
      theft: { color: '#FF5733' },
      assault: { color: '#C70039' },
      burglary: { color: '#900C3F' },
      vandalism: { color: '#581845' },
      drug: { color: '#FFC300' },
      fraud: { color: '#DAF7A6' },
      homicide: { color: '#FF0000' },
      robbery: { color: '#FF5733' },
      violence: { color: '#C70039' },
    };
    
    const iconConfig = iconMap[type] || { color: '#3498DB' };
    
    return L.divIcon({
      html: `<div style="background-color: ${iconConfig.color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
      className: 'custom-div-icon',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  return (
    <MarkerClusterGroup
      showCoverageOnHover={true}
      spiderfyOnMaxZoom={true}
      removeOutsideVisibleBounds={true}
      chunkedLoading={true}
      iconCreateFunction={(cluster) => {
        const count = cluster.getChildCount();
        let size;
        let className;
        
        if (count < 10) {
          size = 30;
          className = 'cluster-small';
        } else if (count < 100) {
          size = 40;
          className = 'cluster-medium';
        } else {
          size = 50;
          className = 'cluster-large';
        }
        
        return L.divIcon({
          html: `<div class="cluster-marker"><span>${count}</span></div>`,
          className: `marker-cluster ${className}`,
          iconSize: L.point(size, size),
        });
      }}
    >
      {crimes.map((crime) => (
        <Marker 
          key={crime.id} 
          position={[crime.latitude, crime.longitude]}
          icon={crimeIcon(crime.type)}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{crime.type}</h3>
              <p>{crime.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(crime.date).toLocaleDateString()} at {new Date(crime.date).toLocaleTimeString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};

export default ClusterMarker;