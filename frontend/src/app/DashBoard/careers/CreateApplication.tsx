'use client';
import React, { useState } from 'react';
import { Career, JobApplication } from '@/types/Career';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function CreateApplication() {
  const { data: careers, error } = useSWR<Career[]>('/api/careers/', fetcher);
  const [form, setForm] = useState({
    careerId: '',
    full_name: '',
    email: '',
    cover_letter: '',
    resume: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('career', form.careerId);
    formData.append('full_name', form.full_name);
    formData.append('email', form.email);
    formData.append('cover_letter', form.cover_letter);
    if (form.resume) formData.append('resume', form.resume);

    await axios.post('/api/job-applications/', formData);
    alert('Application submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <select
        className="w-full border p-2"
        value={form.careerId}
        onChange={(e) => setForm({ ...form, careerId: e.target.value })}
        required
      >
        <option value="">Select a Career</option>
        {careers?.map(c => (
          <option key={c.id} value={c.id}>{c.title} - {c.location}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full border p-2"
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Cover Letter"
        className="w-full border p-2"
        value={form.cover_letter}
        onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
        required
      />
      <input
        type="file"
        accept="application/pdf"
        className="w-full border p-2"
        onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] || null })}
        required
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Submit Application
      </button>
    </form>
  );
}
