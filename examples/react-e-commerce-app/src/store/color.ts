import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Color } from '../types/altogic';

interface ColorState {
	colors: Color[];
	setColors: (colors: Color[]) => void;
}

const useColorStore = create<ColorState>()(
	devtools(
		set => ({
			colors: [],
			setColors(colors) {
				set({ colors });
			}
		}),
		{
			name: 'color-storage'
		}
	)
);

export default useColorStore;
