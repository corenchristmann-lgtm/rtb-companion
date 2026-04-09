-- RTB Companion — Seed Data

-- Challenges
INSERT INTO challenges (position, company, emoji, start_time, end_time, location, address, challenge_description, format, skills, tips, briefing_notes, jury, contact_name, contact_phone, prize, transport_to_next) VALUES
(1, 'BNP Paribas Fortis', '🏦', '08:45', '09:15',
 'Salle Georges Simenon, 4e étage',
 'Place Xavier Neujean 2, 4000 Liège (entrée par le patio, pas l''agence)',
 'Convaincre un banquier en 3 minutes sans aucun support visuel. Pitch 100% oral.',
 '3 min pitch + 2 min Q/A',
 ARRAY['Capacité à inspirer','Création de valeur','Capacité à exprimer son besoin','Gestion et maîtrise des risques'],
 ARRAY['Exprimer clairement le besoin : crédit, conseil financier, ouverture de compte, mise en relation commerciale','Structurer le pitch : problème → valeur ajoutée concrète → pour qui','Partager la vision moyen terme du projet','Pour un banquier, les deux notions centrales sont le risque et la confiance','Chiffres rigoureux et cohérents avec le stade d''avancement du projet (CA, marges, coûts, besoins financiers, taille de marché)','Timing clé : 3 minutes, pas une de plus !','Terminer par un CTA clair : mise en relation avec un de leurs partenaires, lien avec le pitch, cohérent avec l''état du projet'],
 'Cette année ils vont regarder en particulier la plus-value du projet. Quand on sort des chiffres, il faut des éléments concrets, réels, surtout pour le Q/A. Ne pas parler après parce que les autres passent encore.',
 ARRAY['Katja Makkonen – Expert Professional','Julie Dirick – Expert Professional','Bruno Mazzanti – Expert Professional','Fabian Gasperin – Expert Professional'],
 'Vincent Louis – Directeur Retail Banking', '04 74 67 89 34', '1 000 €',
 '11 min à pied vers UCM'),

(2, 'UCM', '🧑‍💼', '09:45', '10:15',
 'Bureaux UCM – 9e étage',
 'Boulevard d''Avroy 42 (anciennement 44), 4000 Liège',
 'Tu reçois une grosse commande de 100 000 €. Quelles compétences te manquent et comment vas-tu les intégrer ?',
 '3 min pitch + 2 min Q/R sur les collaborations nécessaires au succès',
 ARRAY['Auto-évaluation','Réalisme','Intégration des compétences dans le projet'],
 ARRAY['Identifier le core business de l''entreprise','Lister les compétences nécessaires pour le mener à bien','Identifier celles qui manquent aujourd''hui','Expliquer comment les intégrer : engager, s''associer, franchiser, sous-traiter, se former…','Support visuel bienvenu sur papier/flipchart — pas de rétroprojecteur, tableau blanc + marqueurs uniquement','Si le projet est une ASBL, parler de ''don'' plutôt que ''commande''','Ne pas oublier de présenter son projet en premier !'],
 'S''entourer est toujours associé à une forme de risque et d''opportunité — il faut y penser avant de choisir le moyen. Options : engager, s''associer, franchiser, etc.',
 ARRAY['Jean-Louis Braibant – Administrateur délégué','Clémence Lux – Juriste','Romane Geurts – Conseillère Consultance CREA','Caroline Scarpulla – Conseillère front office','Dominique Reterre – Office Manager','Marie Tirtiaux – Chargée de projets'],
 'Véronique Jassogne – Gestionnaire commerciale', '04 221 65 57', '1 000 €',
 '2 min à pied vers Wallonie Entreprendre (même avenue)'),

