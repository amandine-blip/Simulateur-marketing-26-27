import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, Send, Eye, MousePointer, Users, BarChart2, CheckCircle2, 
  ArrowLeft, Plus, Trash2, Edit3, Smartphone, Monitor, Download, 
  HelpCircle, Sparkles, ExternalLink, RefreshCw, AlertTriangle, 
  Copy, Layers, ArrowUpRight, Check, ShieldCheck, ChevronRight,
  Sliders, Calendar, Clock, Inbox, CornerDownRight, Heart, Share2,
  FileText, ArrowUp, ArrowDown, Image as ImageIcon, Split, Share,
  Tag, ShoppingBag, X, CheckCircle, Info
} from 'lucide-react';

export interface EmailBlock {
  id: string;
  type: 'header' | 'hero_image' | 'title' | 'text' | 'button' | 'product_card' | 'divider' | 'social' | 'footer';
  content: any;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  audienceName: string;
  segment: string;
  status: 'draft' | 'sending' | 'sent';
  sendDate?: string;
  recipientsCount: number;
  openRate?: number;
  clickRate?: number;
  revenue?: string;
  blocks: EmailBlock[];
}

const DEFAULT_TEMPLATES = {
  promo: [
    {
      id: 'b1',
      type: 'header' as const,
      content: {
        logoText: 'ACADEMY MARKETING',
        logoSubtext: 'FORMATIONS & STRATÉGIE DIGITALE',
        bgColor: '#ffffff'
      }
    },
    {
      id: 'b2',
      type: 'hero_image' as const,
      content: {
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
        altText: 'Bannière Promo Printemps',
        caption: 'Offre spéciale printemps valable 72h'
      }
    },
    {
      id: 'b3',
      type: 'title' as const,
      content: {
        text: '🌸 -30% sur votre prochaine formation digitale',
        alignment: 'center',
        color: '#1e293b',
        size: 'text-2xl'
      }
    },
    {
      id: 'b4',
      type: 'text' as const,
      content: {
        text: 'Bonjour *|FNAME|*,\n\nVous le savez : les algorithmes de Meta et Google évoluent sans cesse. Pour garder une longueur d\'avance et maximiser le ROAS de vos campagnes, notre équipe de formateurs a conçu des cursus 100% pratiques et opérationnels.\n\nProfitez d\'une réduction exceptionnelle de -30% avec le code promo **PRINTEMPS30** ce weekend uniquement.',
        fontSize: '15px',
        color: '#475569',
        alignment: 'left'
      }
    },
    {
      id: 'b5',
      type: 'button' as const,
      content: {
        label: 'Découvrir les programmes et réserver ma place →',
        url: 'https://academy-marketing.be/offres-flash',
        bgColor: '#007C89',
        textColor: '#ffffff',
        alignment: 'center'
      }
    },
    {
      id: 'b6',
      type: 'product_card' as const,
      content: {
        badge: 'BEST-SELLER',
        title: 'Masterclass : Tracking & Google Tag Manager',
        desc: 'Apprenez à installer le dataLayer, le pixel Meta et GA4 sans coder.',
        price: '349 €',
        oldPrice: '499 €',
        cta: 'Voir le programme',
        ctaUrl: 'https://academy-marketing.be/cursus-gtm'
      }
    },
    {
      id: 'b7',
      type: 'social' as const,
      content: {
        links: ['LinkedIn', 'Instagram', 'YouTube', 'Site Web']
      }
    },
    {
      id: 'b8',
      type: 'footer' as const,
      content: {
        company: 'Academy Marketing EFP - Boulevard du Souverain, 1160 Bruxelles',
        reason: 'Vous recevez cet e-mail car vous êtes inscrit à notre newsletter professionnelle.',
        unsubscribeText: 'Se désabonner de cette liste',
        preferencesText: 'Mettre à jour mes préférences de réception'
      }
    }
  ],
  edito: [
    {
      id: 'b1',
      type: 'header' as const,
      content: {
        logoText: 'ACADEMY MARKETING',
        logoSubtext: 'LE MAG MENSUEL DU MARKETING DIGITAL',
        bgColor: '#ffffff'
      }
    },
    {
      id: 'b2',
      type: 'title' as const,
      content: {
        text: 'Les 3 tendances du tracking à maîtriser ce mois-ci',
        alignment: 'left',
        color: '#0f172a',
        size: 'text-2xl'
      }
    },
    {
      id: 'b3',
      type: 'text' as const,
      content: {
        text: 'Bonjour *|FNAME|*,\n\nBienvenue dans cette édition mensuelle. Ce mois-ci, nous décortiquons l\'impact de la fin des cookies tiers, le déploiement du Server-Side GTM et les nouveautés des événements clés dans Google Analytics 4.\n\nBonne lecture à tous !',
        fontSize: '15px',
        color: '#475569',
        alignment: 'left'
      }
    },
    {
      id: 'b4',
      type: 'hero_image' as const,
      content: {
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
        altText: 'Dashboard Analytics',
        caption: 'Visualisation de données et attribution multi-touch'
      }
    },
    {
      id: 'b5',
      type: 'button' as const,
      content: {
        label: 'Lire le dossier complet sur le blog →',
        url: 'https://academy-marketing.be/blog/tracking-tendances',
        bgColor: '#1e293b',
        textColor: '#ffffff',
        alignment: 'center'
      }
    },
    {
      id: 'b6',
      type: 'divider' as const,
      content: {
        color: '#e2e8f0',
        thickness: 1
      }
    },
    {
      id: 'b7',
      type: 'footer' as const,
      content: {
        company: 'Academy Marketing EFP - Boulevard du Souverain, 1160 Bruxelles',
        reason: 'Vous recevez cet e-mail car vous êtes abonné à notre newsletter éditoriale.',
        unsubscribeText: 'Se désabonner',
        preferencesText: 'Préférences'
      }
    }
  ],
  event: [
    {
      id: 'b1',
      type: 'header' as const,
      content: {
        logoText: 'ACADEMY MARKETING',
        logoSubtext: 'WEBINAIRE & ATELIER EN DIRECT',
        bgColor: '#ffffff'
      }
    },
    {
      id: 'b2',
      type: 'title' as const,
      content: {
        text: '🎙️ Webinaire Live : Maîtriser le Pixel Meta en 2024',
        alignment: 'center',
        color: '#1e293b',
        size: 'text-2xl'
      }
    },
    {
      id: 'b3',
      type: 'text' as const,
      content: {
        text: 'Bonjour *|FNAME|*,\n\nRejoignez-nous ce **jeudi à 18h30** pour une session live interactive de 45 minutes.\n\nAu programme :\n• Installer le Pixel Meta avec Google Tag Manager\n• Configurer les Événements de conversion Purchase & Lead\n• Déboguer en direct avec le Meta Pixel Helper et Test Events',
        fontSize: '15px',
        color: '#475569',
        alignment: 'left'
      }
    },
    {
      id: 'b4',
      type: 'button' as const,
      content: {
        label: 'Réserver ma place gratuite au Webinaire (Places limitées)',
        url: 'https://academy-marketing.be/webinaire-meta',
        bgColor: '#2563eb',
        textColor: '#ffffff',
        alignment: 'center'
      }
    },
    {
      id: 'b5',
      type: 'footer' as const,
      content: {
        company: 'Academy Marketing EFP - Boulevard du Souverain, 1160 Bruxelles',
        reason: 'Vous êtes inscrit à nos alertes événements professionnels.',
        unsubscribeText: 'Désinscription',
        preferencesText: 'Gérer mes abonnements'
      }
    }
  ],
  scratch: [
    {
      id: 'b1',
      type: 'header' as const,
      content: {
        logoText: 'VOTRE MARQUE',
        logoSubtext: 'NEWSLETTER OFFICIELLE',
        bgColor: '#ffffff'
      }
    },
    {
      id: 'b2',
      type: 'title' as const,
      content: {
        text: 'Titre de votre annonce',
        alignment: 'left',
        color: '#1e293b',
        size: 'text-2xl'
      }
    },
    {
      id: 'b3',
      type: 'text' as const,
      content: {
        text: 'Rédigez votre message ici. Vous pouvez utiliser la balise *|FNAME|* pour insérer automatiquement le prénom de votre contact.',
        fontSize: '15px',
        color: '#475569',
        alignment: 'left'
      }
    },
    {
      id: 'b4',
      type: 'button' as const,
      content: {
        label: 'Cliquez ici pour en savoir plus',
        url: 'https://votresite.be',
        bgColor: '#007C89',
        textColor: '#ffffff',
        alignment: 'center'
      }
    },
    {
      id: 'b5',
      type: 'footer' as const,
      content: {
        company: 'Votre Entreprise - Adresse postale légale',
        reason: 'Vous recevez cet email car vous êtes inscrit sur notre site.',
        unsubscribeText: 'Se désabonner',
        preferencesText: 'Modifier mes préférences'
      }
    }
  ]
};

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_1',
    name: 'Newsletter Printemps 2024 - Offres Flash',
    subject: '🌸 -30% sur votre prochaine formation digitale (Ce weekend uniquement !)',
    preheader: 'Découvrez notre sélection exclusive et boostez vos compétences webmarketing dès aujourd\'hui...',
    fromName: 'Amandine de l\'Academy Marketing',
    fromEmail: 'newsletter@academy-marketing.be',
    replyTo: 'contact@academy-marketing.be',
    audienceName: 'Abonnés EFP & Pros du Digital (4 850 contacts)',
    segment: 'Abonnés très engagés (4-5 étoiles)',
    status: 'sent',
    sendDate: 'Mardi 19 Mars 2024 à 10:14',
    recipientsCount: 4850,
    openRate: 28.7,
    clickRate: 4.23,
    revenue: '5 235 €',
    blocks: DEFAULT_TEMPLATES.promo
  },
  {
    id: 'camp_2',
    name: 'Webinaire Growth Marketing & GA4',
    subject: 'Replay disponible : Comment configurer vos événements GA4 sans erreurs',
    preheader: 'Accédez à l\'enregistrement vidéo complet et aux fiches techniques partagées par nos experts.',
    fromName: 'Équipe Pédagogique EFP',
    fromEmail: 'webinaire@academy-marketing.be',
    replyTo: 'support@academy-marketing.be',
    audienceName: 'Participants aux Webinaires (2 120 contacts)',
    segment: 'Tous les inscrits',
    status: 'sent',
    sendDate: 'Jeudi 7 Mars 2024 à 14:00',
    recipientsCount: 4720,
    openRate: 32.1,
    clickRate: 5.8,
    revenue: '3 140 €',
    blocks: DEFAULT_TEMPLATES.event
  },
  {
    id: 'camp_3',
    name: 'Brouillon : Campagne Lancement Cursus Meta Ads 2024',
    subject: '🚀 Nouveau cursus immersif : Devenez Media Buyer Meta certifié',
    preheader: 'Les inscriptions anticipées sont ouvertes. Réservez votre place avant tout le monde...',
    fromName: 'Amandine de l\'Academy Marketing',
    fromEmail: 'newsletter@academy-marketing.be',
    replyTo: 'contact@academy-marketing.be',
    audienceName: 'Abonnés EFP & Pros du Digital (4 850 contacts)',
    segment: 'Abonnés récents (< 90 jours)',
    status: 'draft',
    recipientsCount: 4850,
    blocks: DEFAULT_TEMPLATES.promo
  }
];

