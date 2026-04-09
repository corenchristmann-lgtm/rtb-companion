import type { Challenge, Project, ChecklistItem, Note, ChallengeStatus } from "@/types/database";

// Static data embedded for offline-first reliability
// Matches seed.sql exactly

export const CHALLENGES: Challenge[] = [
  {
    id: 1, position: 1, company: "BNP Paribas Fortis", emoji: "\u{1F3E6}",
    start_time: "08:45", end_time: "09:15",
    location: "Salle Georges Simenon, 4e \u00e9tage",
    address: "Place Xavier Neujean 2, 4000 Li\u00e8ge (entr\u00e9e par le patio, pas l'agence)",
    challenge_description: "Convaincre un banquier en 3 minutes sans aucun support visuel. Pitch 100% oral.",
    format: "3 min pitch + 2 min Q/A",
    skills: ["Capacit\u00e9 \u00e0 inspirer", "Cr\u00e9ation de valeur", "Capacit\u00e9 \u00e0 exprimer son besoin", "Gestion et ma\u00eetrise des risques"],
    tips: ["Exprimer clairement le besoin : cr\u00e9dit, conseil financier, ouverture de compte, mise en relation commerciale", "Structurer le pitch : probl\u00e8me \u2192 valeur ajout\u00e9e concr\u00e8te \u2192 pour qui", "Partager la vision moyen terme du projet", "Pour un banquier, les deux notions centrales sont le risque et la confiance", "Chiffres rigoureux et coh\u00e9rents avec le stade d'avancement du projet", "Timing cl\u00e9 : 3 minutes, pas une de plus !", "Terminer par un CTA clair"],
    briefing_notes: "Cette ann\u00e9e ils vont regarder en particulier la plus-value du projet. Quand on sort des chiffres, il faut des \u00e9l\u00e9ments concrets, r\u00e9els, surtout pour le Q/A. Ne pas parler apr\u00e8s parce que les autres passent encore.",
    jury: ["Katja Makkonen", "Julie Dirick", "Bruno Mazzanti", "Fabian Gasperin"],
    contact_name: "Vincent Louis \u2013 Directeur Retail Banking", contact_phone: "04 74 67 89 34",
    prize: "1 000 \u20ac", transport_to_next: "11 min \u00e0 pied vers UCM"
  },
  {
    id: 2, position: 2, company: "UCM", emoji: "\u{1F9D1}\u200D\u{1F4BC}",
    start_time: "09:45", end_time: "10:15",
    location: "Bureaux UCM \u2013 9e \u00e9tage",
    address: "Boulevard d'Avroy 42, 4000 Li\u00e8ge",
    challenge_description: "Tu re\u00e7ois une grosse commande de 100 000 \u20ac. Quelles comp\u00e9tences te manquent et comment vas-tu les int\u00e9grer ?",
    format: "3 min pitch + 2 min Q/R",
    skills: ["Auto-\u00e9valuation", "R\u00e9alisme", "Int\u00e9gration des comp\u00e9tences dans le projet"],
    tips: ["Identifier le core business de l'entreprise", "Lister les comp\u00e9tences n\u00e9cessaires", "Identifier celles qui manquent", "Expliquer comment les int\u00e9grer : engager, s'associer, franchiser, sous-traiter, se former\u2026", "Support visuel papier/flipchart", "Si ASBL, parler de 'don' plutôt que 'commande'", "Pr\u00e9senter son projet en premier !"],
    briefing_notes: "S'entourer est toujours associ\u00e9 \u00e0 une forme de risque et d'opportunit\u00e9 \u2014 il faut y penser avant de choisir le moyen.",
    jury: ["Jean-Louis Braibant", "Cl\u00e9mence Lux", "Romane Geurts", "Caroline Scarpulla", "Dominique Reterre", "Marie Tirtiaux"],
    contact_name: "V\u00e9ronique Jassogne", contact_phone: "04 221 65 57",
    prize: "1 000 \u20ac", transport_to_next: "2 min \u00e0 pied vers Wallonie Entreprendre"
  },
  {
    id: 3, position: 3, company: "Wallonie Entreprendre", emoji: "\u{1F30D}",
    start_time: "10:30", end_time: "11:00",
    location: "Accueil \u2013 pr\u00e8s du panneau WE et des sofas",
    address: "Avenue Maurice Destenay 13, 4000 Li\u00e8ge",
    challenge_description: "Pourquoi la Wallonie doit-elle soutenir ton projet ? Pitch en trio : projet \u2013 ambition \u2013 challenge.",
    format: "3 min trio + 2 min Q/A",
    skills: ["Impact pour la Wallonie", "Clairvoyance sur les challenges", "Capacit\u00e9 \u00e0 \u00eatre concret", "Capacit\u00e9 \u00e0 capter l'attention"],
    tips: ["Impact multiple : emplois, b\u00e9n\u00e9ficiaires, rayonnement, environnement, CA\u2026", "Impact large : qualit\u00e9 de vie, expertise sectorielle", "Pas de contrainte de temps pour l'impact \u2014 sur 10 ans OK", "5 images max, pas de texte, dessins autoris\u00e9s", "Format Pecha Kucha pour inspiration"],
    briefing_notes: "Ils peuvent \u00eatre plus durs qu'ailleurs. Trio : projet \u2013 ambition \u2013 challenge.",
    jury: ["Elea Dormal", "Emilie Neuville", "Jean-Fran\u00e7ois Desguin"],
    contact_name: "Jean-Fran\u00e7ois Desguin", contact_phone: "04 71 69 85 21",
    prize: "1 000 \u20ac", transport_to_next: "Tram T1 dir. Sclessin : Pont d'Avroy \u2192 Petit Paradis (3 arr\u00eats)"
  },
  {
    id: 4, position: 4, company: "Loterie Nationale", emoji: "\u{1F3B2}",
    start_time: "11:30", end_time: "12:00",
    location: "Hub Li\u00e8ge",
    address: "Avenue Blonden 84, 4000 Li\u00e8ge",
    challenge_description: "Comment le hasard peut-il m\u00e9tamorphoser ton projet entrepreneurial ?",
    format: "1 min projet + 2 min hasard + 2 min feedback",
    skills: ["Originalit\u00e9 & cr\u00e9ativit\u00e9", "Coh\u00e9rence & pertinence", "Innovation", "Clart\u00e9 & intelligibilit\u00e9"],
    tips: ["Le hasard = rencontres ou actions pr\u00e9par\u00e9es", "Augmenter les probabilit\u00e9s de chance", "Oser faire quelque chose de nouveau", "Saisir l'inattendu avec audace", "Storytelling, pas juste des slides"],
    briefing_notes: "Comment ils ont \u00e9t\u00e9 chanceux OU comment la chance peut arriver. Enregistrement sur place.",
    jury: ["Maud Neuprez", "Nicolas Van Lierde", "Claudyna Yanez Delgado", "Victoria Baijot"],
    contact_name: "Maud Neuprez", contact_phone: "04 73 94 58 10",
    prize: "1 000 \u20ac", transport_to_next: "LUNCH puis Bus B2 12h19 : Guillemins \u2192 Sart-Tilman Polytech \u2192 16 min \u00e0 pied"
  },
  {
    id: 5, position: 5, company: "EVS Broadcast Equipment", emoji: "\u{1F4E1}",
    start_time: "13:30", end_time: "14:00",
    location: "Bureaux EVS \u2013 salle Albert's Room",
    address: "Rue du Bois Saint-Jean 13, 4102 Seraing",
    challenge_description: "\u00c0 quel besoin r\u00e9ponds-tu vraiment et comment te lancer sur les plateformes digitales ?",
    format: "1 min besoin + 2 min strat\u00e9gie marketing digital",
    skills: ["Compr\u00e9hension du produit/service", "Segmentation", "Utilisation IA", "Objectifs clairs", "Marketing digital"],
    tips: ["Comprendre le besoin pr\u00e9cis, pas juste vanter le produit", "Relier solution aux besoins du public", "Strat\u00e9gie concr\u00e8te : canaux, budget, cible", "IA encourag\u00e9e", "5WHY pour creuser le besoin", "Venir avec la campagne"],
    briefing_notes: "V\u00e9rifier que la strat\u00e9gie est adapt\u00e9e au challenge, pas juste un exemple pass\u00e9.",
    jury: ["Justin Mannesberg", "Julien Legras", "S\u00e9bastien Mandiaux"],
    contact_name: "Justin Mannesberg", contact_phone: "04 90 58 48 04",
    prize: "1 000 \u20ac", transport_to_next: "Voiture VentureLab (VW Caravelle). Chauffeur Robin Prgomet."
  },
  {
    id: 6, position: 6, company: "Defenso (DBB)", emoji: "\u2696\uFE0F",
    start_time: "14:30", end_time: "15:00",
    location: "Bureaux Defenso",
    address: "Place George Ista 28, 4030 Li\u00e8ge",
    challenge_description: "Anticipe 3 probl\u00e8mes qui peuvent faire \u00e9chouer ton projet et propose des solutions.",
    format: "1 min projet + 2 min risque + 2 min challenge jury",
    skills: ["Se projeter", "Anticiper les risques", "Trouver des solutions", "Opportunit\u00e9 dans la difficult\u00e9"],
    tips: ["Risque commercial ou production, PAS technique", "3 risques sur la fiche, 1 seul \u00e0 l'oral", "Croissance \u2260 cr\u00e9ation", "Face \u00e0 des avocats mais pas besoin d'\u00eatre expert", "Fiche lisible \u00e0 laisser sur place"],
    briefing_notes: "Face \u00e0 des avocats. Montrer qu'on anticipe. Fiche \u00e0 laisser sur place.",
    jury: ["Samuel van Durme", "Sarah M\u00e9an", "Beno\u00eet Delacroix", "Cl\u00e9mentine Waxweiler"],
    contact_name: "Samuel van Durme", contact_phone: "04 252 74 29",
    prize: "1 000 \u20ac", transport_to_next: "Bus L17 15h19 : Rue du Falchena \u2192 Pont de Longdoz \u2192 6 min \u00e0 pied"
  },
  {
    id: 7, position: 7, company: "AKT CCI Liège-Verviers-Namur", emoji: "\u{1F91D}",
    start_time: "16:00", end_time: "16:30",
    location: "QG VentureLab \u2013 Salle des M\u00e9tamorphoses (RDC)",
    address: "Rue des Carmes 24, 4000 Li\u00e8ge",
    challenge_description: "King du Networking : 15 min de networking r\u00e9el avec des entrepreneurs, puis feedback.",
    format: "15 min networking + 1,5 min feedback jury",
    skills: ["Networking", "Approche professionnelle", "Adaptation \u00e0 l'audience"],
    tips: ["Ne pas jouer le mauvais acteur", "Faire du LIEN, pas se pr\u00e9senter", "Se renseigner sur les participants", "Le networking se pr\u00e9pare", "L'attitude compte !"],
    briefing_notes: "Capacit\u00e9 \u00e0 faire du lien, \u00eatre bon connecteur. Montrer qu'on apporte \u00e0 son r\u00e9seau.",
    jury: ["Personnes myst\u00e8res \u00e0 d\u00e9couvrir"],
    contact_name: "C\u00e9line Kuetgens", contact_phone: "04 99 13 80 89",
    prize: "1 000 \u20ac", transport_to_next: "Porte \u00e0 c\u00f4t\u00e9 (m\u00eame b\u00e2timent)"
  },
  {
    id: 8, position: 8, company: "VEDIA", emoji: "\u{1F3AC}",
    start_time: "16:30", end_time: "17:00",
    location: "QG VentureLab \u2013 Salle des Cr\u00e9ations (1er \u00e9tage)",
    address: "Rue des Carmes 24, 4000 Li\u00e8ge",
    challenge_description: "Plateau TV : carte mauvaise nouvelle + pitch face cam\u00e9ra 1m30.",
    format: "60s lecture + 4 min pr\u00e9pa + 1m30 face cam\u00e9ra",
    skills: ["R\u00e9silience", "Force de conviction", "Authenticit\u00e9", "Gestion du stress"],
    tips: ["La mauvaise nouvelle = un rebondissement", "Yeux dans la cam\u00e9ra toujours", "Vid\u00e9o conseils : vediapro.be/road-to-business", "1 personne par groupe face cam\u00e9ra", "Une seule prise, pas de recommencement"],
    briefing_notes: "Enregistrement sur place. Peuvent s'entra\u00eener et prendre des accessoires.",
    jury: ["Quentin Boniver", "Sandro Giarratana"],
    contact_name: "Quentin Boniver", contact_phone: "04 99 10 77 68",
    prize: "1 000 \u20ac", transport_to_next: "D\u00e9j\u00e0 au VentureLab \u2192 verre de cl\u00f4ture \u00e0 18h00"
  }
];

