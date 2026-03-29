import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Deity, Mantra, Stotra } from "../backend";
import { useActor } from "./useActor";

export function useDeities() {
  const { actor, isFetching } = useActor();
  return useQuery<Deity[]>({
    queryKey: ["deities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDeities();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMantras() {
  const { actor, isFetching } = useActor();
  return useQuery<Mantra[]>({
    queryKey: ["mantras"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMantras();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMantrasForDeity(deityId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Mantra[]>({
    queryKey: ["mantras", "deity", deityId?.toString()],
    queryFn: async () => {
      if (!actor || deityId === null) return [];
      return actor.getMantrasByDeity(deityId);
    },
    enabled: !!actor && !isFetching && deityId !== null,
  });
}

export function useMantraById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Mantra | null>({
    queryKey: ["mantra", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getMantraById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useStotras() {
  const { actor, isFetching } = useActor();
  return useQuery<Stotra[]>({
    queryKey: ["stotras"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStotras();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStotraById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Stotra | null>({
    queryKey: ["stotra", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getStotraById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useDailySuggestion() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint | null>({
    queryKey: ["dailySuggestion"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailySuggestion();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchMantras(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Mantra[]>({
    queryKey: ["search", keyword],
    queryFn: async () => {
      if (!actor || !keyword.trim()) return [];
      return actor.searchMantras(keyword);
    },
    enabled: !!actor && !isFetching && keyword.trim().length > 0,
  });
}

export function useFavoritesMutation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) return;
      await actor.addFavorite(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userFavorites"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) return;
      await actor.removeFavorite(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userFavorites"] }),
  });

  return { add, remove };
}
