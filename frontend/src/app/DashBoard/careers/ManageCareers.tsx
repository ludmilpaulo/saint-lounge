'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Career } from '@/types/Career';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ManageCareers() {
  const { data: careers, mutate } = useSWR<Career[]>('/api/careers/', fetcher);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    requirements: '',
  });

  const handleEdit = (career: Career) => {
    setEditingId(career.id);
    setForm({
      title: career.title,
      location: career.location,
      description: career.description,
      requirements: career.requirements,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    await axios.put(`/api/careers/${editingId}/`, form);
    setEditingId(null);
    mutate();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      await axios.delete(`/api/careers/${id}/`);
      mutate();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Update or Delete Jobs</h2>
      <ul className="space-y-4">
        {careers?.map((career) => (
          <li key={career.id} className="border p-4 rounded shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{career.title}</h3>
                <p className="text-gray-600 text-sm">{career.location}</p>
              </div>
              <div className="flex gap-3">
                <button className="text-blue-600" onClick={() => handleEdit(career)}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(career.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {editingId && (
        <form onSubmit={handleUpdate} className="mt-6 space-y-4 border p-4 rounded bg-gray-50">
          <h3 className="font-semibold text-lg">Edit Career</h3>
          <input
            type="text"
            className="w-full border p-2"
            placeholder="Job Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text"
            className="w-full border p-2"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <div>
            <label>Description</label>
            <CKEditor
              editor={ClassicEditor}
              data={form.description}
              onChange={(_, editor) => setForm({ ...form, description: editor.getData() })}
            />
          </div>
          <div>
            <label>Requirements</label>
            <CKEditor
              editor={ClassicEditor}
              data={form.requirements}
              onChange={(_, editor) => setForm({ ...form, requirements: editor.getData() })}
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      )}
    </div>
  );
}
