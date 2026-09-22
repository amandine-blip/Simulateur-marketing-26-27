import { db, doc, setDoc, getDoc, onSnapshot } from './firebase';

export interface MetaPixel {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  lastEventTime: string;
  receivedEventsCount: number;
  activeEvents: string[];
}

export interface MetaCampaign {
  id: number;
  name: string;
  status: string;
  delivery: string;
  budget: string;
  amountSpent: string;
  results: string;
  reach: string;
  impressions: string;
  cpc: string;
  landingPageViews?: string;
  postReactions?: string;
  engagementRate?: string;
  purchases?: string;
  objective: string;
  pixelId?: string;
  pixelName?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface GoogleAdsCampaign {
  id: number;
  name: string;
  type: string;
  goal: string;
  status: string;
  budget: string;
  clicks: string;
  impressions: string;
  ctr: string;
  cpc: string;
  cost: string;
  conversions: string;
  createdAt?: string;
}

export interface GA4TrafficRow {
  id: string | number;
  channel: string;
  medium: string;
  source: string;
  sourceMedium: string;
  campaign: string;
  users: number;
  sessions: number;
  engagedSessions: number;
  engagementRate: number;
  avgDuration: string;
  keyEvents: number;
  revenue: number;
  isCampaignSource?: boolean;
  campaignOrigin?: 'meta' | 'google';
}

export interface MarketingState {
  pixels: MetaPixel[];
  metaCampaigns: MetaCampaign[];
  googleAdsCampaigns: GoogleAdsCampaign[];
  trafficSources: GA4TrafficRow[];
  lastNotification?: string;
  isFirebaseConnected: boolean;
}

const LOCAL_STORAGE_KEY = 'efp_marketing_sim_memory_v2';
const WORKSPACE_DOC_ID = 'default_workspace';

// Default initial state
export const DEFAULT_STATE: MarketingState = {
  isFirebaseConnected: true,
  pixels: [
    {
      id: '482910482910482',
      name: 'Pixel de Amandine Vanderbecq',
      status: 'active',
      lastEventTime: 'Il y a 1 min',
      receivedEventsCount: 1420,
      activeEvents: ['PageView', 'ViewContent', 'Purchase', 'Lead']
    },
    {
      id: '719284019284910',
      name: 'Pixel EFP Digital Academy',
      status: 'active',
      lastEventTime: 'Il y a 5 min',
      receivedEventsCount: 890,
      activeEvents: ['PageView', 'AddToCart', 'Purchase']
    }
  ],
  metaCampaigns: [
    {
      id: 1,
      name: 'Campagne de Notoriété - Lancement',
      status: 'active',
      delivery: 'Actif',
      budget: '20,00 € / jour',
      amountSpent: '145,50 €',
      results: '12 450',
      reach: '45 200',
      impressions: '68 900',
      cpc: '0,12 €',
      landingPageViews: '850',
      postReactions: '1 245',
      engagementRate: '4,5 %',
      purchases: '2',
      objective: 'AWARENESS',
      pixelId: '482910482910482',
      pixelName: 'Pixel de Amandine Vanderbecq'
    },
    {
      id: 2,
      name: 'Trafic vers le site web - Retargeting',
      status: 'paused',
      delivery: 'Désactivé',
      budget: '15,00 € / jour',
      amountSpent: '342,20 €',
      results: '342',
      reach: '8 500',
      impressions: '12 100',
      cpc: '0,85 €',
      landingPageViews: '320',
      postReactions: '45',
      engagementRate: '1,2 %',
      purchases: '15',
      objective: 'TRAFFIC',
      pixelId: '482910482910482',
      pixelName: 'Pixel de Amandine Vanderbecq'
    }
  ],
  googleAdsCampaigns: [
    {
      id: 1,
      name: 'Search - Mots-clés Marque',
      type: 'Search',
      goal: 'SALES',
      status: 'active',
      budget: '15,00 €/jour',
      clicks: '450',
      impressions: '1 200',
      ctr: '37,50 %',
      cpc: '0,45 €',
      cost: '202,50 €',
      conversions: '45'
    },
    {
      id: 2,
      name: 'PMax - Lancement Produit',
      type: 'Performance Max',
      goal: 'LEADS',
      status: 'active',
      budget: '50,00 €/jour',
      clicks: '1 240',
      impressions: '45 000',
      ctr: '2,75 %',
      cpc: '0,85 €',
      cost: '1 054,00 €',
      conversions: '112'
    }
  ],
  trafficSources: [
    { id: 1, channel: 'Organic Search', medium: 'organic', source: 'google', sourceMedium: 'google / organic', campaign: '(organic)', users: 4520, sessions: 5100, engagedSessions: 3468, engagementRate: 68, avgDuration: '2m 14s', keyEvents: 45, revenue: 2150 },
    { id: 2, channel: 'Direct', medium: '(none)', source: '(direct)', sourceMedium: '(direct) / (none)', campaign: '(direct)', users: 2100, sessions: 2300, engagedSessions: 1035, engagementRate: 45, avgDuration: '1m 05s', keyEvents: 12, revenue: 540 },
    { id: 3, channel: 'Paid Social', medium: 'cpc', source: 'facebook', sourceMedium: 'facebook / cpc', campaign: 'lancement', users: 1250, sessions: 1450, engagedSessions: 754, engagementRate: 52, avgDuration: '1m 24s', keyEvents: 2, revenue: 45, isCampaignSource: true, campaignOrigin: 'meta' },
    { id: 4, channel: 'Paid Social', medium: 'cpc', source: 'facebook', sourceMedium: 'facebook / cpc', campaign: 'retargeting', users: 320, sessions: 480, engagedSessions: 360, engagementRate: 75, avgDuration: '2m 10s', keyEvents: 15, revenue: 850, isCampaignSource: true, campaignOrigin: 'meta' },
    { id: 5, channel: 'Email', medium: 'email', source: 'newsletter', sourceMedium: 'newsletter / email', campaign: 'promo_printemps', users: 850, sessions: 920, engagedSessions: 561, engagementRate: 61, avgDuration: '1m 45s', keyEvents: 28, revenue: 1420 },
    { id: 6, channel: 'Paid Search', medium: 'cpc', source: 'google', sourceMedium: 'google / cpc', campaign: 'search___mots_cles_marque', users: 640, sessions: 710, engagedSessions: 511, engagementRate: 72, avgDuration: '3m 05s', keyEvents: 35, revenue: 1850, isCampaignSource: true, campaignOrigin: 'google' },
    { id: 7, channel: 'Cross-network', medium: 'cpc', source: 'google', sourceMedium: 'google / cpc', campaign: 'pmax___lancement_produit', users: 1240, sessions: 1426, engagedSessions: 1069, engagementRate: 75, avgDuration: '2m 45s', keyEvents: 112, revenue: 8960, isCampaignSource: true, campaignOrigin: 'google' }
  ]
};

// Memory store class
class MarketingStore {
  private state: MarketingState;
  private listeners: Set<(state: MarketingState) => void> = new Set();
  private isListeningFirebase = false;

