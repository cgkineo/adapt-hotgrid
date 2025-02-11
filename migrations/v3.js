import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Grid - vx.x.x to v3.0.0', async () => {
  let hotgrids, course, courseHotgridGlobals;
  const previousAriaRegion = 'This component contains selectable grid items. Select an item to trigger a popup that includes an image with display text. Select the close button to close the popup.';
  const newAriaRegion = 'Selectable image component. Select each item to show more information.';
  whereFromPlugin('Hot Grid - from vx.x.x', { name: 'adapt-hotgrid', version: '<3.0.0' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length;
  });
  mutateContent('Hot Grid - add globals if missing', async (content) => {
    course = content.find(({ _type }) => _type === 'course');
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
    const isValid = courseHotgridGlobals?.popupPagination === '{{itemNumber}} / {{totalItems}}';
    if (!isValid) throw new Error('Hot Grid - globals popupPagination invalid');
    return true;
  });
  checkContent('Hot Grid - check globals ariaRegion attribute', async content => {
    const isValid = courseHotgridGlobals?.ariaRegion === newAriaRegion;
    if (!isValid) throw new Error('Hot Grid - globals ariaRegion invalid');
    return true;
  });
  checkContent('Hot Grid - check _hidePagination attribute', async content => {
    const isValid = hotgrids.every(hotgrid => (hotgrid._hidePagination === false));
    if (!isValid) throw new Error('Hot Grid - _hidePagination invalid');
    return true;
  });
  checkContent('Hot Grid - check _canCycleThroughPagination attribute', async content => {
    const isValid = hotgrids.every(hotgrid => (hotgrid._canCycleThroughPagination === false));
    if (!isValid) throw new Error('Hot Grid - _canCycleThroughPagination invalid');
    return true;
  });
  updatePlugin('Hot Grid - update to v3.0.0', { name: 'adapt-contrib-hotgrid', version: '3.0.0', framework: '>=3.2.0' });
});
