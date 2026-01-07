function validateTemplatePlaceholders(templateId, values) {
  try {
    const doc = DocumentApp.openById(templateId);
    const body = doc.getBody();
    const text = body.getText();
    const missing = [];
    const found = [];
    
    Object.keys(values).forEach(key => {
      const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp('{{\\s*' + escapedKey + '\\s*}}', 'g');
      if (regex.test(text)) {
        found.push(key);
      } else {
        missing.push(key);
      }
    });
    
    Logger.log(`✅ ${found.length} placeholders found in template`);
    
    if (missing.length > 0) {
      Logger.log(`⚠️ ${missing.length} placeholders missing from template:`);
      missing.forEach(key => Logger.log(`• {{${key}}}`));
    }
    
    const allPlaceholders = text.match(/{{[^}]+}}/g) || [];
    const templateKeys = allPlaceholders.map(p => p.replace(/[{}]/g, '').trim());
    const unmappedKeys = templateKeys.filter(k => !Object.keys(values).includes(k));
    
    if (unmappedKeys.length > 0) {
      Logger.log('⚠️ Template has placeholders not in our data:');
      unmappedKeys.forEach(key => Logger.log(`• {{${key}}}`));
    }
    
  } catch (e) {
    Logger.log('❌ Error validating template: ' + e.message);
  }
}

function debugFieldPopulation(merged) {
  const filled = [];
  const empty = [];
  
  Object.keys(merged).forEach(key => {
    if (merged[key] && merged[key] !== '' && merged[key] !== 'Unknown') {
      filled.push(key);
    } else {
      empty.push(key);
    }
  });
  
  Logger.log(`📊 Field Population Debug:`);
  Logger.log(`✅ Filled fields (${filled.length}): ${filled.join(', ')}`);
  Logger.log(`❌ Empty fields (${empty.length}): ${empty.join(', ')}`);
  
  return { filled, empty };
}

// Test function to check API connectivity
function testApiConnection() {
  try {
    // MODIFIED: Changed UfApi to Api to match the new file name.
    const result = Api.enrich('Zoom', 'basic');
    Logger.log('🧪 API Test Result:', result);
    if (result) {
      Logger.log('🧪 Fields returned:', Object.keys(result));
    }
    return result;
  } catch (e) {
    Logger.log('❌ API Test Failed:', e.message);
    return null;
  }
}
