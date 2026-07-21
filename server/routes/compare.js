const express = require('express');
const router = express.Router();

// Helper function to format product
function formatProduct(barcode, p) {
  return {
    barcode,
    name: p.product_name || p.product_name_en || 'Unknown',
    brand: p.brands || 'Unknown',
    category: p.categories || 'Unknown',
    ingredients: p.ingredients_text || p.ingredients_text_en || 'Not available',
    nutritionGrade: p.nutrition_grades || 'N/A',
    imageUrl: p.image_url || p.image_front_url || null,
    quantity: p.quantity || 'N/A',
    trustScore: calculateTrustScore(p),
  };
}

// Calculate trust score
function calculateTrustScore(p) {
  let score = 0;
  if (p.product_name) score += 20;
  if (p.brands) score += 20;
  if (p.ingredients_text) score += 20;
  if (p.nutrition_grades) score += 20;
  if (p.image_url) score += 20;
  return score;
}

// GET /api/product/compare?ids=barcode1,barcode2
router.get('/', async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ error: 'Please provide ids query parameter' });
    }

    const barcodes = ids.split(',');

    if (barcodes.length !== 2) {
      return res.status(400).json({ error: 'Please provide exactly 2 barcodes' });
    }

    // Fetch both products simultaneously
    const [res1, res2] = await Promise.all([
      fetch(`https://world.openfoodfacts.org/api/v0/product/${barcodes[0]}.json`),
      fetch(`https://world.openfoodfacts.org/api/v0/product/${barcodes[1]}.json`)
    ]);

    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

    if (data1.status === 0) {
      return res.status(404).json({ error: `Product with barcode ${barcodes[0]} not found` });
    }

    if (data2.status === 0) {
      return res.status(404).json({ error: `Product with barcode ${barcodes[1]} not found` });
    }

    res.json({
      product1: formatProduct(barcodes[0], data1.product),
      product2: formatProduct(barcodes[1], data2.product),
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

//done 