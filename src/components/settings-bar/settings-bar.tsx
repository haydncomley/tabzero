import { ChevronsUpDown, Ellipsis } from 'lucide-react';
import { useMemo } from 'react';

import { useSpeechToText } from '~/hooks/use-speech-to-text';

export const SettingsBar = () => {
	const { state } = useSpeechToText({ hotkey: 'toggleRecording' });

	const status = useMemo(() => {
		if (state === 'idle') return 'Idle';
		if (state === 'recording') return 'Listening...';
		if (state === 'transcribing') return 'Transcribing...';
		if (state === 'done') return 'Idle';
	}, [state]);

	return (
		<div className="bg-outline flex w-full flex-wrap items-center gap-4 border-b p-3">
			<div className="flex items-center gap-4">
				<div>
					<p className="text-xs opacity-50">Microphone</p>
					<p className="text-sm font-medium">
						Default - Microphone (USB PnP Sound Device)
					</p>
				</div>
				<ChevronsUpDown className="h-4 w-4"></ChevronsUpDown>
			</div>

			<div className="flex items-center gap-4">
				<div>
					<p className="text-xs opacity-50">Hotkey</p>
					<p className="text-sm font-medium">Command or Control + Shift + B</p>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-end gap-4">
				<div className="flex items-center gap-4 opacity-50">
					<p className="text-sm font-medium">{status}</p>
					<Ellipsis></Ellipsis>
				</div>
			</div>
		</div>
	);
};
