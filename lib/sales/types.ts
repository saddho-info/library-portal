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

export type SaleLibrary = {
  id: string;
  name: string;
  slug: string;
};

export type SaleActor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type SaleCopy = {
  id: string;
  copyNumber: number;
  status: string;
  publisherId: string;
  libraryId: string | null;
};

export type SaleItem = {
  id: string;
  saleId: string;
  editionId: string;
  copyId: string;
  unitPriceCents: number;
  quantity: number;
  createdAt: string;
  edition: {
    id: string;
    isbn: string;
    format: string;
    title: string | null;
    listPriceCents: number;
    currency: string;
    book: {
      id: string;
      title: string;
      authors: string;
      slug: string;
      publisherId: string;
    };
  };
  copy: SaleCopy;
};

export type SaleListItem = {
  id: string;
  libraryId: string;
  code: string;
  currency: string;
  totalCents: number;
  notes: string | null;
  actorUserId: string;
  soldAt: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  library: SaleLibrary;
  actor: SaleActor;
  items: SaleItem[];
};

export type SaleDetail = SaleListItem;

export type SaleSummary = {
  saleCount: number;
  itemCount: number;
  totalCents: number;
};

export type SaleListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  editionId?: string;
  publisherId?: string;
};

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};
