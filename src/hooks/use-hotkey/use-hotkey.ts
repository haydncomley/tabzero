import { useEffect, useRef, useState } from 'react';

import { useSetting } from '../use-setting';
import type { HOTKEYS } from './lib/constants';

const HOTKEY_REBINDS: Record<string, string> = {};

export const useHotkey = (
	name: keyof typeof HOTKEYS,
	callback?: () => void,
	deps?: React.DependencyList,
) => {
	const mounted = useRef(false);
	const [hotkeys, setHotkeys] = useSetting('hotkeys', {
		toggleRecording: 'CommandOrControl+Shift+[',
		clipStream: 'CommandOrControl+Shift+]',
	});
	const [rebindSuccess, setRebindSuccess] = useState(true);

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
			return;
		}

		if (!HOTKEY_REBINDS[name]) {
			HOTKEY_REBINDS[name] = hotkeys[name];
			(window as any).ipcRenderer.invoke('register-hotkey', {
				name,
				keys: hotkeys[name],
			});
		}

		if (callback)
			window.ipcRenderer.on('hotkey', (_, namePressed: string) => {
				if (namePressed == name) callback();
			});

		return () => {
			if (callback) window.ipcRenderer.off('hotkey', callback);
		};
	}, [name, hotkeys[name], ...(deps ?? [])]);

	const remap = async (keys: string) => {
		const success = await (window as any).ipcRenderer.invoke(
			'register-hotkey',
			{
				name,
				keys,
			},
		);

		if (!success) {
			setRebindSuccess(false);
			return;
		}

		setRebindSuccess(true);
		mounted.current = false;
		HOTKEY_REBINDS[name] = keys;
		setHotkeys({ ...hotkeys, [name]: keys });
	};

	const trigger = () => {
		window.ipcRenderer.broadcast('hotkey', name);
	};

	return {
		remap,
		keys: hotkeys[name],
		rebindSuccess,
		trigger,
	};
};
