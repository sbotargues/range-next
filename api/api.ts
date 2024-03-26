import axios, { AxiosResponse } from "axios";

const BASE_URL = "http://localhost:3000";

const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const ApiService = {
  async getAllRanges() {
    try {
      const response: AxiosResponse = await Api.get("/ranges");
      return response.data;
    } catch (error) {
      console.error("Error al obtener los rangos:", error);
      throw error;
    }
  },
  async getAllFixedRanges() {
    try {
      const response: AxiosResponse = await Api.get("/fixedRanges");
      return response.data;
    } catch (error) {
      console.error("Error al obtener los rangos fijos:", error);
      throw error;
    }
  },
};
