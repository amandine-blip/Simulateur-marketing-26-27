import React from 'react';
import { 
  BookOpen, TrendingUp, Sparkles, Target, Zap, ArrowRight, HelpCircle, 
  CheckCircle2, AlertTriangle, Layers, ExternalLink, RefreshCw
} from 'lucide-react';

interface CourseMemoProps {
  onClose?: () => void;
}

export default function CourseMemo({ onClose }: CourseMemoProps) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-blue-200 border border-white/20">
            <BookOpen size={14} /> Fiche de Cours Officielle • Module Reporting & Analytics
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Mémo Pédagogique : Formules, Attribution & Stratégie
          </h2>
          <p className="text-slate-200 text-sm max-w-2xl leading-relaxed">
            Retrouvez ici les définitions fondamentales, les formules mathématiques exactes et les concepts stratégiques indispensables pour réussir vos analyses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module 1: ROAS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              €
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Le ROAS (Return On Ad Spend)</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Retour sur dépenses publicitaires</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-xs">
            <div className="text-slate-500 font-sans font-bold text-[11px] uppercase tracking-wider">Formule mathématique :</div>
            <div className="text-blue-700 font-black text-sm">
              ROAS = Valeur des Achats générés (€) / Dépenses publicitaires (€)
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-medium">
            <p>
              • <strong>Signification concrète :</strong> Si une campagne dépense <strong>111,38 €</strong> et génère <strong>2 850,00 €</strong> de ventes, son ROAS est de <strong>25,59</strong>. Pour 1 € investi dans cette campagne, elle a généré 25,59 € de chiffre d'affaires.
            </p>
            <p>
              • <strong>Seuil de rentabilité :</strong> Un ROAS &gt; 1 signifie que la campagne génère plus de chiffre d'affaires brut que son coût publicitaire. Dans le e-commerce, on vise généralement un ROAS de 3 à 5 pour couvrir les coûts de fabrication et la marge.
            </p>
            <p>
              • <strong>Pourquoi un ROAS très haut en retargeting ?</strong> Les audiences de reciblage (personnes ayant déjà mis au panier) sont très chaudes et convertissent rapidement, expliquant des ROAS élevés (25x à 50x).
            </p>
          </div>
        </div>

        {/* Module 2: Taux d'engagement */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              %
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Taux d'Engagement Meta</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Interactions cumulées vs Portée</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-xs">
            <div className="text-slate-500 font-sans font-bold text-[11px] uppercase tracking-wider">Formule officielle :</div>
            <div className="text-amber-700 font-black text-sm">
              Taux d'Engagement (%) = (Interactions cumulées / Portée [Reach]) × 100
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 leading-relaxed font-medium">
            <p>
              • <strong>Interactions cumulées :</strong> Somme de toutes les interactions sociales : 
              <br/><span className="text-slate-800 font-bold">Réactions + Commentaires + Partages + Enregistrements</span>.
            </p>
            <p>
              • <strong>Pourquoi diviser par la Portée (Reach) ?</strong> La portée représente le nombre de <em>personnes uniques</em> exposées à la publicité. Diviser par les impressions fausserait le calcul à cause de la répétition (fréquence).
            </p>
            <p>
              • <strong>Exemple :</strong> 73 interactions / 26 528 personnes touchées × 100 = <strong>0,275%</strong>.
            </p>
          </div>
        </div>

      </div>

      {/* Module 3: L'Effet de Halo (X17 & 67) */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">L'Effet de Halo (Halo Effect)</h3>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black uppercase rounded-full">Concept Clé X17 & 67</span>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Synergie cross-canal entre Meta Ads, Google Ads et Trafic Direct</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
            <p>
              L’<strong>effet de halo</strong> désigne le phénomène par lequel une publicité diffusée sur un canal (ex: vidéo ou réels sur Meta) stimule des conversions sur un <em>autre</em> canal (ex: Google Search ou saisie directe de l'adresse web).
            </p>
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
              <p className="font-bold text-purple-900">Le parcours type de l'internaute :</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-purple-950 font-medium">
                <li>L’utilisateur découvre votre marque grâce à une pub vidéo percutante sur Instagram.</li>
                <li>Il est dans les transports ou occupé : il ne clique pas immédiatement sur le lien, ou visite 5 secondes puis ferme.</li>
                <li>Le soir venu à la maison, intéressé par le produit, il ouvre Google et recherche le nom de votre marque.</li>
                <li>Il clique sur votre annonce <strong>Google Ads (Search Marque)</strong> ou le lien organique et achète.</li>
              </ol>
            </div>
            <p>
              Dans Google Analytics (en attribution dernier clic direct), la conversion sera créditée à <strong>Google Search</strong>. Pourtant, sans la campagne Meta en amont, cette recherche Google n'aurait jamais eu lieu ! C'est pourquoi couper Meta entraîne souvent une baisse indirecte des ventes Google.
            </p>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase text-purple-300 tracking-widest mb-2">Constat GA4</p>
              <p className="text-sm font-bold text-slate-200 leading-snug">
                "Quand le budget Meta augmente de +50%, on observe souvent +30% de sessions et de ventes sur Google Ads et le Direct."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              C'est la preuve mathématique que Meta alimente le haut du tunnel d'acquisition.
            </div>
          </div>
        </div>
      </div>

      {/* Module 4: Google Ads & Reporting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black">
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Reporting Google Ads</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Search, Performance Max & Display</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="font-bold text-slate-900">1. Campagnes Search (Recherche)</p>
              <p className="text-slate-500">Intention forte : l'utilisateur tape un mot-clé précis. CTR élevé (&gt;5-10%), taux de conversion élevé, durée de session plus longue.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="font-bold text-slate-900">2. Performance Max (PMax)</p>
              <p className="text-slate-500">Campagnes automatisées multi-réseaux (Search, Maps, YouTube, Gmail). Idéales pour générer des leads ou des ventes à grande échelle.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="font-bold text-slate-900">3. Coût par Lead (CPA Lead)</p>
              <p className="text-slate-500 font-mono text-[11px]">Coût par Lead (€) = Dépenses totales (€) / Nombre de Leads obtenus</p>
            </div>
          </div>
        </div>

        {/* Module 5: Paramètres UTM et GA4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Décodage des Paramètres UTM</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Comment GA4 lit vos campagnes</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
            <p>
              Les balises UTM sont ajoutées à l'URL de votre site pour que GA4 puisse classifier exactement d'où vient chaque visiteur :
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 flex items-center justify-between">
                <span className="font-mono text-blue-800 font-bold">utm_source=meta</span>
                <span className="text-[11px] text-slate-500">Indique la plateforme source</span>
              </div>
              <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100 flex items-center justify-between">
                <span className="font-mono text-indigo-800 font-bold">utm_medium=ads</span>
                <span className="text-[11px] text-slate-500">Indique le support (ads, cpc, email)</span>
              </div>
              <div className="p-2.5 bg-purple-50/60 rounded-lg border border-purple-100 flex items-center justify-between">
                <span className="font-mono text-purple-800 font-bold">utm_campaign=convers_retargeting</span>
                <span className="text-[11px] text-slate-500">Nom de la campagne dans le tableau GA4</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Dans GA4 : <code className="font-bold text-slate-700">utm_source / utm_medium</code> est combiné sous la dimension <strong>"Source / Support de la session"</strong> (ex: <code className="text-blue-600">meta / ads</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
