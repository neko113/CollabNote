export const SOCKET_EVENT = {
  // Lobby Socket Events
  JOIN_LOBBY: 'JOIN_LOBBY',
  LEAVE_LOBBY: 'LEAVE_LOBBY',
  LOBBY_CHAT: 'LOBBY_CHAT',

  // Note Socket Events - WebRTC
  SEND_OFFER: 'SEND_OFFER',
  RECEIVE_OFFER: 'RECEIVE_OFFER',
  SEND_ANSWER: 'SEND_ANSWER',
  RECEIVE_ANSWER: 'RECEIVE_ANSWER',
  SEND_ICE_CANDIDATE: 'SEND_ICE_CANDIDATE',
  RECEIVE_ICE_CANDIDATE: 'RECEIVE_ICE_CANDIDATE',
} as const;

export type Event = (typeof SOCKET_EVENT)[keyof typeof SOCKET_EVENT];
