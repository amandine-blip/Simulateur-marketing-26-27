import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Globe, Play, RotateCcw, X, CheckCircle2, XCircle, ChevronRight, 
  Tag, Zap, ArrowDown, Clock, MousePointer, FileText, Database, Shield,
  Layers, ShoppingBag, Send
} from 'lucide-react';
import { GTMTag, GTMTrigger, TimelineEvent } from './types';

interface TagAssistantPreviewProps {
  tags: GTMTag[];
  triggers: GTMTrigger[];
  onClose: () => void;
}

export default function TagAssistantPreview({
  tags,
  triggers,
  onClose
}: TagAssistantPreviewProps) {
  // Current page state
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [currentQuery, setCurrentQuery] = useState<string>('');
  
  // Interactive page controls
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [hasSubmittedLead, setHasSubmittedLead] = useState<boolean>(false);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);

  // Inspector inspection
  const [selectedEventId, setSelectedEventId] = useState<number>(2); // default to Container Loaded
  const [inspectTab, setInspectTab] = useState<'tags' | 'variables' | 'datalayer'>('tags');
  const [selectedTagForDetail, setSelectedTagForDetail] = useState<GTMTag | null>(null);

  // Timeline events list
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: 1,
      name: 'Consent Initialization',
      type: 'gtm.init_consent',
      timestamp: '0.00s',
      dataLayerSnapshot: { event: 'gtm.init_consent', 'gtm.uniqueEventId': 1 },
      variablesSnapshot: { 'Event': 'gtm.init_consent' }
    },
    {
      id: 2,
      name: 'Container Loaded',
      type: 'gtm.js',
      timestamp: '0.12s',
      dataLayerSnapshot: { 
        event: 'gtm.js', 
        'gtm.start': 1758540478000, 
        'gtm.uniqueEventId': 2,
        page_path: '/',
        page_url: 'https://boutique-efp.be/'
      },
      variablesSnapshot: { 
        'Event': 'gtm.js',
        'Page Path': '/',
        'Page URL': 'https://boutique-efp.be/',
        'Page Hostname': 'boutique-efp.be'
      }
    },
    {
      id: 3,
      name: 'DOM Ready',
      type: 'gtm.dom',
      timestamp: '0.25s',
      dataLayerSnapshot: { event: 'gtm.dom', 'gtm.uniqueEventId': 3 },
      variablesSnapshot: { 'Event': 'gtm.dom', 'Page Path': '/' }
    }
  ]);

  // Current page full URL
  const currentFullUrl = `https://boutique-efp.be${currentPath}${currentQuery ? `?${currentQuery}` : ''}`;

  // Helper to append events
  const addTimelineEvent = (
    name: string, 
    type: string, 
    extraDataLayer: Record<string, any> = {}, 
    extraVars: Record<string, any> = {}
  ) => {
    const newId = events.length + 1;
    const newEvt: TimelineEvent = {
      id: newId,
      name,
      type,
      timestamp: `${(0.25 + newId * 0.3).toFixed(2)}s`,
      dataLayerSnapshot: {
        event: type,
        'gtm.uniqueEventId': newId,
        page_path: currentPath,
        page_url: currentFullUrl,
        ...extraDataLayer
      },
      variablesSnapshot: {
        'Event': type,
        'Page Path': currentPath,
        'Page URL': currentFullUrl,
        'Page Hostname': 'boutique-efp.be',
        ...extraVars
      }
    };
    setEvents(prev => [...prev, newEvt]);
    setSelectedEventId(newId);
  };

  // Timer simulation ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timerSeconds < 10) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          const next = prev + 1;
          if (next === 5) {
            // Trigger 5000ms timer event!
            addTimelineEvent(
              'Timer (5000ms)', 
              'gtm.timer', 
              { 'gtm.timerInterval': 5000, 'gtm.timerLimit': 1, 'gtm.timerElapsedTime': 5000 },
              { 'Timer Interval': '5000', 'Timer Elapsed Time': '5000', 'Timer Limit': '1' }
            );
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  // Handle Navigation
  const navigateTo = (path: string, query: string = '') => {
    setCurrentPath(path);
    setCurrentQuery(query);
    setScrollProgress(0);
    setTimerSeconds(0);
    setIsTimerActive(true);

    const fullUrl = `https://boutique-efp.be${path}${query ? `?${query}` : ''}`;
    addTimelineEvent(
      `Page View (${path})`, 
      'gtm.js', 
      { page_path: path, page_url: fullUrl },
      { 'Page Path': path, 'Page URL': fullUrl, 'Page Hostname': 'boutique-efp.be' }
    );
  };

  // Handle Scroll Depth Slider
  const handleScrollChange = (percent: number) => {
    setScrollProgress(percent);
    const thresholds = [25, 50, 75, 90];
    const crossed = thresholds.filter(t => percent >= t);
    
    // Check if we just crossed a threshold not yet logged
    const lastCrossed = crossed[crossed.length - 1];
    if (lastCrossed) {
      const alreadyLogged = events.some(e => e.name.includes(`Scroll Depth (${lastCrossed}%)`));
      if (!alreadyLogged) {
        addTimelineEvent(
          `Scroll Depth (${lastCrossed}%)`, 
          'gtm.scrollDepth',
          {
            'gtm.scrollThreshold': lastCrossed,
            'gtm.scrollUnits': 'percent',
            'gtm.scrollDirection': 'vertical'
          },
          {
            'Scroll Depth Threshold': `${lastCrossed}`,
            'Scroll Depth Units': 'percent',
            'Scroll Direction': 'vertical'
          }
        );
      }
    }
  };

  // Get active timeline event
  const currentEvent = events.find(e => e.id === selectedEventId) || events[events.length - 1];

  // Evaluate if a trigger fires for the selected event
  const checkTriggerFires = (trigger: GTMTrigger, evt: TimelineEvent): { fires: boolean; details: { condition: string; pass: boolean; actual: string }[] } => {
    const details: { condition: string; pass: boolean; actual: string }[] = [];

    // 1. Check Event Type match
    if (trigger.type === 'page_view') {
      const isPageViewEvent = evt.type === 'gtm.js' || evt.type === 'gtm.dom' || evt.type === 'gtm.load';
      if (!isPageViewEvent) {
        return {
          fires: false,
          details: [{ condition: 'Événement est Page View (gtm.js)', pass: false, actual: evt.type }]
        };
      }
      if (trigger.pageViewType === 'all') {
        return {
          fires: true,
          details: [{ condition: 'Toutes les pages vues', pass: true, actual: evt.variablesSnapshot['Page Path'] || '/' }]
        };
      }
    } else if (trigger.type === 'scroll_depth') {
      if (evt.type !== 'gtm.scrollDepth') {
        return {
          fires: false,
          details: [{ condition: 'Événement est gtm.scrollDepth', pass: false, actual: evt.type }]
        };
      }
    } else if (trigger.type === 'timer') {
      if (evt.type !== 'gtm.timer') {
        return {
          fires: false,
          details: [{ condition: 'Événement est gtm.timer', pass: false, actual: evt.type }]
        };
      }
    } else if (trigger.type === 'click') {
      if (evt.type !== 'gtm.click') {
        return {
          fires: false,
          details: [{ condition: 'Événement est gtm.click', pass: false, actual: evt.type }]
        };
      }
    } else if (trigger.type === 'form_submission') {
      if (evt.type !== 'gtm.formSubmit') {
        return {
          fires: false,
          details: [{ condition: 'Événement est gtm.formSubmit', pass: false, actual: evt.type }]
        };
      }
    } else if (trigger.type === 'custom_event') {
      const targetName = trigger.eventName || '';
      if (evt.type !== targetName) {
        return {
          fires: false,
          details: [{ condition: `Événement dataLayer == "${targetName}"`, pass: false, actual: evt.type }]
        };
      }
    }

    // 2. Evaluate all filters
    let allPass = true;
    for (const filter of trigger.filters) {
      const actualVal = String(evt.variablesSnapshot[filter.variable] || evt.dataLayerSnapshot[filter.variable] || '');
      let pass = false;

      if (filter.operator === 'contains') {
        pass = actualVal.toLowerCase().includes(filter.value.toLowerCase());
      } else if (filter.operator === 'equals') {
        pass = actualVal.toLowerCase() === filter.value.toLowerCase();
      } else if (filter.operator === 'starts_with') {
        pass = actualVal.toLowerCase().startsWith(filter.value.toLowerCase());
      } else {
        pass = actualVal.includes(filter.value);
      }

      if (!pass) allPass = false;

      details.push({
        condition: `${filter.variable} ${filter.operator === 'contains' ? 'contient' : 'égal'} "${filter.value}"`,
        pass,
        actual: actualVal || '(indéfini)'
      });
    }

    return { fires: allPass, details };
  };

  // Evaluate Tags Fired vs Not Fired for the selected event
  const evaluatedTags = tags.map(tag => {
    const trigger = triggers.find(t => t.id === tag.triggerId);
    if (!trigger || tag.status !== 'active') {
      return { tag, trigger, fires: false, details: [{ condition: 'Balise en pause ou déclencheur manquant', pass: false, actual: '' }] };
    }
    const evalResult = checkTriggerFires(trigger, currentEvent);
    return { tag, trigger, fires: evalResult.fires, details: evalResult.details };
  });

  const firedTags = evaluatedTags.filter(t => t.fires);
  const notFiredTags = evaluatedTags.filter(t => !t.fires);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col z-50 overflow-hidden font-sans text-slate-800 animate-in fade-in">
      
      {/* Top Tag Assistant Header */}
      <header className="h-14 bg-slate-900 text-white px-6 flex items-center justify-between border-b border-slate-800 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-xs tracking-tight">Tag Assistant Preview actif</span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            Conteneur GTM-WK928LP
          </span>
          <span className="text-[10px] text-blue-300 font-mono hidden sm:inline">
            Domaine : boutique-efp.be
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEvents(events.slice(0, 3));
              setSelectedEventId(2);
              setCurrentPath('/');
              setCurrentQuery('');
              setScrollProgress(0);
              setTimerSeconds(0);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Réinitialiser la session</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Quitter le débogage
          </button>
        </div>
      </header>

      {/* Split Window */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: SIMULATED TEST WEBSITE                       */}
        {/* ======================================================== */}
        <div className="flex-1 bg-slate-100 flex flex-col border-r border-slate-300 overflow-y-auto">
          
          {/* Simulated Browser Address Bar */}
          <div className="h-11 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-2 shrink-0 shadow-2xs">
            <div className="flex items-center gap-2 flex-1 max-w-xl bg-slate-100 px-3 py-1.5 rounded-lg text-xs">
              <Globe size={13} className="text-slate-400 shrink-0" />
              <span className="font-mono text-[11px] text-slate-800 font-semibold truncate">
                {currentFullUrl}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
              <span className="text-slate-400">Navigation rapide :</span>
              <button 
                onClick={() => navigateTo('/')}
                className={`px-2 py-0.5 rounded ${currentPath === '/' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200'}`}
              >
                /
              </button>
              <button 
                onClick={() => navigateTo('/formation-marketing')}
                className={`px-2 py-0.5 rounded ${currentPath === '/formation-marketing' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200'}`}
              >
                /formation
              </button>
              <button 
                onClick={() => navigateTo('/contact-devis')}
                className={`px-2 py-0.5 rounded ${currentPath === '/contact-devis' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200'}`}
              >
                /contact
              </button>
              <button 
                onClick={() => navigateTo('/confirmation-achat')}
                className={`px-2 py-0.5 rounded ${currentPath === '/confirmation-achat' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200'}`}
              >
                /merci
              </button>
              <button 
                onClick={() => navigateTo('/promo-landing', 'gclid=test_gads_123')}
                className={`px-2 py-0.5 rounded ${currentQuery.includes('gclid') ? 'bg-teal-600 text-white' : 'hover:bg-slate-200 text-teal-700'}`}
                title="Tester URL avec gclid Google Ads"
              >
                ?gclid=
              </button>
            </div>
          </div>

          {/* Interactive Simulation Controls Bar (Scroll & Timer) */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Scroll Slider */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <ArrowDown size={14} className="text-blue-600 shrink-0" />
              <span className="font-bold text-slate-700 whitespace-nowrap">
                Défilement ({scrollProgress}%) :
              </span>
              <input 
                type="range"
                min="0"
                max="100"
                value={scrollProgress}
                onChange={(e) => handleScrollChange(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-blue-200 rounded-lg"
              />
              <div className="flex gap-1 text-[10px] font-mono font-bold text-slate-500">
                <button onClick={() => handleScrollChange(50)} className="px-1.5 py-0.5 bg-white border border-blue-200 rounded hover:bg-blue-100">50%</button>
                <button onClick={() => handleScrollChange(90)} className="px-1.5 py-0.5 bg-white border border-blue-200 rounded hover:bg-blue-100">90%</button>
              </div>
            </div>

            {/* Timer Ticker */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
              <Clock size={14} className="text-indigo-600" />
              <span className="font-bold text-slate-700">Minuteur :</span>
              <span className="font-mono font-bold text-indigo-700 text-sm">
                {timerSeconds}s
              </span>
              {timerSeconds >= 5 && (
                <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded text-[9px] font-black uppercase">
                  5s Fired!
                </span>
              )}
            </div>

          </div>

          {/* Simulated Webpage Content */}
          <div className="p-6 flex-1 max-w-xl mx-auto w-full space-y-6">
            
            {/* Website Navbar */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                  EFP
                </div>
                <span className="font-black text-slate-900 text-sm">Boutique EFP Digital</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                <button 
                  onClick={() => navigateTo('/')}
                  className={`hover:text-blue-600 ${currentPath === '/' ? 'text-blue-600 underline font-black' : ''}`}
                >
                  Accueil
                </button>
                <button 
                  onClick={() => navigateTo('/formation-marketing')}
                  className={`hover:text-blue-600 ${currentPath === '/formation-marketing' ? 'text-blue-600 underline font-black' : ''}`}
                >
                  Formation
                </button>
                <button 
                  onClick={() => navigateTo('/contact-devis')}
                  className={`hover:text-blue-600 ${currentPath === '/contact-devis' ? 'text-blue-600 underline font-black' : ''}`}
                >
                  Contact
                </button>
              </div>
            </div>

            {/* PAGE: HOME */}
            {currentPath === '/' && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Shield size={12} /> Page d'accueil (All Pages)
                </div>
                <h1 className="text-xl font-black text-slate-900">
                  Découvrez nos Formations en Marketing Digital
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sur cette page d'accueil, la balise <strong>Balise Google (GA4)</strong> et la <strong>Balise Linker de conversion</strong> doivent se déclencher automatiquement.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      addTimelineEvent(
                        'Click (btn-primary)', 
                        'gtm.click',
                        { 'gtm.elementClasses': 'btn-primary cta-home', 'gtm.elementText': 'Explorer la formation' },
                        { 'Click Classes': 'btn-primary cta-home', 'Click Text': 'Explorer la formation' }
                      );
                      navigateTo('/formation-marketing');
                    }}
                    className="btn-primary px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2"
                  >
                    <MousePointer size={14} />
                    <span>Explorer la formation (btn-primary)</span>
                  </button>

                  <button
                    onClick={() => navigateTo('/contact-devis')}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center"
                  >
                    Demander un devis
                  </button>
                </div>
              </div>
            )}

            {/* PAGE: PRODUCT */}
            {currentPath === '/formation-marketing' && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Certificat professionnel</span>
                    <h2 className="text-lg font-black text-slate-900">Masterclass Google Tag Manager & Ads</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900">79,99 €</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Ce cours pratique vous forme au paramétrage du suivi des conversions Google Ads, GA4, des événements de scroll et des minuteurs d'engagement.
                </p>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium space-y-1">
                  <div className="font-bold">Astuce de test GTM :</div>
                  <div>• Ajustez le défilement (Scroll) au-dessus de 50% pour émettre un événement <code>gtm.scrollDepth</code>.</div>
                  <div>• Laissez le minuteur tourner jusqu'à 5s pour émettre <code>gtm.timer</code>.</div>
                </div>

                <button
                  onClick={() => {
                    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                    navigateTo('/confirmation-achat');
                  }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <ShoppingBag size={15} />
                  <span>Acheter la formation (Aller à la page de confirmation)</span>
                </button>
              </div>
            )}

            {/* PAGE: LEAD FORM */}
            {currentPath === '/contact-devis' && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-base font-black text-slate-900">Demande de devis entreprise (Lead)</h2>
                <form 
                  id="lead-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setHasSubmittedLead(true);
                    confetti({ particleCount: 80, spread: 60 });
                    addTimelineEvent(
                      'Form Submit (lead-form)',
                      'gtm.formSubmit',
                      { 'gtm.elementId': 'lead-form', form_name: 'contact_devis' },
                      { 'Form ID': 'lead-form', 'Form Element': '#lead-form' }
                    );
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nom complet</label>
                    <input 
                      type="text" 
                      defaultValue="Amandine V." 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email professionnel</label>
                    <input 
                      type="email" 
                      defaultValue="contact@amandinevanderbecq.be" 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <Send size={13} />
                    <span>Envoyer la demande (Émettre gtm.formSubmit)</span>
                  </button>
                </form>

                {hasSubmittedLead && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span>Formulaire soumis ! L'événement a été poussé dans le Tag Assistant.</span>
                  </div>
                )}
              </div>
            )}

            {/* PAGE: CONFIRMATION ACHAT (Conversion) */}
            {currentPath === '/confirmation-achat' && (
              <div className="bg-white p-8 rounded-3xl border border-emerald-300 shadow-sm text-center space-y-4 bg-emerald-50/20">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={30} />
                </div>
                <h2 className="text-xl font-black text-slate-900">Merci pour votre commande !</h2>
                <p className="text-xs text-slate-600 font-medium">
                  Votre commande <strong>#CMD-94821</strong> d'un montant de <strong>79,99 €</strong> est validée.
                </p>

                <div className="p-4 bg-emerald-100/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium space-y-2 text-left">
                  <div className="font-black text-emerald-900 flex items-center gap-2">
                    <Tag size={15} className="text-emerald-700" />
                    Déclenchement des Balises de Conversion :
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-emerald-900">
                    <li>Condition <code>Page Path contient "/confirmation-achat"</code> est <strong>VRAIE</strong> ✅</li>
                    <li>La balise <strong>Suivi des conversions Google Ads</strong> et l'événement <strong>GA4 purchase</strong> se déclenchent ici !</li>
                  </ul>
                </div>
              </div>
            )}

            {/* PAGE: PROMO LANDING (Testing gclid) */}
            {currentPath === '/promo-landing' && (
              <div className="bg-white p-8 rounded-3xl border border-teal-200 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Globe size={12} /> Campagne Google Ads simulée
                </div>
                <h2 className="text-lg font-black text-slate-900">Landing Page Promotionnelle</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cette page a été chargée avec un paramètre <code>?gclid=test_gads_123</code> dans son <code>Page URL</code>.
                </p>
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 font-mono">
                  Page URL: {currentFullUrl}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: TAG ASSISTANT INSPECTOR PANEL               */}
        {/* ======================================================== */}
        <div className="w-full lg:w-[500px] bg-white flex flex-col h-full overflow-hidden border-t lg:border-t-0 shadow-lg">
          
          {/* Inspector Top Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="font-black text-xs text-slate-900 uppercase tracking-wider">Inspecteur de Balises</span>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Événement #{currentEvent.id} : {currentEvent.name}
            </span>
          </div>

          {/* Timeline of Events */}
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold shrink-0">
            {events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedEventId === ev.id 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{ev.id}.</span>
                <span>{ev.name}</span>
              </button>
            ))}
          </div>

          {/* Inspector Tabs (Tags / Variables / DataLayer) */}
          <div className="flex border-b border-slate-200 bg-white text-xs font-bold shrink-0">
            <button
              onClick={() => setInspectTab('tags')}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                inspectTab === 'tags' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Balises ({firedTags.length} Fired)
            </button>
            <button
              onClick={() => setInspectTab('variables')}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                inspectTab === 'variables' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Variables
            </button>
            <button
              onClick={() => setInspectTab('datalayer')}
              className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
                inspectTab === 'datalayer' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              DataLayer
            </button>
          </div>

          {/* Inspector Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* TAB: TAGS */}
            {inspectTab === 'tags' && (
              <div className="space-y-6">
                
                {/* Tags Fired */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Balises Déclenchées ({firedTags.length}) - Tags Fired
                    </h4>
                  </div>

                  {firedTags.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400 text-center font-medium">
                      Aucune balise ne s'est activée lors de cet événement.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {firedTags.map(({ tag, trigger, details }) => (
                        <div 
                          key={tag.id}
                          onClick={() => setSelectedTagForDetail(selectedTagForDetail?.id === tag.id ? null : tag)}
                          className="p-3.5 bg-emerald-50/60 border border-emerald-200 hover:border-emerald-300 rounded-xl text-xs space-y-2 cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-emerald-950 flex items-center gap-1.5">
                              <CheckCircle2 size={15} className="text-emerald-600" />
                              {tag.name}
                            </span>
                            <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-900 rounded text-[9px] font-black uppercase">
                              Succeeded
                            </span>
                          </div>

                          <div className="text-[11px] text-emerald-800 font-mono">
                            Déclencheur : <strong>{trigger?.name}</strong>
                          </div>

                          {/* Condition pass breakdown */}
                          <div className="pt-2 border-t border-emerald-100 space-y-1">
                            {details.map((d, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[10px] text-emerald-800">
                                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                <span>Condition Vraie : <strong>{d.condition}</strong> (Valeur actuelle: <em>{d.actual}</em>)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags Not Fired */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Balises Non Déclenchées ({notFiredTags.length}) - Tags Not Fired
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {notFiredTags.map(({ tag, trigger, details }) => (
                      <div 
                        key={tag.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 opacity-80"
                      >
                        <div className="font-bold text-slate-700">{tag.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Déclencheur : {trigger?.name}
                        </div>
                        {details.filter(d => !d.pass).map((d, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] text-red-600 font-medium">
                            <XCircle size={12} className="shrink-0" />
                            <span>Condition non remplie : {d.condition} (Valeur constatée: <em>{d.actual}</em>)</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: VARIABLES */}
            {inspectTab === 'variables' && (
              <div className="space-y-4">
                <div className="text-[11px] text-slate-500 font-medium">
                  Valeurs exactes résolues par Google Tag Manager lors de l'événement <strong>{currentEvent.name}</strong> :
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Variable</th>
                        <th className="p-2.5">Valeur résolue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {Object.entries(currentEvent.variablesSnapshot).map(([key, val]) => (
                        <tr key={key} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-800">{`{{${key}}}`}</td>
                          <td className="p-2.5 text-blue-700 break-all">{String(val)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: DATALAYER */}
            {inspectTab === 'datalayer' && (
              <div className="space-y-4">
                <div className="text-[11px] text-slate-500 font-medium">
                  Capture instantanée du <code>window.dataLayer</code> après l'événement <strong>{currentEvent.name}</strong> :
                </div>

                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {JSON.stringify(currentEvent.dataLayerSnapshot, null, 2)}
                </pre>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
