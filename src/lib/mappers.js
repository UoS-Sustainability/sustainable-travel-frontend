export function mapOperator(apiOperator) {
  return {
    id: String(apiOperator.id),
    name: apiOperator.name,
    type: apiOperator.type,
    color: apiOperator.color,
    description: apiOperator.description ?? "",
    website: apiOperator.website ?? "",
    sustainabilityNote: apiOperator.sustainability_note ?? "",
    tickets: (apiOperator.tickets ?? []).map(mapTicket),
  };
}

export function mapTicket(apiTicket) {
  return {
    id: apiTicket.id,
    operatorId: apiTicket.operator_id,
    name: apiTicket.ticket_type,
    price: `£${Number(apiTicket.price).toFixed(2)}`,
    duration: apiTicket.duration,
    note: apiTicket.notes ?? "",
  };
}

export function mapZone(apiZone) {
  return {
    id: String(apiZone.id),
    name: apiZone.name,
    color: apiZone.color,
    description: apiZone.description ?? "",
    areas: apiZone.areas ?? [],
    metroStations: apiZone.metro_stations ?? [],
  };
}

export function mapLocation(apiLocation) {
  return {
    id: String(apiLocation.id),
    name: apiLocation.name,
    type: apiLocation.type,
    lat: apiLocation.lat,
    lng: apiLocation.lng,
    description: apiLocation.description ?? "",
    nearbyTransport: apiLocation.nearby_transport ?? [],
    zoneId: apiLocation.zone_id ?? null,
  };
}