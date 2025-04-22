import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getCourse, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Grid - v2.1.3 to v3.0.0', async () => {
  let hotgrids, course, courseHotgridGlobals;
  const previousAriaRegion = 'This component contains selectable grid items. Select an item to trigger a popup that includes an image with display text. Select the close button to close the popup.';
  const newAriaRegion = 'Selectable image component. Select each item to show more information.';
  whereFromPlugin('Hot Grid - from v2.1.3', { name: 'adapt-hotgrid', version: '<3.0.0' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length;
  });
  mutateContent('Hot Grid - add globals if missing', async (content) => {
    course = getCourse();
    if (!_.has(course, '_globals._components._hotgrid')) _.set(course, '_globals._components._hotgrid', {});
    courseHotgridGlobals = course._globals._components._hotgrid;
    return true;
  });
  mutateContent('Hot Grid - add globals popupPagination attribute', async content => {
    courseHotgridGlobals.popupPagination = '{{itemNumber}} / {{totalItems}}';
    return true;
  });
  mutateContent('Hot Grid - update globals ariaRegion', async content => {
    if (courseHotgridGlobals.ariaRegion === previousAriaRegion) courseHotgridGlobals.ariaRegion = newAriaRegion;
    return true;
  });
  mutateContent('Hot Grid - add _hidePagination', async (content) => {
    hotgrids.forEach(hotgrid => (hotgrid._hidePagination = false));
    return true;
  });
  mutateContent('Hot Grid - add _canCycleThroughPagination', async (content) => {
    hotgrids.forEach(hotgrid => (hotgrid._canCycleThroughPagination = false));
    return true;
  });
  checkContent('Hot Grid - check globals _hotgrid attribute', async content => {
    if (courseHotgridGlobals === undefined) throw new Error('Hot Grid - globals _hotgrid invalid');
    return true;
  });
  checkContent('Hot Grid - check globals popupPagination attribute', async content => {
    const isValid = courseHotgridGlobals.popupPagination === '{{itemNumber}} / {{totalItems}}';
    if (!isValid) throw new Error('Hot Grid - globals popupPagination invalid');
    return true;
  });
  checkContent('Hot Grid - check globals ariaRegion attribute', async content => {
    const isValid = courseHotgridGlobals.ariaRegion === newAriaRegion;
    if (!isValid) throw new Error('Hot Grid - globals ariaRegion invalid');
    return true;
  });
  checkContent('Hot Grid - check _hidePagination attribute', async content => {
    const isValid = hotgrids.every(hotgrid => hotgrid._hidePagination === false);
    if (!isValid) throw new Error('Hot Grid - _hidePagination invalid');
    return true;
  });
  checkContent('Hot Grid - check _canCycleThroughPagination attribute', async content => {
    const isValid = hotgrids.every(hotgrid => hotgrid._canCycleThroughPagination === false);
    if (!isValid) throw new Error('Hot Grid - _canCycleThroughPagination invalid');
    return true;
  });
  updatePlugin('Hot Grid - update to v3.0.0', { name: 'adapt-contrib-hotgrid', version: '3.0.0', framework: '>=3.2.0' });

  testSuccessWhere('correct version with hotgrid components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgrid', version: '2.1.3' }],
    content: [
      { _id: 'c-100', _component: 'hotgrid' },
      { _id: 'c-105', _component: 'hotgrid' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgrid', version: '3.0.0' }]
  });

  testStopWhere('no hotgrid components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgrid', version: '2.1.3' }],
    content: [{ _component: 'other' }]
  });
});

describe('Hot Grid - v3.0.0 to v3.1.0', async () => {
  let hotgrids;
  whereFromPlugin('Hot Grid - from v3.0.0', { name: 'adapt-hotgrid', version: '<3.1.0' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length;
  });
  mutateContent('Hot Grid - update _supportedLayout', async (content) => {
    hotgrids.forEach(hotgrid => {
      if (hotgrid._supportedLayout === 'half-width') hotgrid._supportedLayout = 'full-width';
    });
    return true;
  });
  mutateContent('Hot Grid - add attribution to _itemGraphic', async (content) => {
    hotgrids.forEach(({ _items }) => {
      _items.forEach(({ _itemGraphic }) =>
        _.set(_itemGraphic, 'attribution', '')
      );
    });
    return true;
  });
  checkContent('Hot Grid - check _supportedLayout attribute', async content => {
    const isValid = hotgrids.every(hotgrid => hotgrid._supportedLayout !== 'half-width');
    if (!isValid) throw new Error('Hot Grid - _supportedLayout invalid');
    return true;
  });
  checkContent('Hot Grid - check _itemGraphic attribution', async content => {
    const isValid = hotgrids.every(({ _items }) =>
      _items.every(item =>
        item._itemGraphic?.attribution !== undefined
      )
    );
    if (!isValid) throw new Error('Hot Grid - _itemGraphic attribution invalid');
    return true;
  });
  updatePlugin('Hot Grid - update to v3.1.0', { name: 'adapt-contrib-hotgrid', version: '3.1.0', framework: '>=3.2.0' });

  testSuccessWhere('correct version with hotgrid components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgrid', version: '3.0.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgrid' },
      { _id: 'c-105', _component: 'hotgrid' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgrid', version: '3.1.0' }]
  });

  testStopWhere('no hotgrid components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgrid', version: '3.0.0' }],
    content: [{ _component: 'other' }]
  });
});

describe('Hot Grid - v3.1.0 to v3.2.0', async () => {
  let hotgrids;
  whereFromPlugin('Hot Grid - from v3.1.0', { name: 'adapt-hotgrid', version: '<3.2.0' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length;
  });
  mutateContent('Hot Grid - add _setCompletionOn', async (content) => {
    hotgrids.forEach(hotgrid => (hotgrid._setCompletionOn = 'allItems'));
    return true;
  });
  checkContent('Hot Grid - check _setCompletionOn attribute', async content => {
    const isValid = hotgrids.every(hotgrid => hotgrid._setCompletionOn === 'allItems');
    if (!isValid) throw new Error('Hot Grid - _setCompletionOn invalid');
    return true;
  });
  updatePlugin('Hot Grid - update to v3.2.0', { name: 'adapt-contrib-hotgrid', version: '3.2.0', framework: '>=3.3.0' });

  testSuccessWhere('correct version with hotgrid components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgrid', version: '3.1.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgrid' },
      { _id: 'c-105', _component: 'hotgrid' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-hotgrid', version: '3.2.0' }]
  });

  testStopWhere('no hotgrid components', {
    fromPlugins: [{ name: 'adapt-contrib-hotgrid', version: '3.1.0' }],
    content: [{ _component: 'other' }]
  });
});
