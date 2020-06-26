define([
  'core/js/adapt',
  'core/js/models/itemsComponentModel',
  './hotgridView'
], function(Adapt, ItemsComponentModel, HotgridView) {

  return Adapt.register('hotgrid', {
    model: ItemsComponentModel.extend({}),
    view: HotgridView
  });

});
