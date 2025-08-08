export interface PortRecord {
  MSISDN: string;
  ZONE: string;
  LSA: string;
  OID: string;
  NRH: string;
  LRN: string;
  HLR: string;
  INT_RN1: string;
  INT_RN2: string;
  LAST_OID: string;
  LAST_LRN: string;
  LAST_HLR: string;
  LAST_INT_RN1: string;
  LAST_INT_RN2: string;
  CREATE_ON: string;
  UPDATE_ON: string;
  PORT_ON: string;
  LAST_PORT_ON: string;
  DISCONNECT_ON: string;
  UPDATE_FLAG: string;
  DONOR_LSA: string;
  NRH_LSA: string;
  BC_STATUS: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
}

export interface DashboardStats {
  totalPorts: number;
  portInToday: number;
  portOutToday: number;
  pendingPorts: number;
  successfulPorts: number;
  failedPorts: number;
}

export interface PortReason {
  id: string;
  code: string;
  description: string;
  category: 'technical' | 'commercial' | 'regulatory';
  active: boolean;
}

export type PortStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
export type PortType = 'port-in' | 'port-out' | 'snapback';