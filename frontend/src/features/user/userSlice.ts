// features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  tenantId: string
  verified: boolean;
}

const initialState: UserState = {
  name: '',
  tenantId: '',
  verified: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    verify: (state, action: PayloadAction<{ name: string, tenantId: string | null }>) => {
      state.name = action.payload.name;
      state.tenantId = action.payload.tenantId ?? '';
      state.verified = true;
    },
    logout: (state) => {
      state.name = '';
      state.verified = false;
    },
  },
});

export const { verify, logout } = userSlice.actions;
export default userSlice.reducer;
