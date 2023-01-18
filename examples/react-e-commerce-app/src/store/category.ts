import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Category } from '../types/altogic';

interface CategoryState {
	categories: Category[];
	activeCategories: Category[];
	setCategories: (categories: Category[]) => void;
	setActiveCategories: (categories: Category[]) => void;
	addCategory: (category: Category) => void;
	removeCategory: (id: string) => void;
}

const useCategoryStore = create<CategoryState>()(
	devtools(
		set => ({
			categories: [],
			activeCategories: [],
			setCategories(categories) {
				set({ categories });
			},
			setActiveCategories(categories) {
				set({ activeCategories: categories });
			},
			addCategory(category) {
				set(prev => ({ categories: [...prev.categories, category] }));
			},
			removeCategory(id) {
				set(prev => ({ categories: prev.categories.filter(category => category._id !== id) }));
			}
		}),
		{
			name: 'category-storage'
		}
	)
);

export default useCategoryStore;
