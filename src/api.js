import axios from "axios";

const getApi = (username, password) =>
  axios.create({
    baseURL: "http://localhost:8083/api",
    auth: {
      username,
      password,
    },
  });

export default getApi;
