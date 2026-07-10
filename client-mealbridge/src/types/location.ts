export interface PhotonFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    name?: string;
    osm_id?: number;
    osm_type?: string;
    extent?: number[];
    country?: string;
    osm_key?: string;
    city?: string;
    countrycode?: string;
    osm_value?: string;
    postcode?: string;
    state?: string;
    district?: string;
    suburb?: string;
    locality?: string;
    street?: string;
    housenumber?: string;
    type?: string;
  };
}

export interface PhotonResponse {
  features: PhotonFeature[];
}
