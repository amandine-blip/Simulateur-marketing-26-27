import React, { useState } from 'react';
import { 
  Sparkles, Layers, Zap, Database, Tag, ArrowRight, CheckCircle2, 
  Clock, ArrowDown, ExternalLink, Globe, Shield, Code, ChevronRight
} from 'lucide-react';

export default function GTMRationalView() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedCase, setSelectedCase] = useState<'gads' | 'scroll' | 'timer' | 'ecommerce'>('gads');

  return (
    <div className="space-y-6">
      
      {/* Intro Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-[11px] font-black uppercase tracking-wider border border-blue-400/30">
            <Sparkles size={14} /> Méthodologie Professionnelle
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Le raisonnement de Google Tag Manager dans la réalité
          </h2>
          <p className="text-xs md:text-sm text-blue-200 leading-relaxed font-medium">
            GTM fonctionne comme une <strong>gare de triage centrale</strong> entre votre site web et vos outils marketing (Google Ads, GA4, Meta). Il ne stocke aucune donnée : il écoute des signaux, évalue des conditions et déclenche les balises appropriées.
          </p>
        </div>
      </div>

      {/* The 4-Step Chain of Reasoning (Interactive Diagram) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">La chaîne logique en 4 maillons inséparables</h3>
            <p className="text-xs text-slate-500">Cliquez sur chaque maillon pour comprendre son rôle exact dans le navigateur.</p>
          </div>
          <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200 self-start md:self-auto">
            Cycle d'exécution synchrone
          </span>
        </div>

        {/* 4 Interactive Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div 
            onClick={() => setActiveStep(1)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              activeStep === 1 
                ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs mb-3">
              1
            </div>
            <div className="text-xs font-black text-slate-900 mb-1">Interaction & DataLayer</div>
            <div className="text-[11px] text-slate-500 font-medium">
              L'internaute navigue, scrolle, attend 5s ou clique. Un événement est poussé dans <code>window.dataLayer</code>.
            </div>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => setActiveStep(2)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              activeStep === 2 
                ? 'border-amber-500 bg-amber-50/50 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs mb-3">
              2
            </div>
            <div className="text-xs font-black text-slate-900 mb-1">Évaluation du Déclencheur</div>
            <div className="text-[11px] text-slate-500 font-medium">
              GTM teste les filtres : <em>Est-ce que Page Path contient "/confirmation" ? Est-ce que le scroll vaut 50% ?</em>
            </div>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => setActiveStep(3)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              activeStep === 3 
                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs mb-3">
              3
            </div>
            <div className="text-xs font-black text-slate-900 mb-1">Résolution des Variables</div>
            <div className="text-[11px] text-slate-500 font-medium">
              GTM remplace les macros dynamiques : <code>&#123;&#123;Page Path&#125;&#125;</code>, <code>&#123;&#123;DLV - value&#125;&#125;</code>, <code>&#123;&#123;ID Ads&#125;&#125;</code>.
            </div>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => setActiveStep(4)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              activeStep === 4 
                ? 'border-teal-600 bg-teal-50/50 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-xs mb-3">
              4
            </div>
            <div className="text-xs font-black text-slate-900 mb-1">Tir de la Balise (Tag Fire)</div>
            <div className="text-[11px] text-slate-500 font-medium">
              Si tout est VRAI, la balise s'active et émet une requête HTTP vers Google Ads, GA4 ou Meta.
            </div>
          </div>

        </div>

        {/* Step Detail Explanation */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-3">
          {activeStep === 1 && (
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-blue-700">
                1. Événements et Couche de Données (Data Layer)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Quand une page se charge ou qu'un utilisateur agit, le script conteneur GTM intercepte les événements du navigateur.
                Par exemple, lorsque la page s'affiche, GTM pousse automatiquement <code>gtm.js</code> (Page View), puis <code>gtm.dom</code> (DOM Ready) et <code>gtm.load</code> (Window Loaded). 
                Lors d'une conversion e-commerce, votre site web exécute <code>dataLayer.push(&#123; event: 'purchase', ecommerce: &#123; transaction_id: '123', value: 79.99 &#125; &#125;)</code>.
              </p>
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-amber-600">
                2. Déclencheurs et Conditions Booléennes (Triggers)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Un déclencheur est une fonction qui répond par <strong>OUI (Vrai)</strong> ou <strong>NON (Faux)</strong>. 
                Il combine un <em>Type d'événement</em> (ex: Affichage de page, Défilement, Minuteur) et une ou plusieurs <em>Conditions de filtre</em>.
                Si vous configurez : <code>Page Path contient "/confirmation-achat"</code>, GTM vérifie l'URL actuelle. Si l'utilisateur est sur <code>/accueil</code>, la condition est fausse : la balise ne partira pas.
              </p>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-indigo-700">
                3. Variables : La flexibilité des données
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Les variables permettent de ne pas coder les valeurs en dur :
                <br />• <strong>Variables intégrées</strong> : <code>Page URL</code> (URL complète), <code>Page Path</code> (chemin sans domaine), <code>Click Classes</code>, <code>Scroll Depth Threshold</code> (25, 50, 75, 90).
                <br />• <strong>Variables de couche de données (DLV)</strong> : extraient les données imbriquées comme <code>ecommerce.value</code>.
                <br />• <strong>Constantes</strong> : votre ID Google Ads (<code>AW-XXXXX</code>) ou ID GA4 (<code>G-XXXXX</code>) partagé entre toutes les balises.
              </p>
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-teal-700">
                4. Déclenchement de la Balise (Tags Fired)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Lorsque le déclencheur renvoie VRAI, GTM assemble la balise avec les variables résolues. 
                Pour Google Ads Conversion, GTM appelle <code>gtag('event', 'conversion', &#123; send_to: 'AW-XXX/Libellé', value: 79.99, currency: 'EUR' &#125;)</code>.
                Dans Tag Assistant, vous pouvez alors voir le statut <strong>Succeeded</strong> avec tous les paramètres transmis.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Real-World Use Cases (Cas concrets professionnels) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-black text-slate-900">4 Cas réels décryptés pour la pratique marketing</h3>
          <p className="text-xs text-slate-500">Sélectionnez un cas d'école pour voir sa configuration pas-à-pas dans Google Tag Manager.</p>
        </div>

        {/* Case tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'gads', name: '1. Suivi des Conversions Google Ads' },
            { id: 'scroll', name: '2. Déclencheur Scroll (Profondeur 50% & 90%)' },
            { id: 'timer', name: '3. Déclencheur Minuteur (Engagement 5s)' },
            { id: 'ecommerce', name: '4. Page Path vs Page URL (Filtres)' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCase === c.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Selected Case Content */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
          
          {selectedCase === 'gads' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <Tag size={16} className="text-teal-600" />
                Configuration d'une balise de conversion Google Ads dans GTM
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">A</span>
                    Balise Linker (Obligatoire)
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Ajoutez une balise <strong>Balise Linker de conversion</strong> déclenchée sur <strong>Toutes les pages</strong>. Elle stocke le <code>gclid</code> dans un cookie 1st-party.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">B</span>
                    Balise de Conversion
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Type: <strong>Suivi des conversions Google Ads</strong>.<br />
                    ID : <code>AW-1082947192</code><br />
                    Libellé : <code>AbC123XyZ</code><br />
                    Valeur : <code>&#123;&#123;DLV - value&#125;&#125;</code> ou fixe.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">C</span>
                    Déclencheur associé
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Type: <strong>Page vue</strong>.<br />
                    Condition : <code>Page Path</code> contient <code>/confirmation-achat</code> ou <code>/merci</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedCase === 'scroll' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <ArrowDown size={16} className="text-blue-600" />
                Déclencheur Profondeur de défilement (Scroll Depth)
              </div>

              <p className="text-slate-600 leading-relaxed">
                Le déclencheur de défilement permet de mesurer si un visiteur lit réellement votre contenu avant de quitter la page :
              </p>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 font-mono text-[11px]">
                <div className="text-slate-500 font-bold text-xs font-sans">Paramétrage GTM :</div>
                <div>• Type : <strong>Profondeur de défilement</strong> (Scroll Depth)</div>
                <div>• Défilement vertical : <code>25, 50, 75, 90</code> %</div>
                <div>• Variable intégrée à activer : <code>Scroll Depth Threshold</code></div>
                <div>• Balise GA4 associée : Événement <code>scroll_depth</code> avec paramètre <code>percent_scrolled: &#123;&#123;Scroll Depth Threshold&#125;&#125;</code></div>
              </div>
            </div>
          )}

          {selectedCase === 'timer' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                <Clock size={16} className="text-indigo-600" />
                Déclencheur Minuteur (Timer - Visite qualifiée)
              </div>

              <p className="text-slate-600 leading-relaxed">
                Par défaut, un visiteur qui quitte au bout de 2 secondes sans cliquer a le même statut qu'un visiteur qui lit pendant 2 minutes. 
                Le minuteur GTM permet de tracker les <strong>visites engagées (+5 secondes ou +30 secondes)</strong> :
              </p>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 font-mono text-[11px]">
                <div className="text-slate-500 font-bold text-xs font-sans">Paramétrage GTM :</div>
                <div>• Type : <strong>Minuteur</strong> (Timer)</div>
                <div>• Intervalle : <code>5000</code> ms (5 secondes)</div>
                <div>• Limite : <code>1</code> (ne pas répéter indéfiniment)</div>
                <div>• Condition : <code>Page Path</code> contient <code>/formation-marketing</code></div>
                <div>• Balise associée : Événement GA4 <code>user_engaged_5s</code> ou Conversion Google Ads d'engagement.</div>
              </div>
            </div>
          )}

          {selectedCase === 'ecommerce' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                <Globe size={16} className="text-purple-600" />
                Différence cruciale : Page Path vs Page URL
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs font-mono text-blue-600">&#123;&#123;Page Path&#125;&#125;</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Représente uniquement le chemin d'accès relatif après le nom de domaine, sans les paramètres :<br />
                    <code>/confirmation-achat</code> ou <code>/contact-devis</code>.<br />
                    <strong>Quand l'utiliser ?</strong> Dans 95% des déclencheurs de pages pour éviter d'être perturbé par des paramètres d'URL (tracking, UTMs, pagination).
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs font-mono text-purple-600">&#123;&#123;Page URL&#125;&#125;</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Représente l'adresse web intégrale, protocole, domaine et paramètres de requête inclus :<br />
                    <code>https://boutique.be/promo?gclid=123&utm_source=meta</code>.<br />
                    <strong>Quand l'utiliser ?</strong> Quand votre déclencheur doit tester un paramètre d'URL (ex: <code>Page URL contient gclid=</code>).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
