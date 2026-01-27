/**
 * Location Hooks
 * Hududlar uchun React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService, type LocationQueryParams, type Country, type Region, type District } from '@/services/location.service';
import { toast } from '@/hooks/use-toast';

// Query Keys
export const LOCATION_KEYS = {
  countries: ['countries'] as const,
  countriesList: (params?: LocationQueryParams) => [...LOCATION_KEYS.countries, 'list', params] as const,
  countryDetail: (id: string) => [...LOCATION_KEYS.countries, 'detail', id] as const,
  
  regions: ['regions'] as const,
  regionsList: (params?: LocationQueryParams) => [...LOCATION_KEYS.regions, 'list', params] as const,
  regionDetail: (id: string) => [...LOCATION_KEYS.regions, 'detail', id] as const,
  
  districts: ['districts'] as const,
  districtsList: (params?: LocationQueryParams) => [...LOCATION_KEYS.districts, 'list', params] as const,
  districtDetail: (id: string) => [...LOCATION_KEYS.districts, 'detail', id] as const,
};

// ==================== COUNTRIES ====================

/**
 * Mamlakatlar ro'yxatini olish
 */
export function useCountries(params?: LocationQueryParams) {
  return useQuery({
    queryKey: LOCATION_KEYS.countriesList(params),
    queryFn: () => locationService.getCountries(params),
  });
}

/**
 * Bitta mamlakatni olish
 */
export function useCountry(id: string) {
  return useQuery({
    queryKey: LOCATION_KEYS.countryDetail(id),
    queryFn: () => locationService.getCountryById(id),
    enabled: !!id,
  });
}

/**
 * Mamlakat yaratish
 */
export function useCreateCountry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Country>) => locationService.createCountry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.countries });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Mamlakat qo\'shildi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Mamlakat qo\'shishda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Mamlakatni yangilash
 */
export function useUpdateCountry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Country> }) => 
      locationService.updateCountry(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.countries });
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.countryDetail(variables.id) });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Mamlakat yangilandi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Mamlakatni yangilashda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Mamlakatni o'chirish
 */
export function useDeleteCountry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => locationService.deleteCountry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.countries });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Mamlakat o\'chirildi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Mamlakatni o\'chirishda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });
}

// ==================== REGIONS ====================

/**
 * Viloyatlar ro'yxatini olish
 */
export function useRegions(params?: LocationQueryParams) {
  return useQuery({
    queryKey: LOCATION_KEYS.regionsList(params),
    queryFn: () => locationService.getRegions(params),
  });
}

/**
 * Bitta viloyatni olish
 */
export function useRegion(id: string) {
  return useQuery({
    queryKey: LOCATION_KEYS.regionDetail(id),
    queryFn: () => locationService.getRegionById(id),
    enabled: !!id,
  });
}

/**
 * Viloyat yaratish
 */
export function useCreateRegion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Region>) => locationService.createRegion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.regions });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Viloyat qo\'shildi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Viloyat qo\'shishda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Viloyatni yangilash
 */
export function useUpdateRegion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Region> }) => 
      locationService.updateRegion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.regions });
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.regionDetail(variables.id) });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Viloyat yangilandi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Viloyatni yangilashda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Viloyatni o'chirish
 */
export function useDeleteRegion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => locationService.deleteRegion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.regions });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Viloyat o\'chirildi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Viloyatni o\'chirishda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });
}

// ==================== DISTRICTS ====================

/**
 * Tumanlar ro'yxatini olish
 */
export function useDistricts(params?: LocationQueryParams) {
  return useQuery({
    queryKey: LOCATION_KEYS.districtsList(params),
    queryFn: () => locationService.getDistricts(params),
  });
}

/**
 * Bitta tumanni olish
 */
export function useDistrict(id: string) {
  return useQuery({
    queryKey: LOCATION_KEYS.districtDetail(id),
    queryFn: () => locationService.getDistrictById(id),
    enabled: !!id,
  });
}

/**
 * Tuman yaratish
 */
export function useCreateDistrict() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<District>) => locationService.createDistrict(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.districts });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Tuman qo\'shildi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Tuman qo\'shishda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Tumanni yangilash
 */
export function useUpdateDistrict() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<District> }) => 
      locationService.updateDistrict(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.districts });
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.districtDetail(variables.id) });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Tuman yangilandi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Tumanni yangilashda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Tumanni o'chirish
 */
export function useDeleteDistrict() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => locationService.deleteDistrict(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOCATION_KEYS.districts });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Tuman o\'chirildi',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Tumanni o\'chirishda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });
}
