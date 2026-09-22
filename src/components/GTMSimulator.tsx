import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Play, Send, Plus, Tag, Zap, Database, Check, Eye, 
  ExternalLink, Copy, HelpCircle, Code, Globe, RefreshCw, AlertCircle,
  Laptop, CheckCircle2, ChevronRight, X, Shield, Sparkles, BookOpen,
  Clock, ArrowDown, Edit2, Trash2
} from 'lucide-react';
import { GTMTag, GTMTrigger, GTMVariable } from './gtm/types';
import TagEditorModal, { TAG_TYPE_CONFIGS } from './gtm/TagEditorModal';
import TriggerEditorModal from './gtm/TriggerEditorModal';
import TagAssistantPreview from './gtm/TagAssistantPreview';
import GTMRationalView from './gtm/GTMRationalView';
import { marketingStore } from '../services/marketingStore';

interface GTMSimulatorProps {
  onExit: () => void;
}

export default function GTMSimulator({ onExit }: GTMSimulatorProps) {
  // Navigation tabs: 'tags' | 'triggers' | 'variables' | 'rational'
  const [activeTab, setActiveTab] = useState<'tags' | 'triggers' | 'variables' | 'rational'>('tags');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Modals state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<'head' | 'body' | null>(null);

  // Tag & Trigger Editor modals
  const [editingTag, setEditingTag] = useState<GTMTag | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<GTMTrigger | null>(null);
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);

  // Initial realistic Triggers
  const [triggers, setTriggers] = useState<GTMTrigger[]>([
    { 
      id: 'trig_all_pages', 
      name: 'All Pages (Toutes les pages)', 
      type: 'page_view', 
      pageViewType: 'all',
      filters: [],
      conditionSummary: 'Toutes les pages vues' 
    },
    { 
      id: 'trig_purchase_page', 
      name: 'Page Confirmation Achat (Page Path)', 
      type: 'page_view', 
      pageViewType: 'some',
      filters: [{ variable: 'Page Path', operator: 'contains', value: '/confirmation-achat' }],
      conditionSummary: 'Page Path contient "/confirmation-achat"' 
    },
    { 
      id: 'trig_gads_url', 
      name: 'Trafic Google Ads (Page URL contient gclid)', 
      type: 'page_view', 
      pageViewType: 'some',
      filters: [{ variable: 'Page URL', operator: 'contains', value: 'gclid' }],
      conditionSummary: 'Page URL contient "gclid"' 
    },
    { 
      id: 'trig_scroll_50_90', 
      name: 'Profondeur de défilement (Scroll 50% & 90%)', 
      type: 'scroll_depth', 
      scrollPercentages: [50, 90],
      filters: [],
      conditionSummary: 'Défilement vertical : 50%, 90%' 
    },
    { 
      id: 'trig_timer_5s', 
      name: 'Visite qualifiée (Minuteur 5 secondes)', 
      type: 'timer', 
      timerIntervalMs: 5000,
      timerLimit: 1,
      filters: [],
      conditionSummary: 'Minuteur : 5000 ms (5s) • Limite : 1' 
    },
    { 
      id: 'trig_click_cta', 
      name: 'Clic sur bouton CTA principal', 
      type: 'click', 
      filters: [{ variable: 'Click Classes', operator: 'contains', value: 'btn-primary' }],
      conditionSummary: 'Click Classes contient "btn-primary"' 
    },
    { 
      id: 'trig_form_lead', 
      name: 'Envoi formulaire de devis (Form Submit)', 
      type: 'form_submission', 
      filters: [{ variable: 'Form ID', operator: 'contains', value: 'lead-form' }],
      conditionSummary: 'Form ID contient "lead-form"' 
    }
  ]);

  // Initial realistic Tags
  const [tags, setTags] = useState<GTMTag[]>([
    {
      id: 'tag_gads_conv',
      name: 'Google Ads - Suivi de conversion Achat',
      type: 'gads_conversion',
      triggerId: 'trig_purchase_page',
      conversionId: 'AW-1082947192',
      conversionLabel: 'AbC123XyZ_purchase',
      conversionValue: '{{DLV - value}}',
      currencyCode: 'EUR',
      transactionId: '{{DLV - transaction_id}}',
      enhancedConversions: true,
      status: 'active'
    },
    {
      id: 'tag_gads_linker',
      name: 'Google Ads - Balise Linker de conversion',
      type: 'gads_linker',
      triggerId: 'trig_all_pages',
      status: 'active'
    },
    {
      id: 'tag_ga4_config',
      name: 'Google Analytics - Balise Google (GA4)',
      type: 'ga4_config',
      triggerId: 'trig_all_pages',
      measurementId: 'G-84729104',
      status: 'active'
    },
    {
      id: 'tag_ga4_scroll',
      name: 'GA4 - Événement scroll_depth (Engagement lecture)',
      type: 'ga4_event',
      triggerId: 'trig_scroll_50_90',
      measurementId: 'G-84729104',
      ga4EventName: 'scroll_depth',
      eventParameters: [
        { key: 'percent_scrolled', value: '{{Scroll Depth Threshold}}' },
        { key: 'page_path', value: '{{Page Path}}' }
      ],
      status: 'active'
    },
    {
      id: 'tag_ga4_timer',
      name: 'GA4 - Événement user_engagement_5s (Temps passé)',
      type: 'ga4_event',
      triggerId: 'trig_timer_5s',
      measurementId: 'G-84729104',
      ga4EventName: 'user_engagement_5s',
      eventParameters: [
        { key: 'engagement_time_msec', value: '{{Timer Elapsed Time}}' },
        { key: 'page_path', value: '{{Page Path}}' }
      ],
      status: 'active'
    },
    {
      id: 'tag_meta_pageview',
      name: 'Meta Pixel - PageView (Base)',
      type: 'meta_pixel',
      triggerId: 'trig_all_pages',
      pixelId: '482910482910482',
      pixelEvent: 'PageView',
      status: 'active'
    },
    {
      id: 'tag_meta_purchase',
      name: 'Meta Pixel - Conversion Purchase',
      type: 'meta_pixel',
      triggerId: 'trig_purchase_page',
      pixelId: '482910482910482',
      pixelEvent: 'Purchase',
      status: 'active'
    }
  ]);

  // Initial realistic Variables
  const [variables, setVariables] = useState<GTMVariable[]>([
    { id: 'v1', name: 'Page URL', type: 'built_in', category: 'Pages', value: '{{Page URL}}', description: 'URL complète de la page avec protocole et paramètres' },
    { id: 'v2', name: 'Page Path', type: 'built_in', category: 'Pages', value: '{{Page Path}}', description: 'Chemin relatif de la page (ex: /confirmation-achat)' },
    { id: 'v3', name: 'Page Hostname', type: 'built_in', category: 'Pages', value: '{{Page Hostname}}', description: 'Nom de domaine hôte (ex: boutique-efp.be)' },
    { id: 'v4', name: 'Scroll Depth Threshold', type: 'built_in', category: 'Défilement', value: '{{Scroll Depth Threshold}}', description: 'Pourcentage de scroll atteint (25, 50, 75, 90)' },
    { id: 'v5', name: 'Timer Elapsed Time', type: 'built_in', category: 'Minuteur', value: '{{Timer Elapsed Time}}', description: 'Temps écoulé en ms depuis le démarrage du minuteur' },
    { id: 'v6', name: 'Timer Interval', type: 'built_in', category: 'Minuteur', value: '{{Timer Interval}}', description: 'Intervalle défini pour le déclencheur minuteur' },
    { id: 'v7', name: 'Click Classes', type: 'built_in', category: 'Clics', value: '{{Click Classes}}', description: 'Classes CSS de l\'élément cliqué (ex: btn-primary)' },
    { id: 'v8', name: 'Click ID', type: 'built_in', category: 'Clics', value: '{{Click ID}}', description: 'Identifiant HTML de l\'élément cliqué' },
    { id: 'v9', name: 'Form ID', type: 'built_in', category: 'Formulaires', value: '{{Form ID}}', description: 'ID HTML du formulaire soumis (ex: lead-form)' },
    { id: 'v10', name: 'DLV - value', type: 'data_layer', category: 'Couche de données', value: 'ecommerce.value', description: 'Montant de la commande extrait du dataLayer' },
    { id: 'v11', name: 'DLV - transaction_id', type: 'data_layer', category: 'Couche de données', value: 'ecommerce.transaction_id', description: 'Numéro de commande extrait du dataLayer' },
    { id: 'v12', name: 'Constante - ID Ads', type: 'constant', category: 'Constante', value: 'AW-1082947192', description: 'Identifiant de compte Google Ads' },
  ]);

  // Actions on Tag
  const handleSaveTag = (savedTag: GTMTag) => {
    setTags(prev => {
      const exists = prev.some(t => t.id === savedTag.id);
      if (exists) {
        return prev.map(t => t.id === savedTag.id ? savedTag : t);
      }
      return [...prev, savedTag];
    });
    setIsTagModalOpen(false);
    setEditingTag(null);

    // Cross-Tool synchronization
    if (savedTag.type === 'meta_pixel' && savedTag.pixelId) {
      marketingStore.registerPixel({
        id: savedTag.pixelId,
        name: savedTag.name || `Pixel Meta (${savedTag.pixelId})`,
        createdAt: new Date().toISOString(),
        isActive: savedTag.status === 'active',
        source: 'gtm',
        receivedEventsCount: 24
      });
      setSyncToast(`Balise Pixel Meta "${savedTag.name}" enregistrée ! Le Pixel ID ${savedTag.pixelId} est maintenant synchronisé avec Meta Events Manager et le gestionnaire de campagnes Meta Ads.`);
      setTimeout(() => setSyncToast(null), 6000);
    } else if (savedTag.type === 'ga4_config' && savedTag.measurementId) {
      setSyncToast(`Balise Google Analytics GA4 "${savedTag.name}" (${savedTag.measurementId}) enregistrée et active pour la collecte de flux.`);
      setTimeout(() => setSyncToast(null), 6000);
    }

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleDeleteTag = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette balise ?')) {
      setTags(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleToggleTagStatus = (id: string) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'paused' : 'active' } : t));
  };

  // Actions on Trigger
  const handleSaveTrigger = (savedTrigger: GTMTrigger) => {
    setTriggers(prev => {
      const exists = prev.some(t => t.id === savedTrigger.id);
      if (exists) {
        return prev.map(t => t.id === savedTrigger.id ? savedTrigger : t);
      }
      return [...prev, savedTrigger];
    });
    setIsTriggerModalOpen(false);
    setEditingTrigger(null);

    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.6 }
    });
  };

  const handleDeleteTrigger = (id: string) => {
    const isUsed = tags.some(t => t.triggerId === id);
    if (isUsed) {
      alert('Impossible de supprimer ce déclencheur car il est actuellement utilisé par une ou plusieurs balises.');
      return;
    }
    if (confirm('Supprimer ce déclencheur ?')) {
      setTriggers(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleCopyCode = (type: 'head' | 'body', code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex h-screen bg-[#f1f3f4] font-sans text-slate-800 overflow-hidden w-full">
      
      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* GTM Top Navigation Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={onExit}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Retour à l'accueil"
            >
              <ArrowLeft size={16} />
              <span>Accueil</span>
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                GTM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">Boutique EFP (Web)</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.2 rounded border border-slate-200">
                    GTM-WK928LP
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">Espace de travail par défaut</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Code size={13} />
              <span className="hidden sm:inline">Code GTM</span>
            </button>

            <button
              onClick={() => {
                setIsPreviewOpen(true);
                confetti({
                  particleCount: 50,
                  spread: 40,
                  origin: { y: 0.6 }
                });
              }}
              className="px-4 py-1.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Play size={13} className="fill-blue-600" />
              <span>Prévisualiser (Tag Assistant)</span>
            </button>

            <button
              onClick={() => {
                confetti({
                  particleCount: 120,
                  spread: 70,
                  origin: { y: 0.5 }
                });
                alert("Version #4 publiée avec succès ! Vos balises Google Ads, GA4, Scroll et Minuteur sont maintenant en production.");
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Send size={13} />
              <span>Envoyer (Publier)</span>
            </button>
          </div>
        </header>

        {syncToast && (
          <div className="bg-indigo-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in z-10 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={15} />
              <span>{syncToast}</span>
            </div>
            <span className="text-[10px] bg-indigo-700 px-2 py-0.5 rounded font-mono uppercase tracking-wider">Liaison GTM ➔ Meta Ads & Firebase</span>
          </div>
        )}

        {/* Workspace Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('tags')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'tags'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tag size={15} />
              <span>Balises ({tags.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('triggers')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'triggers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Zap size={15} />
              <span>Déclencheurs ({triggers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('variables')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'variables'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Database size={15} />
              <span>Variables ({variables.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('rational')}
              className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'rational'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-indigo-700 hover:text-indigo-900'
              }`}
            >
              <BookOpen size={15} />
              <span>Raisonnement GTM dans la réalité</span>
              <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded text-[9px] font-black">
                GUIDE
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium hidden md:block">
            Modifications non publiées : <strong className="text-amber-600">3</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Pedagogical Header Banner */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 border border-blue-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-900 tracking-wider">
                  <Sparkles size={15} className="text-blue-600" /> 
                  Atelier Google Tag Manager Réaliste • Tracking Google Ads, Scroll & Temps
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Créez des <strong>Balises de conversion Google Ads</strong> avec leur <strong>Balise Linker</strong>, configurez des déclencheurs de <strong>Page Path</strong>, <strong>Page URL (gclid)</strong>, de <strong>Scroll (50%, 90%)</strong> et de <strong>Minuteur (5s)</strong>, puis testez le tout en direct avec le <strong>Tag Assistant</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('rational')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen size={13} />
                  <span>Comprendre la logique</span>
                </button>

                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Play size={13} className="fill-white" />
                  <span>Tester dans Tag Assistant</span>
                </button>
              </div>
            </div>

            {/* TAB 1: TAGS */}
            {activeTab === 'tags' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Balises (Tags)</h2>
                    <p className="text-xs text-slate-500">
                      Les balises sont des codes envoyés aux régies (Google Ads, GA4, Meta) lorsqu'un déclencheur associé valide ses conditions.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingTag(null);
                      setIsTagModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 transition-colors"
                  >
                    <Plus size={15} />
                    <span>Nouvelle balise</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Nom de la balise</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Déclencheur associé</th>
                        <th className="py-3 px-4">Paramètres clés</th>
                        <th className="py-3 px-4 text-center">Statut</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {tags.map(tag => {
                        const trigger = triggers.find(t => t.id === tag.triggerId);
                        const typeCfg = TAG_TYPE_CONFIGS[tag.type];
                        return (
                          <tr key={tag.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              <button
                                onClick={() => {
                                  setEditingTag(tag);
                                  setIsTagModalOpen(true);
                                }}
                                className="text-left hover:text-blue-600 flex items-center gap-2 group"
                              >
                                <Tag size={14} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                <span>{tag.name}</span>
                              </button>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                tag.type.startsWith('gads') 
                                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                  : tag.type.startsWith('ga4')
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : 'bg-purple-50 text-purple-800 border border-purple-200'
                              }`}>
                                {typeCfg?.name || tag.type}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-[11px] font-semibold border border-slate-200 flex items-center gap-1.5 w-fit">
                                <Zap size={12} className="text-amber-500" />
                                {trigger ? trigger.name : 'Aucun déclencheur'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                              {tag.type === 'gads_conversion' && `ID: ${tag.conversionId} • Libellé: ${tag.conversionLabel}`}
                              {tag.type === 'gads_linker' && `Cookie 1st-party • gclid auto`}
                              {tag.type === 'ga4_config' && `ID: ${tag.measurementId}`}
                              {tag.type === 'ga4_event' && `Event: ${tag.ga4EventName}`}
                              {tag.type === 'meta_pixel' && `Pixel: ${tag.pixelId} • Event: ${tag.pixelEvent}`}
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => handleToggleTagStatus(tag.id)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                  tag.status === 'active' 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                }`}
                              >
                                {tag.status === 'active' ? 'Actif' : 'En pause'}
                              </button>
                            </td>

                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingTag(tag);
                                  setIsTagModalOpen(true);
                                }}
                                className="p-1 hover:bg-slate-200 text-slate-500 hover:text-blue-600 rounded transition-colors"
                                title="Modifier"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteTag(tag.id)}
                                className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: TRIGGERS */}
            {activeTab === 'triggers' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Déclencheurs (Triggers)</h2>
                    <p className="text-xs text-slate-500">
                      Un déclencheur écoute les interactions des visiteurs (Page Path, Page URL, Scroll, Minuteur, Clic, Formulaire) et valide si une balise doit partir.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingTrigger(null);
                      setIsTriggerModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 transition-colors"
                  >
                    <Plus size={15} />
                    <span>Nouveau déclencheur</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Nom du déclencheur</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Conditions de déclenchement</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {triggers.map(trig => (
                        <tr key={trig.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <button
                              onClick={() => {
                                setEditingTrigger(trig);
                                setIsTriggerModalOpen(true);
                              }}
                              className="text-left hover:text-blue-600 flex items-center gap-2 group"
                            >
                              <Zap size={14} className="text-amber-500 group-hover:scale-110 transition-transform" />
                              <span>{trig.name}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 uppercase text-[10px] font-black">
                            {trig.type === 'page_view' && <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Page vue</span>}
                            {trig.type === 'scroll_depth' && <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">Profondeur de défilement</span>}
                            {trig.type === 'timer' && <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Minuteur (Timer)</span>}
                            {trig.type === 'click' && <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Clic</span>}
                            {trig.type === 'form_submission' && <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Formulaire</span>}
                            {trig.type === 'custom_event' && <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Événement personnalisé</span>}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-blue-700 font-bold">
                            {trig.conditionSummary}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingTrigger(trig);
                                setIsTriggerModalOpen(true);
                              }}
                              className="p-1 hover:bg-slate-200 text-slate-500 hover:text-blue-600 rounded transition-colors"
                              title="Modifier"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteTrigger(trig.id)}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: VARIABLES */}
            {activeTab === 'variables' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-base font-black text-slate-900">Variables GTM</h2>
                  <p className="text-xs text-slate-500">
                    Les variables sont des conteneurs nommés dont la valeur change dynamiquement (URL actuelle, profondeur de scroll, timer, valeur de commande dans le dataLayer).
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Nom de la variable</th>
                        <th className="py-3 px-4">Catégorie</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Valeur résolue</th>
                        <th className="py-3 px-4">Rôle dans GTM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {variables.map(v => (
                        <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                            <Database size={14} className="text-slate-500" />
                            <span>{v.name}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                              {v.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[10px] font-bold uppercase text-slate-500">
                            {v.type === 'built_in' && 'Intégrée (GTM)'}
                            {v.type === 'data_layer' && 'Data Layer (DLV)'}
                            {v.type === 'constant' && 'Constante'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-blue-700 font-bold">
                            {v.value}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-slate-500">
                            {v.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: RAISONNEMENT GTM DANS LA RÉALITÉ */}
            {activeTab === 'rational' && (
              <GTMRationalView />
            )}

          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: GTM INSTALLATION CODE SNIPPETS                  */}
      {/* ======================================================== */}
      {isInstallModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Code size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Installation de Google Tag Manager</h3>
                  <p className="text-xs text-slate-500">Insérez ces deux extraits de code sur chaque page de votre site web.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsInstallModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Head snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>1. Collez ce code le plus haut possible dans la balise <code>&lt;head&gt;</code> :</span>
                <button
                  onClick={() => handleCopyCode('head', `<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-WK928LP');</script>\n<!-- End Google Tag Manager -->`)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold"
                >
                  <Copy size={13} />
                  <span>{copiedCode === 'head' ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto">
{`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WK928LP');</script>
<!-- End Google Tag Manager -->`}
              </pre>
            </div>

            {/* Body snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>2. Collez ce code immédiatement après l'ouverture de la balise <code>&lt;body&gt;</code> :</span>
                <button
                  onClick={() => handleCopyCode('body', `<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WK928LP"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->`)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold"
                >
                  <Copy size={13} />
                  <span>{copiedCode === 'body' ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto">
{`<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WK928LP"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsInstallModalOpen(false)}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TAG EDITOR (Matches Screenshot exact GTM UI)     */}
      {/* ======================================================== */}
      {isTagModalOpen && (
        <TagEditorModal
          initialTag={editingTag}
          triggers={triggers}
          onSave={handleSaveTag}
          onClose={() => {
            setIsTagModalOpen(false);
            setEditingTag(null);
          }}
          onOpenTriggerModal={() => {
            setEditingTrigger(null);
            setIsTriggerModalOpen(true);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 3: TRIGGER EDITOR                                  */}
      {/* ======================================================== */}
      {isTriggerModalOpen && (
        <TriggerEditorModal
          initialTrigger={editingTrigger}
          onSave={handleSaveTrigger}
          onClose={() => {
            setIsTriggerModalOpen(false);
            setEditingTrigger(null);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 4: TAG ASSISTANT PREVIEW (Interactive Simulator)   */}
      {/* ======================================================== */}
      {isPreviewOpen && (
        <TagAssistantPreview
          tags={tags}
          triggers={triggers}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

    </div>
  );
}
