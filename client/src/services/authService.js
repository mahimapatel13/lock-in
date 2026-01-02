
export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const setAccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const logout = () => {
  localStorage.removeItem("access_token");
  window.location.href = "/login"; // Redirecting logic
};