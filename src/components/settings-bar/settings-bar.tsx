import { ChevronsUpDown } from 'lucide-react';

import { useRecorder } from '~/hooks/use-recorder';
import { useSetting } from '~/hooks/use-setting';

export const SettingsBar = () => {
	const [deviceId, setDeviceId] = useSetting('deviceId');
	const { devices } = useRecorder();

	return (
		<div className="bg-outline flex w-full flex-wrap items-center gap-4 border-b p-3">
			<div className="flex items-center gap-4">
				<div className="flex flex-col">
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
				<ChevronsUpDown className="h-4 w-4"></ChevronsUpDown>
			</div>

			<div className="flex items-center gap-4">
				<div>
					<p className="text-xs opacity-50">Hotkey</p>
					<p className="text-sm font-medium">Command or Control + Shift + B</p>
				</div>
			</div>
		</div>
	);
};
