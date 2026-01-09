// Classification des familles mythologiques basée sur l'origine
const MYTHOLOGICAL_FAMILIES = {
  GREEK: {
    name: 'Greek Mythology',
    keywords: ['greek', 'greece', 'olymp', 'athens', 'sparta', 'hellenic']
  },
  NORSE: {
    name: 'Norse Mythology',
    keywords: ['norse', 'viking', 'scandinavia', 'asgard', 'valhalla', 'nordic']
  },
  CELTIC: {
    name: 'Celtic Mythology',
    keywords: ['celtic', 'ireland', 'scotland', 'welsh', 'druid', 'gaelic']
  },
  EGYPTIAN: {
    name: 'Egyptian Mythology',
    keywords: ['egypt', 'nile', 'pharaoh', 'pyramid', 'cairo']
  },
  JAPANESE: {
    name: 'Japanese Mythology',
    keywords: ['japan', 'shinto', 'yokai', 'oni', 'kitsune', 'japanese']
  },
  CHINESE: {
    name: 'Chinese Mythology',
    keywords: ['china', 'chinese', 'dragon', 'jade', 'emperor']
  },
  SLAVIC: {
    name: 'Slavic Mythology',
    keywords: ['slavic', 'russia', 'poland', 'czech', 'baba yaga']
  },
  UNKNOWN: {
    name: 'Unknown Origin',
    keywords: []
  }
};

// Sous-types basés sur les caractéristiques
const SUBTYPES = {
  BEAST: ['dragon', 'wolf', 'serpent', 'lion', 'bear', 'beast', 'creature'],
  HUMANOID: ['giant', 'troll', 'ogre', 'cyclops', 'titan', 'dwarf', 'elf'],
  SPIRIT: ['ghost', 'spirit', 'phantom', 'wraith', 'specter', 'soul'],
  HYBRID: ['centaur', 'minotaur', 'sphinx', 'griffin', 'chimera', 'mermaid', 'harpy'],
  UNDEAD: ['zombie', 'vampire', 'skeleton', 'lich', 'revenant', 'undead'],
  ELEMENTAL: ['fire', 'water', 'earth', 'air', 'ice', 'lightning', 'elemental'],
  DIVINE: ['god', 'goddess', 'deity', 'angel', 'celestial', 'divine']
};

// Branches d'influence
const INFLUENCE_BRANCHES = {
  PROTECTOR: ['guardian', 'protector', 'defender', 'shield', 'benevolent', 'good'],
  DESTROYER: ['destroyer', 'terror', 'death', 'chaos', 'evil', 'malevolent'],
  TRICKSTER: ['trickster', 'mischief', 'cunning', 'deceiver', 'shapeshifter'],
  NATURE: ['forest', 'nature', 'animal', 'wild', 'natural', 'earth'],
  WISDOM: ['wise', 'knowledge', 'oracle', 'seer', 'prophet', 'sage']
};

const classifyFamily = (creature) => {
  const origin = (creature.origin || '').toLowerCase();
  const name = creature.name.toLowerCase();

  for (const [key, family] of Object.entries(MYTHOLOGICAL_FAMILIES)) {
    if (key === 'UNKNOWN') continue;
    for (const keyword of family.keywords) {
      if (origin.includes(keyword) || name.includes(keyword)) {
        return { code: key, name: family.name };
      }
    }
  }

  return { code: 'UNKNOWN', name: MYTHOLOGICAL_FAMILIES.UNKNOWN.name };
};

const classifySubtype = (creature, testimonies) => {
  const name = creature.name.toLowerCase();
  const descriptions = testimonies.map(t => (t.description || '').toLowerCase()).join(' ');
  const combined = `${name} ${descriptions}`;

  const matchedSubtypes = [];

  for (const [subtype, keywords] of Object.entries(SUBTYPES)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword)) {
        matchedSubtypes.push(subtype);
        break;
      }
    }
  }

  return matchedSubtypes.length > 0 ? matchedSubtypes : ['UNCLASSIFIED'];
};

const classifyInfluence = (creature, testimonies) => {
  const descriptions = testimonies.map(t => (t.description || '').toLowerCase()).join(' ');
  const combined = `${creature.name.toLowerCase()} ${descriptions}`;

  const matchedBranches = [];

  for (const [branch, keywords] of Object.entries(INFLUENCE_BRANCHES)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword)) {
        matchedBranches.push(branch);
        break;
      }
    }
  }

  return matchedBranches.length > 0 ? matchedBranches : ['NEUTRAL'];
};

const extractKeywords = (testimonies) => {
  const wordCount = {};
  const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'between',
    'and', 'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither',
    'not', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also',
    'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'they', 'we'];

  for (const testimony of testimonies) {
    const words = (testimony.description || '')
      .toLowerCase()
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));

    for (const word of words) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  }

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
};

const classifyCreature = (creature, testimonies) => {
  return {
    id: creature._id,
    name: creature.name,
    origin: creature.origin,
    legendScore: creature.legendScore,
    family: classifyFamily(creature),
    subtypes: classifySubtype(creature, testimonies),
    influenceBranches: classifyInfluence(creature, testimonies),
    testimoniesCount: testimonies.length,
    validatedTestimoniesCount: testimonies.filter(t => t.status === 'VALIDATED').length
  };
};

const buildHierarchicalClassification = (classifiedCreatures) => {
  const hierarchy = {};

  for (const creature of classifiedCreatures) {
    const familyCode = creature.family.code;

    if (!hierarchy[familyCode]) {
      hierarchy[familyCode] = {
        name: creature.family.name,
        subtypes: {},
        creaturesCount: 0
      };
    }

    hierarchy[familyCode].creaturesCount++;

    for (const subtype of creature.subtypes) {
      if (!hierarchy[familyCode].subtypes[subtype]) {
        hierarchy[familyCode].subtypes[subtype] = {
          creatures: [],
          count: 0
        };
      }
      hierarchy[familyCode].subtypes[subtype].creatures.push({
        id: creature.id,
        name: creature.name,
        influenceBranches: creature.influenceBranches
      });
      hierarchy[familyCode].subtypes[subtype].count++;
    }
  }

  return hierarchy;
};

module.exports = {
  classifyCreature,
  extractKeywords,
  buildHierarchicalClassification
};