(3, 'Wallonie Entreprendre', '🌍', '10:30', '11:00',
 'Accueil – attendre près du panneau WE et des sofas',
 'Avenue Maurice Destenay 13, 4000 Liège',
 'Pourquoi la Wallonie doit-elle soutenir ton projet ? Pitch en trio : projet – ambition – challenge.',
 '3 min pour exprimer le trio projet-ambition-challenge + 2 min Q/A par les experts',
 ARRAY['Impact pour la Wallonie','Clairvoyance sur les challenges','Capacité à être concret','Capacité à capter l''attention'],
 ARRAY['L''impact sur la région peut être multiple : nombre d''emplois, bénéficiaires touchés, rayonnement de la Wallonie, effet environnemental, chiffre d''affaires…','Notion d''impact large : impact sur la qualité de vie, expertise sectorielle, etc.','Pas de contrainte de temps pour l''impact — ça peut être sur 10 ans, mais bien penser à l''IMPACT (pas ''bien gagner ma vie, vivre de mon métier'')','5 images maximum (1 image par slide, pas de texte). Dessins autorisés.','Un chiffre c''est OK, mais pas jouer (pas d''image avec quelqu''un qui tient du texte)','Chercher le format Pecha Kucha pour inspiration'],
 'Ils peuvent être plus durs qu''ailleurs, parce qu''ils voient les JE comme des entrepreneurs et que les JE ne vont pas forcément être reçus par des papillons IRL. Trio : projet – ambition – challenge.',
 ARRAY['Elea Dormal','Emilie Neuville','Jean-François Desguin'],
 'Jean-François Desguin', '04 71 69 85 21', '1 000 €',
 'Tram T1 direction Sclessin Standard : marche 3 min jusqu''à arrêt Liège Pont d''Avroy → 5 min / 3 arrêts → arrêt Liège Petit Paradis → 1 min à pied'),

(4, 'Loterie Nationale', '🎲', '11:30', '12:00',
 'Hub Liège',
 'Avenue Blonden 84, 4000 Liège',
 'Comment le hasard peut-il métamorphoser ton projet entrepreneurial ?',
 '1 min présentation du projet + 2 min illustration originale du rôle du hasard + 2 min feedback et échange avec le jury',
 ARRAY['Originalité & créativité','Cohérence & pertinence','Innovation','Clarté & intelligibilité'],
 ARRAY['Le hasard est souvent le fruit de rencontres ou d''actions préparées — comment transformer une situation imprévue en opportunité ?','Il existe des moyens d''augmenter les probabilités d''un coup de chance : exposer davantage son entreprise, rencontrer de nouvelles personnes, lancer des initiatives imprévues','Parfois provoquer le hasard c''est simplement oser faire quelque chose de nouveau ou différent','Comment saisir l''inattendu avec audace ?','Slides OK mais pas obligatoires — il faut du storytelling'],
 'Le sujet c''est comment ils ont été chanceux OU comment la chance peut arriver (passé ou futur). Comment mettre en place la chance pour qu''elle ait lieu (ex. pour rencontrer X, je vais à tel événement avec mon produit). Enregistrement sur place, ils peuvent s''entraîner chez eux et prendre des accessoires.',
 ARRAY['Maud Neuprez – Partnership Management','Nicolas Van Lierde – Partnership Manager','Claudyna Yanez Delgado – Partnership Manager','Victoria Baijot – Management Support'],
 'Maud Neuprez – Partnership Management', '04 73 94 58 10', '1 000 €',
 'LUNCH puis Bus B2 de 12h19 : marche 9 min jusqu''à Gare des Guillemins Quai B → 19 min / 12 arrêts → Sart-Tilman Polytech → 16 min à pied jusqu''à EVS'),

