import axios from "axios";
import type { PhotonFeature, PhotonResponse } from "../types/location";

export interface AddressSuggestion {
  id: string;
  label: string;
  fullAddress: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  lat: number;
  lon: number;
}

function toAddressSuggestion(feature: PhotonFeature, index: number, query: string): AddressSuggestion {
  const props = feature.properties;

  const streetLine = props.housenumber && props.street
    ? `${props.housenumber} ${props.street}`
    : props.street;

  const parts = [
    props.name,
    streetLine,
    props.locality,
    props.suburb,
    props.district,
    props.city,
    props.state,
    props.postcode,
    props.country,
  ].filter((part): part is string => Boolean(part));

  const area = props.locality || props.suburb || props.district || props.city || undefined;

  return {
    id: `${props.osm_type ?? "osm"}-${props.osm_id ?? index}-${index}`,
    label: parts.slice(0, 2).join(", ") || props.name || query,
    fullAddress: parts.join(", "),
    area,
    city: props.city,
    state: props.state,
    country: props.country,
    postcode: props.postcode,
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
  };
}

export async function fetchAddressSuggestions(
  query: string,
  limit = 5,
  countryCodes?: string
): Promise<AddressSuggestion[]> {
  // Photon does not support the Nominatim `countrycodes` parameter.
  // We request a larger batch and filter client-side by `countrycode`.
  const searchLimit = countryCodes ? Math.max(limit * 3, 10) : limit;

  const { data } = await axios.get<PhotonResponse>("https://photon.komoot.io/api", {
    params: {
      q: query,
      limit: searchLimit,
      lang: "en",
    },
    timeout: 10000,
    headers: {
      Accept: "application/json",
    },
  });

  let features = data.features;

  if (countryCodes) {
    const allowedCodes = countryCodes.split(",").map((code) => code.trim().toLowerCase());
    features = features.filter((feature) => {
      const code = feature.properties.countrycode?.toLowerCase();
      return code ? allowedCodes.includes(code) : false;
    });
  }

  return features.slice(0, limit).map((feature, index) => toAddressSuggestion(feature, index, query));
}
