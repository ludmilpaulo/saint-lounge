import API from "./api";

export interface DocumentUploadPayload {
  title: string;
  file: File;
}

export const uploadDocument = async (payload: DocumentUploadPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("file", payload.file);

  const response = await API.post("documents/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getDocuments = async () => {
  const response = await API.get("documents/");
  return response.data;
};

export const getDocument = async (id: number) => {
  const response = await API.get(`documents/${id}/`);
  return response.data;
};
