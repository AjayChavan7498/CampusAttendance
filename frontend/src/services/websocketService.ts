// Ensure global is polyfilled for sockjs-client
if (typeof window !== 'undefined' && !(window as any).global) {
  (window as any).global = window;
}

import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { LiveAttendanceEvent } from '../types';

class WebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;
  private subscriptions: Map<string, StompSubscription> = new Map();

  public connect(onConnectCallback?: () => void): void {
    if (this.client && this.client.active) {
      if (onConnectCallback) onConnectCallback();
      return;
    }

    const defaultWsHost = typeof window !== 'undefined' && import.meta.env.PROD
      ? `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.host}/ws`
      : 'http://localhost:8080/ws';
    const host = import.meta.env.VITE_WS_URL || defaultWsHost;
    const SockJSClass = (SockJS as any)?.default || SockJS;

    this.client = new Client({
      webSocketFactory: () => new SockJSClass(host) as any,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        if (onConnectCallback) onConnectCallback();
      },
      onDisconnect: () => {
        this.connected = false;
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message'], frame.body);
      },
    });

    this.client.activate();
  }

  public subscribeAdminAttendance(callback: (event: LiveAttendanceEvent) => void): () => void {
    const topic = '/topic/admin/attendance';
    return this.subscribe(topic, callback);
  }

  public subscribeDepartmentAttendance(
    departmentId: string,
    callback: (event: LiveAttendanceEvent) => void
  ): () => void {
    const topic = `/topic/department/${departmentId}/attendance`;
    return this.subscribe(topic, callback);
  }

  private subscribe(topic: string, callback: (event: LiveAttendanceEvent) => void): () => void {
    const subscribeAction = () => {
      if (!this.client || !this.connected) return;

      if (this.subscriptions.has(topic)) {
        this.subscriptions.get(topic)?.unsubscribe();
      }

      const sub = this.client.subscribe(topic, (message) => {
        try {
          const payload: LiveAttendanceEvent = JSON.parse(message.body);
          callback(payload);
        } catch (e) {
          console.error('Failed to parse WebSocket message body:', e);
        }
      });

      this.subscriptions.set(topic, sub);
    };

    if (this.connected) {
      subscribeAction();
    } else {
      this.connect(() => subscribeAction());
    }

    // Return unsubscription function
    return () => {
      if (this.subscriptions.has(topic)) {
        this.subscriptions.get(topic)?.unsubscribe();
        this.subscriptions.delete(topic);
      }
    };
  }

  public disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
}

export const websocketService = new WebSocketService();