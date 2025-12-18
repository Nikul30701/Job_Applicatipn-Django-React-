import api from './api';

const jobService = {
    // Get all jobs with filters
    getJobs: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/jobs/?${params}`);
        return response.data;
    },

    // Get single job detail
    getJob: async (id) => {
        const response = await api.get(`/jobs/${id}/`);
        return response.data;
    },

    // Get job categories
    getCategories: async () => {
        const response = await api.get('/jobs/categories/');
        return response.data;
    },

  // Employer: Create job
    createJob: async (jobData) => {
        const response = await api.post('/jobs/employer/jobs/create/', jobData);
        return response.data;
    },

  // Employer: Get own jobs
    getEmployerJobs: async () => {
        const response = await api.get('/jobs/employer/jobs/');
        return response.data;
    },

  // Employer: Update job
    updateJob: async (id, jobData) => {
        const response = await api.patch(`/jobs/employer/jobs/${id}/update/`, jobData);
        return response.data;
    },

  // Employer: Delete job
    deleteJob: async (id) => {
        const response = await api.delete(`/jobs/employer/jobs/${id}/delete/`);
        return response.data;
    },

  // Job Seeker: Apply for job
    applyForJob: async (applicationData) => {
        const response = await api.post('/jobs/applications/apply/', applicationData);
        return response.data;
    },

  // Job Seeker: Get own applications
    getMyApplications: async () => {
        const response = await api.get('/jobs/applications/my-applications/');
        return response.data;
    },

  // Employer: Get applications for jobs
    getEmployerApplications: async (jobId = null) => {
    const url = jobId 
        ? `/jobs/employer/applications/?job_id=${jobId}`
        : '/jobs/employer/applications/';
    const response = await api.get(url);
    return response.data;
    },

  // Employer: Update application status
    updateApplicationStatus: async (applicationId, status) => {
    const response = await api.patch(
        `/jobs/employer/applications/${applicationId}/status/`,
        { status }
    );
    return response.data;
    },

  // Job Seeker: Save job
    saveJob: async (jobId) => {
        const response = await api.post(`/jobs/saved/${jobId}/`);
        return response.data;
    },

  // Job Seeker: Unsave job
    unsaveJob: async (jobId) => {
        const response = await api.delete(`/jobs/saved/${jobId}/`);
        return response.data;
    },

  // Job Seeker: Get saved jobs
    getSavedJobs: async () => {
        const response = await api.get('/jobs/saved/');
        return response.data;
    },

}

export default jobService;
