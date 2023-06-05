// Type definition for Catalog type Item
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
