const axios = require('axios');

class EbayService {
  constructor() {
    this.appId = process.env.EBAY_APP_ID;
    this.certId = process.env.EBAY_CERT_ID;
    this.devId = process.env.EBAY_DEV_ID;
    
    // eBay Finding API endpoint
    this.findingApiUrl = 'https://svcs.ebay.com/services/search/FindingService/v1';
    
    // eBay Shopping API endpoint (for item details)
    this.shoppingApiUrl = 'https://open.api.ebay.com/shopping';
    
    if (!this.appId) {
      console.warn('EBAY_APP_ID not set - eBay integration will not work');
    }
  }

  /**
   * Search for items on eBay based on search criteria
   * @param {Object} searchCriteria - Search parameters
   * @returns {Promise<Array>} Array of deal objects
   */
  async searchItems(searchCriteria) {
    try {
      const {
        keywords,
        category,
        priceMin,
        priceMax,
        condition,
        sortOrder = 'BestMatch',
        maxResults = 100
      } = searchCriteria;

      if (!keywords || keywords.length === 0) {
        throw new Error('Keywords are required for eBay search');
      }

      // Build the search query
      const searchTerms = Array.isArray(keywords) ? keywords.join(' ') : keywords;

      // Build request parameters
      const params = {
        'OPERATION-NAME': 'findItemsAdvanced',
        'SERVICE-VERSION': '1.0.0',
        'SECURITY-APPNAME': this.appId,
        'RESPONSE-DATA-FORMAT': 'JSON',
        'REST-PAYLOAD': '',
        'keywords': searchTerms,
        'paginationInput.entriesPerPage': Math.min(maxResults, 100),
        'sortOrder': sortOrder
      };

      // Add item filters
      let filterIndex = 0;

      // Price filter
      if (priceMin || priceMax) {
        if (priceMin) {
          params[`itemFilter(${filterIndex}).name`] = 'MinPrice';
          params[`itemFilter(${filterIndex}).value`] = priceMin;
          params[`itemFilter(${filterIndex}).paramName`] = 'Currency';
          params[`itemFilter(${filterIndex}).paramValue`] = 'USD';
          filterIndex++;
        }
        if (priceMax) {
          params[`itemFilter(${filterIndex}).name`] = 'MaxPrice';
          params[`itemFilter(${filterIndex}).value`] = priceMax;
          params[`itemFilter(${filterIndex}).paramName`] = 'Currency';
          params[`itemFilter(${filterIndex}).paramValue`] = 'USD';
          filterIndex++;
        }
      }

      // Condition filter
      if (condition) {
        const conditionMap = {
          'new': '1000',
          'like_new': '1500',
          'excellent': '2000',
          'very_good': '2500',
          'good': '3000',
          'acceptable': '4000',
          'used': '3000' // Default to "good" for generic "used"
        };

        const conditionId = conditionMap[condition.toLowerCase()];
        if (conditionId) {
          params[`itemFilter(${filterIndex}).name`] = 'Condition';
          params[`itemFilter(${filterIndex}).value`] = conditionId;
          filterIndex++;
        }
      }

      // Only buy-it-now listings (not auctions)
      params[`itemFilter(${filterIndex}).name`] = 'ListingType';
      params[`itemFilter(${filterIndex}).value`] = 'FixedPrice';
      filterIndex++;

      // Make the API request
      const response = await axios.get(this.findingApiUrl, { params });

      // Parse the response
      const findingResponse = response.data.findItemsAdvancedResponse?.[0];
      
      if (!findingResponse || findingResponse.ack?.[0] !== 'Success') {
        const errorMessage = findingResponse?.errorMessage?.[0]?.error?.[0]?.message?.[0] || 'Unknown error';
        throw new Error(`eBay API error: ${errorMessage}`);
      }

      const searchResult = findingResponse.searchResult?.[0];
      
      if (!searchResult || !searchResult.item) {
        return [];
      }

      // Transform eBay items to our deal format
      const deals = searchResult.item.map(item => this.transformEbayItem(item));

      return deals;

    } catch (error) {
      console.error('eBay search error:', error.message);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific eBay item
   * @param {string} itemId - eBay item ID
   * @returns {Promise<Object>} Deal details
   */
  async getItemDetails(itemId) {
    try {
      const params = {
        'callname': 'GetSingleItem',
        'responseencoding': 'JSON',
        'appid': this.appId,
        'siteid': '0',
        'version': '967',
        'ItemID': itemId,
        'IncludeSelector': 'Description,Details,ItemSpecifics'
      };

      const response = await axios.get(this.shoppingApiUrl, { params });

      if (!response.data.Item) {
        throw new Error('Item not found');
      }

      return this.transformEbayItemDetails(response.data.Item);

    } catch (error) {
      console.error('eBay item details error:', error.message);
      throw error;
    }
  }

  /**
   * Transform eBay API item to our deal format
   * @private
   */
  transformEbayItem(ebayItem) {
    const title = ebayItem.title?.[0] || 'Unknown Item';
    const itemId = ebayItem.itemId?.[0];
    const price = parseFloat(ebayItem.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || 0);
    const currency = ebayItem.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'] || 'USD';
    const imageUrl = ebayItem.galleryURL?.[0] || ebayItem.pictureURLLarge?.[0] || null;
    const listingUrl = ebayItem.viewItemURL?.[0];
    const location = ebayItem.location?.[0];
    const condition = ebayItem.condition?.[0]?.conditionDisplayName?.[0] || 'Unknown';
    const shippingCost = parseFloat(ebayItem.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ || 0);
    const freeShipping = shippingCost === 0;

    // Seller information
    const sellerUsername = ebayItem.sellerInfo?.[0]?.sellerUserName?.[0];
    const feedbackScore = parseInt(ebayItem.sellerInfo?.[0]?.feedbackScore?.[0] || 0);
    const positiveFeedbackPercent = parseFloat(ebayItem.sellerInfo?.[0]?.positiveFeedbackPercent?.[0] || 0);

    // Extract category
    const category = ebayItem.primaryCategory?.[0]?.categoryName?.[0] || null;

    // Parse listing time
    const listedAt = ebayItem.listingInfo?.[0]?.startTime?.[0] 
      ? new Date(ebayItem.listingInfo[0].startTime[0]) 
      : new Date();

    return {
      external_id: itemId,
      marketplace: 'ebay',
      title,
      description: null, // Basic search doesn't include full description
      price,
      currency,
      original_price: null, // Will calculate later if we can find market value
      image_url: imageUrl,
      listing_url: listingUrl,
      location,
      condition,
      shipping_cost: shippingCost,
      free_shipping: freeShipping,
      seller_name: sellerUsername,
      seller_rating: positiveFeedbackPercent,
      seller_reviews: feedbackScore,
      category,
      listed_at: listedAt,
      metadata: {
        topRatedListing: ebayItem.topRatedListing?.[0] === 'true',
        returnsAccepted: ebayItem.returnsAccepted?.[0] === 'true',
        watchCount: parseInt(ebayItem.listingInfo?.[0]?.watchCount?.[0] || 0)
      }
    };
  }

  /**
   * Transform detailed eBay item to our format
   * @private
   */
  transformEbayItemDetails(ebayItem) {
    return {
      external_id: ebayItem.ItemID,
      marketplace: 'ebay',
      title: ebayItem.Title,
      description: ebayItem.Description,
      price: parseFloat(ebayItem.CurrentPrice?.Value || 0),
      currency: ebayItem.CurrentPrice?.CurrencyID || 'USD',
      image_url: ebayItem.PictureURL?.[0],
      images: ebayItem.PictureURL || [],
      listing_url: ebayItem.ViewItemURLForNaturalSearch,
      location: ebayItem.Location,
      condition: ebayItem.ConditionDisplayName,
      shipping_cost: parseFloat(ebayItem.ShippingCostSummary?.ShippingServiceCost?.Value || 0),
      seller_name: ebayItem.Seller?.UserID,
      seller_rating: parseFloat(ebayItem.Seller?.PositiveFeedbackPercent || 0),
      seller_reviews: parseInt(ebayItem.Seller?.FeedbackScore || 0),
      item_specifics: ebayItem.ItemSpecifics?.NameValueList || [],
      metadata: {
        quantity: parseInt(ebayItem.Quantity || 1),
        quantitySold: parseInt(ebayItem.QuantitySold || 0),
        returnsAccepted: ebayItem.ReturnPolicy?.ReturnsAccepted === 'ReturnsAccepted'
      }
    };
  }

  /**
   * Get completed/sold listings to estimate market value
   * @param {string} keywords - Search terms
   * @returns {Promise<Array>} Sold listings
   */
  async getSoldListings(keywords, maxResults = 20) {
    try {
      const params = {
        'OPERATION-NAME': 'findCompletedItems',
        'SERVICE-VERSION': '1.0.0',
        'SECURITY-APPNAME': this.appId,
        'RESPONSE-DATA-FORMAT': 'JSON',
        'REST-PAYLOAD': '',
        'keywords': keywords,
        'paginationInput.entriesPerPage': Math.min(maxResults, 100),
        'sortOrder': 'EndTimeSoonest'
      };

      // Only sold items
      params['itemFilter(0).name'] = 'SoldItemsOnly';
      params['itemFilter(0).value'] = 'true';

      const response = await axios.get(this.findingApiUrl, { params });
      
      const findingResponse = response.data.findCompletedItemsResponse?.[0];
      
      if (!findingResponse || findingResponse.ack?.[0] !== 'Success') {
        return [];
      }

      const searchResult = findingResponse.searchResult?.[0];
      
      if (!searchResult || !searchResult.item) {
        return [];
      }

      return searchResult.item.map(item => ({
        price: parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || 0),
        soldDate: new Date(item.listingInfo?.[0]?.endTime?.[0] || new Date()),
        condition: item.condition?.[0]?.conditionDisplayName?.[0]
      }));

    } catch (error) {
      console.error('Error fetching sold listings:', error.message);
      return [];
    }
  }

  /**
   * Estimate market value based on sold listings
   * @param {string} keywords - Search terms
   * @returns {Promise<number|null>} Average market price
   */
  async estimateMarketValue(keywords) {
    try {
      const soldListings = await this.getSoldListings(keywords, 20);
      
      if (soldListings.length === 0) {
        return null;
      }

      // Calculate average price
      const avgPrice = soldListings.reduce((sum, item) => sum + item.price, 0) / soldListings.length;
      
      return Math.round(avgPrice * 100) / 100; // Round to 2 decimals

    } catch (error) {
      console.error('Error estimating market value:', error.message);
      return null;
    }
  }
}

module.exports = new EbayService();


