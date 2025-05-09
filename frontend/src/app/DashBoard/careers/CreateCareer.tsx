'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Career } from '@/types/Career';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { baseAPI } from '@/utils/variables';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function CreateCareer() {
  const { data: careers, mutate } = useSWR<Career[]>('/careers/careers/', fetcher);

  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    requirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${baseAPI}/careers/careers/`, form);
      mutate();
      setForm({ title: '', location: '', description: '', requirements: '' });
      alert('Job posted successfully');
    } catch (error) {
      console.error('Failed to post job:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`${baseAPI}/careers/careers/${id}/`);
        mutate();
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  return (
    <div className="p-4 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <h2 className="text-2xl font-semibold">Post a New Job</h2>

        <input
          type="text"
          placeholder="Job Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border p-2 rounded"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <div className="border rounded">
          <CKEditor
          editor={ClassicEditor}
          data={form.description}
          config={{
            toolbar: [
              'heading', '|',
              'bold', 'italic', 'underline', 'strikethrough', '|',
              'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
              'alignment', 'outdent', 'indent', '|',
              'bulletedList', 'numberedList', 'blockQuote', '|',
              'insertTable', '|',
              'undo', 'redo'
            ]
          }}
          onChange={(_, editor) => {
            const data = editor.getData();
            setForm((prev) => ({ ...prev, description: data }));
          }}
        />

          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Requirements</label>
          <div className="border rounded">
            <CKEditor
              editor={ClassicEditor}
              data={form.requirements}
              config={{
                toolbar: [
                  'heading', '|',
                  'bold', 'italic', 'underline', 'strikethrough', '|',
                  'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                  'alignment', 'outdent', 'indent', '|',
                  'bulletedList', 'numberedList', 'blockQuote', '|',
                  'insertTable', '|',
                  'undo', 'redo'
                ]
              }}
              onChange={(_, editor) => {
                const data = editor.getData();
                setForm((prev) => ({ ...prev, requirements: data }));
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Post Job
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Current Jobs</h2>
      <ul className="space-y-3">
        {careers?.map((career) => (
          <li
            key={career.id}
            className="border p-4 rounded flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold text-lg">{career.title}</h3>
              <p className="text-sm text-gray-600">{career.location}</p>
            </div>
            <button
              onClick={() => handleDelete(career.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
