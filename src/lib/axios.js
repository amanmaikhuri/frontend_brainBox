import axios from "axios";

const api = axios.create ({
    baseURL: "https://backend-brainbox.onrender.com/api",
});

export default api;