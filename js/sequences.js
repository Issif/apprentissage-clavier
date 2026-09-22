/**
 * Génération des séquences a reproduire.
 *
 * Progression pédagogique classique du doigté :
 *   1-2  rangée de repos, puis ses extensions (index qui s'étirent)
 *   3-4  rangée du haut, puis rangée du bas
 *   5-6  vrais mots francais, d'abord sans puis avec accents
 *   7    phrases avec majuscules et ponctuation
 *
 * Les niveaux "words" et "phrases" filtrent le vocabulaire sur les lettres
 * déjà apprises : on ne demande jamais une touche qui n'a pas ete travaillée.
 */

const WORDS = [
  'abri', 'acteur', 'addition', 'affiche', 'aigle', 'aile', 'album', 'allumette', 'alphabet',
  'ambulance', 'ami', 'ampoule', 'ananas', 'ane', 'animal', 'anniversaire', 'antilope',
  'appareil', 'arbre', 'arbuste', 'armoire', 'arrosoir', 'ascenseur', 'assiette', 'atelier',
  'auto', 'autobus', 'automne', 'aventure', 'avion', 'bagage', 'baguette', 'baignoire',
  'balai', 'balcon', 'balle', 'ballon', 'bambou', 'banane', 'banc', 'bandeau', 'barbe',
  'barque', 'bassin', 'bateau', 'bavoir', 'beurre', 'biberon', 'bicyclette', 'bijou', 'bille',
  'biscuit', 'blanc', 'bleu', 'blouse', 'bocal', 'bois', 'boisson', 'boite', 'bol', 'bonbon',
  'bonhomme', 'bonnet', 'botte', 'bouche', 'bouchon', 'boucle', 'bougie', 'boule', 'boulon',
  'bouquet', 'bourgeon', 'boussole', 'bouton', 'branche', 'bras', 'brique', 'brosse',
  'brouette', 'brouillard', 'bruit', 'buisson', 'bureau', 'bus', 'cabane', 'cactus', 'cadeau',
  'cahier', 'caillou', 'caisse', 'calcul', 'calendrier', 'camion', 'campagne', 'canal',
  'canard', 'canari', 'canne', 'capitaine', 'capuche', 'caramel', 'caravane', 'carnaval',
  'carotte', 'carreau', 'cartable', 'carte', 'carton', 'casque', 'casquette', 'castor',
  'ceinture', 'cerceau', 'cerise', 'chaise', 'chambre', 'champ', 'champignon', 'chandelle',
  'chanson', 'chapeau', 'chariot', 'charrette', 'chat', 'chaton', 'chaud', 'chaussette',
  'chaussure', 'chemin', 'chemise', 'cheval', 'cheveu', 'chien', 'chiffre', 'chocolat', 'chou',
  'ciel', 'cigogne', 'ciseaux', 'citron', 'citrouille', 'clairon', 'classe', 'clavier',
  'cloche', 'clou', 'clown', 'cochon', 'coeur', 'coffre', 'colle', 'collier', 'colline',
  'colombe', 'commode', 'concert', 'confiture', 'copain', 'coquelicot', 'coquillage',
  'corbeau', 'corbeille', 'corde', 'corne', 'costume', 'coton', 'couleur', 'couloir', 'coupe',
  'cour', 'courage', 'couronne', 'cousin', 'coussin', 'couteau', 'couverture', 'crabe',
  'craie', 'crapaud', 'crayon', 'crevette', 'crocodile', 'cube', 'cuisine', 'cygne', 'dauphin',
  'dent', 'dessert', 'dessin', 'diamant', 'dinosaure', 'doigt', 'dos', 'dragon', 'drapeau',
  'eau', 'ecole', 'encre', 'enfant', 'escalier', 'escargot', 'espace', 'famille', 'farine',
  'fauteuil', 'ferme', 'feu', 'feuille', 'ficelle', 'figure', 'filet', 'fille', 'film',
  'flamme', 'fleur', 'flocon', 'fontaine', 'football', 'foret', 'fourchette', 'fourmi',
  'fourrure', 'fraise', 'framboise', 'frere', 'fromage', 'fruit', 'galet', 'gant', 'garage',
  'gateau', 'gazon', 'genou', 'girafe', 'glace', 'globe', 'gomme', 'grand', 'grenier',
  'grenouille', 'griffe', 'grillon', 'groseille', 'grotte', 'guitare', 'hamac', 'hameau',
  'haricot', 'harpe', 'hasard', 'hauteur', 'herbe', 'hibou', 'hippopotame', 'histoire',
  'hiver', 'horloge', 'hublot', 'huile', 'igloo', 'image', 'insecte', 'instrument', 'jambe',
  'jambon', 'jardin', 'jardinier', 'jaune', 'jeu', 'jongleur', 'joue', 'jouet', 'jour',
  'journal', 'judo', 'jumeau', 'jungle', 'jupe', 'kangourou', 'koala', 'lac', 'laine', 'lait',
  'laitue', 'lampe', 'lanterne', 'lapin', 'larme', 'lavabo', 'lettre', 'libellule', 'licorne',
  'limace', 'linge', 'lion', 'liste', 'livre', 'loup', 'loutre', 'lune', 'lutin', 'machine',
  'magasin', 'magie', 'maillot', 'main', 'maison', 'malle', 'manche', 'mandarine', 'manteau',
  'marche', 'marin', 'marmite', 'marteau', 'masque', 'matin', 'melon', 'menton', 'mer',
  'mesure', 'meuble', 'micro', 'midi', 'miel', 'miette', 'mimosa', 'minute', 'miroir', 'monde',
  'monstre', 'montagne', 'mot', 'moto', 'mouche', 'mouchoir', 'moufle', 'moulin', 'moustache',
  'mouton', 'mur', 'musique', 'nappe', 'narine', 'navire', 'neige', 'nez', 'nid', 'niveau',
  'noisette', 'noix', 'nombre', 'nounours', 'nuage', 'nuit', 'oeuf', 'oignon', 'oiseau',
  'olive', 'ombre', 'ombrelle', 'oncle', 'ongle', 'orage', 'orange', 'ordinateur', 'oreille',
  'oreiller', 'orteil', 'ortie', 'otarie', 'ouragan', 'ours', 'outil', 'ouvrier', 'page',
  'paille', 'pain', 'palais', 'panda', 'panier', 'pantalon', 'pantoufle', 'papier', 'papillon',
  'paquet', 'parachute', 'parapluie', 'parc', 'parfum', 'patin', 'patte', 'peau', 'pelle',
  'pelouse', 'peluche', 'pendule', 'perle', 'perroquet', 'phare', 'pharmacie', 'photo',
  'phrase', 'piano', 'pied', 'pierre', 'pigeon', 'pilote', 'pinceau', 'pingouin', 'pirate',
  'piscine', 'pizza', 'planche', 'plante', 'plateau', 'pluie', 'plume', 'poche', 'poire',
  'poireau', 'poisson', 'poivre', 'pomme', 'pompier', 'poney', 'pont', 'porte', 'poste',
  'potage', 'poubelle', 'pouce', 'poudre', 'poule', 'poulet', 'poussin', 'prairie', 'prince',
  'princesse', 'prune', 'puzzle', 'pyjama', 'quatre', 'quille', 'racine', 'radio', 'radis',
  'rail', 'raisin', 'rame', 'rampe', 'raquette', 'rayon', 'recette', 'reine', 'remorque',
  'renard', 'renne', 'requin', 'rideau', 'rire', 'robe', 'rocher', 'roi', 'rose', 'roue',
  'rouge', 'route', 'ruban', 'ruche', 'ruisseau', 'sable', 'sac', 'saison', 'salade', 'salle',
  'salon', 'sandale', 'sandwich', 'sanglier', 'sapin', 'sardine', 'sauce', 'saucisse', 'saut',
  'sauterelle', 'savane', 'savon', 'scie', 'seau', 'semaine', 'sentier', 'serpent',
  'serviette', 'sifflet', 'singe', 'sirop', 'ski', 'soeur', 'soir', 'soleil', 'souffle',
  'soupe', 'sourire', 'souris', 'spectacle', 'sport', 'statue', 'stylo', 'sucre', 'table',
  'tabouret', 'taille', 'tambour', 'tante', 'tapis', 'tarte', 'tasse', 'taupe', 'taxi',
  'temps', 'tente', 'terre', 'tete', 'tigre', 'timbre', 'tiroir', 'toit', 'tomate', 'tonneau',
  'tortue', 'tournesol', 'tracteur', 'train', 'tricot', 'trois', 'trompette', 'tronc',
  'trottoir', 'trousse', 'truite', 'tulipe', 'tunnel', 'usine', 'vacances', 'vache', 'vague',
  'valise', 'vanille', 'vase', 'veau', 'vendredi', 'vent', 'ventre', 'verger', 'verre', 'vert',
  'viande', 'village', 'ville', 'vitre', 'voile', 'voisin', 'voiture', 'volant', 'volcan',
  'voyage', 'vue', 'wagon', 'yaourt', 'zebre', 'zoo',
];

