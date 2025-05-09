'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Career } from '@/types/Career';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { baseAPI } from '@/utils/variables';

const fetcher = (url: string) => axios.get(`${baseAPI}${url}`).then(res => res.data);

export default function ManageCareers() {
  const { data: careers, mutate } = useSWR<Career[]>('/careers/careers/', fetcher);
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
    try {
      await axios.put(`${baseAPI}/careers/careers/${editingId}/`, form);
      setEditingId(null);
      mutate();
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`${baseAPI}/careers/careers/${id}/`);
        mutate();
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  return (
    <div className="p-4 max-w-4xl">
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
            required
          />

          <input
            type="text"
            className="w-full border p-2"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />

          <div>
            <label>Description</label>
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
                onChange={(_, editor) =>
                  setForm((prev) => ({ ...prev, description: editor.getData() }))
                }
              />
            </div>
          </div>

          <div>
            <label>Requirements</label>
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
                onChange={(_, editor) =>
                  setForm((prev) => ({ ...prev, requirements: editor.getData() }))
                }
              />
            </div>
          </div>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </form>
      )}
    </div>
  );
}
