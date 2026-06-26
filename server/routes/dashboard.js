const express = require('express');
const router = express.Router();
const ScanHistory = require('../models/ScanHistory');

// GET /api/dashboard/:userId
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
