export default function ScreenLoader() {
	return (
		<div className="fixed inset-0 z-[99999] flex items-center justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" height="128px" width="128px" viewBox="0 0 128 128" className="pl">
				<defs>
					<linearGradient y2="1" x2="0" y1="0" x1="0" id="pl-grad">
						<stop stopColor="hsl(193,90%,55%)" offset="0%"></stop>
						<stop stopColor="hsl(223,90%,55%)" offset="100%"></stop>
					</linearGradient>
				</defs>
				<circle
					strokeLinecap="round"
					strokeWidth="16"
					stroke="hsla(0,10%,10%,0.1)"
					fill="none"
					cy="64"
					cx="64"
					r="56"
					className="pl__ring"
				/>
				<path
					strokeDashoffset="10"
					strokeDasharray="44 1111"
					strokeLinejoin="round"
					strokeLinecap="round"
					strokeWidth="16"
					stroke="url(#pl-grad)"
					fill="none"
					d="M92,15.492S78.194,4.967,66.743,16.887c-17.231,17.938-28.26,96.974-28.26,96.974L119.85,59.892l-99-31.588,57.528,89.832L97.8,19.349,13.636,88.51l89.012,16.015S81.908,38.332,66.1,22.337C50.114,6.156,36,15.492,36,15.492a56,56,0,1,0,56,0Z"
					className="pl__worm"
				/>
			</svg>
		</div>
	);
}
