import React, { useState } from 'react';
import { 
  X, Folder, MoreVertical, Tag, Zap, ChevronRight, Check, 
  HelpCircle, Trash2, Edit2, AlertCircle, Plus, Sparkles, Layers
} from 'lucide-react';
import { GTMTag, GTMTrigger, TagType } from './types';

interface TagEditorModalProps {
  initialTag?: GTMTag | null;
  triggers: GTMTrigger[];
  onSave: (tag: GTMTag) => void;
  onClose: () => void;
  onOpenTriggerModal: () => void;
}

export const TAG_TYPE_CONFIGS: Record<TagType, {
  name: string;
  category: 'Google Analytics' | 'Google Ads' | 'Meta' | 'Personnalisé';
  iconBg: string;
  iconText: string;
  badge: string;
  description: string;
}> = {
  gads_conversion: {
    name: 'Suivi des conversions Google Ads',
    category: 'Google Ads',
    iconBg: 'bg-teal-600',
    iconText: 'Ads',
    badge: 'Conversion',
    description: 'Enregistre les actions précieuses (achats, leads) pour optimiser les enchères Smart Bidding.'
  },
  gads_linker: {
    name: 'Balise Linker de conversion (Conversion Linker)',
    category: 'Google Ads',
    iconBg: 'bg-teal-700',
    iconText: 'Lnk',
    badge: 'Indispensable',
    description: 'Stocke les identifiants de clic publicitaire (gclid) dans des cookies 1st-party conformes ITP.'
  },
  gads_remarketing: {
    name: 'Remarketing Google Ads',
    category: 'Google Ads',
    iconBg: 'bg-teal-800',
    iconText: 'Rem',
    badge: 'Audience',
    description: 'Recueille des signaux pour réengager les visiteurs de pages spécifiques dans le Réseau Display ou Search.'
  },
  ga4_config: {
    name: 'Balise Google (Configuration GA4)',
    category: 'Google Analytics',
    iconBg: 'bg-blue-600',
    iconText: 'GA4',
    badge: 'Base',
    description: 'Charge gtag.js, initialise le flux web et transmet automatiquement page_view, scroll, session_start.'
  },
  ga4_event: {
    name: 'Google Analytics : Événement GA4',
    category: 'Google Analytics',
    iconBg: 'bg-indigo-600',
    iconText: 'Evt',
    badge: 'Événement',
    description: 'Envoie des événements personnalisés et recommandés (generate_lead, purchase, scroll_depth).'
  },
  meta_pixel: {
    name: 'Meta Pixel (Facebook Pixel)',
    category: 'Meta',
    iconBg: 'bg-purple-600',
    iconText: 'FB',
    badge: 'Réseaux',
    description: 'Active le pixel de tracking Meta pour mesurer les conversions et recibler les utilisateurs.'
  },
  custom_html: {
    name: 'Balise HTML personnalisée',
    category: 'Personnalisé',
    iconBg: 'bg-slate-700',
    iconText: '</>',
    badge: 'Script',
    description: 'Permet d’insérer n’importe quel script JavaScript ou balise image tierce (TikTok, Hotjar, etc.).'
  }
};

