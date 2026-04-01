import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";


export const fetchRegions_ = createAsyncThunk(
  "region/fetch",
  async ({ page, size }: { page: number; size: number }) => {
    const response = await api.get("/location/regionPageWise", {
      params: {
        page: page - 1,
        size,
        sort: "id,desc",
      },
    });

    console.log("API RESPONSE 👉", response.data);

    return response.data;
  }
);

