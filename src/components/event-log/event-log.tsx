import classNames from 'classnames';
import { Loader2, Check, X, AudioLines, Volume2 } from 'lucide-react';

import { useAudioPlayer } from '~/hooks/use-audio-player';
import type { tabzeroToolAction } from '~/hooks/use-tool-resolver/lib/types';

import { Button } from '../button';
import styles from './event-log.module.css';

export type EventLogProps = {
	date?: string;
	text: string;
	tools?: tabzeroToolAction['tools'];
	isLoading?: boolean;
};

export const EventLog = ({ date, text, tools, isLoading }: EventLogProps) => {
	const { speak, audioState } = useAudioPlayer();

	return (
		<div className="flex flex-col gap-4 border-b pb-4">
			<div className="flex flex-col">
				{date ? <p className="text-xs opacity-50">{date}</p> : null}
				<p className="text-sm">{isLoading ? text : `"${text}"`}</p>
			</div>

			{tools?.length ? (
				<div className="flex flex-wrap gap-2 overflow-auto">
					{tools.map((tool) => {
						const toolAudioState = tool.tts
							? audioState?.[tool.tts]
							: undefined;

						return (
							<div
								key={tool.id}
								className={classNames(
									'flex shrink-0 items-center gap-3 rounded-xl border px-3 py-2',
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
									<Button
										onClick={() => speak({ text: tool.tts! })}
										size="small"
										variant={
											typeof toolAudioState === 'undefined'
												? 'secondary'
												: 'primary'
										}
										className="relative overflow-hidden"
										disabled={toolAudioState === 0}
									>
										{toolAudioState ? (
											<span
												className={classNames(
													'bg-foreground absolute top-0 left-0 h-full',
													styles.buttonProgress,
												)}
												style={{
													animationDuration: `${toolAudioState}s`,
												}}
											></span>
										) : null}
										{typeof toolAudioState === 'undefined' ? (
											<AudioLines className="h-4 w-4"></AudioLines>
										) : toolAudioState === 0 ? (
											<Loader2 className="h-4 w-4 animate-spin"></Loader2>
										) : (
											<>
												<Volume2 className="h-4 w-4"></Volume2>
												<p className="text-xs">{Math.floor(toolAudioState)}s</p>
											</>
										)}
									</Button>
								) : null}
							</div>
						);
					})}
				</div>
			) : !isLoading ? (
				<div className="-mt-2 text-xs opacity-50">No tools used</div>
			) : null}
		</div>
	);
};
