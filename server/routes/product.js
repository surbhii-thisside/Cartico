const express = require('express');
const router = express.Router();

// GET /api/product/:barcode
router.get('/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;

    // Fetch from Open Food Facts API
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const data = await response.json();

    if (data.status === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const p = data.product;

    // Return clean product data
    res.json({
      barcode,
      name: p.product_name || 'Unknown',
      brand: p.brands || 'Unknown',
      category: p.categories || 'Unknown',
      ingredients: p.ingredients_text || 'Not available',
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