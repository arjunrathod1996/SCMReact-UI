import { createSlice } from "@reduxjs/toolkit";
import { fetchCountries } from "./countryThunk";

const countrySlice = createSlice({
  name: "country",
  initialState: {
    data: [],
    totalRows: 0,
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCountries.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.content;
        state.totalRows = action.payload.totalElements;
      })
      .addCase(fetchCountries.rejected, state => {
        state.loading = false;
      });
  },
});

export default countrySlice.reducer;
