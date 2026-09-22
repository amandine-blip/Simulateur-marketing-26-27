import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Layout, Megaphone, Users, CreditCard, Plus, Search, X, 
  ChevronRight, Image as ImageIcon, MoreVertical, Folder, 
  MousePointer, BarChart2, MessageSquare, Smartphone, Edit, 
  ChevronDown, AlertCircle, Calendar, ArrowLeft, Filter,
  FileText, Trash, MapPin, Download, Play, ChevronLeft, Instagram, Facebook,
  Bell, Globe, BarChart3, Calculator, Link, ExternalLink, MousePointer2,
  Activity, Cloud, Sparkles, CheckCircle2
} from 'lucide-react';
import MetaEventsManager from './MetaEventsManager';
import { marketingStore, MetaCampaign, MetaPixel } from '../services/marketingStore';

export default function MetaAdsSimulator({ onExit }) {
  const [view, setView] = useState('dashboard'); // dashboard, create, audiences, events_manager
  const [storeState, setStoreState] = useState(marketingStore.getState());

  useEffect(() => {
    const unsubscribe = marketingStore.subscribe(setStoreState);
    return () => unsubscribe();
  }, []);

  const [createdAudiences, setCreatedAudiences] = useState([
    { id: '1', name: 'Retargeting Visiteurs 30j', type: 'CUSTOM', source: 'PIXEL', retention: 30, event: 'all_visitors' },
    { id: '2', name: 'LAL Acheteurs 1% - FR', type: 'LOOKALIKE', source: 'PIXEL', ratio: 1, country: 'France' }
  ]);
  const [isCreatingAudience, setIsCreatingAudience] = useState(null);
  
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState('TRAFFIC');
  const [syncToast, setSyncToast] = useState<string | null>(null);
  
  const campaigns = storeState.metaCampaigns;

  const [draft, setDraft] = useState(getInitialDraft('TRAFFIC'));
  const [currentStep, setCurrentStep] = useState('campaign');

  function getInitialDraft(objective = 'TRAFFIC') {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    
    return {
      campaign: { name: 'Nouvelle campagne', objective: objective, specialCategory: 'NONE' },
      adSet: { 
        name: 'Nouvel ensemble de publicités', 
        budgetType: 'DAILY', budget: 20, 
        startDate: today.toISOString().split('T')[0],
        startTime: '09:00',
        endDate: nextMonth.toISOString().split('T')[0],
        endTime: '23:59',
        conversionLocation: 'WEBSITE',
        performanceGoal: 'MAX_CONVERSIONS',
        pixel: 'Pixel de Amandine Vanderbecq',
        conversionEvent: 'VIEW_CONTENT',
        audienceMode: 'ADVANTAGE_PLUS', // ADVANTAGE_PLUS or TRADITIONAL
        locations: 'Belgique', ageMin: '18', ageMax: '65+', detailedTargeting: '',
        customAudiences: '',
        customAudienceSource: 'WEBSITE', // WEBSITE, FB_PAGE, IG_PROFILE
        lookalikePercentage: '1',
        placements: 'ADVANTAGE', manualPlacements: { facebook: true, instagram: true, audienceNetwork: true, messenger: true } 
      },
      ad: { 
        adSetup: 'CREATE', format: 'SINGLE_IMAGE', primaryText: '', headline: '', callToAction: 'LEARN_MORE', 
        url: '', urlParameters: '', pixelActive: false, 
        facebookPage: 'Les Licornes du Marketing 🦄', 
        instagramAccount: 'Utiliser la page sélectionnée', 
        mediaType: 'IMAGE', // IMAGE or VIDEO
        videoUrl: '',
        media: { feeds: '', stories: '', reels: '' },
        carouselCards: [
          { id: 1, image: '', headline: 'Titre de la carte 1', description: 'Description facultative', url: '' },
          { id: 2, image: '', headline: 'Titre de la carte 2', description: 'Description facultative', url: '' }
        ]
      }
    };
  }

  const handleOpenCreateModal = () => {
    setSelectedObjective('TRAFFIC');
    setIsObjectiveModalOpen(true);
  };

  const startCreationFlow = () => {
    setDraft(getInitialDraft(selectedObjective));
    setCurrentStep('campaign');
    setIsObjectiveModalOpen(false);
    setView('create');
  };

  const handleEdit = (campaignToEdit) => {
    setDraft({
      ...getInitialDraft(campaignToEdit.objective),
      campaign: { ...getInitialDraft(campaignToEdit.objective).campaign, name: campaignToEdit.name, objective: campaignToEdit.objective }
    });
    setCurrentStep('campaign');
    setView('create');
  };

  const handleDuplicate = (campaignToDuplicate) => {
    const newCampaign = { 
      ...campaignToDuplicate, 
      id: Date.now(), 
      name: `${campaignToDuplicate.name} - Copie`,
      status: 'paused', 
      delivery: 'Brouillon',
      amountSpent: '0,00 €', results: '-', reach: '-', impressions: '-', purchases: '-'
    };
    marketingStore.publishMetaCampaign(newCampaign);
  };

  const handlePublish = () => {
    const resultsVal = draft.campaign.objective === 'AWARENESS' ? '12 450' : draft.campaign.objective === 'TRAFFIC' ? '450' : '18';
    const purchasesVal = draft.campaign.objective === 'SALES' || draft.adSet.conversionEvent === 'PURCHASE' ? '12' : '2';

    const newCampaign: MetaCampaign = {
      id: Date.now(), 
      name: draft.campaign.name, 
      status: 'active', 
      delivery: 'Actif',
      budget: `${draft.adSet.budget},00 € / ${draft.adSet.budgetType === 'DAILY' ? 'jour' : 'global'}`,
      amountSpent: '0,00 €', 
      results: resultsVal, 
      reach: '4 800', 
      impressions: '12 500', 
      cpc: '0,42 €', 
      landingPageViews: '410', 
      postReactions: '85', 
      postComments: '12', 
      postSaves: '9', 
      postShares: '4', 
      engagementRate: '4,2 %', 
      purchases: purchasesVal, 
      objective: draft.campaign.objective,
      pixelName: draft.adSet.pixel
    };

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#10b981', '#ffffff']
    });

    marketingStore.publishMetaCampaign(newCampaign);
    setSyncToast(`Campagne "${draft.campaign.name}" publiée ! Trafic injecté dans Google Analytics 4 (facebook / cpc).`);
    setTimeout(() => setSyncToast(null), 6000);
    setView('dashboard');
  };

  const handleToggleStatus = (id) => {
    const camp = campaigns.find(c => c.id === id);
    if (camp) {
      const isNowActive = camp.status !== 'active';
      marketingStore.publishMetaCampaign({
        ...camp,
        status: isNowActive ? 'active' : 'paused',
        delivery: isNowActive ? 'Actif' : 'Désactivé'
      });
    }
  };

  const updateDraft = (level, field, value) => {
    setDraft(prev => ({ ...prev, [level]: { ...prev[level], [field]: value } }));
  };

  const handleExport = () => {
    let text = "EXPORT META ADS - SIMULATION ETUDIANT\n";
    text += "======================================\n\n";
    text += "IDÉNTITÉ\n";
    text += `Page Facebook : ${draft.ad.facebookPage}\n`;
    text += `Profil Instagram : ${draft.ad.instagramAccount}\n\n`;

    text += "CAMPAGNE\n";
    text += `Nom : ${draft.campaign.name}\n`;
    text += `Objectif : ${draft.campaign.objective}\n\n`;

    text += "ENSEMBLE DE PUBLICITÉS\n";
    text += `Nom : ${draft.adSet.name}\n`;
    text += `Budget : ${draft.adSet.budget}€ (${draft.adSet.budgetType})\n`;
    text += `Calendrier : Du ${draft.adSet.startDate} ${draft.adSet.startTime} au ${draft.adSet.endDate} ${draft.adSet.endTime}\n`;
    text += `Lieu de conversion : ${draft.adSet.conversionLocation}\n`;
    text += `Objectif de performance : ${draft.adSet.performanceGoal}\n`;
    text += `Pixel : ${draft.adSet.pixel}\n`;
    text += `Événement : ${draft.adSet.conversionEvent}\n`;
    text += `Mode Audience : ${draft.adSet.audienceMode === 'ADVANTAGE_PLUS' ? 'Advantage+' : 'Traditionnel'}\n`;
    if (draft.adSet.audienceMode === 'ADVANTAGE_PLUS') {
      text += `Suggestions de ciblage : ${draft.adSet.detailedTargeting || 'Aucune'}\n`;
    } else {
      text += `Lieux : ${draft.adSet.locations}\n`;
      text += `Âge : ${draft.adSet.ageMin} - ${draft.adSet.ageMax}\n`;
      text += `Source Personnalisée : ${draft.adSet.customAudienceSource}\n`;
      text += `LAL % : ${draft.adSet.lookalikePercentage}%\n`;
    }
    text += `Ciblage avancé : ${draft.adSet.detailedTargeting}\n\n`;

    text += "PUBLICITÉ\n";
    text += `Format : ${draft.ad.format}\n`;
    text += `Texte principal : ${draft.ad.primaryText}\n`;
    text += `Titre : ${draft.ad.headline}\n`;
    text += `CTA : ${draft.ad.callToAction}\n`;
    text += `URL : ${draft.ad.url}\n`;
    
    text += "\n======================================\n";
    text += "Généré via le Simulateur de Digital Marketing";

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export Meta Ads</title></head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px;">
        <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Export de Configuration Meta Ads</h1>
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
    a.download = `meta_ads_export_${new Date().toISOString().split('T')[0]}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden w-full">
      <aside className="w-16 bg-slate-900 flex flex-col items-center py-4 z-20 shadow-sm shrink-0">
        <button onClick={onExit} className="w-10 h-10 hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white mb-8 transition-colors" title="Retour au portail">
          <ArrowLeft size={20} />
        </button>
        <nav className="flex flex-col gap-6 flex-1 w-full items-center">
          <MetaNavItem icon={<Layout size={20} />} active={view === 'dashboard'} onClick={() => setView('dashboard')} title="Tableau de bord" />
          <MetaNavItem icon={<Megaphone size={20} />} active={view === 'create'} onClick={() => {
            if (view !== 'create') handleOpenCreateModal();
          }} title="Campagnes" />
          <MetaNavItem icon={<Users size={20} />} active={view === 'audiences'} onClick={() => setView('audiences')} title="Audiences" />
          <MetaNavItem icon={<Activity size={20} />} active={view === 'events_manager'} onClick={() => setView('events_manager')} title="Gestionnaire d'événements & Pixel Meta" />
          <MetaNavItem icon={<Folder size={20} />} title="Bibliothèque" />
          <MetaNavItem icon={<BarChart2 size={20} />} title="Rapports" />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {view === 'dashboard' ? (
          <MetaDashboard 
            campaigns={campaigns} 
            storeState={storeState}
            syncToast={syncToast}
            onCreateNew={handleOpenCreateModal} 
            onToggleStatus={handleToggleStatus} 
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            isObjectiveModalOpen={isObjectiveModalOpen}
            setIsObjectiveModalOpen={setIsObjectiveModalOpen}
            selectedObjective={selectedObjective}
            setSelectedObjective={setSelectedObjective}
            startCreationFlow={startCreationFlow}
          />
        ) : view === 'audiences' ? (
          <AudienceManager 
            audiences={createdAudiences} 
            setAudiences={setCreatedAudiences}
            isCreating={isCreatingAudience}
            setIsCreating={setIsCreatingAudience}
          />
        ) : view === 'events_manager' ? (
          <MetaEventsManager onBackToDashboard={() => setView('dashboard')} />
        ) : (
          <CreationFlow draft={draft} updateDraft={updateDraft} currentStep={currentStep} setCurrentStep={setCurrentStep} onClose={() => setView('dashboard')} onPublish={handlePublish} onExport={handleExport} createdAudiences={createdAudiences} />
        )}
      </div>
    </div>
  );
}

function MetaDashboard({ 
  campaigns, storeState, syncToast, onCreateNew, onToggleStatus, onEdit, onDuplicate,
  isObjectiveModalOpen, setIsObjectiveModalOpen, selectedObjective, setSelectedObjective, startCreationFlow
}) {
  const [dateRange, setDateRange] = useState('Ce mois-ci : 1 mars - 31 mars');

  const activePixel = storeState?.pixels?.[0];
  const dateOptions = ["Aujourd'hui", "Hier", "7 derniers jours", "14 derniers jours", "Ce mois-ci : 1 mars - 31 mars", "Mois dernier : 1 fév. - 28 fév.", "Cette année", "Durée maximale"];

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center text-xs font-black">M</span>
            Ads Manager
          </h1>

          {activePixel && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Pixel lié : {activePixel.name}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-mono">
                {activePixel.receivedEventsCount} événements
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <Calendar size={14}/> {dateRange} <ChevronDown size={14}/>
              </button>
           </div>
           <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"><Search size={16}/></button>
           <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"><Bell size={16}/></button>
           <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">AV</div>
        </div>
      </header>

      {syncToast && (
        <div className="bg-emerald-600 text-white px-8 py-2.5 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>{syncToast}</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">Synchronisation Firebase & GA4</span>
        </div>
      )}

      <div className="p-8 bg-slate-50/50 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button className="px-6 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-md">Campagnes</button>
              <button className="px-6 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Ensembles</button>
              <button className="px-6 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Publicités</button>
            </div>
            <button onClick={onCreateNew} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-lg shadow-green-600/20 transition-all flex items-center gap-2">
              <Plus size={16} /> Créer
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
              <button className="p-2 border border-slate-200 rounded-lg text-slate-400 bg-white shadow-sm"><Filter size={16}/></button>
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Rechercher par nom de campagne..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-400 uppercase font-black border-b border-slate-100 tracking-widest text-[9px]">
                  <tr>
                    <th className="px-6 py-5 w-12">État</th>
                    <th className="px-6 py-5">Campagne</th>
                    <th className="px-6 py-5">Diffusion</th>
                    <th className="px-6 py-5">Budget</th>
                    <th className="px-6 py-5">Résultats</th>
                    <th className="px-6 py-5">Dépenses</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-5">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={camp.status === 'active'} onChange={() => onToggleStatus(camp.id)} className="sr-only peer" />
                          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {camp.name}
                        <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Objectif : {camp.objective}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${camp.delivery === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{camp.delivery}</span>
                      </td>
                      <td className="px-6 py-5 text-slate-600">{camp.budget}</td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900">{camp.results}</div>
                        <div className="text-[9px] text-slate-400 font-bold">Impressions : {camp.impressions}</div>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-900">{camp.amountSpent}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => onEdit(camp)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors" title="Modifier"><Edit size={14}/></button>
                           <button onClick={() => onDuplicate(camp)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors" title="Dupliquer"><Folder size={14}/></button>
                           <button className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors" title="Supprimer"><Trash size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isObjectiveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl p-10 relative animate-in slide-in-from-bottom-8 duration-500">
              <button onClick={() => setIsObjectiveModalOpen(false)} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
              
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Choisir un objectif</h2>
              <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed max-w-lg">L'objectif de campagne définit le résultat que vous souhaitez obtenir. Il aidera l'algorithme à trouver les bonnes personnes.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                 {[
                   { id: 'AWARENESS', label: 'Notoriété', desc: 'Montrez vos publicités aux personnes les plus susceptibles de s\'en souvenir.', icon: <Megaphone /> },
                   { id: 'TRAFFIC', label: 'Trafic', desc: 'Dirigez les internautes vers une destination (site web, application, Messenger).', icon: <MousePointer /> },
                   { id: 'ENGAGEMENT', label: 'Engagement', desc: 'Incitez les internautes à liker, commenter, s\'abonner ou démarrer une conversation.', icon: <MessageSquare /> },
                   { id: 'LEADS', label: 'Prospects', icon: <Users />, desc: 'Récupérez des contacts via des formulaires instantanés ou des appels.' },
                   { id: 'PROMOTION', label: 'Promotion d\'app', icon: <Smartphone />, desc: 'Trouvez de nouvelles personnes pour installer votre app ou y effectuer une action.' },
                   { id: 'SALES', label: 'Ventes', icon: <CreditCard />, desc: 'Trouvez des personnes susceptibles d\'acheter vos produits ou services.' }
                 ].map(obj => (
                   <div 
                      key={obj.id} 
                      onClick={() => setSelectedObjective(obj.id)} 
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all group ${selectedObjective === obj.id ? 'border-blue-600 bg-blue-50/30 shadow-xl shadow-blue-500/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                   >
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-inner transition-transform group-hover:scale-110 ${selectedObjective === obj.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                        {React.cloneElement(obj.icon, { size: 24 })}
                     </div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">{obj.label}</h3>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed leading-snug">{obj.desc}</p>
                   </div>
                 ))}
              </div>

              <div className="flex justify-end gap-4 border-t border-slate-100 pt-8">
                 <button onClick={() => setIsObjectiveModalOpen(false)} className="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Annuler</button>
                 <button onClick={startCreationFlow} className="px-10 py-3 bg-blue-600 text-white text-sm font-black rounded-xl shadow-lg shadow-blue-600/20 uppercase tracking-widest hover:bg-blue-700 transition-all">Continuer</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function CreationFlow({ draft, updateDraft, currentStep, setCurrentStep, onClose, onPublish, onExport, createdAudiences }) {
  const steps = [
    { id: 'campaign', label: 'Campagne', icon: <Megaphone size={14}/> },
    { id: 'adset', label: 'Ensemble', icon: <Layout size={14}/> },
    { id: 'ad', label: 'Publicité', icon: <Edit size={14}/> }
  ];

  const handleNext = () => {
    if (currentStep === 'campaign') setCurrentStep('adset');
    else if (currentStep === 'adset') setCurrentStep('ad');
    else onPublish();
  };

  return (
    <div className="flex flex-col h-full bg-white absolute inset-0 z-40 overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center shadow-sm shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Éditeur de campagne</span>
             <span className="text-sm font-bold text-slate-900 truncate tracking-tight">{draft.campaign.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-inner hidden lg:flex">
             {steps.map(s => (
               <button 
                  key={s.id} 
                  onClick={() => setCurrentStep(s.id)}
                  className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${currentStep === s.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {s.label}
               </button>
             ))}
           </div>
           <div className="h-8 w-px bg-slate-200"></div>
           <button onClick={onExport} className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all border border-slate-200" title="Exporter la configuration (.txt)">
              <Download size={18} />
           </button>
           <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all">
             {currentStep === 'ad' ? 'Publier' : 'Suivant'}
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-slate-50/30 p-8 md:p-12">
        <div className="max-w-6xl mx-auto mb-20">
          {currentStep === 'campaign' && <CampaignForm draft={draft} updateDraft={updateDraft} />}
          {currentStep === 'adset' && <AdSetForm draft={draft} updateDraft={updateDraft} createdAudiences={createdAudiences} />}
          {currentStep === 'ad' && <AdForm draft={draft} updateDraft={updateDraft} />}
        </div>
      </div>
    </div>
  );
}

function CampaignForm({ draft, updateDraft }) {
  const objectives = {
    'AWARENESS': 'Notoriété',
    'TRAFFIC': 'Trafic',
    'ENGAGEMENT': 'Engagement',
    'LEADS': 'Prospects',
    'PROMOTION': 'Promotion d\'app',
    'SALES': 'Ventes'
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600"><Megaphone size={28}/></div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Détails de la campagne</h2>
      </div>
      
      <div className="space-y-10">
        <div className="space-y-4">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nom de la campagne</label>
          <div className="flex flex-col gap-2">
            <input type="text" value={draft.campaign.name} onChange={(e) => updateDraft('campaign', 'name', e.target.value)} className="w-full text-xl font-bold bg-slate-50/50 px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" placeholder="Ex: Campagne de Soldes d'Hiver 2024" />
            <p className="text-[10px] text-slate-400 font-medium px-2 italic">Choisissez un nom précis pour identifier facilement votre campagne (ex: Nom du produit + Saison + Objectif).</p>
          </div>
          <div className="flex items-center gap-3 px-1 mt-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Objectif sélectionné :</span>
             <select 
               value={draft.campaign.objective}
               onChange={(e) => updateDraft('campaign', 'objective', e.target.value)}
               className="bg-transparent text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] outline-none cursor-pointer border-b border-blue-200 hover:border-blue-600 transition-colors py-0.5"
             >
               {Object.entries(objectives).map(([key, label]) => (
                 <option key={key} value={key} className="text-slate-900 bg-white capitalize tracking-normal">{label}</option>
               ))}
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Catégories spéciales</label>
              <select value={draft.campaign.specialCategory} onChange={(e) => updateDraft('campaign', 'specialCategory', e.target.value)} className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs font-bold font-medium outline-none shadow-inner cursor-pointer">
                <option value="NONE">Aucune catégorie sélectionnée</option>
                <option value="CREDIT">Crédit</option>
                <option value="EMPLOYMENT">Emploi</option>
                <option value="HOUSING">Logement</option>
                <option value="SOCIAL">Thèmes sociaux, élections ou politique</option>
              </select>
           </div>
           <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Type d'achat</label>
              <div className="px-6 py-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">Enchères</div>
           </div>
        </div>
      </div>
    </div>
  );
}

function AdSetForm({ draft, updateDraft, createdAudiences }) {
  const [traditionalTab, setTraditionalTab] = useState('CUSTOM'); // SAVED, CUSTOM, LOOKALIKE
  
  const handlePlacementToggle = (platform) => {
    const newManual = { ...draft.adSet.manualPlacements, [platform]: !draft.adSet.manualPlacements[platform] };
    updateDraft('adSet', 'manualPlacements', newManual);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 space-y-8">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
          <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600"><Layout size={28}/></div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Configuration de l'ensemble de publicités</h2>
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nom de l'ensemble de publicités (Ad Set) - Soyez précis (ex: Audience_FR_18-35)</label>
              <input type="text" value={draft.adSet.name} onChange={(e) => updateDraft('adSet', 'name', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ex: Audience 18-35 ans - Retargeting" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Type de budget</label>
                <select value={draft.adSet.budgetType} onChange={(e) => updateDraft('adSet', 'budgetType', e.target.value)} className="w-full px-6 py-4 border border-slate-200 rounded-2xl outline-none bg-slate-50 font-bold shadow-inner cursor-pointer">
                  <option value="DAILY">Budget quotidien</option>
                  <option value="LIFETIME">Budget global</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Montant moyen (€)</label>
                <div className="relative group">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">€</span>
                   <input type="number" value={draft.adSet.budget} onChange={(e) => updateDraft('adSet', 'budget', parseInt(e.target.value) || 0)} className="w-full pl-12 pr-6 py-4 border border-slate-200 rounded-2xl outline-none font-bold shadow-inner bg-slate-50 focus:bg-white transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-50 pt-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Date et heure de début</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={draft.adSet.startDate} onChange={(e) => updateDraft('adSet', 'startDate', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold" title="Sélectionnez la date de début" />
                  <input type="time" value={draft.adSet.startTime} onChange={(e) => updateDraft('adSet', 'startTime', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold" title="Sélectionnez l'heure de début" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Date et heure de fin</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={draft.adSet.endDate} onChange={(e) => updateDraft('adSet', 'endDate', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold" title="Sélectionnez la date de fin" />
                  <input type="time" value={draft.adSet.endTime} onChange={(e) => updateDraft('adSet', 'endTime', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold" title="Sélectionnez l'heure de fin" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
          <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-8">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 font-bold">
              <Plus size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Conversion</h2>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Lieu de conversion</label>
                <AlertCircle size={14} className="text-slate-300" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'WEBSITE', label: 'Site web', desc: 'Envoyez du trafic vers votre site web.' },
                  { id: 'APP', label: 'Application', desc: 'Envoyez du trafic vers votre application.' },
                  { id: 'MESSAGING', label: 'Messenger, IG et WhatsApp', desc: 'Envoyer du trafic vers vos messageries.' },
                  { id: 'RESEAUX', label: 'Page Instagram ou FB', desc: 'Envoyer vers votre profil/page.' },
                  { id: 'CALLS', label: 'Appels', desc: 'Incitez aux appels.' }
                ].map(loc => (
                  <div 
                    key={loc.id}
                    onClick={() => updateDraft('adSet', 'conversionLocation', loc.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${draft.adSet.conversionLocation === loc.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input type="radio" checked={draft.adSet.conversionLocation === loc.id} readOnly className="w-3 h-3 accent-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">{loc.label}</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold leading-tight">{loc.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-slate-50">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Objectif de performance</label>
                  <AlertCircle size={14} className="text-slate-300" />
                </div>
                <select 
                  value={draft.adSet.performanceGoal} 
                  onChange={(e) => updateDraft('adSet', 'performanceGoal', e.target.value)}
                  className="w-full px-6 py-4 border border-slate-200 rounded-2xl outline-none bg-slate-50 font-bold shadow-inner cursor-pointer"
                >
                  <option value="MAX_CONVERSIONS">Maximiser le nombre de conversions</option>
                  <option value="MAX_VALUE">Maximiser la valeur des conversions</option>
                  <option value="MAX_CLICKS">Maximiser le nombre de clics sur un lien</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">* Dataset (Pixel)</label>
                  <AlertCircle size={14} className="text-slate-300" />
                </div>
                <select 
                  value={draft.adSet.pixel} 
                  onChange={(e) => updateDraft('adSet', 'pixel', e.target.value)}
                  className="w-full px-6 py-4 border border-slate-200 rounded-2xl outline-none bg-slate-50 font-bold shadow-inner cursor-pointer"
                >
                  {marketingStore.getState().pixels.map(px => (
                    <option key={px.id} value={px.name}>
                      {px.name} (ID: {px.id.slice(0, 6)}... - {px.status === 'active' ? '🟢 Actif' : '⚪ Inactif'} - {px.receivedEventsCount} événements)
                    </option>
                  ))}
                  <option value="Pixel de l'école">Pixel de l'école (Sandbox)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">* Événement de conversion</label>
                <AlertCircle size={14} className="text-slate-300" />
              </div>
              <select 
                value={draft.adSet.conversionEvent} 
                onChange={(e) => updateDraft('adSet', 'conversionEvent', e.target.value)}
                className="w-full px-6 py-4 border border-slate-200 rounded-2xl outline-none bg-slate-50 font-bold shadow-inner cursor-pointer"
              >
                <option value="VIEW_CONTENT">Vue de contenu (ViewContent)</option>
                <option value="ADD_TO_CART">Ajout au panier (AddToCart)</option>
                <option value="INITIATE_CHECKOUT">Initialisation du paiement</option>
                <option value="PURCHASE">Achat (Purchase)</option>
                <option value="LEAD">Prospect (Lead)</option>
                <option value="CONTACT">Contact</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Users size={18} className="text-blue-600"/> Ciblage de l'audience
              </h3>
              <div className="flex gap-4">
                {draft.adSet.audienceMode === 'ADVANTAGE_PLUS' ? (
                  <button 
                    onClick={() => updateDraft('adSet', 'audienceMode', 'TRADITIONAL')}
                    className="text-[10px] font-black text-blue-600 hover:bg-blue-100 uppercase tracking-widest border border-blue-200 px-4 py-2 rounded-lg transition-all"
                  >
                    Passer aux options d'audiences originales
                  </button>
                ) : (
                  <button 
                    onClick={() => updateDraft('adSet', 'audienceMode', 'ADVANTAGE_PLUS')}
                    className="text-[10px] font-black text-white bg-blue-600 px-6 py-2 rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                  >
                    Utiliser l'audience Advantage+ (Recommandé)
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
               <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
               <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                 <span className="font-bold underline uppercase block mb-1">Important pour votre stratégie :</span>
                 Utilisez <b>Advantage+</b> pour laisser l'IA de Meta trouver vos clients. Le mode <b>Manuel</b> vous permet d'utiliser vos propres <b>Audiences Personnalisées, Similaires ou Enregistrées</b> pour affiner votre ciblage étape par étape.
               </p>
            </div>
          </div>

          {draft.adSet.audienceMode === 'ADVANTAGE_PLUS' ? (
            <div className="space-y-8">
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">M</div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Audience Advantage+</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">
                  Notre technologie publicitaire trouve automatiquement votre audience. Si vous le souhaitez, vous pouvez ajouter une suggestion d'audience. Nous privilégierons les personnes correspondant à ces critères avant d'élargir la recherche.
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggestions d'audience (facultatif)</h4>
                
                <div className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Lieux, Âge, Genre</label>
                      <div className="text-[11px] font-bold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {draft.adSet.locations} • {draft.adSet.ageMin}-{draft.adSet.ageMax} ans • Tous les genres
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Ciblage avancé suggéré</label>
                      <input 
                        type="text" 
                        value={draft.adSet.detailedTargeting} 
                        onChange={(e) => updateDraft('adSet', 'detailedTargeting', e.target.value)}
                        placeholder="Ajouter des intérêts ou comportements..." 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[11px] focus:ring-2 focus:ring-blue-500"
                      />
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
              <div className="flex border-b border-slate-100 mb-6">
                {[
                  { id: 'CUSTOM', label: 'Audience Personnalisée', desc: 'Retargeting' },
                  { id: 'LOOKALIKE', label: 'Audience Similaire', desc: 'Lookalike (LAL)' },
                  { id: 'SAVED', label: 'Audience Enregistrée', desc: 'Ciblage Déterminé' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setTraditionalTab(tab.id)}
                    className={`flex-1 px-4 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative border-r last:border-r-0 border-slate-50 ${traditionalTab === tab.id ? 'text-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{tab.label}</span>
                      <span className="text-[8px] font-bold text-slate-400 lowercase italic">{tab.desc}</span>
                    </div>
                    {traditionalTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Utiliser une audience enregistrée</label>
                <div className="relative group">
                   <select 
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
                     onChange={(e) => {
                       const aud = createdAudiences.find(a => a.name === e.target.value);
                       if (aud) {
                         if (aud.type === 'SAVED') {
                            updateDraft('adSet', 'locations', aud.locations);
                            updateDraft('adSet', 'ageMin', aud.ageMin);
                            updateDraft('adSet', 'ageMax', aud.ageMax);
                            updateDraft('adSet', 'detailedTargeting', aud.interests);
                            setTraditionalTab('SAVED');
                         } else if (aud.type === 'CUSTOM') {
                            updateDraft('adSet', 'customAudienceSource', aud.source);
                            setTraditionalTab('CUSTOM');
                         } else if (aud.type === 'LOOKALIKE') {
                            updateDraft('adSet', 'lookalikePercentage', aud.ratio);
                            setTraditionalTab('LOOKALIKE');
                         }
                       }
                     }}
                   >
                     <option value="">Rechercher une audience existante...</option>
                     {createdAudiences.map(aud => (
                       <option key={aud.id} value={aud.name}>{aud.name} ({aud.type})</option>
                     ))}
                   </select>
                   <Search size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
              </div>

              {traditionalTab === 'SAVED' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Lieu géographique</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input type="text" value={draft.adSet.locations} onChange={(e) => updateDraft('adSet', 'locations', e.target.value)} placeholder="Ex: France, Belgique..." className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-inner font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Âge minimum</label>
                      <input type="number" value={draft.adSet.ageMin} onChange={(e) => updateDraft('adSet', 'ageMin', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold shadow-inner" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Âge maximum</label>
                      <input type="text" value={draft.adSet.ageMax} onChange={(e) => updateDraft('adSet', 'ageMax', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold shadow-inner" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Ciblage avancé (Intérêts / Comportements)</label>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <textarea value={draft.adSet.detailedTargeting} onChange={(e) => updateDraft('adSet', 'detailedTargeting', e.target.value)} placeholder="Marketing digital, E-commerce, Finance..." className="w-full bg-transparent outline-none min-h-[100px] font-bold text-sm" />
                      <div className="mt-4 flex flex-wrap gap-2">
                         {['Luxe', 'Immobilier', 'E-commerce', 'Jeux Vidéo', 'Mode', 'Voyage'].map(tag => (
                           <button key={tag} onClick={() => {
                              const current = draft.adSet.detailedTargeting;
                              updateDraft('adSet', 'detailedTargeting', current ? `${current}, ${tag}` : tag);
                           }} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all">+{tag}</button>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {traditionalTab === 'CUSTOM' && (
                <div className="space-y-8">
                   <div className="p-6 bg-slate-900 rounded-3xl text-white">
                      <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Filter size={14} className="text-blue-400" /> Logique du Retargeting
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        Le retargeting permet de diffuser vos publicités uniquement aux personnes qui ont déjà interagi avec votre marque. Choisissez votre source ci-dessous.
                      </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'WEBSITE', label: 'Site Web', icon: <Globe size={20}/>, desc: 'Visiteurs de votre site.' },
                        { id: 'FB_PAGE', label: 'Page Facebook', icon: <Facebook size={20}/>, desc: 'Interactions FB.' },
                        { id: 'IG_PROFILE', label: 'Profil Instagram', icon: <Instagram size={20}/>, desc: 'Interactions IG.' }
                      ].map(source => (
                        <div 
                          key={source.id}
                          onClick={() => updateDraft('adSet', 'customAudienceSource', source.id)}
                          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${draft.adSet.customAudienceSource === source.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                        >
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${draft.adSet.customAudienceSource === source.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                             {source.icon}
                           </div>
                           <div className="text-[10px] font-black uppercase tracking-tight text-slate-900 mb-1">{source.label}</div>
                           <p className="text-[9px] text-slate-500 font-bold">{source.desc}</p>
                        </div>
                      ))}
                   </div>

                   <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Rétention (jours)</label>
                      <input type="number" defaultValue={30} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold shadow-inner" />
                      <p className="text-[10px] text-slate-400 italic">Nombre de jours pendant lesquels les personnes restent dans votre audience après avoir interagi.</p>
                   </div>
                </div>
              )}

              {traditionalTab === 'LOOKALIKE' && (
                <div className="space-y-8">
                   <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-500/10">
                      <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Users size={14} /> Audience Semblable (LAL)
                      </h4>
                      <p className="text-[11px] text-blue-100 leading-relaxed font-medium">
                        Meta analyse le profil de vos meilleurs clients (source) et trouve les profils les plus proches parmi tous les utilisateurs.
                      </p>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Source de l'audience</label>
                        <select className="w-full px-6 py-4 border border-slate-200 rounded-2xl outline-none bg-slate-50 font-bold shadow-inner cursor-pointer">
                          <option>Acheteurs (Pixel)</option>
                          <option>Visiteurs engagés (IG)</option>
                          <option>Fichier client importé</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Taille de l'audience (Pourcentage)</label>
                        <div className="flex items-center gap-8 px-6 py-8 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
                           <div className="flex-1 space-y-6">
                              <input 
                                type="range" min="1" max="10" step="1" 
                                value={draft.adSet.lookalikePercentage} 
                                onChange={(e) => updateDraft('adSet', 'lookalikePercentage', e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                              />
                              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                                 <span>1% (Précis)</span>
                                 <span>5%</span>
                                 <span>10% (Large)</span>
                              </div>
                           </div>
                           <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center shadow-lg">
                              <span className="text-2xl font-black">{draft.adSet.lookalikePercentage}%</span>
                              <span className="text-[8px] font-bold uppercase tracking-tighter">Précision</span>
                           </div>
                        </div>
                        <p className="text-[10px] text-slate-500 bg-slate-100 p-4 rounded-xl border border-slate-200 leading-relaxed italic">
                          "Une audience à 1% est composée des personnes les plus proches de votre source. En augmentant le %, l'audience devient plus large mais moins précise."
                        </p>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
          <h3 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-2">
            <Smartphone size={18} className="text-indigo-600"/> Placements
          </h3>
          
          <div className="space-y-4">
            <label className={`block p-6 border-2 rounded-3xl cursor-pointer transition-all ${draft.adSet.placements === 'ADVANTAGE' ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1"><input type="radio" checked={draft.adSet.placements === 'ADVANTAGE'} onChange={() => updateDraft('adSet', 'placements', 'ADVANTAGE')} className="w-5 h-5 accent-blue-600" /></div>
                <div>
                  <div className="font-black text-slate-900 text-sm uppercase tracking-tight">Placements Advantage+ (recommandé)</div>
                  <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">Maximisez votre budget en diffusant vos publicités sur les emplacements les plus réactifs selon l'IA de Meta.</p>
                </div>
              </div>
            </label>

            <label className={`block p-6 border-2 rounded-3xl cursor-pointer transition-all ${draft.adSet.placements === 'MANUAL' ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1"><input type="radio" checked={draft.adSet.placements === 'MANUAL'} onChange={() => updateDraft('adSet', 'placements', 'MANUAL')} className="w-5 h-5 accent-blue-600" /></div>
                <div>
                  <div className="font-black text-slate-900 text-sm uppercase tracking-tight">Placements manuels</div>
                  <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">Choisissez manuellement où vos publicités apparaissent (Fil, Stories, Reels...).</p>
                </div>
              </div>
            </label>

            {draft.adSet.placements === 'MANUAL' && (
              <div className="grid grid-cols-2 gap-4 mt-8 p-8 bg-slate-50 border border-slate-200 rounded-3xl animate-in zoom-in-95 duration-300">
                <h4 className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Plateformes autorisées</h4>
                {[
                  { id: 'facebook', label: 'Facebook', icon: <Facebook size={14}/> },
                  { id: 'instagram', label: 'Instagram', icon: <Instagram size={14}/> },
                  { id: 'audienceNetwork', label: 'Audience Network', icon: <Globe size={14}/> },
                  { id: 'messenger', label: 'Messenger', icon: <MessageSquare size={14}/> }
                ].map(platform => (
                  <label key={platform.id} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl cursor-pointer group shadow-sm hover:shadow-md transition-all">
                    <input 
                      type="checkbox" 
                      checked={draft.adSet.manualPlacements[platform.id]} 
                      onChange={() => handlePlacementToggle(platform.id)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 accent-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{platform.icon}</span>
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{platform.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audience Statistics Sidebar removed as per feedback (gauge) */}
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-8">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Estimation des résultats</h3>
           
           <div className="space-y-6">
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                 <div className="text-[10px] font-black text-teal-600 uppercase mb-1">Audience estimée</div>
                 <div className="text-xl font-black text-slate-900">4,2M - 4,9M</div>
              </div>

              <div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Résultats quotidiens</div>
                 <div className="space-y-4">
                    <div className="group">
                       <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                          <span className="text-slate-500">Couverture</span>
                          <span className="text-slate-900">850 - 2,5k</span>
                       </div>
                       <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 w-1/3 rounded-full"></div>
                       </div>
                    </div>
                    <div className="group">
                       <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                          <span className="text-slate-500">Clics sur un lien</span>
                          <span className="text-slate-900">45 - 132</span>
                       </div>
                       <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-1/4 rounded-full"></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                 <p className="text-[10px] font-bold text-blue-700 leading-relaxed italic">
                   "Les estimations sont basées sur les performances passées et les données d'audience actuelles."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function AdForm({ draft, updateDraft }) {
  const [previewSize, setPreviewSize] = useState('mobile');
  const [previewPlacement, setPreviewPlacement] = useState('FEED'); // FEED or STORY
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleMediaUpload = (e, placement) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateDraft('ad', 'media', { ...draft.ad.media, [placement]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCarouselMediaUpload = (e, cardIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCards = [...draft.ad.carouselCards];
        newCards[cardIndex] = { ...newCards[cardIndex], image: reader.result };
        updateDraft('ad', 'carouselCards', newCards);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCarouselCard = (index, field, value) => {
    const newCards = [...draft.ad.carouselCards];
    newCards[index] = { ...newCards[index], [field]: value };
    updateDraft('ad', 'carouselCards', newCards);
  };

  const addCarouselCard = () => {
    if (draft.ad.carouselCards.length >= 5) return;
    const newCard = { id: Date.now(), image: '', headline: `Carte ${draft.ad.carouselCards.length + 1}`, description: '', url: '' };
    updateDraft('ad', 'carouselCards', [...draft.ad.carouselCards, newCard]);
  };

  const removeCarouselCard = (id) => {
    updateDraft('ad', 'carouselCards', draft.ad.carouselCards.filter(c => c.id !== id));
  };

  const ctas = [
    { value: 'LEARN_MORE', label: 'En savoir plus' },
    { value: 'SHOP_NOW', label: 'Acheter' },
    { value: 'SIGN_UP', label: "S'inscrire" },
    { value: 'CONTACT_US', label: 'Nous contacter' },
    { value: 'BOOK_NOW', label: 'Réserver' }
  ];

  const facebookPages = [
    "Les Licornes du Marketing 🦄", 
    "EFP Formation 🚀", 
    "Digital Mastery Lab 🧠", 
    "Boutique Mode Luxe ✨",
    "Sport & Performance Pro 🏋️"
  ];

  const instagramAccounts = [
    "Utiliser la page sélectionnée",
    "@leslicornesmarketing",
    "@efp_training",
    "@digital_mastery",
    "@luxury_boutique_official",
    "@sport_pro_fit"
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 space-y-10 w-full mb-32">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
          <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600"><Edit size={28}/></div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Publicité</h2>
          </div>
          
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Page Facebook</label>
                <select value={draft.ad.facebookPage} onChange={(e) => updateDraft('ad', 'facebookPage', e.target.value)} className="w-full px-6 py-4 border border-slate-200 rounded-2xl outline-none bg-slate-50 font-bold shadow-inner cursor-pointer">
                  {facebookPages.map(page => <option key={page} value={page}>{page}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Profil Instagram</label>
                <select value={draft.ad.instagramAccount} onChange={(e) => updateDraft('ad', 'instagramAccount', e.target.value)} className="w-full px-6 py-4 border border-slate-200 rounded-2xl outline-none bg-slate-50 font-bold shadow-inner cursor-pointer">
                  {instagramAccounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-[2rem] shadow-sm border border-blue-100 p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Link size={18} className="text-blue-600"/> Destination
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                   Note : Paramètres UTM obligatoires
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">Indiquez l'URL finale de votre site. N'oubliez pas d'ajouter vos tags UTM pour le suivi dans Google Analytics.</p>
                
                <div className="space-y-4">
                  <div className="space-y-4 pt-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
                      * URL du site web <AlertCircle size={14} className="text-slate-300" />
                    </label>
                    <input 
                      type="text" 
                      value={draft.ad.url} 
                      onChange={(e) => updateDraft('ad', 'url', e.target.value)} 
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-mono text-xs font-bold shadow-sm focus:ring-2 focus:ring-blue-500 transition-all" 
                      placeholder="https://www.votre-site.com/offre?utm_source=facebook&utm_medium=paid" 
                    />
                    
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-start gap-4 shadow-sm">
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <Calculator size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">
                          💡 Conseil : Utilisez des UTM pour identifier la source du trafic.
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1 italic">Exemple : ?utm_source=meta&utm_medium=ads&utm_campaign={draft.campaign.name.toLowerCase().replace(/ /g, '_')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Structure de l'annonce</label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'SINGLE_IMAGE', label: 'Image ou vidéo unique', desc: 'Une seule image/vidéo, ou un diaporama.' },
                    { id: 'CAROUSEL', label: 'Carrousel', desc: 'Deux images/vidéos ou plus avec défilement.' },
                  ].map(format => (
                    <div 
                      key={format.id} 
                      onClick={() => updateDraft('ad', 'format', format.id)}
                      className={`p-6 border-2 rounded-3xl cursor-pointer transition-all ${draft.ad.format === format.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                       <div className="flex items-center gap-3 mb-2">
                          <input type="radio" checked={draft.ad.format === format.id} readOnly className="w-4 h-4 accent-blue-600" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{format.label}</span>
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{format.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
          <h3 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-2">Contenu Médias</h3>
          
          <div className="space-y-10">
            {draft.ad.format === 'SINGLE_IMAGE' && (
              <>
                <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-max">
                  <button onClick={() => updateDraft('ad', 'mediaType', 'IMAGE')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${draft.ad.mediaType === 'IMAGE' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Image</button>
                  <button onClick={() => updateDraft('ad', 'mediaType', 'VIDEO')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${draft.ad.mediaType === 'VIDEO' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Vidéo</button>
                </div>

                {draft.ad.mediaType === 'IMAGE' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Visuel Fil (Carré 1:1)</label>
                        <label className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group relative overflow-hidden">
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'feeds')} />
                           {draft.ad.media.feeds ? <img src={draft.ad.media.feeds} className="w-full h-full object-cover" alt="Feeds Preview"/> : <><ImageIcon className="text-slate-200 mb-2 group-hover:scale-110 transition-transform" size={40}/><span className="text-[10px] font-bold text-slate-400">Cliquez ici pour télécharger vos visuels 1:1</span></>}
                        </label>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Visuel Story/Reel (Vertical 9:16)</label>
                        <label className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group relative overflow-hidden">
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMediaUpload(e, 'stories')} />
                           {draft.ad.media.stories ? <img src={draft.ad.media.stories} className="w-full h-full object-cover" alt="Stories Preview"/> : <><ImageIcon className="text-slate-200 mb-2 group-hover:scale-110 transition-transform" size={40}/><span className="text-[10px] font-bold text-slate-400">Cliquez ici pour télécharger vos visuels 9:16</span></>}
                        </label>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Vidéo</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4 col-span-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Télécharger la vidéo</label>
                           <label className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group relative overflow-hidden bg-slate-50 shadow-inner">
                              <input 
                                type="file" 
                                accept="video/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => updateDraft('ad', 'videoUrl', reader.result);
                                    reader.readAsDataURL(file);
                                  }
                                }} 
                              />
                              {draft.ad.videoUrl && draft.ad.videoUrl.startsWith('data:video') ? (
                                <video src={draft.ad.videoUrl} className="w-full h-full object-cover" />
                              ) : (
                                <><Play className="text-slate-200 mb-2 group-hover:scale-110 transition-transform" size={40}/><span className="text-[10px] font-bold text-slate-400">Cliquez pour importer la vidéo</span></>
                              )}
                           </label>
                           <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mt-2">
                              <p className="text-[9px] text-blue-700 font-bold leading-relaxed uppercase tracking-tight">Le téléchargement direct est obligatoire pour ce laboratoire.</p>
                           </div>
                        </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {draft.ad.format === 'CAROUSEL' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cartes du carrousel ({draft.ad.carouselCards.length}/5)</h4>
                   {draft.ad.carouselCards.length < 5 && (
                     <button 
                       onClick={addCarouselCard} 
                       className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline transition-all hover:scale-105 active:scale-95"
                     >
                       <Plus size={14}/> Ajouter une carte
                     </button>
                   )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {draft.ad.carouselCards.map((card, idx) => (
                    <div key={card.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 group">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Carte {idx + 1}</span>
                          <button onClick={() => removeCarouselCard(card.id)} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-300 transition-colors"><Trash size={14}/></button>
                       </div>
                       <label className="block aspect-square w-full bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative">
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCarouselMediaUpload(e, idx)} />
                          {card.image ? <img src={card.image} className="w-full h-full object-cover" alt="Card Preview"/> : <><ImageIcon size={32} className="text-slate-200 mb-2"/><span className="text-[9px] font-bold text-slate-400 text-center px-4">Cliquez ici pour télécharger vos visuels</span></>}
                       </label>
                       <input type="text" value={card.headline} onChange={(e) => updateCarouselCard(idx, 'headline', e.target.value)} className="w-full px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl outline-none" placeholder="Titre de la carte" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
          <h3 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-widest">Textes & Actions</h3>
          <div className="space-y-10">
             <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Texte principal</label>
                <textarea value={draft.ad.primaryText} onChange={(e) => updateDraft('ad', 'primaryText', e.target.value)} rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all shadow-inner" placeholder="Captivez votre audience dès les premières lignes..." />
                <div className="text-[10px] text-right font-black text-slate-400 uppercase tracking-widest">{draft.ad.primaryText.length} / 125</div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Titre publicitaire</label>
                  <input type="text" value={draft.ad.headline} onChange={(e) => updateDraft('ad', 'headline', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold shadow-inner focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Titre accrocheur..." />
                  <div className="text-[10px] text-right font-black text-slate-400 uppercase tracking-widest">{draft.ad.headline.length} / 40</div>
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Appel à l'action</label>
                  <select value={draft.ad.callToAction} onChange={(e) => updateDraft('ad', 'callToAction', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold font-black uppercase text-[10px] tracking-widest outline-none cursor-pointer">
                    {ctas.map(cta => <option key={cta.value} value={cta.value}>{cta.label}</option>)}
                  </select>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10">
          <h3 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-600"/> Suivi (Tracking)
          </h3>
          <div className="space-y-8">
            <div className="space-y-4">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Paramètres d'URL (UTM)</label>
               <textarea 
                 value={draft.ad.urlParameters} 
                 onChange={(e) => updateDraft('ad', 'urlParameters', e.target.value)}
                 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-[11px] font-bold shadow-inner min-h-[80px]" 
                 placeholder="utm_source={{site_source_name}}&utm_campaign={{campaign.name}}&utm_content={{ad.name}}"
               />
               <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Astuce : Utilisez les balises dynamiques {"{{ }}"} pour automatiser le suivi.</p>
            </div>

            <div className="flex items-center gap-6 p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
               <input type="checkbox" checked={draft.ad.pixelActive} onChange={(e) => updateDraft('ad', 'pixelActive', e.target.checked)} className="w-6 h-6 rounded border-slate-600 text-blue-600 accent-blue-600 cursor-pointer" />
               <div className="flex flex-col">
                 <span className="text-xs font-black text-white uppercase tracking-widest">Événements de site web (Pixel)</span>
                 <span className="text-[10px] text-blue-400 font-bold mt-1 uppercase tracking-tighter">Statut : Connecté • Signal actif</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Sidebar */}
      <aside className="w-full xl:w-[400px] sticky top-0 shrink-0">
        <div className="bg-slate-900 rounded-[3rem] shadow-2xl p-10 border border-slate-800 relative overflow-hidden h-[850px] flex flex-col transition-all">
          <div className="flex justify-between items-center mb-8 shrink-0">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rendu Publicitaire</span>
             <div className="flex gap-2">
                <div className="flex bg-slate-800 rounded-xl p-1 mr-4">
                  <button onClick={() => setPreviewPlacement('FEED')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${previewPlacement === 'FEED' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Fil</button>
                  <button onClick={() => setPreviewPlacement('STORY')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${previewPlacement === 'STORY' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Story</button>
                </div>
                <button onClick={() => setPreviewSize('mobile')} className={`p-2 rounded-xl transition-all ${previewSize === 'mobile' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}><Smartphone size={16}/></button>
                <button onClick={() => setPreviewSize('desktop')} className={`p-2 rounded-xl transition-all ${previewSize === 'desktop' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}><Layout size={16}/></button>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col shrink-0 animate-in zoom-in-95 duration-500">
             {/* Header */}
             <div className="px-5 py-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm uppercase tracking-tighter shadow-md">
                      {draft.ad.facebookPage.substring(0, 1)}
                   </div>
                   <div className="flex flex-col min-w-0">
                      <span className="text-sm font-black text-slate-900 truncate tracking-tight">{draft.ad.facebookPage}</span>
                      <div className="flex items-center gap-1">
                         <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Sponsorisé</span>
                         <Globe size={8} className="text-slate-300"/>
                      </div>
                   </div>
                </div>
                <MoreVertical size={16} className="text-slate-300"/>
             </div>

             {/* Primary Text */}
             <div className="px-5 py-4 text-[12px] text-slate-800 leading-relaxed font-medium line-clamp-3">
                {draft.ad.primaryText || 'Votre texte publicitaire stratégique apparaîtra ici. Assurez-vous d\'utiliser des accroches puissantes.'}
             </div>

             {/* Media Content */}
             <div className={`relative ${previewPlacement === 'STORY' ? 'aspect-[9/16]' : 'aspect-square'} bg-slate-50 flex items-center justify-center group overflow-hidden`}>
                {previewPlacement === 'STORY' && (
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute top-0 inset-x-0 h-[10%] bg-red-500/20 border-b border-red-500/50 flex items-center justify-center">
                      <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded">Zone de danger (Haut)</span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-[15%] bg-red-500/20 border-t border-red-500/50 flex items-center justify-center">
                      <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded">Zone de danger (Bas)</span>
                    </div>
                  </div>
                )}
                {draft.ad.format === 'SINGLE_IMAGE' ? (
                  draft.ad.mediaType === 'IMAGE' ? (
                    (previewPlacement === 'STORY' ? draft.ad.media.stories : draft.ad.media.feeds) ? 
                      <img src={previewPlacement === 'STORY' ? draft.ad.media.stories : draft.ad.media.feeds} className="w-full h-full object-cover animate-in fade-in duration-700" alt="Preview"/> : 
                      <div className="text-center p-8"><ImageIcon size={48} className="text-slate-200 mx-auto mb-4" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Aucun visuel {previewPlacement === 'STORY' ? '9:16' : '1:1'}</span></div>
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-slate-900 border-x border-slate-800">
                        {draft.ad.videoUrl ? (
                          <video src={draft.ad.videoUrl} autoPlay loop muted className="w-full h-full object-cover shadow-2xl" />
                        ) : (
                          <div className="text-center">
                            <Play size={40} className="text-slate-700 mx-auto mb-2 opacity-20"/>
                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">En attente de vidéo</span>
                          </div>
                        )}
                     </div>
                   )
                ) : (
                  <div className="w-full h-full relative overflow-hidden">
                     <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                        {draft.ad.carouselCards.map((card, idx) => (
                           <div key={card.id} className="w-full flex-shrink-0 h-full">
                              {card.image ? <img src={card.image} className="w-full h-full object-cover" alt={`Card ${idx + 1}`}/> : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><ImageIcon size={48}/></div>}
                           </div>
                        ))}
                     </div>
                     <button onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-slate-900 opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={16}/></button>
                     <button onClick={() => setCarouselIndex(Math.min(draft.ad.carouselCards.length - 1, carouselIndex + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-slate-900 opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={16}/></button>
                  </div>
                )}
             </div>

             {/* Footer / CTA Section */}
             <div className="px-5 py-5 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between border-t border-slate-100">
                <div className="flex-1 min-w-0 pr-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] truncate w-full">
                 {(() => {
                   try {
                     const urlString = draft.ad.url;
                     if (!urlString) return 'WWW.SITE-WEB.COM';
                     const formattedUrl = urlString.startsWith('http') ? urlString : `https://${urlString}`;
                     const url = new URL(formattedUrl);
                     return url.hostname.toUpperCase();
                   } catch (e) {
                     return 'WWW.SITE-WEB.COM';
                   }
                 })()}
              </div>
                   <div className="text-sm font-black text-slate-900 truncate tracking-tight mt-1">
                      {draft.ad.format === 'CAROUSEL' ? draft.ad.carouselCards[carouselIndex]?.headline : (draft.ad.headline || 'Titre de l\'accroche')}
                   </div>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl hover:shadow-2xl active:scale-95 transition-all">
                  {ctas.find(c => c.value === draft.ad.callToAction)?.label || 'En savoir plus'}
                </button>
             </div>
          </div>

          <div className="mt-auto pt-10">
             <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><AlertCircle size={14}/></div>
                   <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Contrôle de conformité</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">L'algorithme de Meta recommande d'utiliser le format **Carrousel** pour augmenter le CTR sur ce type d'objectif.</p>
                <div className="flex gap-2 mt-4">
                   <div className="h-1 flex-1 bg-blue-600 rounded-full"></div>
                   <div className="h-1 flex-1 bg-blue-600 rounded-full"></div>
                   <div className="h-1 flex-1 bg-slate-700 rounded-full"></div>
                </div>
             </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function AudienceManager({ audiences, setAudiences, isCreating, setIsCreating }) {
  const [newAudience, setNewAudience] = useState({
    name: '',
    source: 'PIXEL',
    retention: 30,
    event: 'all_visitors',
    country: 'France',
    ratio: 1,
    locations: 'Belgique',
    ageMin: 18,
    ageMax: 65,
    interests: ''
  });

  const handleSaveAudience = () => {
    if (!newAudience.name) return;
    const aud = {
      id: Date.now().toString(),
      type: isCreating,
      ...newAudience
    };
    setAudiences([aud, ...audiences]);
    setIsCreating(null);
    setNewAudience({
      name: '', source: 'PIXEL', retention: 30, event: 'all_visitors',
      country: 'France', ratio: 1, locations: 'Belgique', ageMin: 18, ageMax: 65, interests: ''
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center shrink-0 z-30 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 text-indigo-600">
           <Users size={20} />
           <span className="text-slate-900">Audience Manager</span>
        </h1>
        <div className="relative group">
           <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
             <Plus size={16}/> Créer une audience
           </button>
           <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
              <button onClick={() => setIsCreating('CUSTOM')} className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase text-slate-700">Audience personnalisée (Retargeting)</button>
              <button onClick={() => setIsCreating('LOOKALIKE')} className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase text-slate-700">Audience semblable (LAL)</button>
              <button onClick={() => setIsCreating('SAVED')} className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase text-slate-700">Audience sauvegardée (Ciblage froid)</button>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {audiences.map(aud => (
              <div key={aud.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl transition-all relative group overflow-hidden border-b-4 border-b-blue-600">
                 <div className="mb-6 flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${aud.type === 'CUSTOM' ? 'bg-indigo-50 text-indigo-600' : aud.type === 'LOOKALIKE' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'}`}>
                       {aud.type === 'CUSTOM' ? <Filter size={28}/> : aud.type === 'LOOKALIKE' ? <Users size={28}/> : <Globe size={28}/>}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-slate-100 rounded-full text-slate-400">
                      {aud.type === 'CUSTOM' ? 'Personnalisée' : aud.type === 'LOOKALIKE' ? 'Semblable' : 'Sauvegardée'}
                    </div>
                 </div>
                 <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{aud.name}</h3>
                 <div className="space-y-3 mt-6">
                    {aud.type === 'CUSTOM' && (
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Source & Rétention</span>
                          <span className="text-xs font-bold text-slate-600">{aud.source} • {aud.retention} jours</span>
                       </div>
                    )}
                    {aud.type === 'LOOKALIKE' && (
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Ratio & Pays</span>
                          <span className="text-xs font-bold text-slate-600">{aud.ratio}% ({aud.country})</span>
                       </div>
                    )}
                    {aud.type === 'SAVED' && (
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Ciblage Démographique</span>
                          <span className="text-xs font-bold text-slate-600">{aud.locations} • {aud.ageMin}-{aud.ageMax} ans</span>
                       </div>
                    )}
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Taille estimée</span>
                       <span className="text-sm font-black text-slate-900 tracking-tighter">1.4M - 1.8M</span>
                    </div>
                    <button className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash size={18}/></button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom-8 duration-500">
              <button onClick={() => setIsCreating(null)} className="absolute right-8 top-8 p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24}/></button>
              
              <div className="p-12">
                 <div className="mb-12">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                       {isCreating === 'CUSTOM' ? 'Audience personnalisée' : isCreating === 'LOOKALIKE' ? 'Audience semblable' : 'Audience sauvegardée'}
                    </h2>
                    <p className="text-slate-500 font-medium mt-4 leading-relaxed">
                       {isCreating === 'CUSTOM' ? 'Ciblez les personnes qui ont déjà interagi avec votre marque via le Pixel ou les réseaux sociaux.' : 
                        isCreating === 'LOOKALIKE' ? 'Trouvez de nouvelles personnes dont les intérêts sont proches de vos meilleurs clients.' : 
                        'Créez une audience basée sur des critères démographiques et des centres d\'intérêt précis.'}
                    </p>
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nom de l'audience</label>
                       <input 
                          type="text" 
                          value={newAudience.name} 
                          onChange={(e) => setNewAudience({...newAudience, name: e.target.value})}
                          placeholder="Ex: Fans Facebook - 60 derniers jours"
                          className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-bold shadow-inner outline-none focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                       />
                    </div>

                    {isCreating === 'CUSTOM' && (
                       <div className="space-y-8 p-10 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 animate-in zoom-in-95 duration-300">
                          <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Filter size={16}/> Configuration Retargeting</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase">Source du Retargeting</label>
                                <select 
                                   value={newAudience.source}
                                   onChange={(e) => setNewAudience({...newAudience, source: e.target.value})}
                                   className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold bg-white text-sm"
                                >
                                   <option value="PIXEL">Pixel Meta (Site Web)</option>
                                   <option value="FB_PAGE">Page Facebook</option>
                                   <option value="IG_PROFILE">Profil Instagram</option>
                                   <option value="VIDEO">Vue de Vidéo (3s+)</option>
                                </select>
                             </div>
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase">Fermeture (Rétention)</label>
                                <div className="relative">
                                   <input 
                                      type="number" 
                                      value={newAudience.retention}
                                      onChange={(e) => setNewAudience({...newAudience, retention: parseInt(e.target.value)})}
                                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold bg-white text-sm"
                                   />
                                   <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Jours</span>
                                </div>
                             </div>
                          </div>

                          {newAudience.source === 'PIXEL' && (
                             <div className="space-y-4 animate-in slide-in-from-top-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase">Événement Pixel spécifique</label>
                                <select 
                                   className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold bg-white text-sm"
                                >
                                   <option>Tous les visiteurs du site web</option>
                                   <option>Visiteurs de pages spécifiques</option>
                                   <option>Ajouts au panier (AddToCart)</option>
                                   <option>Acheteurs (Purchase)</option>
                                   <option>Prospects (Lead)</option>
                                </select>
                             </div>
                          )}

                          {(newAudience.source === 'FB_PAGE' || newAudience.source === 'IG_PROFILE') && (
                             <div className="space-y-4 animate-in slide-in-from-top-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase">Activités sur {newAudience.source === 'FB_PAGE' ? 'Facebook' : 'Instagram'}</label>
                                <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold bg-white text-sm">
                                   <option>Toutes les personnes ayant interagi avec votre compte professionnel</option>
                                   <option>Personnes ayant visité le profil/la page</option>
                                   <option>Personnes ayant interagi avec une publicité</option>
                                   <option>Personnes ayant envoyé un message</option>
                                </select>
                             </div>
                          )}
                       </div>
                    )}

                    {isCreating === 'LOOKALIKE' && (
                       <div className="space-y-10 p-10 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 animate-in zoom-in-95 duration-300">
                          <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><Users size={16}/> Configuration Lookalike</h4>
                          
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-400 uppercase">Audience source (Graine)</label>
                             <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold bg-white text-sm">
                                <option>Pixel - Acheteurs (Purchase) - 180j</option>
                                <option>Audience Personnalisée : Visiteurs 30j</option>
                                <option>Fichier de clients importé (.csv)</option>
                             </select>
                             <p className="text-[10px] text-slate-400 italic font-medium">L'algorithme analysera les points communs de ces personnes pour en trouver d'autres.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase">Zone de recherche (Pays)</label>
                                <input 
                                   type="text" 
                                   value={newAudience.country}
                                   onChange={(e) => setNewAudience({...newAudience, country: e.target.value})}
                                   placeholder="France, Belgique..."
                                   className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold bg-white text-sm"
                                />
                             </div>
                             <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                   <label className="text-[11px] font-black text-slate-400 uppercase">Pourcentage de ressemblance</label>
                                   <span className="text-2xl font-black text-blue-600">{newAudience.ratio}%</span>
                                </div>
                                <input 
                                   type="range" min="1" max="10" 
                                   value={newAudience.ratio}
                                   onChange={(e) => setNewAudience({...newAudience, ratio: parseInt(e.target.value)})}
                                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                   <span>1% (Jumeaux)</span>
                                   <span>10% (Cousins)</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {isCreating === 'SAVED' && (
                       <div className="space-y-10 p-10 bg-teal-50/50 rounded-[2.5rem] border border-teal-100 animate-in zoom-in-95 duration-300">
                          <h4 className="text-[11px] font-black text-teal-400 uppercase tracking-widest flex items-center gap-2"><Globe size={16}/> Ciblage par Intérêts & Lieux</h4>
                          
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Localisation géographique</label>
                             <div className="relative">
                                <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input 
                                   type="text" 
                                   value={newAudience.locations}
                                   onChange={(e) => setNewAudience({...newAudience, locations: e.target.value})}
                                   className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold bg-white text-sm"
                                />
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tranche d'âge</label>
                                <div className="flex items-center gap-4">
                                   <input type="number" value={newAudience.ageMin} onChange={(e) => setNewAudience({...newAudience, ageMin: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold bg-white text-sm text-center" />
                                   <span className="font-black text-slate-200">—</span>
                                   <input type="number" value={newAudience.ageMax} onChange={(e) => setNewAudience({...newAudience, ageMax: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none font-bold bg-white text-sm text-center" />
                                </div>
                             </div>
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Genre cible</label>
                                <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold bg-white text-sm cursor-pointer">
                                   <option>Tous les genres</option>
                                   <option>Hommes uniquement</option>
                                   <option>Femmes uniquement</option>
                                </select>
                             </div>
                          </div>

                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Ciblage avancé (Mots-clés)</label>
                             <textarea 
                                value={newAudience.interests}
                                onChange={(e) => setNewAudience({...newAudience, interests: e.target.value})}
                                placeholder="E-commerce, Sport, Entrepreneuriat..."
                                className="w-full px-8 py-5 rounded-[2rem] border border-slate-200 outline-none font-bold bg-white text-sm min-h-[120px] focus:ring-4 focus:ring-teal-50 shadow-inner"
                             />
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="mt-12 pt-10 border-t border-slate-100 flex justify-end gap-6">
                    <button onClick={() => setIsCreating(null)} className="px-10 py-4 text-[11px] font-black uppercase text-slate-400 hover:text-slate-600 transition-all tracking-[0.2em]">Annuler</button>
                    <button onClick={handleSaveAudience} className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 active:scale-95 transition-all">Enregistrer l'audience</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function MetaNavItem({ icon, active = false, onClick = () => {}, title }) {
  return (
    <div onClick={onClick} className={`p-3 rounded-xl cursor-pointer flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`} title={title}>
      {icon}
    </div>
  );
}