const WORDS_ACCENTS = [
  'balançoire', 'bébé', 'blé', 'ça', 'café', 'caleçon', 'canapé', 'carré', 'céréale', 'chéri',
  'chèvre', 'cinéma', 'clé', 'comédie', 'début', 'décor', 'défilé', 'déjà', 'déjeuner',
  'délice', 'détail', 'échelle', 'éclair', 'école', 'écolier', 'écolière', 'écran', 'écureuil',
  'église', 'élastique', 'éléphant', 'élève', 'énergie', 'épaule', 'épée', 'épi', 'épicerie',
  'épine', 'éponge', 'équipe', 'érable', 'étable', 'étage', 'étagère', 'étang', 'été',
  'étoile', 'étude', 'éventail', 'façade', 'fée', 'flèche', 'français', 'française', 'frère',
  'fusée', 'garçon', 'géant', 'général', 'glaçon', 'hameçon', 'hélicoptère', 'hérisson',
  'héros', 'idée', 'infirmière', 'jardinière', 'journée', 'là', 'leçon', 'légume', 'lézard',
  'limaçon', 'lumière', 'maçon', 'matinée', 'mélodie', 'ménage', 'mère', 'météo', 'mètre',
  'métro', 'misère', 'moitié', 'numéro', 'océan', 'opéra', 'pédale', 'père', 'période',
  'pièce', 'piège', 'poésie', 'poupée', 'pré', 'préau', 'première', 'prénom', 'problème',
  'purée', 'récré', 'récréation', 'reçu', 'règle', 'réveil', 'rivière', 'rosée', 'salé',
  'sécurité', 'séjour', 'sévère', 'siège', 'sirène', 'soirée', 'sorcière', 'sucré', 'télé',
  'téléphone', 'télévision', 'thé', 'trésor', 'véhicule', 'vélo', 'vérité', 'verrière',
  'voilà', 'zèbre',
];

