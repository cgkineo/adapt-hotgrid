import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Grid - vx.x.x to vx.x.x', async () => {
  let hotgrids, course, courseHotgridGlobals;
  whereFromPlugin('Hot Grid - from vx.x.x', { name: 'adapt-hotgrid', version: '<x.x.x' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length;
  });
  // mutateContent('Hot Grid - add globals if missing', async (content) => {
  //   course = content.find(({ _type }) => _type === 'course');
  //   if (!_.has(course, '_globals._components._hotgrid')) _.set(course, '_globals._components._hotgrid', {});
  //   courseHotgridGlobals = course._globals._components._hotgrid;
  //   return true;
  // });
  // mutateContent('Hot Grid - add globals popupPagination attribute', async content => {
  //   courseHotgridGlobals.popupPagination = '{{itemNumber}} / {{totalItems}}';
  //   return true;
  // });
  // checkContent('Hot Grid - check globals _hotgrid attribute', async content => {
  //   if (courseHotgridGlobals === undefined) throw new Error('Hot Grid - globals _hotgrid invalid');
  //   return true;
  // });
  // checkContent('Hot Grid - check globals popupPagination attribute', async content => {
  //   if (courseHotgridGlobals?.popupPagination !== '{{itemNumber}} / {{totalItems}}') {
  //     throw new Error('Hot Grid - globals popupPagination invalid');
  //   }
  //   return true;
  // });
  updatePlugin('Hot Grid - update to vx.x.x', { name: 'adapt-contrib-hotgrid', version: 'x.x.x', framework: '>=x.x.x' });
});
