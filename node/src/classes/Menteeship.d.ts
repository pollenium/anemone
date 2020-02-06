import { connection as WsConnection } from 'websocket';
import { Uish } from 'pollenium-uvaursi';
import { Snowdrop } from 'pollenium-snowdrop';
import { SignalingServer } from './SignalingServer';
import { Offer } from './Signal/Offer';
import { Answer } from './Signal/Answer';
import { Flush } from './Signal/Flush';
export declare class Menteeship {
    private signalingServer;
    private wsConnection;
    bootstrapPromise: Promise<void>;
    readonly offerSnowdrop: Snowdrop<Offer>;
    readonly answerSnowdrop: Snowdrop<Answer>;
    readonly flushOfferSnowdrop: Snowdrop<Flush>;
    constructor(signalingServer: SignalingServer, wsConnection: WsConnection);
    private bootstrap;
    send(uish: Uish): void;
    sendOffer(offer: Offer): Promise<void>;
    sendAnswer(answer: Answer): Promise<void>;
    sendFlush(flushOffer: Flush): Promise<void>;
    destroy(): void;
}
