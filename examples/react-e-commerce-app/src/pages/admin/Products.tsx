import AdminLayout from '../../layouts/AdminLayout';
import Table from '../../components/ui/Table';
import { moneyFormat, cn } from '../../helpers';
import Button from '../../components/ui/Button';
import { FaPlus } from 'react-icons/all';
import { format } from 'date-fns';
import { APIError } from 'altogic';
import { toast } from 'react-toastify';
import { useState } from 'react';
import ProductService, { PRODUCT_LIMIT } from '../../services/ProductService';
import ConfirmModal from '../../components/ConfirmModal';
import CartService from '../../services/CartService';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { Color, PaginateData, Product } from '../../types/altogic';
import Pagination from '../../components/Pagination';

interface ProductsLoader {
	items: Product[];
	paginateData: PaginateData;
}
export default function Products() {
	const { items: productsFromDB, paginateData: paginateDataFromDB } = useLoaderData() as ProductsLoader;
	const [products, setProducts] = useState(productsFromDB);
	const [paginateData, setPaginateData] = useState(paginateDataFromDB);

	const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<string>();
	const [deleting, setDeleting] = useState(false);

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const cols = [
		{ colName: '', className: 'min-w-[6rem] w-24' },
		{ colName: 'Name' },
		{ colName: 'Variant ID' },
		{ colName: 'Detail' },
		{ colName: 'Category' },
		{ colName: 'Price' },
		{ colName: 'Created At' },
		{ colName: 'Actions', className: 'w-32 text-center' }
	];
	const rows = products.map(product => ({
		cover: <img className="object-cover w-16 h-24 rounded" src={product.coverURL} alt={product.name} />,
		name: <p className="w-[20ch] whitespace-normal">{product.name}</p>,
		variantCode: (
			<span className="inline-flex items-center flex-col gap-2">
				<p className="w-[12ch] text-[10px] overflow-x-auto text-center [&::-webkit-scrollbar]:hidden select-all">
					{product.variantId ?? '-'}
				</p>
				<Button
					className="w-fit !text-[10px] !px-1 !py-0.5"
					onClick={() => addVariant(product)}
					variant="secondary"
					size="small"
				>
					Add Variant
				</Button>
			</span>
		),
		detail: (
			<span className="inline-flex flex-col gap-1">
				<p>
					stock:{' '}
					<span className={cn('tabular-nums', product.qtyInStock === 0 ? 'text-red-600' : '')}>
						{product.qtyInStock}
					</span>
				</p>
				<p className="tabular-nums">size: {product.size?.name ?? '-'}</p>
				<p>
					color:{' '}
					<span
						className={cn(
							'tabular-nums',
							product.color && product.color.name.toLowerCase() === 'mixed'
								? 'bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-blue-600 to-green-700'
								: ''
						)}
						style={generateColorStyle(product.color)}
					>
						{product.color?.name ?? '-'}
					</span>
				</p>
			</span>
		),
		category: product.category?.name ?? '-',
		price: <span className="tabular-nums">{moneyFormat(product.price)}</span>,
		createdAt: format(new Date(product.createdAt), 'P p'),
		action: (
			<div className="flex gap-1">
				<Button as="link" href={`/product/${product._id}`} variant="white" size="small">
					View
				</Button>
				<Button as="link" href={`/admin/products/edit/${product._id}`} variant="primary" size="small">
					Edit
				</Button>
				<Button onClick={() => showConfirmation(product._id)} variant="danger" size="small">
					Delete
				</Button>
			</div>
		)
	}));

	function generateColorStyle(color?: Color) {
		const style: { color?: string; backgroundColor?: string; textShadow?: string } = {};
		if (!color) return style;
		if (color.name.toLowerCase() !== 'mixed') {
			style.color = color.name;
		}
		if (['yellow', 'white'].includes(color.name.toLowerCase())) {
			style.textShadow = '1px 1px #000';
			style.color = color.name;
		}
		return style;
	}

	async function getPaginateProducts() {
		const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

		const { items, paginateData } = await ProductService.getProducts({
			onlyHasStock: false,
			page,
			limit: PRODUCT_LIMIT
		});

		setProducts(items);
		setPaginateData(paginateData);
	}

	async function addVariant(product: Product) {
		try {
			const { variantId } = await ProductService.addVariant(product._id);
			const searchParams = new URLSearchParams({
				variantId,
				name: product.name,
				category: product.category._id,
				description: product.description,
				price: product.price.toString(),
				coverURL: product.coverURL
			});
			navigate('/admin/products/new?' + searchParams.toString());
		} catch (errors) {
			(errors as APIError).items.forEach(item => toast.error(item.message));
		}
	}

	async function deleteProduct() {
		if (!selectedProductId) return;
		try {
			setDeleting(true);
			await ProductService.deleteProduct(selectedProductId);
			setProducts(prev => prev.filter(item => item._id !== selectedProductId));
			toast.success('Product deleted successfully');
			await CartService.removeCartItemByProductId(selectedProductId);
		} catch (errors) {
			(errors as APIError).items.forEach(item => toast.error(item.message));
		} finally {
			setDeleting(false);
			closeConfirmation();
		}
	}
	function showConfirmation(id: string) {
		setSelectedProductId(id);
		setConfirmationIsOpen(true);
	}
	function closeConfirmation() {
		setConfirmationIsOpen(false);
	}

	return (
		<AdminLayout title="All Products">
			<>
				<ConfirmModal
					confirmText="Are you sure you want to delete this product?"
					isOpen={confirmationIsOpen}
					close={closeConfirmation}
					loading={deleting}
					onConfirm={deleteProduct}
				/>
				<div className="space-y-2 px-4 sm:p-0">
					{products.length > 0 ? (
						<>
							<div className="flex justify-end">
								<Button
									as="link"
									href="/admin/products/new"
									className="flex gap-1"
									size="small"
									variant="secondary"
								>
									<FaPlus size={10} />
									Add a new product
								</Button>
							</div>
							<Table cols={cols} rows={rows} />
							<Pagination paginateData={paginateData} onPageChange={getPaginateProducts} />
						</>
					) : (
						<div className="flex flex-col justify-center items-center gap-4">
							<p className="text-center font-bold text-2xl">You haven't added any products yet</p>
							<Button as="link" href="/admin/products/new" className="flex gap-1" variant="secondary">
								<FaPlus size={10} />
								Add a new product
							</Button>
						</div>
					)}
				</div>
			</>
		</AdminLayout>
	);
}