(5, 'EVS Broadcast Equipment', '📡', '13:30', '14:00',
 'Bureaux EVS – salle Albert''s Room',
 'Rue du Bois Saint-Jean 13, 4102 Seraing',
 'À quel besoin réponds-tu vraiment et comment te lancer au mieux sur les plateformes digitales ?',
 '1 min pour présenter le besoin auquel ta start-up répond + 2 min stratégie concrète de marketing digital',
 ARRAY['Compréhension et définition du produit/service','Segmentation de l''offre','Utilisation des outils d''IA','Définition d''objectifs clairs','Développement de compétence en marketing digital'],
 ARRAY['On est souvent bon à expliquer pourquoi notre produit est le meilleur du monde, mais moins bon à comprendre à quel besoin précis il répond','Relier la solution aux besoins du public = c''est là que la magie opère','Stratégie concrète : canaux, budget, marché ciblé, comment s''y prendre pratiquement','IA encouragée mais pas obligatoire','Utiliser le 5WHY pour creuser le besoin réel','Ils viennent avec la campagne — genre ils imaginent une vidéo, ils viennent avec la vidéo'],
 'Ils peuvent utiliser un exemple qu''ils ont vraiment fait, mais il faut bien s''interroger : est-ce que c''est bien la meilleure stratégie pour leur projet ET pour le challenge ici ?',
 ARRAY['Justin Mannesberg – Head of Global Business Operations & Sales Enablement','Julien Legras – Senior Digital Media Lead','Sébastien Mandiaux – Senior Cross-Portfolio Product & Innovation Manager'],
 'Justin Mannesberg – Head of Global Business Operations & Sales Enablement', '04 90 58 48 04', '1 000 €',
 'Voiture VentureLab (Volkswagen Caravelle avec affiches VentureLab). Chauffeur Robin Prgomet sur le groupe WhatsApp.'),

(6, 'Defenso (DBB)', '⚖️', '14:30', '15:00',
 'Bureaux Defenso',
 'Place George Ista 28, 4030 Liège',
 'Anticipe 3 problèmes qui peuvent faire échouer ton projet et propose des pistes de solutions pour transformer ces risques en opportunités.',
 '1 min présentation du projet + 2 min présentation d''un risque choisi et des solutions + 2 min le jury challenge sur le risque',
 ARRAY['Se projeter','Anticiper les risques','Trouver des solutions','Voir l''opportunité dans la difficulté'],
 ARRAY['Le risque doit être commercial ou de production — pas technique, pas ''avoir 0 client''. Si on a besoin d''avoir une technique, on dit qu''elle est développée.','Bien mettre 3 risques (production ou commercial) sur la fiche, mais n''en présenter qu''UN SEUL au choix oralement','Croissance ≠ création du projet','Le JE sera face à des avocats, mais il ne doit pas être expert juridique — ils veulent que le JE réfléchisse et anticipe les risques','C''est vraiment dans le ''c''est mieux d''aller voir un avocat avant les problèmes''','On laisse la fiche risques/solutions — donc il faut que ce soit bien lisible','Un entrepreneur est quelqu''un qui sent bien où sont les soucis et se met en exploration le cas échéant'],
 'Face à des avocats. Le JE ne doit pas être expert juridique, mais montrer qu''il anticipe. Fiche à laisser sur place donc elle doit être lisible.',
 ARRAY['Samuel van Durme – droit bancaire et des affaires','Sarah Méan – droit des affaires et des sociétés','Benoît Delacroix – droit des assurances','Clémentine Waxweiler – droit des biens et des successions'],
 'Samuel van Durme', '04 252 74 29', '1 000 €',
 'Bus Ligne 17 de 15h19 direction République Française : marche 6 min jusqu''à arrêt Grivegnée Rue du Falchena → 7 min / 7 arrêts → arrêt Pont de Longdoz → 6 min à pied jusqu''au VentureLab'),

(7, 'AKT CCI Liège-Verviers-Namur', '🤝', '16:00', '16:30',
 'QG VentureLab – Salle des Métamorphoses (rez-de-chaussée)',
 'Rue des Carmes 24, 4000 Liège',
 'King du Networking : 15 minutes de networking réel avec des entrepreneurs de la région, puis feedback du jury.',
 '15 min networking live + 1,5 min retour/feedback par le jury',
 ARRAY['Bonnes capacités de networking','Approche professionnelle organisée','Adaptation à l''audience'],
 ARRAY['En networking IRL on ne rencontre que des inconnus, donc ne pas jouer le mauvais acteur','Ce qui est important ici c''est pas de se présenter ou de présenter l''autre, mais de faire du lien autour de la table (d''où l''importance de se renseigner sur les participants de AKT CCI)','Après l''activité, ils font un retour sur comment ils ont utilisé leurs 15 minutes','Le networking se prépare : AKT-CCI LVN envoie par mail une fiche qui contient tout ce qu''il faut','L''attitude compte ! La posture et l''écoute sont liées, faites-en bon usage'],
 'Ils reçoivent les participants vendredi, qu''ils aillent bien voir les participants et des conseils en networking pendant le week-end. Ils vont chercher des entrepreneurs de la région, moment de rencontre et networking. Capacité à faire du lien, être bon connecteur. Il faut montrer qu''on apporte à son réseau, pas qu''on sait le mieux parler de soi, mais le mieux mettre en relation.',
 ARRAY['Personnes mystères à découvrir dans les mails'],
 'Céline Kuetgens – directrice opérationnelle', '04 99 13 80 89', '1 000 €',
 'Porte à côté (même bâtiment VentureLab)'),

