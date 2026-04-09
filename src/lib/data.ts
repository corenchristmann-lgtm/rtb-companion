import type { Challenge, Project } from "@/types/database";

export const CHALLENGES: Challenge[] = [
  {
    id: 1, position: 1, company: "BNP Paribas Fortis", emoji: "🏦",
    start_time: "08:45", end_time: "09:15",
    location: "Salle Georges Simenon, 4e étage",
    address: "Place Xavier Neujean 2, 4000 Liège (entrée par le patio)",
    challenge_description: "Convaincre un banquier en 3 minutes sans support visuel. Pitch 100% oral.",
    format: "3 min pitch + 2 min Q/A",
    skills: ["Inspirer", "Créer de la valeur", "Exprimer son besoin", "Maîtrise des risques"],
    tips: [
      "Exprimer clairement le besoin : crédit, conseil financier, ouverture de compte, mise en relation",
      "Structurer : problème → valeur ajoutée → pour qui",
      "Vision moyen terme du projet",
      "Pour un banquier : risque et confiance sont centraux",
      "Chiffres rigoureux et cohérents avec le stade d'avancement",
      "3 minutes max, pas une de plus !",
      "CTA clair en fin de pitch"
    ],
    briefing_notes: "Focus sur la plus-value du projet. Chiffres concrets et réels pour le Q/A. Ne pas parler après le passage.",
    jury: ["Katja Makkonen", "Julie Dirick", "Bruno Mazzanti", "Fabian Gasperin"],
    contact_name: "Vincent Louis", contact_phone: "04 74 67 89 34",
    prize: "1 000 €", transport_to_next: "11 min à pied vers UCM"
  },
  {
    id: 2, position: 2, company: "UCM", emoji: "🧑‍💼",
    start_time: "09:45", end_time: "10:15",
    location: "Bureaux UCM – 9e étage",
    address: "Boulevard d'Avroy 42, 4000 Liège",
    challenge_description: "Commande de 100 000 €. Quelles compétences te manquent et comment les intégrer ?",
    format: "3 min pitch + 2 min Q/R",
    skills: ["Auto-évaluation", "Réalisme", "Intégration des compétences"],
    tips: [
      "Identifier le core business",
      "Lister les compétences nécessaires puis manquantes",
      "Comment intégrer : engager, s'associer, franchiser, sous-traiter, se former",
      "Support papier/flipchart (pas de PPT)",
      "Si ASBL → parler de « don » pas « commande »",
      "Présenter son projet en premier !"
    ],
    briefing_notes: "S'entourer = risque et opportunité. Y penser avant de choisir le moyen.",
    jury: ["Jean-Louis Braibant", "Clémence Lux", "Romane Geurts", "Caroline Scarpulla", "Dominique Reterre", "Marie Tirtiaux"],
    contact_name: "Véronique Jassogne", contact_phone: "04 221 65 57",
    prize: "1 000 €", transport_to_next: "2 min à pied (même avenue)"
  },
  {
    id: 3, position: 3, company: "Wallonie Entreprendre", emoji: "🌍",
    start_time: "10:30", end_time: "11:00",
    location: "Accueil – panneau WE et sofas",
    address: "Avenue Maurice Destenay 13, 4000 Liège",
    challenge_description: "Pourquoi la Wallonie doit soutenir ton projet ? Trio : projet – ambition – challenge.",
    format: "3 min trio + 2 min Q/A",
    skills: ["Impact régional", "Clairvoyance", "Concret", "Capter l'attention"],
    tips: [
      "Impact multiple : emplois, bénéficiaires, rayonnement, environnement, CA",
      "Impact large : qualité de vie, expertise sectorielle",
      "Pas de contrainte de temps – impact sur 10 ans OK",
      "5 images max, pas de texte, dessins autorisés",
      "Format Pecha Kucha pour inspiration"
    ],
    briefing_notes: "Jury plus dur qu'ailleurs. Trio : projet – ambition – challenge.",
    jury: ["Elea Dormal", "Emilie Neuville", "Jean-François Desguin"],
    contact_name: "Jean-François Desguin", contact_phone: "04 71 69 85 21",
    prize: "1 000 €", transport_to_next: "Tram T1 → Pont d'Avroy → Petit Paradis (3 arrêts)"
  },
  {
    id: 4, position: 4, company: "Loterie Nationale", emoji: "🎲",
    start_time: "11:30", end_time: "12:00",
    location: "Hub Liège",
    address: "Avenue Blonden 84, 4000 Liège",
    challenge_description: "Comment le hasard peut-il métamorphoser ton projet ?",
    format: "1 min projet + 2 min hasard + 2 min feedback",
    skills: ["Originalité", "Cohérence", "Innovation", "Clarté"],
    tips: [
      "Le hasard = rencontres ou actions préparées",
      "Augmenter les probabilités de chance",
      "Oser faire quelque chose de nouveau",
      "Saisir l'inattendu avec audace",
      "Storytelling, pas juste des slides"
    ],
    briefing_notes: "Passé ou futur. Comment mettre en place la chance. Enregistrement sur place, accessoires OK.",
    jury: ["Maud Neuprez", "Nicolas Van Lierde", "Claudyna Yanez Delgado", "Victoria Baijot"],
    contact_name: "Maud Neuprez", contact_phone: "04 73 94 58 10",
    prize: "1 000 €", transport_to_next: "LUNCH puis Bus B2 12h19 : Guillemins → Sart-Tilman → 16 min à pied"
  },
  {
    id: 5, position: 5, company: "EVS", emoji: "📡",
    start_time: "13:30", end_time: "14:00",
    location: "Bureaux EVS – Albert's Room",
    address: "Rue du Bois Saint-Jean 13, 4102 Seraing",
    challenge_description: "À quel besoin réponds-tu vraiment ? Stratégie marketing digital.",
    format: "1 min besoin + 2 min stratégie digitale",
    skills: ["Compréhension produit", "Segmentation", "IA", "Objectifs clairs", "Marketing digital"],
    tips: [
      "Comprendre le besoin précis, pas juste vanter le produit",
      "Relier solution aux besoins du public",
      "Stratégie concrète : canaux, budget, cible",
      "IA encouragée mais pas obligatoire",
      "5WHY pour creuser le besoin réel",
      "Venir avec la campagne prête si possible"
    ],
    briefing_notes: "Vérifier que la stratégie est adaptée au challenge, pas juste un exemple passé.",
    jury: ["Justin Mannesberg", "Julien Legras", "Sébastien Mandiaux"],
    contact_name: "Justin Mannesberg", contact_phone: "04 90 58 48 04",
    prize: "1 000 €", transport_to_next: "Voiture VentureLab (VW Caravelle, chauffeur Robin)"
  },
  {
    id: 6, position: 6, company: "Defenso", emoji: "⚖️",
    start_time: "14:30", end_time: "15:00",
    location: "Bureaux Defenso",
    address: "Place George Ista 28, 4030 Liège",
    challenge_description: "3 risques qui peuvent faire échouer ton projet + solutions.",
    format: "1 min projet + 2 min risque + 2 min Q/A jury",
    skills: ["Se projeter", "Anticiper", "Solutions", "Opportunité dans la difficulté"],
    tips: [
      "Risque commercial ou production – PAS technique",
      "3 risques sur la fiche, 1 seul présenté à l'oral",
      "Croissance ≠ création",
      "Face à des avocats, montrer qu'on anticipe",
      "Fiche lisible à laisser sur place"
    ],
    briefing_notes: "Face à des avocats. Montrer qu'on anticipe, pas être expert juridique. Fiche à laisser.",
    jury: ["Samuel van Durme", "Sarah Méan", "Benoît Delacroix", "Clémentine Waxweiler"],
    contact_name: "Samuel van Durme", contact_phone: "04 252 74 29",
    prize: "1 000 €", transport_to_next: "Bus L17 15h19 → Pont de Longdoz → 6 min à pied"
  },
  {
    id: 7, position: 7, company: "AKT CCI", emoji: "🤝",
    start_time: "16:00", end_time: "16:30",
    location: "VentureLab – Salle des Métamorphoses (RDC)",
    address: "Rue des Carmes 24, 4000 Liège",
    challenge_description: "King du Networking : 15 min de networking réel avec des entrepreneurs.",
    format: "15 min networking + 1,5 min feedback",
    skills: ["Networking", "Approche pro", "Adaptation"],
    tips: [
      "Faire du LIEN, pas juste se présenter",
      "Se renseigner sur les participants avant",
      "Le networking se prépare",
      "Montrer qu'on apporte à son réseau",
      "Posture et écoute comptent énormément"
    ],
    briefing_notes: "Être bon connecteur. Apporter à son réseau, pas parler de soi.",
    jury: ["Personnes mystères"],
    contact_name: "Céline Kuetgens", contact_phone: "04 99 13 80 89",
    prize: "1 000 €", transport_to_next: "Porte à côté (même bâtiment)"
  },
  {
    id: 8, position: 8, company: "VEDIA", emoji: "🎬",
    start_time: "16:30", end_time: "17:00",
    location: "VentureLab – Salle des Créations (1er étage)",
    address: "Rue des Carmes 24, 4000 Liège",
    challenge_description: "Plateau TV : carte mauvaise nouvelle + pitch face caméra 1m30.",
    format: "60s lecture + 4 min prépa + 1m30 face caméra",
    skills: ["Résilience", "Conviction", "Authenticité", "Gestion du stress"],
    tips: [
      "La mauvaise nouvelle = un rebondissement",
      "Yeux dans la caméra, toujours",
      "1 personne par groupe face caméra",
      "Une seule prise, pas de recommencement",
      "Vidéo conseils : vediapro.be/road-to-business"
    ],
    briefing_notes: "Enregistrement sur place. Peuvent s'entraîner et prendre des accessoires.",
    jury: ["Quentin Boniver", "Sandro Giarratana"],
    contact_name: "Quentin Boniver", contact_phone: "04 99 10 77 68",
    prize: "1 000 €", transport_to_next: "Déjà au VentureLab → clôture à 18h00"
  }
];