/* Mots composes : les seuls ou l'apostrophe et le trait d'union sont naturels. */
const COMPOSED = [
  'abat-jour', 'après-midi', 'arc-en-ciel', "aujourd'hui", 'basse-cour', "c'est",
  'cerf-volant', 'chauve-souris', 'coffre-fort', "d'abord", "d'accord", 'demi-heure',
  'grand-mère', 'grand-père', "j'aime", "l'ami", "l'année", "l'arbre", "l'école", "l'enfant",
  "l'étoile", "l'histoire", "l'hiver", "l'image", "l'oiseau", "l'orange", "l'ours",
  'petit-fils', 'pique-nique', 'porte-clé', 'porte-monnaie', "qu'il", 'rez-de-chaussée',
  "s'il", 'sous-bois', 'timbre-poste', 'tire-bouchon', 'va-et-vient', 'wagon-lit', 'week-end',
];

/* Signes simples (colles au mot) et signes doubles (precedes d'une espace,
   comme le veut la typographie francaise). */
const SIGNS_SIMPLE = ['.', ','];
const SIGNS_DOUBLE = [';', ':', '!', '?'];

const PHRASES = [
  'Le chat dort sur le tapis.',
  'Mon frère joue dans le jardin.',
  'La lune brille dans la nuit.',
  'Le renard court dans la neige.',
  'Un oiseau chante sur la branche.',
  'Nous mangeons une pomme rouge.',
  'Le petit lapin mange une carotte.',
  'La pluie tombe sur la ville.',
  'Papa prépare une tarte au chocolat.',
  'Les enfants jouent à la balle.',
  'Le soleil se lève sur la mer.',
  "Ma cousine lit un livre d'images.",
  'Le chien aboie derrière la porte.',
  'Une souris grise court sous la table.',
  'Les poissons nagent dans le grand bassin.',
  'Mon cartable est lourd ce matin.',
  'Le professeur écrit au tableau.',
  'Nous plantons des fleurs dans le jardin.',
  "Le vent souffle très fort aujourd'hui.",
  'Ma grand-mère prépare une bonne soupe.',
  'Les oiseaux partent vers le sud.',
  'Je range mes jouets dans la caisse.',
  'Le facteur apporte une lettre.',
  'Un papillon se pose sur la fleur.',
  'Les vaches broutent dans le pré.',
  'Mon vélo a une roue crevée.',
  'La neige recouvre tout le village.',
  'Nous allons à la piscine le mercredi.',
  'Le boulanger sort le pain du four.',
  'Une araignée tisse sa toile.',
  'Les étoiles brillent au-dessus de la maison.',
  'Mon chat dort près du radiateur.',
  'Papa répare la porte du garage.',
  'La tortue avance très lentement.',
  'Les élèves lèvent la main.',
  "Je bois un grand verre d'eau.",
  'Le clown fait rire tous les enfants.',
  'Une abeille butine dans le jardin.',
  'Nous ramassons des feuilles mortes.',
  'Le train entre dans la gare.',
  'Ma cousine joue de la guitare.',
  'Les pompiers arrivent très vite.',
  'Le poussin sort de sa coquille.',
  'Je colorie un dessin de dinosaure.',
  'La lune éclaire le sentier.',
  "Un écureuil grimpe dans l'arbre.",
  'Nous chantons une chanson ensemble.',
  'La tarte sent très bon.',
  'Les enfants courent dans la cour.',
  'Mon frère apprend à nager.',
  'La pluie a mouillé mes chaussures.',
  'Le renard se cache derrière un buisson.',
];

