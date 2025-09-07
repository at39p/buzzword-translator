// Corporate Buzzword Translator - Core Search Functionality
// Implements fuzzy matching, relevance scoring, and debounced search

class BuzzwordSearchEngine {
  constructor(buzzwords) {
    try {
      // Validate buzzwords data
      if (!buzzwords || !Array.isArray(buzzwords) || buzzwords.length === 0) {
        throw new Error('Invalid or empty buzzwords database provided');
      }

      this.buzzwords = buzzwords;
      
      // Get DOM elements with validation
      this.searchInput = document.getElementById('searchInput');
      this.clearButton = document.getElementById('clearButton');
      this.randomButton = document.getElementById('randomButton');
      this.resultsContainer = document.getElementById('resultsContainer');
      this.resultsSection = document.getElementById('resultsSection');
      this.noResults = document.getElementById('noResults');
      this.examplesContainer = document.getElementById('examplesContainer');
      
      // Validate critical DOM elements
      const requiredElements = {
        searchInput: this.searchInput,
        clearButton: this.clearButton,
        randomButton: this.randomButton,
        resultsContainer: this.resultsContainer,
        resultsSection: this.resultsSection,
        noResults: this.noResults,
        examplesContainer: this.examplesContainer
      };

      const missingElements = Object.entries(requiredElements)
        .filter(([name, element]) => !element)
        .map(([name]) => name);

      if (missingElements.length > 0) {
        throw new Error(`Required DOM elements not found: ${missingElements.join(', ')}`);
      }
      
      // Performance optimizations
      this.debounceDelay = 200; // Reduced for faster response
      this.debounceTimer = null;
      this.searchCache = new Map(); // Cache search results
      this.maxCacheSize = 100; // Limit cache size for memory management
      
      // Initialize with error handling
      this.initializeEventListeners();
      this.showExamples();
      
      // Set up error recovery
      this.setupErrorRecovery();
      
      // Initialize performance monitoring
      this.initializePerformanceMonitoring();
      
    } catch (error) {
      console.error('Error initializing BuzzwordSearchEngine:', error);
      this.handleInitializationError(error);
    }
  }