export const PROJECTS: Project[] = [
  { id: 1, name: "LaJusteDose", members: "M\u00e9lodie Kubushishi", description: "Solutions low-tech pour s\u00e9curiser et simplifier la distribution et la prise de m\u00e9dicaments. Pilulier multi-m\u00e9dicaments et chariot optimis\u00e9 pour maisons de repos." },
  { id: 2, name: "VILO", members: "Guillaume Vilet", description: "Plateforme mobile-first de centralisation et valorisation du contenu g\u00e9n\u00e9r\u00e9 par les utilisateurs lors d'\u00e9v\u00e9nements." },
  { id: 3, name: "Bissap Origins", members: "Elvis Amaizo, Boubacar Bah, Emmanuel Devo, Matteo Raffaelli", description: "Valorise l'hibiscus africain \u00e0 travers des boissons naturelles, locales et responsables." },
  { id: 4, name: "Camille Changeur Photographe", members: "Camille Changeur", description: "Photographe sp\u00e9cialis\u00e9e dans les animaux de compagnie." }
];

export const CONTACTS = [
  { name: "Morgane", role: "Coordinatrice RTB", phone: "+32 472 32 57 98" },
  { name: "Robin Prgomet", role: "Chauffeur VW Caravelle", phone: "Groupe WhatsApp" },
  { name: "Corentin Christmann", role: "Accompagnateur \u00c9quipe 1", phone: "+33 7 82 54 33 94" },
];