const NUMBER_PHRASES = [
  "J'ai 8 ans et 3 chats.",
  'Le train part à 7 h 15.',
  'Il y a 24 élèves dans la classe.',
  'Mon record : 120 mots par minute !',
  "2 + 3 = 5, c'est facile.",
  'Papa a 40 ans, maman en a 38.',
  'Combien font 9 x 6 ? 54 !',
  'Rendez-vous le 14 juillet à 20 h.',
  "Le code est 4-7-2-9, ne l'oublie pas !",
  'La récré dure 15 minutes, pas 30 !',
  'Il est 9 h 30, on part !',
  "Je compte jusqu'à 100 sans erreur.",
  'La course dure 45 minutes.',
  'Il reste 12 places dans le bus.',
  '10 - 4 = 6, bravo !',
  'La piscine ouvre à 14 h.',
  'Nous sommes 27 dans la classe.',
  'Le livre a 250 pages.',
  'Maman achète 6 pommes et 2 poires.',
  'Le film commence à 20 h 45.',
  "J'ai gagné 3 parties sur 5.",
  'La tour mesure 300 mètres.',
  'Il y a 7 jours dans une semaine.',
  'Mon anniversaire est le 23 mars.',
  '5 x 5 = 25, facile !',
  'Le train de 8 h 12 est en retard.',
  'Nous avons marché 11 kilomètres.',
  'La recette demande 250 g de farine.',
  'Il fait 18 degrés ce matin.',
  'Range les 4 cahiers et les 2 stylos.',
];

