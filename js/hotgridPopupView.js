import Adapt from 'core/js/adapt';
import a11y from 'core/js/a11y.js';

class HotgridPopupView extends Backbone.View {

  className() {
    return 'hotgrid-popup';
  }

  events() {
    return {
      'click .js-hotgrid-popup-close': 'closePopup',
      'click .js-hotgrid-control-click': 'onControlClick'
    };
  }

  initialize() {
    // Debounce required as a second (bad) click event is dispatched on iOS causing a jump of two items.
    this.onControlClick = _.debounce(this.onControlClick.bind(this), 100);
    this.listenToOnce(Adapt, 'notify:opened', this.onOpened);
    this.listenTo(this.model.get('_children'), {
      'change:_isActive': this.onItemsActiveChange,
      'change:_isVisited': this.onItemsVisitedChange
    });
    this.render();
  }

  onOpened() {
    this.applyNavigationClasses(this.model.getActiveItem().get('_index'));
    this.updatePageCount();
    this.handleTabs();
  }

  applyNavigationClasses (index) {
    const itemCount = this.model.get('_items').length;
    const canCycleThroughPagination = this.model.get('_canCycleThroughPagination');

    const shouldEnableBack = index > 0 || canCycleThroughPagination;
    const shouldEnableNext = index < itemCount - 1 || canCycleThroughPagination;
    const $controls = this.$('.hotgrid-popup__controls');

    this.$('hotgrid-popup__nav')
      .toggleClass('first', !shouldEnableBack)
      .toggleClass('last', !shouldEnableNext);

    a11y.toggleEnabled($controls.filter('.back'), shouldEnableBack);
    a11y.toggleEnabled($controls.filter('.next'), shouldEnableNext);
  }

  updatePageCount() {
    const template = Adapt.course.get('_globals')._components._hotgrid.popupPagination || '{{itemNumber}} / {{totalItems}}';
    const labelText = Handlebars.compile(template || '')({
      itemNumber: this.model.getActiveItem().get('_index') + 1,
      totalItems: this.model.get('_items').length
    });
    this.$('.hotgrid-popup__count').html(labelText);
  }

  handleTabs() {
    a11y.toggleHidden(this.$('.hotgrid-popup__item:not(.is-active)'), true);
    a11y.toggleHidden(this.$('.hotgrid-popup__item.is-active'), false);
  }

  onItemsActiveChange(item, _isActive) {
    if (!_isActive) return;

    const index = item.get('_index');
    this.updatePageCount();
    this.applyItemClasses(index);
    this.handleTabs();
    this.handleFocus(index);
  }

  applyItemClasses(index) {
    this.$('.hotgrid-popup__item[data-index="' + index + '"]').addClass('is-active').removeAttr('aria-hidden');
    this.$('.hotgrid-popup__item[data-index="' + index + '"] .hotgrid-popup__item-title').attr('id', 'notify-heading');
    this.$('.hotgrid-popup__item:not([data-index="' + index + '"])').removeClass('is-active').attr('aria-hidden', 'true');
    this.$('.hotgrid-popup__item:not([data-index="' + index + '"]) .hotgrid-popup__item-title').removeAttr('id');
  }

  handleFocus(index) {
    a11y.focusFirst(this.$('.hotgrid-popup__inner .is-active'));
    this.applyNavigationClasses(index);
  }

  onItemsVisitedChange(item, _isVisited) {
    if (!_isVisited) return;

    this.$('.hotgrid-popup__item')
      .filter('[data-index="' + item.get('_index') + '"]')
      .addClass('is-visited');
  }

  render() {
    const data = this.model.toJSON();
    data.view = this;
    const template = Handlebars.templates['hotgridPopup'];
    this.$el.html(template(data));
  }

  closePopup(event) {
    Adapt.trigger('notify:close');
  }

  onControlClick(event) {
    const direction = $(event.currentTarget).hasClass('back') ? 'back' : 'next';
    const index = this.getNextIndex(direction);

    if (index !== -1) {
      this.setItemState(index);
    }
  }

  getNextIndex(direction) {
    let index = this.model.getActiveItem().get('_index');
    const lastIndex = this.model.get('_items').length - 1;

    switch (direction) {
      case 'back':
        if (index > 0) return --index;
        if (this.model.get('_canCycleThroughPagination')) return lastIndex;
        break;
      case 'next':
        if (index < lastIndex) return ++index;
        if (this.model.get('_canCycleThroughPagination')) return 0;
    }
    return -1;
  }

  setItemState(index) {
    this.model.getActiveItem().toggleActive();

    const nextItem = this.model.getItem(index);
    nextItem.toggleActive();
    nextItem.toggleVisited(true);
  }

};

export default HotgridPopupView;
