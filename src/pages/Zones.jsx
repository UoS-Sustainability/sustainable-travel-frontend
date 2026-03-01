import { zones, zonePricing } from '../data/travelData';
import './Zones.css';

export default function Zones() {
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
                Most UoS students only need <strong>Zone B</strong> (Sunderland) for daily travel.
                If you commute from Newcastle, you'll need a 2-zone ticket covering Zones A and B.
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
        </div>
      </section>
    </div>
  );
}