/* Symboles AltGr retenus. Les touches mortes du troisieme niveau (~ ` ^) sont
   ecartees : elles demandent deux frappes et ne sont pas au programme. */
const ALTGR = ['@', '#', '{', '}', '[', ']', '|', '\\', '€'];

const SYMBOL_PHRASES = [
  'louis.martin@exemple.fr',
  'Ce jeu vaut 12 €.',
  'Mon dossier : C:\\jeux\\mario',
  '5 € + 3 € = 8 €',
  '[1] [2] [3] on y va !',
  '{ début } et { fin }',
  'papa@maison.fr et moi@ecole.fr',
  '|--- le mur ---|',
  '# canal : bricolage',
  'Le prix est de 100 € [promo].',
  'marie.dupont@ecole.fr',
  'Le total fait 25 €.',
  '[a] [b] [c] et voilà !',
  '{ ouvre } { ferme }',
  'C:\\photos\\vacances',
  '20 € - 5 € = 15 €',
  '# jeux # musique # sport',
  'contact@mairie.fr',
  '| gauche | droite |',
  'D:\\ecole\\devoirs',
  'Prix : 9 € [soldes]',
  '{ début } { milieu } { fin }',
  'Mon adresse : lea@exemple.fr',
  '1 € + 2 € + 3 € = 6 €',
  '# canal : dessin # canal : lecture',
  'Les clés sont [ici] et [là].',
  'papa@travail.fr | maman@travail.fr',
  '[oui] [non] [zut]',
  'Le chemin est E:\\jeux\\course',
  'Total : 75 € { paye }',
];

