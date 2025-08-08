import streamDeck, { LogLevel } from '@elgato/streamdeck';

import { Toggle } from './actions/toggle';
import { Clip } from './actions/clip';
import { Callout } from './actions/callout';

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the increment action.
streamDeck.actions.registerAction(new Toggle());
streamDeck.actions.registerAction(new Clip());
streamDeck.actions.registerAction(new Callout());

// Finally, connect to the Stream Deck.
streamDeck.connect();
