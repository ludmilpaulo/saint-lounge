import API from "./api";


export const sendOtp = async (email: string) => {
  const response = await API.post("send-otp/", { email });
  return response.data;
};

export const verifyOtp = async (email: string, code: string) => {
  const response = await API.post("verify-otp/", { email, code });
  return response.data;
};
