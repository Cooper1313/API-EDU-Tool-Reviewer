var SourcesTracker = (function () {
  let entries = [];
  
  // Add a source URL and the section it enriched
  function add(url, section) {
    if (!url || !section) return;
    
    // Clean and validate URL
    const cleanUrl = url.toString().trim();
    const cleanSection = section.toString().trim();
    
    if (cleanUrl && cleanSection) {
      entries.push({ 
        url: cleanUrl, 
        section: cleanSection,
        timestamp: new Date()
      });
      Logger.log(`📋 Tracked source: ${cleanSection} ← ${cleanUrl.substring(0, 50)}...`);
    }
  }
  
  // Format source list for output
  function getFormatted(style = 'detailed') {
    if (entries.length === 0) return 'Not available';
    
    // Remove duplicates based on URL and section combination
    const unique = [];
    const seen = new Set();
    
    entries.forEach(entry => {
      const domain = entry.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
      const key = domain + '|' + entry.section;
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(entry);
      }
    });
    
    if (style === 'detailed') {
      // Group by source type for clearer organization
      const grouped = {
        'Google Sheet': [],
        'UF/CITT Resources': [],
        'Drive Files': [],
        'API Sources': [],
        'Other': []
      };
      
      unique.forEach(entry => {
        const url = entry.url.toLowerCase();
        const sections = entry.section;
        
        if (url.includes('google sheet') || url.includes('sheet')) {
          grouped['Google Sheet'].push(`${sections}: ${entry.url}`);
        } else if (url.includes('ufl.edu') || url.includes('citt')) {
          grouped['UF/CITT Resources'].push(`${sections}: ${entry.url}`);
        } else if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
          grouped['Drive Files'].push(`${sections}: ${entry.url}`);
        } else if (url.includes('api') || sections.includes('API')) {
          grouped['API Sources'].push(`${sections}: ${entry.url}`);
        } else {
          grouped['Other'].push(`${sections}: ${entry.url}`);
        }
      });
      
      const result = [];
      Object.keys(grouped).forEach(category => {
        if (grouped[category].length > 0) {
          result.push(`**${category}:**`);
          grouped[category].forEach(item => result.push(`• ${item}`));
          result.push('');
        }
      });
      
      return result.join('\n').trim();
    }
    
    if (style === 'grouped') {
      // Group by domain
      const grouped = {};
      unique.forEach(entry => {
        const domain = entry.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
        if (!grouped[domain]) grouped[domain] = [];
        grouped[domain].push(entry);
      });
      
      const result = [];
      Object.keys(grouped).forEach(domain => {
        const sections = grouped[domain].map(e => e.section).join(', ');
        result.push(`• ${grouped[domain][0].url} (${sections})`);
      });
      
      return result.join('\n');
    }
    
    // Default parenthetical format
    return unique.map(e => `• ${e.url} (${e.section})`).join('\n');
  }
  
  // Get raw entries for debugging
  function getEntries() {
    return [...entries]; // Return copy to prevent external modification
  }
  
  // Clear all tracked sources
  function reset() {
    const previousCount = entries.length;
    entries = [];
    Logger.log(`🔄 Sources tracker reset (cleared ${previousCount} entries)`);
  }
  
  return {
    add,
    getFormatted,
    getEntries,
    reset
  };
})();
