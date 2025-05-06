import API from "./api";

export interface InvitePayload {
  email: string;
  documentId: number;
}

export const sendInvite = async (payload: InvitePayload) => {
  const response = await API.post("/doc/send-invite/", {
    email: payload.email,
    document_id: payload.documentId,
  });

  return response.data;
};
