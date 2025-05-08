'use client';

import { useEffect, useState } from 'react';

import { fetchCareers } from '@/services/careerService';
import Link from 'next/link';
import { Career } from '@/types/Career';

export default function CareersPage() {
  const [jobs, setJobs] = useState<Career[]>([]);

  useEffect(() => {
    fetchCareers().then(setJobs);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Open Positions</h1>
      <ul className="space-y-6">
        {jobs.map((job) => (
          <li key={job.id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-500">{job.location}</p>
            <Link
              href={`/careers/${job.id}`}
              className="text-blue-600 mt-2 inline-block hover:underline"
            >
              View Details & Apply →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
