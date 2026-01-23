// ============================================
// PA System - Animated Background
// Creates animated gradient orbs background
// ============================================

/**
 * Creates and inserts animated background orbs into a container
 * @param {string} containerId - The ID of the container element (default: 'app')
 */
function createAnimatedBackground(containerId = 'app') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('Animated Background: Container not found:', containerId);
    return;
  }
  
  // Create orbs HTML
  const orbsHTML = `
    <!-- Animated Background Orbs -->
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
  `;
  
  // Insert at the beginning of the container
  container.insertAdjacentHTML('afterbegin', orbsHTML);
}

/**
 * Creates animated background with custom orb configurations
 * @param {string} containerId - The ID of the container element
 * @param {Array} customOrbs - Array of custom orb configurations
 */
function createCustomAnimatedBackground(containerId, customOrbs) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('Animated Background: Container not found:', containerId);
    return;
  }
  
  let orbsHTML = '<!-- Animated Background Orbs -->\n';
  
  customOrbs.forEach((orb, index) => {
    orbsHTML += `<div class="gradient-orb orb-${index + 1}"></div>\n`;
  });
  
  container.insertAdjacentHTML('afterbegin', orbsHTML);
}

// Auto-initialize when DOM is ready (optional - can be called manually)
// document.addEventListener('DOMContentLoaded', () => createAnimatedBackground());