export const PROJECTS: Project[] = [
  {
    id: 1, name: "LaJusteDose", members: "Mélodie Kubushishi",
    description: "Solutions low-tech pour sécuriser la distribution de médicaments en maisons de repos."
  },
  {
    id: 2, name: "VILO", members: "Guillaume Vilet",
    description: "Plateforme de centralisation du contenu généré par les utilisateurs lors d'événements."
  },
  {
    id: 3, name: "Bissap Origins", members: "Elvis, Boubacar, Emmanuel, Matteo",
    description: "Boissons naturelles à base d'hibiscus africain. Marque moderne, saine et durable."
  },
  {
    id: 4, name: "Camille Changeur", members: "Camille Changeur",
    description: "Photographe spécialisée dans les animaux de compagnie."
  }
];

export const CONTACTS = [
  { name: "Morgane", role: "Coordinatrice RTB", phone: "+32 472 32 57 98" },
  { name: "Robin Prgomet", role: "Chauffeur VW Caravelle", phone: "WhatsApp" },
  { name: "Corentin", role: "Accompagnateur Équipe 1", phone: "+33 7 82 54 33 94" },
];

export const RULES = [
  "Aucun retard toléré",
  "Présenter toutes les épreuves, même incomplètes",
  "Tenue et attitude professionnelles",
  "Toujours présenter le projet en premier",
  "Les entreprises sont des partenaires potentiels",
];

