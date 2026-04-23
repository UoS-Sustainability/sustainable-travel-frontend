const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set");
}

async function request(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  let json = null;

  try {
    json = await res.json();
  } catch {
    throw new Error(`Invalid JSON response from ${path}`);
  }

  if (!res.ok) {
    throw new Error(
      json?.detail ||
        json?.error ||
        json?.message ||
        `API request failed: ${res.status}`
    );
  }

  return json;
}

export async function getOperators(type) {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  const json = await request(`/operators${query}`);
  return json.data ?? [];
}

export async function getOperator(operatorId) {
  const json = await request(`/operators/${operatorId}`);
  return json.data;
}

export async function getTickets() {
  const json = await request(`/tickets`);
  return json.data ?? [];
}

export async function getTicketsByOperator(operatorId) {
  const json = await request(`/tickets/operator/${operatorId}`);
  return json.data ?? [];
}

export async function getZones() {
  const json = await request(`/zones`);
  return json.data ?? [];
}

export async function getLocations() {
  const json = await request(`/locations`);
  return json.data ?? [];
}

export async function getNearbyLocations(lat, lng, radius = 5) {
  const json = await request(
    `/locations/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(
      lng
    )}&radius=${encodeURIComponent(radius)}`
  );
  return json.data ?? [];
}