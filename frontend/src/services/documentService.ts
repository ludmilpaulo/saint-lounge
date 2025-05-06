import API from "./api";


export interface Document {
  id: number;
  title: string;
  file_url: string;
  signed_file_url?: string | null;
  is_signed: boolean;
  created_at: string;
}

export interface DocumentUploadPayload {
  title: string;
  file: File;
  user_id: number;
}

export const uploadDocument = async (payload: DocumentUploadPayload): Promise<Document> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("file", payload.file);
  formData.append("uploaded_by", String(payload.user_id));


  const res = await API.post<Document>('/doc/documents/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};



export const getDocuments = async (): Promise<Document[]> => {
  const response = await API.get<Document[]>("/doc/documents/");
  return response.data;
};

export const getDocument = async (id: number): Promise<Document> => {
  const response = await API.get<Document>(`/doc/documents/${id}/`);
  return response.data;
};
