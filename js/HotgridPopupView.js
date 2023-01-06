import Adapt from 'core/js/adapt';
import a11y from 'core/js/a11y.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { templates } from 'core/js/reactHelpers';

class HotgridPopupView extends Backbone.View {

  className() {
    return 'hotgrid-popup';
  }

  initialize() {
    this.listenToOnce(Adapt, 'notify:opened', this.onOpened);

    // this.listenTo(this.model.getChildren(), 'all', this.onItemsActiveChange);
    this.listenTo(this.model.getChildren(), {
      'change:_isActive': this.onItemsActiveChange
    });

    this.model.set('onCloseClick', this.onCloseClick.bind(this));

    // Debounce required as a second (bad) click event is dispatched on iOS causing a jump of two items.
    // this.onControlClick = _.debounce(this.onControlClick.bind(this), 100);
    this.model.set('onControlClick', this.onControlClick.bind(this));

    this.updatePageCount();
    this.manageBackNextStates();

    this.render();
  }

  onOpened() {
    this.manageBackNextStates();
    this.handleTabs();
  }

  manageBackNextStates(index = this.model.getActiveItem().get('_index')) {
    const itemCount = this.model.get('_items').length;
    const canCycleThroughPagination = this.model.get('_canCycleThroughPagination');
    const shouldEnableBack = index > 0 || canCycleThroughPagination;
    const shouldEnableNext = index < itemCount - 1 || canCycleThroughPagination;

    this.model.set('shouldEnableBack', shouldEnableBack);
    this.model.set('shouldEnableNext', shouldEnableNext);
  }

  updatePageCount() {
    const paginationTemplate = Adapt.course.get('_globals')._components._hotgrid.popupPagination;
    const template = paginationTemplate || '{{itemNumber}} / {{totalItems}}';
    const itemCount = Handlebars.compile(template || '')({
      itemNumber: this.model.getActiveItem().get('_index') + 1,
      totalItems: this.model.get('_items').length
    });

    this.model.set('itemCount', itemCount);
  }

  onItemsActiveChange(item, _isActive) {
    if (!_isActive) return;

    const index = item.get('_index');

    this.updatePageCount();
    this.handleTabs();
    this.handleFocus(index);
    this.render();
  }

  handleFocus(index) {
    a11y.focusFirst(this.$('.hotgrid-popup__inner .is-active'));
    this.manageBackNextStates(index);
  }

  handleTabs() {
    a11y.toggleHidden(this.$('.hotgrid-popup__item:not(.is-active)'), true);
    a11y.toggleHidden(this.$('.hotgrid-popup__item.is-active'), false);
  }

  render() {
    ReactDOM.render(<templates.hotgridPopup {...this.model.toJSON()} />, this.el);
  }

  onCloseClick() {
    Adapt.trigger('notify:close');
  }

  onControlClick(e) {
    const direction = $(e.currentTarget).data('direction');
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
