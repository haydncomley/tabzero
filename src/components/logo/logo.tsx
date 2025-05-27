import classNames from 'classnames';

export type LogoProps = {
	className?: string;
	variant?: 'on-brand' | 'brand';
};

export const Logo = ({ className, variant }: LogoProps) => (
	<svg
		className={className}
		width="256"
		height="256"
		viewBox="0 0 256 256"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clipPath="url(#clip0_2_35)">
			<g
				opacity="0.95"
				clipPath="url(#clip1_2_35)"
			>
				<path
					d="M141.294 98.7235L-8.62576 98.7236C-17.633 98.7236 -24.9349 106.025 -24.9349 115.033C-24.9349 123.347 -18.7132 130.208 -10.6716 131.215L-8.62577 131.342L101.923 131.339L-25.9243 259.186C-31.8384 265.101 -32.2609 274.427 -27.1916 280.829L-25.9243 282.251C-20.0101 288.165 -10.6838 288.588 -4.28216 283.518L-2.85965 282.251L124.987 154.404L124.985 264.953C124.985 273.267 131.207 280.128 139.248 281.135L141.294 281.262C149.609 281.262 156.47 275.04 157.476 266.998L157.603 264.953L157.603 115.033C157.603 106.718 151.382 99.857 143.34 98.8506L141.294 98.7235ZM250.498 155.749L100.578 5.82888C94.2089 -0.540235 83.8826 -0.540256 77.5134 5.82886C71.1443 12.198 71.1443 22.5244 77.5134 28.8935L227.433 178.813C233.802 185.182 244.129 185.182 250.498 178.813C256.867 172.444 256.867 162.118 250.498 155.749Z"
					fill={classNames({
						'var(--color-foreground)': !variant,
						'var(--color-brand-foreground)': variant === 'on-brand',
						'var(--color-brand)': variant === 'brand',
					})}
				/>
			</g>
		</g>
		<defs>
			<clipPath id="clip0_2_35">
				<rect
					width="256"
					height="256"
					fill="white"
				/>
			</clipPath>
			<clipPath id="clip1_2_35">
				<rect
					width="391.419"
					height="391.419"
					fill="white"
					transform="translate(-186 168.775) rotate(-45)"
				/>
			</clipPath>
		</defs>
	</svg>
);
