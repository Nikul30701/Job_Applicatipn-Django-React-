import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import jobService from '../../services/jobService'
import LoadingSpinner from '../common/LoadingSpinner'

const EmployerDashboard = () => {
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboard();
    }, [])

    const fetchDashboard = async () => {
        try {
            const [jobsData, applicationsData] = await Promise.all([
                jobService.getJobs(),
                jobService.getMyApplications(),
            ]);

            setRecentJobs(jobsData.slice(0,5));
            setRecentApplications(applicationsData.slice(0,5));

            setStats({
                totalJobs: jobsData.length,
                activeJobs: jobsData.filter(job => job.is_active).length,
                totalApplication: applicationsData.length,
                pendingApplication: applicationsData.filter(app => app.status === 'pending').length,
            })
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size='lg' />
            </div>
        )
    }


    return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage your job postings and applications</p>
            </div>

        {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Jobs Card */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Total Jobs</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJobs}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                    <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                    </svg>
                </div>
                </div>
            </div>

            {/* Active Jobs Card */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Active Jobs</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeJobs}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                    <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    </svg>
                </div>
                </div>
            </div>

            {/* Total Applications Card */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Total Applications</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                    <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                    </svg>
                </div>
                </div>
            </div>

            {/* Pending Applications Card */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingApplications}</p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                    <svg
                    className="w-8 h-8 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    </svg>
                </div>
                </div>
            </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
                <Link
                    to="/employer/jobs"
                    className="text-primary hover:text-secondary text-sm font-medium"
                >
                    View All
                </Link>
                </div>
                <div className="p-6">
                {recentJobs.length === 0 ? (
                    <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No jobs posted yet</p>
                    <Link
                        to="/employer/jobs/create"
                        className="inline-block bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Post Your First Job
                    </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                    {recentJobs.map((job) => (
                        <Link
                        key={job.id}
                        to={`/employer/jobs/${job.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                        >
                        <div className="flex items-center justify-between">
                            <div>
                            <h3 className="font-medium text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                            </div>
                            <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}
                            >
                            {job.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {job.applications_count} application{job.applications_count !== 1 ? 's' : ''}
                        </p>
                        </Link>
                    ))}
                    </div>
                )}
                </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <Link
                    to="/employer/applications"
                    className="text-primary hover:text-secondary text-sm font-medium"
                >
                    View All
                </Link>
                </div>
                <div className="p-6">
                {recentApplications.length === 0 ? (
                    <div className="text-center py-8">
                    <p className="text-gray-500">No applications yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                    {recentApplications.map((application) => (
                        <div
                        key={application.id}
                        className="p-4 border border-gray-200 rounded-lg"
                        >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">
                            {application.applicant.full_name}
                            </h3>
                            <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                                application.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : application.status === 'reviewed'
                                ? 'bg-blue-100 text-blue-800'
                                : application.status === 'shortlisted'
                                ? 'bg-purple-100 text-purple-800'
                                : application.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                            >
                            {application.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">{application.job.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Applied {new Date(application.applied_at).toLocaleDateString()}
                        </p>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
            </div>
        </div>
    </div>
  );


}

export default EmployerDashboard;