import Adapt from 'core/js/adapt';
import device from 'core/js/device';
import notify from 'core/js/notify';
import ComponentView from 'core/js/views/componentView';
import HotgridPopupView from './HotgridPopupView';

class HotgridView extends ComponentView {

  initialize(...args) {
    super.initialize(...args);

    this.onItemClicked = this.onItemClicked.bind(this);

    this.setUpViewData();
    this.setUpEventListeners();
    this.setItemWidth();
  }

  setUpViewData() {
    this.popupView = null;
    this._isPopupOpen = false;
  }

  setUpEventListeners() {
    this.listenTo(Adapt, 'device:changed', this.setItemWidth);
  }

  setItemWidth() {
    const columns = this.model.get('_columns');
    const fallbackColumns = 2;
    const shouldCalculateColumns = Boolean(columns && device.isScreenSizeMin('medium'));
    this.$el
      .toggleClass(`has-${columns}-columns`, shouldCalculateColumns)
      .toggleClass(`has-${fallbackColumns}-columns`, !shouldCalculateColumns);
    const calculatedColumns = shouldCalculateColumns
      ? columns 
      : fallbackColumns;
    const width = `${100 / calculatedColumns}%`;
    this.el.style.setProperty('--adapt-hotgrid-item-width', width);
  }

  postRender() {
    this.$('.hotgrid__widget').imageready(this.setReadyStatus.bind(this));

    if (this.model.get('_setCompletionOn') === 'inview') {
      this.setupInviewCompletion('.hotgrid__widget');
    }
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

    notify.popup({
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
