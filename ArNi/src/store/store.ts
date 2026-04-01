// import { configureStore } from "@reduxjs/toolkit";
// import countryReducer from "../../../ArNi/src/components/Tables/countrySlice";
// import regionReducer from "../../../ArNi/src/components/Tables/regionSlice";

// export const store = configureStore({
//   reducer: {
//     country: countryReducer,
//     region: regionReducer,
//   },
// });


import { configureStore } from "@reduxjs/toolkit";
import countryReducer from "../../../ArNi/src/components/Tables/countrySlice";
import regionReducer from "../../../ArNi/src/components/Tables/regionSlice";

export const store = configureStore({
  reducer: {
    country: countryReducer,
    region: regionReducer,
  },
});

// 👇 THIS IS THE KEY LINE
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
