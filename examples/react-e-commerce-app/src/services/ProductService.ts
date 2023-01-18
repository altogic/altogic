import altogic, { altogicOnlyRead } from '../libs/altogic';
import { Category, PaginateData, Product } from '../types/altogic';
import { APIError } from 'altogic';
import useCategoryStore from '../store/category';
import category from '../store/category';

export const PRODUCT_LIMIT = 12;

export default class ProductService {
	static async getProducts({ onlyHasStock = true, page = 1, limit = PRODUCT_LIMIT }: GetProductsParams) {
		let filter = ['EXISTS(stripeProductId)', 'EXISTS(stripePriceId)'];
		if (onlyHasStock) filter.push('qtyInStock > 0');

		const {
			// @ts-ignore
			data: { data, info },
			errors
		} = await altogicOnlyRead.db
			.model('products')
			.filter(filter.join(' && '))
			.page(page)
			.limit(limit)
			.sort('createdAt', 'desc')
			.lookup({ field: 'category' })
			.lookup({ field: 'color' })
			.lookup({ field: 'size' })
			.get(true);

		if (errors) throw errors;

		return {
			items: data as Product[],
			paginateData: info as PaginateData
		};
	}
	static async getProductsByVariantId(variantId: string) {
		const { data, errors } = await altogicOnlyRead.db
			.model('products')
			.filter(`variantId == '${variantId}'`)
			.lookup({ field: 'color' })
			.lookup({ field: 'size' })
			.get();

		if (errors) throw errors;

		return data as Product[];
	}

	static async getProductsByCategory(
		slug: string,
		{ onlyHasStock = true, page = 1, limit = PRODUCT_LIMIT }: GetProductsParams
	) {
		let filter = ['EXISTS(stripeProductId)', 'EXISTS(stripePriceId)', `category.slug == '${slug}'`];
		if (onlyHasStock) filter.push('qtyInStock > 0');

		const {
			// @ts-ignore
			data: { data, info },
			errors
		} = await altogicOnlyRead.db
			.model('products')
			.sort('createdAt', 'desc')
			.filter(filter.join(' && '))
			.page(page)
			.limit(limit)
			.lookup({ field: 'category' })
			.get(true);

		if (errors) throw errors;

		return {
			items: data as Product[],
			paginateData: info as PaginateData
		};
	}

	static async getProductById(_id: string) {
		const { data, errors } = await altogicOnlyRead.db
			.model('products')
			.lookup({ field: 'color' })
			.lookup({ field: 'size' })
			.filter(`_id == '${_id}'`)
			.getSingle();

		if (errors) throw errors;

		return data as Product;
	}

	static async addProduct(product: AddProduct, image: File | string) {
		let coverURL = image;
		if (image instanceof File) {
			const { errors: uploadErrors, data } = await ProductService.uploadCoverImage(image);
			if (uploadErrors) throw uploadErrors;

			coverURL = data.publicPath;
		}

		const { data: dataFromDB, errors } = (await altogic.endpoint.post('/products', {
			...product,
			coverURL
		})) as {
			data: Product;
			errors: APIError;
		};

		if (errors) throw errors;

		dataFromDB.category = useCategoryStore
			.getState()
			.categories.find(category => category._id === product.category) as Category;

		return dataFromDB as Product;
	}

	static async uploadCoverImage(file: File) {
		let { data, errors } = (await altogic.storage.root.upload(file.name, file, {
			isPublic: true,
			onProgress() {} // suppress for ts error
		})) as {
			data: {
				publicPath: string;
			};
			errors: APIError;
		};

		return {
			errors,
			data
		};
	}

	static async updateProfile(id: string, data: Partial<Product>) {
		const { data: dataFromApi, errors } = await altogic.endpoint.put('/products/' + id, data);
		if (errors) throw errors;

		return dataFromApi as Product;
	}

	static async deleteProduct(id: string) {
		const product = await altogic.db.model('products').object(id);

		const { data: productFromDB, errors: productError } = await product.get();

		if (!productError && productFromDB) {
			const { coverURL, variantId } = productFromDB as Product;
			if (!variantId) altogic.storage.deleteFile(coverURL).catch(console.error);
		}

		const { errors } = await product.delete();

		if (errors) throw errors;
		return true;
	}

	static async addVariant(productId: string) {
		const { data, errors } = await altogic.endpoint.post(`/variant/${productId}`);

		if (errors) throw errors;

		return data as { variantId: string };
	}
}

interface AddProduct {
	name: string;
	qtyInStock: number;
	category: string;
	description: string;
	price: number;
}

interface GetProductsParams {
	onlyHasStock: boolean;
	page?: number;
	limit?: number;
}