export default function MailchimpSimulator({ onExit }: { onExit: () => void }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [activeCampaignId, setActiveCampaignId] = useState<string>('camp_3');
  const [activeTab, setActiveTab] = useState<'campaigns' | 'builder' | 'report' | 'audience'>('campaigns');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Modals & Tools
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignSubject, setNewCampaignSubject] = useState('');
  const [newCampaignTemplate, setNewCampaignTemplate] = useState<'promo' | 'edito' | 'event' | 'scratch'>('promo');
  const [newCampaignAudience, setNewCampaignAudience] = useState('Abonnés EFP & Pros du Digital (4 850 contacts)');

  const [showSendModal, setShowSendModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('etudiant@academy-marketing.be');
  const [isTestEmailSent, setIsTestEmailSent] = useState(false);
  const [autoUtmTracking, setAutoUtmTracking] = useState(true);

  // Active Campaign
  const currentCampaign = campaigns.find(c => c.id === activeCampaignId) || campaigns[0];
  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    currentCampaign.blocks.length > 2 ? currentCampaign.blocks[2].id : currentCampaign.blocks[0].id
  );

  // Update current campaign settings
  const handleUpdateCampaignSetting = (field: keyof Campaign, val: any) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === currentCampaign.id) {
        return { ...c, [field]: val };
      }
      return c;
    }));
  };

  // Block management
  const selectedBlock = currentCampaign.blocks.find(b => b.id === selectedBlockId);

  const handleUpdateBlockContent = (field: string, val: any) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === currentCampaign.id) {
        const updatedBlocks = c.blocks.map(b => {
          if (b.id === selectedBlockId) {
            return { ...b, content: { ...b.content, [field]: val } };
          }
          return b;
        });
        return { ...c, blocks: updatedBlocks };
      }
      return c;
    }));
  };

  const handleAddBlock = (type: EmailBlock['type']) => {
    const newId = 'block_' + Date.now();
    let newBlock: EmailBlock;

    switch (type) {
      case 'title':
        newBlock = {
          id: newId,
          type: 'title',
          content: {
            text: 'Nouveau titre accrocheur',
            alignment: 'left',
            color: '#1e293b',
            size: 'text-2xl'
          }
        };
        break;
      case 'text':
        newBlock = {
          id: newId,
          type: 'text',
          content: {
            text: 'Insérez ici votre paragraphe de contenu. Vous pouvez personnaliser le texte et insérer les balises *|FNAME|* pour personnaliser.',
            fontSize: '15px',
            color: '#475569',
            alignment: 'left'
          }
        };
        break;
      case 'button':
        newBlock = {
          id: newId,
          type: 'button',
          content: {
            label: 'Cliquez ici pour continuer →',
            url: 'https://academy-marketing.be/offre',
            bgColor: '#007C89',
            textColor: '#ffffff',
            alignment: 'center'
          }
        };
        break;
      case 'hero_image':
        newBlock = {
          id: newId,
          type: 'hero_image',
          content: {
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
            altText: 'Illustration marketing',
            caption: 'Visuel de présentation'
          }
        };
        break;
      case 'product_card':
        newBlock = {
          id: newId,
          type: 'product_card',
          content: {
            badge: 'OFFRE LIMITÉE',
            title: 'Nouvelle Formation Spécialisée',
            desc: 'Module pratique avec certification reconnue.',
            price: '299 €',
            oldPrice: '450 €',
            cta: 'Profiter de l\'offre',
            ctaUrl: 'https://academy-marketing.be/formation'
          }
        };
        break;
      case 'divider':
        newBlock = {
          id: newId,
          type: 'divider',
          content: {
            color: '#e2e8f0',
            thickness: 1
          }
        };
        break;
      case 'social':
        newBlock = {
          id: newId,
          type: 'social',
          content: {
            links: ['LinkedIn', 'Instagram', 'YouTube', 'Site Web']
          }
        };
        break;
      default:
        newBlock = {
          id: newId,
          type: 'text',
          content: { text: 'Nouveau bloc', fontSize: '15px', color: '#333333', alignment: 'left' }
        };
    }

    setCampaigns(prev => prev.map(c => {
      if (c.id === currentCampaign.id) {
        // Insert right before the footer if footer exists, else append
        const footerIndex = c.blocks.findIndex(b => b.type === 'footer');
        let newBlocksList: EmailBlock[];
        if (footerIndex !== -1) {
          newBlocksList = [
            ...c.blocks.slice(0, footerIndex),
            newBlock,
            ...c.blocks.slice(footerIndex)
          ];
        } else {
          newBlocksList = [...c.blocks, newBlock];
        }
        return { ...c, blocks: newBlocksList };
      }
      return c;
    }));

    setSelectedBlockId(newId);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (currentCampaign.blocks.length <= 2) {
      alert('Une newsletter doit contenir au minimum un contenu et un pied de page légal.');
      return;
    }
    setCampaigns(prev => prev.map(c => {
      if (c.id === currentCampaign.id) {
        const filtered = c.blocks.filter(b => b.id !== blockId);
        return { ...c, blocks: filtered };
      }
      return c;
    }));
    // Select first remaining block
    const remaining = currentCampaign.blocks.filter(b => b.id !== blockId);
    if (remaining.length > 0) {
      setSelectedBlockId(remaining[0].id);
    }
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blocks = [...currentCampaign.blocks];
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = blocks[index];
      blocks[index] = blocks[index - 1];
      blocks[index - 1] = temp;
    } else if (direction === 'down' && index < blocks.length - 1) {
      const temp = blocks[index];
      blocks[index] = blocks[index + 1];
      blocks[index + 1] = temp;
    }

    setCampaigns(prev => prev.map(c => {
      if (c.id === currentCampaign.id) {
        return { ...c, blocks };
      }
      return c;
    }));
  };

  const handleDuplicateBlock = (blockId: string) => {
    const blockToDup = currentCampaign.blocks.find(b => b.id === blockId);
    if (!blockToDup) return;
    const duplicated: EmailBlock = {
      id: 'block_' + Date.now(),
      type: blockToDup.type,
      content: JSON.parse(JSON.stringify(blockToDup.content))
    };

    const index = currentCampaign.blocks.findIndex(b => b.id === blockId);
    const newBlocks = [
      ...currentCampaign.blocks.slice(0, index + 1),
      duplicated,
      ...currentCampaign.blocks.slice(index + 1)
    ];

    setCampaigns(prev => prev.map(c => {
      if (c.id === currentCampaign.id) {
        return { ...c, blocks: newBlocks };
      }
      return c;
    }));

    setSelectedBlockId(duplicated.id);
  };

  // Create brand new campaign
  const handleConfirmCreateCampaign = () => {
    if (!newCampaignName.trim()) {
      alert('Veuillez saisir un nom pour votre nouvelle campagne.');
      return;
    }

    const templateBlocks = DEFAULT_TEMPLATES[newCampaignTemplate] || DEFAULT_TEMPLATES.promo;
    const newCamp: Campaign = {
      id: 'camp_' + Date.now(),
      name: newCampaignName.trim(),
      subject: newCampaignSubject.trim() || '🚀 Votre newsletter exclusive',
      preheader: 'Découvrez notre actualité et nos offres réservées aux abonnés...',
      fromName: 'Amandine de l\'Academy Marketing',
      fromEmail: 'newsletter@academy-marketing.be',
      replyTo: 'contact@academy-marketing.be',
      audienceName: newCampaignAudience,
      segment: 'Tous les abonnés actifs',
      status: 'draft',
      recipientsCount: 4850,
      blocks: JSON.parse(JSON.stringify(templateBlocks))
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setActiveCampaignId(newCamp.id);
    setShowNewCampaignModal(false);
    setActiveTab('builder');
    setSelectedBlockId(newCamp.blocks[1] ? newCamp.blocks[1].id : newCamp.blocks[0].id);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Send Final Campaign
  const handleSendCampaign = () => {
    setShowSendModal(false);
    setCampaigns(prev => prev.map(c => {
      if (c.id === currentCampaign.id) {
        return {
          ...c,
          status: 'sent',
          sendDate: 'À l\'instant (Aujourd\'hui)',
          openRate: Number((24 + Math.random() * 8).toFixed(1)),
          clickRate: Number((3.5 + Math.random() * 2.5).toFixed(1)),
          revenue: (Math.floor(2500 + Math.random() * 3500)) + ' €'
        };
      }
      return c;
    }));

    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFE01B', '#007C89', '#241C15', '#10B981']
    });

    setActiveTab('report');
  };

  // Send Test Email
  const handleSendTestEmail = () => {
    setShowTestModal(false);
    setIsTestEmailSent(true);
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.7 }
    });
    setTimeout(() => setIsTestEmailSent(false), 5000);
  };

  // Helper for UTM in links
  const getUtmFormattedUrl = (baseUrl: string) => {
    if (!baseUrl) return '';
    if (!autoUtmTracking) return baseUrl;
    const cleanUrl = baseUrl.split('?')[0];
    const utmCampaign = currentCampaign.name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
    return `${cleanUrl}?utm_source=mailchimp&utm_medium=email&utm_campaign=${utmCampaign}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#F6F6F4] font-sans text-slate-800 overflow-hidden select-none">
      {/* Top Mailchimp Characteristic Header */}
      <header className="h-16 bg-[#241C15] text-white flex items-center justify-between px-6 shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold"
            title="Retour au portail Academy"
          >
            <ArrowLeft size={16} /> Hub Academy
          </button>
          <div className="h-5 w-[1px] bg-slate-700"></div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFE01B] text-[#241C15] flex items-center justify-center font-black text-sm shadow-sm">
              🐵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-[#FFE01B]">Mailchimp</span>
                <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded font-mono">SIMULATEUR PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Academy Marketing • {currentCampaign.audienceName}</p>
            </div>
          </div>
        </div>

        {/* Center Tabs Navigation */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'campaigns' ? 'bg-[#FFE01B] text-[#241C15] shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Inbox size={14} /> Campagnes ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'builder' ? 'bg-[#FFE01B] text-[#241C15] shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 size={14} /> Éditeur Email
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'report' ? 'bg-[#FFE01B] text-[#241C15] shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart2 size={14} /> Statistiques & Rapports
          </button>
          <button
            onClick={() => setActiveTab('audience')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'audience' ? 'bg-[#FFE01B] text-[#241C15] shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users size={14} /> Audience (4 850)
          </button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {activeTab === 'campaigns' && (
            <button
              onClick={() => {
                setNewCampaignName('Newsletter ' + new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
                setNewCampaignSubject('Découvrez nos dernières actualités et conseils');
                setShowNewCampaignModal(true);
              }}
              className="px-4 py-1.5 bg-[#007C89] hover:bg-[#006570] text-white rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Plus size={15} /> Nouvelle campagne
            </button>
          )}

          {activeTab === 'builder' && (
            <>
              <button 
                onClick={() => setShowTestModal(true)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors border border-slate-700 flex items-center gap-1.5"
              >
                <Send size={13} /> Envoyer un test
              </button>
              <button
                onClick={() => setShowSendModal(true)}
                className="px-4 py-1.5 bg-[#007C89] hover:bg-[#006570] text-white rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <Send size={14} /> Envoyer la newsletter
              </button>
            </>
          )}

          {activeTab === 'report' && (
            <button
              onClick={() => {
                confetti({ particleCount: 80, spread: 60 });
                alert('Export du rapport Mailchimp prêt au téléchargement (Format PDF Agence).');
              }}
              className="px-3.5 py-1.5 bg-[#007C89] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#006570] transition-colors"
            >
              <Download size={14} /> Télécharger le rapport (PDF)
            </button>
          )}
        </div>
      </header>

      {/* Test Email Sent Toast */}
      {isTestEmailSent && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top">
          <CheckCircle2 size={16} /> E-mail de test envoyé avec succès à {testEmailAddress} ! Score antispam : 10/10 (Boîte principale).
        </div>
      )}

      {/* TAB 1 : LIST OF CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Toutes les Campagnes d'E-mailing</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Gérez vos envois réguliers, campagnes promotionnelles et newsletters automatisées.</p>
            </div>
            <button
              onClick={() => {
                setNewCampaignName('Newsletter ' + new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
                setNewCampaignSubject('Découvrez nos dernières actualités et conseils');
                setShowNewCampaignModal(true);
              }}
              className="px-4 py-2.5 bg-[#007C89] hover:bg-[#006570] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus size={16} /> Créer une nouvelle campagne
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Total campagnes :</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">{campaigns.length}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Cliquez sur « Éditer » pour personnaliser le contenu ou « Voir le rapport »</span>
            </div>

            <div className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <div key={camp.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      camp.status === 'sent' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {camp.status === 'sent' ? <CheckCircle2 size={20} /> : <Edit3 size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{camp.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          camp.status === 'sent' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {camp.status === 'sent' ? 'Envoyé' : 'Brouillon'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Objet : <span className="font-medium text-slate-700">{camp.subject}</span>
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
                        <span>{camp.sendDate || 'Créé récemment'}</span>
                        <span>•</span>
                        <span>{camp.audienceName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {camp.status === 'sent' && (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-black text-slate-900">{camp.openRate || 28.7}%</div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ouvertures</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-black text-slate-900">{camp.clickRate || 4.2}%</div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Clics</div>
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-2">
                      {camp.status === 'sent' && (
                        <button 
                          onClick={() => {
                            setActiveCampaignId(camp.id);
                            setActiveTab('report');
                          }}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                        >
                          Voir le rapport
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setActiveCampaignId(camp.id);
                          setActiveTab('builder');
                          setSelectedBlockId(camp.blocks[0] ? camp.blocks[0].id : '');
                        }}
                        className="px-3.5 py-1.5 bg-[#007C89] hover:bg-[#006570] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Edit3 size={13} />
                        <span>Éditer contenu</span>
                      </button>
                      {camp.status === 'draft' && (
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer le brouillon « ${camp.name} » ?`)) {
                              setCampaigns(prev => prev.filter(c => c.id !== camp.id));
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Supprimer ce brouillon"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 : EMAIL BUILDER & LAYOUT DESIGN */}
      {activeTab === 'builder' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Campaign Meta & Block Settings */}
          <aside className="w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campagne active</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentCampaign.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {currentCampaign.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-900 mt-1">{currentCampaign.name}</h2>
            </div>

            {/* Campaign Meta Inputs */}
            <div className="p-4 space-y-3.5 border-b border-slate-100">
              {/* Campaign Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nom interne de la campagne</label>
                <input
                  type="text"
                  value={currentCampaign.name}
                  onChange={(e) => handleUpdateCampaignSetting('name', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Subject line */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Objet de l'e-mail (Subject)</label>
                  <span className={`text-[10px] font-bold ${currentCampaign.subject.length > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {currentCampaign.subject.length}/60 car. (Optimal)
                  </span>
                </div>
                <input
                  type="text"
                  value={currentCampaign.subject}
                  onChange={(e) => handleUpdateCampaignSetting('subject', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-500" /> Les emojis et offres temporelles augmentent le taux d'ouverture de +18%.
                </p>
              </div>

              {/* Preheader */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Texte d'aperçu (Preheader)</label>
                <input
                  type="text"
                  value={currentCampaign.preheader}
                  onChange={(e) => handleUpdateCampaignSetting('preheader', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Visible à côté de l'objet dans la boîte de réception Gmail/Outlook.</p>
              </div>

              {/* Sender info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Nom d'expéditeur</label>
                  <input
                    type="text"
                    value={currentCampaign.fromName}
                    onChange={(e) => handleUpdateCampaignSetting('fromName', e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email d'envoi</label>
                  <input
                    type="email"
                    value={currentCampaign.fromEmail}
                    onChange={(e) => handleUpdateCampaignSetting('fromEmail', e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* UTM tracking toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-teal-600" />
                  <span className="text-xs font-bold text-slate-700">Tagging UTM GA4 automatique</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoUtmTracking}
                  onChange={(e) => setAutoUtmTracking(e.target.checked)}
                  className="h-4 w-4 text-teal-600 rounded border-slate-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Block Editor Section */}
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Éditeur de bloc sélectionné</span>
                {selectedBlock && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveBlock(selectedBlock.id, 'up')}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                      title="Monter le bloc"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMoveBlock(selectedBlock.id, 'down')}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                      title="Descendre le bloc"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => handleDuplicateBlock(selectedBlock.id)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                      title="Dupliquer ce bloc"
                    >
                      <Copy size={13} />
                    </button>
                    {selectedBlock.type !== 'header' && selectedBlock.type !== 'footer' && (
                      <button
                        onClick={() => handleDeleteBlock(selectedBlock.id)}
                        className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
                        title="Supprimer le bloc"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {selectedBlock ? (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wide">
                      Type de bloc : {selectedBlock.type}
                    </span>
                  </div>

                  {/* Header editor */}
                  {selectedBlock.type === 'header' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Nom de la marque / Logo</label>
                        <input
                          type="text"
                          value={selectedBlock.content.logoText || ''}
                          onChange={(e) => handleUpdateBlockContent('logoText', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Sous-titre / Baseline</label>
                        <input
                          type="text"
                          value={selectedBlock.content.logoSubtext || ''}
                          onChange={(e) => handleUpdateBlockContent('logoSubtext', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white text-[11px]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Title editor */}
                  {selectedBlock.type === 'title' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Texte du titre</label>
                        <input
                          type="text"
                          value={selectedBlock.content.text}
                          onChange={(e) => handleUpdateBlockContent('text', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Alignement</label>
                          <select
                            value={selectedBlock.content.alignment || 'center'}
                            onChange={(e) => handleUpdateBlockContent('alignment', e.target.value)}
                            className="w-full text-xs p-2 border border-slate-200 rounded bg-white"
                          >
                            <option value="left">Gauche</option>
                            <option value="center">Centré</option>
                            <option value="right">Droite</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Couleur</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedBlock.content.color || '#1e293b'}
                              onChange={(e) => handleUpdateBlockContent('color', e.target.value)}
                              className="w-7 h-7 rounded border border-slate-300 cursor-pointer"
                            />
                            <span className="text-[10px] font-mono">{selectedBlock.content.color || '#1e293b'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text editor */}
                  {selectedBlock.type === 'text' && (
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-slate-700">Contenu texte</label>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateBlockContent('text', selectedBlock.content.text + ' *|FNAME|*')}
                              className="px-1.5 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[9px] font-mono font-bold"
                              title="Insérer le prénom du destinataire"
                            >
                              + *|FNAME|*
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateBlockContent('text', selectedBlock.content.text + ' **PRINTEMPS30**')}
                              className="px-1.5 py-0.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[9px] font-mono font-bold"
                            >
                              + Code Promo
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={6}
                          value={selectedBlock.content.text}
                          onChange={(e) => handleUpdateBlockContent('text', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white font-sans leading-relaxed"
                        />
                        <span className="text-[10px] text-slate-400 block mt-1">Astuce : `*|FNAME|*` est automatiquement personnalisé par Mailchimp.</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Taille texte</label>
                          <select
                            value={selectedBlock.content.fontSize || '15px'}
                            onChange={(e) => handleUpdateBlockContent('fontSize', e.target.value)}
                            className="w-full text-xs p-2 border border-slate-200 rounded bg-white"
                          >
                            <option value="14px">14px (Compact)</option>
                            <option value="15px">15px (Standard)</option>
                            <option value="16px">16px (Grand)</option>
                            <option value="18px">18px (Lecture confort)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Alignement</label>
                          <select
                            value={selectedBlock.content.alignment || 'left'}
                            onChange={(e) => handleUpdateBlockContent('alignment', e.target.value)}
                            className="w-full text-xs p-2 border border-slate-200 rounded bg-white"
                          >
                            <option value="left">Gauche</option>
                            <option value="center">Centré</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Button editor */}
                  {selectedBlock.type === 'button' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Libellé du CTA</label>
                        <input
                          type="text"
                          value={selectedBlock.content.label}
                          onChange={(e) => handleUpdateBlockContent('label', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">URL de redirection</label>
                        <input
                          type="text"
                          value={selectedBlock.content.url}
                          onChange={(e) => handleUpdateBlockContent('url', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white text-[11px] font-mono"
                        />
                        {autoUtmTracking && (
                          <span className="text-[9px] text-teal-700 block mt-1 font-mono truncate">
                            Tag GA4 : {getUtmFormattedUrl(selectedBlock.content.url)}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Couleur bouton</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedBlock.content.bgColor}
                              onChange={(e) => handleUpdateBlockContent('bgColor', e.target.value)}
                              className="w-7 h-7 rounded border border-slate-300 cursor-pointer"
                            />
                            <span className="text-[10px] font-mono">{selectedBlock.content.bgColor}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Alignement</label>
                          <select
                            value={selectedBlock.content.alignment || 'center'}
                            onChange={(e) => handleUpdateBlockContent('alignment', e.target.value)}
                            className="w-full text-xs p-2 border border-slate-200 rounded bg-white"
                          >
                            <option value="left">Gauche</option>
                            <option value="center">Centré</option>
                            <option value="right">Droite</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image editor */}
                  {selectedBlock.type === 'hero_image' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">URL de l'image</label>
                        <input
                          type="text"
                          value={selectedBlock.content.imageUrl}
                          onChange={(e) => handleUpdateBlockContent('imageUrl', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white text-[11px]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block mb-1">Images prédéfinies rapides :</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateBlockContent('imageUrl', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80')}
                            className="text-[10px] p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-left truncate"
                          >
                            📈 Dashboard Data
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBlockContent('imageUrl', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80')}
                            className="text-[10px] p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 text-left truncate"
                          >
                            👥 Équipe Marketing
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Légende (Caption)</label>
                        <input
                          type="text"
                          value={selectedBlock.content.caption || ''}
                          onChange={(e) => handleUpdateBlockContent('caption', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Product card editor */}
                  {selectedBlock.type === 'product_card' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Badge promo</label>
                        <input
                          type="text"
                          value={selectedBlock.content.badge || 'PROMO'}
                          onChange={(e) => handleUpdateBlockContent('badge', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white font-bold text-teal-800"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Titre de la formation / Produit</label>
                        <input
                          type="text"
                          value={selectedBlock.content.title}
                          onChange={(e) => handleUpdateBlockContent('title', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Prix promo</label>
                          <input
                            type="text"
                            value={selectedBlock.content.price}
                            onChange={(e) => handleUpdateBlockContent('price', e.target.value)}
                            className="w-full text-xs p-2 border border-slate-200 rounded bg-white font-bold text-teal-700"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Prix barré</label>
                          <input
                            type="text"
                            value={selectedBlock.content.oldPrice}
                            onChange={(e) => handleUpdateBlockContent('oldPrice', e.target.value)}
                            className="w-full text-xs p-2 border border-slate-200 rounded bg-white line-through text-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Divider editor */}
                  {selectedBlock.type === 'divider' && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Couleur du trait</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedBlock.content.color || '#e2e8f0'}
                          onChange={(e) => handleUpdateBlockContent('color', e.target.value)}
                          className="w-7 h-7 rounded border border-slate-300 cursor-pointer"
                        />
                        <span className="text-[10px] font-mono">{selectedBlock.content.color || '#e2e8f0'}</span>
                      </div>
                    </div>
                  )}

                  {/* Footer editor */}
                  {selectedBlock.type === 'footer' && (
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Nom entreprise & adresse légale</label>
                        <input
                          type="text"
                          value={selectedBlock.content.company || ''}
                          onChange={(e) => handleUpdateBlockContent('company', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Raison de l'envoi (RGPD)</label>
                        <input
                          type="text"
                          value={selectedBlock.content.reason || ''}
                          onChange={(e) => handleUpdateBlockContent('reason', e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded bg-white text-[11px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 mb-4">
                  Cliquez sur un bloc dans l'aperçu de droite pour le sélectionner et le modifier.
                </div>
              )}

              {/* Add Block Options */}
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ajouter un bloc modulaire</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAddBlock('text')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center gap-1 shadow-xs"
                >
                  <FileText size={16} className="text-blue-600" />
                  <span>Texte</span>
                </button>
                <button
                  onClick={() => handleAddBlock('title')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center gap-1 shadow-xs"
                >
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Titre H2</span>
                </button>
                <button
                  onClick={() => handleAddBlock('button')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center gap-1 shadow-xs"
                >
                  <MousePointer size={16} className="text-teal-600" />
                  <span>Bouton CTA</span>
                </button>
                <button
                  onClick={() => handleAddBlock('hero_image')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center gap-1 shadow-xs"
                >
                  <ImageIcon size={16} className="text-purple-600" />
                  <span>Image</span>
                </button>
                <button
                  onClick={() => handleAddBlock('product_card')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center gap-1 shadow-xs"
                >
                  <ShoppingBag size={16} className="text-emerald-600" />
                  <span>Produit</span>
                </button>
                <button
                  onClick={() => handleAddBlock('divider')}
                  className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center gap-1 shadow-xs"
                >
                  <Split size={16} className="text-slate-400" />
                  <span>Séparateur</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Center / Right: Live Realistic Email Canvas Preview */}
          <main className="flex-1 bg-[#EBEBE8] p-6 overflow-y-auto flex flex-col items-center justify-start">
            {/* Device Switcher Toolbar */}
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-slate-500">Aperçu en boîte de réception :</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Monitor size={14} /> Ordinateur (Desktop)
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone size={14} /> Mobile (iPhone Mail)
                </button>
              </div>
              <div className="h-4 w-[1px] bg-slate-200"></div>
              <span className="text-[11px] text-slate-400">Cliquez sur un bloc pour l'éditer en direct</span>
            </div>

            {/* Simulated Email Envelope Box */}
            <div 
              className={`bg-white rounded-2xl shadow-xl border border-slate-300 transition-all duration-300 overflow-hidden flex flex-col ${
                previewDevice === 'mobile' ? 'max-w-[390px] w-full' : 'max-w-[620px] w-full'
              }`}
            >
              {/* Inbox Header Simulation */}
              <div className="bg-slate-100/90 border-b border-slate-200 p-3.5 text-xs text-slate-600">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900">{currentCampaign.fromName}</span>
                  <span className="text-[10px] text-slate-400">10:14 (Aujourd'hui)</span>
                </div>
                <div className="font-bold text-slate-800 text-sm mb-0.5 truncate">{currentCampaign.subject}</div>
                <div className="text-[11px] text-slate-400 truncate">À: alexandre.dupont@client.be • {currentCampaign.preheader}</div>
              </div>

              {/* Rendered Email Body Canvas */}
              <div className="divide-y divide-transparent bg-white p-6 space-y-5">
                {currentCampaign.blocks.map((block) => (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`cursor-pointer transition-all rounded-lg p-2 relative group ${
                      selectedBlockId === block.id 
                        ? 'ring-2 ring-teal-500 ring-offset-2 bg-teal-50/20' 
                        : 'hover:outline-dashed hover:outline-1 hover:outline-teal-400'
                    }`}
                  >
                    {/* Header Block */}
                    {block.type === 'header' && (
                      <div className="text-center py-2 border-b border-slate-100">
                        <div className="font-black text-xl tracking-tighter text-[#007C89]">
                          {block.content.logoText}
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          {block.content.logoSubtext}
                        </div>
                      </div>
                    )}

                    {/* Hero Image */}
                    {block.type === 'hero_image' && (
                      <div className="rounded-xl overflow-hidden shadow-sm">
                        <img 
                          src={block.content.imageUrl} 
                          alt={block.content.altText || 'Bannière'} 
                          className="w-full h-44 object-cover"
                        />
                        {block.content.caption && (
                          <div className="text-center text-[10px] text-slate-400 py-1 bg-slate-50">
                            {block.content.caption}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    {block.type === 'title' && (
                      <h2 
                        className={`font-extrabold text-slate-900 leading-tight ${block.content.size || 'text-xl'}`}
                        style={{ textAlign: block.content.alignment, color: block.content.color }}
                      >
                        {block.content.text}
                      </h2>
                    )}

                    {/* Text block */}
                    {block.type === 'text' && (
                      <div 
                        className="text-slate-600 text-sm leading-relaxed whitespace-pre-line"
                        style={{ 
                          fontSize: block.content.fontSize,
                          textAlign: block.content.alignment || 'left'
                        }}
                      >
                        {block.content.text.replace('*|FNAME|*', 'Alexandre')}
                      </div>
                    )}

                    {/* Button CTA */}
                    {block.type === 'button' && (
                      <div style={{ textAlign: block.content.alignment }} className="py-2">
                        <a
                          href="#simulate-click"
                          onClick={(e) => { 
                            e.preventDefault(); 
                            alert(`Lien CTA cliqué !\nURL avec UTM : ${getUtmFormattedUrl(block.content.url)}`); 
                          }}
                          className="inline-block px-6 py-3.5 rounded-xl font-extrabold text-xs tracking-wide shadow-md transition-transform hover:scale-105"
                          style={{ backgroundColor: block.content.bgColor, color: block.content.textColor }}
                        >
                          {block.content.label}
                        </a>
                      </div>
                    )}

                    {/* Product highlight */}
                    {block.type === 'product_card' && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div>
                          <span className="bg-teal-100 text-teal-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            {block.content.badge || 'PROMO'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{block.content.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{block.content.desc}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-teal-700">{block.content.price}</div>
                          {block.content.oldPrice && (
                            <div className="text-xs text-slate-400 line-through">{block.content.oldPrice}</div>
                          )}
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Lien produit : ${getUtmFormattedUrl(block.content.ctaUrl || 'https://academy-marketing.be')}`);
                            }}
                            className="mt-1 px-3 py-1 bg-slate-900 text-white rounded text-[11px] font-bold"
                          >
                            {block.content.cta || 'Voir'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Divider */}
                    {block.type === 'divider' && (
                      <div className="py-2">
                        <hr style={{ borderColor: block.content.color || '#e2e8f0' }} />
                      </div>
                    )}

                    {/* Social links */}
                    {block.type === 'social' && (
                      <div className="flex items-center justify-center gap-4 py-2 border-t border-slate-100">
                        {block.content.links.map((link: string, idx: number) => (
                          <span key={idx} className="text-xs font-bold text-teal-700 hover:underline">
                            {link}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer RGPD */}
                    {block.type === 'footer' && (
                      <div className="text-center text-[10px] text-slate-400 space-y-1.5 pt-4 border-t border-slate-100 leading-relaxed">
                        <p>{block.content.company}</p>
                        <p>{block.content.reason}</p>
                        <div className="flex items-center justify-center gap-3 text-slate-500 font-bold underline">
                          <a href="#unsub">{block.content.unsubscribeText}</a>
                          <span>•</span>
                          <a href="#pref">{block.content.preferencesText}</a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}

      {/* TAB 3 : MAILCHIMP CAMPAIGN REPORT & ANALYTICS */}
      {activeTab === 'report' && (
        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Report Header */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] uppercase">Rapport de campagne officiel</span>
                <span className="text-xs text-slate-400">• Envoyé : {currentCampaign.sendDate || 'Récemment'}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{currentCampaign.name}</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Liste : <span className="font-bold text-slate-700">{currentCampaign.audienceName}</span> • Expéditeur : <span className="font-bold text-slate-700">{currentCampaign.fromEmail}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-500">Chiffre d'Affaires généré</div>
                <div className="text-2xl font-black text-emerald-600">{currentCampaign.revenue || '5 235 €'}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                💰
              </div>
            </div>
          </div>

          {/* Key Metrics Benchmark Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Open Rate */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Taux d'ouverture</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">+7.4% vs secteur</span>
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tight">{currentCampaign.openRate || 28.7}%</div>
              <p className="text-xs font-bold text-slate-500 mt-1">
                {Math.round((currentCampaign.recipientsCount || 4850) * ((currentCampaign.openRate || 28.7) / 100))} ouvertures uniques
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Moyenne secteur (Formation) :</span>
                <span className="font-bold text-slate-700">21.3%</span>
              </div>
            </div>

            {/* Click Rate */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Taux de clic</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">+1.6% vs secteur</span>
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tight">{currentCampaign.clickRate || 4.23}%</div>
              <p className="text-xs font-bold text-slate-500 mt-1">
                {Math.round((currentCampaign.recipientsCount || 4850) * ((currentCampaign.clickRate || 4.23) / 100))} clics uniques
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Moyenne secteur :</span>
                <span className="font-bold text-slate-700">2.62%</span>
              </div>
            </div>

            {/* CTOR / Click to Open */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Taux de réactivité (CTOR)</span>
                <span className="text-[10px] font-bold text-blue-600">Clics / Ouverts</span>
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tight">14.7%</div>
              <p className="text-xs font-bold text-slate-500 mt-1">Ratio d'intérêt réel pour le contenu</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Santé du contenu :</span>
                <span className="font-bold text-emerald-600">Excellente</span>
              </div>
            </div>

            {/* Deliverability & Unsubs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Délivrabilité</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">99.4%</span>
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tight">4 822</div>
              <p className="text-xs font-bold text-slate-500 mt-1">e-mails arrivés à destination</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Désinscriptions :</span>
                <span className="font-bold text-slate-600">6 (0.12%)</span>
              </div>
            </div>
          </div>

          {/* 24-Hour Activity Graph & Click Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 24h Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Activité heure par heure après l'envoi</h3>
                  <p className="text-xs text-slate-400 font-medium">Pic d'ouverture observé entre 10h et 12h (matin en semaine)</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#007C89]"></span>
                    <span className="font-bold text-slate-600">Ouvertures</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FFE01B]"></span>
                    <span className="font-bold text-slate-600">Clics</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Representation */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-slate-200">
                {[
                  { hour: '10h', opens: 280, clicks: 42 },
                  { hour: '11h', opens: 390, clicks: 58 },
                  { hour: '12h', opens: 210, clicks: 31 },
                  { hour: '13h', opens: 140, clicks: 19 },
                  { hour: '14h', opens: 95, clicks: 12 },
                  { hour: '15h', opens: 75, clicks: 8 },
                  { hour: '16h', opens: 60, clicks: 7 },
                  { hour: '17h', opens: 45, clicks: 6 },
                  { hour: '18h', opens: 52, clicks: 9 },
                  { hour: '19h', opens: 40, clicks: 12 }
                ].map((item, i) => {
                  const maxOpens = 400;
                  const openHeight = (item.opens / maxOpens) * 100;
                  const clickHeight = (item.clicks / 70) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] p-1.5 rounded font-mono pointer-events-none whitespace-nowrap z-20 shadow-lg">
                        {item.opens} ouv. | {item.clicks} clics
                      </div>
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div 
                          className="w-3/5 bg-[#007C89] rounded-t-sm transition-all group-hover:brightness-110" 
                          style={{ height: `${openHeight}%` }}
                        ></div>
                        <div 
                          className="w-2/5 bg-[#FFE01B] rounded-t-sm transition-all group-hover:brightness-110" 
                          style={{ height: `${clickHeight * 0.4}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-2">{item.hour}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Devices & Clients */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base mb-4">Répartition Appareils & Clients</h3>
                
                {/* Devices */}
                <div className="space-y-3 mb-6">
                  {[
                    { name: 'Mobile (iPhone / Android)', pct: 64, color: 'bg-teal-600' },
                    { name: 'Ordinateur (Desktop)', pct: 33, color: 'bg-blue-600' },
                    { name: 'Tablette', pct: 3, color: 'bg-amber-500' }
                  ].map((d, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>{d.name}</span>
                        <span>{d.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${d.color}`} style={{ width: `${d.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Email Clients */}
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2">Clients de messagerie</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Apple Mail / iOS', pct: 47 },
                    { name: 'Gmail', pct: 35 },
                    { name: 'Outlook / Office 365', pct: 13 },
                    { name: 'Yahoo / Autres', pct: 5 }
                  ].map((c, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span className="font-medium">{c.name}</span>
                      <span className="font-bold text-slate-900">{c.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 mt-4">
                <strong>Conseil consultant :</strong> Plus de 64% des lectures se font sur smartphone. Veillez à ce que vos boutons CTA dépassent au moins 44px de hauteur.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4 : AUDIENCE & CONTACTS */}
      {activeTab === 'audience' && (
        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audience : Abonnés EFP & Pros du Digital</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">4 850 contacts abonnés actifs conformes RGPD avec opt-in confirmé.</p>
            </div>
            <button
              onClick={() => {
                alert('Ajout de contacts simulé. Format CSV importé.');
              }}
              className="px-4 py-2 bg-[#007C89] text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Plus size={14} /> Ajouter des abonnés (CSV)
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Prénom & Nom</th>
                  <th className="p-4">Note d'engagement</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Dernière ouverture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {[
                  { email: 'alexandre.lemoine@agency.be', name: 'Alexandre Lemoine', stars: 5, status: 'Abonné VIP', lastOpen: 'Il y a 2h' },
                  { email: 'sophie.dubois@e-commerce.fr', name: 'Sophie Dubois', stars: 5, status: 'Abonné VIP', lastOpen: 'Il y a 3h' },
                  { email: 'marc.vermeulen@startup.be', name: 'Marc Vermeulen', stars: 4, status: 'Abonné régulier', lastOpen: 'Hier' },
                  { email: 'elena.rodriguez@freelance.com', name: 'Elena Rodriguez', stars: 4, status: 'Abonné régulier', lastOpen: 'Il y a 3j' },
                  { email: 'thomas.mercier@orange.fr', name: 'Thomas Mercier', stars: 2, status: 'Peu engagé', lastOpen: 'Il y a 2 sem.' },
                ].map((sub, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{sub.email}</td>
                    <td className="p-4 text-slate-600">{sub.name}</td>
                    <td className="p-4">
                      <span className="text-amber-400 font-bold tracking-widest">
                        {'★'.repeat(sub.stars)}{'☆'.repeat(5 - sub.stars)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">{sub.lastOpen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1 : CREATE NEW CAMPAIGN WORKFLOW */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFE01B] text-[#241C15] flex items-center justify-center font-black">
                  🐵
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Créer une nouvelle campagne</h3>
                  <p className="text-xs text-slate-400">Configurez les bases de votre e-mail avant d'éditer</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewCampaignModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nom de la campagne (interne)</label>
                <input
                  type="text"
                  placeholder="Ex : Newsletter Automne 2024"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Objet de l'e-mail</label>
                <input
                  type="text"
                  placeholder="Ex : 🎁 Une surprise vous attend dans cet e-mail"
                  value={newCampaignSubject}
                  onChange={(e) => setNewCampaignSubject(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Audience destinataire</label>
                <select
                  value={newCampaignAudience}
                  onChange={(e) => setNewCampaignAudience(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-medium text-slate-800 bg-white"
                >
                  <option value="Abonnés EFP & Pros du Digital (4 850 contacts)">Abonnés EFP & Pros du Digital (4 850 contacts)</option>
                  <option value="Clients Inscrits aux Formations (1 240 contacts)">Clients Inscrits aux Formations (1 240 contacts)</option>
                  <option value="Prospects Inactifs (860 contacts)">Prospects Inactifs (860 contacts)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Choisir un modèle de départ :</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setNewCampaignTemplate('promo')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newCampaignTemplate === 'promo' 
                        ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🛍️</span> Offre Promo & Ventes Flash
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Bannière hero, réduction -30%, bouton CTA et carte produit.</p>
                  </div>

                  <div
                    onClick={() => setNewCampaignTemplate('edito')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newCampaignTemplate === 'edito' 
                        ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>📰</span> Newsletter & Édito
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Format article de blog, conseils du mois et séparateur.</p>
                  </div>

                  <div
                    onClick={() => setNewCampaignTemplate('event')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newCampaignTemplate === 'event' 
                        ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🎙️</span> Webinaire & Événement
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Invitation live, intervenants et inscription rapide.</p>
                  </div>

                  <div
                    onClick={() => setNewCampaignTemplate('scratch')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      newCampaignTemplate === 'scratch' 
                        ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>📄</span> Page Vierge (Minimal)
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Structure vierge épurée pour créer librement bloc par bloc.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowNewCampaignModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmCreateCampaign}
                className="flex-1 py-2.5 bg-[#007C89] hover:bg-[#006570] text-white rounded-xl font-extrabold text-xs shadow-md transition-transform hover:scale-[1.02]"
              >
                Créer et ouvrir l'éditeur 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2 : TEST EMAIL SIMULATION */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Send size={18} className="text-teal-600" /> Envoyer un e-mail de test
              </h3>
              <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Testez le rendu de votre newsletter dans une boîte de réception réelle et vérifiez le score de délivrabilité.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Adresse e-mail de test</label>
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-[11px]">
                  <CheckCircle size={14} /> Diagnostic Spam Assassin : 10 / 10 (Impeccable)
                </div>
                <p className="text-[10px] text-emerald-700">
                  Votre objet contient {currentCampaign.subject.length} caractères. Aucun mot banni détecté.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTestModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-xs text-slate-600"
              >
                Fermer
              </button>
              <button
                onClick={handleSendTestEmail}
                className="flex-1 py-2.5 bg-[#007C89] hover:bg-[#006570] text-white rounded-xl font-bold text-xs"
              >
                Envoyer le test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3 : FINAL CAMPAIGN SEND CHECKLIST */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-[#FFE01B] text-[#241C15] rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-4 shadow-sm">
              🐵
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Prêt pour le grand saut ?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Vous êtes sur le point d'envoyer votre newsletter à <strong className="text-slate-800">{currentCampaign.audienceName}</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs mb-6 space-y-2 font-medium text-slate-600">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Check size={14} /> Objet : "{currentCampaign.subject}" ({currentCampaign.subject.length} car.)
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Check size={14} /> Expéditeur : {currentCampaign.fromName} ({currentCampaign.fromEmail})
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Check size={14} /> Pied de page RGPD & lien de désinscription inclus
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Check size={14} /> Suivi Google Analytics UTM activé
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50"
              >
                Continuer à éditer
              </button>
              <button
                onClick={handleSendCampaign}
                className="flex-1 py-3 bg-[#007C89] hover:bg-[#006570] text-white rounded-xl font-extrabold text-xs shadow-md transition-transform hover:scale-105"
              >
                Envoyer maintenant 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
