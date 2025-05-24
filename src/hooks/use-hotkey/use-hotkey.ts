import { useEffect, useRef, useState } from 'react';

import { HOTKEYS } from './lib/constants';

const HOTKEY_REBINDS: Record<string, string> = {};

export const useHotkey = (
	name: keyof typeof HOTKEYS,
	callback?: () => void,
	deps?: React.DependencyList,
) => {
	const mounted = useRef(false);
	const [keys, setKeys] = useState(HOTKEY_REBINDS[name] ?? HOTKEYS[name].keys);
	const [rebindSuccess, setRebindSuccess] = useState(true);

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
			return;
		}

		if (!HOTKEY_REBINDS[name]) {
			HOTKEY_REBINDS[name] = keys;
			(window as any).ipcRenderer.invoke('register-hotkey', {
				name,
				keys,
			});
		}

		if (callback) window.ipcRenderer.on('hotkey', callback);

		return () => {
			if (callback) window.ipcRenderer.off('hotkey', callback);
		};
	}, [name, keys, ...(deps ?? [])]);

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
		setKeys(keys);
	};

	return {
		remap,
		keys,
		rebindSuccess,
	};
};
