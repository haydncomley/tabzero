import {
	action,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
	WillDisappearEvent,
} from '@elgato/streamdeck';
import ws from 'ws';

const PORT = 51109;
let wsClient: ws | null = null;

const STATE_IMAGE_MAP = {
	connected: 'imgs/actions/callout/connected.png',
	disconnected: 'imgs/actions/callout/disconnected.png',
} as const;

const connectToTabZero = (
	ev: WillAppearEvent<CalloutSettings> | KeyDownEvent<CalloutSettings>,
) => {
	return new Promise<void>((resolve, reject) => {
		if (wsClient) return resolve();

		wsClient = new ws(`ws://localhost:${PORT}`);
		wsClient.on('message', () => {
			ev.action.setImage(STATE_IMAGE_MAP.connected);
		});
		wsClient.on('open', () => {
			resolve();
			ev.action.setImage(STATE_IMAGE_MAP.connected);
		});
		wsClient.on('error', () => {
			resolve();
			ev.action.setImage(STATE_IMAGE_MAP.disconnected);
			wsClient = null;
		});
		wsClient.on('close', () => {
			resolve();
			ev.action.setImage(STATE_IMAGE_MAP.disconnected);
			wsClient = null;
		});
	});
};

/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: 'com.haydn-comley.tabzero.callout' })
export class Callout extends SingletonAction<CalloutSettings> {
	/**
	 * The {@link SingletonAction.onWillAppear} event is useful for setting the visual representation of an action when it becomes visible. This could be due to the Stream Deck first
	 * starting up, or the user navigating between pages / folders etc.. There is also an inverse of this event in the form of {@link streamDeck.client.onWillDisappear}. In this example,
	 * we're setting the title to the "count" that is incremented in {@link IncrementCounter.onKeyDown}.
	 */
	override onWillAppear(
		ev: WillAppearEvent<CalloutSettings>,
	): void | Promise<void> {
		ev.action.setImage(STATE_IMAGE_MAP.disconnected);
		return connectToTabZero(ev);
	}

	override onWillDisappear(
		ev: WillDisappearEvent<CalloutSettings>,
	): Promise<void> | void {
		wsClient?.close();
	}

	/**
	 * Listens for the {@link SingletonAction.onKeyDown} event which is emitted by Stream Deck when an action is pressed. Stream Deck provides various events for tracking interaction
	 * with devices including key down/up, dial rotations, and device connectivity, etc. When triggered, {@link ev} object contains information about the event including any payloads
	 * and action information where applicable. In this example, our action will display a counter that increments by one each press. We track the current count on the action's persisted
	 * settings using `setSettings` and `getSettings`.
	 */
	override async onKeyDown(ev: KeyDownEvent<CalloutSettings>): Promise<void> {
		if (!wsClient) {
			await connectToTabZero(ev);
		} else {
			wsClient?.send('userCallout');
		}
	}
}

/**
 * Settings for {@link Toggle}.
 */
type CalloutSettings = {};
