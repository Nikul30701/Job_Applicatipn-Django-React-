import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jobService from '../../services/jobService';
import LoadingSpinner from '../common/LoadingSpinner';

const EditJob = () => {
  const { id } = useParams(); // Get job ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(true);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    job_type: 'full_time',
    experience_level: 'entry',
    salary_min: '',
    salary_max: '',
    category: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    application_deadline: '',
    is_active: true,
  });

  // Fetch existing job data when component mounts
  useEffect(() => {
    fetchJobData();
  }, [id]);

  const fetchJobData = async () => {
    try {
      setFetchingJob(true);
      const jobData = await jobService.getJob(id);
      
      // Pre-populate form with existing job data
      setFormData({
        title: jobData.title || '',
        company_name: jobData.company_name || '',
        location: jobData.location || '',
        job_type: jobData.job_type || 'full_time',
        experience_level: jobData.experience_level || 'entry',
        salary_min: jobData.salary_min || '',
        salary_max: jobData.salary_max || '',
        category: jobData.category || '',
        description: jobData.description || '',
        requirements: jobData.requirements || '',
        responsibilities: jobData.responsibilities || '',
        benefits: jobData.benefits || '',
        application_deadline: jobData.application_deadline || '',
        is_active: jobData.is_active !== undefined ? jobData.is_active : true,
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Failed to load job data. Please try again.');
      navigate('/employer/jobs');
    } finally {
      setFetchingJob(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    if (formData.salary_min && formData.salary_max) {
      if (parseFloat(formData.salary_min) > parseFloat(formData.salary_max)) {
        newErrors.salary_max = 'Maximum salary must be greater than minimum salary';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
      };

      await jobService.updateJob(id, jobData);
      
      // Show success message
      alert('Job updated successfully!');
      
      // Navigate to employer jobs page
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        alert('Failed to update job. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete job
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await jobService.deleteJob(id);
      alert('Job deleted successfully!');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
      setLoading(false);
    }
  };

  // Show loading spinner while fetching job data
  if (fetchingJob) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Edit Job Posting
          </h1>
          <p className="text-lg text-gray-600">
            Update your job details to attract the right candidates
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white">Job Details</h2>
            <p className="text-purple-100 mt-1">Modify the information below to update your job posting</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-purple-100 pb-2">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    placeholder="e.g., Senior React Developer"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.company_name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    placeholder="e.g., Tech Solutions Inc."
                  />
                  {errors.company_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    placeholder="e.g., New York, NY or Remote"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                {/* Job Type */}
                <div>
                  <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    id="job_type"
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    id="experience_level"
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Software Development, Marketing, Design"
                  />
                </div>
              </div>
            </div>

            {/* Salary Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-purple-100 pb-2">
                Salary Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Minimum Salary */}
                <div>
                  <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary (Annual)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                    <input
                      type="number"
                      id="salary_min"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="50000"
                      min="0"
                    />
                  </div>
                </div>

                {/* Maximum Salary */}
                <div>
                  <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary (Annual)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-500">$</span>
                    <input
                      type="number"
                      id="salary_max"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-3 border ${
                        errors.salary_max ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                      placeholder="80000"
                      min="0"
                    />
                  </div>
                  {errors.salary_max && (
                    <p className="mt-1 text-sm text-red-600">{errors.salary_max}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-purple-100 pb-2">
                Job Details
              </h3>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-3 border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none`}
                  placeholder="Provide a detailed description of the role, team, and company culture..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-3 border ${
                    errors.requirements ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none`}
                  placeholder="List the required skills, qualifications, and experience (one per line)..."
                />
                {errors.requirements && (
                  <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
                )}
              </div>

              {/* Responsibilities */}
              <div>
                <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
                  Responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Describe the key responsibilities and day-to-day tasks..."
                />
              </div>

              {/* Benefits */}
              <div>
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits & Perks
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="List the benefits, perks, and what makes your company great..."
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-purple-100 pb-2">
                Additional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Deadline */}
                <div>
                  <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    id="application_deadline"
                    name="application_deadline"
                    value={formData.application_deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <label htmlFor="is_active" className="ml-3 text-sm font-medium text-gray-700">
                    Job is active and accepting applications
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              {/* Delete Button */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Job
              </button>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/employer/jobs')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Job'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Warning Notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-semibold text-amber-900 mb-1">Important Notice</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Changes will be immediately visible to job seekers</li>
                <li>• Deactivating the job will hide it from search results</li>
                <li>• Deleting this job will permanently remove all associated applications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
