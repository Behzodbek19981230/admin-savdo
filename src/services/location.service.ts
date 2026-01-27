/**
 * Location Service
 * Hududlar (Country, Region, District) bilan ishlash uchun service
 */

import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';

// Types
export interface Country {
  id: string;
  code: string;
  name: string;
  geo_json?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Region {
  id: string;
  code: string;
  name: string;
  geo_json?: string;
  created_at?: string;
  updated_at?: string;
}

export interface District {
  id: string;
  code: string;
  name: string;
  region?: string ;
  region_detail?: Region;
  geo_json?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LocationListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LocationQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

// Country Service
export const locationService = {
  // Countries
  getCountries: async (params?: LocationQueryParams) => {
    return api.get<LocationListResponse<Country>>(API_ENDPOINTS.locations.countries, {
      params,
    });
  },

  getCountryById: async (id: string) => {
    return api.get<Country>(API_ENDPOINTS.locations.countryById(id));
  },

  createCountry: async (data: Partial<Country>) => {
    return api.post<Country>(API_ENDPOINTS.locations.countries, data);
  },

  updateCountry: async (id: string, data: Partial<Country>) => {
    return api.patch<Country>(API_ENDPOINTS.locations.countryById(id), data);
  },

  deleteCountry: async (id: string) => {
    return api.delete(API_ENDPOINTS.locations.countryById(id));
  },

  // Regions
  getRegions: async (params?: LocationQueryParams) => {
    return api.get<LocationListResponse<Region>>(API_ENDPOINTS.locations.regions, {
      params,
    });
  },

  getRegionById: async (id: string) => {
    return api.get<Region>(API_ENDPOINTS.locations.regionById(id));
  },

  createRegion: async (data: Partial<Region>) => {
    return api.post<Region>(API_ENDPOINTS.locations.regions, data);
  },

  updateRegion: async (id: string, data: Partial<Region>) => {
    return api.patch<Region>(API_ENDPOINTS.locations.regionById(id), data);
  },

  deleteRegion: async (id: string) => {
    return api.delete(API_ENDPOINTS.locations.regionById(id));
  },

  // Districts
  getDistricts: async (params?: LocationQueryParams) => {
    return api.get<LocationListResponse<District>>(API_ENDPOINTS.locations.districts, {
      params,
    });
  },

  getDistrictById: async (id: string) => {
    return api.get<District>(API_ENDPOINTS.locations.districtById(id));
  },

  createDistrict: async (data: Partial<District>) => {
    return api.post<District>(API_ENDPOINTS.locations.districts, data);
  },

  updateDistrict: async (id: string, data: Partial<District>) => {
    return api.patch<District>(API_ENDPOINTS.locations.districtById(id), data);
  },

  deleteDistrict: async (id: string) => {
    return api.delete(API_ENDPOINTS.locations.districtById(id));
  },
};
