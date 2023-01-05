import ItemsComponentModel from 'core/js/models/itemsComponentModel';

export default class HotgridModel extends ItemsComponentModel {
  init() {
    super.init();
    this.setUpModelData();
    this.checkIfResetOnRevisit();
  }

  setUpModelData() {
    if (this.get('_canCycleThroughPagination')) return false;

    this.set('_canCycleThroughPagination', false);
  }

  checkIfResetOnRevisit() {
    const isResetOnRevisit = this.get('_isResetOnRevisit');

    // If reset is enabled, set defaults
    if (isResetOnRevisit) this.reset(isResetOnRevisit);
  }
}
