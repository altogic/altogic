import altogicLogo from '../../assets/img/altogic-powered.svg';

export default function PoweredByAltogic() {
	return (
		<a
			target="_blank"
			href="https://www.altogic.com"
			rel="noreferrer"
			className="fixed bottom-2 right-2 z-50 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent bg-[#3b81f6] px-2 py-2 text-xs text-white shadow-xl"
		>
			<img className="h-5" src={altogicLogo} alt="" />
			<span className="text-slate-100">
				Powered by <strong>Altogic</strong>
			</span>
		</a>
	);
}
