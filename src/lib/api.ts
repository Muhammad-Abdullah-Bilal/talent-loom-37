// Mock API functions with React Query integration
import { mockCandidates, mockJobPostings, mockPipelineItems, mockOffers, mockKPIData, mockMatchScores, mockApiDelay } from './mockData';
import { Candidate, JobPosting, PipelineItem, Offer, KPIData, MatchScore, CandidateFilters, PipelineStage } from '@/types';

// Candidates API
export const candidatesApi = {
  getAll: async (filters?: Partial<CandidateFilters>): Promise<Candidate[]> => {
    await mockApiDelay(800);
    let candidates = [...mockCandidates];
    
    if (filters?.skills?.length) {
      candidates = candidates.filter(c => 
        filters.skills!.some(skill => 
          c.skills.some(cSkill => cSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }
    
    if (filters?.availability?.length) {
      candidates = candidates.filter(c => filters.availability!.includes(c.availability));
    }
    
    if (filters?.track) {
      candidates = candidates.filter(c => c.track === filters.track);
    }
    
    return candidates;
  },
  
  getById: async (id: string): Promise<Candidate | null> => {
    await mockApiDelay(500);
    return mockCandidates.find(c => c.id === id) || null;
  },
  
  search: async (query: string): Promise<Candidate[]> => {
    await mockApiDelay(600);
    return mockCandidates.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
  }
};

// Jobs API
export const jobsApi = {
  getAll: async (): Promise<JobPosting[]> => {
    await mockApiDelay(700);
    return [...mockJobPostings];
  },
  
  getById: async (id: string): Promise<JobPosting | null> => {
    await mockApiDelay(500);
    return mockJobPostings.find(j => j.id === id) || null;
  },
  
  create: async (job: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobPosting> => {
    await mockApiDelay(1000);
    const newJob: JobPosting = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newJob;
  },
  
  update: async (id: string, updates: Partial<JobPosting>): Promise<JobPosting> => {
    await mockApiDelay(800);
    const job = mockJobPostings.find(j => j.id === id);
    if (!job) throw new Error('Job not found');
    return { ...job, ...updates, updatedAt: new Date().toISOString() };
  }
};

// Pipeline API
export const pipelineApi = {
  getAll: async (): Promise<PipelineItem[]> => {
    await mockApiDelay(600);
    return [...mockPipelineItems];
  },
  
  moveCandidate: async (itemId: string, newStage: PipelineStage): Promise<PipelineItem> => {
    await mockApiDelay(500);
    const item = mockPipelineItems.find(i => i.id === itemId);
    if (!item) throw new Error('Pipeline item not found');
    return { ...item, stage: newStage, updatedAt: new Date().toISOString() };
  },
  
  addCandidate: async (candidateId: string, jobId: string): Promise<PipelineItem> => {
    await mockApiDelay(800);
    const candidate = mockCandidates.find(c => c.id === candidateId);
    const job = mockJobPostings.find(j => j.id === jobId);
    if (!candidate || !job) throw new Error('Candidate or job not found');
    
    const newItem: PipelineItem = {
      id: Date.now().toString(),
      candidateId,
      candidate,
      jobId,
      jobTitle: job.title,
      stage: 'sourced',
      notes: '',
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      addedBy: 'Current User'
    };
    return newItem;
  }
};

// Offers API
export const offersApi = {
  getAll: async (): Promise<Offer[]> => {
    await mockApiDelay(700);
    return [...mockOffers];
  },
  
  create: async (offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Offer> => {
    await mockApiDelay(1000);
    const newOffer: Offer = {
      ...offer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newOffer;
  },
  
  updateStatus: async (id: string, status: Offer['status']): Promise<Offer> => {
    await mockApiDelay(600);
    const offer = mockOffers.find(o => o.id === id);
    if (!offer) throw new Error('Offer not found');
    return { ...offer, status, updatedAt: new Date().toISOString() };
  }
};

// Matches API
export const matchesApi = {
  getAll: async (): Promise<MatchScore[]> => {
    await mockApiDelay(800);
    return [...mockMatchScores];
  },
  
  getForJob: async (jobId: string): Promise<MatchScore[]> => {
    await mockApiDelay(600);
    return mockMatchScores.filter(m => m.jobId === jobId);
  }
};

// Dashboard API
export const dashboardApi = {
  getKPIs: async (): Promise<KPIData> => {
    await mockApiDelay(500);
    return { ...mockKPIData };
  }
};

// Reports API
export const reportsApi = {
  exportCSV: async (data: any[]): Promise<string> => {
    await mockApiDelay(2000);
    // Mock CSV generation
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return `${headers}\n${rows}`;
  },
  
  exportPDF: async (data: any[]): Promise<Blob> => {
    await mockApiDelay(3000);
    // Mock PDF generation
    return new Blob(['Mock PDF content'], { type: 'application/pdf' });
  }
};