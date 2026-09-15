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

export const COPY_STATUSES = [
  "IN_STOCK_PUBLISHER",
  "DISTRIBUTED",
  "IN_STOCK_LIBRARY",
  "SOLD",
  "RETURNED",
  "LOST",
] as const;

export type CopyStatus = (typeof COPY_STATUSES)[number];

export const MOVEMENT_TYPES = [
  "PRINT_RECEIPT",
  "DISTRIBUTION",
  "RECEIPT",
  "SALE",
  "RETURN",
  "ADJUSTMENT",
  "LOSS",
] as const;

export type MovementType = (typeof MOVEMENT_TYPES)[number];

export type InventoryBook = {
  id: string;
  title: string;
  authors: string;
  publisherId: string;
  slug: string;
  coverImageUrl: string | null;
};

export type InventoryRollup = {
  editionId: string;
  isbn: string;
  isbn10: string | null;
  format: string;
  editionTitle: string | null;
  listPriceCents: number;
  currency: string;
  isActive: boolean;
  book: InventoryBook;
  warehouseOnHand: number;
  libraryOnHand: number;
  inTransit: number;
  sold: number;
  returned: number;
  lost: number;
  totalOnHand: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  copyCount: number;
};

export type InventorySummary = {
  warehouseOnHand: number;
  libraryOnHand: number;
  inTransit: number;
  sold: number;
  returned: number;
  lost: number;
  totalOnHand: number;
  lowStockCount: number;
};

export type InventoryCopy = {
  id: string;
  editionId: string;
  publisherId: string;
  libraryId: string | null;
  status: CopyStatus;
  copyNumber: number;
  createdAt: string;
  updatedAt: string;
  qrToken: string | null;
  qrImageDataUrl: string | null;
  edition: {
    id: string;
    isbn: string;
    format: string;
    title: string | null;
    listPriceCents: number;
    currency: string;
    coverImageUrl: string | null;
    book: InventoryBook;
  };
  library: { id: string; name: string; slug: string } | null;
};

export type InventoryMovement = {
  id: string;
  type: MovementType;
  editionId: string;
  copyId: string | null;
  quantity: number;
  reason: string | null;
  createdAt: string;
  edition: {
    id: string;
    isbn: string;
    format: string;
    title: string | null;
    book: { id: string; title: string; authors: string };
  };
  copy: { id: string; copyNumber: number; status: CopyStatus } | null;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};
