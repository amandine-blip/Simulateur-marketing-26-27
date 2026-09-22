import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Key, Plus, CheckCircle2, AlertCircle, Sparkles, HelpCircle, 
  ArrowRight, ShieldCheck, Zap, X, Info
} from 'lucide-react';

interface KeyEventItem {
  id: string;
  name: string;
  description: string;
  isKey: boolean;
  canToggle: boolean;
  count: number;
  users: number;
  countingMethod: 'Une fois par événement' | 'Une fois par session';
}

interface GA4KeyEventsManagerProps {
  onBackToOverview?: () => void;
}

export default function GA4KeyEventsManager({ onBackToOverview }: GA4KeyEventsManagerProps) {
  const [events, setEvents] = useState<KeyEventItem[]>([
    {
      id: 'e1',
      name: 'purchase',
      description: 'Achat e-commerce validé avec valeur et transaction_id',
      isKey: true,
      canToggle: false,
      count: 142,
      users: 128,
      countingMethod: 'Une fois par événement'
    },
    {
      id: 'e2',
      name: 'generate_lead',
      description: 'Soumission d’un formulaire de demande de devis ou contact',
      isKey: true,
      canToggle: true,
      count: 48,
      users: 45,
      countingMethod: 'Une fois par session'
    },
    {
      id: 'e3',
      name: 'add_to_cart',
      description: 'Ajout d’un article au panier d’achat',
      isKey: false,
      canToggle: true,
      count: 1240,
      users: 980,
      countingMethod: 'Une fois par événement'
    },
    {
      id: 'e4',
      name: 'view_item',
      description: 'Consultation d’une page produit e-commerce',
      isKey: false,
      canToggle: true,
      count: 5400,
      users: 3820,
      countingMethod: 'Une fois par événement'
    },
    {
      id: 'e5',
      name: 'contact_form_submit',
      description: 'Événement personnalisé transmis via Google Tag Manager',
      isKey: false,
      canToggle: true,
      count: 35,
      users: 34,
      countingMethod: 'Une fois par session'
    },
    {
      id: 'e6',
      name: 'scroll',
      description: 'Défilement de page à 90% (Mesure améliorée)',
      isKey: false,
      canToggle: true,
      count: 9840,
      users: 5200,
      countingMethod: 'Une fois par événement'
    },
    {
      id: 'e7',
      name: 'page_view',
      description: 'Affichage d’une page web (Collecte automatique)',
      isKey: false,
      canToggle: true,
      count: 42120,
      users: 14500,
      countingMethod: 'Une fois par événement'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newCountingMethod, setNewCountingMethod] = useState<'Une fois par événement' | 'Une fois par session'>('Une fois par événement');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleKey = (id: string) => {
    const item = events.find(e => e.id === id);
    if (!item) return;

    if (!item.canToggle) {
      alert("L'événement 'purchase' est automatiquement et obligatoirement un événement clé dans GA4.");
      return;
    }

    const nextState = !item.isKey;

    setEvents(prev => prev.map(e => e.id === id ? { ...e, isKey: nextState } : e));

    if (nextState) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      showToast(`'${item.name}' est désormais configuré comme Événement Clé !`);
    } else {
      showToast(`'${item.name}' n'est plus un événement clé.`);
    }
  };

  const handleCreateKeyEvent = () => {
    if (!newEventName.trim()) return;

    const formattedName = newEventName.trim().toLowerCase().replace(/\s+/g, '_');

    const newItem: KeyEventItem = {
      id: `e_${Date.now()}`,
      name: formattedName,
      description: 'Événement clé créé manuellement',
      isKey: true,
      canToggle: true,
      count: 0,
      users: 0,
      countingMethod: newCountingMethod
    };

    setEvents(prev => [newItem, ...prev]);
    setIsCreateModalOpen(false);
    setNewEventName('');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 }
    });

    showToast(`Événement clé '${formattedName}' créé avec succès.`);
  };

  const totalKeyEventsCount = events.filter(e => e.isKey).reduce((sum, e) => sum + e.count, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-sans text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Key size={18} />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Événements clés (Key Events)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Définissez les interactions essentielles qui traduisent la réussite commerciale de votre site.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Nouvel événement clé</span>
        </button>
      </div>

      {/* Pedagogical Concept Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-800 tracking-wider">
          <Sparkles size={15} /> Du concept de "Conversions" aux "Événements clés" dans GA4
        </div>
        <p className="text-xs text-blue-900 font-medium leading-relaxed">
          Google Analytics 4 a remplacé le terme "Conversion" par <strong>"Événement clé" (Key Event)</strong>. Les événements clés mesurent les actions critiques sur votre site (ex: <code>purchase</code> pour les ventes ou <code>generate_lead</code> pour les formulaires). Lorsqu'un événement clé est partagé avec Google Ads, il devient une <em>Conversion publicitaire</em> pour piloter les enchères intelligentes (Smart Bidding).
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Événements marqués comme clés</span>
          <div className="text-2xl font-black text-blue-600">{events.filter(e => e.isKey).length}</div>
          <div className="text-[11px] text-slate-500">dont <code>purchase</code> et <code>generate_lead</code></div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Événements clés enregistrés (28j)</span>
          <div className="text-2xl font-black text-emerald-600">{totalKeyEventsCount}</div>
          <div className="text-[11px] text-emerald-700 font-semibold">Alimente vos colonnes de reporting</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Liaison Google Ads</span>
          <div className="text-2xl font-black text-slate-900">Synchronisé</div>
          <div className="text-[11px] text-blue-600 font-bold">Import actif vers Google Ads</div>
        </div>
      </div>

      {/* Table of Events */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Liste des événements collectés</h3>
            <p className="text-xs text-slate-400 font-medium">Basculez le bouton pour marquer ou retirer un événement comme événement clé.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{events.length} événements</span>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nom de l'événement</th>
                <th className="py-3 px-4 text-center">Marquer comme événement clé</th>
                <th className="py-3 px-4 text-right">Nombre d'événements</th>
                <th className="py-3 px-4 text-right">Nombre d'utilisateurs</th>
                <th className="py-3 px-4">Méthode de comptage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {ev.name}
                      </span>
                      {ev.isKey && (
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-black uppercase">
                          Clé
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">{ev.description}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleKey(ev.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        ev.isKey ? 'bg-blue-600' : 'bg-slate-300'
                      } ${!ev.canToggle ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={!ev.canToggle ? "L'événement purchase est obligatoirement un événement clé" : "Activer / Désactiver"}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          ev.isKey ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {ev.count.toLocaleString('fr-FR')}
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-600">
                    {ev.users.toLocaleString('fr-FR')}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {ev.countingMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Key Event */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Nouvel événement clé</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-700">
              <div className="space-y-1">
                <label>Nom de l'événement (ex: contact_submit, sign_up)</label>
                <input
                  type="text"
                  placeholder="nom_evenement_ga4"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label>Méthode de comptage</label>
                <select
                  value={newCountingMethod}
                  onChange={(e) => setNewCountingMethod(e.target.value as any)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Une fois par événement">Une fois par événement (Recommandé pour e-commerce)</option>
                  <option value="Une fois par session">Une fois par session (Recommandé pour la génération de leads)</option>
                </select>
                <p className="text-[10px] text-slate-400 font-normal pt-1">
                  "Une fois par session" évite de compter plusieurs fois un même formulaire envoyé par erreur par le même utilisateur lors de sa visite.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateKeyEvent}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-sm"
              >
                Enregistrer l'événement clé
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
