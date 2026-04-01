
import { createSlice } from "@reduxjs/toolkit";
import { fetchRegions_ } from "./regionThunk";
import { Region } from "../../intl/types";


interface RegionState {
  data: Region[];
  totalRows: number;
  loading_: boolean;
}


const initialState: RegionState = {
  data: [],
  totalRows: 0,
  loading_: false,
};



const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRegions_.pending, state => {
        state.loading_ = true;
      })
      .addCase(fetchRegions_.fulfilled, (state, action) => {
        state.loading_ = false;
        state.data = action.payload.content;
        state.totalRows = action.payload.totalElements;
      })
      .addCase(fetchRegions_.rejected, state => {
        state.loading_ = false;
      });
  },
});

export default regionSlice.reducer;
