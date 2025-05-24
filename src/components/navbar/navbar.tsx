import { LogOut } from 'lucide-react';

import { useAuth } from '~/hooks/use-auth';

import { version } from '../../../package.json';

export const Navbar = () => {
	const { details, logout } = useAuth();

	return (
		<nav className="flex w-full items-center justify-between border-b p-2">
			<div className="ml-2 flex flex-col">
				<h1 className="text-lg font-bold">tabzero</h1>
				<p className="-mt-1 text-xs opacity-50">v{version}a</p>
			</div>

			<div>
				<button
					title="Logout"
					onClick={() => logout()}
					className="group flex h-10 w-10 items-center justify-center overflow-hidden rounded-md hover:cursor-pointer"
				>
					<img
						src={details?.profile_image}
						alt={details?.display_name}
						className="transition-all duration-100 group-hover:opacity-75 group-hover:blur-xs"
					/>
					<span className="absolute opacity-0 transition-all duration-100 group-hover:opacity-100">
						<LogOut className="h-4 w-4" />
					</span>
				</button>
			</div>
		</nav>
	);
};
