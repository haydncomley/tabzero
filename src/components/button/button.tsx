import classNames from 'classnames';
import { Loader2 } from 'lucide-react';

type ButtonProps = {
	loading?: boolean;
	variant?: 'twitch';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
	className,
	loading,
	variant,
	children,
	...props
}: ButtonProps) => (
	<button
		{...props}
		className={classNames(
			className,
			'relative flex items-center justify-center gap-2 rounded-2xl border p-2 px-5 font-medium transition-all duration-150 hover:cursor-pointer',
			{
				'bg-brand border-brand-glint': !variant,
				'bg-twitch border-twitch-glint': variant === 'twitch',
				'text-brand-foreground/0': loading,
			},
		)}
	>
		{children}
		{loading && (
			<Loader2 className="text-brand-foreground absolute animate-spin" />
		)}
	</button>
);
