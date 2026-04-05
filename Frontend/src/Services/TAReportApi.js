import axios from "axios";

export const fetchTAOverview = (params) => {
  return axios.get("http://localhost:5000/api/report/ta-overview", {
    params,
  });
};