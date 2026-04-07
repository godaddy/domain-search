export interface DomainResult {
  domain: string;
  available: boolean;
  listPrice?: string;
  salePrice?: string;
  extendedValidation?: boolean;
  disclaimer?: string;
  productId?: number;
}

export interface SearchResponse {
  exactMatchDomain: DomainResult;
  suggestedDomains: DomainResult[];
  disclaimer?: string;
  error?: { message: string };
}

export interface WidgetText {
  placeholder: string;
  search: string;
  available: string;
  notAvailable: string;
  cart: string;
  select: string;
  selected: string;
}

export interface WidgetConfig {
  plid: string;
  baseUrl: string;
  pageSize: number;
  newTab: boolean;
  domainToCheck?: string;
  text: WidgetText;
}
