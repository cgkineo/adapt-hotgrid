import Adapt from 'core/js/adapt';
import device from 'core/js/device';
import ComponentView from 'core/js/views/componentView';
import HotgridPopupView from './hotgridPopupView';

class HotgridView extends ComponentView {

  events() {
    return {
      'click .js-hotgrid-item-click': 'onItemClicked'
    };
  }

  initialize() {
    ComponentView.prototype.initialize.call(this);
    this.setDeviceSize();
    this.setUpViewData();
    this.setUpModelData();
    this.setUpEventListeners();
    this.checkIfResetOnRevisit();
  }

  setUpViewData() {
    this.popupView = null;
    this._isPopupOpen = false;
  }

  setUpModelData() {
    if (this.model.get('_canCycleThroughPagination') === undefined) {
      this.model.set('_canCycleThroughPagination', false);
    }
  }

  setUpEventListeners() {
    this.listenTo(Adapt, 'device:changed', this.resizeControl);

    this.listenTo(this.model.get('_children'), {
      'change:_isActive': this.onItemsActiveChange,
      'change:_isVisited': this.onItemsVisitedChange
    });
  }

  setDeviceSize() {
    if (device.screenSize === 'large') {
      this.$el.addClass('is-desktop').removeClass('is-mobile');
      this.model.set('_isDesktop', true);
    } else {
      this.$el.addClass('is-mobile').removeClass('is-desktop');
      this.model.set('_isDesktop', false);
    }
  }

  checkIfResetOnRevisit() {
    const isResetOnRevisit = this.model.get('_isResetOnRevisit');

    // If reset is enabled set defaults
    if (isResetOnRevisit) this.model.reset(isResetOnRevisit);
  }

  postRender() {
    this.setUpColumns();
    this.$('.hotgrid__widget').imageready(this.setReadyStatus.bind(this));
    if (this.model.get('_setCompletionOn') === 'inview') {
      this.setupInviewCompletion('.component__widget');
    }
  }

  resizeControl() {
    this.setDeviceSize();
    this.render();
    this.updateVisitedState();
  }

  setUpColumns() {
    const columns = this.model.get('_columns');

    if (columns && device.screenSize === 'large') {
      this.$('.hotgrid__item').css('width', (100 / columns) + '%');
    }
  }

  onItemsActiveChange(model, _isActive) {
    this.getItemElement(model).toggleClass('is-active', _isActive);
  }

  getItemElement(model) {
    const index = model.get('_index');
    return this.$('.hotgrid__item-btn').filter('[data-index="' + index + '"]');
  }

  updateVisitedState(itemModel) {
    const itemModels = itemModel ? [itemModel] : this.model.getChildren().models;

    _.each(itemModels, function(model) {
      if (!model.get('_isVisited')) return;

      const $item = this.getItemElement(model);

      // Append the word 'visited' to the item's aria-label
      const visitedLabel = this.model.get('_globals')._accessibility._ariaLabels.visited + '.';
      $item.find('.aria-label').each(function(index, ariaLabel) {
        ariaLabel.innerHTML += ' ' + visitedLabel;
      });

      $item.addClass('is-visited');
    }, this);
  }

  onItemsVisitedChange(model, _isVisited) {
    if (!_isVisited) return;
    this.updateVisitedState(model);
  }

  onItemClicked(event) {
    if (event) event.preventDefault();

    const item = this.model.getItem($(event.currentTarget).data('index'));
    item.toggleActive(true);
    item.toggleVisited(true);

    this.openPopup();
  }

  openPopup() {
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
    });

    this.listenToOnce(Adapt, {
      'popup:closed': this.onPopupClosed
    });
  }

  onPopupClosed() {
    this.model.getActiveItem().toggleActive();
    this._isPopupOpen = false;
  }
};

// HotgridView.template = 'hotgrid.jsx';

export default HotgridView;
