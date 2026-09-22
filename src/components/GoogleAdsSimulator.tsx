import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Search, Plus, Target, Filter, Sidebar, Users, HelpCircle, Bell, X, Download, Trash, Smartphone, Globe, ImageIcon, MoreVertical, ArrowLeft, Home, 
  ShoppingBag, Megaphone, MousePointer, CreditCard, Layout, Eye, PlayCircle, MapPin, Tag, ExternalLink, Play, Sparkles, Cloud, CheckCircle2
} from 'lucide-react';
import { marketingStore, GoogleAdsCampaign } from '../services/marketingStore';

export default function GoogleAdsSimulator({ onExit }) {
  const [view, setView] = useState('dashboard');
  const [storeState, setStoreState] = useState(marketingStore.getState());
  const [syncToast, setSyncToast] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = marketingStore.subscribe(setStoreState);
    return () => unsubscribe();
  }, []);

  const campaigns = storeState.googleAdsCampaigns;

  const [draft, setDraft] = useState(getInitialDraft());
  const [currentStep, setCurrentStep] = useState('objective'); // steps: objective, type, settings, adgroup, ads

  function getInitialDraft(goal = 'SALES', type = 'SEARCH') {
    return {
      settings: { 
        name: 'G_FR_RECHERCHE_BRAND_2024',
        goal: goal, 
        type: type, 
        budget: 20, 
        bidding: 'MAXIMIZE_CONVERSIONS', 
        location: 'Belgique', 
        language: 'Français',
        networks: { search: true, display: true }
      },
      adGroup: { 
        name: 'Groupe d\'annonces 1', 
        keywords: 'formation marketing digital\ncours google ads',
        interests: 'Marketing Digital, Entrepreneurs, Auto-entrepreneurs' 
      },
      ad: { 
        finalUrl: 'https://www.votre-site.com', 
        headlines: ['', '', '', '', ''], 
        longHeadlines: ['', ''],
        descriptions: ['', '', ''], 
        images: [], 
        logos: [], 
        videoUrl: '',
        path1: '', 
        path2: '',
        businessName: '',
        callToAction: 'LEARN_MORE'
      }
    };
  }

  const handlePublish = () => {
    const typeLabel = draft.settings.type.charAt(0) + draft.settings.type.slice(1).toLowerCase();
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335']
    });

    const isPMax = typeLabel.toLowerCase().includes('max') || draft.settings.type === 'PMAX';
    const estimatedClicks = isPMax ? '820' : '380';
    const estimatedImpressions = isPMax ? '24 000' : '4 500';
    const estimatedConversions = isPMax ? '42' : '28';

    const newCampaign: GoogleAdsCampaign = { 
      id: Date.now(), 
      name: draft.settings.name, 
      type: typeLabel === 'Search' ? 'Search' : isPMax ? 'Performance Max' : typeLabel, 
      goal: draft.settings.goal,
      status: 'active', 
      budget: `${draft.settings.budget}€/jour`, 
      clicks: estimatedClicks, 
      impressions: estimatedImpressions, 
      ctr: isPMax ? '3,42 %' : '8,44 %', 
      cpc: '0,52 €', 
      cost: `${Math.round(parseInt(estimatedClicks) * 0.52)} €`, 
      conversions: estimatedConversions 
    };

    marketingStore.publishGoogleAdsCampaign(newCampaign);
    setSyncToast(`Campagne Google Ads "${draft.settings.name}" lancée ! Données de clics et conversions injectées en direct dans GA4 (google / cpc).`);
    setTimeout(() => setSyncToast(null), 6000);
    setView('dashboard');
  };

  const updateDraft = (level: string, field: string, value: any) => {
    setDraft(prev => {
      const currentVal = prev[level][field];
      const newValue = typeof value === 'function' ? value(currentVal) : value;
      return { 
        ...prev, 
        [level]: { ...prev[level], [field]: newValue } 
      };
    });
  };

  const handleExport = () => {
    let text = "EXPORT GOOGLE ADS - SIMULATION ETUDIANT\n";
    text += "========================================\n\n";
    text += "CONFIGURATION DE LA CAMPAGNE\n";
    text += `Nom : ${draft.settings.name}\n`;
    text += `Objectif : ${draft.settings.goal}\n`;
    text += `Type : ${draft.settings.type}\n`;
    text += `Réseaux : ${draft.settings.networks.search ? 'Recherche' : ''} ${draft.settings.networks.display ? '+ Display' : ''}\n`;
    text += `Budget : ${draft.settings.budget}€/jour\n`;
    text += `Enchère : ${draft.settings.bidding}\n`;
    text += `Ciblage : ${draft.settings.location}\n`;
    text += `Nom Commercial : ${draft.ad.businessName || 'Non défini'}\n\n`;
    
    text += "GROUPES D'ANNONCES & CIBLAGE\n";
    text += `${draft.adGroup.name}\n`;
    text += "Intérêts : " + (draft.adGroup.interests || "Aucun") + "\n";
    text += "Mots-clés :\n";
    text += draft.adGroup.keywords + "\n\n";

    text += "ANNONCE\n";
    text += "Titres :\n";
    draft.ad.headlines.forEach((h, i) => { if(h) text += `- ${h}\n` });
    if (draft.ad.longHeadlines) {
      text += "Titres longs :\n";
      draft.ad.longHeadlines.forEach((h, i) => { if(h) text += `- ${h}\n` });
    }
    text += "Descriptions :\n";
    draft.ad.descriptions.forEach((d, i) => { if(d) text += `- ${d}\n` });
    text += `URL Finale : ${draft.ad.finalUrl}\n`;
    if (draft.ad.path1) text += `Chemin d'affichage : /${draft.ad.path1}/${draft.ad.path2}\n`;
    
    text += "\n========================================\n";
    text += "Généré via le Simulateur de Digital Marketing";

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export Google Ads</title></head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px;">
        <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Export de Configuration Google Ads</h1>
        <pre style="white-space: pre-wrap; font-size: 11pt; line-height: 1.5; color: #1e293b;">
${text}
        </pre>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google_ads_export_${new Date().toISOString().split('T')[0]}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const nextStep = () => {
    const sequence = ['objective', 'type', 'settings', 'adgroup', 'ads'];
    const idx = sequence.indexOf(currentStep);
    if (idx < sequence.length - 1) setCurrentStep(sequence[idx+1]);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden w-full">
      <aside className="w-16 bg-slate-900 flex flex-col items-center py-4 z-20 shrink-0 shadow-sm">
        <button onClick={onExit} className="w-10 h-10 hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white mb-8 transition-colors" title="Retour au portail"><ArrowLeft size={20} /></button>
        <nav className="flex flex-col gap-6 flex-1 w-full items-center">
          <GAdsNavItem icon={<Home size={20} />} active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <GAdsNavItem icon={<Target size={20} />} active={view === 'create'} />
          <GAdsNavItem icon={<Filter size={20} />} />
          <GAdsNavItem icon={<Sidebar size={20} />} />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {view === 'dashboard' ? (
          <div className="flex-1 flex flex-col h-full">
            <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center shadow-sm z-10 shrink-0">
               <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-900 tracking-tight">Portail Google Ads</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-widest">En direct</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-full text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                    Lié à GA4 (google / cpc)
                  </span>
               </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-slate-500 font-medium border-r border-slate-200 pr-4">Compte : <strong>EF Formation (123-456-7890)</strong></div>
                <div className="flex gap-2">
                  <button className="text-slate-400 hover:text-slate-600"><HelpCircle size={18}/></button>
                  <button className="text-slate-400 hover:text-slate-600"><Bell size={18}/></button>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-md">EF</div>
              </div>
            </header>

            {syncToast && (
              <div className="bg-teal-600 text-white px-8 py-2.5 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>{syncToast}</span>
                </div>
                <span className="text-[10px] bg-teal-700 px-2 py-0.5 rounded uppercase tracking-wider">Synchronisation Firebase & GA4</span>
              </div>
            )}
            
            <div className="p-8 bg-slate-50/50 flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">3 campagnes actives sur ce compte</p>
                  </div>
                  <button 
                    onClick={() => { setDraft(getInitialDraft()); setCurrentStep('objective'); setView('create'); }} 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                  >
                    <Plus size={16}/> Nouvelle campagne
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-400 uppercase font-black border-b border-slate-100 tracking-widest">
                        <tr>
                          <th className="px-6 py-5">État</th>
                          <th className="px-6 py-5">Campagne</th>
                          <th className="px-6 py-5">Objectif</th>
                          <th className="px-6 py-5">Type</th>
                          <th className="px-6 py-5 text-right">Budget</th>
                          <th className="px-6 py-5 text-right">Clics</th>
                          <th className="px-6 py-5 text-right font-black text-slate-900">Conversions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {campaigns.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></div>
                                  <span className="font-bold text-slate-500">{c.status === 'active' ? 'Éligible' : 'Mis en veille'}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5 font-bold text-blue-700 cursor-pointer hover:underline">{c.name}</td>
                            <td className="px-6 py-5"><span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase text-[9px] tracking-tighter">{c.goal}</span></td>
                            <td className="px-6 py-5 font-medium text-slate-600">{c.type}</td>
                            <td className="px-6 py-5 text-right font-bold text-slate-900 tracking-tight">{c.budget}</td>
                            <td className="px-6 py-5 text-right font-medium text-slate-500">{c.clicks}</td>
                            <td className="px-6 py-5 text-right font-black text-blue-600 tracking-tight group-hover:scale-110 transition-transform">{c.conversions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full bg-slate-50 absolute inset-0 z-30 overflow-hidden">
            <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center shadow-sm shrink-0 z-40">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                <div className="flex flex-col">
                   <span className="font-bold text-slate-900 text-sm tracking-tight leading-none uppercase tracking-[0.1em]">Nouvelle Campagne</span>
                   <span className="text-[10px] text-slate-400 font-bold mt-1">Étapes : {currentStep.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleExport} className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all border border-slate-200" title="Exporter la configuration (.txt)">
                  <Download size={18} />
                </button>
                {currentStep === 'ads' ? (
                  <button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all">Publier</button>
                ) : (
                  <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all">Continuer</button>
                )}
              </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
              <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto p-6 hidden md:block shrink-0 shadow-sm z-30">
                <div className="space-y-1">
                  {[
                    { id: 'objective', label: 'Objectif', sub: 'Sélection du but' },
                    { id: 'type', label: 'Type', sub: 'Format d\'affichage' },
                    { id: 'settings', label: 'Paramètres', sub: 'Budget et Lieu' },
                    { id: 'adgroup', label: 'Ciblage', sub: 'Audiences/Mots-clés' },
                    { id: 'ads', label: 'Conception', sub: 'Visuels et Textes' }
                  ].map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => setCurrentStep(s.id)} 
                      className={`p-4 rounded-2xl cursor-pointer transition-all border border-transparent ${currentStep === s.id ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50'}`}
                    >
                       <div className={`text-xs font-black uppercase tracking-widest leading-none ${currentStep === s.id ? 'text-blue-700' : 'text-slate-400'}`}>{s.label}</div>
                       <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </aside>

              <main className="flex-1 p-8 md:p-12 overflow-y-auto z-20">
                <div className="max-w-4xl mx-auto mb-32">
                   {/* STEP 1: OBJECTIVE */}
                   {currentStep === 'objective' && (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sélectionnez votre objectif</h2>
                        <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed max-w-xl">L'objectif choisi aidera Google Ads à optimiser vos réglages et à vous suggérer les meilleures fonctionnalités.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {[
                             { id: 'SALES', label: 'Ventes', icon: <ShoppingBag size={24}/>, desc: 'Générez des ventes en ligne, dans une application ou en magasin.' },
                             { id: 'LEADS', label: 'Prospects', icon: <Users size={24}/>, desc: 'Incitez les internautes à effectuer une action pour générer des contacts.' },
                             { id: 'TRAFFIC', label: 'Trafic', icon: <MousePointer size={24}/>, desc: 'Attirez les bonnes personnes sur votre site Web.' },
                             { id: 'CONSIDERATION', label: 'Produits et marque', icon: <Tag size={24}/>, desc: 'Incitez les internautes à découvrir vos produits ou services.' },
                             { id: 'AWARENESS', label: 'Notoriété', icon: <Megaphone size={24}/>, desc: 'Touchez une audience large et boostez votre notoriété.' },
                             { id: 'APP', label: 'Promotion d\'app', icon: <Smartphone size={24}/>, desc: "Générez d'avantage d'installations ou d'engagements pour votre app." }
                           ].map(obj => (
                             <div 
                                key={obj.id}
                                onClick={() => { updateDraft('settings', 'goal', obj.id); nextStep(); }}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${draft.settings.goal === obj.id ? 'border-blue-600 bg-white shadow-xl shadow-blue-500/10' : 'border-slate-200 bg-white hover:border-blue-300 shadow-sm'}`}
                             >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${draft.settings.goal === obj.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500'}`}>{obj.icon}</div>
                                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-2">{obj.label}</h3>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed leading-snug">{obj.desc}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* STEP 2: TYPE */}
                   {currentStep === 'type' && (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sélectionnez un type de campagne</h2>
                        <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed max-w-xl">Le type de campagne définit l'emplacement où les internautes verront vos annonces.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {[
                             { id: 'SEARCH', label: 'Recherche', icon: <Search size={24}/>, desc: 'Annonces textuelles diffusées sur les moteurs de recherche.' },
                             { id: 'PMAX', label: 'Performance Max', icon: <Target size={24}/>, desc: 'Campagne tout-en-un sur tout le réseau Google (YouTube, Gmail...).' },
                             { id: 'DISPLAY', label: 'Display', icon: <Layout size={24}/>, desc: 'Bannières graphiques diffusées sur des millions de sites partenaires.' },
                             { id: 'SHOPPING', label: 'Shopping', icon: <ShoppingBag size={24}/>, desc: 'Fiches produits visuelles pour booster votre e-commerce.' },
                             { id: 'VIDEO', label: 'Vidéo', icon: <PlayCircle size={24}/>, desc: 'Annonces vidéo sur YouTube et sur le Web.' },
                             { id: 'APP', label: 'Application', icon: <Smartphone size={24}/>, desc: 'Campagnes automatisées spécialisées pour le mobile.' }
                           ].map(t => (
                             <div 
                                key={t.id}
                                onClick={() => { updateDraft('settings', 'type', t.id); nextStep(); }}
                                className={`p-8 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${draft.settings.type === t.id ? 'border-blue-600 bg-white shadow-xl shadow-blue-500/10' : 'border-slate-200 bg-white hover:border-blue-300 shadow-sm'}`}
                             >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${draft.settings.type === t.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{t.icon}</div>
                                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-3">{t.label}</h3>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed leading-snug">{t.desc}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* STEP 3: SETTINGS */}
                   {currentStep === 'settings' && (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-10">Paramètres généraux</h2>
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                           <div className="p-10 space-y-10">
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nom de la campagne</label>
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Conseil : PAYS_LANGUE_PLATEFORME_NOM</span>
                                 </div>
                                 <input type="text" value={draft.settings.name} onChange={e => updateDraft('settings', 'name', e.target.value)} className="w-full text-xl font-bold p-0 border-none outline-none focus:ring-0 placeholder:text-slate-200 bg-transparent text-slate-900" />
                                 <div className="h-px bg-slate-100"></div>
                              </div>

                              <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Réseaux de diffusion</label>
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                       <div className="flex flex-col">
                                          <span className="text-sm font-bold">Réseau de Recherche</span>
                                          <span className="text-[10px] text-slate-400">Les annonces s'affichent à côté des résultats de recherche.</span>
                                       </div>
                                       <input type="checkbox" checked={draft.settings.networks.search} onChange={e => updateDraft('settings', 'networks', {...draft.settings.networks, search: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                                       <div className="flex flex-col">
                                          <span className="text-sm font-bold">Inclure le Réseau Display</span>
                                          <span className="text-[10px] text-slate-400 italic">Attention : Souvent activé par défaut, augmente la portée mais réduit la précision.</span>
                                       </div>
                                       <input type="checkbox" checked={draft.settings.networks.display} onChange={e => updateDraft('settings', 'networks', {...draft.settings.networks, display: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-blue-600" />
                                    </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                 <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Budget quotidien (€)</label>
                                    <div className="relative group">
                                       <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">€</span>
                                       <input type="number" value={draft.settings.budget} onChange={e => updateDraft('settings', 'budget', e.target.value)} className="w-full pl-10 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                                    </div>
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Type d'enchère</label>
                                    <select 
                                       value={draft.settings.bidding} 
                                       onChange={e => updateDraft('settings', 'bidding', e.target.value)}
                                       className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                    >
                                       <option value="MAXIMIZE_CONVERSIONS">Maximiser les conversions</option>
                                       <option value="MAXIMIZE_CLICKS">Maximiser les clics</option>
                                       <option value="MAXIMIZE_VALUE">Maximiser la valeur de conversion</option>
                                       <option value="TARGET_CPA">CPA Cible (Automatisé)</option>
                                    </select>
                                 </div>
                              </div>

                              <div className="space-y-3">
                                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Lieu géographique</label>
                                 <div className="relative">
                                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input type="text" value={draft.settings.location} onChange={e => updateDraft('settings', 'location', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* STEP 4: ADGROUP */}
                   {currentStep === 'adgroup' && (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Configuration du ciblage</h2>
                        <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed">Divisez vos campagnes en sous-ensembles thématiques.</p>
                        
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-10 space-y-10">
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nom du groupe d'annonces</label>
                              <input type="text" value={draft.adGroup.name} onChange={e => updateDraft('adGroup', 'name', e.target.value)} className="w-full text-lg font-bold p-0 border-none outline-none focus:ring-0 bg-transparent text-slate-900" />
                              <div className="h-px bg-slate-100"></div>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                              <div className="space-y-6">
                                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Option A : Mots-clés stratégiques</h3>
                                 <div className="p-6 bg-slate-900 rounded-3xl border-4 border-slate-100 shadow-inner">
                                    <textarea 
                                       value={draft.adGroup.keywords} 
                                       onChange={e => updateDraft('adGroup', 'keywords', e.target.value)} 
                                       className="w-full h-64 bg-transparent text-slate-300 font-mono text-xs leading-relaxed outline-none resize-none focus:text-white transition-colors"
                                       placeholder="Ex: formation facebook ads&#10;cours instagram marketing&#10;[expert meta ads]"
                                    />
                                 </div>
                                 <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-[9px] font-black text-blue-700 leading-relaxed uppercase tracking-widest leading-snug">Rappel correspondance :&#10;Large (mot)&#10;Expression ("mot")&#10;Exact ([mot])</p>
                                 </div>
                              </div>

                              <div className="space-y-6">
                                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Option B : Segments d'Audience (Intérêts)</h3>
                                 <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl space-y-4">
                                    <p className="text-[11px] text-slate-500 italic">Recherchez ou sélectionnez des intérêts associés à votre cible.</p>
                                    <textarea 
                                       value={draft.adGroup.interests} 
                                       onChange={e => updateDraft('adGroup', 'interests', e.target.value)} 
                                       className="w-full h-40 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                       placeholder="Tapez ici les centres d'intérêt (ex: Entrepreneurs, Marketing...)"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                       {['Shopping', 'Luxe', 'Technologie', 'Parentalité'].map(tag => (
                                          <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-400 rounded text-[9px] font-black uppercase cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition-colors">+{tag}</span>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* STEP 5: DESIGN */}
                   {currentStep === 'ads' && (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-10">
                           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Conception de l'annonce</h2>
                           <div className="flex gap-2">
                              {['SEARCH', 'DISPLAY', 'VIDEO'].includes(draft.settings.type) && (
                                 <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-200">RSA Format</span>
                              )}
                           </div>
                        </div>

                        <div className="flex flex-col xl:flex-row gap-12 items-start">
                           <div className="flex-1 space-y-8 w-full">
                              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 space-y-10">
                                 <div className="space-y-3">
                                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">URL finale</label>
                                     <input 
                                       type="text" 
                                       value={draft.ad.finalUrl} 
                                       onChange={e => updateDraft('ad', 'finalUrl', e.target.value)} 
                                       className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" 
                                       placeholder="https://www.votre-site.com"
                                     />
                                  </div>

                                  {['DISPLAY', 'PMAX'].includes(draft.settings.type) && (
                                    <div className="space-y-4">
                                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nom de l'entreprise</label>
                                       <input 
                                         type="text" 
                                         value={draft.ad.businessName} 
                                         onChange={e => updateDraft('ad', 'businessName', e.target.value)} 
                                         className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner" 
                                         placeholder="Ex: EFP Formation"
                                         maxLength={25}
                                       />
                                    </div>
                                  )}

                                  {/* Dynamic form based on type */}
                                  {['SEARCH', 'PMAX'].includes(draft.settings.type) && (
                                    <>
                                       <div className="space-y-6">
                                          <div className="flex justify-between items-center">
                                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Titres (30 car. max)</label>
                                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Ajoutés : {draft.ad.headlines.filter(h => h).length}/15</span>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {draft.ad.headlines.map((hl, i) => (
                                               <div key={i} className="space-y-1 relative group">
                                                  {draft.ad.headlines.length > 3 && (
                                                    <button 
                                                      onClick={() => updateDraft('ad', 'headlines', (prev: string[]) => prev.filter((_, idx) => idx !== i))}
                                                      className="absolute -right-2 -top-2 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                                                    >
                                                      <X size={10} />
                                                    </button>
                                                  )}
                                                 <input 
                                                   type="text" 
                                                   value={hl} 
                                                   maxLength={30}
                                                   onChange={e => {
                                                     updateDraft('ad', 'headlines', (prev: string[]) => {
                                                       const n = [...prev];
                                                       n[i] = e.target.value;
                                                       return n;
                                                     });
                                                   }} 
                                                   className={`w-full px-6 py-4 rounded-2xl border font-bold focus:ring-2 focus:ring-blue-500 transition-all text-xs ${hl.length >= 30 ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`} 
                                                   placeholder={`Titre ${i+1}`} 
                                                 />
                                                 <div className={`text-[9px] text-right font-black uppercase tracking-widest px-2 ${hl.length >= 30 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>{hl.length} / 30</div>
                                               </div>
                                             ))}
                                             {draft.ad.headlines.length < 15 && (
                                               <button 
                                                 onClick={() => updateDraft('ad', 'headlines', (prev: string[]) => [...prev, ''])}
                                                 className="h-14 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                               >
                                                 + Ajouter un titre
                                               </button>
                                             )}
                                          </div>
                                       </div>

                                       {draft.settings.type === 'PMAX' && (
                                         <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Titres longs (90 car. max)</label>
                                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Ajoutés : {draft.ad.longHeadlines?.filter(h => h).length}/5</span>
                                            </div>
                                            <div className="space-y-4">
                                               {draft.ad.longHeadlines?.map((hl, i) => (
                                                 <div key={i} className="space-y-1 relative group">
                                                    {draft.ad.longHeadlines.length > 1 && (
                                                      <button 
                                                        onClick={() => updateDraft('ad', 'longHeadlines', (prev: string[]) => prev.filter((_, idx) => idx !== i))}
                                                        className="absolute -right-2 -top-2 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                                                      >
                                                        <X size={10} />
                                                      </button>
                                                    )}
                                                    <input 
                                                      type="text" 
                                                      value={hl} 
                                                      maxLength={90}
                                                      onChange={e => {
                                                        updateDraft('ad', 'longHeadlines', (prev: string[]) => {
                                                          const n = [...prev];
                                                          n[i] = e.target.value;
                                                          return n;
                                                        });
                                                      }} 
                                                      className={`w-full px-6 py-4 rounded-2xl border font-bold focus:ring-2 focus:ring-blue-500 transition-all text-xs ${hl.length >= 90 ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`} 
                                                      placeholder={`Titre long ${i+1}`} 
                                                    />
                                                    <div className={`text-[9px] text-right font-black uppercase tracking-widest px-2 ${hl.length >= 90 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>{hl.length} / 90</div>
                                                 </div>
                                               ))}
                                               {draft.ad.longHeadlines?.length < 5 && (
                                                 <button 
                                                   onClick={() => updateDraft('ad', 'longHeadlines', (prev: string[]) => [...prev, ''])}
                                                   className="w-full h-14 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                                 >
                                                   + Ajouter un titre long
                                                 </button>
                                               )}
                                            </div>
                                         </div>
                                       )}

                                       <div className="space-y-6">
                                          <div className="flex justify-between items-center">
                                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Descriptions (90 car. max)</label>
                                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Ajoutées : {draft.ad.descriptions.filter(d => d).length}/4</span>
                                          </div>
                                          <div className="space-y-4">
                                             {draft.ad.descriptions.map((desc, i) => (
                                                <div key={i} className="space-y-1 relative group">
                                                  {draft.ad.descriptions.length > 2 && (
                                                    <button 
                                                      onClick={() => updateDraft('ad', 'descriptions', (prev: string[]) => prev.filter((_, idx) => idx !== i))}
                                                      className="absolute -right-2 -top-2 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                                                    >
                                                      <X size={10} />
                                                    </button>
                                                  )}
                                                  <textarea 
                                                     value={desc} 
                                                     maxLength={90}
                                                     onChange={e => {
                                                        updateDraft('ad', 'descriptions', (prev: string[]) => {
                                                           const n = [...prev];
                                                           n[i] = e.target.value;
                                                           return n;
                                                        });
                                                     }}
                                                     className={`w-full h-24 p-6 rounded-3xl border font-bold focus:ring-2 focus:ring-blue-500 transition-all text-xs resize-none ${desc.length >= 90 ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`}
                                                     placeholder={`Description ${i+1}`}
                                                  />
                                                  <div className="flex justify-between items-center px-4">
                                                    <span className="text-[9px] font-bold text-slate-300">Minimum 2 recommandées</span>
                                                    <div className={`text-[9px] font-black uppercase tracking-widest ${desc.length >= 90 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>{desc.length} / 90</div>
                                                  </div>
                                                </div>
                                             ))}
                                             {draft.ad.descriptions.length < 5 && (
                                               <button 
                                                 onClick={() => updateDraft('ad', 'descriptions', (prev: string[] = []) => [...prev, ''])}
                                                 className="w-full h-14 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all mt-4"
                                               >
                                                 + Ajouter une description
                                               </button>
                                             )}
                                          </div>
                                       </div>
                                    </>
                                  )}

                                 {/* Display/PMax Images */}
                                 {['DISPLAY', 'PMAX', 'SALES'].includes(draft.settings.type) && (
                                    <div className="space-y-6">
                                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Images (Ratio 1.91:1 et 1:1)</label>
                                       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                          {draft.ad.images.map((img, i) => (
                                            <div key={i} className="relative aspect-square rounded-3xl overflow-hidden border border-slate-200">
                                              <img src={img} className="w-full h-full object-cover" alt={`Upload ${i}`} />
                                              <button 
                                                onClick={() => updateDraft('ad', 'images', draft.ad.images.filter((_, idx) => idx !== i))}
                                                className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 hover:bg-white"
                                              >
                                                <Trash size={14}/>
                                              </button>
                                            </div>
                                          ))}
                                          {draft.ad.images.length < 15 && (
                                            <label className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                                               <input 
                                                 type="file" 
                                                 accept="image/*" 
                                                 className="hidden" 
                                                 onChange={e => {
                                                   const file = e.target.files?.[0];
                                                   if (file) {
                                                     const reader = new FileReader();
                                                     reader.onloadend = () => updateDraft('ad', 'images', [...draft.ad.images, reader.result]);
                                                     reader.readAsDataURL(file);
                                                   }
                                                 }}
                                               />
                                               <ImageIcon size={24} className="text-slate-300 mb-2"/>
                                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléverser</span>
                                            </label>
                                          )}
                                       </div>
                                    </div>
                                 )}

                                  {/* Logos Selection */}
                                  {['DISPLAY', 'PMAX', 'SALES'].includes(draft.settings.type) && (
                                     <div className="space-y-6">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Logos (Ratio 1:1 ou 4:1)</label>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                           {draft.ad.logos?.map((logo, i) => (
                                             <div key={i} className="relative aspect-square rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 p-4">
                                               <img src={logo} className="w-full h-full object-contain" alt={`Logo ${i}`} />
                                               <button 
                                                 onClick={() => updateDraft('ad', 'logos', (prev: string[]) => prev.filter((_, idx) => idx !== i))}
                                                 className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 hover:bg-white transition-colors"
                                               >
                                                 <Trash size={14}/>
                                               </button>
                                             </div>
                                           ))}
                                           {draft.ad.logos?.length < 5 && (
                                             <label className="aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                                                <input 
                                                  type="file" 
                                                  accept="image/*" 
                                                  className="hidden" 
                                                  onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                      const reader = new FileReader();
                                                      reader.onloadend = () => updateDraft('ad', 'logos', (prev: string[]) => [...prev, reader.result]);
                                                      reader.readAsDataURL(file);
                                                    }
                                                  }}
                                                />
                                                <Megaphone size={24} className="text-slate-300 mb-2"/>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo</span>
                                             </label>
                                           )}
                                        </div>
                                     </div>
                                  )}

                                 {/* Video selection */}
                                 {['VIDEO', 'PMAX'].includes(draft.settings.type) && (
                                    <div className="space-y-6 text-xs">
                                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Vidéo (Fichier ou URL)</label>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <label className="aspect-video bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                                             <input 
                                                type="file" 
                                                accept="video/*" 
                                                className="hidden" 
                                                onChange={e => {
                                                   const file = e.target.files?.[0];
                                                   if (file) {
                                                      const reader = new FileReader();
                                                      reader.onloadend = () => updateDraft('ad', 'videoUrl', reader.result);
                                                      reader.readAsDataURL(file);
                                                   }
                                                }}
                                             />
                                             {draft.ad.videoUrl && draft.ad.videoUrl.startsWith('data:video') ? (
                                                <video src={draft.ad.videoUrl} className="w-full h-full object-cover rounded-3xl" />
                                             ) : (
                                                <><Play size={24} className="text-slate-300 mb-2"/><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléverser Vidéo</span></>
                                             )}
                                          </label>
                                          <div className="space-y-4">
                                             <div className="relative group">
                                                <Play size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                                <input type="text" value={draft.ad.videoUrl && !draft.ad.videoUrl.startsWith('data:video') ? draft.ad.videoUrl : ''} onChange={e => updateDraft('ad', 'videoUrl', e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold shadow-inner" placeholder="Ou lien YouTube..." />
                                             </div>
                                             <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                                <p className="text-[9px] text-blue-700 font-bold uppercase leading-relaxed">Simulateur : Le téléchargement direct permet un aperçu immédiat sans quitter l'outil.</p>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>

                           <aside className="w-full xl:w-[400px] sticky top-0 shrink-0">
                              <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-800 relative overflow-hidden">
                                 {/* Search Preview */}
                                 {draft.settings.type === 'SEARCH' && (
                                    <div className="animate-in zoom-in-95 duration-500">
                                       <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                                          <div className="flex items-center gap-2">
                                             <Globe size={14} className="text-slate-500" />
                                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Google Search</span>
                                          </div>
                                          <div className="px-2 py-0.5 bg-blue-500 text-white rounded font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-500/20">Annonce</div>
                                       </div>
                                       <div className="space-y-4">
                                          <div className="text-xs text-slate-500 font-bold tracking-tight uppercase flex items-center gap-1">
                                             {draft.ad.finalUrl ? new URL(draft.ad.finalUrl.startsWith('http') ? draft.ad.finalUrl : `https://${draft.ad.finalUrl}`).hostname : 'www.votre-site.com'}
                                             {(draft.ad.path1 || draft.ad.path2) && <span className="text-slate-700">/ {draft.ad.path1} / {draft.ad.path2}</span>}
                                          </div>
                                          <div className="text-2xl font-black text-blue-400 leading-tight tracking-tight hover:underline cursor-pointer">
                                             {draft.ad.headlines.filter(h => h).slice(0, 2).join(' | ') || 'Votre Titre Accrocheur Ici'}
                                          </div>
                                          <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-3">
                                             {draft.ad.descriptions.filter(d => d)[0] || 'La description de votre annonce RSA apparaîtra ici pour convaincre vos futurs clients de cliquer.'}
                                          </p>
                                       </div>
                                    </div>
                                 )}

                                 {/* Display/PMax Preview */}
                                 {['DISPLAY', 'PMAX'].includes(draft.settings.type) && (
                                    <div className="animate-in zoom-in-95 duration-500 flex flex-col w-full">
                                       <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-6">
                                          <div className="p-4 flex items-center justify-between border-b border-slate-50">
                                             <div className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-tight">
                                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center p-1">
                                                   {draft.ad.logos?.[0] ? <img src={draft.ad.logos[0]} className="w-full h-full object-contain" /> : <ImageIcon size={12} className="text-slate-300" />}
                                                </div>
                                                {draft.ad.businessName || 'Entreprise'}
                                             </div>
                                             <ExternalLink size={12} className="text-slate-400"/>
                                          </div>
                                          <div className="aspect-video bg-slate-100 relative group overflow-hidden">
                                             {draft.ad.images[0] ? <img src={draft.ad.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-slate-300"><ImageIcon size={48}/><span className="text-[10px] mt-2 font-black uppercase">Visuel Ad</span></div>}
                                             <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                <div className="text-white text-sm font-black uppercase tracking-tight mb-1">{draft.ad.headlines[0] || 'Titre Accrocheur'}</div>
                                                <div className="text-white/70 text-[10px] font-bold line-clamp-2">{draft.ad.longHeadlines?.[0] || draft.ad.descriptions[0] || 'Votre description de campagne...'}</div>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="text-center">
                                          <h4 className="text-white font-black uppercase tracking-widest mb-3">Aperçu Réseau Display / PMax</h4>
                                          <p className="text-slate-500 text-xs font-medium leading-relaxed">Google générera dynamiquement des milliers de combinaisons basées sur vos ressources.</p>
                                       </div>
                                    </div>
                                 )}

                                 {/* Video Preview */}
                                 {draft.settings.type === 'VIDEO' && (
                                    <div className="animate-in zoom-in-95 duration-500 flex flex-col w-full text-center">
                                       <div className="aspect-video bg-slate-800 rounded-3xl overflow-hidden mb-6 relative shadow-2xl border border-slate-700">
                                          {draft.ad.videoUrl ? (
                                             draft.ad.videoUrl.startsWith('data:video') ? (
                                               <video src={draft.ad.videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
                                             ) : (
                                               <div className="w-full h-full flex items-center justify-center text-white text-[10px] font-black uppercase">Source externe : {draft.ad.videoUrl.substring(0, 30)}...</div>
                                             )
                                          ) : <div className="w-full h-full flex items-center justify-center text-slate-600"><PlayCircle size={48} /></div>}
                                       </div>
                                       <h4 className="text-white font-black uppercase tracking-widest mb-2">Aperçu YouTube Ad</h4>
                                       <p className="text-slate-500 text-xs font-medium">{draft.ad.headlines[0]}</p>
                                    </div>
                                 )}

                                 <div className="mt-12 p-6 bg-slate-800/40 rounded-3xl border border-slate-800 flex items-center justify-between">
                                    <div className="space-y-1">
                                       <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Efficacité de l'annonce</div>
                                       <div className="text-lg font-black text-white tracking-tighter">Excellent</div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center font-black text-green-500 text-xs shadow-[0_0_15px_rgba(34,197,94,0.3)]">98%</div>
                                 </div>
                              </div>
                           </aside>
                        </div>
                     </div>
                   )}
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GAdsNavItem({ icon, active = false, onClick = () => {} }) {
  return (
    <div onClick={onClick} className={`p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>{icon}</div>
  );
}

function AlertCircle({ size, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
