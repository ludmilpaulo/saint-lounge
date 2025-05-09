'use client';

import { useEffect, useMemo, useState, Fragment } from 'react';
import { fetchCareers } from '@/services/careerService';
import { Career } from '@/types/Career';
import axios from 'axios';
import {
  BriefcaseIcon,
  MapPinIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Transition, Dialog } from '@headlessui/react';
import { baseAPI } from '@/utils/variables';

const ITEMS_PER_PAGE = 5;

export default function CareersPage() {
  const [jobs, setJobs] = useState<Career[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'az'>('newest');
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState<'en' | 'pt'>('en'); // ✅ default language

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    cover_letter: '',
    resume: null as File | null,
    language: 'en',
  });

  const labels = {
    en: {
      fullName: 'Full Name',
      email: 'Email',
      coverLetter: 'Cover Letter',
      resume: 'Upload Resume (PDF)',
      submit: 'Submit Application',
      language: 'Preferred Language',
    },
    pt: {
      fullName: 'Nome Completo',
      email: 'Email',
      coverLetter: 'Carta de Apresentação',
      resume: 'Anexar Currículo (PDF)',
      submit: 'Enviar Candidatura',
      language: 'Idioma Preferido',
    },
  };
  

  useEffect(() => {
    const lang = navigator.language.toLowerCase();
    const detected = lang.startsWith('pt') ? 'pt' : 'en';
    setLanguage(detected);
    setForm((prev) => ({ ...prev, language: detected }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const formData = new FormData();
    formData.append('career_id', String(selectedJob.id));
    formData.append('full_name', form.full_name);
    formData.append('email', form.email);
    formData.append('cover_letter', form.cover_letter);
    formData.append('language', form.language); // ✅ include language
    if (form.resume) formData.append('resume', form.resume);

    setLoading(true);
    try {
      await axios.post(`${baseAPI}/careers/job-applications/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Application submitted!');
      setSelectedJob(null);
      setForm({
        full_name: '',
        email: '',
        cover_letter: '',
        resume: null,
        language,
      });
    } catch {
      alert('Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers().then(setJobs);
  }, []);

  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((job) => job.location === selectedLocation);
    }

    if (sortOrder === 'az') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return filtered;
  }, [jobs, searchQuery, selectedLocation, sortOrder]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueLocations = [...new Set(jobs.map((job) => job.location))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Explore Opportunities</h1>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          We’re looking for smart, passionate individuals ready to grow with us.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title or location..."
          className="w-full sm:w-1/2 border p-2 rounded"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="flex gap-4">
          <select
            className="border p-2 rounded"
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'newest' | 'az');
              setCurrentPage(1);
            }}
          >
            <option value="newest">Sort by Newest</option>
            <option value="az">Sort A–Z</option>
          </select>
        </div>
      </div>

      {/* Jobs */}
      <ul className="space-y-6">
        {paginatedJobs.map((job) => (
          <li
            key={job.id}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                  {job.title}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  {job.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(job)}
                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
              >
                View Details & Apply
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 mt-12">No jobs match your criteria.</p>
      )}

      {/* Pagination */}
      {filteredJobs.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal */}
      <Transition appear show={selectedJob !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedJob(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-2xl font-bold">
                      {selectedJob?.title}
                    </Dialog.Title>
                    <button onClick={() => setSelectedJob(null)} className="text-gray-500">
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="prose max-w-none mb-6">
                    <h3>Description</h3>
                    <div dangerouslySetInnerHTML={{ __html: selectedJob?.description || '' }} />
                    <h3>Requirements</h3>
                    <div dangerouslySetInnerHTML={{ __html: selectedJob?.requirements || '' }} />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 mt-6">
  <label className="block text-sm font-medium">{labels[language].language}</label>
  <select
    className="border p-2 rounded w-full"
    value={form.language}
    onChange={(e) => {
      const lang = e.target.value as 'en' | 'pt';
      setForm((prev) => ({ ...prev, language: lang }));
      setLanguage(lang);
    }}
  >
    <option value="en">English</option>
    <option value="pt">Português</option>
  </select>

  <label className="block text-sm font-medium">{labels[language].fullName}</label>
  <input
    type="text"
    className="w-full border p-2 rounded"
    value={form.full_name}
    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
    required
  />

  <label className="block text-sm font-medium">{labels[language].email}</label>
  <input
    type="email"
    className="w-full border p-2 rounded"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    required
  />

  <label className="block text-sm font-medium">{labels[language].coverLetter}</label>
  <textarea
    className="w-full border p-2 rounded"
    rows={5}
    value={form.cover_letter}
    onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
    required
  />

  <label className="block text-sm font-medium">{labels[language].resume}</label>
  <input
    type="file"
    accept="application/pdf"
    className="w-full border p-2 rounded"
    onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] || null })}
    required
  />

  <button
    type="submit"
    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
  >
    {labels[language].submit}
  </button>
</form>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Loader */}
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
    </div>
  );
}
