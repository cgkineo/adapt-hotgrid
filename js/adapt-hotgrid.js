define([
    'core/js/adapt',
    './hotgridModel',
    './hotgridView'
], function(Adapt, HotgridModel, HotgridView) {

    return Adapt.register('hotgrid', {
        model: HotgridModel,
        view: HotgridView
    });

});