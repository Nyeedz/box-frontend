import axios from "axios";

const api = axios.create({
  baseURL: "https://boxnode-backend.herokuapp.com"
});

export default api;
