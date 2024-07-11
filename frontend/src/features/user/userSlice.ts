// features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  tenantId: string
  verified: boolean;
  role: string;
  id: string
}

const initialState: UserState = {
  name: '',
  tenantId: '',
  verified: false,
  role: '',
  id: ''

};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    verify: (state, action: PayloadAction<{ name: string, tenantId: string | null, role: string ,id:string}>) => {
      state.name = action.payload.name;
      state.tenantId = action.payload.tenantId ?? '';
      state.id = action.payload.id ?? '';
      state.verified = true;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.name = '';
      state.verified = false;
    },
  },
});

export const { verify, logout } = userSlice.actions;
export default userSlice.reducer;
