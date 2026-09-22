export type TagType = 
  | 'ga4_config' 
  | 'ga4_event' 
  | 'gads_conversion' 
  | 'gads_linker' 
  | 'gads_remarketing' 
  | 'meta_pixel' 
  | 'custom_html';

export type TriggerType = 
  | 'page_view' 
  | 'scroll_depth' 
  | 'timer' 
  | 'click' 
  | 'form_submission' 
  | 'custom_event';

export type VariableType = 'built_in' | 'data_layer' | 'constant';

export interface TriggerFilter {
  variable: string; // e.g. 'Page Path', 'Page URL', 'Scroll Depth Threshold', 'Click Classes'
  operator: 'contains' | 'equals' | 'starts_with' | 'regex' | 'greater_than';
  value: string;
}

export interface GTMTrigger {
  id: string;
  name: string;
  type: TriggerType;
  // Trigger specific configs
  pageViewType?: 'all' | 'some';
  scrollPercentages?: number[]; // e.g. [25, 50, 75, 90]
  timerIntervalMs?: number; // e.g. 5000 (5 seconds)
  timerLimit?: number; // e.g. 1
  eventName?: string; // for custom_event, e.g. 'purchase', 'generate_lead'
  filters: TriggerFilter[];
  conditionSummary: string;
}

export interface GTMTag {
  id: string;
  name: string;
  type: TagType;
  triggerId: string; // references GTMTrigger.id
  status: 'active' | 'paused';
  
  // Google Analytics 4
  measurementId?: string; // e.g. 'G-84729104'
  ga4EventName?: string; // e.g. 'purchase', 'scroll', 'generate_lead'
  eventParameters?: { key: string; value: string }[];

  // Google Ads
  conversionId?: string; // e.g. 'AW-1082947192'
  conversionLabel?: string; // e.g. 'AbC123XyZ'
  conversionValue?: string; // e.g. '{{DLV - value}}' or '79.99'
  currencyCode?: string; // e.g. 'EUR'
  transactionId?: string; // e.g. '{{DLV - transaction_id}}'
  enhancedConversions?: boolean;

  // Meta Pixel
  pixelId?: string;
  pixelEvent?: string; // 'PageView' | 'ViewContent' | 'AddToCart' | 'Purchase' | 'Lead'

  // Custom HTML
  htmlCode?: string;

  // Advanced settings
  firingOption?: 'once_per_event' | 'once_per_page' | 'unlimited';
}

export interface GTMVariable {
  id: string;
  name: string;
  type: VariableType;
  category: 'Pages' | 'Défilement' | 'Minuteur' | 'Clics' | 'Formulaires' | 'Couche de données' | 'Constante';
  value: string;
  description: string;
}

export interface TimelineEvent {
  id: number;
  name: string;
  type: string;
  timestamp: string;
  dataLayerSnapshot: Record<string, any>;
  variablesSnapshot: Record<string, any>;
}
