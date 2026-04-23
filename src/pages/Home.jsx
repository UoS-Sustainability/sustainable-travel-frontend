//latest Modified Old frontend before integration with backend
//some imports added/modified for integration with backend
import {useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOperators, getTickets } from '../lib/api';
// import { mapOperator, mapTicket } from '../lib/mappers';
import { useAsyncData } from '../hooks/useAsyncData';
import './Home.css';

const quickLinks = [
  { to: '/ticketing', icon: '🎫', title: 'Ticketing & Prices', desc: 'Compare fares across operators' },
  { to: '/zones', icon: '🗺️', title: 'Travel Zones', desc: 'Understand zone boundaries' },
  { to: '/map', icon: '📍', title: 'Interactive Map', desc: 'Find stops near campus' },
  { to: '/sustainability', icon: '🌱', title: 'Go Green', desc: 'Sustainable travel tips' },
];

const transportFilters = [
  { key: 'all', label: 'All Types' },
  { key: 'Bus', label: 'Bus' },
  { key: 'Metro', label: 'Metro' },
  { key: 'Train', label: 'Train' },
];

const priceFilters = [
  { key: 'all', label: 'Any Price' },
  { key: 'under3', label: 'Under £3' },
  { key: 'under6', label: 'Under £6' },
  { key: 'under20', label: 'Under £20' },
  { key: 'over20', label: '£20+' },
];

const durationFilters = [
  { key: 'all', label: 'Any Duration' },
  { key: 'single', label: 'Single' },
  { key: 'day', label: 'Day Pass' },
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly+' },
];

function formatPrice(value) {
  return `£${Number(value).toFixed(2)}`;
}

//Modified for integration
function matchesDuration(ticket, durKey) {
  const d = (ticket.duration || '').toLowerCase();
  const n = (ticket.name || '').toLowerCase();

  switch (durKey) {
    case "single":
      return d.includes("one") || n.includes("single");
    case "day":
      return d.includes("day");
    case "week":
      return d.includes("7") || d.includes("week") || n.includes("week");
    case "month":
      return d.includes("28") || d.includes("month") || d.includes("term") || d.includes("year");
    default:
      return true;
  }
}

