
const isDevelopment = process.env.NODE_ENV !== 'production';


export const API_BASE_URL = isDevelopment 
  ? "http://localhost/chorchamp-server/api"
    : "https://chorechamp.kesug.com/api/api";