export const RULES = [
  "AUCUN RETARD N'EST TOL\u00c9R\u00c9",
  "Chaque groupe doit pr\u00e9senter TOUTES les \u00e9preuves, m\u00eame incompl\u00e8tes",
  "Attitude : professionnel, respectueux, impliqu\u00e9, tenue correcte",
  "Les entreprises sont des partenaires potentiels",
  "Toujours pr\u00e9senter le projet en premier (surtout en fin de journ\u00e9e !)",
];

export const DEFAULT_CHECKLIST: Record<number, string[]> = {
  1: [
    "Rappeler : pas de support visuel, pitch oral uniquement",
    "V\u00e9rifier que chacun a structur\u00e9 son pitch (probl\u00e8me \u2192 valeur \u2192 pour qui)",
    "Chiffres concrets pr\u00eats pour le Q/A",
    "CTA clair pr\u00e9par\u00e9",
    "Rappel : 3 min max, timing strict",
    "Rappel : pr\u00e9senter son projet d'abord",
    "Rappeler la plus-value du projet (focus jury cette ann\u00e9e)",
    "Ne pas parler apr\u00e8s le passage"
  ],
  2: [
    "Identifier le core business + comp\u00e9tences n\u00e9cessaires",
    "Lister les comp\u00e9tences manquantes + solutions",
    "Support visuel papier/flipchart pr\u00e9par\u00e9 (pas de PPT)",
    "Si ASBL \u2192 parler de \"don\" pas \"commande\"",
    "Ne pas oublier la pr\u00e9sentation du projet en premier",
    "R\u00e9fl\u00e9chir aux risques et opportunit\u00e9s de s'entourer"
  ],
  3: [
    "Trio projet-ambition-challenge structur\u00e9",
    "Slides pr\u00eates (5 images max, pas de texte, dessins OK)",
    "Donn\u00e9es d'impact chiffr\u00e9es",
    "Rappel : impact = large (qualit\u00e9 de vie, expertise, 10 ans OK)",
    "Pas de texte sur les slides",
    "Se pr\u00e9parer \u00e0 un jury plus exigeant"
  ],
  4: [
    "Angle \"hasard\" trouv\u00e9 (pass\u00e9 OU futur)",
    "Storytelling pr\u00e9par\u00e9 (pas juste des slides)",
    "Accessoires/props si pertinents",
    "Comment mettre en place la chance",
    "Enregistrement sur place",
    "Rappel : 1 min projet + 2 min hasard + 2 min feedback"
  ],
  5: [
    "Besoin client clairement identifi\u00e9",
    "Strat\u00e9gie marketing digital concr\u00e8te (canaux, budget, cible)",
    "Campagne pr\u00eate si possible (vid\u00e9o, visuel\u2026)",
    "Rappel : IA encourag\u00e9e",
    "Utiliser le 5WHY pour creuser le besoin r\u00e9el",
    "V\u00e9rifier que la strat\u00e9gie est adapt\u00e9e au challenge"
  ],
  6: [
    "3 risques identifi\u00e9s (commercial ou production, PAS technique)",
    "1 risque choisi pour la pr\u00e9sentation orale",
    "Pistes de solutions pour chaque risque",
    "Fiche risques/solutions lisible (\u00e0 laisser sur place !)",
    "Rappel : pas de risque \"croissance\"",
    "Face \u00e0 des avocats, montrer qu'on anticipe"
  ],
  7: [
    "Fiche participants AKT CCI consult\u00e9e",
    "Rappel : faire du LIEN, pas juste se pr\u00e9senter",
    "Posture d'\u00e9coute et de connexion",
    "Se renseigner sur les participants",
    "Montrer qu'on apporte \u00e0 son r\u00e9seau",
    "L'attitude et la posture comptent"
  ],
  8: [
    "Rappel : 1 personne par groupe face cam\u00e9ra",
    "Entra\u00eenement face cam\u00e9ra fait",
    "Rappel : une seule prise, pas de recommencement",
    "Yeux dans la cam\u00e9ra, toujours",
    "Vid\u00e9o conseils visionn\u00e9e (vediapro.be)",
    "Accessoires/props pr\u00e9par\u00e9s",
    "Rappel : 60s lecture + 4 min pr\u00e9pa + 1m30 face cam\u00e9ra"
  ]
};
