import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStore = create<Store>()(
  devtools(
    (set) => ({
      uploading: false,
      processing: false,
      originalImage: null,
      processedImage: null,
      reset: () =>
        set({
          originalImage: null,
          processedImage: null,
          uploading: false,
          processing: false,
        }),
      setProcessedImage: (processedImage: string | null) =>
        set({ processedImage }),
      setOriginalImage: (originalImage: string | null) =>
        set({ originalImage }),
      setUploading: (uploading: boolean) => set({ uploading }),
      setProcessing: (processing: boolean) => set({ processing }),
    }),
    {
      name: "general-storage",
    }
  )
);

interface Store {
  uploading: boolean;
  processing: boolean;
  originalImage: string | null;
  processedImage: string | null;
  reset: () => void;
  setProcessedImage: (processedImage: string | null) => void;
  setOriginalImage: (originalImage: string | null) => void;
  setUploading: (uploading: boolean) => void;
  setProcessing: (processing: boolean) => void;
}