(8, 'VEDIA', '🎬', '16:30', '17:00',
 'QG VentureLab – Salle des Créations (1er étage)',
 'Rue des Carmes 24, 4000 Liège',
 'Plateau TV : vous tirez une carte décrivant une mauvaise nouvelle fictive liée à votre projet. Vous avez 60s pour la lire et l''intégrer, puis vous pitchez face caméra en intégrant cette mauvaise nouvelle. 1 min 30 top chrono.',
 '60s lecture de la carte + 4 min préparation + 1 min 30 face caméra (une seule prise, pas de recommencement)',
 ARRAY['Résilience','Force de conviction','Authenticité','Gestion du stress'],
 ARRAY['La mauvaise nouvelle n''est pas une fin — c''est un rebondissement. Les meilleurs pitchs sont ceux où on voit quelqu''un se relever.','Garder les yeux dans la caméra, quoi qu''il arrive. C''est là que se joue la conviction.','Vidéo de conseils face caméra disponible : https://vediapro.be/road-to-business','Pour les groupes, une seule personne passe devant la caméra','Une fois qu''ils disent ''on y va'' c''est la prise et ils ne peuvent pas recommencer'],
 'Ils s''enregistrent sur place. Ils peuvent s''entraîner chez eux et prendre des accessoires.',
 ARRAY['Quentin Boniver – Responsable Communication','Sandro Giarratana'],
 'Quentin Boniver – Chargé de communication', '04 99 10 77 68', '1 000 €',
 'Déjà au VentureLab → verre de clôture à 18h00');

-- Projects
INSERT INTO projects (name, members, description) VALUES
('LaJusteDose', 'Mélodie Kubushishi', 'Solutions low-tech pour sécuriser et simplifier la distribution et la prise de médicaments. Pilulier multi-médicaments et chariot optimisé pour maisons de repos. Vise à améliorer le quotidien des soignants et l''autonomie des personnes âgées.'),
('VILO', 'Guillaume Vilet', 'Plateforme mobile-first dédiée à la centralisation et valorisation du contenu généré par les utilisateurs lors d''événements. Modèle freemium permettant aux organisateurs, DJ et participants de partager, accéder et réutiliser photos et vidéos.'),
('Bissap Origins', 'Elvis Amaizo, Boubacar Bah, Emmanuel Devo, Matteo Raffaelli', 'Valorise l''hibiscus africain à travers des boissons naturelles, locales et responsables. Marque moderne, saine et durable, alliant tradition, qualité et impact social pour promouvoir le savoir-faire local.'),
('Camille Changeur Photographe', 'Camille Changeur', 'Photographe spécialisée dans les animaux de compagnie.');

-- Challenge statuses (all upcoming initially)
INSERT INTO challenge_status (challenge_id, status) VALUES
(1, 'upcoming'), (2, 'upcoming'), (3, 'upcoming'), (4, 'upcoming'),
(5, 'upcoming'), (6, 'upcoming'), (7, 'upcoming'), (8, 'upcoming');

-- Checklist items

-- Challenge 1: BNP Paribas Fortis
INSERT INTO checklist_items (challenge_id, label) VALUES
(1, 'Rappeler : pas de support visuel, pitch oral uniquement'),
(1, 'Vérifier que chacun a structuré son pitch (problème → valeur → pour qui)'),
(1, 'Chiffres concrets prêts pour le Q/A'),
(1, 'CTA clair préparé'),
(1, 'Rappel : 3 min max, timing strict'),
(1, 'Rappel : présenter son projet d''abord'),
(1, 'Rappeler la plus-value du projet (focus jury cette année)'),
(1, 'Ne pas parler après le passage (les autres passent encore)');

