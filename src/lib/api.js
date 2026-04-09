const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  const json = await res.json();
  return json;
}

export async function getOperators(type) {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  return request(`/operators${query}`);
}

export async function getOperator(operatorId) {
  return request(`/operators/${operatorId}`);
}

export async function getTickets() {
  return request(`/tickets`);
}

export async function getTicketsByOperator(operatorId) {
  return request(`/tickets/operator/${operatorId}`);
}

export async function getZones() {
  return request(`/zones`);
}

export async function getLocations() {
  return request(`/locations`);
}

export async function getNearbyLocations(lat, lng, radius = 5) {
  return request(
    `/locations/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=${encodeURIComponent(radius)}`
  );
}