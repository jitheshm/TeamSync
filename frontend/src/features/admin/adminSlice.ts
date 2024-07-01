// features/admin/adminSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AdminState {
  verified: boolean;
}

const initialState: AdminState = {
  verified: false,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    verify: (state) => {
      state.verified = true;
    },
    logout: (state) => {
      state.verified = false;
    },
  },
});

export const { verify, logout } = adminSlice.actions;
export default adminSlice.reducer;
