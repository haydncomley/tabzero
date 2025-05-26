import classNames from 'classnames';
import { Loader2 } from 'lucide-react';

type ButtonProps = {
	loading?: boolean;
	variant?: 'primary' | 'secondary' | 'tertiary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
	className,
	loading,
	variant = 'primary',
	children,
	...props
}: ButtonProps) => (
	<button
		{...props}
		className={classNames(
			className,
			'relative flex items-center justify-center gap-3 rounded-lg border p-2.5 px-4 text-sm transition-all duration-75 hover:cursor-pointer',
			{
				'bg-brand border-brand-glint text-brand-foreground hover:bg-brand-glint':
					variant === 'primary',
				'bg-background border-outline text-foreground hover:bg-outline':
					variant === 'secondary',
				'bg-background border-brand text-brand hover:bg-outline':
					variant === 'tertiary',
				'!text-brand-foreground/0': loading,
			},
		)}
	>
		{children}
		{loading && (
			<Loader2
				className={classNames('absolute animate-spin text-inherit', {
					'!text-brand-foreground': variant === 'primary',
					'!text-foreground': variant === 'secondary',
				})}
			/>
		)}
	</button>
);
