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
  }

  setUpViewData() {
    this.popupView = null;
    this._isPopupOpen = false;
  }

  setUpEventListeners() {
    this.listenTo(Adapt, 'device:changed', this.resizeControl);
  }

  postRender() {
    this.setUpColumns();
    this.$('.hotgrid__widget').imageready(this.setReadyStatus.bind(this));

    if (this.model.get('_setCompletionOn') === 'inview') {
      this.setupInviewCompletion('.hotgrid__widget');
    }
  }

  resizeControl() {
    this.setUpColumns();
    this.render();
  }

  setUpColumns() {
    const columns = this.model.get('_columns');
    const columnWidth = columns && device.isScreenSizeMin('medium') ? 100 / columns : 100;

    this.model.set('_columnWidth', columnWidth);
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
