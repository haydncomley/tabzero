import classNames from 'classnames';

export type LogoProps = {
	className?: string;
	variant?: 'on-brand' | 'brand';
};

export const Logo = ({ className, variant }: LogoProps) => (
	<svg
		width="256"
		height="256"
		viewBox="0 0 256 256"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<g clipPath="url(#clip0_39_172)">
			<g
				opacity="0.95"
				clipPath="url(#clip1_39_172)"
			>
				<path
					d="M64.0836 19.2799C73.8355 9.52802 89.647 9.52804 99.3988 19.2799L237.02 156.901C246.772 166.653 246.772 182.465 237.02 192.217C227.268 201.968 211.457 201.968 201.706 192.216L154.675 145.185V264.529L154.655 264.838L154.539 266.716L154.519 267.028L154.481 267.338C152.938 279.661 142.441 289.189 129.704 289.189L129.394 289.19L129.084 289.17L127.205 289.054L126.895 289.034L126.584 288.996C114.261 287.453 104.733 276.956 104.733 264.218L104.734 186.881L4.24189 287.373L4.02714 287.564L2.72134 288.728L2.50451 288.921L2.27663 289.101C-7.5333 296.869 -21.8088 296.229 -30.869 287.168L-31.0727 286.965L-31.264 286.75L-32.4275 285.444L-32.6209 285.227L-32.8004 284.999C-40.5686 275.19 -39.9286 260.914 -30.8683 251.854L69.4193 151.566L-7.91772 151.568H-8.22846L-8.53782 151.548L-10.4161 151.432L-10.7275 151.412L-11.0382 151.374C-23.3611 149.831 -32.8895 139.334 -32.8895 126.596C-32.8892 112.805 -21.7093 101.625 -7.91841 101.625H111.114L64.0842 54.5945C54.3325 44.8427 54.332 29.0318 64.0836 19.2799Z"
					fill={classNames({
						'var(--color-background)': !variant || variant === 'on-brand',
						'var(--color-brand-foreground)': variant === 'brand',
					})}
					stroke={classNames({
						'var(--color-foreground)': !variant,
						'var(--color-brand-foreground)': variant === 'on-brand',
						'var(--color-brand-glint)': variant === 'brand',
					})}
					strokeWidth="20"
				/>
			</g>
		</g>
		<defs>
			<clipPath id="clip0_39_172">
				<rect
					width="256"
					height="256"
					fill="white"
				/>
			</clipPath>
			<clipPath id="clip1_39_172">
				<rect
					width="359.311"
					height="359.311"
					fill="white"
					transform="translate(-170.742 175.93) rotate(-45)"
				/>
			</clipPath>
		</defs>
	</svg>

	// <svg
	// 	className={className}
	// 	width="256"
	// 	height="256"
	// 	viewBox="0 0 256 256"
	// 	fill="none"
	// 	xmlns="http://www.w3.org/2000/svg"
	// >
	// 	<g clipPath="url(#clip0_2_35)">
	// 		<g
	// 			opacity="0.95"
	// 			clipPath="url(#clip1_2_35)"
	// 		>
	// 			<path
	// 				d="M141.294 98.7235L-8.62576 98.7236C-17.633 98.7236 -24.9349 106.025 -24.9349 115.033C-24.9349 123.347 -18.7132 130.208 -10.6716 131.215L-8.62577 131.342L101.923 131.339L-25.9243 259.186C-31.8384 265.101 -32.2609 274.427 -27.1916 280.829L-25.9243 282.251C-20.0101 288.165 -10.6838 288.588 -4.28216 283.518L-2.85965 282.251L124.987 154.404L124.985 264.953C124.985 273.267 131.207 280.128 139.248 281.135L141.294 281.262C149.609 281.262 156.47 275.04 157.476 266.998L157.603 264.953L157.603 115.033C157.603 106.718 151.382 99.857 143.34 98.8506L141.294 98.7235ZM250.498 155.749L100.578 5.82888C94.2089 -0.540235 83.8826 -0.540256 77.5134 5.82886C71.1443 12.198 71.1443 22.5244 77.5134 28.8935L227.433 178.813C233.802 185.182 244.129 185.182 250.498 178.813C256.867 172.444 256.867 162.118 250.498 155.749Z"
	// 				fill={classNames({
	// 					'var(--color-foreground)': !variant,
	// 					'var(--color-brand-foreground)': variant === 'on-brand',
	// 					'var(--color-brand)': variant === 'brand',
	// 				})}
	// 			/>
	// 		</g>
	// 	</g>
	// 	<defs>
	// 		<clipPath id="clip0_2_35">
	// 			<rect
	// 				width="256"
	// 				height="256"
	// 				fill="white"
	// 			/>
	// 		</clipPath>
	// 		<clipPath id="clip1_2_35">
	// 			<rect
	// 				width="391.419"
	// 				height="391.419"
	// 				fill="white"
	// 				transform="translate(-186 168.775) rotate(-45)"
	// 			/>
	// 		</clipPath>
	// 	</defs>
	// </svg>
);
