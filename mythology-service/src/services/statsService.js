const loreService = require('./loreService');
const { classifyCreature, extractKeywords, buildHierarchicalClassification } = require('./classificationService');

const generateStats = async (authToken) => {
  const creatures = await loreService.getCreatures(authToken);
  const testimoniesMap = await loreService.getAllTestimonies(creatures, authToken);

  // Classifier toutes les créatures
  const classifiedCreatures = creatures.map(creature => {
    const testimonies = testimoniesMap[creature._id] || [];
    return classifyCreature(creature, testimonies);
  });

  // Statistiques globales
  const allTestimonies = Object.values(testimoniesMap).flat();
  const totalTestimonies = allTestimonies.length;
  const totalCreatures = creatures.length;
  const averageTestimoniesPerCreature = totalCreatures > 0
    ? (totalTestimonies / totalCreatures).toFixed(2)
    : 0;

  // Occurrences par créature (triées par nombre de témoignages)
  const occurrencesByCreature = classifiedCreatures
    .map(c => ({
      id: c.id,
      name: c.name,
      testimoniesCount: c.testimoniesCount,
      validatedCount: c.validatedTestimoniesCount,
      legendScore: c.legendScore
    }))
    .sort((a, b) => b.testimoniesCount - a.testimoniesCount);

  // Mots-clés récurrents
  const keywords = extractKeywords(allTestimonies);

  // Classification hiérarchique
  const hierarchicalClassification = buildHierarchicalClassification(classifiedCreatures);

  // Statistiques par famille
  const familyStats = {};
  for (const creature of classifiedCreatures) {
    const familyCode = creature.family.code;
    if (!familyStats[familyCode]) {
      familyStats[familyCode] = {
        name: creature.family.name,
        creaturesCount: 0,
        totalTestimonies: 0
      };
    }
    familyStats[familyCode].creaturesCount++;
    familyStats[familyCode].totalTestimonies += creature.testimoniesCount;
  }

  // Statistiques par branche d'influence
  const influenceStats = {};
  for (const creature of classifiedCreatures) {
    for (const branch of creature.influenceBranches) {
      if (!influenceStats[branch]) {
        influenceStats[branch] = { count: 0, creatures: [] };
      }
      influenceStats[branch].count++;
      influenceStats[branch].creatures.push(creature.name);
    }
  }

  return {
    summary: {
      totalCreatures,
      totalTestimonies,
      averageTestimoniesPerCreature: parseFloat(averageTestimoniesPerCreature),
      validatedTestimonies: allTestimonies.filter(t => t.status === 'VALIDATED').length,
      pendingTestimonies: allTestimonies.filter(t => t.status === 'PENDING').length,
      rejectedTestimonies: allTestimonies.filter(t => t.status === 'REJECTED').length
    },
    occurrencesByCreature,
    keywords,
    familyStats,
    influenceStats,
    hierarchicalClassification
  };
};

const getClassification = async (authToken) => {
  const creatures = await loreService.getCreatures(authToken);
  const testimoniesMap = await loreService.getAllTestimonies(creatures, authToken);

  const classifiedCreatures = creatures.map(creature => {
    const testimonies = testimoniesMap[creature._id] || [];
    return classifyCreature(creature, testimonies);
  });

  return {
    creatures: classifiedCreatures,
    hierarchy: buildHierarchicalClassification(classifiedCreatures)
  };
};

module.exports = { generateStats, getClassification };
