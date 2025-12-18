import React, {useState, useEffect} from 'react'
import jobService from '../../services/jobService'

const JobFilters = ({ filters, onFilterChange }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const data = await jobService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const handleChange = (e) => {
        onFilterChange({[e.target.name]: e.target.value });
    }

    const handleReset = () => {
        onFilterChange({
            search:'',
            category:'',
            location:'',
            job_type:'',
        })
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                onClick={handleReset}
                className="text-sm text-primary hover:text-secondary"
                >
                Reset
                </button>
            </div>

            <div className="space-y-4">
                {/* Search */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                </label>
                <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Job title, keywords..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
                </div>

                {/* Category */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                    ))}
                </select>
                </div>

                {/* Job Type */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                </label>
                <select
                    name="job_type"
                    value={filters.job_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                    <option value="">All Types</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                </select>
                </div>

                {/* Location */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                </label>
                <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    placeholder="City, State..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
                </div>
            </div>
        </div>
    );
}

export default JobFilters