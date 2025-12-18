import React, {useState, useEffect} from 'react'
import JobCard from './JobCard'
import JobFilters from './JobFilters'
import LoadingSpinner from '../common/LoadingSpinner'
import jobService from '../../services/jobService'

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        search:'',
        category:'',
        job_type:'',
        location:'',
        page:1,
    });
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null
    });

    useEffect(() => {
        fetchJobs
    }, [filters])

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await jobService.getJobs(filters);
            setJobs(data.results)
            setPagination({
                count: data.count,
                next: data.next,
                previous: data.previous,
            })
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
        setLoading(false);
    }

    const handleFilterChange = (newFilters) => {
        setFilters({...filters, ...newFilters, page:1});
    }


    const handlePageChange = (newPage) => {
        setFilters({...filters, page:newPage});
        window.scrollTo({top:0, behavior: 'smooth'})
    }

    const handleSaveToggle = (jobId) => {
        setJobs(jobs.map(job => 
            job.id === jobId ? {...job, is_saved: !job.is_saved} : job
        ))
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
          <p className="mt-2 text-gray-600">
            {pagination.count} jobs available
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No jobs found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.count > 10 && (
                  <div className="mt-8 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={!pagination.previous}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {filters.page}
                    </span>
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={!pagination.next}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobList