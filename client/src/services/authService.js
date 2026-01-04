import api from "@/utils/api"
export class AuthService {
  getAccessToken() {
    return localStorage.getItem("access_token");
  }

  setAccessToken(token) {
    localStorage.setItem("access_token", token);
  }

  logout() {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }

  deleteAccessToken(){
    localStorage.removeItem("access_token");
  }
  async login(email, password) {
    const payload = {
      email: email,
      password: password
    }
    console.log(payload)
    try {
      // Added 'await' here because API calls are asynchronous
      const resp = await api.post("/auth/login", payload);
      return resp;
    } catch (err) {
      const serverMessage = err.response?.data?.message;
        
      const finalMessage = (typeof serverMessage === 'string') 
        ? serverMessage 
        : "Server Error (500): Please check backend logs.";

      throw new Error(finalMessage);
    }
  }

  async register(email, username){
    const payload = {
      email: email,
      username: username
    }
    try{
      const resp = await api.post("auth/register", payload)
      return resp
    }catch(err){
      const serverMessage = err.response?.data?.message;
        
      const finalMessage = (typeof serverMessage === 'string') 
        ? serverMessage 
        : "Server Error (500): Please check backend logs.";

      throw new Error(finalMessage);
}
  }

  async verifyToken(token){
    try{
      const resp = await api.get("/profile/user");
      return resp.data.user;
    } catch(err){
      throw err
    }
  }
}

export const authService = new AuthService();