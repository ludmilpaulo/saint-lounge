'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JobApplication } from '@/types/Career';

export default function ViewApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const pageSize = 5;

  const fetchApplications = async () => {
    const res = await axios.get(`/api/job-applications/?page=${page}`);
    setApplications(res.data.results);
    setCount(res.data.count);
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const updateStatus = async (id: number, status: JobApplication['status']) => {
    await axios.patch(`/api/job-applications/${id}/`, { status });
    fetchApplications();
  };

  const totalPages = Math.ceil(count / pageSize);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Applications</h2>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Full Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Career</th>
            <th className="p-2">Status</th>
            <th className="p-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-t">
              <td className="p-2">{app.full_name}</td>
              <td className="p-2">{app.email}</td>
              <td className="p-2">{app.career.title}</td>
              <td className="p-2 capitalize">{app.status}</td>
              <td className="p-2">
                <select
                  value={app.status}
                  onChange={(e) =>
                    updateStatus(app.id, e.target.value as JobApplication['status'])
                  }
                  className="border p-1"
                >
                  {['submitted', 'processing', 'review', 'approved', 'rejected'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
