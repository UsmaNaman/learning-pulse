/**
 * Bloom's Taxonomy Utility Functions
 * Converts percentage mastery to 5-tier Bloom's aligned system
 */

const BLOOMS_LEVELS = {
  1: {
    name: 'remember',
    label: 'Remember',
    description: 'Recall facts and basic concepts',
    color: '#f44336', // Red
    minPercentage: 0,
    maxPercentage: 39,
    keywords: ['define', 'identify', 'list', 'name', 'recall', 'state']
  },
  2: {
    name: 'understand',
    label: 'Understand',
    description: 'Explain ideas or concepts',
    color: '#ff9800', // Orange
    minPercentage: 40,
    maxPercentage: 54,
    keywords: ['describe', 'explain', 'interpret', 'summarize', 'classify']
  },
  3: {
    name: 'apply',
    label: 'Apply',
    description: 'Use information in new situations',
    color: '#2196f3', // Blue
    minPercentage: 55,
    maxPercentage: 69,
    keywords: ['demonstrate', 'execute', 'implement', 'solve', 'use']
  },
  4: {
    name: 'analyze',
    label: 'Analyze',
    description: 'Draw connections and organize information',
    color: '#4caf50', // Green
    minPercentage: 70,
    maxPercentage: 84,
    keywords: ['compare', 'contrast', 'examine', 'organize', 'deconstruct']
  },
  5: {
    name: 'evaluate',
    label: 'Evaluate',
    description: 'Justify decisions and critique work',
    color: '#9c27b0', // Purple
    minPercentage: 85,
    maxPercentage: 100,
    keywords: ['assess', 'critique', 'defend', 'judge', 'support']
  }
};

/**
 * Convert percentage mastery to Bloom's taxonomy level
 * @param {number} percentage - Mastery percentage (0-100)
 * @returns {object} Bloom's level information
 */
function getBloomsLevel(percentage) {
  for (const [level, info] of Object.entries(BLOOMS_LEVELS)) {
    if (percentage >= info.minPercentage && percentage <= info.maxPercentage) {
      return {
        level: parseInt(level),
        ...info
      };
    }
  }
  // Fallback to Remember level
  return {
    level: 1,
    ...BLOOMS_LEVELS[1]
  };
}

/**
 * Get all Bloom's levels for reference
 * @returns {object} All Bloom's levels
 */
function getAllBloomsLevels() {
  return BLOOMS_LEVELS;
}

/**
 * Get next target level for a student
 * @param {number} currentPercentage - Current mastery percentage
 * @returns {object} Next Bloom's level to target
 */
function getNextBloomsTarget(currentPercentage) {
  const currentLevel = getBloomsLevel(currentPercentage);
  const nextLevelNum = Math.min(currentLevel.level + 1, 5);
  return {
    level: nextLevelNum,
    ...BLOOMS_LEVELS[nextLevelNum]
  };
}

/**
 * Get assessment scaffolding based on Bloom's level
 * @param {number} bloomsLevel - Target Bloom's level (1-5)
 * @returns {object} Scaffolding recommendations
 */
function getBloomsScaffolding(bloomsLevel) {
  const scaffolding = {
    1: {
      questionTypes: ['multiple-choice', 'true-false', 'fill-blank'],
      feedbackType: 'immediate',
      hints: 'high',
      examples: 'many',
      practice: 'repetitive'
    },
    2: {
      questionTypes: ['short-answer', 'matching', 'categorization'],
      feedbackType: 'explanatory',
      hints: 'medium',
      examples: 'moderate',
      practice: 'varied'
    },
    3: {
      questionTypes: ['problem-solving', 'coding', 'simulation'],
      feedbackType: 'process-focused',
      hints: 'low',
      examples: 'few',
      practice: 'contextual'
    },
    4: {
      questionTypes: ['analysis', 'comparison', 'case-study'],
      feedbackType: 'analytical',
      hints: 'minimal',
      examples: 'complex',
      practice: 'integrated'
    },
    5: {
      questionTypes: ['evaluation', 'critique', 'design'],
      feedbackType: 'reflective',
      hints: 'none',
      examples: 'authentic',
      practice: 'independent'
    }
  };

  return scaffolding[bloomsLevel] || scaffolding[1];
}

module.exports = {
  BLOOMS_LEVELS,
  getBloomsLevel,
  getAllBloomsLevels,
  getNextBloomsTarget,
  getBloomsScaffolding
};