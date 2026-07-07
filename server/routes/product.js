const express = require('express');
const router = express.Router();

// Helper: translate text to English using MyMemory (free, no API key)
async function translateToEnglish(text, sourceLang) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|en`;
    const res = await fetch(url);
    const data = await res.json();
    return data.responseData?.translatedText || null;
  } catch {
    return null;
  }
}

// GET /api/product/:barcode
router.get('/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;

    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json?lc=en`
    );
    const data = await response.json();

    if (data.status === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const p = data.product;

    let ingredients = p.ingredients_text_en || p.ingredients_text || 'Not available';
    console.log('DEBUG — has English?', !!p.ingredients_text_en, '| lang:', p.lang);

    let ingredientsTranslated = null;

    if (!p.ingredients_text_en && p.ingredients_text) {
      const sourceLang = p.lang || 'sv';
      console.log('DEBUG — attempting translation from:', sourceLang);
      ingredientsTranslated = await translateToEnglish(p.ingredients_text, sourceLang);
      console.log('DEBUG — translation result:', ingredientsTranslated);
    }

    res.json({
      barcode,
      name: p.product_name_en || p.product_name || 'Unknown',
      brand: p.brands || 'Unknown',
      category: p.categories_en || p.categories || 'Unknown',
      ingredients,
      ingredientsTranslated,
      nutritionGrade: p.nutrition_grades || 'N/A',
      imageUrl: p.image_url || null,
      quantity: p.quantity || 'N/A',
      country: p.countries || 'N/A',
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;