import { useEffect, useRef } from 'react';

import { useAuth } from '~/hooks/use-auth';

export const Referral = ({
	className,
	onDownloadLink,
}: {
	className?: string;
	onDownloadLink?: (link: string) => void;
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const { details } = useAuth();

	useEffect(() => {
		if (!svgRef.current || !onDownloadLink) return;

		const svg = svgRef.current;
		const svgData = new XMLSerializer().serializeToString(svg);
		const svgBlob = new Blob([svgData], {
			type: 'image/svg+xml;charset=utf-8',
		});
		const url = URL.createObjectURL(svgBlob);

		const image = new Image();
		image.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = 640;
			canvas.height = 300;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.drawImage(image, 0, 0);

			canvas.toBlob((blob) => {
				if (blob) {
					const pngUrl = URL.createObjectURL(blob);
					onDownloadLink?.(pngUrl);

					// Optional cleanup
					URL.revokeObjectURL(url);
				}
			}, 'image/png');
		};

		image.src = url;
	}, [!!svgRef.current, details?.user_name]);

	return (
		<svg
			ref={svgRef}
			width="640"
			height="300"
			viewBox="0 0 640 300"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<g clipPath="url(#clip0_36_180)">
				<rect
					width="640"
					height="300"
					rx="30"
					fill="#606DFF"
				/>
				<rect
					width="203"
					height="203"
					transform="matrix(-4.37114e-08 1 1 4.37114e-08 437 0)"
					fill="#606DFF"
				/>
				<g
					opacity="0.95"
					clipPath="url(#clip1_36_180)"
				>
					<path
						d="M433.001 54.8746C424.006 63.8697 424.006 78.4539 433.001 87.4491L552.812 207.26C561.807 216.255 576.391 216.255 585.386 207.26C594.381 198.264 594.381 183.681 585.386 174.686L546.652 135.951L647.465 135.951L647.775 135.932L649.409 135.83L649.721 135.811L650.031 135.771C661.399 134.349 670.188 124.667 670.188 112.917L670.188 112.607L670.169 112.297L670.068 110.662L670.048 110.351L670.009 110.04C668.586 98.6726 658.905 89.884 647.155 89.884L647.154 89.8833L582.951 89.8846L668.254 4.58162L668.445 4.36686L669.458 3.22955L669.651 3.01341L669.831 2.78623C676.997 -6.26306 676.408 -19.4309 668.05 -27.7885L667.846 -27.9929L667.631 -28.1842L666.494 -29.1972L666.278 -29.3899L666.05 -29.5701C657.001 -36.736 643.833 -36.1466 635.476 -27.7892L550.376 57.3101L550.378 -6.89299L550.378 -7.20373L550.358 -7.51309L550.258 -9.14827L550.238 -9.45971L550.199 -9.77045C548.776 -21.1379 539.094 -29.9271 527.344 -29.9271C514.623 -29.9269 504.31 -19.6146 504.31 -6.89368L504.31 93.6094L465.575 54.8746C456.58 45.8798 441.997 45.8797 433.001 54.8746Z"
						fill="#FAFAFA"
						stroke="#939CFF"
						strokeWidth="20"
					/>
				</g>
				<text
					fill="white"
					xmlSpace="preserve"
					style={{ whiteSpace: 'pre' }}
					fontFamily="Reddit Sans"
					fontSize="58"
					fontWeight="bold"
					letterSpacing="0em"
				>
					<tspan
						x="50"
						y="87.4004"
					>
						tabzero.gg
					</tspan>
				</text>
				<text
					fill="white"
					xmlSpace="preserve"
					style={{ whiteSpace: 'pre' }}
					fontFamily="Reddit Sans"
					fontSize="24"
					letterSpacing="0em"
				>
					<tspan
						x="50"
						y="126.148"
					>
						AI Stream Assistant
					</tspan>
					<tspan
						x="50"
						y="157.148"
					>
						Never tab out again
					</tspan>
				</text>
				<rect
					x="50.5"
					y="179.5"
					width="400"
					height="44"
					rx="9.5"
					fill="#20201A"
				/>
				<rect
					x="50.5"
					y="179.5"
					width="400"
					height="44"
					rx="9.5"
					stroke="#3D3D3D"
				/>
				<path
					d="M84.25 203C85.3675 201.905 86.5 200.592 86.5 198.875C86.5 197.781 86.0654 196.732 85.2918 195.958C84.5182 195.185 83.469 194.75 82.375 194.75C81.055 194.75 80.125 195.125 79 196.25C77.875 195.125 76.945 194.75 75.625 194.75C74.531 194.75 73.4818 195.185 72.7082 195.958C71.9346 196.732 71.5 197.781 71.5 198.875C71.5 200.6 72.625 201.912 73.75 203L79 208.25L84.25 203Z"
					stroke="#FAFAFA"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<text
					fill="#FAFAFA"
					xmlSpace="preserve"
					style={{ whiteSpace: 'pre' }}
					fontFamily="Reddit Sans"
					fontSize="20"
					fontWeight="600"
					letterSpacing="0em"
				>
					<tspan
						x="103"
						y="208.707"
					>
						Download Now - First Month Free 🎉
					</tspan>
				</text>
				{details?.user_name ? (
					<text
						fill="white"
						xmlSpace="preserve"
						style={{ whiteSpace: 'pre' }}
						fontFamily="Reddit Sans"
						fontSize="20"
						fontWeight="bold"
						letterSpacing="0em"
					>
						<tspan
							x="50"
							y="259.207"
						>
							Referred by @{details?.user_name}
						</tspan>
					</text>
				) : null}
			</g>
			<defs>
				<clipPath id="clip0_36_180">
					<rect
						width="640"
						height="300"
						rx="30"
						fill="white"
					/>
				</clipPath>
				<clipPath id="clip1_36_180">
					<rect
						width="312.808"
						height="312.808"
						fill="white"
						transform="matrix(-0.707107 0.707107 0.707107 0.707107 570.293 -148.644)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
};
