import axios from "axios";

const baseUrl =
  "https://private-4e19e-interviewapi3.apiary-mock.com/vehicles?page=";

export function getAll() {
  const config = {
    method: "GET",
    headers:{}
  };
  return axios
    .get(baseUrl, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

const responseSuccessHandler = response => response.data;

const responseErrorHandler = error => {
  console.log(error);
  return Promise.reject(error);
};
