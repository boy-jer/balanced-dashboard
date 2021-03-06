//  time in ms to throttle between key presses for search
Balanced.THROTTLE = 400;

Balanced.SearchView = Balanced.View.extend({
  templateName: 'search',

  resultsClass: 'with-results',
  sorts: ['unsorted', 'ascending', 'descending'],

  // TODO - Do we need these here? Seems like they're mirroring the controller...
  sortOrder: null,

  didInsertElement: function() {
    $(document).on('click', $.proxy(this.shouldCloseSearch, this));
  },

  selectSearchResult: function(uri) {
    this.reset();
    this.get('controller').send('selectSearchResult', uri);
  },

  closeSearch: function() {
    this.reset();
  },

  shouldCloseSearch: function(e) {
      var $target = $(e.target);
      // sometimes ember likes to remove nodes from the dom when you click on
      // them so the body check will make sure it's legit.
      if ($target.closest('#search').length === 0 && $target.closest('body').length > 0) {
        $('#search').removeClass(this.resultsClass);
        $("body").removeClass("overlaid");
      }
  },

  reset: function() {
    var $q = $('#q');
    var $searchArea = $('#search');
    $searchArea.removeClass(this.resultsClass);
    $q.val('').focus();

    $("body").removeClass("overlaid");
    this.resetHeader();
  },

  resetHeader: function() {
    this.resetSortOrder();
    this.resetDateTimePicker();
  },

  resetSortOrder: function() {
    var allSorts = $('#search .sortable');
    allSorts.removeClass(this.sorts.join(' '));
  },

  resetDateTimePicker: function() {
    var $dps = $('#search .dp'),
      $sets = $('#search .set-times li');

    $sets.removeClass('selected');
    $dps.val('');
    $('#search .timing > .dropdown-toggle > span').text('Any time');
  },

  onQueryChange: function(e) {
    var self = this;

    if($("#q").val().length === 0) {
      self.toggleResults();
      return;
    }

    self._runSearch(function() {
      self.toggleResults();
      self._highlightResults();
    });
  },

  onSortChange: function(e, field) {
    var $t = $(e.currentTarget);
    var sequences = {};
    this.resetSortOrder();
    for (var i = 0; i < this.sorts.length; i++) {
      sequences[this.sorts[i]] = this.sorts[(i + 1) % this.sorts.length];
    }
    var currentSort = $t.data('direction') || 'unsorted';
    var nextSort = sequences[currentSort];
    $t.data('direction', nextSort).addClass(nextSort);

    var mappedSortOrder = "none";
    switch(nextSort) {
      case "ascending":
        mappedSortOrder = "asc";
        break;
      case "descending":
        mappedSortOrder = "desc";
        break;
    }

    this._setSortOrder(field, mappedSortOrder);
  },

  onChangeSearchType: function(e, searchType) {
    var $t = $(e.currentTarget);

    ////
    // Don't re-run query if already on selected
    ////
    if($t.closest('li').hasClass("selected")) {
      return;
    }

    var typeToClass = {
        'transaction': 'transactions',
        'account': 'accounts',
        'funding_instrument': 'funding-instruments'
    };
    var typeToSelect = typeToClass[searchType] || searchType;

    $t.closest('nav').find(' > li').removeClass('selected');
    $t.closest('li').addClass('selected');
    $('#search .items').removeClass('selected');
    $('#search .items.' + typeToSelect).addClass('selected');

    this.get('controller').send('changeTypeFilter', searchType);
    this._runSearch();
  },

  filterResultType: function(e, filter, label) {
    var $t = $(e.currentTarget);

    $t.parents("nav").find("li.selected").removeClass("selected");
    $t.parents("li.filter").addClass("selected");

    this.get('controller').send('changeTypeFilter', filter);
    this._runSearch();
  },

  toggleResults: function() {
    var $q = $('#q');
    var $searchArea = $('#search');
    var fn = $q.val() ? $searchArea.addClass : $searchArea.removeClass;
    fn.call($searchArea, this.resultsClass);

    if($q.val()) {
      $("body").addClass("overlaid");
    } else {
      $("body").removeClass("overlaid");
    }
  },

  _highlightResults: function() {
    var query = $('#q').val();

    //  remove empty words
    $('#search .results tbody').highlightWords(query);
  },

  _setSortOrder: function(field, sortOrder) {
    this.get("controller").send("changeSortOrder", field, sortOrder);
  },

  _runSearch: function(callback) {
    this.get('controller').send('query', callback);
  }
});

Balanced.SearchQueryInputView = Ember.TextField.extend({
  attributeBindings: ['autocomplete'],

  didInsertElement: function() {
    this.keyUp = _.throttle(function(e) {
      // Hide search results on escape key
      if(e.keyCode === Balanced.KEYS.ESCAPE) {
        $("#search").removeClass(this.resultsClass);
        $("body").removeClass("overlaid");
        return;
      }

      this.get('parentView').onQueryChange(e);

    }, Balanced.THROTTLE);
  },

  focusIn: function(e) {
    $('#search').addClass('focus');
  },

  focusOut: function(e) {
    $('#search').removeClass('focus');
  },
});

Balanced.SearchSortableColumnHeaderView = Balanced.View.extend({
  tagName: 'th',

  click: function(e) {
    this.get('parentView').onSortChange(e, this.field);
  }
});

Balanced.SearchTypeView = Balanced.View.extend({
  tagName: 'a',
  attributeBindings: ['href'],
  href: '#',

  click: function(e) {
    e.preventDefault();
    this.get('parentView').onChangeSearchType(e, this.searchType);
  }
});

Balanced.SearchFilterResultView = Balanced.View.extend({
  tagName: 'a',
  attributeBindings: ['href'],
  href: '#',

  click: function(e) {
    e.preventDefault();
    this.get('parentView').filterResultType(e, this.filter, this.label);
  }
});
