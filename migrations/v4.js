import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
// import _ from 'lodash';

describe('Hot Grid - v3.2.0 to v4.0.0', async () => {
  let hotgrids;
  whereFromPlugin('Hot Grid - from v3.2.0', { name: 'adapt-hotgrid', version: '<4.0.0' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length;
  });
  mutateContent('Hot Grid - add _isRound attribute', async (content) => {
    hotgrids.forEach(hotgrid => (hotgrid._isRound = false));
    return true;
  });
  mutateContent('Hot Grid - add item _classes attribute', async (content) => {
    hotgrids.forEach(({ _items }) => (_items.forEach(item => (item._classes = ''))));
    return true;
  });
  checkContent('Hot Grid - check _isRound attribute', async content => {
    const isValid = hotgrids.every(hotgrid => (hotgrid._isRound === false));
    if (!isValid) throw new Error('Hot Grid - _isRound invalid');
    return true;
  });
  checkContent('Hot Grid - check item _classes', async content => {
    const isValid = hotgrids.every(({ _items }) => _items.every(item => item._classes !== undefined));
    if (!isValid) throw new Error('Hot Grid - item _classes invalid');
    return true;
  });
  updatePlugin('Hot Grid - update to v4.0.0', { name: 'adapt-contrib-hotgrid', version: '4.0.0', framework: '>=5.0.0' });
});

describe('Hot Grid - v4.0.0 to v4.3.0', async () => {
  let hotgrids;
  whereFromPlugin('Hot Grid - from v4.0.0', { name: 'adapt-hotgrid', version: '<4.3.0' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length;
  });
  mutateContent('Hot Grid - add item _imageAlignment attribute', async (content) => {
    hotgrids.forEach(({ _items }) => (_items.forEach(item => (item._imageAlignment = 'right'))));
    return true;
  });
  checkContent('Hot Grid - check item _imageAlignment', async content => {
    const isValid = hotgrids.every(({ _items }) => _items.every(item => item._imageAlignment === 'right'));
    if (!isValid) throw new Error('Hot Grid - item _imageAlignment invalid');
    return true;
  });
  updatePlugin('Hot Grid - update to v4.3.0', { name: 'adapt-contrib-hotgrid', version: '4.3.0', framework: '>=5.22.4' });
});

describe('Hot Grid - v4.3.0 to v4.3.2', async () => {
  let hotgrids, course, courseHotgridGlobals;
  whereFromPlugin('Hot Grid - from v4.3.0', { name: 'adapt-hotgrid', version: '<4.3.2' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length;
  });
  mutateContent('Hot Grid - add globals item attribute', async content => {
    course = content.find(({ _type }) => _type === 'course');
    courseHotgridGlobals = course._globals._components._hotgrid;
    courseHotgridGlobals.item = 'Item';
    return true;
  });
  mutateContent('Hot Grid - add globals previous attribute', async content => {
    courseHotgridGlobals.previous = '{{#if title}}Back to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.previous}}{{/if}}';
    return true;
  });
  mutateContent('Hot Grid - add globals next attribute', async content => {
    courseHotgridGlobals.next = '{{#if title}}Forward to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.next}}{{/if}}';
    return true;
  });
  checkContent('Hot Grid - check globals item', async content => {
    const isValid = courseHotgridGlobals.item === 'Item';
    if (!isValid) throw new Error('Hot Grid - globals item invalid');
    return true;
  });
  checkContent('Hot Grid - check globals previous', async content => {
    const isValid = courseHotgridGlobals.previous === '{{#if title}}Back to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.previous}}{{/if}}';
    if (!isValid) throw new Error('Hot Grid - globals previous invalid');
    return true;
  });
  checkContent('Hot Grid - check globals next', async content => {
    const isValid = courseHotgridGlobals.next === '{{#if title}}Forward to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.next}}{{/if}}';
    if (!isValid) throw new Error('Hot Grid - globals next invalid');
    return true;
  });
  updatePlugin('Hot Grid - update to v4.3.2', { name: 'adapt-contrib-hotgrid', version: '4.3.2', framework: '>=5.22.4' });
});

// describe('Hot Grid - v4.3.2 to v4.3.4', async () => {
//   let hotgrids;
//   whereFromPlugin('Hot Grid - from v4.3.2', { name: 'adapt-hotgrid', version: '<4.3.4' });
//   whereContent('Hot Grid - where hotgrid', async content => {
//     hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
//     return hotgrids.length;
//   });

//   updatePlugin('Hot Grid - update to v4.3.4', { name: 'adapt-contrib-hotgrid', version: '4.3.4', framework: '>=5.22.4' });
// });

// describe('Hot Grid - v4.3.4 to v4.3.14', async () => {
//   let hotgrids;
//   whereFromPlugin('Hot Grid - from v4.3.4', { name: 'adapt-hotgrid', version: '<4.3.14' });
//   whereContent('Hot Grid - where hotgrid', async content => {
//     hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
//     return hotgrids.length;
//   });

//   updatePlugin('Hot Grid - update to v4.3.14', { name: 'adapt-contrib-hotgrid', version: '4.3.14', framework: '>=5.31.2' });
// });

// describe('Hot Grid - v4.3.14 to v4.4.2', async () => {
//   let hotgrids;
//   whereFromPlugin('Hot Grid - from v4.3.14', { name: 'adapt-hotgrid', version: '<4.4.2' });
//   whereContent('Hot Grid - where hotgrid', async content => {
//     hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
//     return hotgrids.length;
//   });

//   updatePlugin('Hot Grid - update to v4.4.2', { name: 'adapt-contrib-hotgrid', version: '4.4.2', framework: '>=5.31.2' });
// });
