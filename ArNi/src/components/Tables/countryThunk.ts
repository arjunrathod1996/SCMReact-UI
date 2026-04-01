import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchCountries = createAsyncThunk(
  "country/fetch",
  async ({ page, size }: { page: number; size: number }) => {
    const response = await api.get("/location/countryPageWise", {
      params: {
        page: page - 1,
        size,
        sort: "id,desc",
      },
    });
    return response.data;
  }
);
