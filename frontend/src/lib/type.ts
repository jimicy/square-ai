// eslint-disable-next-line no-restricted-globals
const ORIGIN_URL = new URL(location.origin);
if (ORIGIN_URL.port === "3000") {
  ORIGIN_URL.port = "5000";
}
export const API_ADDRESS = `${ORIGIN_URL.toString()}api`;

// eslint-disable-next-line no-restricted-globals
export const PUBLIC_URL = location.origin;

// Type definition for Chat Message.
export type MessageDict = {
  text: string;
  role: "system" | "user";
  type:
    | "message"
    | "message_raw"
    | "system"
    | "product-catalog"
    | "store-customers"
    | "image/png"
    | "image/jpeg";
  data?: any;
};

// Type definition for Catalog type Item (Data passed to Chat).
export interface Item {
  created_at: Date;
  id: string;
  is_deleted: boolean;
  item_data?: ItemData;
  present_at_all_locations: boolean;
  type: string;
  updated_at: Date;
  version: number;
  item_variation_data?: ItemVariationData;
}

interface ItemData {
  category_id: string;
  image_ids: string[];
  image_url: string;
  is_taxable: boolean;
  name: string;
  description: string;
  product_type: string;
  skip_modifier_screen: boolean;
  variations: Item[];
  visibility: string;
}

interface ItemVariationData {
  item_id: string;
  name: string;
  ordinal: number;
  price_money: PriceMoney;
  pricing_type: string;
  sellable: boolean;
  stockable: boolean;
  track_inventory: boolean;
}

interface PriceMoney {
  amount: number;
  currency: string;
}

interface PriceMoney {
  amount: number;
  currency: string;
}

// Type definition for Customer type Item (Data passed to Chat).
export interface Customer {
  address: Address;
  birthday: Date;
  company_name: string;
  created_at: Date;
  creation_source: string;
  email_address: string;
  family_name: string;
  given_name: string;
  group_ids: string[];
  id: string;
  preferences: Preferences;
  reference_id: string;
  segment_ids: string[];
  updated_at: Date;
  version: number;
}

interface Address {
  address_line_1: string;
  address_line_2: string;
  administrative_district_level_1: string;
  country: string;
  locality: string;
  postal_code: string;
}

interface Preferences {
  email_unsubscribed: boolean;
}
