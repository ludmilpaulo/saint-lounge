import API from "./api";

export interface DocumentUploadPayload {
  title: string;
  file: File;
}

export interface Document {
  id: number;
  title: string;
  file_url: string;
  uploaded_at: string;
}

export const uploadDocument = async (payload: DocumentUploadPayload): Promise<Document> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("file", payload.file);

  const response = await API.post<Document>("/doc/documents/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getDocuments = async (): Promise<Document[]> => {
  const response = await API.get<Document[]>("/doc/documents/");
  return response.data;
};

export const getDocument = async (id: number): Promise<Document> => {
  const response = await API.get<Document>(`/doc/documents/${id}/`);
  return response.data;
};
