import type { ForgeConfig } from '@electron-forge/shared-types';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';

export default {
	packagerConfig: {
		asar: true,
		icon: 'public/icon',
	},
	rebuildConfig: {},
	makers: [
		new MakerSquirrel(
			{
				setupIcon: 'public/icon.ico',
				noMsi: true,
				setupExe: 'tabzero.exe',
				setupMsi: 'tabzero-install.msi',
			},
			['win32'],
		),
		new MakerZIP({}, ['darwin']),
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: 'haydncomley',
					name: 'tabzero',
				},
				draft: true,
			},
		},
	],
	plugins: [
		{
			name: '@electron-forge/plugin-auto-unpack-natives',
			config: {},
		},
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true,
		}),
	],
} satisfies ForgeConfig;
