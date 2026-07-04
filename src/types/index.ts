export type {
  WCImage,
  WCCategory,
  WCAttribute,
  WCProduct,
  WCVariation,
  WCReview,
  WCCart,
  WCCartItem,
  WCAddress,
  WCCheckoutResponse,
} from "@/schemas/woocommerce";

export interface CheckoutFormValues {
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  customer_note?: string;
  ship_to_different_address: boolean;
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "popularity"
  | "rating";

export type StockFilter = "all" | "instock" | "onsale";

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  category?: string | number;
  search?: string;
  min_price?: number;
  max_price?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  on_sale?: boolean;
  featured?: boolean;
  orderby?: "date" | "price" | "popularity" | "rating" | "title" | "menu_order";
  order?: "asc" | "desc";
  include?: number[];
  exclude?: number[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalItems: number;
  page: number;
  perPage: number;
}
