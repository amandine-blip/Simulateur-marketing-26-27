import React, { useState } from 'react';
import { 
  X, Zap, Layers, Plus, Trash2, Check, HelpCircle, 
  Clock, ArrowDown, MousePointer, FileText, Sparkles
} from 'lucide-react';
import { GTMTrigger, TriggerType, TriggerFilter } from './types';

interface TriggerEditorModalProps {
  initialTrigger?: GTMTrigger | null;
  onSave: (trigger: GTMTrigger) => void;
  onClose: () => void;
}

export default function TriggerEditorModal({
  initialTrigger,
  onSave,
  onClose
}: TriggerEditorModalProps) {
  const [name, setName] = useState(initialTrigger?.name || 'Nouveau déclencheur');
  const [type, setType] = useState<TriggerType>(initialTrigger?.type || 'page_view');
  
  // Page view specific
  const [pageScope, setPageScope] = useState<'all' | 'some'>(initialTrigger?.pageViewType || 'all');
  
  // Scroll depth specific
  const [scrollPercentages, setScrollPercentages] = useState<string>(
    initialTrigger?.scrollPercentages ? initialTrigger.scrollPercentages.join(', ') : '25, 50, 75, 90'
  );

  // Timer specific
  const [timerInterval, setTimerInterval] = useState<number>(initialTrigger?.timerIntervalMs || 5000);
  const [timerLimit, setTimerLimit] = useState<number>(initialTrigger?.timerLimit || 1);

  // Custom event specific
  const [customEventName, setCustomEventName] = useState<string>(initialTrigger?.eventName || 'purchase');

  // Conditions / Filters
  const [filters, setFilters] = useState<TriggerFilter[]>(
    initialTrigger?.filters && initialTrigger.filters.length > 0 
      ? initialTrigger.filters 
      : [{ variable: 'Page Path', operator: 'contains', value: '/confirmation' }]
  );

  const handleAddFilter = () => {
    setFilters([...filters, { variable: 'Page Path', operator: 'contains', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index: number, field: keyof TriggerFilter, value: any) => {
    const updated = [...filters];
    updated[index] = { ...updated[index], [field]: value };
    setFilters(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Veuillez donner un nom à votre déclencheur.');
      return;
    }

    let summary = '';
    const parsedScroll = scrollPercentages.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

    if (type === 'page_view') {
      if (pageScope === 'all') {
        summary = 'Toutes les pages (All Pages)';
      } else {
        summary = filters.map(f => `${f.variable} ${f.operator === 'contains' ? 'contient' : f.operator === 'equals' ? 'est égal à' : f.operator} "${f.value}"`).join(' ET ');
      }
    } else if (type === 'scroll_depth') {
      summary = `Profondeur de défilement vertical : ${parsedScroll.join('%, ')}%`;
      if (filters.length > 0 && filters[0].value) {
        summary += ` sur ${filters[0].variable} ${filters[0].operator === 'contains' ? 'contient' : 'égal'} "${filters[0].value}"`;
      }
    } else if (type === 'timer') {
      summary = `Minuteur : toutes les ${timerInterval} ms (${timerInterval / 1000}s) • Limite : ${timerLimit}`;
      if (filters.length > 0 && filters[0].value) {
        summary += ` sur ${filters[0].variable} "${filters[0].value}"`;
      }
    } else if (type === 'click') {
      summary = filters.map(f => `${f.variable} ${f.operator === 'contains' ? 'contient' : 'égal'} "${f.value}"`).join(' ET ');
    } else if (type === 'form_submission') {
      summary = filters.map(f => `${f.variable} ${f.operator === 'contains' ? 'contient' : 'égal'} "${f.value}"`).join(' ET ');
    } else if (type === 'custom_event') {
      summary = `Événement dataLayer égal à "${customEventName}"`;
    }

    const newTrigger: GTMTrigger = {
      id: initialTrigger?.id || `trig_${Date.now()}`,
      name: name.trim(),
      type,
      pageViewType: pageScope,
      scrollPercentages: parsedScroll,
      timerIntervalMs: timerInterval,
      timerLimit: timerLimit,
      eventName: customEventName,
      filters: (type === 'page_view' && pageScope === 'all') ? [] : filters,
      conditionSummary: summary || 'Conditions personnalisées'
    };

    onSave(newTrigger);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col z-50 overflow-hidden font-sans text-slate-800 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800">
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Déclencheur sans titre"
              className="text-base font-semibold text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-1 rounded-md border border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-full"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
        >
          Enregistrer
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-[#f1f3f4] overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">

          {/* Trigger Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Configuration du déclencheur</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GTM Real Engine</span>
            </div>

            {/* Type selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Type de déclencheur</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {[
                  { id: 'page_view', name: 'Affichage de page (Page View)', icon: Layers, desc: 'Page Path, Page URL' },
                  { id: 'scroll_depth', name: 'Profondeur de défilement (Scroll)', icon: ArrowDown, desc: '25%, 50%, 75%, 90%' },
                  { id: 'timer', name: 'Minuteur (Timer)', icon: Clock, desc: 'Temps passé (5s, 10s)' },
                  { id: 'click', name: 'Clic - Tous les éléments', icon: MousePointer, desc: 'Boutons, Liens CTA' },
                  { id: 'form_submission', name: 'Envoi de formulaire', icon: FileText, desc: 'Devis, Contact, Lead' },
                  { id: 'custom_event', name: 'Événement personnalisé', icon: Zap, desc: 'purchase, add_to_cart' },
                ].map(opt => {
                  const Icon = opt.icon;
                  const isSelected = type === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setType(opt.id as TriggerType)}
                      className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon size={16} className={isSelected ? 'text-blue-600' : 'text-slate-500'} />
                        {isSelected && <Check size={14} className="text-blue-600" />}
                      </div>
                      <div className="font-bold text-xs text-slate-900">{opt.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Config: Page View */}
            {type === 'page_view' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Ce déclencheur s'active sur :</label>
                  <div className="flex gap-4 text-xs font-semibold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="pageScope" 
                        checked={pageScope === 'all'} 
                        onChange={() => setPageScope('all')}
                        className="text-blue-600" 
                      />
                      <span>Toutes les pages vues</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="pageScope" 
                        checked={pageScope === 'some'} 
                        onChange={() => setPageScope('some')}
                        className="text-blue-600" 
                      />
                      <span>Certaines pages vues (Filtre par Page Path ou Page URL)</span>
                    </label>
                  </div>
                </div>

                {pageScope === 'all' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                    Ce déclencheur est le standard pour charger la <strong>Balise Google (GA4)</strong> ou la <strong>Balise Linker de conversion Google Ads</strong> sur l'ensemble de votre site web.
                  </div>
                )}
              </div>
            )}

            {/* Config: Scroll Depth */}
            {type === 'scroll_depth' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Profondeurs de défilement vertical (en pourcentages)</label>
                  <input
                    type="text"
                    value={scrollPercentages}
                    onChange={(e) => setScrollPercentages(e.target.value)}
                    placeholder="25, 50, 75, 90"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Séparez les pourcentages par des virgules. GTM émettra un événement <code>gtm.scrollDepth</code> dès que le visiteur franchit chaque seuil.
                  </p>
                </div>
              </div>
            )}

            {/* Config: Timer */}
            {type === 'timer' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Intervalle (en millisecondes)</label>
                    <input
                      type="number"
                      value={timerInterval}
                      onChange={(e) => setTimerInterval(Number(e.target.value))}
                      placeholder="5000"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-400">ex: 5000 ms = 5 secondes (mesure d'engagement qualifié)</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Limite</label>
                    <input
                      type="number"
                      value={timerLimit}
                      onChange={(e) => setTimerLimit(Number(e.target.value))}
                      placeholder="1"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-400">Nombre de fois où le minuteur peut s'exécuter</p>
                  </div>
                </div>
              </div>
            )}

            {/* Config: Custom Event */}
            {type === 'custom_event' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nom de l'événement dataLayer</label>
                  <input
                    type="text"
                    value={customEventName}
                    onChange={(e) => setCustomEventName(e.target.value)}
                    placeholder="ex: purchase, generate_lead, add_to_cart"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-blue-700 font-bold"
                  />
                  <p className="text-[11px] text-slate-500">
                    Correspond au nom envoyé par le site web dans <code>dataLayer.push(&#123; event: '{customEventName || 'purchase'}' &#125;)</code>.
                  </p>
                </div>
              </div>
            )}

            {/* FILTERS / CONDITIONS (Page Path, Page URL, Click Classes, etc.) */}
            {(type !== 'page_view' || pageScope === 'some') && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700">Conditions de déclenchement</span>
                    <p className="text-[11px] text-slate-500">Ce déclencheur s'active uniquement si TOUTES les conditions suivantes sont vraies :</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddFilter}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <Plus size={14} /> Ajouter une condition
                  </button>
                </div>

                <div className="space-y-2">
                  {filters.map((filter, index) => (
                    <div key={index} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      {/* Variable */}
                      <select
                        value={filter.variable}
                        onChange={(e) => handleFilterChange(index, 'variable', e.target.value)}
                        className="p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold outline-none flex-1"
                      >
                        <optgroup label="Pages">
                          <option value="Page Path">Page Path (ex: /confirmation-achat)</option>
                          <option value="Page URL">Page URL (ex: https://.../?gclid=)</option>
                          <option value="Page Hostname">Page Hostname</option>
                        </optgroup>
                        <optgroup label="Défilement">
                          <option value="Scroll Depth Threshold">Scroll Depth Threshold (%)</option>
                        </optgroup>
                        <optgroup label="Minuteur">
                          <option value="Timer Elapsed Time">Timer Elapsed Time (ms)</option>
                        </optgroup>
                        <optgroup label="Clics">
                          <option value="Click Classes">Click Classes (ex: btn-primary)</option>
                          <option value="Click ID">Click ID</option>
                          <option value="Click Text">Click Text (ex: Acheter)</option>
                        </optgroup>
                        <optgroup label="Formulaires">
                          <option value="Form ID">Form ID (ex: lead-form)</option>
                        </optgroup>
                      </select>

                      {/* Operator */}
                      <select
                        value={filter.operator}
                        onChange={(e) => handleFilterChange(index, 'operator', e.target.value as any)}
                        className="p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium outline-none"
                      >
                        <option value="contains">contient</option>
                        <option value="equals">est égal à</option>
                        <option value="starts_with">commence par</option>
                        <option value="regex">correspond à la RegEx</option>
                      </select>

                      {/* Value */}
                      <input
                        type="text"
                        value={filter.value}
                        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                        placeholder="valeur attendue"
                        className="p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none flex-1"
                      />

                      {/* Delete */}
                      {filters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFilter(index)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
