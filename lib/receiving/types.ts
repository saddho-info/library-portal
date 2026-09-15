export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

export const DISTRIBUTION_STATUSES = [
  "DRAFT",
  "DISPATCHED",
  "PARTIALLY_RECEIVED",
  "RECEIVED",
  "CANCELLED",
] as const;

export type DistributionStatus = (typeof DISTRIBUTION_STATUSES)[number];

export const RECEIPT_STATUSES = ["DRAFT", "CONFIRMED", "CANCELLED"] as const;
export type StockReceiptStatus = (typeof RECEIPT_STATUSES)[number];

export const DISCREPANCIES = ["NONE", "MISSING", "DAMAGED"] as const;
export type ReceiptDiscrepancy = (typeof DISCREPANCIES)[number];

export type NamedOrg = {
  id: string;
  name: string;
  slug: string;
};

export type NamedActor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type ShipmentCopy = {
  id: string;
  copyNumber: number;
  status: string;
};

export type ShipmentItem = {
  id: string;
  editionId: string;
  quantity: number;
  createdAt: string;
  edition: {
    id: string;
    isbn: string;
    format: string;
    title: string | null;
    book: {
      id: string;
      title: string;
      authors: string;
      slug: string;
    };
  };
  copies: ShipmentCopy[];
};

export type Shipment = {
  id: string;
  publisherId: string;
  libraryId: string;
  status: DistributionStatus;
  code: string;
  notes: string | null;
  actorUserId: string;
  dispatchedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  totalQuantity: number;
  itemCount: number;
  publisher: NamedOrg;
  library: NamedOrg;
  actor: NamedActor;
  items: ShipmentItem[];
};

export type ShipmentSummary = {
  draft: number;
  dispatched: number;
  partiallyReceived: number;
  received: number;
  cancelled: number;
  total: number;
  copiesInTransit: number;
};

export type ReceiptItem = {
  id: string;
  editionId: string;
  copyId: string;
  received: boolean;
  discrepancy: ReceiptDiscrepancy;
  notes: string | null;
  createdAt: string;
  edition: ShipmentItem["edition"];
  copy: ShipmentCopy & {
    publisherId: string;
    libraryId: string | null;
    distributionItemId: string | null;
  };
};

export type StockReceipt = {
  id: string;
  distributionId: string;
  libraryId: string;
  status: StockReceiptStatus;
  code: string;
  notes: string | null;
  actorUserId: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  receivedCount: number;
  discrepancyCount: number;
  library: NamedOrg;
  actor: NamedActor;
  distribution: {
    id: string;
    code: string;
    status: DistributionStatus;
    publisherId: string;
    libraryId: string;
    notes: string | null;
    dispatchedAt: string | null;
    publisher: NamedOrg;
  };
  items: ReceiptItem[];
};

export type ReceiptSummary = {
  draft: number;
  confirmed: number;
  cancelled: number;
  total: number;
  copiesReceived: number;
};

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export function isReceivable(status: DistributionStatus): boolean {
  return status === "DISPATCHED" || status === "PARTIALLY_RECEIVED";
}
