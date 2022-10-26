import { WelcomeIcon } from '../components/icon';

export default function ChatWelcome() {
	return (
		<section className="flex h-full select-none flex-col items-center justify-center gap-5 border-b-[6px] border-l border-border-stronger-light border-b-intro-border-light bg-intro-background-light p-4 dark:border-border-stronger-dark dark:border-b-intro-border-dark dark:bg-intro-background-dark">
			<WelcomeIcon className="max-w-full" />
			<h1 className="text-center text-[32px] text-primary-title-light dark:text-primary-title-dark">
				WhatsApp Web
			</h1>
			<p className="text-center text-intro-secondary-light dark:text-intro-secondary-dark">
				Send and receive messages without keeping your phone online. <br />
				Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
			</p>
		</section>
	);
}