export const DEFAULT_CHECKLIST: Record<number, string[]> = {
  1: [
    "Pas de support visuel, pitch oral uniquement",
    "Pitch structuré : problème → valeur → pour qui",
    "Chiffres concrets prêts pour le Q/A",
    "CTA clair préparé",
    "Timing : 3 min max",
    "Présenter son projet d'abord",
    "Focus plus-value (attente jury)",
    "Ne pas parler après le passage"
  ],
  2: [
    "Core business + compétences identifiés",
    "Compétences manquantes + solutions listées",
    "Support papier/flipchart prêt",
    "Si ASBL → « don » pas « commande »",
    "Présenter le projet en premier",
    "Risques/opportunités de s'entourer"
  ],
  3: [
    "Trio projet-ambition-challenge structuré",
    "Slides : 5 images max, pas de texte",
    "Données d'impact chiffrées",
    "Impact large : qualité de vie, expertise…",
    "Pas de texte sur les slides",
    "Jury exigeant – bien se préparer"
  ],
  4: [
    "Angle « hasard » trouvé (passé ou futur)",
    "Storytelling préparé",
    "Accessoires/props si pertinents",
    "Comment provoquer la chance",
    "Enregistrement sur place",
    "1 min projet + 2 min hasard + 2 min feedback"
  ],
  5: [
    "Besoin client clairement identifié",
    "Stratégie marketing digital concrète",
    "Campagne prête si possible",
    "IA encouragée",
    "5WHY pour creuser le besoin",
    "Stratégie adaptée au challenge"
  ],
  6: [
    "3 risques (commercial/production, PAS technique)",
    "1 risque choisi pour l'oral",
    "Solutions pour chaque risque",
    "Fiche lisible (à laisser sur place)",
    "Pas de risque « croissance »",
    "Montrer qu'on anticipe"
  ],
  7: [
    "Fiche participants AKT CCI consultée",
    "Faire du LIEN, pas se présenter",
    "Posture d'écoute et connexion",
    "Se renseigner sur les participants",
    "Apporter à son réseau",
    "Attitude et posture comptent"
  ],
  8: [
    "1 personne par groupe face caméra",
    "Entraînement caméra fait",
    "Une seule prise, pas de recommencement",
    "Yeux dans la caméra toujours",
    "Vidéo conseils visionnée",
    "Accessoires préparés",
    "60s lecture + 4 min prépa + 1m30 caméra"
  ]
};
