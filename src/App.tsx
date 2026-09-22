/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Layout, BarChart2, Search, ArrowRight, Compass, Check, Tag, Mail, PieChart,
  Database, Cloud, Sparkles, RefreshCw
} from 'lucide-react';
import MetaAdsSimulator from './components/MetaAdsSimulator';
import GA4Simulator from './components/GA4Simulator';
import GoogleAdsSimulator from './components/GoogleAdsSimulator';
import ReportingLab from './components/ReportingLab';
import GTMSimulator from './components/GTMSimulator';
import MailchimpSimulator from './components/MailchimpSimulator';
import DataStudioDashboard from './components/DataStudioDashboard';
import MemorySyncModal from './components/MemorySyncModal';
import { marketingStore } from './services/marketingStore';

export default function App() {
  const [currentApp, setCurrentApp] = useState('hub');
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [storeState, setStoreState] = useState(marketingStore.getState());

  useEffect(() => {
    const unsubscribe = marketingStore.subscribe(setStoreState);
    return () => unsubscribe();
  }, []);

  if (currentApp === 'gtm') return <GTMSimulator onExit={() => setCurrentApp('hub')} />;
  if (currentApp === 'meta') return <MetaAdsSimulator onExit={() => setCurrentApp('hub')} />;
  if (currentApp === 'ga4') return <GA4Simulator onExit={() => setCurrentApp('hub')} />;
  if (currentApp === 'googleads') return <GoogleAdsSimulator onExit={() => setCurrentApp('hub')} />;
  if (currentApp === 'mailchimp') return <MailchimpSimulator onExit={() => setCurrentApp('hub')} />;
  if (currentApp === 'datastudio') return <DataStudioDashboard onExit={() => setCurrentApp('hub')} />;
  if (currentApp === 'reporting') return <ReportingLab onExit={() => setCurrentApp('hub')} />;

  const totalCampaigns = storeState.metaCampaigns.length + storeState.googleAdsCampaigns.length;
  const totalPixels = storeState.pixels.length;

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-50 p-8 font-sans overflow-y-auto">
      {/* Top Firebase & Cross-Tool Sync Ribbon */}
      <div className="max-w-6xl w-full mb-6 flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Cloud size={18} />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Mémoire & Synchronisation Cross-Outils</span>
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {storeState.isFirebaseConnected ? 'Firebase Firestore Connecté' : 'Mémoire Locale Active'}
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              {totalCampaigns} campagne(s) active(s) • {totalPixels} pixel(s) Meta • Données répercutées en temps réel dans GA4
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMemoryModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Database size={14} />
          <span>Gérer la Mémoire (Export / Import JSON)</span>
        </button>
      </div>

      <div className="max-w-6xl w-full text-center mt-2 mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-200 shadow-sm">
           <Compass size={14} /> Plateforme d'Entraînement Professionnel • EFP Digital Academy
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
          Simulateur <span className="text-blue-600">Marketing & Analytics</span>
        </h1>
        <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Pratiquez sur des interfaces réalistes interconnectées : balisage GTM, campagnes Meta & Google reliées à GA4, newsletters Mailchimp et tableaux de bord Looker Studio.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl w-full px-4">
        {/* Google Tag Manager */}
        <div 
          onClick={() => setCurrentApp('gtm')} 
          className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-slate-100 hover:border-blue-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-5 relative z-10 group-hover:rotate-6 transition-transform shadow-md shadow-blue-500/20">
              <Tag size={24} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Tag Manager</h2>
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-black uppercase rounded">GTM</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs font-medium mb-6">
              Configurez vos balises (GA4, Pixel Meta), déclencheurs et testez en direct avec l'inspecteur Tag Assistant.
            </p>
          </div>
          <div className="flex items-center text-blue-600 font-bold text-[11px] uppercase tracking-wider">
            Ouvrir GTM <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* Meta Ads */}
        <div 
          onClick={() => setCurrentApp('meta')} 
          className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-slate-100 hover:border-blue-200 group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-5 relative z-10 group-hover:rotate-6 transition-transform shadow-md shadow-blue-500/20">
              <Layout size={24} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Meta Ads & Pixel</h2>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded">Events Manager</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs font-medium mb-6">
              Campagnes publicitaires, audiences Lookalike et Gestionnaire d'événements (Pixel Meta & CAPI en direct).
            </p>
          </div>
          <div className="flex items-center text-blue-600 font-bold text-[11px] uppercase tracking-wider">
            Gérer Meta <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
        
        {/* GA4 */}
        <div 
          onClick={() => setCurrentApp('ga4')} 
          className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-slate-100 hover:border-indigo-200 group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center mb-5 relative z-10 group-hover:rotate-6 transition-transform shadow-md shadow-indigo-500/20">
              <BarChart2 size={24} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Analytics GA4</h2>
              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase rounded">Funnel & Key Events</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs font-medium mb-6">
              Entonnoir d'achat (Funnel), activité en Temps Réel et configuration des Événements Clés (Key Events).
            </p>
          </div>
          <div className="flex items-center text-indigo-600 font-bold text-[11px] uppercase tracking-wider">
            Explorer GA4 <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* Google Ads */}
        <div 
          onClick={() => setCurrentApp('googleads')} 
          className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-slate-100 hover:border-teal-200 group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-teal-500 text-white rounded-2xl flex items-center justify-center mb-5 relative z-10 group-hover:rotate-6 transition-transform shadow-md shadow-teal-500/20">
              <Search size={24} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Google Ads</h2>
              <span className="px-1.5 py-0.5 bg-teal-100 text-teal-800 text-[9px] font-black uppercase rounded">Search</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs font-medium mb-6">
              Responsive Search Ads, mots-clés (Broad/Phrase/Exact) et stratégies d'enchères intelligentes.
            </p>
          </div>
          <div className="flex items-center text-teal-600 font-bold text-[11px] uppercase tracking-wider">
            Campagnes Ads <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* Mailchimp Newsletter */}
        <div 
          onClick={() => setCurrentApp('mailchimp')} 
          className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-slate-100 hover:border-amber-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-amber-400 text-slate-900 rounded-2xl flex items-center justify-center mb-5 relative z-10 group-hover:rotate-6 transition-transform shadow-md shadow-amber-400/20 font-black">
              <Mail size={24} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Mailchimp & Email</h2>
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-black uppercase rounded">Builder & Stats</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs font-medium mb-6">
              Concepteur visuel de newsletters, mise en page modulaire et tableau de bord de statistiques (Taux d'ouverture, clics, délivrabilité).
            </p>
          </div>
          <div className="flex items-center text-amber-700 font-bold text-[11px] uppercase tracking-wider">
            Créer Newsletter <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* Looker Studio Dashboard Builder */}
        <div 
          onClick={() => setCurrentApp('datastudio')} 
          className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-slate-100 hover:border-blue-400 group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-5 relative z-10 group-hover:rotate-6 transition-transform shadow-md shadow-blue-500/20">
              <PieChart size={24} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Dashboard & Reporting</h2>
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-black uppercase rounded">Looker Studio</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs font-medium mb-6">
              Créez votre propre tableau de bord personnalisé, combinez les données multi-canaux et exportez des rapports clients (PDF / CSV).
            </p>
          </div>
          <div className="flex items-center text-blue-600 font-bold text-[11px] uppercase tracking-wider">
            Bâtir un Dashboard <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* Reporting & Exercices */}
        <div 
          onClick={() => setCurrentApp('reporting')} 
          className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-slate-100 hover:border-purple-300 group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-5 relative z-10 group-hover:rotate-6 transition-transform shadow-md shadow-purple-600/20">
              <BarChart2 size={24} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Exercices & Quiz</h2>
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-black uppercase rounded">Auto-évaluation</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs font-medium mb-6">
              Exercices pratiques corrigés, questions types d'examen, formules ROAS et fiches récapitulatives.
            </p>
          </div>
          <div className="flex items-center text-purple-600 font-bold text-[11px] uppercase tracking-wider">
            S'entraîner <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>

      <footer className="mt-16 border-t border-slate-200 pt-8 w-full max-w-6xl px-4 flex flex-col md:flex-row justify-between items-center gap-4 border-dashed">
         <div className="flex items-center gap-2">
            <Compass size={18} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Environnement de simulation EFP Digital</span>
         </div>
         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Suite Marketing Digital & Analytics v3.0 • GTM, Meta, GA4, Mailchimp & Looker Studio
         </div>
      </footer>

      {/* Memory & Firebase Sync Modal */}
      <MemorySyncModal 
        isOpen={isMemoryModalOpen} 
        onClose={() => setIsMemoryModalOpen(false)} 
      />
    </div>
  );
}
