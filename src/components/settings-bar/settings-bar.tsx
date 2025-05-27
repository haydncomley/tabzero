import classNames from 'classnames';
import { ChevronsUpDown } from 'lucide-react';

import { useHotkey } from '~/hooks/use-hotkey';
import { useRecorder } from '~/hooks/use-recorder';
import { useSetting } from '~/hooks/use-setting';

const hotkeyToString = (hotkey: string | null) =>
	hotkey
		?.replace(/([A-Z])/g, ' $1')
		.replace(/\+/g, ' + ')
		.trim();

const stringToHotkey = (hotkey: string) => hotkey.replace(/ /g, '');

export const SettingsBar = () => {
	const [deviceId, setDeviceId] = useSetting('deviceId');
	const { keys, rebindSuccess, remap } = useHotkey('toggleRecording');
	const { devices } = useRecorder();

	return (
		<div className="bg-outline flex w-full items-center gap-4 border-b p-3">
			<div className="flex max-w-[25rem] basis-1/2 items-center gap-4 overflow-hidden">
				<div className="flex w-full flex-col overflow-hidden">
					<label className="text-xs opacity-50">Microphone</label>
					<select
						value={deviceId}
						className="m-0 appearance-none p-0 text-sm font-semibold"
						onChange={(e) => setDeviceId(e.target.value)}
					>
						{devices.map((device) => (
							<option
								className="bg-background text-foreground"
								key={device.deviceId}
								value={device.deviceId}
							>
								{device.label}
							</option>
						))}
					</select>
				</div>
				<ChevronsUpDown className="h-4 w-4 shrink-0"></ChevronsUpDown>
			</div>

			<div className="flex max-w-[25rem] basis-1/2 items-center gap-4">
				<div className="w-full">
					<p className="text-xs opacity-50">Hotkey</p>
					<input
						type="text"
						className={classNames(
							'w-full appearance-none text-sm font-medium',
							{
								'text-red-500': !rebindSuccess,
							},
						)}
						defaultValue={hotkeyToString(keys)}
						onChange={(e) => remap(stringToHotkey(e.target.value))}
					/>
				</div>
			</div>
		</div>
	);
};
