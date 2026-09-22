import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table as TableIcon,
  Plus, Trash2, ArrowLeft, Download, FileText, Settings, Sliders, Calendar,
  Filter, Share2, Printer, Eye, Edit3, Check, Sparkles, Move, TrendingUp,
  DollarSign, Users, MousePointer, ShoppingCart, Percent, Layers, ShieldCheck,
  RefreshCw, Copy, CheckCircle2, ChevronDown, BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

export interface DashboardWidget {
  id: string;
  type: 'scorecard' | 'line_chart' | 'bar_chart' | 'pie_chart' | 'data_table' | 'notes';
  title: string;
  source: 'meta' | 'google_ads' | 'ga4' | 'mailchimp' | 'blended';
  metric: string;
  dimension?: string;
  colSpan?: 1 | 2 | 3 | 4;
  customNotes?: string;
  color?: string;
}

export default function DataStudioDashboard({ onExit }: { onExit: () => void }) {
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('ecommerce');
  const [dateRange, setDateRange] = useState('30j');
  const [channelFilter, setChannelFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  // Consolidated Marketing Raw Data (Multi-Channel)
  const multiChannelData = [
    { date: '01/03', metaSpend: 85, googleSpend: 110, ga4Revenue: 640, metaConversions: 4, googleConversions: 6, emailOpens: 420 },
    { date: '05/03', metaSpend: 95, googleSpend: 105, ga4Revenue: 780, metaConversions: 5, googleConversions: 7, emailOpens: 380 },
    { date: '10/03', metaSpend: 120, googleSpend: 140, ga4Revenue: 1150, metaConversions: 8, googleConversions: 9, emailOpens: 890 },
    { date: '15/03', metaSpend: 140, googleSpend: 160, ga4Revenue: 1420, metaConversions: 11, googleConversions: 12, emailOpens: 1250 },
    { date: '20/03', metaSpend: 130, googleSpend: 155, ga4Revenue: 1310, metaConversions: 9, googleConversions: 10, emailOpens: 540 },
    { date: '25/03', metaSpend: 160, googleSpend: 190, ga4Revenue: 1890, metaConversions: 14, googleConversions: 15, emailOpens: 620 },
    { date: '30/03', metaSpend: 180, googleSpend: 210, ga4Revenue: 2250, metaConversions: 16, googleConversions: 18, emailOpens: 710 },
  ];

  const channelComparison = [
    { channel: 'Meta Ads', spend: 910, revenue: 3850, roas: 4.23, conversions: 67, cpa: 13.58, color: '#1877F2' },
    { channel: 'Google Ads', spend: 1070, revenue: 5590, roas: 5.22, conversions: 77, cpa: 13.89, color: '#0F9D58' },
    { channel: 'Mailchimp (Email)', spend: 45, revenue: 5235, roas: 116.3, conversions: 58, cpa: 0.77, color: '#FFE01B' },
    { channel: 'SEO / Organique', spend: 0, revenue: 2850, roas: 0, conversions: 32, cpa: 0, color: '#6366F1' },
  ];

  const deviceDistribution = [
    { name: 'Mobile (Smartphone)', value: 65, color: '#007C89' },
    { name: 'Ordinateur (Desktop)', value: 30, color: '#3B82F6' },
    { name: 'Tablette', value: 5, color: '#F59E0B' },
  ];

  // Default Template Widgets
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'w1',
      type: 'scorecard',
      title: 'Dépenses Publicitaires Totales',
      source: 'blended',
      metric: 'spend',
      colSpan: 1,
      color: '#1E293B'
    },
    {
      id: 'w2',
      type: 'scorecard',
      title: 'Chiffre d\'Affaires Total (GA4)',
      source: 'ga4',
      metric: 'revenue',
      colSpan: 1,
      color: '#059669'
    },
    {
      id: 'w3',
      type: 'scorecard',
      title: 'ROAS Global (Retour sur Dépenses)',
      source: 'blended',
      metric: 'roas',
      colSpan: 1,
      color: '#2563EB'
    },
    {
      id: 'w4',
      type: 'scorecard',
      title: 'Coût par Acquisition Moyen (CPA)',
      source: 'blended',
      metric: 'cpa',
      colSpan: 1,
      color: '#D97706'
    },
    {
      id: 'w5',
      type: 'line_chart',
      title: 'Évolution Quotidienne : Dépenses Ads vs Chiffre d\'Affaires (€)',
      source: 'blended',
      metric: 'multi_trend',
      colSpan: 3
    },
    {
      id: 'w6',
      type: 'pie_chart',
      title: 'Part des Conversions par Device',
      source: 'ga4',
      metric: 'devices',
      colSpan: 1
    },
    {
      id: 'w7',
      type: 'bar_chart',
      title: 'Comparatif de Rentabilité par Canal (ROAS & Revenu)',
      source: 'blended',
      metric: 'channels',
      colSpan: 2
    },
    {
      id: 'w8',
      type: 'data_table',
      title: 'Tableau de Données Consolidé par Canal Publicitaire',
      source: 'blended',
      metric: 'table',
      colSpan: 2
    },
    {
      id: 'w9',
      type: 'notes',
      title: 'Recommandations Stratégiques du Consultant',
      source: 'blended',
      metric: 'notes',
      colSpan: 4,
      customNotes: '• Google Ads surperforme en Search sur les termes de marque avec un ROAS exceptionnel de 5.22.\n• Meta Ads a un coût par clic bas, mais un taux d\'abandon supérieur sur le panier mobile (optimiser le temps de chargement du checkout).\n• La newsletter Mailchimp a généré 5 235 € pour un coût marginal : recommander d\'augmenter la fréquence à 2 envois/semaine et de mettre en place une séquence de paniers abandonnés.'
    }
  ]);

  // Calculations for Blended KPI Values
  const totalSpend = channelComparison.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = channelComparison.reduce((acc, c) => acc + c.revenue, 0);
  const blendedROAS = (totalRevenue / (totalSpend || 1)).toFixed(2);
  const totalConversions = channelComparison.reduce((acc, c) => acc + c.conversions, 0);
  const blendedCPA = (totalSpend / (totalConversions || 1)).toFixed(2);

  const handleAddWidget = (type: DashboardWidget['type']) => {
    const newWidget: DashboardWidget = {
      id: 'w_' + Date.now(),
      type,
      title: type === 'scorecard' ? 'Nouveau KPI' : type === 'bar_chart' ? 'Nouveau Graphique à Barres' : 'Nouveau Composant',
      source: 'blended',
      metric: type === 'scorecard' ? 'spend' : 'channels',
      colSpan: type === 'scorecard' ? 1 : type === 'notes' ? 4 : 2,
      customNotes: type === 'notes' ? 'Insérez vos observations ici...' : undefined
    };
    setWidgets(prev => [...prev, newWidget]);
    setSelectedWidgetId(newWidget.id);
  };

  const handleDeleteWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    if (selectedWidgetId === id) setSelectedWidgetId(null);
  };

  const handleApplyTemplate = (tpl: string) => {
    setSelectedTemplate(tpl);
    if (tpl === 'ecommerce') {
      // Keep full ecommerce layout
    } else if (tpl === 'leadgen') {
      setWidgets([
        { id: 'w1', type: 'scorecard', title: 'Budget Consommé', source: 'blended', metric: 'spend', colSpan: 1 },
        { id: 'w2', type: 'scorecard', title: 'Leads Qualifiés Reçus', source: 'ga4', metric: 'conversions', colSpan: 1 },
        { id: 'w3', type: 'scorecard', title: 'Coût par Prospect (CPL)', source: 'blended', metric: 'cpa', colSpan: 1 },
        { id: 'w4', type: 'scorecard', title: 'Taux de Transformation Lead', source: 'ga4', metric: 'rate', colSpan: 1 },
        { id: 'w5', type: 'bar_chart', title: 'Volume de Leads par Canal (Google vs Meta)', source: 'blended', metric: 'channels', colSpan: 2 },
        { id: 'w6', type: 'data_table', title: 'Détail des Campagnes de Prospection', source: 'blended', metric: 'table', colSpan: 2 },
        { id: 'w7', type: 'notes', title: 'Audit de la Qualité des Prospects', source: 'blended', metric: 'notes', colSpan: 4, customNotes: 'Privilégier les formulaires instantanés Meta avec questions personnalisées pour filtrer les numéros invalides.' }
      ]);
    } else if (tpl === 'blank') {
      setWidgets([]);
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
      window.print();
    }, 600);
  };

  const handleExportCSV = () => {
    let csv = "Canal,Depenses,Revenu,ROAS,Conversions,CPA\n";
    channelComparison.forEach(row => {
      csv += `"${row.channel}",${row.spend},${row.revenue},${row.roas},${row.conversions},${row.cpa}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporting_marketing_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateSummary = () => {
    const summary = `SYNTHÈSE EXÉCUTIVE - PERFORMANCE MARKETING GLOBALE\n` +
      `Période : ${dateRange} | Canaux : Meta Ads, Google Ads, GA4, Mailchimp\n\n` +
      `1. CHIFFRES CLÉS :\n` +
      `• Dépenses publicitaires totales : ${totalSpend.toLocaleString('fr-FR')} €\n` +
      `• Chiffre d'affaires consolidé : ${totalRevenue.toLocaleString('fr-FR')} €\n` +
      `• ROAS Global blended : ${blendedROAS}x (1 € investi rapporte ${blendedROAS} €)\n` +
      `• Coût d'Acquisition Moyen (CPA) : ${blendedCPA} € pour ${totalConversions} conversions.\n\n` +
      `2. DIAGNOSTIC CANAUX :\n` +
      `• Google Ads affiche le meilleur ROAS payant (5.22x).\n` +
      `• Meta Ads génère une forte portée mais requiert une optimisation sur le tunnel mobile.\n` +
      `• Mailchimp enregistre une excellente rétention avec 28.7% d'ouverture.`;

    navigator.clipboard.writeText(summary);
    confetti({ particleCount: 70, spread: 60 });
    alert("Synthèse exécutive copiée dans le presse-papier ! Vous pouvez la coller dans votre présentation client.");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* Studio Top Control Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 text-xs font-bold"
            title="Retour au portail Academy"
          >
            <ArrowLeft size={16} /> Hub Academy
          </button>
          <div className="h-5 w-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              <BarChart3 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">Looker Studio • Dashboard Lab</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">REPORTING MULTI-CANAL</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Concevez vos tableaux de bord et extrayez des rapports de data professionnels</p>
            </div>
          </div>
        </div>

        {/* Center Template Selector & Actions */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => handleApplyTemplate('ecommerce')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTemplate === 'ecommerce' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modèle E-commerce & ROAS
          </button>
          <button
            onClick={() => handleApplyTemplate('leadgen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTemplate === 'leadgen' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modèle Lead Gen & CPL
          </button>
          <button
            onClick={() => handleApplyTemplate('blank')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTemplate === 'blank' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Page Vierge
          </button>
        </div>

        {/* Right Tools & Export */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isEditMode ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isEditMode ? <Edit3 size={14} /> : <Eye size={14} />}
            <span>{isEditMode ? 'Mode Éditeur' : 'Mode Consultation'}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Télécharger les données sous Excel"
          >
            <TableIcon size={14} /> CSV
          </button>

          {/* Export PDF Report */}
          <button
            onClick={handleExportPDF}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-2"
          >
            <Download size={14} /> Exporter Rapport (PDF)
          </button>
        </div>
      </header>

      {/* Second Toolbar (Looker Studio Style Widget Palette) */}
      {isEditMode && (
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 gap-4 overflow-x-auto text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Ajouter un bloc :</span>
            <button
              onClick={() => handleAddWidget('scorecard')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
            >
              <TrendingUp size={14} className="text-blue-600" /> Scorecard (KPI)
            </button>
            <button
              onClick={() => handleAddWidget('line_chart')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
            >
              <LineChartIcon size={14} className="text-indigo-600" /> Graphique Temporel
            </button>
            <button
              onClick={() => handleAddWidget('bar_chart')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
            >
              <BarChart3 size={14} className="text-teal-600" /> Barres Comparatives
            </button>
            <button
              onClick={() => handleAddWidget('pie_chart')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
            >
              <PieChartIcon size={14} className="text-amber-500" /> Donut / Camembert
            </button>
            <button
              onClick={() => handleAddWidget('data_table')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
            >
              <TableIcon size={14} className="text-slate-600" /> Tableau de Données
            </button>
            <button
              onClick={() => handleAddWidget('notes')}
              className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileText size={14} className="text-purple-600" /> Note Consultant
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleGenerateSummary}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles size={14} className="text-purple-600" /> Générer Synthèse Exécutive
            </button>
          </div>
        </div>
      )}

      {/* Main Reporting Canvas */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Print / Report Title Header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px] uppercase">Rapport Client Officiel</span>
                <span className="text-xs text-slate-400">• Généré le {new Date().toLocaleDateString('fr-FR')}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Performance Marketing Consolidée (360°)</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Sources de données connectées : <strong className="text-slate-700">Meta Ads Manager</strong>, <strong className="text-slate-700">Google Ads</strong>, <strong className="text-slate-700">Google Analytics 4</strong> et <strong className="text-slate-700">Mailchimp</strong>.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="7j">7 derniers jours</option>
                  <option value="30j">30 derniers jours (Mois en cours)</option>
                  <option value="90j">Dernier trimestre (Q1)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select 
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">Tous les canaux (Mix)</option>
                  <option value="meta">Meta Ads uniquement</option>
                  <option value="google">Google Ads uniquement</option>
                  <option value="email">Mailchimp uniquement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Layout of Custom Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {widgets.map((widget) => {
              const isSelected = selectedWidgetId === widget.id && isEditMode;
              const colClass = widget.colSpan === 4 
                ? 'col-span-1 md:col-span-2 lg:col-span-4' 
                : widget.colSpan === 3 
                ? 'col-span-1 md:col-span-2 lg:col-span-3' 
                : widget.colSpan === 2 
                ? 'col-span-1 md:col-span-2' 
                : 'col-span-1';

              return (
                <div
                  key={widget.id}
                  onClick={() => isEditMode && setSelectedWidgetId(widget.id)}
                  className={`bg-white rounded-2xl p-5 border transition-all duration-200 relative group flex flex-col justify-between ${
                    colClass
                  } ${
                    isSelected 
                      ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                      : 'border-slate-200 shadow-sm hover:border-slate-300'
                  }`}
                >
                  {/* Widget Top Action Bar in Edit Mode */}
                  {isEditMode && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 p-1 rounded-lg border border-slate-200 shadow-xs z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWidget(widget.id);
                        }}
                        className="p-1 hover:bg-red-50 text-red-500 rounded"
                        title="Supprimer ce widget"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}

                  {/* Widget Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {widget.source} • {widget.type}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{widget.title}</h3>
                    </div>
                  </div>

                  {/* Widget Body Content */}
                  <div className="flex-1 flex flex-col justify-center">
                    {/* TYPE: SCORECARD */}
                    {widget.type === 'scorecard' && (
                      <div>
                        {widget.metric === 'spend' && (
                          <div>
                            <div className="text-3xl font-black text-slate-900 tracking-tight">
                              {totalSpend.toLocaleString('fr-FR')} €
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 font-medium">
                              <span className="text-emerald-600 font-bold">+14.2%</span> vs période précédente
                            </div>
                          </div>
                        )}
                        {widget.metric === 'revenue' && (
                          <div>
                            <div className="text-3xl font-black text-emerald-600 tracking-tight">
                              {totalRevenue.toLocaleString('fr-FR')} €
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 font-medium">
                              <span className="text-emerald-600 font-bold">+22.8%</span> CA tracké e-commerce
                            </div>
                          </div>
                        )}
                        {widget.metric === 'roas' && (
                          <div>
                            <div className="text-3xl font-black text-blue-600 tracking-tight">
                              {blendedROAS}x
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 font-medium">
                              Pour 1€ dépensé en pub, vous récoltez <strong className="text-slate-800">{blendedROAS}€</strong>
                            </div>
                          </div>
                        )}
                        {widget.metric === 'cpa' && (
                          <div>
                            <div className="text-3xl font-black text-amber-600 tracking-tight">
                              {blendedCPA} €
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 font-medium">
                              Coût par conversion multi-canal ({totalConversions} actions)
                            </div>
                          </div>
                        )}
                        {widget.metric === 'conversions' && (
                          <div>
                            <div className="text-3xl font-black text-indigo-600 tracking-tight">
                              {totalConversions}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 font-medium">
                              Achats & formulaires prospects validés
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TYPE: LINE CHART (TIME SERIES) */}
                    {widget.type === 'line_chart' && (
                      <div className="h-64 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={multiChannelData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                              formatter={(value: any) => [`${value} €`, '']}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <Line type="monotone" dataKey="metaSpend" name="Dépenses Meta Ads" stroke="#1877F2" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="googleSpend" name="Dépenses Google Ads" stroke="#0F9D58" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="ga4Revenue" name="Chiffre d'Affaires GA4" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* TYPE: BAR CHART */}
                    {widget.type === 'bar_chart' && (
                      <div className="h-64 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={channelComparison} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="channel" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                              formatter={(value: any, name: any) => [name === 'roas' ? `${value}x` : `${value} €`, name]}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <Bar dataKey="spend" name="Budget dépensé (€)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="revenue" name="Chiffre d'Affaires (€)" fill="#10B981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* TYPE: PIE / DONUT CHART */}
                    {widget.type === 'pie_chart' && (
                      <div className="h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={deviceDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                              label={({ name, percent }: any) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                            >
                              {deviceDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* TYPE: DATA TABLE */}
                    {widget.type === 'data_table' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              <th className="py-2.5">Canal</th>
                              <th className="py-2.5">Dépenses</th>
                              <th className="py-2.5">Revenu</th>
                              <th className="py-2.5">ROAS</th>
                              <th className="py-2.5">Conversions</th>
                              <th className="py-2.5 text-right">CPA</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {channelComparison.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="py-2.5 font-bold text-slate-800 flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }}></span>
                                  {row.channel}
                                </td>
                                <td className="py-2.5 text-slate-600">{row.spend} €</td>
                                <td className="py-2.5 font-bold text-emerald-700">{row.revenue} €</td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[11px]">
                                    {row.roas}x
                                  </span>
                                </td>
                                <td className="py-2.5 font-bold text-slate-900">{row.conversions}</td>
                                <td className="py-2.5 text-right font-mono text-slate-600">{row.cpa} €</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* TYPE: NOTES / STRATEGIC RECOMMENDATIONS */}
                    {widget.type === 'notes' && (
                      <div className="mt-1">
                        {isEditMode ? (
                          <textarea
                            rows={4}
                            value={widget.customNotes}
                            onChange={(e) => {
                              const val = e.target.value;
                              setWidgets(prev => prev.map(w => w.id === widget.id ? { ...w, customNotes: val } : w));
                            }}
                            className="w-full text-xs p-3 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                            placeholder="Écrivez vos analyses et recommandations stratégiques pour le client..."
                          />
                        ) : (
                          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-purple-50/50 p-4 rounded-xl border border-purple-100 font-medium">
                            {widget.customNotes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Footer / Signature */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border-dashed">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-blue-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">Rapport certifié Digital Marketing Academy EFP</div>
                <div className="text-[11px] text-slate-400">Toutes les données ont été consolidées via les APIs de suivi (Pixel Meta, GA4 Measurement Protocol, GTM).</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">Consultant en charge : Amandine V.</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Dernière mise à jour : 10:45 CET</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
