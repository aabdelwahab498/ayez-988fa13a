/**
 * Query hooks — the single way features read data.
 *
 * Each hook wraps a repository call in TanStack Query, so caching, retries and
 * loading/error state are already in place before the Django API exists.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminDashboardRepository,
  campaignRepository,
  categoryRepository,
  leadRepository,
  locationRepository,
  notificationRepository,
  providerDashboardRepository,
  providerRepository,
  queryKeys,
  requestRepository,
  reviewRepository,
  subscriptionRepository,
  type ProviderSearchParams,
} from "@/core/repositories";
import type { RequestStatus } from "@/core/types";
import type { CampaignStatus, LeadStatus } from "@/core/types/marketplace";
import type { ServiceRequestCreateDTO } from "@/core/types/dto";

const STATIC = { staleTime: 5 * 60 * 1000 };

/* ---------------------------------- taxonomy --------------------------------- */

export function useSectors() {
  return useQuery({ queryKey: queryKeys.categories.sectors(), queryFn: () => categoryRepository.listSectors(), ...STATIC });
}

export function useCategories(sector?: string) {
  return useQuery({
    queryKey: queryKeys.categories.list(sector),
    queryFn: () => categoryRepository.list(sector),
    ...STATIC,
  });
}

export function useGovernorates() {
  return useQuery({
    queryKey: queryKeys.locations.governorates(),
    queryFn: () => locationRepository.listGovernorates(),
    ...STATIC,
  });
}

export function useCities(governorateSlug?: string) {
  return useQuery({
    queryKey: queryKeys.locations.cities(governorateSlug ?? ""),
    queryFn: () => locationRepository.listCities(governorateSlug!),
    enabled: Boolean(governorateSlug),
    ...STATIC,
  });
}

export function useAreas(governorateSlug?: string, citySlug?: string) {
  return useQuery({
    queryKey: queryKeys.locations.areas(governorateSlug ?? "", citySlug ?? ""),
    queryFn: () => locationRepository.listAreas(governorateSlug!, citySlug!),
    enabled: Boolean(governorateSlug && citySlug),
    ...STATIC,
  });
}

/* --------------------------------- providers --------------------------------- */

export function useProviderSearch(params: ProviderSearchParams) {
  return useQuery({
    queryKey: queryKeys.providers.search(params),
    queryFn: () => providerRepository.search(params),
    placeholderData: (prev) => prev,
  });
}

export function useFeaturedProviders(limit = 6) {
  return useQuery({
    queryKey: queryKeys.providers.featured(limit),
    queryFn: () => providerRepository.featured(limit),
  });
}

export function useProvider(id?: string) {
  return useQuery({
    queryKey: queryKeys.providers.detail(id ?? ""),
    queryFn: () => providerRepository.getById(id!),
    enabled: Boolean(id),
  });
}

export function useRelatedProviders(id?: string) {
  return useQuery({
    queryKey: queryKeys.providers.related(id ?? ""),
    queryFn: () => providerRepository.related(id!),
    enabled: Boolean(id),
  });
}

export function useProviderReviews(providerId?: string, page = 1) {
  return useQuery({
    queryKey: queryKeys.reviews.byProvider(providerId ?? "", page),
    queryFn: () => reviewRepository.listByProvider(providerId!, page),
    enabled: Boolean(providerId),
    placeholderData: (prev) => prev,
  });
}

/* ---------------------------------- requests --------------------------------- */

export function useMyRequests(page = 1, status?: RequestStatus) {
  return useQuery({
    queryKey: queryKeys.requests.mine(page, status),
    queryFn: () => requestRepository.listMine({ page, status }),
    placeholderData: (prev) => prev,
  });
}

export function useProviderLeads(page = 1, status?: RequestStatus) {
  return useQuery({
    queryKey: queryKeys.requests.leads(page, status),
    queryFn: () => requestRepository.listLeads({ page, status }),
    placeholderData: (prev) => prev,
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServiceRequestCreateDTO) => requestRepository.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });
}

/* -------------------------------- marketplace -------------------------------- */

export function useLeads(page = 1, status?: LeadStatus) {
  return useQuery({
    queryKey: queryKeys.leads.list(page, status),
    queryFn: () => leadRepository.list({ page, status }),
    placeholderData: (prev) => prev,
  });
}

export function useCampaigns(page = 1, status?: CampaignStatus) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(page, status),
    queryFn: () => campaignRepository.list({ page, status }),
    placeholderData: (prev) => prev,
  });
}

export function usePlans() {
  return useQuery({ queryKey: queryKeys.subscriptions.plans(), queryFn: () => subscriptionRepository.listPlans(), ...STATIC });
}

export function useMarkets() {
  return useQuery({ queryKey: queryKeys.subscriptions.markets(), queryFn: () => subscriptionRepository.listMarkets(), ...STATIC });
}

export function useSubscriptions(page = 1) {
  return useQuery({
    queryKey: queryKeys.subscriptions.list(page),
    queryFn: () => subscriptionRepository.list(page),
    placeholderData: (prev) => prev,
  });
}

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications.list(), queryFn: () => notificationRepository.list() });
}

/* --------------------------------- dashboards -------------------------------- */

export function useAdminOverview() {
  return useQuery({ queryKey: queryKeys.analytics.admin(), queryFn: () => adminDashboardRepository.overview() });
}

export function useMarketplaceMetrics() {
  return useQuery({
    queryKey: queryKeys.analytics.marketplace(),
    queryFn: () => adminDashboardRepository.marketplaceMetrics(),
  });
}

export function useProviderOverview(providerId: string) {
  return useQuery({
    queryKey: queryKeys.analytics.provider(providerId),
    queryFn: () => providerDashboardRepository.overview(providerId),
  });
}
