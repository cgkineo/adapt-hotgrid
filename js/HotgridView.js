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
  }

  setUpViewData() {
    this.popupView = null;
    this._isPopupOpen = false;
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

    this.notifyView = notify.popup({
      _view: this.popupView,
      _isCancellable: true,
      _showCloseButton: false,
      _classes: 'hotgrid ' + this.model.get('_classes')
    });

    this.listenToOnce(Adapt, {
      'popup:closed': this.onPopupClosed
    });
  }

  onPopupClosed(view) {
    if (view !== this.notifyView) return;
    this.model.getActiveItem().toggleActive();
    this._isPopupOpen = false;
  }
};

HotgridView.template = 'hotgrid.jsx';

export default HotgridView;
