const express = require('express');
const router = express.Router();
const ScanHistory = require('../models/ScanHistory');

// POST /api/dashboard/scan — save a new scan
router.post('/scan', async (req, res) => {
  try {
    const { userId, barcode, productName } = req.body;

    const scan = new ScanHistory({ userId, barcode, productName });
    await scan.save();

    res.status(201).json({ message: 'Scan saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dashboard/:userId — get scan history
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await ScanHistory.find({ userId })
      .sort({ scannedAt: -1 })
      .limit(20);

    res.json({
      userId,
      totalScans: history.length,
      history
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

//done 