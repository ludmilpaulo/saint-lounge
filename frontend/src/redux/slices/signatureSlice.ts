// redux/slices/signatureSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SignatureElement {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

interface State {
  elements: SignatureElement[];
}

const initialState: State = {
  elements: [],
};

const signatureSlice = createSlice({
  name: 'signature',
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<SignatureElement>) => {
      state.elements.push(action.payload);
    },
    updateElementPosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const el = state.elements.find(e => e.id === action.payload.id);
      if (el) {
        el.x = action.payload.x;
        el.y = action.payload.y;
      }
    },
    updateElementSize: (state, action: PayloadAction<{ id: string; width: number; height: number; x: number; y: number }>) => {
      const el = state.elements.find(e => e.id === action.payload.id);
      if (el) {
        el.width = action.payload.width;
        el.height = action.payload.height;
        el.x = action.payload.x;
        el.y = action.payload.y;
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter(el => el.id !== action.payload);
    },
    clearElements: (state) => {
      state.elements = [];
    },
  },
});

export const {
  addElement,
  updateElementPosition,
  updateElementSize,
  deleteElement,
  clearElements,
} = signatureSlice.actions;

export default signatureSlice.reducer;
