import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  BarChart3, Calculator, Link, ExternalLink, MousePointer2, ArrowLeft, Globe, 
  Layout, Users, Megaphone, Folder, BarChart2, Search, Filter, 
  MoreHorizontal, Download, Share2, HelpCircle, ChevronDown, Check, ShoppingCart,
  TrendingUp, DollarSign, Laptop, Sparkles, BookOpen, AlertCircle, CheckCircle2,
  RefreshCw, Info, Eye, ArrowRight, Smartphone
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import CourseMemo from './CourseMemo';

interface ReportingLabProps {
  onExit: () => void;
}

export default function ReportingLab({ onExit }: ReportingLabProps) {
  // Main view mode: 'exercises' (Espace Exercices dédié) | 'data' (Tableaux & graphiques complets) | 'course' (Fiche de Cours / Mémo)
  const [mainMode, setMainMode] = useState<'exercises' | 'data' | 'course'>('exercises');
  
  // Exercise sub-tabs
  const [exerciseTab, setExerciseTab] = useState<'meta' | 'ga4' | 'google-ads'>('meta');

  // Selected Meta campaign for exercise (index 0 to 7)
  const [selectedMetaIndex, setSelectedMetaIndex] = useState(0);

  // Correction visibility states
  const [showMetaCalcCorrection, setShowMetaCalcCorrection] = useState(false);
  const [revealedTheoryAnswers, setRevealedTheoryAnswers] = useState<{ [key: string]: boolean }>({});
  const [showAllMetaTableCorrection, setShowAllMetaTableCorrection] = useState(false);
  const [showGa4Correction, setShowGa4Correction] = useState(false);
  const [showGoogleAdsCorrection, setShowGoogleAdsCorrection] = useState(false);

  // Student calculation inputs for Meta
  const [studentCalculations, setStudentCalculations] = useState<{
    [campaignId: string]: { cpc: string; er: string; roas: string }
  }>({});

  // Student theory answers for Meta
  const [theoryAnswers, setTheoryAnswers] = useState({
    objective: '',
    reachDef: '',
    impressionDef: '',
    mostIgVisits: '',
    mostRepeated: '',
    retargetingDef: '',
    audienceType: ''
  });

  // Student answers for GA4
  const [ga4StudentAnswers, setGa4StudentAnswers] = useState({
    utmCampaignParam: '',
    utmSourceMediumFormat: '',
    bestMetaTrafficCampaign: '',
    durationAnalysis: '',
    haloEffectExplanation: ''
  });

  // Student answers for Google Ads
  const [googleAdsStudentAnswers, setGoogleAdsStudentAnswers] = useState({
    roasSearch: '',
    cpaLeadPMax: ''
  });

  // Dimension filter in GA4 realistic table
  const [ga4Dimension, setGa4Dimension] = useState<'sourceMedium' | 'campaign' | 'channel'>('sourceMedium');
  const [ga4Search, setGa4Search] = useState('');

  // 8 Meta Campaigns Data (Official from PDF notes)
  const metaCampaigns = [
    {
      id: '1',
      name: 'convers_retargeting_vidéo',
      tag: 'Recommandée pour le reciblage',
      objective: 'Ventes',
      status: 'ACTIVE',
      budget: '15,00 €',
      budgetType: 'DAILY',
      amountSpent: '111,38 €',
      spendNum: 111.38,
      impressions: '60 720',
      reach: '26 528',
      reachNum: 26528,
      frequency: '2,29',
      postReactions: '38',
      postComments: '12',
      postShares: '15',
      postSaves: '8',
      totalInteractions: 73, // 38 + 12 + 15 + 8
      linkClicks: '770',
      clicksNum: 770,
      purchases: '42',
      purchaseValue: '2 850,00 €',
      purchaseValueNum: 2850.00,
      cpcExpected: '0,14 €',
      cpcNum: 0.14,
      erExpected: '0,275%',
      erNum: 0.275,
      roasExpected: '25,59',
      roasNum: 25.59,
      trafficGoogle: '3',
      instagramProfileVisits: '2',
      isRetargeting: true
    },
    {
      id: '2',
      name: 'convers_vidéo_cinéma',
      tag: 'Vidéo Cinéma - Acquisition & Ventes',
      objective: 'Ventes',
      status: 'ACTIVE',
      budget: '10,00 €',
      budgetType: 'DAILY',
      amountSpent: '80,99 €',
      spendNum: 80.99,
      impressions: '41 867',
      reach: '11 756',
      reachNum: 11756,
      frequency: '3,56',
      postReactions: '33',
      postComments: '11',
      postShares: '17',
      postSaves: '9',
      totalInteractions: 70, // 33 + 11 + 17 + 9
      linkClicks: '282',
      clicksNum: 282,
      purchases: '65',
      purchaseValue: '4 225,00 €',
      purchaseValueNum: 4225.00,
      cpcExpected: '0,29 €',
      cpcNum: 0.29,
      erExpected: '0,595%',
      erNum: 0.595,
      roasExpected: '52,17',
      roasNum: 52.17,
      trafficGoogle: '4',
      instagramProfileVisits: '6',
      isRetargeting: false
    },
    {
      id: '3',
      name: 'convers_vidéo_charles',
      tag: 'Campagne test en Pause',
      objective: 'Ventes',
      status: 'PAUSED',
      budget: '5,00 €',
      budgetType: 'DAILY',
      amountSpent: '41,82 €',
      spendNum: 41.82,
      impressions: '15 087',
      reach: '9 383',
      reachNum: 9383,
      frequency: '1,61',
      postReactions: '4',
      postComments: '1',
      postShares: '0',
      postSaves: '1',
      totalInteractions: 6, // 4 + 1 + 0 + 1
      linkClicks: '112',
      clicksNum: 112,
      purchases: '0',
      purchaseValue: '0,00 €',
      purchaseValueNum: 0.00,
      cpcExpected: '0,37 €',
      cpcNum: 0.37,
      erExpected: '0,064%',
      erNum: 0.064,
      roasExpected: '0,00',
      roasNum: 0.00,
      trafficGoogle: '2',
      instagramProfileVisits: '0',
      isRetargeting: false
    },
    {
      id: '4',
      name: 'sales_saint-val_juin_26',
      tag: 'Offre Saisonnière',
      objective: 'Ventes',
      status: 'ACTIVE',
      budget: '25,00 €',
      budgetType: 'DAILY',
      amountSpent: '125,40 €',
      spendNum: 125.40,
      impressions: '14 200',
      reach: '8 400',
      reachNum: 8400,
      frequency: '1,69',
      postReactions: '14',
      postComments: '2',
      postShares: '1',
      postSaves: '5',
      totalInteractions: 22, // 14 + 2 + 1 + 5
      linkClicks: '120',
      clicksNum: 120,
      purchases: '6',
      purchaseValue: '540,00 €',
      purchaseValueNum: 540.00,
      cpcExpected: '1,05 €',
      cpcNum: 1.05,
      erExpected: '0,262%',
      erNum: 0.262,
      roasExpected: '4,31',
      roasNum: 4.31,
      trafficGoogle: '8',
      instagramProfileVisits: '4',
      isRetargeting: false
    },
    {
      id: '5',
      name: 'Conver_retargetting_video_womeninwavre_mars_26',
      tag: 'Fréquence la plus élevée (10,00) • Reciblage local',
      objective: 'Ventes',
      status: 'ACTIVE',
      budget: '10,00 €',
      budgetType: 'DAILY',
      amountSpent: '45,00 €',
      spendNum: 45.00,
      impressions: '12 500',
      reach: '1 250',
      reachNum: 1250,
      frequency: '10,00',
      postReactions: '42',
      postComments: '8',
      postShares: '3',
      postSaves: '12',
      totalInteractions: 65, // 42 + 8 + 3 + 12
      linkClicks: '52',
      clicksNum: 52,
      purchases: '2',
      purchaseValue: '180,00 €',
      purchaseValueNum: 180.00,
      cpcExpected: '0,87 €',
      cpcNum: 0.87,
      erExpected: '5,200%',
      erNum: 5.200,
      roasExpected: '4,00',
      roasNum: 4.00,
      trafficGoogle: '1',
      instagramProfileVisits: '1',
      isRetargeting: true
    },
    {
      id: '6',
      name: 'Sales_advantage+_reel_womeninwavre',
      tag: 'Plus grand nombre de visites profil Instagram (12)',
      objective: 'Ventes',
      status: 'ACTIVE',
      budget: '30,00 €',
      budgetType: 'DAILY',
      amountSpent: '210,00 €',
      spendNum: 210.00,
      impressions: '45 300',
      reach: '38 400',
      reachNum: 38400,
      frequency: '1,18',
      postReactions: '125',
      postComments: '42',
      postShares: '28',
      postSaves: '55',
      totalInteractions: 250, // 125 + 42 + 28 + 55
      linkClicks: '410',
      clicksNum: 410,
      purchases: '12',
      purchaseValue: '720,00 €',
      purchaseValueNum: 720.00,
      cpcExpected: '0,51 €',
      cpcNum: 0.51,
      erExpected: '0,651%',
      erNum: 0.651,
      roasExpected: '3,43',
      roasNum: 3.43,
      trafficGoogle: '14',
      instagramProfileVisits: '12', // Record de visites profil IG dans le tableau
      isRetargeting: false
    },
    {
      id: '7',
      name: 'convers_saison_vilar_2023-2024',
      tag: 'Campagne de Notoriété / Billetterie Saison',
      objective: 'Ventes',
      status: 'ACTIVE',
      budget: '20,00 €',
      budgetType: 'DAILY',
      amountSpent: '40,00 €',
      spendNum: 40.00,
      impressions: '11 570',
      reach: '5 667',
      reachNum: 5667,
      frequency: '2,04',
      postReactions: '2',
      postComments: '0',
      postShares: '0',
      postSaves: '0',
      totalInteractions: 2,
      linkClicks: '69',
      clicksNum: 69,
      purchases: '0',
      purchaseValue: '0,00 €',
      purchaseValueNum: 0.00,
      cpcExpected: '0,58 €',
      cpcNum: 0.58,
      erExpected: '0,035%',
      erNum: 0.035,
      roasExpected: '0,00',
      roasNum: 0.00,
      trafficGoogle: '6',
      instagramProfileVisits: '2',
      isRetargeting: false
    },
    {
      id: '8',
      name: 'convers_vidéo_charles IG',
      tag: 'Format Reel Instagram dédié',
      objective: 'Ventes',
      status: 'ACTIVE',
      budget: '5,00 €',
      budgetType: 'DAILY',
      amountSpent: '20,97 €',
      spendNum: 20.97,
      impressions: '8 706',
      reach: '5 175',
      reachNum: 5175,
      frequency: '1,68',
      postReactions: '1',
      postComments: '0',
      postShares: '0',
      postSaves: '0',
      totalInteractions: 1,
      linkClicks: '44',
      clicksNum: 44,
      purchases: '12',
      purchaseValue: '840,00 €',
      purchaseValueNum: 840.00,
      cpcExpected: '0,48 €',
      cpcNum: 0.48,
      erExpected: '0,019%',
      erNum: 0.019,
      roasExpected: '40,06',
      roasNum: 40.06,
      trafficGoogle: '1',
      instagramProfileVisits: '5',
      isRetargeting: false
    }
  ];

  // Google Ads Campaigns
  const googleAdsCampaigns = [
    {
      id: 'g1',
      name: 'Sales_Search_Brand_FR',
      type: 'Search (Marque)',
      status: 'ACTIVE',
      budget: '25,00 €',
      spend: '750,00 €',
      spendNum: 750,
      impressions: '12 400',
      clicks: '1 240',
      conversions: '45',
      conversionValue: '3 200,00 €',
      convValueNum: 3200,
      leads: '0',
      cpc: '0,60 €',
      ctr: '10,0%',
      roas: '4,27'
    },
    {
      id: 'g2',
      name: 'Lead_Generation_PMax_Wavre',
      type: 'Performance Max',
      status: 'ACTIVE',
      budget: '40,00 €',
      spend: '1 200,00 €',
      spendNum: 1200,
      impressions: '45 000',
      clicks: '850',
      conversions: '22',
      conversionValue: '0,00 €',
      convValueNum: 0,
      leads: '22',
      leadsNum: 22,
      cpc: '1,41 €',
      ctr: '1,89%',
      cpaLead: '54,55 €'
    },
    {
      id: 'g3',
      name: 'Traffic_Display_Remarketing',
      type: 'Display (Reciblage)',
      status: 'ACTIVE',
      budget: '15,00 €',
      spend: '450,00 €',
      spendNum: 450,
      impressions: '150 000',
      clicks: '1 500',
      conversions: '5',
      conversionValue: '350,00 €',
      convValueNum: 350,
      leads: '2',
      cpc: '0,30 €',
      ctr: '1,00%',
      roas: '0,78'
    }
  ];

  // Realistic GA4 Traffic Acquisition Data with UTMs
  const ga4AcquisitionRows = [
    {
      id: 'ga-1',
      sourceMedium: 'meta / ads',
      campaign: 'convers_retargeting_vidéo_place-aux-artistes',
      channel: 'Paid Other',
      sessions: 994,
      users: 820,
      engagedSessions: 180,
      engagementRate: '18,1%',
      avgDuration: '0m 05s',
      keyEvents: 12,
      revenue: 1450,
      utmSource: 'meta',
      utmMedium: 'ads',
      utmCampaign: 'convers_retargeting_vidéo_place-aux-artistes'
    },
    {
      id: 'ga-2',
      sourceMedium: 'google / cpc',
      campaign: 'Sales_Search_Brand_FR',
      channel: 'Paid Search',
      sessions: 1240,
      users: 980,
      engagedSessions: 850,
      engagementRate: '68,5%',
      avgDuration: '1m 24s',
      keyEvents: 45,
      revenue: 3200,
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'Sales_Search_Brand_FR'
    },
    {
      id: 'ga-3',
      sourceMedium: 'google / cpc',
      campaign: 'Lead_Generation_PMax_Wavre',
      channel: 'Paid Search',
      sessions: 850,
      users: 710,
      engagedSessions: 443,
      engagementRate: '52,1%',
      avgDuration: '0m 58s',
      keyEvents: 22,
      revenue: 0,
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'Lead_Generation_PMax_Wavre'
    },
    {
      id: 'ga-4',
      sourceMedium: '(direct) / (none)',
      campaign: '(not set)',
      channel: 'Direct',
      sessions: 650,
      users: 590,
      engagedSessions: 394,
      engagementRate: '60,6%',
      avgDuration: '0m 48s',
      keyEvents: 15,
      revenue: 950,
      utmSource: '(direct)',
      utmMedium: '(none)',
      utmCampaign: '(not set)'
    },
    {
      id: 'ga-5',
      sourceMedium: 'meta / ads',
      campaign: 'convers_vidéo_cinéma',
      channel: 'Paid Other',
      sessions: 310,
      users: 280,
      engagedSessions: 53,
      engagementRate: '17,1%',
      avgDuration: '0m 03s',
      keyEvents: 8,
      revenue: 820,
      utmSource: 'meta',
      utmMedium: 'ads',
      utmCampaign: 'convers_vidéo_cinéma'
    },
    {
      id: 'ga-6',
      sourceMedium: 'meta / ads',
      campaign: 'Convers_saison_vilar_2023-2024',
      channel: 'Paid Other',
      sessions: 294,
      users: 260,
      engagedSessions: 15,
      engagementRate: '5,1%',
      avgDuration: '0m 00s',
      keyEvents: 2,
      revenue: 0,
      utmSource: 'meta',
      utmMedium: 'ads',
      utmCampaign: 'Convers_saison_vilar_2023-2024'
    },
    {
      id: 'ga-7',
      sourceMedium: 'meta / ads',
      campaign: 'convers_vidéo_charles',
      channel: 'Paid Other',
      sessions: 241,
      users: 215,
      engagedSessions: 25,
      engagementRate: '10,3%',
      avgDuration: '0m 02s',
      keyEvents: 5,
      revenue: 120,
      utmSource: 'meta',
      utmMedium: 'ads',
      utmCampaign: 'convers_vidéo_charles'
    },
    {
      id: 'ga-8',
      sourceMedium: 'google / cpc',
      campaign: 'Traffic_Display_Remarketing',
      channel: 'Paid Video',
      sessions: 1500,
      users: 1320,
      engagedSessions: 630,
      engagementRate: '42,0%',
      avgDuration: '0m 25s',
      keyEvents: 5,
      revenue: 350,
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'Traffic_Display_Remarketing'
    },
    {
      id: 'ga-9',
      sourceMedium: 'google / organic',
      campaign: '(not set)',
      channel: 'Organic Search',
      sessions: 129,
      users: 110,
      engagedSessions: 76,
      engagementRate: '58,9%',
      avgDuration: '0m 42s',
      keyEvents: 4,
      revenue: 280,
      utmSource: 'google',
      utmMedium: 'organic',
      utmCampaign: '(not set)'
    }
  ];

  // Active selected campaign
  const currentCampaign = metaCampaigns[selectedMetaIndex];

  // Handle student calculation input
  const handleCalcChange = (campaignId: string, field: 'cpc' | 'er' | 'roas', value: string) => {
    setStudentCalculations(prev => ({
      ...prev,
      [campaignId]: {
        ...(prev[campaignId] || { cpc: '', er: '', roas: '' }),
        [field]: value
      }
    }));
  };

  const getStudentCalc = (campaignId: string) => {
    return studentCalculations[campaignId] || { cpc: '', er: '', roas: '' };
  };

  // Check calculation accuracy
  const verifyCalculations = () => {
    const student = getStudentCalc(currentCampaign.id);
    const parse = (v: string) => parseFloat(v.replace(',', '.').replace('%', '').trim()) || 0;
    
    const userCpc = parse(student.cpc);
    const userEr = parse(student.er);
    const userRoas = parse(student.roas);

    const isCpcClose = Math.abs(userCpc - currentCampaign.cpcNum) < 0.03;
    const isErClose = Math.abs(userEr - currentCampaign.erNum) < 0.05;
    const isRoasClose = Math.abs(userRoas - currentCampaign.roasNum) < 0.2;

    if (isCpcClose && isErClose && isRoasClose) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b']
      });
    }

    setShowMetaCalcCorrection(true);
  };

  // Toggle single theory question answer
  const toggleTheoryAnswer = (questionKey: string) => {
    setRevealedTheoryAnswers(prev => ({
      ...prev,
      [questionKey]: !prev[questionKey]
    }));
  };

  // Download official correction report (.doc)
  const handleDownloadFullReport = () => {
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#2563eb', '#6366f1', '#10b981', '#f59e0b']
    });

    let doc = `FEUILLE DE CORRECTION OFFICIELLE - SIMULATION MARKETING & REPORTING LAB\n`;
    doc += `=========================================================================\n`;
    doc += `Généré le : ${new Date().toLocaleString('fr-FR')}\n\n`;

    doc += `PARTIE I : ANALYSE ET CALCULS META ADS (8 CAMPAGNES)\n`;
    doc += `-------------------------------------------------------------------------\n`;
    doc += `Note terminologique : le terme "CPC" désigne le Coût Par Clic (dépenses / clics).\n`;
    doc += `Formule Taux d'Engagement : (Interactions cumulées / Portée [Reach]) * 100\n`;
    doc += `Formule ROAS : Valeur des achats (€) / Dépenses publicitaires (€)\n\n`;

    metaCampaigns.forEach((c, idx) => {
      doc += `Campagne ${idx + 1} : ${c.name} (${c.tag})\n`;
      doc += `  • Dépenses : ${c.amountSpent} | Clics : ${c.linkClicks} | Portée (Reach) : ${c.reach} | Interactions cumulées : ${c.totalInteractions}\n`;
      doc += `  • Valeur achats : ${c.purchaseValue} | Visites profil Instagram : ${c.instagramProfileVisits}\n`;
      doc += `  => CPC attendu : ${c.cpcExpected} (${c.amountSpent} / ${c.linkClicks} clics)\n`;
      doc += `  => Taux d'Engagement : ${c.erExpected} (${c.totalInteractions} interactions / ${c.reach} personnes touchées * 100)\n`;
      doc += `  => ROAS : ${c.roasExpected} (${c.purchaseValue} / ${c.amountSpent})\n\n`;
    });

    doc += `PARTIE II : QUESTIONS DE THÉORIE & ANALYSE STRATÉGIQUE (META)\n`;
    doc += `-------------------------------------------------------------------------\n`;
    doc += `Q1. Quel est l'objectif des campagnes actuelles ?\n`;
    doc += `Réponse attendue : Ventes ou Conversion (objectif configuré pour générer du chiffre d'affaires et rentabiliser le budget publicitaire).\n\n`;

    doc += `Q2. Que signifie le "Reach" (Portée) ?\n`;
    doc += `Réponse attendue : Le nombre de personnes/utilisateurs uniques qui ont été exposés au moins une fois à la publicité.\n\n`;

    doc += `Q3. Que signifie "Impression" ?\n`;
    doc += `Réponse attendue : Le nombre total de fois où la publicité a été affichée sur un écran (une même personne peut la voir plusieurs fois, donc impressions >= reach).\n\n`;

    doc += `Q4. Quelle campagne a le plus de visites de profil Instagram ?\n`;
    doc += `Réponse attendue : Sales_advantage+_reel_womeninwavre avec 12 visites de profil Instagram (visible directement dans la colonne Visites de profil Instagram du tableau).\n\n`;

    doc += `Q5. Quelle campagne est la plus "répétée" (Fréquence la plus haute) ?\n`;
    doc += `Réponse attendue : Conver_retargetting_video_womeninwavre_mars_26 avec une fréquence record de 10,00 (chaque personne touchée a vu la pub 10 fois en moyenne, caractéristique d'une audience de reciblage très ciblée et réduite).\n\n`;

    doc += `Q6. Que signifie le "Retargeting" (Reciblage) ?\n`;
    doc += `Réponse attendue : Diffuser des publicités spécifiquement aux internautes qui ont déjà interagi avec la marque (visite du site web, ajout au panier, visionnage d'une vidéo précédente, engagement sur les réseaux sociaux).\n\n`;

    doc += `Q7. Selon vous, la campagne sélectionnée utilise-t-elle une audience Retargeting ou Advantage+ ?\n`;
    doc += `Réponse attendue : Si la campagne porte la mention "retarget" dans son nom : Retargeting (fréquence élevée, audience chaude qualifiée). Sinon : Advantage+ ou Prospecting (audiences d'acquisition froide optimisées automatiquement par les algorithmes de Meta).\n\n`;

    doc += `PARTIE III : GOOGLE ANALYTICS 4 & PARAMÈTRES UTM\n`;
    doc += `-------------------------------------------------------------------------\n`;
    doc += `Q1. Dans GA4, à quelle variable UTM correspond la dimension "Campagne" ?\n`;
    doc += `Réponse attendue : utm_campaign (ex: utm_campaign=convers_retargeting_vidéo).\n\n`;

    doc += `Q2. Si une URL contient ?utm_source=meta&utm_medium=ads, comment GA4 l'affiche-t-il dans "Source / Support" ?\n`;
    doc += `Réponse attendue : meta / ads\n\n`;

    doc += `Q3. Quelle campagne Meta a apporté le plus de sessions sur le site web ?\n`;
    doc += `Réponse attendue : convers_retargeting_vidéo_place-aux-artistes (994 sessions enregistrées).\n\n`;

    doc += `Q4. Pourquoi la durée moyenne de session de meta / ads est-elle plus courte que celle de google / cpc ?\n`;
    doc += `Réponse attendue : Meta est un trafic d'interruption (l'utilisateur scrolle son feed social de manière passive), tandis que Google Search est un trafic d'intention forte (l'utilisateur a activement recherché une réponse ou un produit précis).\n\n`;

    doc += `Q5. Qu'est-ce que l'effet de halo (Halo Effect) ?\n`;
    doc += `Réponse attendue : L'exposition répétée aux publicités Meta donne envie aux utilisateurs d'aller voir le site plus tard. Ne cliquant pas toujours directement sur la publicité, ils tapent ensuite le nom de la marque sur Google ou l'URL directement dans leur navigateur. Meta contribue donc indirectement aux conversions attribuées à Google et au Direct.\n\n`;

    doc += `PARTIE IV : GOOGLE ADS & CALCULS DE RENTABILITÉ\n`;
    doc += `-------------------------------------------------------------------------\n`;
    doc += `• Sales_Search_Brand_FR : ROAS = 3 200 € / 750 € = 4,27\n`;
    doc += `• Lead_Generation_PMax_Wavre : Coût par Lead (CPA) = 1 200 € / 22 leads = 54,55 € / lead\n`;
    doc += `• Traffic_Display_Remarketing : ROAS = 350 € / 450 € = 0,78\n\n`;

    doc += `=========================================================================\n`;
    doc += `FIN DU CORRIGÉ - MarketSim Digital Marketing Training`;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Corrige_Reporting_Lab_Marketing</title></head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b;">
        <h1 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 24px;">
          Corrigé Officiel & Rapport - Lab Reporting & Data Analytics
        </h1>
        <pre style="white-space: pre-wrap; font-size: 11pt; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif;">
