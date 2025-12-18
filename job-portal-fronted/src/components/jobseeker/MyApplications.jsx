import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../../services/jobService';
import LoadingSpinner from '../common/LoadingSpinner';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await jobService.getMyApplications();
            setApplications('Error fetching applications:',data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            reviewed: 'bg-blue-100 text-blue-800',
            shortlisted: 'bg-purple-100 text-purple-800',
            accepted: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filterApplications = filter === 'all'
        ? applications
        : applications.filter(application => application.status === filter);
    
    if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner size="lg" />
        </div>
    );
  }

    return (
        <div>MyApplications</div>
    )
}

export default MyApplications