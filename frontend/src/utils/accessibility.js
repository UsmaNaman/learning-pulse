/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

// Color contrast utilities
export const colorContrast = {
  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  isValidContrast: (foreground, background, isLargeText = false) => {
    const ratio = calculateContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  },

  // Calculate luminance for contrast ratio
  getLuminance: (color) => {
    const rgb = hexToRgb(color);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
};

// Screen reader utilities
export const screenReader = {
  // Generate descriptive text for complex UI elements
  getProgressDescription: (value, max = 100, label = '') => {
    const percentage = Math.round((value / max) * 100);
    return `${label} ${percentage}% complete. Progress: ${value} out of ${max}.`;
  },

  getBloomsLevelDescription: (level, levelName) => {
    const descriptions = {
      1: 'Remember level - recall facts and basic concepts',
      2: 'Understand level - explain ideas or concepts', 
      3: 'Apply level - use information in new situations',
      4: 'Analyze level - draw connections among ideas',
      5: 'Evaluate level - justify a stand or decision'
    };
    return `Bloom's taxonomy level ${level}: ${levelName}. ${descriptions[level]}`;
  },

  getBadgeDescription: (badgeName, description, isEarned) => {
    return `${badgeName} badge. ${description}. Status: ${isEarned ? 'Earned' : 'Not yet earned'}.`;
  }
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Handle keyboard events for custom components
  handleKeyDown: (event, onActivate) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  },

  // Focus management for modals and dynamic content
  trapFocus: (containerElement) => {
    const focusableElements = containerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    containerElement.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      containerElement.removeEventListener('keydown', handleTabKey);
    };
  }
};

// ARIA utilities
export const aria = {
  // Generate ARIA labels for complex components
  generateLabel: (baseLabel, additionalInfo = []) => {
    return [baseLabel, ...additionalInfo].join('. ');
  },

  // Live region announcements
  announce: (message, priority = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Role definitions for custom components
  roles: {
    progressbar: {
      role: 'progressbar',
      'aria-valuemin': 0,
      'aria-valuemax': 100
    },
    tabpanel: {
      role: 'tabpanel'
    },
    alert: {
      role: 'alert',
      'aria-live': 'assertive'
    }
  }
};

// Focus management
export const focus = {
  // Save and restore focus for modals
  saveFocus: () => {
    return document.activeElement;
  },

  restoreFocus: (element) => {
    if (element && element.focus) {
      element.focus();
    }
  },

  // Skip links for keyboard users
  createSkipLink: (targetId, text = 'Skip to main content') => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 9999;
      border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    return skipLink;
  }
};

// Text and content utilities
export const textUtilities = {
  // Ensure text is readable
  isTextTooLong: (text, maxLength = 80) => {
    return text.length > maxLength;
  },

  // Generate alternative text for images
  generateAltText: (context, description) => {
    return `${context}: ${description}`;
  },

  // Reading level assessment (basic)
  getReadingLevel: (text) => {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    if (avgWordsPerSentence <= 12) return 'Easy';
    if (avgWordsPerSentence <= 17) return 'Medium';
    return 'Hard';
  }
};

// Helper functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function calculateContrastRatio(color1, color2) {
  const lum1 = colorContrast.getLuminance(color1);
  const lum2 = colorContrast.getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Export all utilities
export default {
  colorContrast,
  screenReader,
  keyboardNavigation,
  aria,
  focus,
  textUtilities
};