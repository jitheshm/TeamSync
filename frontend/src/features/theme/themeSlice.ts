// features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
    background: string;
    text: string;
    main: string;
    dark: boolean;
}

const initialState: ThemeState = {
    background: 'bg-[#1a1c23]',
    main: 'bg-[#121317]',
    text: 'text-gray-100',
    dark: true

};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toogleTheme: (state) => {
            state.background = state.background === 'bg-gray-100' ? 'bg-[#1a1c23]' : 'bg-gray-100'
            state.text = state.text === 'text-gray-950' ? 'text-gray-100' : 'text-gray-950';
            state.main = state.main === 'bg-gray-100' ? 'bg-[#121317]' : 'bg-gray-100';
            state.dark = !state.dark;
        }

    },
});

export const { toogleTheme } = themeSlice.actions;
export default themeSlice.reducer;