  constructor() {
    this.state = this.loadLocal();
    this.initFirebaseSync();
  }

  private loadLocal(): MarketingState {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e);
    }
    return DEFAULT_STATE;
  }

  private saveLocal(state: MarketingState) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  private async initFirebaseSync() {
    if (this.isListeningFirebase) return;
    this.isListeningFirebase = true;

    try {
      const docRef = doc(db, 'marketing_workspaces', WORKSPACE_DOC_ID);
      
      // Listen to real-time updates from Firestore
      onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<MarketingState>;
          this.state = {
            ...this.state,
            ...data,
            isFirebaseConnected: true
          };
          this.saveLocal(this.state);
          this.notify();
        } else {
          // Document does not exist yet: bootstrap it with initial state
          this.syncToFirebase(this.state);
        }
      }, (err) => {
        console.warn('Firestore snapshot error:', err);
      });
    } catch (err) {
      console.warn('Firestore init error:', err);
    }
  }

  private async syncToFirebase(state: MarketingState) {
    try {
      const docRef = doc(db, 'marketing_workspaces', WORKSPACE_DOC_ID);
      await setDoc(docRef, {
        id: WORKSPACE_DOC_ID,
        pixels: state.pixels,
        metaCampaigns: state.metaCampaigns,
        googleAdsCampaigns: state.googleAdsCampaigns,
        trafficSources: state.trafficSources,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to sync to Firebase:', err);
    }
  }

  public getState(): MarketingState {
    return this.state;
  }

  public subscribe(listener: (state: MarketingState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l(this.state));
  }

  private update(partial: Partial<MarketingState>) {
    this.state = { ...this.state, ...partial };
    this.saveLocal(this.state);
    this.syncToFirebase(this.state);
    this.notify();
  }

  // ==========================================
  // CROSS-TOOL SYNCHRONIZATION METHODS
  // ==========================================

  /**
   * 1. Add or Update a Meta Pixel (from GTM or Events Manager)
   * This immediately connects to Meta Ads Manager dropdown and headers!
   */
  public registerMetaPixel(pixel: Partial<MetaPixel> & { name: string }) {
    const existingIndex = this.state.pixels.findIndex(p => p.id === pixel.id || p.name === pixel.name);
    let updatedPixels = [...this.state.pixels];

    const pixelObj: MetaPixel = {
      id: pixel.id || `${Math.floor(100000000000000 + Math.random() * 900000000000000)}`,
      name: pixel.name,
      status: pixel.status || 'active',
      lastEventTime: 'À l\'instant',
      receivedEventsCount: pixel.receivedEventsCount || 1,
      activeEvents: pixel.activeEvents || ['PageView', 'ViewContent', 'Purchase']
    };

    if (existingIndex >= 0) {
      updatedPixels[existingIndex] = { ...updatedPixels[existingIndex], ...pixelObj };
    } else {
      updatedPixels = [pixelObj, ...updatedPixels];
    }

    this.update({
      pixels: updatedPixels,
      lastNotification: `Pixel "${pixel.name}" enregistré et synchronisé avec Meta Ads Manager !`
    });
  }

  public registerPixel(pixel: any) {
    return this.registerMetaPixel(pixel);
  }

  /**
   * 2. Launch a Meta Ads Campaign
   * Automatically synchronizes into GA4 traffic acquisition!
   */
  public publishMetaCampaign(campaign: MetaCampaign) {
    const updatedCampaigns = [campaign, ...this.state.metaCampaigns.filter(c => c.id !== campaign.id)];
    
    // Convert to GA4 Traffic Row
    const campaignSlug = campaign.name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    const usersCount = parseInt(campaign.results?.replace(/\s/g, '') || '450', 10) || 450;
    const purchasesCount = parseInt(campaign.purchases || '6', 10) || 6;

    const newGA4Row: GA4TrafficRow = {
      id: `meta-camp-${campaign.id}`,
      channel: 'Paid Social',
      medium: 'cpc',
      source: 'facebook',
      sourceMedium: 'facebook / cpc',
      campaign: campaignSlug,
      users: usersCount,
      sessions: Math.round(usersCount * 1.18),
      engagedSessions: Math.round(usersCount * 0.72),
      engagementRate: 72,
      avgDuration: '1m 48s',
      keyEvents: purchasesCount,
      revenue: Math.round(purchasesCount * 79.99),
      isCampaignSource: true,
      campaignOrigin: 'meta'
    };

    // Merge into GA4 traffic sources
    const updatedTraffic = [
      newGA4Row,
      ...this.state.trafficSources.filter(r => r.id !== newGA4Row.id)
    ];

    this.update({
      metaCampaigns: updatedCampaigns,
      trafficSources: updatedTraffic,
      lastNotification: `Campagne Meta "${campaign.name}" lancée ! Données de trafic et conversions injectées en direct dans GA4 (facebook / cpc).`
    });
  }

  /**
   * 3. Launch a Google Ads Campaign
   * Automatically synchronizes into GA4 traffic acquisition!
   */
  public publishGoogleAdsCampaign(campaign: GoogleAdsCampaign) {
    const updatedCampaigns = [campaign, ...this.state.googleAdsCampaigns.filter(c => c.id !== campaign.id)];

    // Convert to GA4 Traffic Row
    const campaignSlug = campaign.name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    const clicksCount = parseInt(campaign.clicks?.replace(/\s/g, '') || '350', 10) || 350;
    const conversionsCount = parseInt(campaign.conversions || '18', 10) || 18;

    const newGA4Row: GA4TrafficRow = {
      id: `gads-camp-${campaign.id}`,
      channel: campaign.type.toLowerCase().includes('max') ? 'Cross-network' : 'Paid Search',
      medium: 'cpc',
      source: 'google',
      sourceMedium: 'google / cpc',
      campaign: campaignSlug,
      users: clicksCount,
      sessions: Math.round(clicksCount * 1.12),
      engagedSessions: Math.round(clicksCount * 0.78),
      engagementRate: 78,
      avgDuration: '2m 35s',
      keyEvents: conversionsCount,
      revenue: Math.round(conversionsCount * 79.99),
      isCampaignSource: true,
      campaignOrigin: 'google'
    };

    const updatedTraffic = [
      newGA4Row,
      ...this.state.trafficSources.filter(r => r.id !== newGA4Row.id)
    ];

    this.update({
      googleAdsCampaigns: updatedCampaigns,
      trafficSources: updatedTraffic,
      lastNotification: `Campagne Google Ads "${campaign.name}" publiée ! Trafic et conversions synchronisés dans GA4 (google / cpc).`
    });
  }

  /**
   * Reset memory to defaults for a new student workshop
   */
  public resetToDefaults() {
    this.update(DEFAULT_STATE);
  }

  /**
   * Export all data as JSON (for GitHub backup or student delivery)
   */
  public exportJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  /**
   * Import from JSON
   */
  public importJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      this.update({ ...DEFAULT_STATE, ...parsed });
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }
}

export const marketingStore = new MarketingStore();
