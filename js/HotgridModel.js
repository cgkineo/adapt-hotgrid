import ItemsComponentModel from 'core/js/models/itemsComponentModel';

export default class HotgridModel extends ItemsComponentModel {
  init() {
    super.init();
    this.checkIfResetOnRevisit();
  }

  checkIfResetOnRevisit() {
    const isResetOnRevisit = this.get('_isResetOnRevisit');

    // If reset is enabled, set defaults
    if (isResetOnRevisit) this.reset(isResetOnRevisit);
  }
}
