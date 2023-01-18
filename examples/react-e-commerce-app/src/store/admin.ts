import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface AdminState {
	waitingOrderCount: number;
	setWaitingOrderCount: (count: number) => void;
}

const useAdminStore = create<AdminState>()(
	devtools(
		set => ({
			waitingOrderCount: 0,
			setWaitingOrderCount: (count: number) => set({ waitingOrderCount: count })
		}),
		{
			name: 'admin-storage'
		}
	)
);

export default useAdminStore;
