'use client';

import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import { useSetting } from '~/hooks/use-setting';

type Dot = {
	x: number;
	y: number;
	size: number;
	opacity: number;
	targetSize: number;
	targetOpacity: number;
	isHovered: boolean;
	offsetX: number;
	offsetY: number;
	targetOffsetX: number;
	targetOffsetY: number;
};

export const DotMatrix = ({
	className,
	ignoreMouse,
}: {
	className?: string;
	ignoreMouse?: boolean;
}) => {
	const [darkMode] = useSetting('darkMode');
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dotsRef = useRef<Dot[]>([]);
	const mouseRef = useRef({ x: 0, y: 0 });
	const animationRef = useRef<number>();
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

	// Configuration
	const DOT_SPACING = 10;
	const BASE_DOT_SIZE = 1;
	const HOVER_DOT_SIZE = 2;
	const HOVER_DISTANCE = 200;
	const BASE_OPACITY = darkMode ? 0.05 : 0.2;
	const HOVER_OPACITY = 0.5;
	const ANIMATION_SPEED = 0.1;
	const PULL_STRENGTH = 5;
	const FALLOFF_CURVE = 0.5; // Controls how gradual the falloff is (higher = more gradual)
	const SWEEP_SPEED = 0.002; // Controls the speed of the pulsing animation

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const updateCanvasSize = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;

			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;

			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.scale(dpr, dpr);
			}

			setCanvasSize({ width: rect.width, height: rect.height });
		};

		updateCanvasSize();
		window.addEventListener('resize', updateCanvasSize);

		return () => {
			window.removeEventListener('resize', updateCanvasSize);
		};
	}, [darkMode]);

	// Initialize dots when canvas size changes
	useEffect(() => {
		if (canvasSize.width === 0 || canvasSize.height === 0) return;

		const dots: Dot[] = [];
		const cols = Math.ceil(canvasSize.width / DOT_SPACING) + 1;
		const rows = Math.ceil(canvasSize.height / DOT_SPACING) + 1;

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				dots.push({
					x: col * DOT_SPACING,
					y: row * DOT_SPACING,
					size: BASE_DOT_SIZE,
					opacity: BASE_OPACITY,
					targetSize: BASE_DOT_SIZE,
					targetOpacity: BASE_OPACITY,
					isHovered: false,
					offsetX: 0,
					offsetY: 0,
					targetOffsetX: 0,
					targetOffsetY: 0,
				});
			}
		}

		dotsRef.current = dots;
	}, [canvasSize, darkMode]);

	// Mouse move handler
	useEffect(() => {
		if (ignoreMouse) return;

		const handleMouseMove = (e: MouseEvent) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			mouseRef.current = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			};
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, [ignoreMouse]);

	// Animation loop
	useEffect(() => {
		const animate = () => {
			const canvas = canvasRef.current;
			const ctx = canvas?.getContext('2d');
			if (!canvas || !ctx || dotsRef.current.length === 0) {
				animationRef.current = requestAnimationFrame(animate);
				return;
			}

			// Clear canvas
			ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

			const mouse = mouseRef.current;

			dotsRef.current.forEach((dot) => {
				// Calculate distance from mouse
				const dx = mouse.x - dot.x;
				const dy = mouse.y - dot.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				// Update target values based on mouse proximity
				if (distance < HOVER_DISTANCE && !ignoreMouse) {
					dot.isHovered = true;

					// Calculate gradual falloff with curve control
					const baseFalloff = Math.max(
						0,
						(HOVER_DISTANCE - distance) / HOVER_DISTANCE,
					);
					const falloffFactor = Math.pow(baseFalloff, 1 / FALLOFF_CURVE);

					// Interpolate size and opacity based on falloff
					dot.targetSize =
						BASE_DOT_SIZE + (HOVER_DOT_SIZE - BASE_DOT_SIZE) * falloffFactor;
					dot.targetOpacity =
						BASE_OPACITY + (HOVER_OPACITY - BASE_OPACITY) * falloffFactor;

					// Calculate pull towards mouse
					dot.targetOffsetX = (dx / distance) * PULL_STRENGTH * falloffFactor;
					dot.targetOffsetY = (dy / distance) * PULL_STRENGTH * falloffFactor;
				} else {
					dot.isHovered = false;
					dot.targetSize = BASE_DOT_SIZE;
					dot.targetOpacity = BASE_OPACITY;
					dot.targetOffsetX = 0;
					dot.targetOffsetY = 0;
				}

				// Animate towards target values
				dot.size += (dot.targetSize - dot.size) * ANIMATION_SPEED;
				dot.opacity += (dot.targetOpacity - dot.opacity) * ANIMATION_SPEED;
				dot.offsetX += (dot.targetOffsetX - dot.offsetX) * ANIMATION_SPEED;
				dot.offsetY += (dot.targetOffsetY - dot.offsetY) * ANIMATION_SPEED;

				// Add subtle pulsing animation for non-hovered dots
				let pulseOffset = 0;
				if (!dot.isHovered) {
					const time = Date.now() * SWEEP_SPEED;
					const phase = (dot.x + dot.y) * 0.01; // Different phase for each dot
					pulseOffset = Math.sin(time + phase) * 0.1;
				}

				// Draw dot
				const finalX = dot.x + dot.offsetX;
				const finalY = dot.y + dot.offsetY;
				const finalOpacity = Math.max(
					0,
					Math.min(1, dot.opacity + pulseOffset),
				);

				ctx.fillStyle = dot.isHovered
					? `rgba(96, 109, 255, ${finalOpacity})` // Brand color
					: `rgba(${darkMode ? '250, 250, 250' : '96, 109, 255'}, ${finalOpacity})`; // Foreground color

				// ctx.fillStyle = dot.isHovered
				// ? `rgba('250, 250, 250', ${finalOpacity})` // Brand color
				// : `rgba(${darkMode ? '250, 250, 250' : '96, 109, 255'}, ${finalOpacity})`; // Foreground color

				ctx.beginPath();
				ctx.arc(finalX, finalY, dot.size, 0, Math.PI * 2);
				ctx.fill();
			});

			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [canvasSize, darkMode]);

	return (
		<canvas
			ref={canvasRef}
			className={classNames(
				'pointer-events-none absolute inset-0 z-0 h-full w-full',
				className,
			)}
			style={{ width: '100%', height: '100%' }}
		/>
	);
};
