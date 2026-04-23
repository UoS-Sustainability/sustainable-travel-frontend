import { useMemo } from 'react';
import { getZones } from '../lib/api';
import { useAsyncData } from '../hooks/useAsyncData';
import { zonePricing } from '../data/travelData';

import './Zones.css';

const zoneMeta = {
  'Zone A': {
    label: 'Newcastle & Gateshead',
    highlight: false,
  },
  'Zone B': {
    label: 'North Tyneside & Coast',
    highlight: false,
  },
  'Zone C': {
    label: 'Sunderland & South Tyneside',
    highlight: true,
  },
  'Zone D': {
    label: 'Airport & Western Corridor',
    highlight: false,
  },
};

export default function Zones() {
  const { data, loading, error } = useAsyncData(getZones, []);

  const zones = useMemo(() => {
    return (data ?? []).map((zone) => {
      const meta = zoneMeta[zone.name] || {
        label: zone.name,
        highlight: false,
      };

      return {
        id: zone.id,
        name: zone.name,
        label: meta.label,
        color: zone.color,
        areas: zone.areas ?? [],
        metroStations: zone.metro_stations ?? [],
        highlight: meta.highlight,
      };
    });
  }, [data]);

  return (
    <div className="page zones">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Travel Zones</h1>
          <p className="page-desc">
            Tyne and Wear Metro and multi-operator tickets are structured around travel zones.
            Understanding zones helps you pick the right ticket and avoid overpaying.
          </p>
        </div>
      </section>

      <section className="section zones-content">
        <div className="container">
          {loading && (
            <p className="page-desc">Loading zones...</p>
          )}

          {error && (
            <p className="page-desc">Failed to load zones: {error}</p>
          )}

          {!loading && !error && (
            <>
              <div className="zones-grid">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`zone-card ${zone.highlight ? 'zone-highlight' : ''}`}
                  >
                    <div className="zone-card-header">
                      <div className="zone-badge" style={{ background: zone.color }}>
                        {zone.name}
                      </div>
                      <h3>{zone.label}</h3>
                      {zone.highlight && (
                        <span className="zone-campus-tag">Your Campus Zone</span>
                      )}
                    </div>

                    <div className="zone-card-body">
                      <div className="zone-info-group">
                        <h4>Areas Covered</h4>
                        <div className="zone-tags">
                          {zone.areas.map((area) => (
                            <span key={area} className="zone-tag">{area}</span>
                          ))}
                        </div>
                      </div>

                      <div className="zone-info-group">
                        <h4>Metro Stations</h4>
                        <div className="zone-tags">
                          {zone.metroStations.map((station) => (
                            <span key={station} className="zone-tag zone-tag-station">
                              {station}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="zone-pricing-section">
                <h2 className="section-title">Metro Zone Pricing</h2>
                <p className="section-subtitle">
                  Metro fares depend on how many zones you travel through. Here are the standard Nexus Metro fares.
                </p>

                <div className="zone-pricing-table-wrapper">
                  <table className="zone-pricing-table">
                    <thead>
                      <tr>
                        <th>Zones</th>
                        <th>Single</th>
                        <th>DaySaver</th>
                        <th>Weekly</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zonePricing.map((row, i) => (
                        <tr key={i}>
                          <td className="zone-label-cell">{row.zones}</td>
                          <td>{row.single}</td>
                          <td>{row.daySaver}</td>
                          <td>{row.weekly}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="zone-tips">
                <div className="zone-tip-card">
                  <span className="zone-tip-icon">🎓</span>
                  <h3>Student Zone Tip</h3>
                  <p>
                    Most UoS students only need <strong>Zone C</strong> (Sunderland) for daily travel.
                    If you commute from Newcastle, you'll need a 3-zone ticket covering Zones A, B, and C.
                  </p>
                </div>
                <div className="zone-tip-card">
                  <span className="zone-tip-icon">🔄</span>
                  <h3>Multi-Operator Passes</h3>
                  <p>
                    The <strong>Network One</strong> ticket allows travel on Metro, most buses, and some rail services
                    across multiple zones with a single ticket. Great value if you use mixed transport.
                  </p>
                </div>
                <div className="zone-tip-card">
                  <span className="zone-tip-icon">📱</span>
                  <h3>Pop Card</h3>
                  <p>
                    Get a <strong>Pop Pay As You Go</strong> card from Nexus for convenient tap-and-go
                    travel on Metro and participating buses. It automatically caps your daily spend.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}


//First modification
// // import {getZones} from "../lib/api";
// // import {useAsyncData} from "../hooks/useAsyncData";
// import {zones, zonePricing} from '../data/travelData';
// import './Zones.css';

// // const zonePricing = [
// //   { zones: '1', single: '£1.80', daySaver: '£4.50', weekly: '£18.00' },
// //   { zones: '2', single: '£2.50', daySaver: '£6.00', weekly: '£24.00' },
// //   { zones: '3', single: '£3.20', daySaver: '£7.50', weekly: '£30.00' },
// //   { zones: '4+', single: '£4.00', daySaver: '£9.00', weekly: '£36.00' },
// // ];

// export default function Zones() {
//   return (
//     <div className="page zones">
//       <section className="page-header">
//         <div className="container">
//           <h1 className="page-title">Travel Zones</h1>
//           <p className="page-desc">
//             Tyne and Wear Metro and multi-operator tickets are structured around travel zones.
//             Understanding zones helps you pick the right ticket and avoid overpaying.
//           </p>
//         </div>
//       </section>

//       <section className="section zones-content">
//         <div className="container">
//           <div className="zones-grid">
//             {zones.map((zone) => (
//               <div
//                 key={zone.id}
//                 className={`zone-card ${zone.highlight ? 'zone-highlight' : ''}`}
//               >
//                 <div className="zone-card-header">
//                   <div className="zone-badge" style={{ background: zone.color }}>
//                     {zone.name}
//                   </div>
//                   <h3>{zone.label}</h3>
//                   {zone.highlight && (
//                     <span className="zone-campus-tag">Your Campus Zone</span>
//                   )}
//                 </div>

//                 <div className="zone-card-body">
//                   <div className="zone-info-group">
//                     <h4>Areas Covered</h4>
//                     <div className="zone-tags">
//                       {zone.areas.map((area) => (
//                         <span key={area} className="zone-tag">{area}</span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="zone-info-group">
//                     <h4>Metro Stations</h4>
//                     <div className="zone-tags">
//                       {zone.metroStations.map((station) => (
//                         <span key={station} className="zone-tag zone-tag-station">
//                           {station}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="zone-pricing-section">
//             <h2 className="section-title">Metro Zone Pricing</h2>
//             <p className="section-subtitle">
//               Metro fares depend on how many zones you travel through. Here are the standard Nexus Metro fares.
//             </p>

//             <div className="zone-pricing-table-wrapper">
//               <table className="zone-pricing-table">
//                 <thead>
//                   <tr>
//                     <th>Zones</th>
//                     <th>Single</th>
//                     <th>DaySaver</th>
//                     <th>Weekly</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {zonePricing.map((row, i) => (
//                     <tr key={i}>
//                       <td className="zone-label-cell">{row.zones}</td>
//                       <td>{row.single}</td>
//                       <td>{row.daySaver}</td>
//                       <td>{row.weekly}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="zone-tips">
//             <div className="zone-tip-card">
//               <span className="zone-tip-icon">🎓</span>
//               <h3>Student Zone Tip</h3>
//               <p>
//                 Most UoS students only need <strong>Zone B</strong> (Sunderland) for daily travel.
//                 If you commute from Newcastle, you'll need a 2-zone ticket covering Zones A and B.
//               </p>
//             </div>
//             <div className="zone-tip-card">
//               <span className="zone-tip-icon">🔄</span>
//               <h3>Multi-Operator Passes</h3>
//               <p>
//                 The <strong>Network One</strong> ticket allows travel on Metro, most buses, and some rail services
//                 across multiple zones with a single ticket. Great value if you use mixed transport.
//               </p>
//             </div>
//             <div className="zone-tip-card">
//               <span className="zone-tip-icon">📱</span>
//               <h3>Pop Card</h3>
//               <p>
//                 Get a <strong>Pop Pay As You Go</strong> card from Nexus for convenient tap-and-go
//                 travel on Metro and participating buses. It automatically caps your daily spend.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


//Old code
// import { zones, zonePricing } from '../data/travelData';
// import './Zones.css';

// export default function Zones() {
//   return (
//     <div className="page zones">
//       <section className="page-header">
//         <div className="container">
//           <h1 className="page-title">Travel Zones</h1>
//           <p className="page-desc">
//             Tyne and Wear Metro and multi-operator tickets are structured around travel zones.
//             Understanding zones helps you pick the right ticket and avoid overpaying.
//           </p>
//         </div>
//       </section>

//       <section className="section zones-content">
//         <div className="container">
//           <div className="zones-grid">
//             {zones.map((zone) => (
//               <div
//                 key={zone.id}
//                 className={`zone-card ${zone.highlight ? 'zone-highlight' : ''}`}
//               >
//                 <div className="zone-card-header">
//                   <div className="zone-badge" style={{ background: zone.color }}>
//                     {zone.name}
//                   </div>
//                   <h3>{zone.label}</h3>
//                   {zone.highlight && (
//                     <span className="zone-campus-tag">Your Campus Zone</span>
//                   )}
//                 </div>

//                 <div className="zone-card-body">
//                   <div className="zone-info-group">
//                     <h4>Areas Covered</h4>
//                     <div className="zone-tags">
//                       {zone.areas.map((area) => (
//                         <span key={area} className="zone-tag">{area}</span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="zone-info-group">
//                     <h4>Metro Stations</h4>
//                     <div className="zone-tags">
//                       {zone.metroStations.map((station) => (
//                         <span key={station} className="zone-tag zone-tag-station">
//                           {station}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="zone-pricing-section">
//             <h2 className="section-title">Metro Zone Pricing</h2>
//             <p className="section-subtitle">
//               Metro fares depend on how many zones you travel through. Here are the standard Nexus Metro fares.
//             </p>

//             <div className="zone-pricing-table-wrapper">
//               <table className="zone-pricing-table">
//                 <thead>
//                   <tr>
//                     <th>Zones</th>
//                     <th>Single</th>
//                     <th>DaySaver</th>
//                     <th>Weekly</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {zonePricing.map((row, i) => (
//                     <tr key={i}>
//                       <td className="zone-label-cell">{row.zones}</td>
//                       <td>{row.single}</td>
//                       <td>{row.daySaver}</td>
//                       <td>{row.weekly}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="zone-tips">
//             <div className="zone-tip-card">
//               <span className="zone-tip-icon">🎓</span>
//               <h3>Student Zone Tip</h3>
//               <p>
//                 Most UoS students only need <strong>Zone B</strong> (Sunderland) for daily travel.
//                 If you commute from Newcastle, you'll need a 2-zone ticket covering Zones A and B.
//               </p>
//             </div>
//             <div className="zone-tip-card">
//               <span className="zone-tip-icon">🔄</span>
//               <h3>Multi-Operator Passes</h3>
//               <p>
//                 The <strong>Network One</strong> ticket allows travel on Metro, most buses, and some rail services
//                 across multiple zones with a single ticket. Great value if you use mixed transport.
//               </p>
//             </div>
//             <div className="zone-tip-card">
//               <span className="zone-tip-icon">📱</span>
//               <h3>Pop Card</h3>
//               <p>
//                 Get a <strong>Pop Pay As You Go</strong> card from Nexus for convenient tap-and-go
//                 travel on Metro and participating buses. It automatically caps your daily spend.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
