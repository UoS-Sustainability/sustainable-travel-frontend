//Updated original code
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import { mapLocations } from '../data/travelData';
import { getLocations } from '../lib/api';
import { useAsyncData } from '../hooks/useAsyncData';
import './TravelMap.css';

const SUNDERLAND_CENTER = [54.9069, -1.3838];
const DEFAULT_ZOOM = 14;

const iconColors = {
  campus: '#F57C00',
  metro: '#FFD700',
  train: '#0D1B3E',
  bus: '#00A651',
};

const iconLabels = {
  campus: '🎓',
  metro: '🚇',
  train: '🚂',
  bus: '🚌',
};

function createIcon(type) {
  const color = iconColors[type] || '#F57C00';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 3px solid white;
    ">${iconLabels[type] || '📍'}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

const legendItems = [
  { type: 'campus', label: 'UoS Campus' },
  { type: 'metro', label: 'Metro Station' },
  { type: 'train', label: 'Train Station' },
  { type: 'bus', label: 'Bus Stop / Interchange' },
];

export default function TravelMap() {
  const { data: locations, loading, error } = useAsyncData(getLocations, []);
  
  const markers = useMemo(() => {
    return locations.map((loc) => ({
      ...loc,
      icon: createIcon(loc.type),
    }));
  }, [locations]);

  if (loading) {
    return <div className="page-loading">Loading map locations...</div>;
  }

  if (error) {
    return <div className="page-error">Failed to load map data: {error}</div>;
  }

  return (
    <div className="page travel-map">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Interactive Map</h1>
          <p className="page-desc">
            Explore transport links near the University of Sunderland campuses.
            {/* Click on markers to see details about each location. */}
          </p>
        </div>
      </section>

      <section className="section map-content">
        <div className="container">
          <div className="map-legend">
            {legendItems.map((item) => (
              <div key={item.type} className="legend-item">
                <span
                  className="legend-dot"
                  style={{ background: iconColors[item.type] }}
                >
                  {iconLabels[item.type]}
                </span>
                <span className="legend-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="map-wrapper">
            <MapContainer
              center={SUNDERLAND_CENTER}
              zoom={DEFAULT_ZOOM}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              className='travel-map'
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.map((loc) => (
                <Marker
                  key={loc.id}
                  position={[loc.lat, loc.lng]}
                  icon={createIcon(loc.type)}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>{loc.name}</h3>
                      <p>{loc.description}</p>
                      {loc.nearby_transport?.length > 0 && (
                        <div className="popup-transport">
                          <strong>Nearby Transport:</strong>
                          <ul>
                            {loc.nearby_transport.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="map-locations-grid">
            {locations
              .filter((loc) => loc.type === 'campus')
              .map((loc) => (
                <div key={loc.id} className="map-location-card">
                  <div className="map-location-icon" style={{ background: iconColors[loc.type] }}>
                    {iconLabels[loc.type]}
                  </div>
                  <div>
                    <h3>{loc.name}</h3>
                    <p>{loc.description}</p>
                    {loc.nearby_transport && (
                      <ul className="nearby-list">
                        {loc.nearby_transport.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

//New code
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { useMemo } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { getLocations } from "../lib/api";
// import { useAsyncData } from "../hooks/useAsyncData";
// import "./TravelMap.css";

// const SUNDERLAND_CENTER = [54.9069, -1.3838];
// const DEFAULT_ZOOM = 14;

// const iconColors = {
//   campus: "#F57C00",
//   metro: "#FFD700",
//   train: "#0D1B3E",
//   bus: "#00A651",
// };

// function createIcon(type) {
//   const color = iconColors[type] || "#F57C00";

//   return L.divIcon({
//     className: "custom-marker",
//     html: `
//       <div style="
//         width: 18px;
//         height: 18px;
//         border-radius: 50%;
//         background: ${color};
//         border: 3px solid white;
//         box-shadow: 0 2px 8px rgba(0,0,0,.3);
//       "></div>
//     `,
//     iconSize: [24, 24],
//     iconAnchor: [12, 12],
//     popupAnchor: [0, -12],
//   });
// }

// export default function TravelMap() {
//   const { data: locations, loading, error } = useAsyncData(getLocations, []);

//   const markers = useMemo(() => {
//     return locations.map((loc) => ({
//       ...loc,
//       icon: createIcon(loc.type),
//     }));
//   }, [locations]);

//   if (loading) {
//     return <div className="page-loading">Loading map locations...</div>;
//   }

//   if (error) {
//     return <div className="page-error">Failed to load map data: {error}</div>;
//   }

//   return (
//     <section className="travel-map-page">
//       <div className="travel-map-header">
//         <h1>Interactive Map</h1>
//         <p>Explore transport links near the University of Sunderland campuses.</p>
//       </div>

//       <MapContainer
//         center={SUNDERLAND_CENTER}
//         zoom={DEFAULT_ZOOM}
//         scrollWheelZoom={true}
//         className="travel-map"
//       >
//         <TileLayer
//           attribution="&copy; OpenStreetMap contributors"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {markers.map((loc) => (
//           <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={loc.icon}>
//             <Popup>
//               <h3>{loc.name}</h3>
//               <p>{loc.description}</p>

//               {loc.nearby_transport?.length > 0 && (
//                 <>
//                   <strong>Nearby transport:</strong>
//                   <ul>
//                     {loc.nearby_transport.map((item) => (
//                       <li key={item}>{item}</li>
//                     ))}
//                   </ul>
//                 </>
//               )}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </section>
//   );
// }

//Original code
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { mapLocations } from '../data/travelData';
// import './TravelMap.css';

// const SUNDERLAND_CENTER = [54.9069, -1.3838];
// const DEFAULT_ZOOM = 14;

// const iconColors = {
//   campus: '#F57C00',
//   metro: '#FFD700',
//   train: '#0D1B3E',
//   bus: '#00A651',
// };

// const iconLabels = {
//   campus: '🎓',
//   metro: '🚇',
//   train: '🚂',
//   bus: '🚌',
// };

// function createIcon(type) {
//   const color = iconColors[type] || '#F57C00';
//   return L.divIcon({
//     className: 'custom-marker',
//     html: `<div style="
//       background: ${color};
//       width: 36px;
//       height: 36px;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 18px;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.3);
//       border: 3px solid white;
//     ">${iconLabels[type] || '📍'}</div>`,
//     iconSize: [36, 36],
//     iconAnchor: [18, 18],
//     popupAnchor: [0, -20],
//   });
// }

// const legendItems = [
//   { type: 'campus', label: 'UoS Campus' },
//   { type: 'metro', label: 'Metro Station' },
//   { type: 'train', label: 'Train Station' },
//   { type: 'bus', label: 'Bus Stop / Interchange' },
// ];

// export default function TravelMap() {
//   return (
//     <div className="page travel-map">
//       <section className="page-header">
//         <div className="container">
//           <h1 className="page-title">Interactive Map</h1>
//           <p className="page-desc">
//             Explore transport links near the University of Sunderland campuses.
//             Click on markers to see details about each location.
//           </p>
//         </div>
//       </section>

//       <section className="section map-content">
//         <div className="container">
//           <div className="map-legend">
//             {legendItems.map((item) => (
//               <div key={item.type} className="legend-item">
//                 <span
//                   className="legend-dot"
//                   style={{ background: iconColors[item.type] }}
//                 >
//                   {iconLabels[item.type]}
//                 </span>
//                 <span className="legend-label">{item.label}</span>
//               </div>
//             ))}
//           </div>

//           <div className="map-wrapper">
//             <MapContainer
//               center={SUNDERLAND_CENTER}
//               zoom={DEFAULT_ZOOM}
//               scrollWheelZoom={true}
//               style={{ height: '100%', width: '100%' }}
//             >
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               {mapLocations.map((loc) => (
//                 <Marker
//                   key={loc.id}
//                   position={[loc.lat, loc.lng]}
//                   icon={createIcon(loc.type)}
//                 >
//                   <Popup>
//                     <div className="map-popup">
//                       <h3>{loc.name}</h3>
//                       <p>{loc.description}</p>
//                       {loc.nearbyTransport && (
//                         <div className="popup-transport">
//                           <strong>Nearby Transport:</strong>
//                           <ul>
//                             {loc.nearbyTransport.map((t, i) => (
//                               <li key={i}>{t}</li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}
//                     </div>
//                   </Popup>
//                 </Marker>
//               ))}
//             </MapContainer>
//           </div>

//           <div className="map-locations-grid">
//             {mapLocations
//               .filter((loc) => loc.type === 'campus')
//               .map((loc) => (
//                 <div key={loc.id} className="map-location-card">
//                   <div className="map-location-icon" style={{ background: iconColors[loc.type] }}>
//                     {iconLabels[loc.type]}
//                   </div>
//                   <div>
//                     <h3>{loc.name}</h3>
//                     <p>{loc.description}</p>
//                     {loc.nearbyTransport && (
//                       <ul className="nearby-list">
//                         {loc.nearbyTransport.map((t, i) => (
//                           <li key={i}>{t}</li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