${doc}
        </pre>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Corrige_Officiel_Reporting_Lab.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered GA4 rows
  const filteredGa4Rows = useMemo(() => {
    return ga4AcquisitionRows.filter(r => {
      const q = ga4Search.toLowerCase();
      if (ga4Dimension === 'sourceMedium') return r.sourceMedium.toLowerCase().includes(q);
      if (ga4Dimension === 'campaign') return r.campaign.toLowerCase().includes(q);
      return r.channel.toLowerCase().includes(q);
    });
  }, [ga4Dimension, ga4Search]);

  // Chart data for data overview mode
  const chartData = useMemo(() => {
    return metaCampaigns.map(c => ({
      name: c.name.length > 18 ? c.name.substring(0, 15) + '...' : c.name,
      fullName: c.name,
      spend: c.spendNum,
      revenue: c.purchaseValueNum,
      roas: c.roasNum
    }));
  }, [metaCampaigns]);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans text-slate-800">
      
      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Master Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={onExit} 
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Retour à l'accueil"
            >
              <ArrowLeft size={18} />
              <span>Accueil</span>
            </button>
            <div className="h-5 w-px bg-slate-200"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm tracking-tight">Reporting Lab : Media Buying & Data Analytics</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-md border border-blue-200">
                  Version Pédagogique
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Simulateur d'analyse Meta Ads, Google Analytics 4 et Google Ads</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setMainMode('exercises')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
                mainMode === 'exercises' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calculator size={14} />
              <span>Espace Exercices (Lab)</span>
            </button>

            <button
              onClick={() => setMainMode('data')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
                mainMode === 'data' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 size={14} />
              <span>Tableaux & Visualisations</span>
            </button>

            <button
              onClick={() => setMainMode('course')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
                mainMode === 'course' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen size={14} />
              <span>Fiche de Cours & Mémo</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadFullReport}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              title="Télécharger le corrigé complet au format Word"
            >
              <Download size={14} />
              <span>Télécharger le Corrigé (.doc)</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content View */}
        <div className="flex-1 overflow-y-auto">
          
          {/* ======================================================== */}
          {/* MODE 1: ESPACE EXERCICES (LAB ÉTUDIANTS DÉDIÉ)            */}
          {/* ======================================================== */}
          {mainMode === 'exercises' && (
            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 pb-20">
              
              {/* Exercise Category Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Cahier d'Exercices & Évaluation</span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 font-bold rounded-full">
                      Corrigé officiel intégré
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Sélectionnez un module ci-dessous pour vous entraîner sur les calculs et questions d'analyse.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                  <button
                    onClick={() => setExerciseTab('meta')}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                      exerciseTab === 'meta'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    1. Meta Ads (Calculs & Théorie)
                  </button>
                  <button
                    onClick={() => setExerciseTab('ga4')}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                      exerciseTab === 'ga4'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    2. Google Analytics 4 & UTMs
                  </button>
                  <button
                    onClick={() => setExerciseTab('google-ads')}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                      exerciseTab === 'google-ads'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    3. Google Ads (ROAS & Leads)
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* SUB-TAB 1: META ADS EXERCISE (PART 1 & PART 2)       */}
              {/* ---------------------------------------------------- */}
              {exerciseTab === 'meta' && (
                <div className="space-y-8">
                  
                  {/* Step A: Campaigns Reference Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                            1
                          </span>
                          <h3 className="text-base font-black text-slate-900 tracking-tight">
                            Tableau des 8 Campagnes Meta
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Cliquez sur une campagne pour la sélectionner et effectuer vos calculs dans la <strong>Partie 1</strong> ci-dessous.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAllMetaTableCorrection(!showAllMetaTableCorrection)}
                          className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                        >
                          {showAllMetaTableCorrection ? 'Masquer le corrigé du tableau' : 'Afficher le corrigé complet des 8 campagnes'}
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-100 rounded-xl">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Campagne</th>
                            <th className="py-3 px-4 text-right">Dépenses</th>
                            <th className="py-3 px-4 text-right">Clics</th>
                            <th className="py-3 px-4 text-right font-black text-blue-700">CPC</th>
                            <th className="py-3 px-4 text-right">Portée (Reach)</th>
                            <th className="py-3 px-4 text-right">Impressions</th>
                            <th className="py-3 px-4 text-right">Fréquence</th>
                            <th className="py-3 px-4 text-right">Interactions (Total)</th>
                            <th className="py-3 px-4 text-right font-black text-amber-700">Taux d'Engagement</th>
                            <th className="py-3 px-4 text-right">Achats</th>
                            <th className="py-3 px-4 text-right">Valeur Achats</th>
                            <th className="py-3 px-4 text-right font-black text-emerald-700">ROAS</th>
                            <th className="py-3 px-4 text-right font-black text-purple-700">Visites Profil IG</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {metaCampaigns.map((camp, idx) => {
                            const isSelected = selectedMetaIndex === idx;
                            return (
                              <tr 
                                key={camp.id}
                                onClick={() => {
                                  setSelectedMetaIndex(idx);
                                  setShowMetaCalcCorrection(false);
                                }}
                                className={`cursor-pointer transition-colors ${
                                  isSelected 
                                    ? 'bg-blue-50/80 font-bold text-blue-900 border-l-4 border-l-blue-600' 
                                    : 'hover:bg-slate-50/80 text-slate-700'
                                }`}
                              >
                                <td className="py-3 px-4 flex items-center gap-2">
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                                  }`}>
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <div className="font-bold flex items-center gap-1.5">
                                      <span>{camp.name}</span>
                                      {camp.status === 'PAUSED' && (
                                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-700 text-[9px] rounded font-black">PAUSED</span>
                                      )}
                                      {camp.frequency === '10,00' && (
                                        <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 text-[9px] rounded font-black">Fréquence Max</span>
                                      )}
                                      {camp.instagramProfileVisits === '12' && (
                                        <span className="px-1.5 py-0.2 bg-pink-100 text-pink-700 text-[9px] rounded font-black">Visites IG Max (12)</span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">{camp.tag}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-semibold">{camp.amountSpent}</td>
                                <td className="py-3 px-4 text-right">{camp.linkClicks}</td>
                                <td className="py-3 px-4 text-right font-black text-blue-700">
                                  {showAllMetaTableCorrection ? camp.cpcExpected : '...'}
                                </td>
                                <td className="py-3 px-4 text-right">{camp.reach}</td>
                                <td className="py-3 px-4 text-right text-slate-500">{camp.impressions}</td>
                                <td className="py-3 px-4 text-right font-semibold">{camp.frequency}</td>
                                <td className="py-3 px-4 text-right text-slate-600">
                                  {camp.totalInteractions} <span className="text-[10px] text-slate-400">({camp.postReactions}+{camp.postComments}+{camp.postShares}+{camp.postSaves})</span>
                                </td>
                                <td className="py-3 px-4 text-right font-black text-amber-700">
                                  {showAllMetaTableCorrection ? camp.erExpected : '...'}
                                </td>
                                <td className="py-3 px-4 text-right">{camp.purchases}</td>
                                <td className="py-3 px-4 text-right font-semibold">{camp.purchaseValue}</td>
                                <td className="py-3 px-4 text-right font-black text-emerald-700">
                                  {showAllMetaTableCorrection ? camp.roasExpected : '...'}
                                </td>
                                <td className="py-3 px-4 text-right font-black text-purple-700">
                                  {camp.instagramProfileVisits}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pedagogical Banner: ROAS & Engagement Formulas */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-800 tracking-wider">
                        <Info size={14} /> Rappel Formule ROAS (Return On Ad Spend)
                      </div>
                      <p className="text-xs text-blue-900 font-semibold font-mono">
                        ROAS = Valeur des achats (€) / Dépenses (€)
                      </p>
                      <p className="text-[11px] text-blue-700">
                        Exemple : 2 850 € / 111,38 € = <strong>25,59</strong>. Pour 1 € dépensé, la campagne rapporte 25,59 € de CA.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-800 tracking-wider">
                        <Info size={14} /> Rappel Formule Taux d'Engagement
                      </div>
                      <p className="text-xs text-indigo-900 font-semibold font-mono">
                        Taux d'Engagement (%) = (Interactions cumulées / Portée [Reach]) × 100
                      </p>
                      <p className="text-[11px] text-indigo-700">
                        Interactions = Réactions + Commentaires + Partages + Enregistrements. Divisé par la portée (personnes uniques).
                      </p>
                    </div>
                  </div>

                  {/* -------------------------------------------------- */}
                  {/* PARTIE 1 : CALCULS DE PERFORMANCE                  */}
                  {/* -------------------------------------------------- */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black uppercase rounded-lg border border-blue-200 mb-1">
                          Partie 1 • Calculs de Performance
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">
                          Calculs pour : <span className="text-blue-600">{currentCampaign.name}</span>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Données de la campagne sélectionnée : Dépenses: <strong>{currentCampaign.amountSpent}</strong> | Clics: <strong>{currentCampaign.linkClicks}</strong> | Portée: <strong>{currentCampaign.reach}</strong> | Interactions: <strong>{currentCampaign.totalInteractions}</strong> | Valeur achats: <strong>{currentCampaign.purchaseValue}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={verifyCalculations}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                        >
                          <Check size={14} />
                          <span>Vérifier mes calculs</span>
                        </button>
                      </div>
                    </div>

                    {/* 3 Calculation Input Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* CPC */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">1. Calcul du CPC</span>
                          <span className="text-[10px] font-bold text-slate-400">Coût Par Clic</span>
                        </div>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="ex: 0.14"
                            value={getStudentCalc(currentCampaign.id).cpc}
                            onChange={(e) => handleCalcChange(currentCampaign.id, 'cpc', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">€</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Formule : Dépenses ({currentCampaign.amountSpent}) / Clics ({currentCampaign.linkClicks})
                        </p>

                        {showMetaCalcCorrection && (
                          <div className="p-3 bg-blue-100/70 border border-blue-200 rounded-xl text-xs space-y-1">
                            <div className="font-black text-blue-900 flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-blue-700" />
                              <span>Réponse attendue : {currentCampaign.cpcExpected}</span>
                            </div>
                            <div className="text-[10px] text-blue-800">
                              Calcul : {currentCampaign.amountSpent} / {currentCampaign.linkClicks} = {currentCampaign.cpcExpected}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Taux d'engagement */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">2. Taux d'Engagement</span>
                          <span className="text-[10px] font-bold text-slate-400">Interactions / Portée</span>
                        </div>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="ex: 0.275"
                            value={getStudentCalc(currentCampaign.id).er}
                            onChange={(e) => handleCalcChange(currentCampaign.id, 'er', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Formule : ({currentCampaign.totalInteractions} interactions / {currentCampaign.reach} reach) × 100
                        </p>

                        {showMetaCalcCorrection && (
                          <div className="p-3 bg-amber-100/70 border border-amber-200 rounded-xl text-xs space-y-1">
                            <div className="font-black text-amber-900 flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-amber-700" />
                              <span>Réponse attendue : {currentCampaign.erExpected}</span>
                            </div>
                            <div className="text-[10px] text-amber-800">
                              Calcul : {currentCampaign.totalInteractions} / {currentCampaign.reach} × 100 = {currentCampaign.erExpected}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ROAS */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-wider">3. Calcul du ROAS</span>
                          <span className="text-[10px] font-bold text-slate-400">Retour publicitaire</span>
                        </div>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="ex: 25.59"
                            value={getStudentCalc(currentCampaign.id).roas}
                            onChange={(e) => handleCalcChange(currentCampaign.id, 'roas', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">ratio</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Formule : Valeur ({currentCampaign.purchaseValue}) / Dépenses ({currentCampaign.amountSpent})
                        </p>

                        {showMetaCalcCorrection && (
                          <div className="p-3 bg-emerald-100/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                            <div className="font-black text-emerald-900 flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-emerald-700" />
                              <span>Réponse attendue : {currentCampaign.roasExpected}</span>
                            </div>
                            <div className="text-[10px] text-emerald-800">
                              Calcul : {currentCampaign.purchaseValue} / {currentCampaign.amountSpent} = {currentCampaign.roasExpected}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* -------------------------------------------------- */}
                  {/* PARTIE 2 : QUESTIONS DE THÉORIE & ANALYSE          */}
                  {/* -------------------------------------------------- */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                    <div className="pb-4 border-b border-slate-100">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-black uppercase rounded-lg border border-purple-200 mb-1">
                        Partie 2 • Questions de Théorie & Analyse Stratégique
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        Questions Clés d'Analyse Meta Ads
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Répondez aux questions ci-dessous en vous appuyant sur le tableau des campagnes, puis cliquez sur "Voir la réponse" pour consulter la correction officielle.
                      </p>
                    </div>

                    <div className="space-y-6">
                      
                      {/* Q1: Objectif */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-black text-slate-800">
                            1. Quel est l'objectif des campagnes actuelles ?
                          </label>
                          <button 
                            onClick={() => toggleTheoryAnswer('q1')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {revealedTheoryAnswers['q1'] ? 'Masquer la réponse' : 'Voir la réponse attendue'}
                          </button>
                        </div>
                        <input 
                          type="text"
                          placeholder="Votre réponse (ex: Ventes, Notoriété...)"
                          value={theoryAnswers.objective}
                          onChange={(e) => setTheoryAnswers(prev => ({ ...prev, objective: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {revealedTheoryAnswers['q1'] && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-900">
                            <span className="font-black">Réponse attendue : </span>
                            <span><strong>Ventes ou Conversion</strong>. C'est l'objectif Meta configuré pour générer du chiffre d'affaires et rentabiliser directement le budget publicitaire.</span>
                          </div>
                        )}
                      </div>

                      {/* Q2: Reach */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-black text-slate-800">
                            2. Que signifie le "Reach" (Portée) ?
                          </label>
                          <button 
                            onClick={() => toggleTheoryAnswer('q2')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {revealedTheoryAnswers['q2'] ? 'Masquer la réponse' : 'Voir la réponse attendue'}
                          </button>
                        </div>
                        <input 
                          type="text"
                          placeholder="Votre définition..."
                          value={theoryAnswers.reachDef}
                          onChange={(e) => setTheoryAnswers(prev => ({ ...prev, reachDef: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {revealedTheoryAnswers['q2'] && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-900">
                            <span className="font-black">Réponse attendue : </span>
                            <span>Le nombre de <strong>personnes / utilisateurs uniques</strong> qui ont été exposés au moins une fois à la publicité sur la période.</span>
                          </div>
                        )}
                      </div>

                      {/* Q3: Impression */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-black text-slate-800">
                            3. Que signifie "Impression" ?
                          </label>
                          <button 
                            onClick={() => toggleTheoryAnswer('q3')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {revealedTheoryAnswers['q3'] ? 'Masquer la réponse' : 'Voir la réponse attendue'}
                          </button>
                        </div>
                        <input 
                          type="text"
                          placeholder="Votre définition..."
                          value={theoryAnswers.impressionDef}
                          onChange={(e) => setTheoryAnswers(prev => ({ ...prev, impressionDef: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {revealedTheoryAnswers['q3'] && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-900">
                            <span className="font-black">Réponse attendue : </span>
                            <span>Le nombre total de fois où la publicité a été <strong>affichée sur un écran</strong>. Une même personne peut voir la publicité plusieurs fois (ce qui donne : Impressions = Portée × Fréquence).</span>
                          </div>
                        )}
                      </div>

                      {/* Q4: Profil Instagram (Attention erreur du prof corrigée : c'est 12 visites !) */}
                      <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-black text-purple-900">
                            4. Quelle campagne a le plus de visites de profil Instagram ?
                          </label>
                          <button 
                            onClick={() => toggleTheoryAnswer('q4')}
                            className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors"
                          >
                            {revealedTheoryAnswers['q4'] ? 'Masquer la réponse' : 'Voir la réponse attendue'}
                          </button>
                        </div>
                        <input 
                          type="text"
                          placeholder="Nom de la campagne et nombre de visites..."
                          value={theoryAnswers.mostIgVisits}
                          onChange={(e) => setTheoryAnswers(prev => ({ ...prev, mostIgVisits: e.target.value }))}
                          className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {revealedTheoryAnswers['q4'] && (
                          <div className="p-3 bg-purple-100/80 border border-purple-200 rounded-xl text-xs space-y-1 text-purple-950">
                            <span className="font-black">Réponse attendue (Corrigé officiel) : </span>
                            <span>
                              <strong>Sales_advantage+_reel_womeninwavre</strong> avec <strong>12 visites</strong> de profil Instagram (comme visible directement dans la colonne correspondante du tableau).
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Q5: Fréquence la plus haute */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-black text-slate-800">
                            5. Quelle campagne est la plus "répétée" (Fréquence la plus haute) ?
                          </label>
                          <button 
                            onClick={() => toggleTheoryAnswer('q5')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {revealedTheoryAnswers['q5'] ? 'Masquer la réponse' : 'Voir la réponse attendue'}
                          </button>
                        </div>
                        <input 
                          type="text"
                          placeholder="Nom de la campagne et valeur de la fréquence..."
                          value={theoryAnswers.mostRepeated}
                          onChange={(e) => setTheoryAnswers(prev => ({ ...prev, mostRepeated: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {revealedTheoryAnswers['q5'] && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-900">
                            <span className="font-black">Réponse attendue : </span>
                            <span>
                              <strong>Conver_retargetting_video_womeninwavre_mars_26</strong> avec une fréquence de <strong>10,00</strong> (chaque utilisateur unique l'a vue en moyenne 10 fois, caractéristique d'un reciblage très ciblé d'une audience restreinte).
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Q6: Définition Retargeting */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-black text-slate-800">
                            6. Que signifie le "Retargeting" (Reciblage) ?
                          </label>
                          <button 
                            onClick={() => toggleTheoryAnswer('q6')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {revealedTheoryAnswers['q6'] ? 'Masquer la réponse' : 'Voir la réponse attendue'}
                          </button>
                        </div>
                        <input 
                          type="text"
                          placeholder="Votre explication..."
                          value={theoryAnswers.retargetingDef}
                          onChange={(e) => setTheoryAnswers(prev => ({ ...prev, retargetingDef: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {revealedTheoryAnswers['q6'] && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-900">
                            <span className="font-black">Réponse attendue : </span>
                            <span>
                              Diffuser des publicités à des personnes ayant <strong>déjà interagi avec la marque</strong> (visite du site web, produit mis au panier, vue d'une vidéo ou engagement sur les réseaux sociaux).
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Q7: Audience Retargeting vs Advantage+ */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs font-black text-slate-800">
                            7. Selon vous, la campagne sélectionnée utilise-t-elle une audience Retargeting ou Advantage+ ?
                          </label>
                          <button 
                            onClick={() => toggleTheoryAnswer('q7')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {revealedTheoryAnswers['q7'] ? 'Masquer la réponse' : 'Voir la réponse attendue'}
                          </button>
                        </div>
                        <input 
                          type="text"
                          placeholder="Votre analyse pour la campagne sélectionnée..."
                          value={theoryAnswers.audienceType}
                          onChange={(e) => setTheoryAnswers(prev => ({ ...prev, audienceType: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {revealedTheoryAnswers['q7'] && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-900">
                            <span className="font-black">Réponse attendue : </span>
                            <span>
                              {currentCampaign.isRetargeting 
                                ? "La campagne sélectionnée comporte la mention 'retarget' : c'est bien une audience de Retargeting (fréquence élevée, audience chaude qualifiée)." 
                                : "La campagne sélectionnée est en acquisition froide ou Advantage+ (portée plus large, fréquence basse, ciblage optimisé par l'IA de Meta)."}
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SUB-TAB 2: GOOGLE ANALYTICS 4 & UTMs EXERCISE        */}
              {/* ---------------------------------------------------- */}
              {exerciseTab === 'ga4' && (
                <div className="space-y-8">
                  
                  {/* Step A: Visual UTM Decoder Banner */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
                    <div className="flex items-center gap-2">
                      <Globe size={18} className="text-blue-400" />
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
                        Comprendre les balises UTM dans Google Analytics 4
                      </h3>
                    </div>
                    
                    <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-3xl">
                      Pour qu'une publicité Meta ou Google soit correctement mesurée dans GA4, on ajoute des <strong>paramètres UTM</strong> à l'URL. Observez comment l'URL suivante est automatiquement décodée dans le tableau GA4 ci-dessous :
                    </p>

                    <div className="p-3 bg-slate-800/90 border border-slate-700 rounded-xl font-mono text-[11px] text-blue-200 break-all select-all">
                      https://boutique.be/promo?<strong>utm_source=meta</strong>&<strong>utm_medium=ads</strong>&<strong>utm_campaign=convers_retargeting_vidéo</strong>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <span className="text-[10px] font-black uppercase text-blue-400 block mb-1">utm_source</span>
                        <div className="font-mono font-bold text-white">meta</div>
                        <div className="text-[10px] text-slate-400 mt-1">La provenance du clic</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <span className="text-[10px] font-black uppercase text-indigo-400 block mb-1">utm_medium</span>
                        <div className="font-mono font-bold text-white">ads</div>
                        <div className="text-[10px] text-slate-400 mt-1">Le format de diffusion</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <span className="text-[10px] font-black uppercase text-purple-400 block mb-1">utm_campaign</span>
                        <div className="font-mono font-bold text-white">convers_retargeting_vidéo</div>
                        <div className="text-[10px] text-slate-400 mt-1">Le nom de la campagne</div>
                      </div>
                    </div>
                  </div>

                  {/* Step B: Realistic GA4 Traffic Acquisition Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                            2
                          </span>
                          <h3 className="text-base font-black text-slate-900 tracking-tight">
                            Rapport Réaliste GA4 : Acquisition de Trafic
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Ce tableau reproduit fidèlement l'interface de Google Analytics 4. Utilisez-le pour répondre aux questions ci-dessous.
                        </p>
                      </div>

                      {/* Dimension selector & search */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold">
                          <span className="text-slate-400 text-[10px] uppercase font-black">Dimension :</span>
                          <select 
                            value={ga4Dimension}
                            onChange={(e) => setGa4Dimension(e.target.value as any)}
                            className="bg-transparent text-blue-700 font-bold outline-none cursor-pointer"
                          >
                            <option value="sourceMedium">Source / Support (utm_source / utm_medium)</option>
                            <option value="campaign">Campagne (utm_campaign)</option>
                            <option value="channel">Groupe de canaux par défaut</option>
                          </select>
                        </div>

                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Rechercher..."
                            value={ga4Search}
                            onChange={(e) => setGa4Search(e.target.value)}
                            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* GA4 Table */}
                    <div className="overflow-x-auto border border-slate-100 rounded-xl">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">
                              {ga4Dimension === 'sourceMedium' && 'Source / Support de la session'}
                              {ga4Dimension === 'campaign' && 'Campagne de la session'}
                              {ga4Dimension === 'channel' && 'Groupe de canaux par défaut'}
                            </th>
                            <th className="py-3 px-4 text-right">Sessions</th>
                            <th className="py-3 px-4 text-right">Utilisateurs actifs</th>
                            <th className="py-3 px-4 text-right">Sessions avec engagement</th>
                            <th className="py-3 px-4 text-right font-black text-blue-700">Taux d'engagement</th>
                            <th className="py-3 px-4 text-right font-black text-slate-700">Durée moyenne de session</th>
                            <th className="py-3 px-4 text-right">Événements clés (Achats/Leads)</th>
                            <th className="py-3 px-4 text-right font-black text-emerald-700">Revenus d'achat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {filteredGa4Rows.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-4 flex items-center gap-2">
                                <span className="font-bold text-slate-900">
                                  {ga4Dimension === 'sourceMedium' && row.sourceMedium}
                                  {ga4Dimension === 'campaign' && row.campaign}
                                  {ga4Dimension === 'channel' && row.channel}
                                </span>
                                {row.sourceMedium.includes('meta') && (
                                  <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[9px] rounded font-black">Meta Ads</span>
                                )}
                                {row.sourceMedium.includes('cpc') && (
                                  <span className="px-1.5 py-0.2 bg-teal-100 text-teal-700 text-[9px] rounded font-black">Google Ads</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-slate-800">{row.sessions.toLocaleString('fr-FR')}</td>
                              <td className="py-3 px-4 text-right text-slate-600">{row.users.toLocaleString('fr-FR')}</td>
                              <td className="py-3 px-4 text-right text-slate-600">{row.engagedSessions.toLocaleString('fr-FR')}</td>
                              <td className="py-3 px-4 text-right font-bold text-blue-700">{row.engagementRate}</td>
                              <td className="py-3 px-4 text-right font-mono text-slate-600">{row.avgDuration}</td>
                              <td className="py-3 px-4 text-right font-bold text-purple-700">{row.keyEvents}</td>
                              <td className="py-3 px-4 text-right font-black text-emerald-700">{row.revenue} €</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Step C: GA4 Questions Directly Under the Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black uppercase rounded-lg border border-blue-200 mb-1">
                          Questions Pratiques GA4 & UTMs
                        </div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">
                          Exercices d'Analyse du Trafic Web
                        </h3>
                      </div>

                      <button
                        onClick={() => setShowGa4Correction(!showGa4Correction)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        {showGa4Correction ? 'Masquer le corrigé GA4' : 'Afficher le corrigé GA4'}
                      </button>
                    </div>

                    <div className="space-y-6">
                      
                      {/* Q1: utm_campaign */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <label className="text-xs font-black text-slate-800 block">
                          1. Dans Google Analytics 4, à quel paramètre UTM d'URL correspond la colonne "Campagne" ?
                        </label>
                        <input 
                          type="text"
                          placeholder="Votre réponse (ex: utm_...)"
                          value={ga4StudentAnswers.utmCampaignParam}
                          onChange={(e) => setGa4StudentAnswers(prev => ({ ...prev, utmCampaignParam: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showGa4Correction && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                            <span className="font-black">Réponse attendue : </span>
                            <span><strong>utm_campaign</strong> (exemple : <code>utm_campaign=convers_retargeting_vidéo_place-aux-artistes</code>). C'est ce paramètre qui donne son nom à la ligne dans le rapport de campagne.</span>
                          </div>
                        )}
                      </div>

                      {/* Q2: utm_source / utm_medium */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <label className="text-xs font-black text-slate-800 block">
                          2. Si une URL contient <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">?utm_source=meta&utm_medium=ads</code>, sous quelle forme exacte GA4 affiche-t-il cette dimension dans la colonne "Source / Support" ?
                        </label>
                        <input 
                          type="text"
                          placeholder="Format d'affichage dans GA4..."
                          value={ga4StudentAnswers.utmSourceMediumFormat}
                          onChange={(e) => setGa4StudentAnswers(prev => ({ ...prev, utmSourceMediumFormat: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showGa4Correction && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                            <span className="font-black">Réponse attendue : </span>
                            <span><strong>meta / ads</strong>. GA4 sépare toujours la source et le support par une barre oblique entourée d'espaces : <code>source / support</code>.</span>
                          </div>
                        )}
                      </div>

                      {/* Q3: Campagne Meta la plus volumineuse */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <label className="text-xs font-black text-slate-800 block">
                          3. D'après le tableau GA4, quelle campagne publicitaire Meta a généré le plus grand nombre de sessions sur le site web ?
                        </label>
                        <input 
                          type="text"
                          placeholder="Nom de la campagne et nombre de sessions..."
                          value={ga4StudentAnswers.bestMetaTrafficCampaign}
                          onChange={(e) => setGa4StudentAnswers(prev => ({ ...prev, bestMetaTrafficCampaign: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showGa4Correction && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                            <span className="font-black">Réponse attendue : </span>
                            <span><strong>convers_retargeting_vidéo_place-aux-artistes</strong> avec <strong>994 sessions</strong> enregistrées sous le support <code>meta / ads</code>.</span>
                          </div>
                        )}
                      </div>

                      {/* Q4: Durée de session Meta vs Google */}
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <label className="text-xs font-black text-slate-800 block">
                          4. Observez la colonne "Durée moyenne de session". Pourquoi celle du trafic Meta (quelques secondes, ex: 0m05s ou 0m03s) est-elle beaucoup plus courte que celle de Google Search (1m24s) ?
                        </label>
                        <textarea 
                          rows={2}
                          placeholder="Votre explication analytique..."
                          value={ga4StudentAnswers.durationAnalysis}
                          onChange={(e) => setGa4StudentAnswers(prev => ({ ...prev, durationAnalysis: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showGa4Correction && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                            <span className="font-black">Réponse attendue : </span>
                            <span>
                              Le trafic Meta Ads est un <strong>trafic d'interruption</strong> (les utilisateurs scrollent leurs réseaux sociaux et cliquent par curiosité ou par réflexe, puis repartent vite). À l'inverse, le trafic Google Search est un <strong>trafic d'intention active</strong> (l'internaute a tapé une requête précise pour trouver un produit ou un service, son niveau d'attention et d'intérêt est donc beaucoup plus élevé).
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Q5: Effet de Halo */}
                      <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
                        <label className="text-xs font-black text-purple-900 block">
                          5. Qu'est-ce que l'Effet de Halo (Halo Effect) et comment explique-t-il la corrélation entre les dépenses Meta et les ventes sur Google Ads / Direct ?
                        </label>
                        <textarea 
                          rows={2}
                          placeholder="Votre explication de l'effet de halo..."
                          value={ga4StudentAnswers.haloEffectExplanation}
                          onChange={(e) => setGa4StudentAnswers(prev => ({ ...prev, haloEffectExplanation: e.target.value }))}
                          className="w-full bg-white border border-purple-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {showGa4Correction && (
                          <div className="p-3 bg-purple-100/80 border border-purple-200 rounded-xl text-xs text-purple-950 space-y-1">
                            <span className="font-black">Réponse attendue : </span>
                            <span>
                              L'exposition publicitaire sur Meta fait connaître la marque. Les internautes qui découvrent le produit ne l'achètent pas forcément immédiatement sur leur téléphone ; plus tard, chez eux, ils ouvrent Google et tapent le nom de la marque, ou tapent directement l'URL. La conversion finale est enregistrée sur <strong>Google Ads (Search Marque)</strong> ou en <strong>Direct</strong> dans GA4, mais c'est bien la publicité Meta qui a amorcé le besoin d'achat !
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* SUB-TAB 3: GOOGLE ADS EXERCISE (ROAS & LEADS)        */}
              {/* ---------------------------------------------------- */}
              {exerciseTab === 'google-ads' && (
                <div className="space-y-8">
                  
                  {/* Google Ads Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">
                          Campagnes Google Ads : Search, Performance Max & Display
                        </h3>
                        <p className="text-xs text-slate-500">
                          Consultez les métriques des 3 campagnes pour répondre aux exercices ci-dessous.
                        </p>
                      </div>

                      <button
                        onClick={() => setShowGoogleAdsCorrection(!showGoogleAdsCorrection)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        {showGoogleAdsCorrection ? 'Masquer la correction' : 'Afficher la correction Google Ads'}
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-slate-100 rounded-xl">
                      <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Campagne</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4 text-right">Dépenses</th>
                            <th className="py-3 px-4 text-right">Impressions</th>
                            <th className="py-3 px-4 text-right">Clics</th>
                            <th className="py-3 px-4 text-right">CTR</th>
                            <th className="py-3 px-4 text-right">CPC</th>
                            <th className="py-3 px-4 text-right">Conversions</th>
                            <th className="py-3 px-4 text-right">Leads</th>
                            <th className="py-3 px-4 text-right font-black text-blue-700">Valeur de conversion</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {googleAdsCampaigns.map(camp => (
                            <tr key={camp.id} className="hover:bg-slate-50">
                              <td className="py-3 px-4 font-bold text-slate-900">{camp.name}</td>
                              <td className="py-3 px-4 text-slate-500">{camp.type}</td>
                              <td className="py-3 px-4 text-right font-bold">{camp.spend}</td>
                              <td className="py-3 px-4 text-right text-slate-600">{camp.impressions}</td>
                              <td className="py-3 px-4 text-right font-bold text-slate-800">{camp.clicks}</td>
                              <td className="py-3 px-4 text-right font-semibold text-slate-600">{camp.ctr}</td>
                              <td className="py-3 px-4 text-right font-semibold">{camp.cpc}</td>
                              <td className="py-3 px-4 text-right font-bold text-purple-700">{camp.conversions}</td>
                              <td className="py-3 px-4 text-right font-bold text-amber-700">{camp.leads}</td>
                              <td className="py-3 px-4 text-right font-black text-emerald-700">{camp.conversionValue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Ex 1: ROAS Search */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-black uppercase text-blue-700 tracking-wider">Exercice 1</span>
                        <span className="text-[10px] font-bold text-slate-400">Sales_Search_Brand_FR</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Calculez le ROAS de la campagne de marque Google Ads Search :
                      </p>
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="ex: 4.27"
                          value={googleAdsStudentAnswers.roasSearch}
                          onChange={(e) => setGoogleAdsStudentAnswers(prev => ({ ...prev, roasSearch: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">ratio</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Données : Valeur = 3 200,00 € | Dépenses = 750,00 €
                      </p>
                      {showGoogleAdsCorrection && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                          <span className="font-black">Réponse attendue : 4,27</span>
                          <p className="text-[10px] text-blue-800">Calcul : 3 200 € / 750 € = 4,27. Chaque euro investi rapporte 4,27 € de chiffre d'affaires.</p>
                        </div>
                      )}
                    </div>

                    {/* Ex 2: CPA Lead PMax */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-black uppercase text-indigo-700 tracking-wider">Exercice 2</span>
                        <span className="text-[10px] font-bold text-slate-400">Lead_Generation_PMax_Wavre</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Calculez le Coût par Lead (CPA) de la campagne Performance Max :
                      </p>
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="ex: 54.55"
                          value={googleAdsStudentAnswers.cpaLeadPMax}
                          onChange={(e) => setGoogleAdsStudentAnswers(prev => ({ ...prev, cpaLeadPMax: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">€ / lead</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Données : Dépenses = 1 200,00 € | Nombre de Leads = 22
                      </p>
                      {showGoogleAdsCorrection && (
                        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1">
                          <span className="font-black">Réponse attendue : 54,55 €</span>
                          <p className="text-[10px] text-indigo-800">Calcul : 1 200 € / 22 leads = 54,55 € par formulaire ou lead qualifié généré.</p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* MODE 2: TABLEAUX & VISUALISATIONS COMPLETS               */}
          {/* ======================================================== */}
          {mainMode === 'data' && (
            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 pb-20">
              
              {/* Header Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Comparatif Dépenses vs Revenus (Meta Ads)
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Analyse globale de la rentabilité des 8 campagnes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-slate-300"></div>
                      <span className="text-slate-500">Dépenses (€)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-600"></div>
                      <span className="text-slate-500">Revenus d'achat (€)</span>
                    </div>
                  </div>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                        tickFormatter={(value) => `${value}€`}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xl space-y-2">
                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{data.fullName}</p>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between gap-8">
                                    <span className="text-[10px] font-bold text-slate-400">Dépenses:</span>
                                    <span className="text-xs font-black text-slate-700">{data.spend.toLocaleString('fr-FR')} €</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-8">
                                    <span className="text-[10px] font-bold text-slate-400">Valeur d'achat:</span>
                                    <span className="text-xs font-black text-blue-600">{data.revenue.toLocaleString('fr-FR')} €</span>
                                  </div>
                                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-8">
                                    <span className="text-[10px] font-bold text-slate-400">ROAS:</span>
                                    <span className={`text-xs font-black ${data.roas >= 1 ? 'text-green-600' : 'text-red-500'}`}>{data.roas.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }} 
                      />
                      <Bar dataKey="spend" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={22} />
                      <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={22}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.revenue >= entry.spend ? '#2563eb' : '#94a3b8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Multi-platform summaries */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Meta Ads Total</span>
                  <div className="text-2xl font-black text-slate-900">675,56 €</div>
                  <div className="text-xs text-slate-500 font-medium">Revenus cumulés : <strong>9 355,00 €</strong></div>
                  <div className="text-xs text-emerald-600 font-bold">ROAS Global : 13,85</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">Google Ads Total</span>
                  <div className="text-2xl font-black text-slate-900">2 400,00 €</div>
                  <div className="text-xs text-slate-500 font-medium">Revenus : 3 550,00 € | Leads : 24</div>
                  <div className="text-xs text-teal-600 font-bold">Search Marque ROAS : 4,27</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">GA4 Web Analytics</span>
                  <div className="text-2xl font-black text-slate-900">6 450 sessions</div>
                  <div className="text-xs text-slate-500 font-medium">Taux d'engagement global : 54,2%</div>
                  <div className="text-xs text-purple-600 font-bold">Conversions web : 118</div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* MODE 3: FICHE DE COURS & MÉMO                            */}
          {/* ======================================================== */}
          {mainMode === 'course' && (
            <div className="p-6 md:p-8">
              <CourseMemo />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
