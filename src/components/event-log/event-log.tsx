import classNames from 'classnames';
import { Loader2, Check, X, AudioLines } from 'lucide-react';

import { useAudioPlayer } from '~/hooks/use-audio-player';
import type { tabzeroToolAction } from '~/hooks/use-tool-resolver/lib/types';

export type EventLogProps = {
	date?: string;
	text: string;
	tools?: tabzeroToolAction['tools'];
};

export const EventLog = ({ date, text, tools }: EventLogProps) => {
	const { speak } = useAudioPlayer();

	return (
		<div className="flex flex-col gap-4 border-b pb-4">
			<div className="flex flex-col">
				{date ? <p className="text-xs opacity-50">{date}</p> : null}
				<p className="text-sm">{text}</p>
			</div>

			{tools?.length ? (
				<div className="flex flex-wrap gap-2 overflow-auto">
					{tools.map((tool) => (
						<div
							key={tool.id}
							className={classNames(
								'flex shrink-0 items-center gap-3 rounded-xl px-3 py-2',
								{
									'bg-outline/25': tool.status !== 'pending',
									'bg-brand/25': tool.status === 'pending',
								},
							)}
						>
							{tool.status === 'pending' ? (
								<Loader2 className="h-5 w-5 animate-spin"></Loader2>
							) : tool.status === 'success' ? (
								<Check className="h-5 w-5"></Check>
							) : (
								<X className="h-5 w-5"></X>
							)}
							<div className="flex flex-col">
								<p className="text-xs font-semibold">{tool.name}</p>
								<p
									className="max-w-64 overflow-hidden text-xs overflow-ellipsis whitespace-nowrap opacity-50"
									title={tool.context}
								>
									{tool.context}
								</p>
							</div>
							{tool.tts ? (
								<button
									className="bg-brand border-brand-glint text-brand-foreground hover:bg-brand-glint cursor-pointer rounded-full border p-2 transition-all duration-75"
									onClick={() => speak({ text: tool.tts! })}
								>
									<AudioLines className="h-4 w-4"></AudioLines>
								</button>
							) : null}
						</div>
					))}
				</div>
			) : null}
		</div>
	);
};
