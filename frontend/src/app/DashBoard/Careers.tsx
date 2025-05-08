'use client';
import React, { useState } from 'react';

import CreateCareer from './careers/CreateCareer';
import ManageCareers from './careers/ManageCareers';
import ViewApplications from './careers/ViewApplications';

const HRDashboard = () => {
  const [tab, setTab] = useState<'create' | 'manage' | 'applications'>('create');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>

      <div className="flex gap-6 border-b mb-6">
        <button
          className={`pb-2 ${tab === 'create' ? 'border-b-2 border-black font-bold' : ''}`}
          onClick={() => setTab('create')}
        >
          Post New Job
        </button>
        <button
          className={`pb-2 ${tab === 'manage' ? 'border-b-2 border-black font-bold' : ''}`}
          onClick={() => setTab('manage')}
        >
          Update/Delete Jobs
        </button>
        <button
          className={`pb-2 ${tab === 'applications' ? 'border-b-2 border-black font-bold' : ''}`}
          onClick={() => setTab('applications')}
        >
          Manage Applications
        </button>
      </div>

      {tab === 'create' && <CreateCareer />}
      {tab === 'manage' && <ManageCareers />}
      {tab === 'applications' && <ViewApplications />}
    </div>
  );
};

export default HRDashboard;
