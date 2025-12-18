import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import jobService from '../../services/jobService';
import LoadingSpinner from '../common/LoadingSpinner';
import ApplyJobModal from './ApplyJobModal';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, isJobSeeker } = useAuth();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplyModal, setShowApplyModal] = useState(false);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
        const data = await jobService.getJob(id);
        setJob(data);
        } catch (error) {
        console.error('Error fetching job:', error);
        }
        setLoading(false);
    };

    const handleSaveToggle = async () => {
        if (!isAuthenticated) {
        navigate('/login');
        return;
        }

        try {
        if (job.is_saved) {
            await jobService.unsaveJob(job.id);
            setJob({ ...job, is_saved: false });
        } else {
            await jobService.saveJob(job.id);
            setJob({ ...job, is_saved: true });
        }
        } catch (error) {
        console.error('Error toggling save:', error);
        }
    };

    const handleApplySuccess = () => {
        setShowApplyModal(false);
        setJob({ ...job, has_applied: true });
    };

    if (loading) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner size="lg" />
        </div>
        );
    }

    if (!job) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
            <button
                onClick={() => navigate('/jobs')}
                className="mt-4 text-primary hover:text-secondary"
            >
                Back to Jobs
            </button>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
            onClick={() => navigate('/jobs')}
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center"
            >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
            </button>

            <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Job Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                {job.employer.logo && (
                    <img
                    src={job.employer.logo}
                    alt={job.employer.company_name}
                    className="w-20 h-20 rounded-lg object-cover"
                    />
                )}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-xl text-gray-600 mt-1">{job.employer.company_name}</p>
                </div>
                </div>
                {isAuthenticated && isJobSeeker && (
                <button
                    onClick={handleSaveToggle}
                    className="text-gray-400 hover:text-primary transition-colors"
                >
                    <svg
                    className="w-8 h-8"
                    fill={job.is_saved ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
                )}
            </div>

            {/* Job Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{job.location}</p>
                </div>
                <div>
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-medium text-gray-900">
                    {job.job_type.replace('_', ' ').toUpperCase()}
                </p>
                </div>
                <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium text-gray-900">{job.experience_required} years</p>
                </div>
                <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium text-gray-900">
                    {job.salary_min && job.salary_max
                    ? `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`
                    : 'Not specified'}
                </p>
                </div>
            </div>

            {/* Action Buttons */}
            {isAuthenticated && isJobSeeker && (
                <div className="mb-6">
                {job.has_applied ? (
                    <button
                    disabled
                    className="w-full md:w-auto px-8 py-3 bg-green-500 text-white rounded-md font-medium cursor-not-allowed"
                    >
                    Already Applied
                    </button>
                ) : (
                    <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-secondary text-white rounded-md font-medium transition-colors"
                    >
                    Apply for this Job
                    </button>
                )}
                </div>
            )}

            {!isAuthenticated && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                    Please{' '}
                    <button
                    onClick={() => navigate('/login')}
                    className="font-medium underline"
                    >
                    sign in
                    </button>{' '}
                    to apply for this job.
                </p>
                </div>
            )}

            {/* Job Description */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.description}
                </div>
            </div>

            {/* Requirements */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.requirements}
                </div>
            </div>

            {/* Skills */}
            {job.skills_required && (
                <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {job.skills_required.split(',').map((skill, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                        {skill.trim()}
                    </span>
                    ))}
                </div>
                </div>
            )}

            {/* Company Info */}
            <div className="border-t pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About {job.employer.company_name}
                </h2>

                <p className="text-gray-700">
                    {job.employer.description || 'No description available'}
                </p>

                {job.employer.company_website && (
                    <a
                    href={job.employer.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-primary hover:text-secondary"
                    >
                    Visit Company Website →
                    </a>
                )}
                </div>

            </div>
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
            <ApplyJobModal
            job={job}
            onClose={() => setShowApplyModal(false)}
            onSuccess={handleApplySuccess}
            />
        )}
        </div>
    );
};

export default JobDetail;