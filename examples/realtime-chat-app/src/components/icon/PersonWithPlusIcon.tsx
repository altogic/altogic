export default function PersonWithPlusIcon({ ...props }) {
	return (
		<svg
			viewBox="0 0 24 24"
			height="24"
			width="24"
			preserveAspectRatio="xMidYMid meet"
			version="1.1"
			x="0px"
			y="0px"
			enableBackground="new 0 0 24 24"
			xmlSpace="preserve"
			{...props}
		>
			<path
				fill="currentColor"
				d="M14.7,12c2,0,3.6-1.6,3.6-3.6s-1.6-3.6-3.6-3.6s-3.6,1.6-3.6,3.6S12.7,12,14.7,12z  M6.6,10.2V7.5H4.8v2.7H2.1V12h2.7v2.7h1.8V12h2.7v-1.8H6.6z M14.7,13.8c-2.4,0-7.2,1.2-7.2,3.6v1.8H22v-1.8 C21.9,15,17.1,13.8,14.7,13.8z"
			/>
		</svg>
	);
}
