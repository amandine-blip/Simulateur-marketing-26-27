import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Activity, CheckCircle2, Copy, Code, Sparkles, Plus, ExternalLink, 
  RefreshCw, Laptop, ShieldCheck, Database, ArrowRight, Zap, Info
} from 'lucide-react';
import { marketingStore } from '../services/marketingStore';

interface MetaEventsManagerProps {
  onBackToDashboard: () => void;
}

interface ReceivedEvent {
  id: string;
  eventName: string;
  source: 'Browser (Pixel)' | 'Server (CAPI)';
  time: string;
  url: string;
  parameters: Record<string, any>;
}

export default function MetaEventsManager({ onBackToDashboard }: MetaEventsManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'test' | 'install' | 'capi'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live test event simulator
  const [simulatedEventType, setSimulatedEventType] = useState<'Purchase' | 'Lead' | 'AddToCart' | 'PageView'>('Purchase');
  const [simulatedValue, setSimulatedValue] = useState('79.99');
  const [simulatedCurrency, setSimulatedCurrency] = useState('EUR');

  const [receivedEvents, setReceivedEvents] = useState<ReceivedEvent[]>([
    {
      id: 'ev-1',
      eventName: 'PageView',
      source: 'Browser (Pixel)',
      time: 'Il y a 1 min',
      url: 'https://boutique-efp.be/',
      parameters: { page_title: 'Accueil | Boutique EFP' }
    },
    {
      id: 'ev-2',
      eventName: 'ViewContent',
      source: 'Browser (Pixel)',
      time: 'Il y a 3 min',
      url: 'https://boutique-efp.be/formation-marketing',
      parameters: { content_name: 'Masterclass Media Buying', value: 79.99, currency: 'EUR' }
    },
    {
      id: 'ev-3',
      eventName: 'Purchase',
      source: 'Server (CAPI)',
      time: 'Il y a 12 min',
      url: 'https://boutique-efp.be/confirmation-achat',
      parameters: { value: 111.38, currency: 'EUR', transaction_id: 'CMD-84920' }
    }
  ]);

  const handleCopy = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTriggerTestEvent = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const newEvent: ReceivedEvent = {
      id: `ev-${Date.now()}`,
      eventName: simulatedEventType,
      source: 'Browser (Pixel)',
      time: timeStr,
      url: simulatedEventType === 'Purchase' ? 'https://boutique-efp.be/confirmation' : simulatedEventType === 'Lead' ? 'https://boutique-efp.be/contact' : 'https://boutique-efp.be/produit',
      parameters: simulatedEventType === 'Purchase' 
        ? { value: parseFloat(simulatedValue) || 0, currency: simulatedCurrency, transaction_id: `CMD-${Math.floor(10000 + Math.random() * 90000)}` }
        : simulatedEventType === 'Lead'
        ? { content_name: 'Formulaire Devis', status: 'submitted' }
        : { content_name: 'Formation Media Buying', value: parseFloat(simulatedValue) || 0 }
    };

    setReceivedEvents(prev => [newEvent, ...prev]);

    // Update global marketing store so Meta Ads Manager immediately sees the active events!
    marketingStore.registerMetaPixel({
      id: '482910482910482',
      name: 'Pixel de la Boutique EFP',
      status: 'active',
      lastEventTime: timeStr,
      receivedEventsCount: receivedEvents.length + 1,
      activeEvents: Array.from(new Set(['PageView', 'ViewContent', 'Purchase', simulatedEventType]))
    });

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#10b981', '#8b5cf6']
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto font-sans text-slate-800">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 md:px-8 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-slate-900 tracking-tight">Gestionnaire d'événements Meta</h1>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Pixel Actif
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Source de données : Pixel de la Boutique EFP • ID : 482910482910482</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Retour aux Campagnes
          </button>
        </div>
      </header>

      {/* Sub Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-8 flex items-center gap-6 text-xs font-bold shrink-0">
        {[
          { id: 'overview', label: "Vue d'ensemble des événements" },
          { id: 'test', label: 'Tester les événements (Temps réel)' },
          { id: 'install', label: 'Configuration & Installation du Pixel' },
          { id: 'capi', label: 'API Conversions & First-Party Data' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-3.5 border-b-2 transition-all ${
              activeSubTab === tab.id
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6 pb-20">
        
        {/* Pedagogical info banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div className="space-y-1 text-xs text-blue-900">
            <span className="font-black uppercase tracking-wider block text-blue-800">
              Rôle du Pixel Meta (Programme IFAPME - Module MAD)
            </span>
            <p className="font-medium leading-relaxed">
              Le Pixel Meta est un traceur JavaScript placé sur votre site web. Il permet de mesurer l'efficacité de vos publicités en suivant les actions réelles effectuées par les visiteurs (ex: afficher une page, envoyer un formulaire de lead ou effectuer un achat). Il alimente les algorithmes d'optimisation de Meta et permet de créer des audiences de retargeting qualifiées.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW                                          */}
        {/* -------------------------------------------------------- */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Événements reçus (28j)</span>
                <div className="text-2xl font-black text-slate-900">23 890</div>
                <div className="text-[11px] text-green-600 font-bold">+18,4% ce mois-ci</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Achats enregistrés (Purchase)</span>
                <div className="text-2xl font-black text-emerald-600">142</div>
                <div className="text-[11px] text-slate-500 font-semibold">Chiffre d'affaires : <strong>9 355,00 €</strong></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Prospects qualifiés (Lead)</span>
                <div className="text-2xl font-black text-purple-600">48</div>
                <div className="text-[11px] text-slate-500 font-semibold">Taux conversion formulaire : 14,2%</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Qualité correspondance (EMQ)</span>
                <div className="text-2xl font-black text-blue-600">8,6 / 10</div>
                <div className="text-[11px] text-blue-700 font-bold">Excellente (Pixel + CAPI actif)</div>
              </div>
            </div>

            {/* Standard Events Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Événements standard configurés</h3>
                  <p className="text-xs text-slate-400 font-medium">Suivi automatique via le Pixel Meta et l'API Conversions</p>
                </div>
                <button 
                  onClick={() => setActiveSubTab('test')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                >
                  Tester un événement
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Événement</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4">Canal de réception</th>
                      <th className="py-3 px-4 text-right">Nombre d'événements (28j)</th>
                      <th className="py-3 px-4 text-right">Dernière réception</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[
                      { name: 'PageView', desc: 'Affichage de page web', status: 'Actif', channel: 'Navigateur (Pixel)', count: '14 520', last: 'Il y a 1 min' },
                      { name: 'ViewContent', desc: 'Consultation de fiche produit', status: 'Actif', channel: 'Navigateur & Serveur', count: '4 120', last: 'Il y a 3 min' },
                      { name: 'AddToCart', desc: 'Ajout au panier', status: 'Actif', channel: 'Navigateur & Serveur', count: '850', last: 'Il y a 8 min' },
                      { name: 'InitiateCheckout', desc: 'Accès au tunnel de paiement', status: 'Actif', channel: 'Navigateur & Serveur', count: '310', last: 'Il y a 10 min' },
                      { name: 'Purchase', desc: 'Achat validé avec montant', status: 'Actif', channel: 'Navigateur & Serveur (CAPI)', count: '142', last: 'Il y a 12 min' },
                      { name: 'Lead', desc: 'Soumission formulaire de contact', status: 'Actif', channel: 'Navigateur (Pixel)', count: '48', last: 'Il y a 25 min' }
                    ].map(ev => (
                      <tr key={ev.name} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <div>
                            <div>{ev.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{ev.desc}</div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                            {ev.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{ev.channel}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-800">{ev.count}</td>
                        <td className="py-3.5 px-4 text-right text-slate-400">{ev.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 2: TEST EVENTS                                       */}
        {/* -------------------------------------------------------- */}
        {activeSubTab === 'test' && (
          <div className="space-y-6">
            
            {/* Interactive Simulator Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">Simulateur de Test d'Événements en Direct</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Déclenchez un événement pour vérifier sa prise en compte instantanée dans le Gestionnaire d'Événements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Type d'événement</label>
                  <select 
                    value={simulatedEventType}
                    onChange={(e) => setSimulatedEventType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="Purchase">Purchase (Achat validé)</option>
                    <option value="Lead">Lead (Prospect / Formulaire)</option>
                    <option value="AddToCart">AddToCart (Ajout au panier)</option>
                    <option value="PageView">PageView (Page vue)</option>
                  </select>
                </div>

                {simulatedEventType === 'Purchase' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Montant d'achat (€)</label>
                      <input 
                        type="number"
                        value={simulatedValue}
                        onChange={(e) => setSimulatedValue(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Devise</label>
                      <input 
                        type="text"
                        value={simulatedCurrency}
                        onChange={(e) => setSimulatedCurrency(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none uppercase font-mono"
                      />
                    </div>
                  </>
                )}

                <div>
                  <button
                    onClick={handleTriggerTestEvent}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Zap size={14} />
                    <span>Déclencher l'événement</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Logs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-sm font-black text-slate-900">Journal des événements reçus (Temps réel)</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{receivedEvents.length} événements enregistrés</span>
              </div>

              <div className="space-y-3">
                {receivedEvents.map(ev => (
                  <div key={ev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{ev.eventName}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">
                          {ev.source}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">{ev.time}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">
                      URL: {ev.url}
                    </div>

                    <div className="p-2.5 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[10px] overflow-x-auto">
                      {JSON.stringify(ev.parameters, null, 2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 3: INSTALLATION DU PIXEL                             */}
        {/* -------------------------------------------------------- */}
        {activeSubTab === 'install' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">Méthodes d'Installation du Pixel Meta</h3>
                <p className="text-xs text-slate-400 font-medium">Choisissez la méthode adaptée à votre environnement technique.</p>
              </div>

              {/* Option A: GTM */}
              <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-800 tracking-wider">
                    Méthode Recommandée : Google Tag Manager (GTM)
                  </span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">Idéal</span>
                </div>
                <p className="text-xs text-blue-900 font-medium">
                  Utilisez votre conteneur Google Tag Manager pour installer le Pixel sans modifier le code source du site web :
                </p>
                <ol className="list-decimal list-inside text-xs text-blue-900 space-y-1 font-medium pl-1">
                  <li>Ouvrez le <strong>Simulateur Google Tag Manager (GTM)</strong> dans l'application.</li>
                  <li>Créez une nouvelle balise de type <strong>Meta Pixel</strong>.</li>
                  <li>Renseignez votre ID de Pixel : <code className="bg-white px-1.5 py-0.5 rounded font-bold font-mono">482910482910482</code>.</li>
                  <li>Associez le déclencheur <strong>All Pages (Toutes les pages)</strong> pour le code de base <code>PageView</code>.</li>
                  <li>Pour les événements de conversion (ex: Achat), créez une seconde balise avec le déclencheur <strong>Page Confirmation</strong>.</li>
                </ol>
              </div>

              {/* Option B: Manual snippet */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Méthode Alternative : Code de base JavaScript manuel
                  </label>
                  <button
                    onClick={() => handleCopy(`<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,'script',\n'https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', '482910482910482');\nfbq('track', 'PageView');\n</script>\n<noscript><img height="1" width="1" style="display:none"\nsrc="https://www.facebook.com/tr?id=482910482910482&ev=PageView&noscript=1"\n/></noscript>\n<!-- End Meta Pixel Code -->`, 'manual')}
                    className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"
                  >
                    <Copy size={13} />
                    <span>{copiedCode === 'manual' ? 'Copié !' : 'Copier le code'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto">
{`<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '482910482910482');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=482910482910482&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`}
                </pre>
              </div>

            </div>

          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* TAB 4: CAPI & FIRST-PARTY DATA                           */}
        {/* -------------------------------------------------------- */}
        {activeSubTab === 'capi' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">API Conversions Meta (CAPI) & Données First-Party</h3>
              <p className="text-xs text-slate-400 font-medium">
                Périmètre abordé dans le Module MAD : gestion des données First-Party vs Third-Party.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
                <span className="font-black text-purple-900 uppercase text-[10px] tracking-wider block">
                  Pourquoi utiliser l'API Conversions (CAPI) en plus du Pixel ?
                </span>
                <p className="text-purple-950 font-medium">
                  Le Pixel navigateur est souvent bloqué par les bloqueurs de publicité (AdBlockers), les politiques de confidentialité strictes (iOS 14+ App Tracking Transparency) et les restrictions de cookies tiers (Third-party cookies). L'<strong>API Conversions (CAPI)</strong> transmet les événements directement du serveur web vers les serveurs de Meta, garantissant une transmission 100% fiable des achats et des leads sans dépendre du navigateur client.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="font-black text-slate-800 text-xs block">1. Données First-Party</span>
                  <p className="text-slate-500 text-[11px]">
                    Données collectées directement par l'entreprise avec le consentement de l'utilisateur (adresse email hachée SHA256, numéro de téléphone, historique d'achat).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="font-black text-slate-800 text-xs block">2. Déduplication d'événements</span>
                  <p className="text-slate-500 text-[11px]">
                    Lorsque le Pixel et CAPI envoient le même achat, Meta utilise le paramètre <code>event_id</code> pour ne comptabiliser l'achat qu'une seule fois.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
