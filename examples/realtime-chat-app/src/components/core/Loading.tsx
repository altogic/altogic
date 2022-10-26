export default function Loading({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			width="100px"
			height="100px"
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid"
			className={className}
		>
			<circle
				cx="50"
				cy="50"
				r="32"
				strokeWidth="8"
				stroke="currentColor"
				strokeDasharray="50.26548245743669 50.26548245743669"
				fill="none"
				strokeLinecap="round"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					repeatCount="indefinite"
					dur="1s"
					keyTimes="0;1"
					values="0 50 50;360 50 50"
				/>
			</circle>
		</svg>
	);
}
