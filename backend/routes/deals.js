const express = require('express');
const router = express.Router();
const ebayService = require('../services/ebayService');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * GET /api/deals/search
 * Search for deals based on criteria
 * Query params: keywords, priceMin, priceMax, condition, marketplace
 */
router.get('/search', async (req, res) => {
  try {
    const {
      keywords,
      priceMin,
      priceMax,
      condition,
      marketplace = 'ebay',
      sortOrder = 'BestMatch',
      limit = 50
    } = req.query;

    if (!keywords) {
      return res.status(400).json({ error: 'Keywords are required' });
    }

    let deals = [];

    // Search eBay
    if (marketplace === 'ebay' || marketplace === 'all') {
      const ebayDeals = await ebayService.searchItems({
        keywords: keywords.split(',').map(k => k.trim()),
        priceMin: priceMin ? parseFloat(priceMin) : undefined,
        priceMax: priceMax ? parseFloat(priceMax) : undefined,
        condition,
        sortOrder,
        maxResults: parseInt(limit)
      });

      deals = [...deals, ...ebayDeals];
    }

    // TODO: Add other marketplaces (Facebook, OfferUp, etc.)

    res.json({
      success: true,
      count: deals.length,
      deals
    });

  } catch (error) {
    console.error('Deal search error:', error);
    res.status(500).json({ 
      error: 'Failed to search deals',
      message: error.message 
    });
  }
});

/**
 * GET /api/deals/:id
 * Get detailed information about a specific deal
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { marketplace = 'ebay' } = req.query;

    let deal;

    if (marketplace === 'ebay') {
      deal = await ebayService.getItemDetails(id);
    } else {
      return res.status(400).json({ error: 'Unsupported marketplace' });
    }

    res.json({
      success: true,
      deal
    });

  } catch (error) {
    console.error('Deal details error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch deal details',
      message: error.message 
    });
  }
});

/**
 * GET /api/deals/market-value/:keywords
 * Estimate market value for an item
 */
router.get('/market-value/:keywords', async (req, res) => {
  try {
    const { keywords } = req.params;
    
    const marketValue = await ebayService.estimateMarketValue(keywords);

    res.json({
      success: true,
      keywords,
      estimatedValue: marketValue,
      source: 'ebay_sold_listings'
    });

  } catch (error) {
    console.error('Market value error:', error);
    res.status(500).json({ 
      error: 'Failed to estimate market value',
      message: error.message 
    });
  }
});

/**
 * POST /api/deals/save
 * Save deals from a search to the database
 * Requires authentication
 */
router.post('/save', async (req, res) => {
  try {
    const { searchId, deals } = req.body;

    if (!searchId || !deals || !Array.isArray(deals)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Get search to verify it exists and get user_id
    const { data: search, error: searchError } = await supabase
      .from('searches')
      .select('id, user_id')
      .eq('id', searchId)
      .single();

    if (searchError || !search) {
      return res.status(404).json({ error: 'Search not found' });
    }

    // Prepare deals for insertion
    const dealsToInsert = deals.map(deal => ({
      search_id: searchId,
      user_id: search.user_id,
      external_id: deal.external_id,
      marketplace: deal.marketplace,
      title: deal.title,
      description: deal.description,
      price: deal.price,
      original_price: deal.original_price,
      image_url: deal.image_url,
      listing_url: deal.listing_url,
      location: deal.location,
      condition: deal.condition,
      seller_name: deal.seller_name,
      seller_rating: deal.seller_rating,
      category: deal.category,
      score: deal.score || null,
      score_breakdown: deal.score_breakdown || null,
      listed_at: deal.listed_at,
      metadata: deal.metadata || {}
    }));

    // Insert deals into database
    const { data: insertedDeals, error: insertError } = await supabase
      .from('deals')
      .insert(dealsToInsert)
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(500).json({ error: 'Failed to save deals' });
    }

    // Update search results count
    await supabase
      .from('searches')
      .update({ 
        results_count: insertedDeals.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', searchId);

    res.json({
      success: true,
      count: insertedDeals.length,
      deals: insertedDeals
    });

  } catch (error) {
    console.error('Save deals error:', error);
    res.status(500).json({ 
      error: 'Failed to save deals',
      message: error.message 
    });
  }
});

/**
 * GET /api/deals/user/:userId
 * Get all deals for a specific user
 * Requires authentication
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100, offset = 0, minScore = 0 } = req.query;

    const { data: deals, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId)
      .gte('score', minScore)
      .order('score', { ascending: false })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: deals.length,
      deals
    });

  } catch (error) {
    console.error('Get user deals error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch deals',
      message: error.message 
    });
  }
});

module.exports = router;


