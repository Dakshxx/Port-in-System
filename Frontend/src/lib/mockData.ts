import { PortRecord, DashboardStats, PortReason } from '@/types/telecom';

export const mockPortRecords: PortRecord[] = [
  {
    MSISDN: "9876543210",
    ZONE: "North",
    LSA: "Delhi",
    OID: "OP001",
    NRH: "NH001",
    LRN: "LR001",
    HLR: "HL001",
    INT_RN1: "INT001",
    INT_RN2: "INT002",
    LAST_OID: "OP002",
    LAST_LRN: "LR002",
    LAST_HLR: "HL002",
    LAST_INT_RN1: "INT003",
    LAST_INT_RN2: "INT004",
    CREATE_ON: "2024-01-15T10:30:00Z",
    UPDATE_ON: "2024-01-16T14:20:00Z",
    PORT_ON: "2024-01-16T16:00:00Z",
    LAST_PORT_ON: "2024-01-10T12:00:00Z",
    DISCONNECT_ON: "",
    UPDATE_FLAG: "Y",
    DONOR_LSA: "Mumbai",
    NRH_LSA: "Delhi",
    BC_STATUS: "Active"
  },
  {
    MSISDN: "9123456789",
    ZONE: "South",
    LSA: "Karnataka",
    OID: "OP003",
    NRH: "NH002",
    LRN: "LR003",
    HLR: "HL003",
    INT_RN1: "INT005",
    INT_RN2: "INT006",
    LAST_OID: "OP004",
    LAST_LRN: "LR004",
    LAST_HLR: "HL004",
    LAST_INT_RN1: "INT007",
    LAST_INT_RN2: "INT008",
    CREATE_ON: "2024-01-14T09:15:00Z",
    UPDATE_ON: "2024-01-16T11:45:00Z",
    PORT_ON: "2024-01-16T13:30:00Z",
    LAST_PORT_ON: "2024-01-09T15:20:00Z",
    DISCONNECT_ON: "",
    UPDATE_FLAG: "N",
    DONOR_LSA: "Tamil Nadu",
    NRH_LSA: "Karnataka",
    BC_STATUS: "Pending"
  },
  {
    MSISDN: "9988776655",
    ZONE: "West",
    LSA: "Gujarat",
    OID: "OP005",
    NRH: "NH003",
    LRN: "LR005",
    HLR: "HL005",
    INT_RN1: "INT009",
    INT_RN2: "INT010",
    LAST_OID: "OP006",
    LAST_LRN: "LR006",
    LAST_HLR: "HL006",
    LAST_INT_RN1: "INT011",
    LAST_INT_RN2: "INT012",
    CREATE_ON: "2024-01-16T08:00:00Z",
    UPDATE_ON: "2024-01-16T10:30:00Z",
    PORT_ON: "",
    LAST_PORT_ON: "2024-01-12T14:15:00Z",
    DISCONNECT_ON: "2024-01-16T18:00:00Z",
    UPDATE_FLAG: "Y",
    DONOR_LSA: "Rajasthan",
    NRH_LSA: "Gujarat",
    BC_STATUS: "Failed"
  }
];

export const mockDashboardStats: DashboardStats = {
  totalPorts: 125847,
  portInToday: 342,
  portOutToday: 198,
  pendingPorts: 89,
  successfulPorts: 124658,
  failedPorts: 1100
};

export const mockPortReasons: PortReason[] = [
  {
    id: "1",
    code: "PR001",
    description: "Customer requested port due to better service quality",
    category: "commercial",
    active: true
  },
  {
    id: "2",
    code: "PR002",
    description: "Network coverage issues in customer area",
    category: "technical",
    active: true
  },
  {
    id: "3",
    code: "PR003",
    description: "Regulatory compliance requirement",
    category: "regulatory",
    active: true
  },
  {
    id: "4",
    code: "PR004",
    description: "Pricing and tariff advantages",
    category: "commercial",
    active: true
  },
  {
    id: "5",
    code: "PR005",
    description: "Technical system migration",
    category: "technical",
    active: false
  }
];