export default function TagEditorModal({
  initialTag,
  triggers,
  onSave,
  onClose,
  onOpenTriggerModal
}: TagEditorModalProps) {
  // Tag state
  const [tagName, setTagName] = useState(initialTag?.name || 'Balise sans titre');
  const [tagType, setTagType] = useState<TagType | null>(initialTag?.type || null);
  const [triggerId, setTriggerId] = useState<string>(initialTag?.triggerId || '');
  const [isSelectingType, setIsSelectingType] = useState(false);
  const [isSelectingTrigger, setIsSelectingTrigger] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Field states
  // Google Ads
  const [conversionId, setConversionId] = useState(initialTag?.conversionId || 'AW-1082947192');
  const [conversionLabel, setConversionLabel] = useState(initialTag?.conversionLabel || 'AbC123XyZ_purchase');
  const [conversionValue, setConversionValue] = useState(initialTag?.conversionValue || '{{DLV - value}}');
  const [currencyCode, setCurrencyCode] = useState(initialTag?.currencyCode || 'EUR');
  const [transactionId, setTransactionId] = useState(initialTag?.transactionId || '{{DLV - transaction_id}}');
  const [enhancedConversions, setEnhancedConversions] = useState(initialTag?.enhancedConversions ?? true);

  // GA4
  const [measurementId, setMeasurementId] = useState(initialTag?.measurementId || 'G-84729104');
  const [ga4EventName, setGa4EventName] = useState(initialTag?.ga4EventName || 'purchase');
  const [eventParams, setEventParams] = useState<{ key: string; value: string }[]>(
    initialTag?.eventParameters || [
      { key: 'currency', value: 'EUR' },
      { key: 'value', value: '{{DLV - value}}' }
    ]
  );

  // Meta Pixel
  const [pixelId, setPixelId] = useState(initialTag?.pixelId || '482910482910482');
  const [pixelEvent, setPixelEvent] = useState(initialTag?.pixelEvent || 'Purchase');

  // Custom HTML
  const [htmlCode, setHtmlCode] = useState(
    initialTag?.htmlCode || `<script>\n  console.log("Balise personnalisée exécutée sur: " + {{Page Path}});\n</script>`
  );

  const [firingOption, setFiringOption] = useState<'once_per_event' | 'once_per_page' | 'unlimited'>(
    initialTag?.firingOption || 'once_per_event'
  );

  const selectedTrigger = triggers.find(t => t.id === triggerId);

  const handleSave = () => {
    if (!tagType) {
      alert('Veuillez sélectionner un type de balise dans "Configuration de la balise".');
      return;
    }
    if (!triggerId) {
      alert('Veuillez associer un déclencheur à cette balise dans la section "Déclenchement".');
      return;
    }

    const finalTag: GTMTag = {
      id: initialTag?.id || `tag_${Date.now()}`,
      name: tagName.trim() || 'Balise sans titre',
      type: tagType,
      triggerId,
      status: initialTag?.status || 'active',
      firingOption,
      ...(tagType === 'gads_conversion' && {
        conversionId,
        conversionLabel,
        conversionValue,
        currencyCode,
        transactionId,
        enhancedConversions
      }),
      ...(tagType === 'gads_linker' && {}),
      ...(tagType === 'gads_remarketing' && {
        conversionId
      }),
      ...(tagType === 'ga4_config' && {
        measurementId
      }),
      ...(tagType === 'ga4_event' && {
        measurementId,
        ga4EventName,
        eventParameters: eventParams
      }),
      ...(tagType === 'meta_pixel' && {
        pixelId,
        pixelEvent
      }),
      ...(tagType === 'custom_html' && {
        htmlCode
      })
    };

    onSave(finalTag);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col z-50 overflow-hidden font-sans text-slate-800 animate-in fade-in duration-150">
      
      {/* Top Header Bar matching Google Tag Manager (Screenshot exact layout) */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            title="Fermer"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <input 
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Balise sans titre"
              className="text-base font-semibold text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-1 rounded-md border border-transparent hover:border-slate-300 focus:border-blue-500 outline-none w-full transition-all"
            />
            <div className="text-slate-400 p-1 hover:text-slate-600 cursor-pointer" title="Dossier">
              <Folder size={18} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
          >
            Enregistrer
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#f1f3f4] overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-4xl space-y-6">

          {/* ======================================================== */}
          {/* CARD 1: CONFIGURATION DE LA BALISE                      */}
          {/* ======================================================== */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Configuration de la balise</span>
                {tagType && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-black border border-blue-200">
                    {TAG_TYPE_CONFIGS[tagType].category}
                  </span>
                )}
              </div>

              {tagType && (
                <button
                  onClick={() => setIsSelectingType(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <Edit2 size={13} />
                  <span>Modifier le type</span>
                </button>
              )}
            </div>

            {/* Empty State: Matching screenshot */}
            {!tagType ? (
              <div 
                onClick={() => setIsSelectingType(true)}
                className="p-12 text-center cursor-pointer hover:bg-slate-50 transition-colors group flex flex-col items-center justify-center min-h-[220px]"
              >
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform mb-3 shadow-inner">
                  <Tag size={28} className="fill-slate-300 text-slate-300" />
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1.5">
                  Sélectionnez un type de balise pour commencer la configuration...
                </p>
                <span className="text-xs text-blue-600 font-semibold hover:underline">
                  En savoir plus
                </span>
              </div>
            ) : (
              /* Configured Fields for Selected Tag */
              <div className="p-6 space-y-6">
                
                {/* Header of selected tag */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className={`w-12 h-12 rounded-xl ${TAG_TYPE_CONFIGS[tagType].iconBg} text-white flex items-center justify-center font-black text-xs shadow-xs`}>
                    {TAG_TYPE_CONFIGS[tagType].iconText}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{TAG_TYPE_CONFIGS[tagType].name}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {TAG_TYPE_CONFIGS[tagType].badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {TAG_TYPE_CONFIGS[tagType].description}
                    </p>
                  </div>
                </div>

                {/* FIELDS SPECIFIC TO GOOGLE ADS CONVERSION */}
                {tagType === 'gads_conversion' && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                          <span>ID de conversion</span>
                          <span className="text-[10px] text-slate-400">ex: AW-1082947192</span>
                        </label>
                        <input
                          type="text"
                          value={conversionId}
                          onChange={(e) => setConversionId(e.target.value)}
                          placeholder="AW-XXXXXXX"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                          <span>Libellé de conversion</span>
                          <span className="text-[10px] text-slate-400">Généré dans Google Ads</span>
                        </label>
                        <input
                          type="text"
                          value={conversionLabel}
                          onChange={(e) => setConversionLabel(e.target.value)}
                          placeholder="AbC123XyZ"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Valeur de conversion</label>
                        <input
                          type="text"
                          value={conversionValue}
                          onChange={(e) => setConversionValue(e.target.value)}
                          placeholder="{{DLV - value}}"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Code de la devise</label>
                        <input
                          type="text"
                          value={currencyCode}
                          onChange={(e) => setCurrencyCode(e.target.value)}
                          placeholder="EUR"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">ID de transaction</label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="{{DLV - transaction_id}}"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Enhanced Conversions Checkbox */}
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                      <div className="text-xs">
                        <div className="font-bold text-teal-900">Activer les conversions améliorées (Enhanced Conversions)</div>
                        <div className="text-teal-700 text-[11px]">Transmet les signaux utilisateur hachés (email, tel) pour combler les pertes de cookies tiers.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={enhancedConversions}
                        onChange={(e) => setEnhancedConversions(e.target.checked)}
                        className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* FIELDS SPECIFIC TO CONVERSION LINKER */}
                {tagType === 'gads_linker' && (
                  <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl text-xs space-y-2 text-teal-900">
                    <div className="font-bold flex items-center gap-2">
                      <Sparkles size={15} className="text-teal-600" />
                      Raisonnement GTM - Balise Linker de conversion :
                    </div>
                    <p className="leading-relaxed text-teal-800">
                      Cette balise détecte automatiquement les paramètres de clic d'annonce (<code>gclid</code>, <code>dclid</code>) dans les URL de la page de destination et stocke ces informations dans des cookies propriétaires (1st-party) sur votre domaine. Elle doit être déclenchée sur <strong>Toutes les pages (All Pages)</strong>.
                    </p>
                  </div>
                )}

                {/* FIELDS SPECIFIC TO GA4 CONFIG */}
                {tagType === 'ga4_config' && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">ID de mesure (Measurement ID)</label>
                      <input
                        type="text"
                        value={measurementId}
                        onChange={(e) => setMeasurementId(e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Cette balise envoie l'événement de base <code>page_view</code> et configure le conteneur Google Analytics 4.
                    </p>
                  </div>
                )}

                {/* FIELDS SPECIFIC TO GA4 EVENT */}
                {tagType === 'ga4_event' && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">ID de mesure ou Balise de configuration</label>
                        <input
                          type="text"
                          value={measurementId}
                          onChange={(e) => setMeasurementId(e.target.value)}
                          placeholder="G-84729104"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Nom de l'événement GA4</label>
                        <input
                          type="text"
                          value={ga4EventName}
                          onChange={(e) => setGa4EventName(e.target.value)}
                          placeholder="ex: purchase, generate_lead, scroll_depth"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-blue-700 font-bold"
                        />
                      </div>
                    </div>

                    {/* Parameters Table */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Paramètres d'événement</span>
                        <button
                          type="button"
                          onClick={() => setEventParams([...eventParams, { key: '', value: '' }])}
                          className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                        >
                          <Plus size={13} /> Ajouter une ligne
                        </button>
                      </div>

                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 border-b border-slate-200">
                            <tr>
                              <th className="p-2.5">Nom de la propriété (clé)</th>
                              <th className="p-2.5">Valeur (ou Variable)</th>
                              <th className="p-2.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {eventParams.map((p, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={p.key}
                                    onChange={(e) => {
                                      const updated = [...eventParams];
                                      updated[idx].key = e.target.value;
                                      setEventParams(updated);
                                    }}
                                    placeholder="ex: page_path, currency"
                                    className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-mono"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={p.value}
                                    onChange={(e) => {
                                      const updated = [...eventParams];
                                      updated[idx].value = e.target.value;
                                      setEventParams(updated);
                                    }}
                                    placeholder="ex: {{Page Path}}, {{DLV - value}}"
                                    className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs font-mono"
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => setEventParams(eventParams.filter((_, i) => i !== idx))}
                                    className="text-slate-400 hover:text-red-600 p-1"
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
                  </div>
                )}

                {/* FIELDS SPECIFIC TO META PIXEL */}
                {tagType === 'meta_pixel' && (
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">ID du Pixel Meta</label>
                        <input
                          type="text"
                          value={pixelId}
                          onChange={(e) => setPixelId(e.target.value)}
                          placeholder="482910482910482"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Événement standard</label>
                        <select
                          value={pixelEvent}
                          onChange={(e) => setPixelEvent(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          <option value="PageView">PageView (Page vue)</option>
                          <option value="ViewContent">ViewContent (Vue produit)</option>
                          <option value="AddToCart">AddToCart (Ajout panier)</option>
                          <option value="InitiateCheckout">InitiateCheckout (Passage en caisse)</option>
                          <option value="Purchase">Purchase (Achat validé)</option>
                          <option value="Lead">Lead (Prospect formulaires)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* FIELDS SPECIFIC TO CUSTOM HTML */}
                {tagType === 'custom_html' && (
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <label className="text-xs font-bold text-slate-700">Code HTML / JavaScript</label>
                    <textarea
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      rows={6}
                      className="w-full p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono outline-none border border-slate-700"
                    />
                  </div>
                )}

              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* CARD 2: DÉCLENCHEMENT (Matching GTM UI screenshot)       */}
          {/* ======================================================== */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Déclenchement</span>
              {selectedTrigger && (
                <button
                  onClick={() => setIsSelectingTrigger(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <Edit2 size={13} />
                  <span>Modifier le déclencheur</span>
                </button>
              )}
            </div>

            {/* Empty State: Matching screenshot with overlapping circles */}
            {!selectedTrigger ? (
              <div 
                onClick={() => setIsSelectingTrigger(true)}
                className="p-12 text-center cursor-pointer hover:bg-slate-50 transition-colors group flex flex-col items-center justify-center min-h-[220px]"
              >
                {/* Overlapping circles icon */}
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform mb-3 shadow-inner">
                  <div className="relative w-8 h-8">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-slate-400/80"></div>
                    <div className="absolute right-0 bottom-1 w-6 h-6 rounded-full border-2 border-slate-400/80 bg-slate-200/50"></div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-1.5">
                  Sélectionnez le déclencheur qui permettra d'activer cette balise...
                </p>
                <span className="text-xs text-blue-600 font-semibold hover:underline">
                  En savoir plus
                </span>
              </div>
            ) : (
              /* Selected Trigger Display */
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{selectedTrigger.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Type: {selectedTrigger.type} • Condition: {selectedTrigger.conditionSummary}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setTriggerId('')}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Dissocier ce déclencheur"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* CARD 3: PARAMÈTRES AVANCÉS (Collapsible)                 */}
          {/* ======================================================== */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-slate-400" />
                <span>Paramètres avancés (Priorité, Options de déclenchement)</span>
              </div>
              <ChevronRight size={16} className={`text-slate-400 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Options de déclenchement de la balise</label>
                  <select
                    value={firingOption}
                    onChange={(e) => setFiringOption(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-medium cursor-pointer"
                  >
                    <option value="once_per_event">Une fois par événement (Standard)</option>
                    <option value="once_per_page">Une fois par page (Idéal pour Balise Linker / Config)</option>
                    <option value="unlimited">Illimité</option>
                  </select>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* DRAWER: CHOISIR UN TYPE DE BALISE                        */}
      {/* ======================================================== */}
      {isSelectingType && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-60 animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black text-slate-900">Choisir un type de balise</h3>
              <button onClick={() => setIsSelectingType(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
              {(['Google Ads', 'Google Analytics', 'Meta', 'Personnalisé'] as const).map(cat => (
                <div key={cat} className="pt-3 first:pt-0 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{cat}</span>
                  <div className="space-y-1">
                    {Object.entries(TAG_TYPE_CONFIGS)
                      .filter(([_, cfg]) => cfg.category === cat)
                      .map(([typeKey, cfg]) => (
                        <button
                          key={typeKey}
                          onClick={() => {
                            setTagType(typeKey as TagType);
                            // Auto populate tag name if default
                            if (tagName === 'Balise sans titre') {
                              setTagName(cfg.name);
                            }
                            setIsSelectingType(false);
                          }}
                          className="w-full p-3 rounded-xl text-left hover:bg-blue-50/70 border border-transparent hover:border-blue-200 transition-all flex items-start gap-3 group"
                        >
                          <div className={`w-8 h-8 rounded-lg ${cfg.iconBg} text-white flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5`}>
                            {cfg.iconText}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                              {cfg.name}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                              {cfg.description}
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER: CHOISIR UN DÉCLENCHEUR                           */}
      {/* ======================================================== */}
      {isSelectingTrigger && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-60 animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-black text-slate-900">Choisir un déclencheur</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setIsSelectingTrigger(false);
                    onOpenTriggerModal();
                  }}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-700"
                >
                  <Plus size={14} />
                  <span>Créer</span>
                </button>
                <button onClick={() => setIsSelectingTrigger(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {triggers.map(trig => (
                <button
                  key={trig.id}
                  onClick={() => {
                    setTriggerId(trig.id);
                    setIsSelectingTrigger(false);
                  }}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-start gap-3 ${
                    triggerId === trig.id 
                      ? 'bg-blue-50 border-blue-300 shadow-xs' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                    <Zap size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xs text-slate-900">{trig.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {trig.conditionSummary}
                    </div>
                  </div>
                  {triggerId === trig.id && (
                    <Check size={16} className="text-blue-600 shrink-0 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
