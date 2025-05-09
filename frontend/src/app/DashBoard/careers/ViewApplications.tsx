'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { JobApplication } from '@/types/Career';
import { baseAPI } from '@/utils/variables';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';
import dayjs from 'dayjs';

export default function ViewApplications() {
  const [applications, setApplications] = useState<JobApplication[] | null>(null);
  const [careers, setCareers] = useState<string[]>([]);
  const [selectedCareer, setSelectedCareer] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  const statusOptions: JobApplication['status'][] = [
    'submitted', 'processing', 'review', 'approved', 'rejected',
  ];

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseAPI}/careers/job-applications/?page=${page}`);
      setApplications(res.data.results);
      setCount(res.data.count);

      const titles = res.data.results.map((app: JobApplication) => app.career.title);
      const uniqueCareers: string[] = Array.from(new Set(titles));
      setCareers(uniqueCareers);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const updateStatus = async (id: number, status: JobApplication['status']) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', status);
      await axios.patch(`${baseAPI}/careers/job-applications/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async (resumeUrl: string, fileName: string) => {
    try {
      const response = await axios.get(resumeUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      case 'processing': return 'text-yellow-800 bg-yellow-100';
      case 'review': return 'text-blue-700 bg-blue-100';
      case 'submitted': return 'text-gray-700 bg-gray-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status: string): string => {
    switch (status) {
      case 'submitted': return 'Submitted';
      case 'processing': return 'Processing';
      case 'review': return 'On Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const totalPages = Math.ceil(count / pageSize);

  const filteredApplications = applications?.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const careerMatch = selectedCareer === 'all' || app.career.title === selectedCareer;
    const statusMatch = selectedStatus === 'all' || app.status === selectedStatus;
    return matchesSearch && careerMatch && statusMatch;
  });

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-10">
      {/* Loading Overlay */}
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin" />
        </div>
      </Transition>

      <h2 className="text-3xl font-bold mb-8 text-gray-900">📋 Job Applications</h2>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm w-full sm:w-64"
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by Career</label>
          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="all">All Careers</option>
            {careers.map((career) => (
              <option key={career} value={career}>{career}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Filter by Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid gap-6">
        {filteredApplications && filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className="bg-white p-5 rounded-lg border shadow hover:shadow-md transition-all duration-200">
              <div className="flex justify-between gap-4 flex-col sm:flex-row">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{app.full_name}</h3>
                  <p className="text-sm text-gray-500">{app.email}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Applied for <span className="font-medium">{app.career.title}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted: {dayjs(app.submitted_at).format('DD MMM YYYY, HH:mm')}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${statusColor(app.status)}`}>
                    {formatStatus(app.status)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="w-full sm:w-auto">
                    <label className="text-sm font-medium text-gray-700">Change Status</label>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatus(app.id, e.target.value as JobApplication['status'])
                      }
                      className="mt-1 border rounded px-2 py-1 text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => downloadResume(app.resume, `${app.full_name}_resume.pdf`)}
                    className="inline-flex items-center px-3 py-1.5 text-sm text-white bg-gray-800 hover:bg-gray-700 rounded shadow"
                  >
                    Download Resume
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No applications found for the selected filters.</p>
        )}
      </div>

      {/* Pagination */}
      {applications && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Previous
          </button>

          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
