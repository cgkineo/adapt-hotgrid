import Adapt from 'core/js/adapt';
import device from 'core/js/device';
import ComponentView from 'core/js/views/componentView';
import HotgridPopupView from './HotgridPopupView';

class HotgridView extends ComponentView {

  initialize(...args) {
    super.initialize(...args);

    this.onItemClicked = this.onItemClicked.bind(this);

    this.setDeviceSize();
    this.setUpViewData();
    this.setUpEventListeners();
  }

  setUpViewData() {
    this.popupView = null;
    this._isPopupOpen = false;
  }

  setUpEventListeners() {
    this.listenTo(Adapt, 'device:changed', this.resizeControl);
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
  }

  setUpColumns() {
    const columns = this.model.get('_columns');

    if (columns && device.screenSize === 'large') {
      this.$('.hotgrid__item').css('width', (100 / columns) + '%');
    }
  }

  getItemElement(model) {
    const index = model.get('_index');
    return this.$('.hotgrid__item-btn').filter('[data-index="' + index + '"]');
  }

  onItemClicked(e) {
    e.preventDefault();

    const item = this.model.getItem($(e.currentTarget).data('index'));
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

HotgridView.template = 'hotgrid.jsx';

export default HotgridView;
