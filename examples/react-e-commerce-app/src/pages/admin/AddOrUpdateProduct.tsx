import { AdminLayout } from '../../layouts';
import { useFormik } from 'formik';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import SelectBox from '../../components/ui/SelectBox';
import * as Yup from 'yup';
import { ProductService, CartService } from '../../services';
import { toast } from 'react-toastify';
import { useProductStore, useCategoryStore, useColorStore, useSizeStore } from '../../store';
import { ChangeEvent, useState } from 'react';
import DropZone from '../../components/ui/DropZone';
import { MdInfo, MdDelete, FaPlus } from 'react-icons/all';
import { cn, isMobile } from '../../helpers';
import Button from '../../components/ui/Button';
import { APIError } from 'altogic';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { Product } from '../../types/altogic';
import { useCartStore } from '../../store';
import { Tooltip } from 'react-tooltip';
import InputModal from '../../components/InputModal';
import CategoryService from '../../services/CategoryService';
import slugify from 'slugify';
import { showCategoryError } from './AddCategory';

interface AddOrUpdateProductProps {
	type?: 'add' | 'update';
}
export default function AddOrUpdateProduct({ type = 'add' }: AddOrUpdateProductProps) {
	const isEditMode = type === 'update';
	const product = useLoaderData() as Product;

	const { categories, addCategory } = useCategoryStore();
	const { addProduct, updateProduct } = useProductStore();
	const { setCart } = useCartStore();
	const { colors } = useColorStore();
	const { sizes } = useSizeStore();

	const [searchParams] = useSearchParams();
	const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
	const [categoryAdding, setCategoryAdding] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(
		isEditMode ? product.coverURL : searchParams.get('coverURL') ?? null
	);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const addProductSchema = Yup.object().shape({
		name: Yup.string().required('Product name is required'),
		qtyInStock: Yup.number()
			.min(0, 'Product stock must be greater than and equal to 0.')
			.required('Product stock is required'),
		category: Yup.string().required('Product category is required'),
		description: Yup.string().required('Product description is required'),
		price: Yup.number()
			.min(0, 'Product price cannot be negative value')
			.max(999999, 'Product price cannot be greater than 999.999')
			.required('Product price is required'),
		image: Yup.mixed().required('Product cover is required'),
		color: Yup.string().required('Product color is required'),
		size: Yup.string().required('Product size is required'),
		variantId: Yup.string()
	});

	const formik = useFormik({
		initialValues: {
			name: isEditMode ? product.name : searchParams.get('name') ?? '',
			qtyInStock: isEditMode ? product.qtyInStock : '',
			category: isEditMode ? product.category : searchParams.get('category') ?? '',
			description: isEditMode ? product.description : searchParams.get('description') ?? '',
			price: isEditMode ? product.price : searchParams.get('price') ?? '',
			image: isEditMode ? product.coverURL : searchParams.get('coverURL') ?? null,
			color: isEditMode ? product.color?._id : '',
			size: isEditMode ? product.size?._id : '',
			variantId: isEditMode ? product.variantId : searchParams.get('variantId') ?? ''
		},
		validationSchema: addProductSchema,
		onSubmit: async ({ image, ...rest }) => {
			setLoading(true);
			try {
				// @ts-ignore
				await (isEditMode ? updateProductInfo : addNewProduct)(image, rest);
				navigate('/admin/products');
				formik.resetForm();
			} catch (errors) {
				console.error(errors);
				(errors as APIError).items.forEach((item: any) => toast.error(item.message));
			} finally {
				setLoading(false);
			}
		}
	});

	async function updateProductInfo(image: string | File, data: typeof formik.initialValues) {
		let coverURL = image;
		if (!data.color) delete data.color;
		if (!data.size) delete data.size;
		if (image instanceof File) {
			const { data: dataFromUploader, errors } = await ProductService.uploadCoverImage(image);
			if (errors) return errors.items.forEach(item => toast.error(item.message));
			coverURL = dataFromUploader.publicPath;
		}
		// @ts-ignore
		const updatedProduct = await ProductService.updateProfile(product._id, { ...data, coverURL });
		toast.success('Product updated successfully');
		updateProduct(updatedProduct);
		setCart(await CartService.getCart());
	}

	async function addNewProduct(image: string, data: typeof formik.initialValues) {
		if (!data.color) delete data.color;
		if (!data.size) delete data.size;
		// @ts-ignore
		const product = await ProductService.addProduct(data, image);
		addProduct(product);
		toast.success('Product added successfully');
		setImagePreview(null);
	}

	function removeCoverImage() {
		setImagePreview(null);
		formik.setFieldValue('image', null);
	}
	function onSelectImage(files: File[]) {
		const [file] = files;
		setImagePreview(URL.createObjectURL(file));
		formik.setFieldValue('image', file);
	}

	function resetForm() {
		formik.resetForm();
		setImagePreview(null);
	}

	function onSelectedImageInMobile(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		const [file] = e.target.files;
		setImagePreview(URL.createObjectURL(file));
		formik.setFieldValue('image', file);
	}

	async function addNewCategory(name: string, reset: () => void) {
		setCategoryAdding(true);
		try {
			const category = await CategoryService.addCategory({
				name,
				slug: slugify(name, {
					lower: true
				})
			});
			addCategory(category);
			toast.success('Category added successfully');
			reset();
		} catch (e) {
			showCategoryError(e as APIError);
		} finally {
			setCategoryAdding(false);
			setAddCategoryModalOpen(false);
		}
	}

	return (
		<AdminLayout title={isEditMode ? 'Update Product' : 'Add Product'}>
			<>
				<form className="space-y-8 divide-y divide-gray-200 px-4 md:px-0" onSubmit={formik.handleSubmit}>
					<div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
						<div>
							<div className="flex flex-col gap-y-6 sm:gap-y-5">
								<div className="grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
									<p className="block text-sm font-medium text-gray-700 sm:pt-2">
										Product name <span className="text-red-500">*</span>
									</p>
									<Input
										showError={!!formik.errors.name && !!formik.touched.name}
										errorMessage={formik.errors.name}
										onChange={formik.handleChange}
										value={formik.values.name}
										name="name"
									/>
								</div>
								<div className="grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
									<p className="block text-sm font-medium text-gray-700 sm:pt-2">
										Product in stock <span className="text-red-500">*</span>
									</p>
									<Input
										showError={!!formik.errors.qtyInStock && !!formik.touched.qtyInStock}
										errorMessage={formik.errors.qtyInStock}
										onChange={formik.handleChange}
										value={formik.values.qtyInStock}
										name="qtyInStock"
										type="number"
										min={0}
									/>
								</div>
								<div className="grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
									<p className="block text-sm font-medium text-gray-700 sm:pt-2">
										Product price <span className="text-red-500">*</span>
									</p>
									<Input
										showError={!!formik.errors.price && !!formik.touched.price}
										errorMessage={formik.errors.price}
										onChange={formik.handleChange}
										value={formik.values.price}
										name="price"
										type="number"
										min={0}
									/>
								</div>
								<div className="grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
									<p className="block text-sm font-medium text-gray-700 sm:pt-2">
										Product variant ID
									</p>
									<div className="relative">
										<Input
											showError={!!formik.errors.variantId && !!formik.touched.variantId}
											errorMessage={formik.errors.variantId}
											onChange={formik.handleChange}
											value={formik.values.variantId}
											name="variantId"
											className={cn(!searchParams.get('variantId') ? 'pr-10' : '')}
											readOnly={!!searchParams.get('variantId')}
										/>
										{!searchParams.get('variantId') ? (
											<div className="absolute top-0 bottom-0 right-3 flex items-center">
												<Tooltip anchorId="productVariantCodeInfo" />
												<button
													type="button"
													id="productVariantCodeInfo"
													data-tooltip-content="If the product does not have a variant, leave it blank."
													data-tooltip-place="top"
													className="flex items-center justify-center cursor-pointer"
												>
													<MdInfo className="text-indigo-700" size={20} />
												</button>
											</div>
										) : undefined}
									</div>
								</div>
								<div className="grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
									<p className="block text-sm font-medium text-gray-700 sm:pt-2">
										Product size <span className="text-red-500">*</span>
									</p>
									<SelectBox
										showError={!!formik.errors.size && !!formik.touched.size}
										errorMessage={formik.errors.size}
										onChange={formik.handleChange}
										value={formik.values.size?.toString()}
										name="size"
										firstSelectionText="Select a size"
										className="w-full"
										fields={sizes.map(size => ({ id: size._id, value: size.name }))}
									/>
								</div>
								<div className="grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
									<p className="block text-sm font-medium text-gray-700 sm:pt-2">
										Product color <span className="text-red-500">*</span>
									</p>
									<SelectBox
										showError={!!formik.errors.color && !!formik.touched.color}
										errorMessage={formik.errors.color}
										onChange={formik.handleChange}
										value={formik.values.color?.toString()}
										name="color"
										firstSelectionText="Select a color"
										className="w-full"
										fields={colors.map(color => ({ id: color._id, value: color.name }))}
									/>
								</div>
								<div className="grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
									<p className="block text-sm font-medium text-gray-700 sm:pt-2">
										Product category <span className="text-red-500">*</span>
									</p>
									<SelectBox
										showError={!!formik.errors.category && !!formik.touched.category}
										errorMessage={formik.errors.category}
										onChange={formik.handleChange}
										value={formik.values.category.toString()}
										name="category"
										className="w-full"
										firstSelectionText="Select a category"
										fields={categories.map(category => ({
											id: category._id,
											value: category.name
										}))}
									/>
									<Button
										className="mt-2 sm:mt-0 gap-1 justify-self-end sm:justify-self-start sm:self-end w-fit"
										size="small"
										type="button"
										onClick={() => setAddCategoryModalOpen(true)}
									>
										<FaPlus size={10} />
										Add a new category
									</Button>
								</div>
								<div className="grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
									<p className="block text-sm font-medium text-gray-700 sm:pt-2">
										Product description <span className="text-red-500">*</span>
									</p>
									<Textarea
										showError={!!formik.errors.description && !!formik.touched.description}
										errorMessage={formik.errors.description}
										onChange={formik.handleChange}
										value={formik.values.description}
										name="description"
										rows={6}
										className="mt-1 sm:mt-0 sm:col-span-2"
									/>
								</div>

								<div className="grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
									<p className="block text-sm font-medium text-gray-700 sm:pt-2">
										Product cover <span className="text-red-500">*</span>
									</p>

									{imagePreview ? (
										<div className="grid mt-1 grid-cols-2 sm:flex flex gap-2 sm:col-span-2">
											<picture className="group overflow-hidden border-gray-300 w-full sm:w-fit sm:min-w-[150px] max-w-[300px] flex items-center justify-center relative h-40 border p-1 rounded-md">
												<img
													draggable={false}
													className="max-h-full w-full rounded object-cover"
													src={imagePreview}
													alt="selected cover image"
												/>
											</picture>
											<Button
												className="self-end gap-2 whitespace-nowrap"
												variant="white"
												type="button"
												onClick={removeCoverImage}
											>
												<MdDelete size={20} />
												Remove Cover
											</Button>
										</div>
									) : isMobile() ? (
										<div>
											<label
												className={cn(
													'block border px-3 py-2 text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm border-gray-300 rounded-md',
													formik.errors.image && formik.touched.image ? 'border-red-600' : ''
												)}
											>
												<input
													onChange={onSelectedImageInMobile}
													type="file"
													name="image"
													className="hidden"
													accept="image/*"
												/>
												Select cover photo
											</label>
											{formik.errors.image && formik.touched.image ? (
												<small className="text-red-600">{formik.errors.image}</small>
											) : undefined}
										</div>
									) : (
										<DropZone
											multiple={false}
											showError={!!formik.errors.image && !!formik.touched.image}
											errorMessage={formik.errors.image}
											accept="image/*"
											name="image"
											onSelected={onSelectImage}
											className="sm:mt-0 sm:col-span-2 block mt-1"
										/>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="pt-5">
						<div className="flex justify-end gap-2">
							{isEditMode ? (
								<Button type="button" onClick={() => navigate(-1)} variant="secondary">
									Go back
								</Button>
							) : (
								<Button type="button" onClick={resetForm} variant="secondary">
									Clear
								</Button>
							)}
							<Button loading={loading} type="submit">
								{isEditMode ? 'Update product' : 'Add product'}
							</Button>
						</div>
					</div>
				</form>
				<InputModal
					isOpen={addCategoryModalOpen}
					close={() => setAddCategoryModalOpen(false)}
					inputPlaceholder="Category name"
					onSubmit={addNewCategory}
					inputType="text"
					loading={categoryAdding}
					buttonText="Add category"
				/>
			</>
		</AdminLayout>
	);
}
