'use client';

import { useState } from 'react';
import { submitJobApplication } from '@/services/jobApplicationService';
import { JobApplication } from '@/types/career';

interface Props {
  careerId: number;
}

const JobApplicationForm: React.FC<Props> = ({ careerId }) => {
  const [form, setForm] = useState<Omit<JobApplication, 'career'> & { career?: number }>({
    full_name: '',
    email: '',
    resume: null as any,
    cover_letter: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitJobApplication({ ...form, career: careerId });
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Try again.');
    }
  };

  if (submitted) {
    return <p className="text-green-600 font-semibold">Application submitted successfully!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        required
        placeholder="Full Name"
        className="w-full border rounded p-2"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
        placeholder="Email"
        className="w-full border rounded p-2"
      />
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        required
        className="w-full border rounded p-2"
      />
      <textarea
        name="cover_letter"
        value={form.cover_letter}
        onChange={handleChange}
        required
        placeholder="Cover Letter"
        className="w-full border rounded p-2 h-32"
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Submit Application
      </button>
    </form>
  );
};

export default JobApplicationForm;
