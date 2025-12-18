import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';
import LoadingSpinner from '../common/LoadingSpinner';

const MyJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchJobs();
    },[]);

    const fetchJobs = async () => {
        try {
            const data = await jobService.getEmplyerJobs();
            setJobs(data);
        } catch (error) {
            console.error("Error fetching  jobs:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
            try {
                await jobService.deleteJob(jobId);
                setJobs(jobs.filter(job => job.id !== jobId))
            } catch (error) {
                console.error('Error deleting job:', error);
                alert('Failed to delete job. Please try again.');
            }
        }
    };

    const filteredJobs  = filter == 'all'
        ? jobs
        : jobs.filter(job => filter === 'active' ? job.is_active : !job.is_active)

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <LoadingSpinner size='lg' />
            </div>
        )
    }

    return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">
                My Job Postings
            </h1>
            <p className="mt-2 text-gray-600">
                {jobs.length} total jobs
            </p>
            </div>

            <Link
            to="/employer/jobs/create"
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center"
            >
            <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
                />
            </svg>
            Post New Job
            </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {['all', 'active', 'inactive'].map((status) => (
                <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    filter === status
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {status}
                    {status === 'all' && ` (${jobs.length})`}
                    {status === 'active' && ` (${jobs.filter(j => j.is_active).length})`}
                    {status === 'inactive' && ` (${jobs.filter(j => !j.is_active).length})`}
                </button>
                ))}
            </nav>
            </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No jobs found</p>
            <Link
                to="/employer/jobs/create"
                className="inline-block bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium"
            >
                Post Your First Job
            </Link>
            </div>
        ) : (
            <div className="space-y-4">
            {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">

                    {/* Job Info */}
                    <div className="flex-1">
                    <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                        </h3>
                        <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        >
                        {job.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                        {job.location}
                        </span>

                        <span className="flex items-center">
                        {job.job_type.replace('_', ' ').toUpperCase()}
                        </span>

                        <span className="flex items-center">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="mt-4 flex items-center space-x-6 text-sm">
                        <span className="text-gray-700">
                        <strong>{job.applications_count}</strong> Applications
                        </span>
                        <span className="text-gray-700">
                        <strong>{job.views_count}</strong> Views
                        </span>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-4 flex flex-col space-y-2">
                    <Link
                        to={`/employer/jobs/${job.id}`}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 text-center"
                    >
                        View
                    </Link>

                    <Link
                        to={`/employer/jobs/${job.id}/edit`}
                        className="px-4 py-2 border border-primary rounded-md text-sm font-medium text-primary hover:bg-blue-50 text-center"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={() => handleDelete(job.id)}
                        className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Delete
                    </button>
                    </div>

                </div>
                </div>
            ))}
            </div>
        )}

        </div>
    </div>
);

}

export default MyJobs
