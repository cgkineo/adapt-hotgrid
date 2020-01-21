define([
  'core/js/adapt',
  'core/js/views/componentView',
  './hotgridPopupView'
], function(Adapt, ComponentView, HotgridPopupView) {

  var HotgridView = ComponentView.extend({

    events: {
      'click .js-hotgrid-item-click': 'onItemClicked'
    },

    initialize: function() {
      ComponentView.prototype.initialize.call(this);
      this.setDeviceSize();
      this.setUpViewData();
      this.setUpModelData();
      this.setUpEventListeners();
      this.checkIfResetOnRevisit();
    },

    setUpViewData: function() {
      this.popupView = null;
      this._isPopupOpen = false;
    },

    setUpModelData: function() {
      if (this.model.get('_canCycleThroughPagination') === undefined) {
        this.model.set('_canCycleThroughPagination', false);
      }
    },

    setUpEventListeners: function() {
      this.listenTo(Adapt, 'device:changed', this.resizeControl);

      this.listenTo(this.model.get('_children'), {
        'change:_isActive': this.onItemsActiveChange,
        'change:_isVisited': this.onItemsVisitedChange
      });
    },

    setDeviceSize: function() {
      if (Adapt.device.screenSize === 'large') {
        this.$el.addClass('is-desktop').removeClass('is-mobile');
        this.model.set('_isDesktop', true);
      } else {
        this.$el.addClass('is-mobile').removeClass('is-desktop');
        this.model.set('_isDesktop', false)
      }
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) this.model.reset(isResetOnRevisit);
    },

    postRender: function() {
      this.setUpColumns();
      this.$('.hotgrid__widget').imageready(this.setReadyStatus.bind(this));
      if (this.model.get('_setCompletionOn') === 'inview') {
        this.setupInviewCompletion('.component__widget');
      }
    },

    resizeControl: function() {
      this.setDeviceSize();
      this.render();
      this.updateVisitedState();
    },

    setUpColumns: function() {
      var columns = this.model.get('_columns');

      if (columns && Adapt.device.screenSize === 'large') {
        this.$('.hotgrid__item').css('width', (100 / columns) + '%');
      }
    },

    onItemsActiveChange: function(model, _isActive) {
      this.getItemElement(model).toggleClass('is-active', _isActive);
    },

    getItemElement: function(model) {
      var index = model.get('_index');
      return this.$('.hotgrid__item-btn').filter('[data-index="' + index + '"]');
    },

    updateVisitedState:function(itemModel) {
      var itemModels = itemModel ? [itemModel] : this.model.getChildren().models;

      _.each(itemModels, function(model) {
        if (!model.get('_isVisited')) return;

        var $item = this.getItemElement(model);

        // Append the word 'visited' to the item's aria-label
        var visitedLabel = this.model.get('_globals')._accessibility._ariaLabels.visited + '.';
        $item.find('.aria-label').each(function(index, ariaLabel) {
          ariaLabel.innerHTML += ' ' + visitedLabel;
        });

        $item.addClass('is-visited');
      }, this);
    },

    onItemsVisitedChange: function(model, _isVisited) {
      if (!_isVisited) return;
      this.updateVisitedState(model);
    },

    onItemClicked: function(event) {
      if (event) event.preventDefault();

      var item = this.model.getItem($(event.currentTarget).data('index'));
      item.toggleActive(true);
      item.toggleVisited(true);

      this.openPopup();
    },

    openPopup: function() {
      if (this._isPopupOpen) return;

      this._isPopupOpen = true;

      this.popupView = new HotgridPopupView({
        model: this.model
      });

      Adapt.trigger('notify:popup', {
        _view: this.popupView,
        _isCancellable: true,
        _showCloseButton: false,
        _classes: 'hotgrid ' + this.model.get('_classes')
      })

      this.listenToOnce(Adapt, {
        'popup:closed': this.onPopupClosed
      });
    },

    onPopupClosed: function() {
      this.model.getActiveItem().toggleActive();
      this._isPopupOpen = false;
    }

  });

  return HotgridView;

});
