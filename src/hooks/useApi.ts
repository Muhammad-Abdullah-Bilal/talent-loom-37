// Custom hooks for API calls with React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidatesApi, jobsApi, pipelineApi, offersApi, matchesApi, dashboardApi } from '@/lib/api';
import { CandidateFilters, PipelineStage } from '@/types';
import { toast } from 'sonner';

// Query Keys
export const queryKeys = {
  candidates: ['candidates'] as const,
  candidateSearch: (query: string) => ['candidates', 'search', query] as const,
  candidateById: (id: string) => ['candidates', id] as const,
  jobs: ['jobs'] as const,
  jobById: (id: string) => ['jobs', id] as const,
  pipeline: ['pipeline'] as const,
  offers: ['offers'] as const,
  matches: ['matches'] as const,
  matchesForJob: (jobId: string) => ['matches', 'job', jobId] as const,
  dashboard: ['dashboard'] as const,
};

// Candidates Hooks
export const useCandidates = (filters?: Partial<CandidateFilters>) => {
  return useQuery({
    queryKey: [...queryKeys.candidates, filters],
    queryFn: () => candidatesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: queryKeys.candidateById(id),
    queryFn: () => candidatesApi.getById(id),
    enabled: !!id,
  });
};

export const useCandidateSearch = (query: string) => {
  return useQuery({
    queryKey: queryKeys.candidateSearch(query),
    queryFn: () => candidatesApi.search(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Jobs Hooks
export const useJobs = () => {
  return useQuery({
    queryKey: queryKeys.jobs,
    queryFn: jobsApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: queryKeys.jobById(id),
    queryFn: () => jobsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: jobsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      toast.success('Job posting created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create job posting');
      console.error('Create job error:', error);
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => 
      jobsApi.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
      queryClient.setQueryData(queryKeys.jobById(data.id), data);
      toast.success('Job posting updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update job posting');
      console.error('Update job error:', error);
    },
  });
};

// Pipeline Hooks
export const usePipeline = () => {
  return useQuery({
    queryKey: queryKeys.pipeline,
    queryFn: pipelineApi.getAll,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMovePipelineCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, newStage }: { itemId: string; newStage: PipelineStage }) =>
      pipelineApi.moveCandidate(itemId, newStage),
    onMutate: async ({ itemId, newStage }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.pipeline });
      const previousPipeline = queryClient.getQueryData(queryKeys.pipeline);
      
      queryClient.setQueryData(queryKeys.pipeline, (old: any) => 
        old?.map((item: any) => 
          item.id === itemId 
            ? { ...item, stage: newStage, updatedAt: new Date().toISOString() }
            : item
        )
      );
      
      return { previousPipeline };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(queryKeys.pipeline, context?.previousPipeline);
      toast.error('Failed to move candidate');
    },
    onSuccess: () => {
      toast.success('Candidate moved successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pipeline });
    },
  });
};

export const useAddToPipeline = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ candidateId, jobId }: { candidateId: string; jobId: string }) =>
      pipelineApi.addCandidate(candidateId, jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pipeline });
      toast.success('Candidate added to pipeline!');
    },
    onError: (error) => {
      toast.error('Failed to add candidate to pipeline');
      console.error('Add to pipeline error:', error);
    },
  });
};

// Offers Hooks
export const useOffers = () => {
  return useQuery({
    queryKey: queryKeys.offers,
    queryFn: offersApi.getAll,
    staleTime: 3 * 60 * 1000,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: offersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers });
      toast.success('Offer created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create offer');
      console.error('Create offer error:', error);
    },
  });
};

export const useUpdateOfferStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      offersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers });
      toast.success('Offer status updated!');
    },
    onError: (error) => {
      toast.error('Failed to update offer status');
      console.error('Update offer status error:', error);
    },
  });
};

// Matches Hooks
export const useMatches = () => {
  return useQuery({
    queryKey: queryKeys.matches,
    queryFn: matchesApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMatchesForJob = (jobId: string) => {
  return useQuery({
    queryKey: queryKeys.matchesForJob(jobId),
    queryFn: () => matchesApi.getForJob(jobId),
    enabled: !!jobId,
    staleTime: 10 * 60 * 1000,
  });
};

// Dashboard Hooks
export const useDashboard = () => {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardApi.getKPIs,
    staleTime: 5 * 60 * 1000,
  });
};