-- Challenge 2: UCM
INSERT INTO checklist_items (challenge_id, label) VALUES
(2, 'Identifier le core business + compétences nécessaires'),
(2, 'Lister les compétences manquantes + solutions (engager, s''associer, franchiser, sous-traiter, se former)'),
(2, 'Support visuel papier/flipchart préparé (pas de PPT)'),
(2, 'Si ASBL → parler de "don" pas "commande"'),
(2, 'Ne pas oublier la présentation du projet en premier'),
(2, 'Réfléchir aux risques et opportunités de s''entourer');

-- Challenge 3: Wallonie Entreprendre
INSERT INTO checklist_items (challenge_id, label) VALUES
(3, 'Trio projet-ambition-challenge structuré'),
(3, 'Slides prêtes (5 images max, pas de texte, dessins OK)'),
(3, 'Données d''impact chiffrées (emplois, CA, bénéficiaires, rayonnement)'),
(3, 'Rappel : impact = large (qualité de vie, expertise, 10 ans OK)'),
(3, 'Pas de texte sur les slides, juste des images'),
(3, 'Se préparer à un jury plus exigeant qu''ailleurs');

-- Challenge 4: Loterie Nationale
INSERT INTO checklist_items (challenge_id, label) VALUES
(4, 'Angle "hasard" trouvé (passé OU futur)'),
(4, 'Storytelling préparé (pas juste des slides)'),
(4, 'Accessoires/props si pertinents'),
(4, 'Comment mettre en place la chance pour qu''elle ait lieu'),
(4, 'Enregistrement sur place — possibilité de s''entraîner avant'),
(4, 'Rappel : 1 min projet + 2 min hasard + 2 min feedback');

-- Challenge 5: EVS
INSERT INTO checklist_items (challenge_id, label) VALUES
(5, 'Besoin client clairement identifié (pas juste "mon produit est génial")'),
(5, 'Stratégie marketing digital concrète (canaux, budget, cible)'),
(5, 'Campagne prête si possible (vidéo, visuel…)'),
(5, 'Rappel : IA encouragée mais pas obligatoire'),
(5, 'Utiliser le 5WHY pour creuser le besoin réel'),
(5, 'Vérifier que la stratégie est adaptée au challenge (pas juste un exemple passé)');

-- Challenge 6: Defenso
INSERT INTO checklist_items (challenge_id, label) VALUES
(6, '3 risques identifiés (commercial ou production, PAS technique)'),
(6, '1 risque choisi pour la présentation orale'),
(6, 'Pistes de solutions pour chaque risque'),
(6, 'Fiche risques/solutions lisible (on la laisse sur place !)'),
(6, 'Rappel : pas de risque "croissance" (≠ création du projet)'),
(6, 'Rappel : face à des avocats, montrer qu''on anticipe, pas être expert juridique');

-- Challenge 7: AKT CCI
INSERT INTO checklist_items (challenge_id, label) VALUES
(7, 'Fiche participants AKT CCI consultée'),
(7, 'Rappel : faire du LIEN, pas juste se présenter'),
(7, 'Posture d''écoute et de connexion'),
(7, 'Se renseigner sur les participants avant le jour J'),
(7, 'Montrer qu''on apporte à son réseau, pas qu''on parle de soi'),
(7, 'L''attitude et la posture comptent énormément');

-- Challenge 8: VEDIA
INSERT INTO checklist_items (challenge_id, label) VALUES
(8, 'Rappel : 1 personne par groupe face caméra'),
(8, 'Entraînement face caméra fait'),
(8, 'Rappel : une seule prise, pas de recommencement'),
(8, 'Yeux dans la caméra, toujours'),
(8, 'Vidéo conseils visionnée (vediapro.be/road-to-business)'),
(8, 'Accessoires/props préparés si pertinents'),
(8, 'Rappel : 60s lecture carte + 4 min préparation + 1m30 face caméra');