//Modified for integration
export default function Home() {

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');

  const { data: operators, loading, error } = useAsyncData(async () => {
    const [ops, tickets] = await Promise.all([getOperators(), getTickets()]);

    return ops.map((op) => ({
      ...op,
      tickets: tickets
      .filter((ticket) => ticket.operator_id === op.id)
      .map((ticket) => ({
        id: ticket.id,
        name: ticket.ticket_type,
        note: ticket.note ?? '',
        duration:ticket.duration,
        rawPrice: Number(ticket.price ?? 0),
        price: formatPrice(ticket.price),
      })),
  }));
}, []);

const filteredOperators = useMemo(() => {
    return operators
      .map((op) => {
        if (typeFilter !== "all" && op.type !== typeFilter) return null;

        let tickets = [...op.tickets];

        if (priceFilter !== "all") {
          tickets = tickets.filter((t) => {
            const p = t.rawPrice;
            switch (priceFilter) {
              case "under3":
                return p < 3;
              case "under6":
                return p < 6;
              case "under20":
                return p < 20;
              case "over20":
                return p >= 20;
              default:
                return true;
            }
          });
        }

        if (durationFilter !== "all") {
          tickets = tickets.filter((t) => matchesDuration(t, durationFilter));
        }

        if (search.trim()) {
          const q = search.toLowerCase();
          const operatorMatch =
            op.name.toLowerCase().includes(q) || op.type.toLowerCase().includes(q);

          if (!operatorMatch) {
            tickets = tickets.filter(
              (t) =>
                t.name.toLowerCase().includes(q) ||
                t.note.toLowerCase().includes(q)
            );
          }
        }

        if (tickets.length === 0) return null;

        return { ...op, tickets };
      })
      .filter(Boolean);
  }, [operators, search, typeFilter, priceFilter, durationFilter]);

  const clearAllFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setPriceFilter("all");
    setDurationFilter("all");
  };

  if (loading) {
    return <div className="page-loading">Loading travel data...</div>;
  }

  if (error) {
    return <div className="page-error">Failed to load travel data: {error}</div>;
  }

  return (
    <div className="page home">
      <section className="hero">
        <div className="container hero-center">
          {/* <span className="hero-badge">University of Sunderland</span> */}
          <h1 className="hero-title">
            Where are you <span className="hero-accent">travelling</span> today?
          </h1>
          <p className="hero-desc">
            Find tickets, compare prices, and explore transport options across the North East.
          </p>
        </div>
      </section>

      <div className="search-panel-wrapper">
        <div className="container">
          <div className="search-panel">
            <div className="search-bar">
              <svg className="search-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search for operators or tickets types"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="search-bar-input"
                aria-label="Search travel options"
              />
              <button
                type="button"
                className="search-bar-btn"
                onClick={() => setSearch(searchInput)}
              >
                Search
              </button>
            </div>

            <div className="filter-row">
              <div className="filter-select-group">
                <label className="filter-select-label" htmlFor="filter-type">Transport</label>
                <div className="select-wrapper">
                  <select
                    id="filter-type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className={`filter-select ${typeFilter !== 'all' ? 'has-value' : ''}`}
                  >
                    {transportFilters.map((f) => (
                      <option key={f.key} value={f.key}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-select-group">
                <label className="filter-select-label" htmlFor="filter-price">Price</label>
                <div className="select-wrapper">
                  <select
                    id="filter-price"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className={`filter-select ${priceFilter !== 'all' ? 'has-value' : ''}`}
                  >
                    {priceFilters.map((f) => (
                      <option key={f.key} value={f.key}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-select-group">
                <label className="filter-select-label" htmlFor="filter-duration">Duration</label>
                <div className="select-wrapper">
                  <select
                    id="filter-duration"
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                    className={`filter-select ${durationFilter !== 'all' ? 'has-value' : ''}`}
                  >
                    {durationFilters.map((f) => (
                      <option key={f.key} value={f.key}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* {activeFilterCount > 0 && ( */}
              <button type="button" className="clear-filters-btn" onClick={clearAllFilters}>
                Clear filters
              </button>
              {/* ) */}
              {/* } */}
            </div>
          </div>
        </div>
      </div>

      <section className="section quick-links-section">
        <div className="container">
          <div className="quick-links-grid">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="quick-link-card">
                <span className="quick-link-icon">{link.icon}</span>
                <h3>{link.title}</h3>
                <p>{link.desc}</p>
                <span className="quick-link-arrow">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section operators-section">
        <div className="container">
          <h2 className="section-title">Transport Operators</h2>
          <p className="section-subtitle">
            Key transport providers serving the University of Sunderland and the wider North East region.
          </p>

            {/* Added loading and error states */}
          {loading ? (
          <p className="loading-message">Loading transport operators...</p>
          ) : error ? (
          <p className="error-message">{error}</p>
          ) : 
          // {/* // Original continues from here */}
            filteredOperators.length === 0 ? (
            <div className="no-results">
              <p>No results match your filters. Try adjusting your search or filters.</p>
              <button className="no-results-btn" onClick={clearAllFilters}>
                Clear all filters
              </button>
            </div>
            // )
          ) : (
            <div className="operators-grid">
              {filteredOperators.map((op) => (
                <div key={op.id} className="operator-card">
                  <div className="operator-card-header" style={{ borderLeftColor: op.color }}>
                    <span className="operator-type-badge" style={{ background: op.color }}>
                      {op.type}
                    </span>
                    <h3>{op.name}</h3>
                  </div>
                  <p className="operator-desc">{op.description}</p>

                  <div className="operator-tickets-preview">
                    {/* // Old code in comment below */}
                    {/* {op.tickets.slice(0, 3).map((t, i) => ( */}
                    {op.tickets.slice(0, 3).map((t) => (
                    //  <div key={i} className="ticket-preview-row">
                      <div key={t.id} className="ticket-preview-row">
                        <span className="ticket-preview-name">{t.name}</span>
                        <span className="ticket-preview-price">{t.price}</span>
                      </div>
                    ))}
                    {op.tickets.length > 3 && (
                      <span className="ticket-preview-more">+{op.tickets.length - 3} more</span>
                    )}
                  </div>

                  <div className="operator-card-footer">
                    <span className="operator-price">
                      {/* Old code in comment below */}
                      {/* From {op.tickets[0].price} */}
                      From {op.tickets[0]?.price || 'N/A'}
                    </span>
                    <Link to="/ticketing" className="operator-link">
                      View all prices &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Travel Greener Today</h2>
              <p>
                Small changes in how you travel make a big difference. Explore sustainable
                options and find what works for your commute.
              </p>
              <Link to="/sustainability" className="btn btn-primary">
                Sustainability Tips
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


//Modified first working frontend before integration with backend
//some imports added/modified for integration with backend
// import { useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { getOperators, getTickets } from '../lib/api';
// import { mapOperator, mapTicket } from '../lib/mappers';
// import './Home.css';

// const quickLinks = [
//   { to: '/ticketing', icon: '🎫', title: 'Ticketing & Prices', desc: 'Compare fares across operators' },
//   { to: '/zones', icon: '🗺️', title: 'Travel Zones', desc: 'Understand zone boundaries' },
//   { to: '/map', icon: '📍', title: 'Interactive Map', desc: 'Find stops near campus' },
//   { to: '/sustainability', icon: '🌱', title: 'Go Green', desc: 'Sustainable travel tips' },
// ];

// const transportFilters = [
//   { key: 'all', label: 'All Types' },
//   { key: 'Bus', label: 'Bus' },
//   { key: 'Metro', label: 'Metro' },
//   { key: 'Train', label: 'Train' },
// ];

// const priceFilters = [
//   { key: 'all', label: 'Any Price' },
//   { key: 'under3', label: 'Under £3' },
//   { key: 'under6', label: 'Under £6' },
//   { key: 'under20', label: 'Under £20' },
//   { key: 'over20', label: '£20+' },
// ];

// const durationFilters = [
//   { key: 'all', label: 'Any Duration' },
//   { key: 'single', label: 'Single' },
//   { key: 'day', label: 'Day Pass' },
//   { key: 'week', label: 'Weekly' },
//   { key: 'month', label: 'Monthly+' },
// ];

// //Modified for integration
// function parsePrice(priceStr) {
//   return parseFloat(String(priceStr).replace('£', '')) || 0;
// }

// //Modified for integration
// function matchesDuration(ticket, durKey) {
//   const d = (ticket.duration || '').toLowerCase();
//   const n = (ticket.name || '').toLowerCase();

//   switch (durKey) {
//     case 'single':
//       return d.includes('one journey') || n.includes('single');
//     case 'day':
//       return d.includes('1 day') || d.includes('day');
//     case 'week':
//       return d.includes('7 day') || n.includes('week');
//     case 'month':
//       return d.includes('28 day') || d.includes('term') || d.includes('year') || n.includes('month');
//     default:
//       return true;
//   }
// }

// //Modified for integration
// export default function Home() {
//   const [operators, setOperators] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [search, setSearch] = useState('');
//   const [typeFilter, setTypeFilter] = useState('all');
//   const [priceFilter, setPriceFilter] = useState('all');
//   const [durationFilter, setDurationFilter] = useState('all');

//   useEffect(() => {
//     async function loadData() {
//       try {
//         setLoading(true);
//         setError('');

//         const [operatorsRes, ticketsRes] = await Promise.all([
//           getOperators(),
//           getTickets(),
//         ]);

//         const operatorsData = Array.isArray(operatorsRes?.data) ? operatorsRes.data : [];
//         const ticketsData = Array.isArray(ticketsRes?.data) ? ticketsRes.data : [];

//         const mappedTickets = ticketsData.map(mapTicket);
//         const mappedOperators = operatorsData.map(mapOperator).map((op) => ({
//           ...op,
//           tickets: mappedTickets.filter(
//             (ticket) => String(ticket.operatorId) === String(op.id)
//           ),
//         }));

//         setOperators(mappedOperators);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load transport operators and tickets.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, []);

// const filteredOperators = useMemo(() => {
//     return operators
//       .map((op) => {
//         if (typeFilter !== 'all' && op.type !== typeFilter) return null;

//         let tickets = [...(op.tickets || [])];

//         if (priceFilter !== 'all') {
//           tickets = tickets.filter((t) => {
//             const p = parsePrice(t.price);

//             switch (priceFilter) {
//               case 'under3':
//                 return p < 3;
//               case 'under6':
//                 return p < 6;
//               case 'under20':
//                 return p < 20;
//               case 'over20':
//                 return p >= 20;
//               default:
//                 return true;
//             }
//           });
//         }

//         if (durationFilter !== 'all') {
//           tickets = tickets.filter((t) => matchesDuration(t, durationFilter));
//         }

//         if (search.trim()) {
//           const q = search.toLowerCase();
//           const nameMatch =
//             (op.name || '').toLowerCase().includes(q) ||
//             (op.type || '').toLowerCase().includes(q);

//           if (!nameMatch) {
//             tickets = tickets.filter(
//               (t) =>
//                 (t.name || '').toLowerCase().includes(q) ||
//                 (t.note || '').toLowerCase().includes(q)
//             );
//           }
//         }

//         if (tickets.length === 0) return null;

//         return { ...op, tickets };
//       })
//       .filter(Boolean);
//   }, [operators, search, typeFilter, priceFilter, durationFilter]);

//   const activeFilterCount =
//     (typeFilter !== 'all' ? 1 : 0) +
//     (priceFilter !== 'all' ? 1 : 0) +
//     (durationFilter !== 'all' ? 1 : 0);

//   const clearAllFilters = () => {
//     setSearch('');
//     setTypeFilter('all');
//     setPriceFilter('all');
//     setDurationFilter('all');
//   };

//   return (
//     <div className="page home">
//       <section className="hero">
//         <div className="container hero-center">
//           {/* <span className="hero-badge">University of Sunderland</span> */}
//           <h1 className="hero-title">
//             Where are you <span className="hero-accent">travelling</span> today?
//           </h1>
//           <p className="hero-desc">
//             Find tickets, compare prices, and explore transport options across the North East.
//           </p>
//         </div>
//       </section>
// {/* Move below by one tab left */}
//       <div className="search-panel-wrapper">
//         <div className="container">
//           <div className="search-panel">
//             <div className="search-bar">
//               <svg className="search-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="11" cy="11" r="8" />
//                 <line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//               <input
//                 type="text"
//               // later, Consider changing the 'routes' in placeholder below
//                 placeholder="Search for tickets, operators, routes..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="search-bar-input"
//                 aria-label="Search travel options"
//               />
//               <button
//                 type="button"
//                 className="search-bar-btn"
//                 //the function below is has no function defined yet
//                 onClick={() => {}}
//               >
//                 Search
//               </button>
//             </div>

//             <div className="filter-row">
//               <div className="filter-select-group">
//                 <label className="filter-select-label" htmlFor="filter-type">Transport</label>
//                 <div className="select-wrapper">
//                   <select
//                     id="filter-type"
//                     value={typeFilter}
//                     onChange={(e) => setTypeFilter(e.target.value)}
//                     className={`filter-select ${typeFilter !== 'all' ? 'has-value' : ''}`}
//                   >
//                     {transportFilters.map((f) => (
//                       <option key={f.key} value={f.key}>{f.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="filter-select-group">
//                 <label className="filter-select-label" htmlFor="filter-price">Price</label>
//                 <div className="select-wrapper">
//                   <select
//                     id="filter-price"
//                     value={priceFilter}
//                     onChange={(e) => setPriceFilter(e.target.value)}
//                     className={`filter-select ${priceFilter !== 'all' ? 'has-value' : ''}`}
//                   >
//                     {priceFilters.map((f) => (
//                       <option key={f.key} value={f.key}>{f.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="filter-select-group">
//                 <label className="filter-select-label" htmlFor="filter-duration">Duration</label>
//                 <div className="select-wrapper">
//                   <select
//                     id="filter-duration"
//                     value={durationFilter}
//                     onChange={(e) => setDurationFilter(e.target.value)}
//                     className={`filter-select ${durationFilter !== 'all' ? 'has-value' : ''}`}
//                   >
//                     {durationFilters.map((f) => (
//                       <option key={f.key} value={f.key}>{f.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {activeFilterCount > 0 && (
//                 <button type="button" className="clear-filters-btn" onClick={clearAllFilters}>
//                   Clear filters
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <section className="section quick-links-section">
//         <div className="container">
//           <div className="quick-links-grid">
//             {quickLinks.map((link) => (
//               <Link key={link.to} to={link.to} className="quick-link-card">
//                 <span className="quick-link-icon">{link.icon}</span>
//                 <h3>{link.title}</h3>
//                 <p>{link.desc}</p>
//                 <span className="quick-link-arrow">&rarr;</span>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="section operators-section">
//         <div className="container">
//           <h2 className="section-title">Transport Operators</h2>
//           <p className="section-subtitle">
//             Key transport providers serving the University of Sunderland and the wider North East region.
//           </p>

//             {/* Added loading and error states */}
//           {loading ? (
//           <p className="loading-message">Loading transport operators...</p>
//           //   <div className="operators-grid">
//           //     {filteredOperators.map((op) => (
//           //       <div key={op.id} className="operator-card">
//           //         <div className="operator-card-header" style={{ borderLeftColor: op.color }}>
//           //           <span className="operator-type-badge" style={{ background: op.color }}>
//           //             {op.type}
//           //           </span>
//           //           <h3>{op.name}</h3>
//           //         </div>
//           //         <p className="operator-desc">{op.description}</p>

//           //         <div className="operator-tickets-preview">
//           //           {/* // Old code in comment below */}
//           //           {/* {op.tickets.slice(0, 3).map((t, i) => ( */}
//           //           {op.tickets.slice(0, 3).map((t) => (
//           //           //  <div key={i} className="ticket-preview-row">
//           //             <div key={t.id} className="ticket-preview-row">
//           //               <span className="ticket-preview-name">Okay{t.name}</span>
//           //               <span className="ticket-preview-price">{t.price}</span>
//           //             </div>
//           //           ))}
//           //           {op.tickets.length > 3 && (
//           //             <span className="ticket-preview-more">+{op.tickets.length - 3} more</span>
//           //           )}
//           //         </div>

//           //         <div className="operator-card-footer">
//           //           <span className="operator-price">
//           //             {/* Old code in comment below */}
//           //             {/* From {op.tickets[0].price} */}
//           //             From {op.tickets[0]?.price || 'N/A'}
//           //           </span>
//           //           <Link to="/ticketing" className="operator-link">
//           //             View all prices &rarr;
//           //           </Link>
//           //         </div>
//           //       </div>
//           //     ))}
//           //   </div>
//           ) : error ? (
//           <p className="error-message">{error}</p>
//           ) : 
//           // {/* // Original continues from here */}
//             filteredOperators.length === 0 ? (
//             <div className="no-results">
//               <p>No results match your filters. Try adjusting your search or filters.</p>
//               <button className="no-results-btn" onClick={clearAllFilters}>
//                 Clear all filters
//               </button>
//             </div>
//             // )
//           ) : (
//             <div className="operators-grid">
//               {filteredOperators.map((op) => (
//                 <div key={op.id} className="operator-card">
//                   <div className="operator-card-header" style={{ borderLeftColor: op.color }}>
//                     <span className="operator-type-badge" style={{ background: op.color }}>
//                       {op.type}
//                     </span>
//                     <h3>{op.name}</h3>
//                   </div>
//                   <p className="operator-desc">{op.description}</p>

//                   <div className="operator-tickets-preview">
//                     {/* // Old code in comment below */}
//                     {/* {op.tickets.slice(0, 3).map((t, i) => ( */}
//                     {op.tickets.slice(0, 3).map((t) => (
//                     //  <div key={i} className="ticket-preview-row">
//                       <div key={t.id} className="ticket-preview-row">
//                         <span className="ticket-preview-name">Okay{t.name}</span>
//                         <span className="ticket-preview-price">{t.price}</span>
//                       </div>
//                     ))}
//                     {op.tickets.length > 3 && (
//                       <span className="ticket-preview-more">+{op.tickets.length - 3} more</span>
//                     )}
//                   </div>

//                   <div className="operator-card-footer">
//                     <span className="operator-price">
//                       {/* Old code in comment below */}
//                       {/* From {op.tickets[0].price} */}
//                       From {op.tickets[0]?.price || 'N/A'}
//                     </span>
//                     <Link to="/ticketing" className="operator-link">
//                       View all prices &rarr;
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       <section className="section cta-section">
//         <div className="container">
//           <div className="cta-card">
//             <div className="cta-content">
//               <h2>Travel Greener Today</h2>
//               <p>
//                 Small changes in how you travel make a big difference. Explore sustainable
//                 options and find what works for your commute.
//               </p>
//               <Link to="/sustainability" className="btn btn-primary">
//                 Sustainability Tips
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


//Original Old frontend before integration with backend
// import { useState, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import { operators } from '../data/travelData';
// import './Home.css';

// const quickLinks = [
//   { to: '/ticketing', icon: '🎫', title: 'Ticketing & Prices', desc: 'Compare fares across operators' },
//   { to: '/zones', icon: '🗺️', title: 'Travel Zones', desc: 'Understand zone boundaries' },
//   { to: '/map', icon: '📍', title: 'Interactive Map', desc: 'Find stops near campus' },
//   { to: '/sustainability', icon: '🌱', title: 'Go Green', desc: 'Sustainable travel tips' },
// ];

// const transportFilters = [
//   { key: 'all', label: 'All Types' },
//   { key: 'Bus', label: 'Bus' },
//   { key: 'Metro', label: 'Metro' },
//   { key: 'Train', label: 'Train' },
// ];

// const priceFilters = [
//   { key: 'all', label: 'Any Price' },
//   { key: 'under3', label: 'Under £3' },
//   { key: 'under6', label: 'Under £6' },
//   { key: 'under20', label: 'Under £20' },
//   { key: 'over20', label: '£20+' },
// ];

// const durationFilters = [
//   { key: 'all', label: 'Any Duration' },
//   { key: 'single', label: 'Single' },
//   { key: 'day', label: 'Day Pass' },
//   { key: 'week', label: 'Weekly' },
//   { key: 'month', label: 'Monthly+' },
// ];

// function parsePrice(priceStr) {
//   return parseFloat(priceStr.replace('£', ''));
// }

// function matchesDuration(ticket, durKey) {
//   const d = ticket.duration.toLowerCase();
//   const n = ticket.name.toLowerCase();
//   switch (durKey) {
//     case 'single': return d.includes('one journey');
//     case 'day': return d.includes('1 day') || d.includes('day');
//     case 'week': return d.includes('7 day') || n.includes('week');
//     case 'month': return d.includes('28 day') || d.includes('term') || d.includes('year');
//     default: return true;
//   }
// }

// export default function Home() {
//   const [search, setSearch] = useState('');
//   const [typeFilter, setTypeFilter] = useState('all');
//   const [priceFilter, setPriceFilter] = useState('all');
//   const [durationFilter, setDurationFilter] = useState('all');

//   const filteredOperators = useMemo(() => {
//     return operators
//       .map((op) => {
//         if (typeFilter !== 'all' && op.type !== typeFilter) return null;

//         let tickets = op.tickets;

//         if (priceFilter !== 'all') {
//           tickets = tickets.filter((t) => {
//             const p = parsePrice(t.price);
//             switch (priceFilter) {
//               case 'under3': return p < 3;
//               case 'under6': return p < 6;
//               case 'under20': return p < 20;
//               case 'over20': return p >= 20;
//               default: return true;
//             }
//           });
//         }

//         if (durationFilter !== 'all') {
//           tickets = tickets.filter((t) => matchesDuration(t, durationFilter));
//         }

//         if (search.trim()) {
//           const q = search.toLowerCase();
//           const nameMatch = op.name.toLowerCase().includes(q) || op.type.toLowerCase().includes(q);
//           if (!nameMatch) {
//             tickets = tickets.filter(
//               (t) => t.name.toLowerCase().includes(q) || t.note.toLowerCase().includes(q)
//             );
//           }
//         }

//         if (tickets.length === 0) return null;
//         return { ...op, tickets };
//       })
//       .filter(Boolean);
//   }, [search, typeFilter, priceFilter, durationFilter]);

//   const activeFilterCount =
//     (typeFilter !== 'all' ? 1 : 0) +
//     (priceFilter !== 'all' ? 1 : 0) +
//     (durationFilter !== 'all' ? 1 : 0);

//   const clearAllFilters = () => {
//     setSearch('');
//     setTypeFilter('all');
//     setPriceFilter('all');
//     setDurationFilter('all');
//   };

//   return (
//     <div className="page home">
//       <section className="hero">
//         <div className="container hero-center">
//           {/* <span className="hero-badge">University of Sunderland</span> */}
//           <h1 className="hero-title">
//             Where are you <span className="hero-accent">travelling</span> today?
//           </h1>
//           <p className="hero-desc">
//             Find tickets, compare prices, and explore transport options across the North East.
//           </p>
//         </div>
//       </section>

//       <div className="search-panel-wrapper">
//         <div className="container">
//           <div className="search-panel">
//             <div className="search-bar">
//               <svg className="search-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="11" cy="11" r="8" />
//                 <line x1="21" y1="21" x2="16.65" y2="16.65" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search for tickets, operators, routes..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="search-bar-input"
//                 aria-label="Search travel options"
//               />
//               <button
//                 type="button"
//                 className="search-bar-btn"
//                 onClick={() => {}}
//               >
//                 Search
//               </button>
//             </div>

//             <div className="filter-row">
//               <div className="filter-select-group">
//                 <label className="filter-select-label" htmlFor="filter-type">Transport</label>
//                 <div className="select-wrapper">
//                   <select
//                     id="filter-type"
//                     value={typeFilter}
//                     onChange={(e) => setTypeFilter(e.target.value)}
//                     className={`filter-select ${typeFilter !== 'all' ? 'has-value' : ''}`}
//                   >
//                     {transportFilters.map((f) => (
//                       <option key={f.key} value={f.key}>{f.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="filter-select-group">
//                 <label className="filter-select-label" htmlFor="filter-price">Price</label>
//                 <div className="select-wrapper">
//                   <select
//                     id="filter-price"
//                     value={priceFilter}
//                     onChange={(e) => setPriceFilter(e.target.value)}
//                     className={`filter-select ${priceFilter !== 'all' ? 'has-value' : ''}`}
//                   >
//                     {priceFilters.map((f) => (
//                       <option key={f.key} value={f.key}>{f.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="filter-select-group">
//                 <label className="filter-select-label" htmlFor="filter-duration">Duration</label>
//                 <div className="select-wrapper">
//                   <select
//                     id="filter-duration"
//                     value={durationFilter}
//                     onChange={(e) => setDurationFilter(e.target.value)}
//                     className={`filter-select ${durationFilter !== 'all' ? 'has-value' : ''}`}
//                   >
//                     {durationFilters.map((f) => (
//                       <option key={f.key} value={f.key}>{f.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {activeFilterCount > 0 && (
//                 <button className="clear-filters-btn" onClick={clearAllFilters}>
//                   Clear filters
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <section className="section quick-links-section">
//         <div className="container">
//           <div className="quick-links-grid">
//             {quickLinks.map((link) => (
//               <Link key={link.to} to={link.to} className="quick-link-card">
//                 <span className="quick-link-icon">{link.icon}</span>
//                 <h3>{link.title}</h3>
//                 <p>{link.desc}</p>
//                 <span className="quick-link-arrow">&rarr;</span>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="section operators-section">
//         <div className="container">
//           <h2 className="section-title">Transport Operators</h2>
//           <p className="section-subtitle">
//             Key transport providers serving the University of Sunderland and the wider North East region.
//           </p>

//           {filteredOperators.length === 0 ? (
//             <div className="no-results">
//               <p>No results match your filters. Try adjusting your search or filters.</p>
//               <button className="no-results-btn" onClick={clearAllFilters}>
//                 Clear all filters
//               </button>
//             </div>
//           ) : (
//             <div className="operators-grid">
//               {filteredOperators.map((op) => (
//                 <div key={op.id} className="operator-card">
//                   <div className="operator-card-header" style={{ borderLeftColor: op.color }}>
//                     <span className="operator-type-badge" style={{ background: op.color }}>
//                       {op.type}
//                     </span>
//                     <h3>{op.name}</h3>
//                   </div>
//                   <p className="operator-desc">{op.description}</p>

//                   <div className="operator-tickets-preview">
//                     {op.tickets.slice(0, 3).map((t, i) => (
//                       <div key={i} className="ticket-preview-row">
//                         <span className="ticket-preview-name">{t.name}</span>
//                         <span className="ticket-preview-price">{t.price}</span>
//                       </div>
//                     ))}
//                     {op.tickets.length > 3 && (
//                       <span className="ticket-preview-more">+{op.tickets.length - 3} more</span>
//                     )}
//                   </div>

//                   <div className="operator-card-footer">
//                     <span className="operator-price">
//                       From {op.tickets[0].price}
//                     </span>
//                     <Link to="/ticketing" className="operator-link">
//                       View all prices &rarr;
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       <section className="section cta-section">
//         <div className="container">
//           <div className="cta-card">
//             <div className="cta-content">
//               <h2>Travel Greener Today</h2>
//               <p>
//                 Small changes in how you travel make a big difference. Explore sustainable
//                 options and find what works for your commute.
//               </p>
//               <Link to="/sustainability" className="btn btn-primary">
//                 Sustainability Tips
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
