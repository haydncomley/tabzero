import classNames from 'classnames';
import { Loader2 } from 'lucide-react';

type ButtonProps = {
	loading?: boolean;
	variant?: 'primary' | 'secondary' | 'tertiary';
	size?: 'regular' | 'small';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
	className,
	loading,
	variant = 'primary',
	size = 'regular',
	children,
	...props
}: ButtonProps) => (
	<button
		{...props}
		className={classNames(
			className,
			'relative flex items-center justify-center border text-sm transition-all duration-75 select-none hover:cursor-pointer',
			{
				'gap-3 rounded-lg p-2.5 px-4': size === 'regular',
				'gap-2 rounded-full p-2 px-2': size === 'small',
				'bg-brand border-brand-glint text-brand-foreground hover:bg-brand-glint':
					variant === 'primary',
				'bg-background border-outline text-foreground hover:bg-outline hover:border-background':
					variant === 'secondary',
				'bg-background border-brand text-brand hover:bg-outline':
					variant === 'tertiary',
				'!text-brand-foreground/0': loading,
				'pointer-events-none opacity-50': props.disabled,
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
