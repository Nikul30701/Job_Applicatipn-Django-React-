import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import jobService from '../../services/jobService'

const JobCard = ({job, onSaveToggle}) => {
    const {isAuthenticated, isJobSeeker} = useAuth();

    const handleSaveToggle = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !isJobSeeker) return;

        try {
            if (job.is_saved) {
                await jobService.unsaveJob(job.id);
            } else {
                await jobService.saveJob(job.id)
            }
            onSaveToggle && onSaveToggle();
        } catch (error) {
            console.error('Error toggling save:', error);
            
        }
    }

    return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
        <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
            {job.employer_logo && (
                <img
                src={job.employer_logo}
                alt={job.employer_name}
                className="w-16 h-16 rounded-lg object-cover"
                />
            )}
            <div className="flex-1">
                <Link to={`/jobs/${job.id}`}>
                <h3 className="text-xl font-semibold text-gray-900 hover:text-primary">
                    {job.title}
                </h3>
                </Link>
                <p className="text-gray-600 mt-1">{job.employer_name}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                </span>
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {job.job_type.replace('_', ' ').toUpperCase()}
                </span>
                {job.experience_required > 0 && (
                    <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    {job.experience_required} years
                    </span>
                )}
                </div>
            </div>
            </div>
            
            {isAuthenticated && isJobSeeker && (
            <button
                onClick={handleSaveToggle}
                className="ml-4 text-gray-400 hover:text-primary transition-colors"
            >
                <svg
                className="w-6 h-6"
                fill={job.is_saved ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </button>
            )}
        </div>

        <div className="mt-4 flex items-center justify-between">
            <div>
            {job.salary_min && job.salary_max && (
                <p className="text-lg font-semibold text-green-600">
                ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}
                </p>
            )}
            {job.category_name && (
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {job.category_name}
                </span>
            )}
            </div>
            <div className="text-right">
            <p className="text-sm text-gray-500">
                {new Date(job.created_at).toLocaleDateString()}
            </p>
            {job.has_applied && (
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                Applied
                </span>
            )}
            </div>
        </div>
    </div>
    );
}

export default JobCard