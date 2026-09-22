import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Database, Cloud, RefreshCw, Download, Upload, CheckCircle2, 
  X, AlertCircle, Sparkles, Layers, ArrowRight, ShieldCheck, Share2
} from 'lucide-react';
import { marketingStore, MarketingState } from '../services/marketingStore';

interface MemorySyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MemorySyncModal({ isOpen, onClose }: MemorySyncModalProps) {
  const [state, setState] = useState<MarketingState>(marketingStore.getState());
  const [importText, setImportText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = marketingStore.subscribe(setState);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleExport = () => {
    const json = marketingStore.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `efp-marketing-memory-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.6 }
    });
    setFeedbackMsg('Fichier de mémoire JSON téléchargé avec succès ! Prêt pour GitHub ou sauvegarde locale.');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = marketingStore.importJSON(importText);
    if (success) {
      confetti({ particleCount: 70, spread: 50 });
      setFeedbackMsg('Mémoire restaurée avec succès depuis le JSON !');
      setShowImportArea(false);
      setImportText('');
    } else {
      alert('Le format JSON saisi est invalide.');
    }
  };

  const handleReset = () => {
    if (confirm('Voulez-vous réinitialiser toutes les données d\'entraînement aux valeurs par défaut ?')) {
      marketingStore.resetToDefaults();
      setFeedbackMsg('Données réinitialisées aux valeurs initiales d\'exercice.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Cloud size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">Mémoire & Synchronisation Cross-Outils</h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Firebase Cloud Actif
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Vos pixels, campagnes et données de trafic sont reliés en temps réel et conservés dans le Cloud.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback message */}
        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Interconnection status summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Layers size={14} className="text-blue-600" />
                Meta Pixel ➔ Meta Ads
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {state.pixels.length} Pixels liés
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tout Pixel créé ou configuré dans GTM ou dans le Gestionnaire d'événements remonte instantanément dans les options de ciblage de Meta Ads Manager.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Share2 size={14} className="text-teal-600" />
                Campagnes Ads ➔ GA4
              </span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                {state.trafficSources.filter(r => r.isCampaignSource).length} Sources injectées
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Chaque campagne lancée dans Meta Ads (<code>facebook / cpc</code>) ou Google Ads (<code>google / cpc</code>) génère automatiquement du trafic et des conversions visibles dans GA4.
            </p>
          </div>

        </div>

        {/* GitHub & Memory Export Feature */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-blue-900 uppercase tracking-wide">
            <Sparkles size={14} className="text-blue-600" />
            Exportation de mémoire pour GitHub
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            Vous prévoyez de recréer l'application sur GitHub ? Vous pouvez exporter l'intégralité de l'état actuel sous forme de fichier JSON, puis le réimporter en 1 clic pour retrouver exactement vos campagnes, pixels et statistiques.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download size={14} />
              <span>Exporter la mémoire (JSON)</span>
            </button>

            <button
              onClick={() => setShowImportArea(!showImportArea)}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Upload size={14} />
              <span>Importer une sauvegarde JSON</span>
            </button>
          </div>
        </div>

        {/* Import JSON Textarea */}
        {showImportArea && (
          <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in">
            <label className="text-xs font-bold text-slate-700">Collez le JSON exporté ci-dessous :</label>
            <textarea
              rows={4}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{ "pixels": [...], "metaCampaigns": [...] }'
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportArea(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
              >
                Appliquer la mémoire
              </button>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-red-600 font-bold flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={13} />
            <span>Réinitialiser les données d'exercice</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
