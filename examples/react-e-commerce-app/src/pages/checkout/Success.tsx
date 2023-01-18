import { Player } from '@lottiefiles/react-lottie-player';
import Button from '../../components/ui/Button';

export default function Success() {
	return (
		<section>
			<Player loop autoplay src="/checkmark.json" style={{ height: '300px', width: '300px' }} />
			<div className="text-center text-lg md:text-2xl space-y-4 px-4">
				<p>
					Your order has been received <br /> & <br /> We've already started preparing your order.
				</p>
				<Button variant="white" as="link" href="/profile/orders">
					View my orders
				</Button>
			</div>
		</section>
	);
}
