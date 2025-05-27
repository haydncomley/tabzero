import { useState, useEffect } from 'react';

import type { StoreType } from '../../../electron/lib/store-handler';

export const useSetting = <T extends keyof StoreType>(
	key: T,
	defaultValue?: StoreType[T],
): [StoreType[T], (val: StoreType[T]) => void] => {
	const [value, setValue] = useState<StoreType[T]>(
		defaultValue as StoreType[T],
	);

	useEffect(() => {
		let mounted = true;
		window.ipcRenderer.invoke('get-setting', key).then((val) => {
			if (mounted && val !== undefined) setValue(val as StoreType[T]);
		});

		const handler = (
			_: Electron.IpcRendererEvent,
			changedKey: string,
			newVal: StoreType[T],
		) => {
			if (changedKey === key)
				setValue(newVal ?? (defaultValue as StoreType[T]));
		};
		window.ipcRenderer.on<[T, StoreType[T]]>('setting-changed', handler);

		return () => {
			mounted = false;
			window.ipcRenderer.off('setting-changed', handler);
		};
	}, [key]);

	const setSetting = (newVal: StoreType[T]) => {
		window.ipcRenderer.invoke('set-setting', key, newVal);
	};

	return [value, setSetting];
};
