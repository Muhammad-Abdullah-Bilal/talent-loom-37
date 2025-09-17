// Mock realtime functionality using intervals
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './useApi';
import { toast } from 'sonner';

interface RealtimeEvent {
  type: 'pipeline.moved' | 'pipeline.created' | 'offers.created' | 'offers.updated' | 'jobs.created';
  payload: any;
  timestamp: string;
}

// Mock realtime events
const mockEvents: RealtimeEvent[] = [
  {
    type: 'pipeline.moved',
    payload: { candidateId: '1', newStage: 'interview', candidateName: 'Sarah Chen' },
    timestamp: new Date().toISOString(),
  },
  {
    type: 'offers.created',
    payload: { candidateId: '2', jobTitle: 'Backend Engineer', candidateName: 'Marcus Johnson' },
    timestamp: new Date().toISOString(),
  },
];

export const useRealtime = () => {
  const queryClient = useQueryClient();
  const eventIndexRef = useRef(0);

  useEffect(() => {
    // Simulate realtime events every 30 seconds
    const interval = setInterval(() => {
      if (eventIndexRef.current < mockEvents.length) {
        const event = mockEvents[eventIndexRef.current];
        handleRealtimeEvent(event);
        eventIndexRef.current++;
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [queryClient]);

  const handleRealtimeEvent = (event: RealtimeEvent) => {
    switch (event.type) {
      case 'pipeline.moved':
        // Invalidate pipeline queries to refetch data
        queryClient.invalidateQueries({ queryKey: queryKeys.pipeline });
        toast.info(`${event.payload.candidateName} moved to ${event.payload.newStage} stage`);
        break;
        
      case 'pipeline.created':
        queryClient.invalidateQueries({ queryKey: queryKeys.pipeline });
        toast.info(`New candidate added to pipeline`);
        break;
        
      case 'offers.created':
        queryClient.invalidateQueries({ queryKey: queryKeys.offers });
        toast.info(`New offer created for ${event.payload.candidateName}`);
        break;
        
      case 'offers.updated':
        queryClient.invalidateQueries({ queryKey: queryKeys.offers });
        toast.info(`Offer status updated`);
        break;
        
      case 'jobs.created':
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
        toast.info(`New job posting created`);
        break;
        
      default:
        console.log('Unknown realtime event:', event);
    }
  };

  return {
    // In a real implementation, you would return methods to subscribe/unsubscribe
    // and manage WebSocket connections
    isConnected: true,
    lastEvent: mockEvents[Math.min(eventIndexRef.current - 1, mockEvents.length - 1)],
  };
};

// Hook for specific realtime subscriptions
export const useRealtimeSubscription = (channels: string[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Mock subscription logic
    console.log('Subscribing to channels:', channels);
    
    // In a real implementation, you would:
    // 1. Establish WebSocket connection
    // 2. Subscribe to specific channels
    // 3. Handle incoming messages
    // 4. Update React Query cache accordingly
    
    return () => {
      console.log('Unsubscribing from channels:', channels);
    };
  }, [channels, queryClient]);

  return {
    isSubscribed: true,
    channels,
  };
};