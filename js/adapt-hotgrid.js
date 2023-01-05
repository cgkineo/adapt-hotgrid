import components from 'core/js/components';
import ItemsComponentModel from 'core/js/models/itemsComponentModel';
import HotgridView from './HotgridView';

export default components.register('hotgrid', {
  model: ItemsComponentModel.extend({}),
  view: HotgridView
});
