import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Size } from '../types/altogic';

interface SizeState {
	sizes: Size[];
	setSizes: (sizes: Size[]) => void;
}

const useSizeStore = create<SizeState>()(
	devtools(
		set => ({
			sizes: [],
			setSizes(sizes) {
				set({ sizes });
			}
		}),
		{
			name: 'size-storage'
		}
	)
);

export default useSizeStore;
