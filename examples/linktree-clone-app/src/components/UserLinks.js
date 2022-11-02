import LinkItem from './LinkItem';

export default function UserLinks({ links, className, props }) {
	return (
		<section className={`flex flex-col gap-4  ${className ?? ''}`} {...props}>
			{links.map(link => (
				<LinkItem data={link} key={link._id} />
			))}
		</section>
	);
}
