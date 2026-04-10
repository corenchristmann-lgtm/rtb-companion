// RTB 2026 — All 9 teams: schedules, members, accompanists
// Ateliers are common, schedules differ per team

export interface Atelier {
  id: string;
  company: string;
  logo: string;
  address: string;
  challenge_description: string;
  format: string;
  skills: string[];
  tips: string[];
  briefing_notes: string | null;
  jury: string[];
  contact_name: string | null;
  contact_phone: string | null;
  prize: string;
}

export interface ScheduleSlot {
  atelier_id: string;
  start_time: string; // "HH:MM"
  end_time: string;
  transport_to_next: string | null;
  directions_url: string | null;
}

export interface TeamProject {
  name: string;
  members: string[];
  description: string;
}

export interface Team {
  id: number;
  name: string;
  accompanist: string;
  schedule: ScheduleSlot[];
  projects: TeamProject[];
}

function gmaps(from: string, to: string, mode: "walking" | "transit" | "driving" = "walking"): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=${mode}`;
}

const A = {
  bnp: "Place Xavier Neujean 2, 4000 Liège",
  ucm: "Boulevard d'Avroy 42, 4000 Liège",
  we: "Avenue Maurice Destenay 13, 4000 Liège",
  loterie: "Avenue Blonden 84, 4000 Liège",
  evs: "Rue du Bois Saint-Jean 13, 4102 Seraing",
  defenso: "Place George Ista 28, 4030 Liège",
  vl: "Rue des Carmes 24, 4000 Liège",
};

// ── 8 Ateliers (common to all teams) ──

export const ATELIERS: Record<string, Atelier> = {
  bnp: {
    id: "bnp", company: "BNP Paribas Fortis", logo: "/logos/bnp.png", address: A.bnp,
    challenge_description: "Convaincre un banquier en 3 minutes sans support visuel. Pitch 100% oral.",
    format: "3 min pitch + 2 min Q/A",
    skills: ["Inspirer", "Créer de la valeur", "Exprimer son besoin", "Maîtrise des risques"],
    tips: ["Exprimer clairement le besoin : crédit, conseil financier, ouverture de compte, mise en relation", "Structurer : problème → valeur ajoutée → pour qui", "Vision moyen terme du projet", "Pour un banquier : risque et confiance sont centraux", "Chiffres rigoureux et cohérents avec le stade d'avancement", "3 minutes max, pas une de plus !", "CTA clair en fin de pitch"],
    briefing_notes: "Focus sur la plus-value du projet. Chiffres concrets et réels pour le Q/A. Ne pas parler après le passage.",
    jury: ["Katja Makkonen", "Julie Dirick", "Bruno Mazzanti", "Fabian Gasperin"],
    contact_name: "Vincent Louis", contact_phone: "04 74 67 89 34", prize: "1 000 €",
  },
  ucm: {
    id: "ucm", company: "UCM", logo: "/logos/ucm.png", address: A.ucm,
    challenge_description: "Commande de 100 000 €. Quelles compétences te manquent et comment les intégrer ?",
    format: "3 min pitch + 2 min Q/R",
    skills: ["Auto-évaluation", "Réalisme", "Intégration des compétences"],
    tips: ["Identifier le core business", "Lister les compétences nécessaires puis manquantes", "Comment intégrer : engager, s'associer, franchiser, sous-traiter, se former", "Support papier/flipchart (pas de PPT)", "Si ASBL → parler de « don » pas « commande »", "Présenter son projet en premier !"],
    briefing_notes: "S'entourer = risque et opportunité. Y penser avant de choisir le moyen.",
    jury: ["Jean-Louis Braibant", "Clémence Lux", "Romane Geurts", "Caroline Scarpulla", "Dominique Reterre", "Marie Tirtiaux"],
    contact_name: "Véronique Jassogne", contact_phone: "04 221 65 57", prize: "1 000 €",
  },
  we: {
    id: "we", company: "Wallonie Entreprendre", logo: "/logos/we.png", address: A.we,
    challenge_description: "Pourquoi la Wallonie doit soutenir ton projet ? Trio : projet – ambition – challenge.",
    format: "3 min trio + 2 min Q/A",
    skills: ["Impact régional", "Clairvoyance", "Concret", "Capter l'attention"],
    tips: ["Impact multiple : emplois, bénéficiaires, rayonnement, environnement, CA", "Impact large : qualité de vie, expertise sectorielle", "Pas de contrainte de temps – impact sur 10 ans OK", "5 images max, pas de texte, dessins autorisés", "Format Pecha Kucha pour inspiration"],
    briefing_notes: "Jury plus dur qu'ailleurs. Trio : projet – ambition – challenge.",
    jury: ["Elea Dormal", "Emilie Neuville", "Jean-François Desguin"],
    contact_name: "Jean-François Desguin", contact_phone: "04 71 69 85 21", prize: "1 000 €",
  },
  loterie: {
    id: "loterie", company: "Loterie Nationale", logo: "/logos/loterie.png", address: A.loterie,
    challenge_description: "Comment le hasard peut-il métamorphoser ton projet ?",
    format: "1 min projet + 2 min hasard + 2 min feedback",
    skills: ["Originalité", "Cohérence", "Innovation", "Clarté"],
    tips: ["Le hasard = rencontres ou actions préparées", "Augmenter les probabilités de chance", "Oser faire quelque chose de nouveau", "Saisir l'inattendu avec audace", "Storytelling, pas juste des slides"],
    briefing_notes: "Passé ou futur. Comment mettre en place la chance. Enregistrement sur place, accessoires OK.",
    jury: ["Maud Neuprez", "Nicolas Van Lierde", "Claudyna Yanez Delgado", "Victoria Baijot"],
    contact_name: "Maud Neuprez", contact_phone: "04 73 94 58 10", prize: "1 000 €",
  },
  evs: {
    id: "evs", company: "EVS", logo: "/logos/evs.jpg", address: A.evs,
    challenge_description: "À quel besoin réponds-tu vraiment ? Stratégie marketing digital.",
    format: "1 min besoin + 2 min stratégie digitale",
    skills: ["Compréhension produit", "Segmentation", "IA", "Objectifs clairs", "Marketing digital"],
    tips: ["Comprendre le besoin précis, pas juste vanter le produit", "Relier solution aux besoins du public", "Stratégie concrète : canaux, budget, cible", "IA encouragée mais pas obligatoire", "5WHY pour creuser le besoin réel", "Venir avec la campagne prête si possible"],
    briefing_notes: "Vérifier que la stratégie est adaptée au challenge, pas juste un exemple passé.",
    jury: ["Justin Mannesberg", "Julien Legras", "Sébastien Mandiaux"],
    contact_name: "Justin Mannesberg", contact_phone: "04 90 58 48 04", prize: "1 000 €",
  },
  defenso: {
    id: "defenso", company: "Defenso", logo: "/logos/defenso.png", address: A.defenso,
    challenge_description: "3 risques qui peuvent faire échouer ton projet + solutions.",
    format: "1 min projet + 2 min risque + 2 min Q/A jury",
    skills: ["Se projeter", "Anticiper", "Solutions", "Opportunité dans la difficulté"],
    tips: ["Risque commercial ou production – PAS technique", "3 risques sur la fiche, 1 seul présenté à l'oral", "Croissance ≠ création", "Face à des avocats, montrer qu'on anticipe", "Fiche lisible à laisser sur place"],
    briefing_notes: "Face à des avocats. Montrer qu'on anticipe, pas être expert juridique. Fiche à laisser.",
    jury: ["Samuel van Durme", "Sarah Méan", "Benoît Delacroix", "Clémentine Waxweiler"],
    contact_name: "Samuel van Durme", contact_phone: "04 252 74 29", prize: "1 000 €",
  },
  akt: {
    id: "akt", company: "AKT CCI", logo: "/logos/akt.png", address: A.vl,
    challenge_description: "King du Networking : 15 min de networking réel avec des entrepreneurs.",
    format: "15 min networking + 1,5 min feedback",
    skills: ["Networking", "Approche pro", "Adaptation"],
    tips: ["Faire du LIEN, pas juste se présenter", "Se renseigner sur les participants avant", "Le networking se prépare", "Montrer qu'on apporte à son réseau", "Posture et écoute comptent énormément"],
    briefing_notes: "Être bon connecteur. Apporter à son réseau, pas parler de soi.",
    jury: ["Personnes mystères"],
    contact_name: "Céline Kuetgens", contact_phone: "04 99 13 80 89", prize: "1 000 €",
  },
  vedia: {
    id: "vedia", company: "VEDIA", logo: "/logos/vedia.png", address: A.vl,
    challenge_description: "Plateau TV : carte mauvaise nouvelle + pitch face caméra 1m30.",
    format: "60s lecture + 4 min prépa + 1m30 face caméra",
    skills: ["Résilience", "Conviction", "Authenticité", "Gestion du stress"],
    tips: ["La mauvaise nouvelle = un rebondissement", "Yeux dans la caméra, toujours", "1 personne par groupe face caméra", "Une seule prise, pas de recommencement", "Vidéo conseils : vediapro.be/road-to-business"],
    briefing_notes: "Enregistrement sur place. Peuvent s'entraîner et prendre des accessoires.",
    jury: ["Quentin Boniver", "Sandro Giarratana"],
    contact_name: "Quentin Boniver", contact_phone: "04 99 10 77 68", prize: "1 000 €",
  },
};

// Helper: compute directions between two ateliers
function dir(fromId: string, toId: string): { transport: string; url: string | null } {
  const addrs: Record<string, string> = { bnp: A.bnp, ucm: A.ucm, we: A.we, loterie: A.loterie, evs: A.evs, defenso: A.defenso, akt: A.vl, vedia: A.vl };
  const from = addrs[fromId];
  const to = addrs[toId];
  if (!from || !to || from === to) return { transport: "Même bâtiment", url: null };

  // Determine mode
  const walkable = [
    "bnp-ucm", "ucm-bnp", "ucm-we", "we-ucm", "bnp-we", "we-bnp",
    "akt-vedia", "vedia-akt", "akt-bnp", "bnp-akt", "akt-ucm", "ucm-akt",
    "vedia-bnp", "bnp-vedia", "vedia-ucm", "ucm-vedia",
    "akt-we", "we-akt", "vedia-we", "we-vedia",
  ];
  const driving = ["evs-defenso", "defenso-evs"];
  const key = `${fromId}-${toId}`;

  if (walkable.includes(key)) {
    return { transport: "À pied", url: gmaps(from, to, "walking") };
  }
  if (driving.includes(key)) {
    return { transport: "Voiture VentureLab", url: gmaps(from, to, "driving") };
  }
  return { transport: "Transport en commun", url: gmaps(from, to, "transit") };
}

// Build schedule with auto-computed transport + directions
function sched(...slots: [string, string, string][]): ScheduleSlot[] {
  return slots.map(([atelier_id, start, end], i) => {
    const next = slots[i + 1];
    const { transport, url } = next ? dir(atelier_id, next[0]) : { transport: null, url: null };
    return { atelier_id, start_time: start, end_time: end, transport_to_next: transport, directions_url: url };
  });
}

// ── 9 Teams ──

export const TEAMS: Team[] = [
  {
    id: 1, name: "Équipe 1", accompanist: "Corentin",
    schedule: sched(
      ["bnp", "08:45", "09:15"], ["ucm", "09:45", "10:15"], ["we", "10:30", "11:00"], ["loterie", "11:30", "12:00"],
      ["evs", "13:30", "14:00"], ["defenso", "14:30", "15:00"], ["akt", "16:00", "16:30"], ["vedia", "16:30", "17:00"],
    ),
    projects: [
      { name: "Bissap Origins", members: ["Matteo Raffaelli", "Boubacar Bah", "Elvis Amaizo", "Emmanuel Devo"], description: "Boissons naturelles à base d'hibiscus africain." },
      { name: "LaJusteDose", members: ["Mélodie Kubushishi"], description: "Solutions low-tech pour la distribution de médicaments." },
      { name: "Camille Changeur", members: ["Camille Changeur"], description: "Photographe spécialisée animaux de compagnie." },
      { name: "VILO", members: ["Guillaume Vilet"], description: "Plateforme de contenu événementiel." },
    ],
  },
  {
    id: 2, name: "Équipe 2", accompanist: "Guillaume",
    schedule: sched(
      ["ucm", "08:45", "09:15"], ["we", "09:30", "10:00"], ["loterie", "10:30", "11:00"], ["evs", "12:00", "12:30"],
      ["defenso", "13:45", "14:15"], ["akt", "15:15", "15:45"], ["vedia", "16:00", "16:30"], ["bnp", "17:00", "17:30"],
    ),
    projects: [
      { name: "MOTODISTRI", members: ["Hugo Fizaine", "Esteban Gilles"], description: "Distribution de motos." },
      { name: "Savvymind", members: ["Thomas Ansotte", "Victoria ?"], description: "Éducation et formation." },
      { name: "Trésor du sénior", members: ["Lesly Yemtchom"], description: "Services aux seniors." },
      { name: "Encre Soi", members: ["François Halleux"], description: "Écriture créative." },
      { name: "Preventia", members: ["Romain Blanchard"], description: "Prévention et sécurité." },
    ],
  },
  {
    id: 3, name: "Équipe 3", accompanist: "Manon",
    schedule: sched(
      ["we", "08:45", "09:15"], ["loterie", "09:45", "10:15"], ["evs", "11:15", "11:45"], ["defenso", "12:15", "12:45"],
      ["akt", "14:15", "14:45"], ["vedia", "15:00", "15:30"], ["bnp", "16:00", "16:30"], ["ucm", "17:00", "17:30"],
    ),
    projects: [
      { name: "Niva", members: ["Eva Dequen"], description: "Marque lifestyle." },
      { name: "DreamPassion", members: ["Terence Salvador Ramos"], description: "Véhicules de passion." },
      { name: "Athena", members: ["Yoni Austen"], description: "Solutions IT." },
      { name: "Studio Lola Mallue", members: ["Lola Mallue"], description: "Studio créatif." },
      { name: "Pierre-Louis Jehaes", members: ["Pierre-Louis Jehaes"], description: "" },
      { name: "Amaury Baret", members: ["Amaury Baret"], description: "" },
    ],
  },
  {
    id: 4, name: "Équipe 4", accompanist: "Marie-Sophie",
    schedule: sched(
      ["loterie", "08:45", "09:15"], ["evs", "10:30", "11:00"], ["defenso", "11:30", "12:00"], ["akt", "13:30", "14:00"],
      ["vedia", "14:15", "14:45"], ["bnp", "15:15", "15:45"], ["ucm", "16:15", "16:45"], ["we", "17:15", "17:45"],
    ),
    projects: [
      { name: "Arion Studio", members: ["Thomas Hauglustaine", "Grégoire Briot"], description: "Studio web B2B." },
      { name: "Green Rush", members: ["Pauline Tans"], description: "Restauration healthy." },
      { name: "PEB Connect", members: ["Tom Thibaut"], description: "Plateforme PEB." },
      { name: "Purrfect Love", members: ["Zoé Libert"], description: "Café littéraire." },
    ],
  },
  {
    id: 5, name: "Équipe 5", accompanist: "Aurélie",
    schedule: sched(
      ["evs", "09:00", "09:30"], ["defenso", "10:00", "10:30"], ["akt", "11:15", "11:45"], ["vedia", "13:15", "13:45"],
      ["bnp", "14:15", "14:45"], ["ucm", "15:15", "15:45"], ["we", "16:00", "16:30"], ["loterie", "17:00", "17:30"],
    ),
    projects: [
      { name: "Opus", members: ["Alexandre Verrechia", "Nathan Remacle"], description: "Web." },
      { name: "AuraZ Events", members: ["Célia Capitano"], description: "Événementiel." },
      { name: "La Veilleuse", members: ["Marie-Ève Lapierre-Lemoyne"], description: "Projet culturel." },
      { name: "Spirugreen", members: ["Wissam Amezian"], description: "Boisson spiruline." },
    ],
  },
  {
    id: 6, name: "Équipe 6", accompanist: "Aude",
    schedule: sched(
      ["defenso", "09:00", "09:30"], ["akt", "10:15", "10:45"], ["vedia", "11:00", "11:30"], ["bnp", "12:00", "12:30"],
      ["ucm", "13:30", "14:00"], ["we", "14:15", "14:45"], ["loterie", "15:15", "15:45"], ["evs", "16:45", "17:15"],
    ),
    projects: [
      { name: "FluxBee", members: ["Sacha Waltzing", "Esteban Zola-Batomene"], description: "IT & réseaux." },
      { name: "Muse", members: ["Fanny Bozzi", "Héloïse Ruidant"], description: "Upcycling concept." },
      { name: "ClearDeal", members: ["Mohamed Hajjout Boukraa"], description: "Plateforme acheteur-vendeur." },
      { name: "Sody", members: ["Sofiane Daoui"], description: "Coffee shop." },
    ],
  },
  {
    id: 7, name: "Équipe 7", accompanist: "Margaux",
    schedule: sched(
      ["akt", "09:15", "09:45"], ["vedia", "10:00", "10:30"], ["bnp", "11:00", "11:30"], ["ucm", "12:00", "12:30"],
      ["we", "12:45", "13:15"], ["loterie", "14:15", "14:45"], ["evs", "15:45", "16:15"], ["defenso", "17:00", "17:30"],
    ),
    projects: [
      { name: "IsiRecycle", members: ["Laurine Schmitz", "Tomas Ruelle"], description: "Mobilier éco-responsable." },
      { name: "Eclau", members: ["Lisa Simon"], description: "Studio créatif." },
      { name: "HDF Web Development", members: ["Lucas Henry de Frahan"], description: "Développement web." },
      { name: "Studio 9", members: ["Maxence Praneuf"], description: "Production culturelle." },
    ],
  },
  {
    id: 8, name: "Équipe 8", accompanist: "Amandine",
    schedule: sched(
      ["akt", "08:45", "09:15"], ["vedia", "09:30", "10:00"], ["bnp", "10:30", "11:00"], ["ucm", "11:30", "12:00"],
      ["we", "12:15", "12:45"], ["loterie", "13:45", "14:15"], ["evs", "15:00", "15:30"], ["defenso", "16:15", "16:45"],
    ),
    projects: [
      { name: "DOGGO", members: ["Joé Wagener", "Axelle Bielecki"], description: "Projet autour des chiens." },
      { name: "FloWell Consulting", members: ["Florence Mazy"], description: "Bien-être au travail." },
      { name: "Epivia", members: ["Ilyass Bahati"], description: "Robotique." },
      { name: "ThererTouch", members: ["William Therer"], description: "Graphic design." },
    ],
  },
  {
    id: 9, name: "Équipe 9", accompanist: "Arthur",
    schedule: sched(
      ["vedia", "08:45", "09:15"], ["bnp", "09:45", "10:15"], ["ucm", "10:45", "11:15"], ["we", "11:30", "12:00"],
      ["loterie", "12:30", "13:00"], ["evs", "14:15", "14:45"], ["defenso", "15:15", "15:45"], ["akt", "17:00", "17:30"],
    ),
    projects: [
      { name: "Paraponera", members: ["Mike Bartholomé", "Tatiana Lamborelle"], description: "Stand de tir." },
      { name: "Sp'IN", members: ["Fati Rmiqui"], description: "Boisson." },
      { name: "Musilab", members: ["Jo-hesed Fils-Aimé"], description: "La Centrale musicale." },
      { name: "Regnum Lab", members: ["Ilan Da Silva"], description: "IA." },
      { name: "LocalDiscovery", members: ["Charles Léonard"], description: "Tourisme local." },
    ],
  },
];

export const CONTACTS = [
  { name: "Morgane", role: "Coordinatrice RTB", phone: "+32 472 32 57 98" },
  { name: "Robin Prgomet", role: "Chauffeur VW Caravelle", phone: "WhatsApp" },
];

export const DEFAULT_CHECKLIST: Record<string, string[]> = {
  bnp: ["Pas de support visuel, pitch oral uniquement", "Pitch structuré : problème → valeur → pour qui", "Chiffres concrets prêts pour le Q/A", "CTA clair préparé", "Timing : 3 min max", "Présenter son projet d'abord", "Focus plus-value (attente jury)", "Ne pas parler après le passage"],
  ucm: ["Core business + compétences identifiés", "Compétences manquantes + solutions listées", "Support papier/flipchart prêt", "Si ASBL → « don » pas « commande »", "Présenter le projet en premier", "Risques/opportunités de s'entourer"],
  we: ["Trio projet-ambition-challenge structuré", "Slides : 5 images max, pas de texte", "Données d'impact chiffrées", "Impact large : qualité de vie, expertise…", "Pas de texte sur les slides", "Jury exigeant – bien se préparer"],
  loterie: ["Angle « hasard » trouvé (passé ou futur)", "Storytelling préparé", "Accessoires/props si pertinents", "Comment provoquer la chance", "Enregistrement sur place", "1 min projet + 2 min hasard + 2 min feedback"],
  evs: ["Besoin client clairement identifié", "Stratégie marketing digital concrète", "Campagne prête si possible", "IA encouragée", "5WHY pour creuser le besoin", "Stratégie adaptée au challenge"],
  defenso: ["3 risques (commercial/production, PAS technique)", "1 risque choisi pour l'oral", "Solutions pour chaque risque", "Fiche lisible (à laisser sur place)", "Pas de risque « croissance »", "Montrer qu'on anticipe"],
  akt: ["Fiche participants AKT CCI consultée", "Faire du LIEN, pas se présenter", "Posture d'écoute et connexion", "Se renseigner sur les participants", "Apporter à son réseau", "Attitude et posture comptent"],
  vedia: ["1 personne par groupe face caméra", "Entraînement caméra fait", "Une seule prise, pas de recommencement", "Yeux dans la caméra toujours", "Vidéo conseils visionnée", "Accessoires préparés", "60s lecture + 4 min prépa + 1m30 caméra"],
};
