/// <reference types="node" />
import { server as WsServer } from 'websocket';
import * as http from 'http';
import { Menteeship } from './Menteeship';
export declare class SignalingServer {
    port: number;
    menteeships: Menteeship[];
    menteeshipsByOfferIdHex: Record<string, Menteeship>;
    httpServer: http.Server;
    wsServer: WsServer;
    constructor(port: number);
    bootstrap(): void;
    destroy(): void;
}
