import AdminLayout from '../../layouts/AdminLayout';
import useCategoryStore from '../../store/category';
import { useFormik } from 'formik';
import Input from '../../components/ui/Input';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import CategoryService from '../../services/CategoryService';
import slugify from 'slugify';
import { APIError } from 'altogic';
import { parseAltogicAPIError } from '../../helpers';

const addCategorySchema = Yup.object().shape({
	name: Yup.string().required('This field is required')
});

export function showCategoryError(errors: APIError) {
	console.error(errors);
	const parsedErrors = parseAltogicAPIError(errors as APIError);
	if (parsedErrors.length === 0) {
		toast.error('Something went wrong, please try again');
	} else {
		for (let parsedError of parsedErrors) {
			if (parsedError.error === 'not_unique') {
				toast.error(`Category '${parsedError.value}' already exists, please type another category name`);
			} else {
				toast.error('Something went wrong, please try again');
			}
		}
	}
}

export default function AddCategory() {
	const { addCategory } = useCategoryStore();
	const [loading, setLoading] = useState(false);
	const formik = useFormik({
		initialValues: {
			name: ''
		},
		validationSchema: addCategorySchema,
		onSubmit: async data => {
			setLoading(true);
			try {
				const category = await CategoryService.addCategory({
					...data,
					slug: slugify(data.name, {
						lower: true
					})
				});
				addCategory(category);
				formik.resetForm();
				toast.success('Category added successfully');
			} catch (errors) {
				showCategoryError(errors as APIError);
			} finally {
				setLoading(false);
			}
		}
	});

	return (
		<AdminLayout title="Add Category">
			<form className="space-y-8 divide-y divide-gray-200 px-4 md:px-0" onSubmit={formik.handleSubmit}>
				<div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
					<div>
						<div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
								<p className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Category name
								</p>
								<Input
									showError={!!formik.errors.name && !!formik.touched.name}
									errorMessage={formik.errors.name}
									onChange={formik.handleChange}
									value={formik.values.name}
									name="name"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="pt-5">
					<div className="flex justify-end gap-2">
						<Button type="button" onClick={() => formik.resetForm()} variant="secondary">
							Clear
						</Button>
						<Button loading={loading} type="submit">
							Add Category
						</Button>
					</div>
				</div>
			</form>
		</AdminLayout>
	);
}
