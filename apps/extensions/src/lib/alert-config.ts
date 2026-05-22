// Event type definitions
export type AlertType = 'follow' | 'sub' | 'donate';

export interface AlertData {
  name: string;
  platform: 'kick' | 'twitch' | 'youtube';
  amount?: string;
  tier?: string;
  message?: string;
}

export interface AlertEvent {
  id: string;
  type: AlertType;
  data: AlertData;
  timestamp: string;
}

// Alert configuration metadata
export interface AlertConfig {
  label: string;
  color: string;
  glowColor: string;
  borderColor: string;
  iconType: 'user' | 'star' | 'heart';
}

export const ALERT_CONFIG: Record<AlertType, AlertConfig> = {
  follow: {
    label: 'New Follower!',
    color: '#00E701',
    glowColor: 'rgba(0, 231, 1, 0.4)',
    borderColor: 'rgba(0, 231, 1, 0.3)',
    iconType: 'user',
  },
  sub: {
    label: 'New Subscriber!',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.4)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
    iconType: 'star',
  },
  donate: {
    label: 'Donation!',
    color: '#FF4500',
    glowColor: 'rgba(255, 69, 0, 0.4)',
    borderColor: 'rgba(255, 69, 0, 0.3)',
    iconType: 'heart',
  },
};

// Position options based on query param
export type AlertPosition = 'center' | 'center-right' | 'center-left';

export const POSITION_CLASSES: Record<AlertPosition, string> = {
  center: 'items-center justify-center',
  'center-right': 'items-end justify-center pr-8',
  'center-left': 'items-start justify-center pl-8',
};

export const MAX_VISIBLE = 5;
export const DISPLAY_DURATION = 3000;