  // Handle initialization errors gracefully
  handleInitializationError(error) {
    // Try to show error in the page if possible
    const errorContainer = document.getElementById('noResults') || document.body;
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="initialization-error">
          <h3>Application Error</h3>
          <p>The Corporate Buzzword Translator failed to initialize properly.</p>
          <p>Error: ${this.escapeHtml(error.message)}</p>
          <button onclick="window.location.reload()" class="retry-button">
            Reload Page
          </button>
        </div>
      `;
      errorContainer.style.display = 'block';
    }
  }

  // Set up error recovery mechanisms
  setupErrorRecovery() {
    // Periodic health check
    setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Check every 30 seconds

    // Recovery from memory issues
    if ('memory' in performance) {
      setInterval(() => {
        if (performance.memory.usedJSHeapSize > 50000000) { // 50MB threshold
          console.warn('High memory usage detected, clearing caches');
          this.clearCaches();
        }
      }, 60000); // Check every minute
    }
  }

  // Perform application health check
  performHealthCheck() {
    try {
      // Check if critical elements still exist
      if (!document.getElementById('searchInput')) {
        console.error('Critical DOM element missing, attempting recovery');
        window.location.reload();
        return;
      }

      // Check if buzzwords data is still valid
      if (!this.buzzwords || !Array.isArray(this.buzzwords)) {
        console.error('Buzzwords data corrupted, attempting recovery');
        if (typeof buzzwords !== 'undefined') {
          this.buzzwords = buzzwords;
        } else {
          throw new Error('Cannot recover buzzwords data');
        }
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }

  // Clear caches to free memory
  clearCaches() {
    try {
      // Clear any cached DOM references that might be stale
      this.debounceTimer = null;
      
      // Clear search cache
      this.searchCache.clear();
      
      // Force garbage collection if available (development only)
      if (window.gc && typeof window.gc === 'function') {
        window.gc();
      }
    } catch (error) {
      console.warn('Error clearing caches:', error);
    }
  }

  // Cache search results with LRU eviction
  cacheSearchResults(key, results) {
    try {
      // If cache is full, remove oldest entry (LRU)
      if (this.searchCache.size >= this.maxCacheSize) {
        const firstKey = this.searchCache.keys().next().value;
        this.searchCache.delete(firstKey);
      }
      
      // Cache the results
      this.searchCache.set(key, results);
    } catch (error) {
      console.warn('Error caching search results:', error);
    }
  }

  // Keyboard navigation for results
  navigateResults(direction) {
    try {
      const resultCards = this.resultsContainer.querySelectorAll('.result-card');
      if (resultCards.length === 0) return;

      const currentFocused = document.activeElement;
      let currentIndex = -1;

      // Find currently focused result
      resultCards.forEach((card, index) => {
        if (card.contains(currentFocused) || card === currentFocused) {
          currentIndex = index;
        }
      });

      let nextIndex;
      if (direction === 'down') {
        nextIndex = currentIndex < resultCards.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : resultCards.length - 1;
      }

      // Focus the next result card
      const nextCard = resultCards[nextIndex];
      if (nextCard) {
        nextCard.setAttribute('tabindex', '0');
        nextCard.focus();
        
        // Remove tabindex from other cards
        resultCards.forEach((card, index) => {
          if (index !== nextIndex) {
            card.setAttribute('tabindex', '-1');
          }
        });

        // Update ARIA attributes
        this.searchInput.setAttribute('aria-activedescendant', nextCard.id || `result-${nextIndex}`);
      }
    } catch (error) {
      console.error('Error navigating results:', error);
    }
  }

  // Announce search results to screen readers
  announceSearchResults(resultCount, query) {
    try {
      const announcement = resultCount > 0 
        ? `Found ${resultCount} result${resultCount === 1 ? '' : 's'} for "${query}"`
        : `No results found for "${query}"`;
      
      // Create or update live region for announcements
      let liveRegion = document.getElementById('search-announcements');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'search-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'visually-hidden';
        document.body.appendChild(liveRegion);
      }
      
      liveRegion.textContent = announcement;
    } catch (error) {
      console.error('Error announcing search results:', error);
    }
  }

  initializeEventListeners() {
    try {
      // Validate required DOM elements
      if (!this.searchInput) {
        throw new Error('Search input element not found');
      }
      if (!this.clearButton) {
        throw new Error('Clear button element not found');
      }

      // Debounced search input with clear button visibility
      this.searchInput.addEventListener('input', (e) => {
        try {
          this.debouncedSearch(e.target.value);
          this.updateClearButtonVisibility(e.target.value);
        } catch (inputError) {
          console.error('Error handling input event:', inputError);
          this.handleSearchError(inputError, 'input handler');
        }
      });

      // Clear button functionality
      this.clearButton.addEventListener('click', () => {
        try {
          this.clearSearch();
        } catch (clearError) {
          console.error('Error handling clear button:', clearError);
          // Fallback: manually clear input
          if (this.searchInput) {
            this.searchInput.value = '';
            this.showExamples();
          }
        }
      });

      // Random button functionality
      this.randomButton.addEventListener('click', () => {
        try {
          this.showRandomBuzzword();
        } catch (randomError) {
          console.error('Error handling random button:', randomError);
          // Fallback: show error message
          this.showErrorState('Unable to get random buzzword. Please try again.');
        }
      });

      // Enhanced keyboard navigation
      this.searchInput.addEventListener('keydown', (e) => {
        try {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.performSearch(this.searchInput.value);
          }
          
          // ESC key to clear search
          if (e.key === 'Escape') {
            this.clearSearch();
          }
          
          // Arrow key navigation for results
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateResults(e.key === 'ArrowDown' ? 'down' : 'up');
          }
        } catch (keyError) {
          console.error('Error handling keyboard event:', keyError);
        }
      });

      // Focus handling for better UX
      this.searchInput.addEventListener('focus', () => {
        try {
          this.updateClearButtonVisibility(this.searchInput.value);
        } catch (focusError) {
          console.error('Error handling focus event:', focusError);
        }
      });

      // Global error handler for unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault(); // Prevent default browser error handling
      });

    } catch (error) {
      console.error('Error initializing event listeners:', error);
      this.showErrorState('Failed to initialize the application. Please refresh the page.');
    }
  }

  // Debounced search to optimize performance with error handling
  debouncedSearch(query) {
    try {
      // Clear existing timer
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }

      // Validate query before setting timer
      if (typeof query !== 'string') {
        console.warn('Invalid query type provided to debouncedSearch:', typeof query);
        return;
      }

      // Set new timer
      this.debounceTimer = setTimeout(() => {
        try {
          this.performSearch(query);
        } catch (searchError) {
          console.error('Error in debounced search:', searchError);
          this.handleSearchError(searchError, 'debouncedSearch');
        }
      }, this.debounceDelay);
    } catch (error) {
      console.error('Error in debouncedSearch:', error);
      // Fallback: perform search immediately without debouncing
      try {
        this.performSearch(query);
      } catch (fallbackError) {
        this.handleSearchError(fallbackError, 'debouncedSearch fallback');
      }
    }
  }

  // Main search function with comprehensive error handling and caching
  performSearch(query) {
    const startTime = performance.now();
    
    try {
      // Validate and sanitize input
      const validation = this.validateSearchInput(query);
      
      // Handle empty searches gracefully
      if (validation.message === 'empty') {
        this.showExamples();
        return;
      }

      // Handle validation errors with specific messages
      if (!validation.valid) {
        switch (validation.message) {
          case 'too_short':
            this.showNoResults('Please enter at least 2 characters to search', 'short-input');
            break;
          case 'too_long':
            this.showNoResults('Search query is too long. Please try a shorter term.', 'long-input');
            break;
          case 'invalid_characters':
            this.showNoResults('Please enter letters to search for buzzwords.', 'invalid-input');
            break;
          default:
            this.showNoResults('Please enter a valid search term.', 'invalid-input');
        }
        return;
      }

      // Check cache first for performance
      const cacheKey = validation.sanitized.toLowerCase();
      if (this.searchCache.has(cacheKey)) {
        const cachedResults = this.searchCache.get(cacheKey);
        if (cachedResults.length > 0) {
          this.displayResults(cachedResults, validation.sanitized);
        } else {
          this.showNoResults(null, 'no-results', validation.sanitized);
        }
        
        // Log performance for sub-100ms requirement
        const searchTime = performance.now() - startTime;
        this.logSearchPerformance(searchTime);
        if (searchTime > 100) {
          console.warn(`Search took ${searchTime.toFixed(2)}ms (cached) - exceeds 100ms target`);
        }
        return;
      }

      // Perform search with error handling
      const results = this.searchWithFuzzyMatching(validation.sanitized);
      
      // Cache results for future searches
      this.cacheSearchResults(cacheKey, results);
      
      if (results.length > 0) {
        this.displayResults(results, validation.sanitized);
      } else {
        this.showNoResults(null, 'no-results', validation.sanitized);
      }
      
      // Log performance for sub-100ms requirement
      const searchTime = performance.now() - startTime;
      this.logSearchPerformance(searchTime);
      if (searchTime > 100) {
        console.warn(`Search took ${searchTime.toFixed(2)}ms - exceeds 100ms target`);
      }
      
    } catch (error) {
      this.handleSearchError(error, 'performSearch');
    }
  }

  // Optimized search algorithm with fuzzy matching capabilities and error handling
  searchWithFuzzyMatching(query) {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Invalid query provided to search function');
      }

      if (!this.buzzwords || !Array.isArray(this.buzzwords)) {
        throw new Error('Buzzwords database is not available or corrupted');
      }

      const normalizedQuery = query.toLowerCase().trim();
      const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
      const results = [];

      // Validate query words
      if (queryWords.length === 0) {
        return [];
      }

      // Pre-filter buzzwords for better performance
      const relevantBuzzwords = this.buzzwords.filter(buzzword => {
        if (!buzzword || typeof buzzword !== 'object' || !buzzword.phrase) {
          return false;
        }
        
        // Quick relevance check - if no keywords match at all, skip expensive calculations
        const phrase = buzzword.phrase.toLowerCase();
        return phrase.includes(normalizedQuery) || 
               queryWords.some(word => phrase.includes(word)) ||
               (buzzword.keywords && buzzword.keywords.some(keyword => 
                 keyword.toLowerCase().includes(normalizedQuery) || 
                 queryWords.some(word => keyword.toLowerCase().includes(word))
               ));
      });

      // Process only relevant buzzwords
      relevantBuzzwords.forEach((buzzword, index) => {
        try {
          const searchResult = this.calculateRelevanceScore(buzzword, normalizedQuery, queryWords);
          
          if (searchResult && searchResult.relevanceScore > 0.1) { // Higher threshold for performance
            results.push(searchResult);
          }
        } catch (buzzwordError) {
          console.warn(`Error processing buzzword at index ${index}:`, buzzwordError);
          // Continue processing other buzzwords
        }
      });

      // Optimized sorting with early termination
      return results
        .filter(result => result && typeof result.relevanceScore === 'number')
        .sort((a, b) => {
          // Primary sort: relevance score (descending)
          const scoreDiff = b.relevanceScore - a.relevanceScore;
          if (Math.abs(scoreDiff) > 0.01) return scoreDiff;
          
          // Secondary sort: exact matches first
          if (a.matchType === 'exact' && b.matchType !== 'exact') return -1;
          if (b.matchType === 'exact' && a.matchType !== 'exact') return 1;
          
          // Tertiary sort: phrase contains query
          if (a.matchType === 'phrase_contains' && b.matchType !== 'phrase_contains') return -1;
          if (b.matchType === 'phrase_contains' && a.matchType !== 'phrase_contains') return 1;
          
          // Final sort: shorter phrases first (more specific)
          return (a.match?.length || 0) - (b.match?.length || 0);
        })
        .slice(0, 10); // Limit to top 10 results
    } catch (error) {
      console.error('Error in searchWithFuzzyMatching:', error);
      throw error; // Re-throw to be handled by calling function
    }
  }

  // Comprehensive relevance scoring system
  calculateRelevanceScore(buzzword, normalizedQuery, queryWords) {
    const phrase = buzzword.phrase.toLowerCase();
    let relevanceScore = 0;
    let matchedKeywords = [];
    let matchType = '';

    // 1. Exact phrase match (highest priority)
    if (phrase === normalizedQuery) {
      relevanceScore = 1.0;
      matchType = 'exact';
      matchedKeywords = [normalizedQuery];
    }
    // 2. Phrase contains query (high priority)
    else if (phrase.includes(normalizedQuery)) {
      relevanceScore = 0.95;
      matchType = 'phrase_contains';
      matchedKeywords = [normalizedQuery];
    }
    // 3. Query contains phrase (medium-high priority)
    else if (normalizedQuery.includes(phrase)) {
      relevanceScore = 0.9;
      matchType = 'query_contains';
      matchedKeywords = [phrase];
    }
    // 4. All keywords match (medium priority)
    else {
      const keywordMatchResult = this.calculateKeywordMatches(buzzword, queryWords);
      if (keywordMatchResult.score > 0) {
        relevanceScore = keywordMatchResult.score;
        matchedKeywords = keywordMatchResult.matches;
        matchType = 'keyword';
      }
    }

    // 5. Fuzzy string matching for typos and partial matches
    if (relevanceScore === 0) {
      const fuzzyResult = this.calculateFuzzyMatch(phrase, normalizedQuery);
      if (fuzzyResult.score > 0.3) { // Minimum threshold for fuzzy matches
        relevanceScore = fuzzyResult.score * 0.6; // Lower weight for fuzzy matches
        matchType = 'fuzzy';
        matchedKeywords = [normalizedQuery];
      }
    }

    return {
      match: buzzword.phrase,
      translation: buzzword.translation,
      relevanceScore: relevanceScore,
      matchedKeywords: [...new Set(matchedKeywords)],
      category: buzzword.category,
      context: buzzword.context,
      alternatives: buzzword.alternatives,
      multipleMeanings: buzzword.multipleMeanings,
      matchType: matchType
    };
  }

  // Keyword matching with partial word support
  calculateKeywordMatches(buzzword, queryWords) {
    let totalMatches = 0;
    let matchedKeywords = [];
    
    queryWords.forEach(queryWord => {
      let bestMatch = 0;
      let bestKeyword = '';
      
      buzzword.keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        
        // Exact keyword match
        if (keywordLower === queryWord) {
          bestMatch = Math.max(bestMatch, 1.0);
          bestKeyword = queryWord;
        }
        // Keyword contains query word
        else if (keywordLower.includes(queryWord)) {
          bestMatch = Math.max(bestMatch, 0.8);
          bestKeyword = queryWord;
        }
        // Query word contains keyword
        else if (queryWord.includes(keywordLower)) {
          bestMatch = Math.max(bestMatch, 0.7);
          bestKeyword = queryWord;
        }
        // Fuzzy match for keywords
        else {
          const fuzzyScore = this.calculateFuzzyMatch(keywordLower, queryWord).score;
          if (fuzzyScore > 0.6) {
            bestMatch = Math.max(bestMatch, fuzzyScore * 0.5);
            bestKeyword = queryWord;
          }
        }
      });
      
      if (bestMatch > 0) {
        totalMatches += bestMatch;
        matchedKeywords.push(bestKeyword);
      }
    });

    const score = totalMatches > 0 ? 
      Math.min(0.85, 0.4 + (totalMatches / Math.max(queryWords.length, buzzword.keywords.length)) * 0.45) : 0;

    return {
      score: score,
      matches: matchedKeywords
    };
  }

  // Simple fuzzy matching algorithm for typos and similar strings
  calculateFuzzyMatch(str1, str2) {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    
    if (maxLength === 0) return { score: 1.0 };
    
    const similarity = 1 - (distance / maxLength);
    
    // Bonus for common prefixes
    let prefixBonus = 0;
    const minLength = Math.min(str1.length, str2.length);
    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) {
        prefixBonus += 0.1;
      } else {
        break;
      }
    }
    
    return {
      score: Math.min(1.0, similarity + prefixBonus)
    };
  }

  // Levenshtein distance algorithm for fuzzy matching
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Display search results with highlighting, accessibility, and enhanced DOM manipulation
  displayResults(results, query) {
    try {
      if (!results || !Array.isArray(results)) {
        throw new Error('Invalid results provided to displayResults');
      }

      if (!this.resultsContainer || !this.noResults || !this.resultsSection) {
        throw new Error('Required DOM elements not found');
      }

      this.hideExamples();
      this.noResults.style.display = 'none';
      this.resultsSection.style.display = 'block';
      
      // Clear previous results with error handling
      this.clearResultsContainer();
      
      // Update ARIA attributes for search input
      this.searchInput.setAttribute('aria-expanded', 'true');
      
      // Create and append result cards with staggered animation and accessibility
      results.forEach((result, index) => {
        try {
          if (!result || typeof result !== 'object') {
            console.warn(`Invalid result at index ${index}:`, result);
            return;
          }

          const resultCard = this.createResultCardElement(result, query, index);
          if (resultCard) {
            resultCard.style.animationDelay = `${index * 50}ms`;
            this.resultsContainer.appendChild(resultCard);
          }
        } catch (cardError) {
          console.warn(`Error creating result card at index ${index}:`, cardError);
          // Continue with other results
        }
      });
      
      // Add related suggestions after results with error handling
      try {
        this.addRelatedSuggestions(results, query);
      } catch (suggestionsError) {
        console.warn('Error adding related suggestions:', suggestionsError);
        // Continue without suggestions
      }
      
      // Announce results to screen readers
      this.announceSearchResults(results.length, query);
      
      // Optimize animation performance using requestAnimationFrame
      this.resultsContainer.style.opacity = '0';
      requestAnimationFrame(() => {
        if (this.resultsContainer) {
          this.resultsContainer.style.opacity = '1';
        }
      });
    } catch (error) {
      console.error('Error displaying results:', error);
      this.showErrorState('Unable to display search results. Please try again.');
    }
  }

  // Clear results container with proper cleanup and error handling
  clearResultsContainer() {
    try {
      if (!this.resultsContainer) {
        console.warn('Results container not found during cleanup');
        return;
      }

      // Safe DOM cleanup
      while (this.resultsContainer.firstChild) {
        try {
          this.resultsContainer.removeChild(this.resultsContainer.firstChild);
        } catch (removeError) {
          console.warn('Error removing child element:', removeError);
          // Try alternative cleanup method
          this.resultsContainer.innerHTML = '';
          break;
        }
      }
    } catch (error) {
      console.error('Error clearing results container:', error);
      // Fallback cleanup
      try {
        if (this.resultsContainer) {
          this.resultsContainer.innerHTML = '';
        }
      } catch (fallbackError) {
        console.error('Fallback cleanup also failed:', fallbackError);
      }
    }
  }

  // Create individual result card as DOM element with enhanced functionality and accessibility
  createResultCardElement(result, query, index) {
    const resultCard = document.createElement('div');
    resultCard.className = 'result-card';
    resultCard.setAttribute('data-category', result.category);
    resultCard.setAttribute('data-relevance', result.relevanceScore);
    resultCard.setAttribute('role', 'option');
    resultCard.setAttribute('tabindex', index === 0 ? '0' : '-1');
    resultCard.id = `result-${index}`;
    
    // Add ARIA label for screen readers
    const ariaLabel = `${result.match}: ${result.translation}. Category: ${result.category}. Relevance: ${Math.round(result.relevanceScore * 100)}%`;
    resultCard.setAttribute('aria-label', ariaLabel);
    
    // Add keyboard event handlers
    resultCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Could trigger additional actions like copying to clipboard
        this.announceResultSelection(result);
      }
    });
    
    // Create result header
    const header = this.createResultHeader(result);
    resultCard.appendChild(header);
    
    // Create main translation
    const translation = this.createResultTranslation(result);
    resultCard.appendChild(translation);
    
    // Add context if available
    if (result.context) {
      const context = this.createResultContext(result);
      resultCard.appendChild(context);
    }
    
    // Add alternatives if available
    if (result.alternatives && result.alternatives.length > 0) {
      const alternatives = this.createResultAlternatives(result);
      resultCard.appendChild(alternatives);
    }
    
    // Add multiple meanings support
    if (result.multipleMeanings && result.multipleMeanings.length > 0) {
      const multipleMeanings = this.createMultipleMeanings(result);
      resultCard.appendChild(multipleMeanings);
    }
    
    // Add metadata
    const meta = this.createResultMeta(result);
    resultCard.appendChild(meta);
    
    return resultCard;
  }

  // Announce result selection to screen readers
  announceResultSelection(result) {
    try {
      const announcement = `Selected: ${result.match} means ${result.translation}`;
      
      let liveRegion = document.getElementById('search-announcements');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'search-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'visually-hidden';
        document.body.appendChild(liveRegion);
      }
      
      liveRegion.textContent = announcement;
    } catch (error) {
      console.error('Error announcing result selection:', error);
    }
  }

  // Initialize performance monitoring for 60fps animations and sub-100ms searches
  initializePerformanceMonitoring() {
    try {
      // Monitor frame rate for animations
      this.frameCount = 0;
      this.lastFrameTime = performance.now();
      this.fpsHistory = [];
      
      // Monitor search performance
      this.searchTimes = [];
      this.maxSearchTimeHistory = 20; // Keep last 20 search times
      
      // Start FPS monitoring
      this.monitorFrameRate();
      
      // Performance observer for long tasks
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
      
    } catch (error) {
      console.warn('Error initializing performance monitoring:', error);
    }
  }

  // Monitor frame rate for smooth animations
  monitorFrameRate() {
    try {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;
      
      if (delta > 0) {
        const fps = 1000 / delta;
        this.fpsHistory.push(fps);
        
        // Keep only last 60 frames
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift();
        }
        
        // Check if FPS is consistently below 60
        if (this.fpsHistory.length === 60) {
          const avgFps = this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length;
          if (avgFps < 55) {
            console.warn(`Low FPS detected: ${avgFps.toFixed(1)} fps`);
            this.optimizeForLowPerformance();
          }
        }
      }
      
      requestAnimationFrame(() => this.monitorFrameRate());
    } catch (error) {
      console.warn('Error monitoring frame rate:', error);
    }
  }

  // Optimize for low performance devices
  optimizeForLowPerformance() {
    try {
      // Reduce animation complexity
      document.documentElement.style.setProperty('--transition-normal', '150ms ease');
      document.documentElement.style.setProperty('--transition-slow', '300ms ease');
      
      // Disable some visual effects
      const cards = document.querySelectorAll('.result-card');
      cards.forEach(card => {
        card.style.willChange = 'auto';
      });
      
      console.log('Performance optimizations applied for low-end device');
    } catch (error) {
      console.warn('Error applying performance optimizations:', error);
    }
  }

  // Log search performance
  logSearchPerformance(searchTime) {
    try {
      this.searchTimes.push(searchTime);
      
      // Keep only recent search times
      if (this.searchTimes.length > this.maxSearchTimeHistory) {
        this.searchTimes.shift();
      }
      
      // Calculate average search time
      const avgSearchTime = this.searchTimes.reduce((a, b) => a + b) / this.searchTimes.length;
      
      // Warn if average search time exceeds target
      if (avgSearchTime > 100) {
        console.warn(`Average search time: ${avgSearchTime.toFixed(2)}ms - exceeds 100ms target`);
      }
      
      // Log performance metrics periodically
      if (this.searchTimes.length % 10 === 0) {
        console.log(`Search performance - Avg: ${avgSearchTime.toFixed(2)}ms, Last: ${searchTime.toFixed(2)}ms`);
      }
    } catch (error) {
      console.warn('Error logging search performance:', error);
    }
  }

  // Create result header with enhanced highlighting
  createResultHeader(result) {
    const header = document.createElement('div');
    header.className = 'result-header';
    
    const phrase = document.createElement('h3');
    phrase.className = 'result-phrase';
    phrase.innerHTML = this.highlightMatches(result.match, result.matchedKeywords);
    
    const category = document.createElement('span');
    category.className = 'result-category';
    category.textContent = result.category;
    
    header.appendChild(phrase);
    header.appendChild(category);
    
    return header;
  }

  // Create result translation element
  createResultTranslation(result) {
    const translation = document.createElement('p');
    translation.className = 'result-translation';
    translation.textContent = result.translation;
    return translation;
  }

  // Create result context element
  createResultContext(result) {
    const context = document.createElement('p');
    context.className = 'result-context';
    context.textContent = result.context;
    return context;
  }

  // Create alternatives section
  createResultAlternatives(result) {
    const alternatives = document.createElement('div');
    alternatives.className = 'result-alternatives';
    
    const label = document.createElement('span');
    label.className = 'alternatives-label';
    label.textContent = 'Also known as:';
    alternatives.appendChild(label);
    
    result.alternatives.forEach(alt => {
      const chip = document.createElement('span');
      chip.className = 'alternative-chip';
      chip.textContent = alt;
      alternatives.appendChild(chip);
    });
    
    return alternatives;
  }

  // Create multiple meanings section for buzzwords with multiple interpretations
  createMultipleMeanings(result) {
    const container = document.createElement('div');
    container.className = 'multiple-meanings';
    
    const label = document.createElement('span');
    label.className = 'meanings-label';
    label.textContent = 'Other meanings:';
    container.appendChild(label);
    
    result.multipleMeanings.forEach((meaning, index) => {
      const meaningDiv = document.createElement('div');
      meaningDiv.className = 'meaning-item';
      
      const meaningText = document.createElement('p');
      meaningText.className = 'meaning-translation';
      meaningText.textContent = meaning.translation;
      
      if (meaning.context) {
        const meaningContext = document.createElement('p');
        meaningContext.className = 'meaning-context';
        meaningContext.textContent = meaning.context;
        meaningDiv.appendChild(meaningText);
        meaningDiv.appendChild(meaningContext);
      } else {
        meaningDiv.appendChild(meaningText);
      }
      
      container.appendChild(meaningDiv);
    });
    
    return container;
  }

  // Create result metadata
  createResultMeta(result) {
    const meta = document.createElement('div');
    meta.className = 'result-meta';
    
    const relevanceScore = document.createElement('span');
    relevanceScore.className = 'relevance-score';
    relevanceScore.textContent = `Relevance: ${Math.round(result.relevanceScore * 100)}%`;
    
    const matchType = document.createElement('span');
    matchType.className = 'match-type';
    matchType.textContent = `Match: ${result.matchType}`;
    
    meta.appendChild(relevanceScore);
    meta.appendChild(matchType);
    
    return meta;
  }

  // Enhanced highlighting for matched portions of buzzwords
  highlightMatches(phrase, matchedKeywords) {
    if (!matchedKeywords || matchedKeywords.length === 0) {
      return phrase;
    }
    
    let highlightedPhrase = phrase;
    
    // Sort keywords by length (longest first) to avoid partial replacements
    const sortedKeywords = [...matchedKeywords].sort((a, b) => b.length - a.length);
    
    sortedKeywords.forEach(keyword => {
      if (keyword && keyword.trim()) {
        const escapedKeyword = this.escapeRegex(keyword.trim());
        const regex = new RegExp(`\\b(${escapedKeyword})\\b`, 'gi');
        
        // Only highlight if not already highlighted
        if (!highlightedPhrase.includes(`<mark>${keyword}`)) {
          highlightedPhrase = highlightedPhrase.replace(regex, '<mark class="highlight-match">$1</mark>');
        }
      }
    });
    
    return highlightedPhrase;
  }

  // Enhanced highlighting for partial matches within words
  highlightPartialMatches(phrase, query) {
    if (!query || query.length < 2) {
      return phrase;
    }
    
    const escapedQuery = this.escapeRegex(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    return phrase.replace(regex, '<mark class="highlight-partial">$1</mark>');
  }

  // Escape special regex characters
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Enhanced no results state with context-aware suggestions
  showNoResults(customMessage = null, errorType = 'no-results', searchQuery = '') {
    this.hideExamples();
    this.resultsSection.style.display = 'block';
    this.resultsContainer.innerHTML = '';
    this.noResults.style.display = 'block';
    
    // Generate context-aware content based on error type
    const noResultsContent = this.generateNoResultsContent(customMessage, errorType, searchQuery);
    this.noResults.innerHTML = noResultsContent;
    
    // Add event listeners for suggestion chips
    this.attachNoResultsEventListeners();
  }

  // Generate contextual no results content based on error type
  generateNoResultsContent(customMessage, errorType, searchQuery) {
    if (customMessage) {
      return `
        <div class="no-results-content">
          <h3>Oops!</h3>
          <p>${customMessage}</p>
          ${this.generateHelpfulSuggestions(errorType, searchQuery)}
        </div>
      `;
    }

    switch (errorType) {
      case 'short-input':
        return `
          <div class="no-results-content">
            <h3>Need a bit more to work with</h3>
            <p>Please enter at least 2 characters to search for buzzwords.</p>
            ${this.generatePopularSuggestions()}
          </div>
        `;
      
      case 'long-input':
        return `
          <div class="no-results-content">
            <h3>That's quite a mouthful!</h3>
            <p>Try searching for shorter, more specific terms.</p>
            ${this.generatePopularSuggestions()}
          </div>
        `;
      
      case 'no-results':
      default:
        return `
          <div class="no-results-content">
            <h3>Hmm, that doesn't ring a bell...</h3>
            <p>We couldn't find any matches for "${this.escapeHtml(searchQuery)}". Try these instead:</p>
            ${this.generateSmartSuggestions(searchQuery)}
          </div>
        `;
    }
  }

  // Generate smart suggestions based on search query
  generateSmartSuggestions(searchQuery) {
    const suggestions = this.findSimilarBuzzwords(searchQuery);
    
    if (suggestions.length > 0) {
      const suggestionChips = suggestions.map(suggestion => 
        `<button class="no-results-chip" data-buzzword="${suggestion.phrase}" 
                 title="${suggestion.phrase}: ${suggestion.translation}"
                 tabindex="0" aria-label="Search for ${suggestion.phrase}">
          ${suggestion.phrase}
        </button>`
      ).join('');
      
      return `
        <div class="no-results-suggestions">
          <p class="suggestions-intro">Similar terms you might be looking for:</p>
          ${suggestionChips}
        </div>
        ${this.generatePopularSuggestions()}
      `;
    }
    
    return this.generatePopularSuggestions();
  }

  // Generate popular buzzword suggestions
  generatePopularSuggestions() {
    const popularBuzzwords = [
      'synergy', 'pivot', 'low hanging fruit', 'circle back',
      'leverage', 'bandwidth', 'deep dive', 'move the needle'
    ];
    
    const suggestionChips = popularBuzzwords.map(buzzword => 
      `<button class="no-results-chip" data-buzzword="${buzzword}" 
               tabindex="0" aria-label="Search for ${buzzword}">
        ${buzzword}
      </button>`
    ).join('');
    
    return `
      <div class="no-results-suggestions">
        <p class="suggestions-intro">Or try these popular terms:</p>
        ${suggestionChips}
      </div>
    `;
  }

  // Generate helpful suggestions based on error type
  generateHelpfulSuggestions(errorType, searchQuery) {
    if (errorType === 'short-input' || errorType === 'long-input') {
      return this.generatePopularSuggestions();
    }
    return '';
  }

  // Find similar buzzwords for smart suggestions
  findSimilarBuzzwords(searchQuery) {
    if (!searchQuery || searchQuery.length < 2) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const suggestions = [];
    
    // Find buzzwords that contain parts of the search query
    this.buzzwords.forEach(buzzword => {
      const phrase = buzzword.phrase.toLowerCase();
      const keywords = buzzword.keywords.map(k => k.toLowerCase());
      
      // Check if any keyword starts with the query
      const startsWithMatch = keywords.some(keyword => 
        keyword.startsWith(query) || query.startsWith(keyword)
      );
      
      // Check if phrase contains query or vice versa
      const containsMatch = phrase.includes(query) || query.includes(phrase);
      
      // Check for partial word matches
      const partialMatch = keywords.some(keyword => 
        keyword.includes(query) && Math.abs(keyword.length - query.length) <= 3
      );
      
      if (startsWithMatch || containsMatch || partialMatch) {
        suggestions.push({
          phrase: buzzword.phrase,
          translation: buzzword.translation,
          relevance: startsWithMatch ? 3 : (containsMatch ? 2 : 1)
        });
      }
    });
    
    // Sort by relevance and return top 6
    return suggestions
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 6);
  }

  // Attach event listeners to no results suggestion chips
  attachNoResultsEventListeners() {
    const noResultsChips = this.noResults.querySelectorAll('.no-results-chip');
    noResultsChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        this.handleChipActivation(e.target);
      });
      
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleChipActivation(e.target);
        }
      });
    });
  }

  // Show example buzzwords with enhanced popular terms
  showExamples() {
    this.resultsSection.style.display = 'none';
    this.examplesContainer.style.display = 'block';
    
    // Populate example chips if not already done
    const examplesChips = document.getElementById('examplesChips');
    if (examplesChips.children.length === 0) {
      // Enhanced popular buzzwords selection with variety
      const popularBuzzwords = [
        'synergy', 'pivot', 'low hanging fruit', 'circle back',
        'deep dive', 'move the needle', 'think outside the box', 'leverage',
        'bandwidth', 'actionable insights', 'game changer', 'touch base'
      ];
      
      // Shuffle and select 8 random popular buzzwords for variety
      const shuffled = popularBuzzwords.sort(() => 0.5 - Math.random());
      const selectedBuzzwords = shuffled.slice(0, 8);
      
      examplesChips.innerHTML = selectedBuzzwords.map((buzzword, index) => 
        `<button class="example-chip" data-buzzword="${buzzword}" 
                 title="Click to search for '${buzzword}'" 
                 aria-label="Search for ${buzzword}" 
                 tabindex="0"
                 id="example-${index}">${buzzword}</button>`
      ).join('');
      
      // Add click and keyboard handlers for example chips with smooth interaction
      examplesChips.addEventListener('click', (e) => {
        if (e.target.classList.contains('example-chip')) {
          this.handleChipActivation(e.target);
        }
      });
      
      // Add keyboard support for example chips
      examplesChips.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('example-chip') && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          this.handleChipActivation(e.target);
        }
      });
    }
  }

  // Hide examples
  hideExamples() {
    this.examplesContainer.style.display = 'none';
  }

  // Add related suggestions system that appears with results
  addRelatedSuggestions(results, query) {
    const suggestions = this.generateRelatedSuggestions(results, query);
    
    if (suggestions.length > 0) {
      const suggestionsContainer = document.createElement('div');
      suggestionsContainer.className = 'suggestions-container';
      suggestionsContainer.style.animationDelay = `${results.length * 50 + 200}ms`;
      
      const suggestionsHeader = document.createElement('h4');
      suggestionsHeader.className = 'suggestions-header';
      suggestionsHeader.textContent = 'You might also like:';
      suggestionsContainer.appendChild(suggestionsHeader);
      
      const suggestionsChips = document.createElement('div');
      suggestionsChips.className = 'suggestions-chips';
      
      suggestions.forEach(suggestion => {
        const chip = document.createElement('button');
        chip.className = 'suggestion-chip';
        chip.textContent = suggestion.phrase;
        chip.title = `${suggestion.phrase}: ${suggestion.translation}`;
        chip.setAttribute('aria-label', `Search for ${suggestion.phrase}: ${suggestion.translation}`);
        chip.setAttribute('tabindex', '0');
        chip.dataset.buzzword = suggestion.phrase;
        
        // Add click and keyboard handlers for suggestion chips
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleSuggestionActivation(chip, suggestion.phrase);
        });
        
        chip.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleSuggestionActivation(chip, suggestion.phrase);
          }
        });
        
        suggestionsChips.appendChild(chip);
      });
      
      suggestionsContainer.appendChild(suggestionsChips);
      this.resultsContainer.appendChild(suggestionsContainer);
    }
  }

  // Generate intelligent related suggestions based on search results
  generateRelatedSuggestions(results, query) {
    const suggestions = new Set();
    const maxSuggestions = 6;
    
    // Get categories from current results
    const resultCategories = [...new Set(results.map(r => r.category))];
    
    // Find buzzwords in same categories
    resultCategories.forEach(category => {
      const categoryBuzzwords = this.buzzwords
        .filter(b => b.category === category && 
                !results.some(r => r.match.toLowerCase() === b.phrase.toLowerCase()) &&
                b.phrase.toLowerCase() !== query.toLowerCase())
        .slice(0, 2);
      
      categoryBuzzwords.forEach(b => suggestions.add(b));
    });
    
    // Add popular buzzwords if we need more suggestions
    if (suggestions.size < maxSuggestions) {
      const popularBuzzwords = [
        'synergy', 'pivot', 'leverage', 'bandwidth', 'actionable insights',
        'game changer', 'scalable', 'streamline', 'optimize', 'paradigm shift'
      ];
      
      popularBuzzwords.forEach(phrase => {
        if (suggestions.size >= maxSuggestions) return;
        
        const buzzword = this.buzzwords.find(b => 
          b.phrase.toLowerCase() === phrase.toLowerCase() &&
          !results.some(r => r.match.toLowerCase() === phrase.toLowerCase()) &&
          phrase.toLowerCase() !== query.toLowerCase()
        );
        
        if (buzzword) {
          suggestions.add(buzzword);
        }
      });
    }
    
    // Add random suggestions if still need more
    if (suggestions.size < maxSuggestions) {
      const remainingBuzzwords = this.buzzwords
        .filter(b => 
          !results.some(r => r.match.toLowerCase() === b.phrase.toLowerCase()) &&
          b.phrase.toLowerCase() !== query.toLowerCase() &&
          ![...suggestions].some(s => s.phrase.toLowerCase() === b.phrase.toLowerCase())
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, maxSuggestions - suggestions.size);
      
      remainingBuzzwords.forEach(b => suggestions.add(b));
    }
    
    return [...suggestions].slice(0, maxSuggestions);
  }

  // Handle chip activation (click or keyboard) with error handling
  handleChipActivation(chip) {
    try {
      if (!chip || !chip.dataset) {
        throw new Error('Invalid chip element provided');
      }

      const buzzword = chip.dataset.buzzword;
      
      if (!buzzword || typeof buzzword !== 'string') {
        throw new Error('Invalid buzzword data on chip');
      }
      
      // Add visual feedback with error handling
      try {
        chip.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (chip && chip.style) {
            chip.style.transform = '';
          }
        }, 150);
      } catch (styleError) {
        console.warn('Error applying visual feedback to chip:', styleError);
      }
      
      // Populate search and perform search
      if (this.searchInput) {
        this.searchInput.value = buzzword;
        try {
          this.searchInput.focus();
        } catch (focusError) {
          console.warn('Error focusing search input:', focusError);
        }
      }
      
      this.performSearch(buzzword);
    } catch (error) {
      console.error('Error handling chip activation:', error);
      // Fallback: try to perform search with the chip's text content
      try {
        const fallbackBuzzword = chip.textContent || chip.innerText;
        if (fallbackBuzzword && this.searchInput) {
          this.searchInput.value = fallbackBuzzword;
          this.performSearch(fallbackBuzzword);
        }
      } catch (fallbackError) {
        console.error('Fallback chip activation also failed:', fallbackError);
        this.showErrorState('Unable to process your selection. Please try typing the search term manually.');
      }
    }
  }

  // Handle suggestion chip activation with error handling
  handleSuggestionActivation(chip, phrase) {
    try {
      if (!chip) {
        throw new Error('Invalid chip element provided to suggestion activation');
      }

      if (!phrase || typeof phrase !== 'string') {
        throw new Error('Invalid phrase provided to suggestion activation');
      }

      // Add visual feedback with error handling
      try {
        chip.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (chip && chip.style) {
            chip.style.transform = '';
          }
        }, 150);
      } catch (styleError) {
        console.warn('Error applying visual feedback to suggestion chip:', styleError);
      }
      
      // Populate search and perform new search
      if (this.searchInput) {
        this.searchInput.value = phrase;
      }
      
      this.performSearch(phrase);
      
      // Scroll to top smoothly with error handling
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (scrollError) {
        console.warn('Error scrolling to top:', scrollError);
        // Fallback: instant scroll
        try {
          window.scrollTo(0, 0);
        } catch (fallbackScrollError) {
          console.warn('Fallback scroll also failed:', fallbackScrollError);
        }
      }
    } catch (error) {
      console.error('Error handling suggestion activation:', error);
      // Fallback: try to perform search with the chip's text content
      try {
        const fallbackPhrase = phrase || chip.textContent || chip.innerText;
        if (fallbackPhrase && this.searchInput) {
          this.searchInput.value = fallbackPhrase;
          this.performSearch(fallbackPhrase);
        }
      } catch (fallbackError) {
        console.error('Fallback suggestion activation also failed:', fallbackError);
        this.showErrorState('Unable to process your selection. Please try typing the search term manually.');
      }
    }
  }

  // Update clear button visibility based on input content
  updateClearButtonVisibility(value) {
    if (value && value.trim().length > 0) {
      this.clearButton.classList.add('visible');
    } else {
      this.clearButton.classList.remove('visible');
    }
  }

  // Clear search functionality with accessibility support
  clearSearch() {
    this.searchInput.value = '';
    this.updateClearButtonVisibility('');
    this.searchInput.setAttribute('aria-expanded', 'false');
    this.searchInput.removeAttribute('aria-activedescendant');
    this.searchInput.focus();
    this.showExamples();
    
    // Announce to screen readers
    this.announceSearchResults(0, '');
  }

  // Show random buzzword
  showRandomBuzzword() {
    try {
      if (!this.buzzwords || !Array.isArray(this.buzzwords) || this.buzzwords.length === 0) {
        throw new Error('No buzzwords available');
      }

      // Get a random buzzword
      const randomIndex = Math.floor(Math.random() * this.buzzwords.length);
      const randomBuzzword = this.buzzwords[randomIndex];
      
      if (!randomBuzzword || !randomBuzzword.phrase) {
        throw new Error('Invalid random buzzword selected');
      }

      // Set the search input to the random buzzword
      this.searchInput.value = randomBuzzword.phrase;
      
      // Perform search for the random buzzword
      this.performSearch(randomBuzzword.phrase);
      
      // Update clear button visibility
      this.updateClearButtonVisibility(randomBuzzword.phrase);
      
      // Focus the search input for accessibility
      this.searchInput.focus();
      
      // Announce the random selection to screen readers
      this.announceRandomSelection(randomBuzzword.phrase);
      
    } catch (error) {
      console.error('Error showing random buzzword:', error);
      throw error; // Re-throw to be handled by calling function
    }
  }

  // Announce random buzzword selection to screen readers
  announceRandomSelection(phrase) {
    try {
      const announcement = `Random buzzword selected: ${phrase}`;
      
      let liveRegion = document.getElementById('search-announcements');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'search-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'visually-hidden';
        document.body.appendChild(liveRegion);
      }
      
      liveRegion.textContent = announcement;
    } catch (error) {
      console.error('Error announcing random selection:', error);
    }
  }

  // Handle chip activation with accessibility support
  handleChipActivation(chip) {
    try {
      const buzzword = chip.getAttribute('data-buzzword');
      if (buzzword) {
        this.searchInput.value = buzzword;
        this.updateClearButtonVisibility(buzzword);
        this.performSearch(buzzword);
        
        // Announce the action to screen readers
        const announcement = `Searching for ${buzzword}`;
        let liveRegion = document.getElementById('search-announcements');
        if (!liveRegion) {
          liveRegion = document.createElement('div');
          liveRegion.id = 'search-announcements';
          liveRegion.setAttribute('aria-live', 'polite');
          liveRegion.setAttribute('aria-atomic', 'true');
          liveRegion.className = 'visually-hidden';
          document.body.appendChild(liveRegion);
        }
        liveRegion.textContent = announcement;
      }
    } catch (error) {
      console.error('Error handling chip activation:', error);
    }
  }

  // Input validation and sanitization
  sanitizeInput(input) {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Remove potentially harmful characters and normalize whitespace
    return input
      .replace(/[<>\"'&]/g, '') // Remove HTML/script injection characters
      .replace(/\s+/g, ' ') // Normalize multiple whitespace to single space
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .trim();
  }

  // Escape HTML for safe display
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Show error state for unexpected errors
  showErrorState(message) {
    this.hideExamples();
    this.resultsSection.style.display = 'block';
    this.resultsContainer.innerHTML = '';
    this.noResults.style.display = 'block';
    
    this.noResults.innerHTML = `
      <div class="error-state">
        <h3>Something went wrong</h3>
        <p>${this.escapeHtml(message)}</p>
        <div class="error-actions">
          <button class="retry-button" onclick="window.searchEngine.clearSearch()" 
                  tabindex="0" aria-label="Clear search and try again">
            Try Again
          </button>
        </div>
      </div>
    `;
  }

  // Enhanced error handling for search operations
  handleSearchError(error, context = 'search') {
    console.error(`Error in ${context}:`, error);
    
    // Provide user-friendly error messages based on error type
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.name === 'TypeError') {
      userMessage = 'There was a problem processing your search. Please try a different term.';
    } else if (error.name === 'RangeError') {
      userMessage = 'Your search query is too complex. Please try something simpler.';
    } else if (error.message && error.message.includes('network')) {
      userMessage = 'Connection issue detected. The app works offline, so please try again.';
    }
    
    this.showErrorState(userMessage);
  }

  // Validate search input before processing
  validateSearchInput(input) {
    const sanitized = this.sanitizeInput(input);
    
    // Check for empty input
    if (!sanitized || sanitized.length === 0) {
      return { valid: true, sanitized, message: 'empty' };
    }
    
    // Check for minimum length
    if (sanitized.length < 2) {
      return { valid: false, sanitized, message: 'too_short' };
    }
    
    // Check for maximum length
    if (sanitized.length > 100) {
      return { valid: false, sanitized, message: 'too_long' };
    }
    
    // Check for only special characters or numbers
    if (!/[a-zA-Z]/.test(sanitized)) {
      return { valid: false, sanitized, message: 'invalid_characters' };
    }
    
    return { valid: true, sanitized, message: 'valid' };
  }
}

// Initialize the search engine when DOM is loaded with comprehensive error handling
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Check if buzzwords database is available
    if (typeof buzzwords === 'undefined') {
      throw new Error('Buzzwords database not loaded');
    }

    // Validate buzzwords structure
    if (!Array.isArray(buzzwords) || buzzwords.length === 0) {
      throw new Error('Buzzwords database is empty or invalid');
    }

    // Basic validation of buzzwords data structure
    const invalidBuzzwords = buzzwords.filter((buzzword, index) => {
      if (!buzzword || typeof buzzword !== 'object') {
        console.warn(`Invalid buzzword at index ${index}:`, buzzword);
        return true;
      }
      if (!buzzword.phrase || !buzzword.translation) {
        console.warn(`Incomplete buzzword at index ${index}:`, buzzword);
        return true;
      }
      return false;
    });

    if (invalidBuzzwords.length > buzzwords.length * 0.5) {
      throw new Error('Too many invalid buzzwords in database');
    }

    // Initialize the search engine
    window.searchEngine = new BuzzwordSearchEngine(buzzwords);
    console.log('Corporate Buzzword Translator initialized successfully');
    
  } catch (error) {
    console.error('Failed to initialize Corporate Buzzword Translator:', error);
    
    // Show user-friendly error message
    const errorContainer = document.getElementById('noResults') || 
                          document.getElementById('resultsSection') || 
                          document.body;
    
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="initialization-error" style="text-align: center; padding: 2rem; color: #ef4444;">
          <h3>Unable to Load Application</h3>
          <p>The Corporate Buzzword Translator could not start properly.</p>
          <p style="font-size: 0.9em; color: #6b7280;">Error: ${error.message}</p>
          <div style="margin-top: 1rem;">
            <button onclick="window.location.reload()" 
                    style="background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer;">
              Reload Page
            </button>
          </div>
        </div>
      `;
      errorContainer.style.display = 'block';
    }
  }
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // If search engine exists, try to show error state
  if (window.searchEngine && typeof window.searchEngine.showErrorState === 'function') {
    window.searchEngine.showErrorState('An unexpected error occurred. Please refresh the page if problems persist.');
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
  
  // If search engine exists, try to show error state
  if (window.searchEngine && typeof window.searchEngine.showErrorState === 'function') {
    window.searchEngine.showErrorState('A background error occurred. The application should continue to work normally.');
  }
});

// Browser compatibility checks and fallbacks
(function checkBrowserCompatibility() {
  const requiredFeatures = {
    'Array.isArray': Array.isArray,
    'JSON.parse': JSON.parse,
    'addEventListener': window.addEventListener,
    'querySelector': document.querySelector,
    'requestAnimationFrame': window.requestAnimationFrame
  };

  const missingFeatures = Object.entries(requiredFeatures)
    .filter(([name, feature]) => !feature)
    .map(([name]) => name);

  if (missingFeatures.length > 0) {
    console.error('Browser compatibility issues detected:', missingFeatures);
    
    // Show compatibility error
    const errorContainer = document.getElementById('noResults') || document.body;
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="initialization-error">
          <h3>Browser Compatibility Issue</h3>
          <p>Your browser doesn't support some features required by this application.</p>
          <p>Please try using a modern browser like Chrome, Firefox, Safari, or Edge.</p>
          <p>Missing features: ${missingFeatures.join(', ')}</p>
        </div>
      `;
      errorContainer.style.display = 'block';
    }
    return false;
  }
  
  return true;
})();

// Polyfill for older browsers
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 16);
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function(callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (callback(this[i], i, this)) {
        result.push(this[i]);
      }
    }
    return result;
  };
}