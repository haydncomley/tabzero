import { useAuth } from '~/hooks/use-auth';

export default function Page() {
	const { details } = useAuth();

	return (
		<main className="items-center justify-center">
			Welcome home {details?.display_name}
			<img
				className="h-15 w-15"
				src={details?.profile_image}
				alt=""
			/>
		</main>
	);
}