export const LEVELS = [
  {
    id: 1, name: 'La rangée de repos', mode: 'letters',
    chars: 'qsdfjklm', hint: 'Pose tes doigts sur q s d f et j k l m. Ne les bouge pas !',
  },
  {
    id: 2, name: 'Les index s’étirent', mode: 'letters',
    chars: 'qsdfghjklm', hint: 'Les index vont chercher g et h, puis reviennent à leur place.',
  },
  {
    id: 3, name: 'La rangée du haut', mode: 'letters',
    chars: 'azertyuiopqsdfghjklm', hint: 'Monte les doigts vers a z e r t y u i o p, puis redescends.',
  },
  {
    id: 4, name: 'La rangée du bas', mode: 'letters',
    chars: 'azertyuiopqsdfghjklmwxcvbn', hint: 'Toutes les lettres sont là ! Descends vers w x c v b n.',
  },
  {
    id: 5, name: 'De vrais mots', mode: 'words', source: WORDS,
    chars: 'abcdefghijklmnopqrstuvwxyz ', hint: 'Des mots entiers. Le pouce frappe la barre d’espace.',
  },
  {
    id: 6, name: 'Les accents', mode: 'words', source: WORDS_ACCENTS,
    chars: 'abcdefghijklmnopqrstuvwxyzéèàç ', hint: 'Les touches accentuées sont sur la rangée des chiffres.',
  },
  {
    id: 7, name: 'La ponctuation', mode: 'punct',
    chars: null, hint: 'Le point et le point d’interrogation demandent la touche Maj.',
  },
  {
    id: 8, name: 'Les chiffres', mode: 'digits',
    chars: null, hint: 'Sur un clavier AZERTY, les chiffres se tapent avec Maj.',
  },
  {
    id: 9, name: 'Des phrases', mode: 'phrases', source: PHRASES,
    chars: null, hint: 'Majuscules avec Maj (Shift) de la main opposée, et point final !',
  },
  {
    id: 10, name: 'Phrases et nombres', mode: 'phrases', source: NUMBER_PHRASES,
    chars: null, hint: 'On mélange tout : lettres, chiffres et ponctuation.',
  },
  {
    id: 11, name: 'Les touches AltGr', mode: 'altgr',
    chars: null, hint: 'Garde AltGr (à droite de la barre d’espace) enfoncé avec le pouce droit.',
  },
  {
    id: 12, name: 'Comme un pro', mode: 'phrases', source: SYMBOL_PHRASES,
    chars: null, hint: 'Adresses e-mail, prix et accolades : tout le clavier y passe !',
  },
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

/**
 * Tirage qui ne ressert jamais la proposition precedente. Un tirage purement
 * aleatoire redonne la meme phrase deux fois de suite une fois sur N, et c'est
 * ce qui donne l'impression de tourner en rond, bien avant d'avoir fait le tour
 * de la liste. La memoire est gardee par niveau, car `level.source` est refiltre
 * a chaque appel et ne peut donc pas servir de cle.
 */
const lastPicked = new Map();

function pickFresh(list, key) {
  if (list.length < 2) return list[0];
  let value;
  do { value = pick(list); } while (value === lastPicked.get(key));
  lastPicked.set(key, value);
  return value;
}

/** Suites de lettres groupées, faciles à lire pour un enfant : "fjfj djdj kfkd". */
function letterSequence(chars, groups = 3, size = 4) {
  const out = [];
  for (let g = 0; g < groups; g++) {
    let group = '';
    let previous = '';
    for (let i = 0; i < size; i++) {
      let c;
      do { c = pick(chars.split('')); } while (c === previous && chars.length > 2);
      previous = c;
      group += c;
    }
    out.push(group);
  }
  return out.join(' ');
}

const fits = (text, chars) => !chars || [...text.toLowerCase()].every((c) => chars.includes(c));

/** Mots suivis d'un signe de ponctuation : "lune, sel. l'ami !" */
function punctSequence(groups = 3) {
  const out = [];
  for (let g = 0; g < groups; g++) {
    const word = Math.random() < 0.35 ? pick(COMPOSED) : pick(WORDS);
    out.push(Math.random() < 0.5
      ? word + pick(SIGNS_SIMPLE)
      : `${word} ${pick(SIGNS_DOUBLE)}`);
  }
  return out.join(' ');
}

/** Groupes de chiffres de longueur variable : "47 1250 803" */
function digitSequence(groups = 3) {
  const out = [];
  for (let g = 0; g < groups; g++) {
    const size = 2 + Math.floor(Math.random() * 3);
    let group = '';
    for (let i = 0; i < size; i++) group += String(Math.floor(Math.random() * 10));
    out.push(group);
  }
  return out.join(' ');
}

/** Groupes de symboles AltGr : "@# [] €| {}" */
function altgrSequence(groups = 4, size = 2) {
  const out = [];
  for (let g = 0; g < groups; g++) {
    let group = '';
    for (let i = 0; i < size; i++) group += pick(ALTGR);
    out.push(group);
  }
  return out.join(' ');
}

export function nextSequence(level) {
  if (level.mode === 'letters') return letterSequence(level.chars);
  if (level.mode === 'altgr') return altgrSequence();
  if (level.mode === 'punct') return punctSequence();
  if (level.mode === 'digits') return digitSequence();

  if (level.mode === 'words') {
    const usable = level.source.filter((w) => fits(w, level.chars));
    const words = [];
    while (words.length < 3) {
      const w = pick(usable);
      if (!words.includes(w)) words.push(w);
    }
    return words.join(' ');
  }

  return pickFresh(level.source.filter((p) => fits(p, level.chars)), level.id);
}
