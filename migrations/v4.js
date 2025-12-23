import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, getCourse, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Hot Grid - v3.2.0 to v4.0.0', async () => {
  let hotgrids;
  whereFromPlugin('Hot Grid - from v3.2.0', { name: 'adapt-hotgrid', version: '<4.0.0' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length > 0;
  });
  mutateContent('Hot Grid - add _isRound attribute', async (content) => {
    hotgrids.forEach(hotgrid => (hotgrid._isRound = false));
    return true;
  });
  mutateContent('Hot Grid - add item _classes attribute', async (content) => {
    hotgrids.forEach(({ _items }) => {
      _items.forEach(item => (item._classes = ''));
    });
    return true;
  });
  mutateContent('Hot Grid - add _hidePagination attribute', async (content) => {
    hotgrids.forEach(hotgrid => (hotgrid._hidePagination = false));
    return true;
  });
  mutateContent('Hot Grid - add _canCycleThroughPagination attribute', async (content) => {
    hotgrids.forEach(hotgrid => (hotgrid._canCycleThroughPagination = false));
    return true;
  });
  checkContent('Hot Grid - check _isRound attribute', async content => {
    const isValid = hotgrids.every(hotgrid => hotgrid._isRound === false);
    if (!isValid) throw new Error('Hot Grid - _isRound not added to every instance of hotgrid');
    return true;
  });
  checkContent('Hot Grid - check _hidePagination attribute', async content => {
    const isValid = hotgrids.every(hotgrid => hotgrid._hidePagination === false);
    if (!isValid) throw new Error('Hot Grid - _hidePagination not added to every instance of hotgrid');
    return true;
  });
  checkContent('Hot Grid - check _canCycleThroughPagination attribute', async content => {
    const isValid = hotgrids.every(hotgrid => hotgrid._canCycleThroughPagination === false);
    if (!isValid) throw new Error('Hot Grid - _canCycleThroughPagination not added to every instance of hotgrid');
    return true;
  });
  checkContent('Hot Grid - check item _classes', async content => {
    const isValid = hotgrids.every(({ _items }) =>
      _items.every(item => item._classes !== undefined)
    );
    if (!isValid) throw new Error('Hot Grid - _classes not added to every instance of hotgrid item');
    return true;
  });
  updatePlugin('Hot Grid - update to v4.0.0', { name: 'adapt-hotgrid', version: '4.0.0', framework: '>=5.0.0' });

  testSuccessWhere('correct version with hotgrid components and items', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '3.2.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgrid', _items: [{ title: 'Item 1' }] },
      { _id: 'c-105', _component: 'hotgrid', _items: [{ title: 'Item 2' }] }
    ]
  });

  testStopWhere('already at v4.0.0', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.0.0' }]
  });

  testStopWhere('no hotgrid components', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '3.2.0' }],
    content: [{ _component: 'other' }]
  });
});

describe('Hot Grid - v4.1.0 to v4.2.0', async () => {
  let hotgrids;
  whereFromPlugin('Hot Grid - from v4.1.0', { name: 'adapt-hotgrid', version: '<4.2.0' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length > 0;
  });
  mutateContent('Hot Grid - add _columns attribute', async (content) => {
    hotgrids.forEach(hotgrid => {
      if (hotgrid._columns === undefined) hotgrid._columns = 3;
    });
    return true;
  });
  checkContent('Hot Grid - check _columns attribute', async content => {
    const isValid = hotgrids.every(hotgrid => hotgrid._columns !== undefined && hotgrid._columns > 0);
    if (!isValid) throw new Error('Hot Grid - _columns not added to every instance of hotgrid with valid value');
    return true;
  });
  updatePlugin('Hot Grid - update to v4.2.0', { name: 'adapt-hotgrid', version: '4.2.0', framework: '>=5.0.0' });

  testSuccessWhere('correct version with hotgrid components without _columns', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.1.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgrid' },
      { _id: 'c-105', _component: 'hotgrid' }
    ]
  });

  testStopWhere('already at v4.2.0', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.2.0' }]
  });

  testStopWhere('no hotgrid components', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.1.0' }],
    content: [{ _component: 'other' }]
  });
});

describe('Hot Grid - v4.2.0 to v4.3.0', async () => {
  let hotgrids;
  whereFromPlugin('Hot Grid - from v4.2.0', { name: 'adapt-hotgrid', version: '<4.3.0' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length > 0;
  });
  mutateContent('Hot Grid - add item _imageAlignment attribute', async (content) => {
    hotgrids.forEach(({ _items }) => {
      _items.forEach(item => {
        item._imageAlignment = 'right';
      });
    });
    return true;
  });
  checkContent('Hot Grid - check item _imageAlignment', async content => {
    const isValid = hotgrids.every(({ _items }) =>
      _items.every(item => item._imageAlignment === 'right')
    );
    if (!isValid) throw new Error('Hot Grid - _imageAlignment not added to every instance of hotgrid item');
    return true;
  });
  updatePlugin('Hot Grid - update to v4.3.0', { name: 'adapt-hotgrid', version: '4.3.0', framework: '>=5.22.4' });

  testSuccessWhere('correct version with hotgrid components and items', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.2.0' }],
    content: [
      { _id: 'c-100', _component: 'hotgrid', _items: [{ title: 'Item 1' }] },
      { _id: 'c-105', _component: 'hotgrid', _items: [{ title: 'Item 2' }] }
    ]
  });

  testStopWhere('already at v4.3.0', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.3.0' }]
  });

  testStopWhere('no hotgrid components', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.2.0' }],
    content: [{ _component: 'other' }]
  });
});

describe('Hot Grid - v4.3.1 to v4.3.2', async () => {
  let hotgrids, course, courseHotgridGlobals;
  whereFromPlugin('Hot Grid - from v4.3.1', { name: 'adapt-hotgrid', version: '<4.3.2' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length > 0;
  });
  mutateContent('Hot Grid - add globals item attribute', async content => {
    course = getCourse();
    if (!_.has(course, '_globals._components._hotgrid')) {
      _.set(course, '_globals._components._hotgrid', {});
    }
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
    if (!isValid) throw new Error('Hot Grid - course globals item not added or incorrect value');
    return true;
  });
  checkContent('Hot Grid - check globals previous', async content => {
    const isValid = courseHotgridGlobals.previous === '{{#if title}}Back to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.previous}}{{/if}}';
    if (!isValid) throw new Error('Hot Grid - course globals previous not added or incorrect template');
    return true;
  });
  checkContent('Hot Grid - check globals next', async content => {
    const isValid = courseHotgridGlobals.next === '{{#if title}}Forward to {{{title}}} (item {{itemNumber}} of {{totalItems}}){{else}}{{_globals._accessibility._ariaLabels.next}}{{/if}}';
    if (!isValid) throw new Error('Hot Grid - course globals next not added or incorrect template');
    return true;
  });
  updatePlugin('Hot Grid - update to v4.3.2', { name: 'adapt-hotgrid', version: '4.3.2', framework: '>=5.22.4' });

  testSuccessWhere('correct version with course and hotgrid components', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.3.1' }],
    content: [
      { _type: 'course', _globals: { _components: {} } },
      { _id: 'c-100', _component: 'hotgrid' },
      { _id: 'c-105', _component: 'hotgrid' }
    ]
  });

  testStopWhere('already at v4.3.2', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.3.2' }]
  });

  testStopWhere('no hotgrid components', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.3.1' }],
    content: [{ _component: 'other' }]
  });
});

describe('Hot Grid - v4.3.13 to v4.3.14', async () => {
  let hotgrids;
  whereFromPlugin('Hot Grid - from v4.3.13', { name: 'adapt-hotgrid', version: '<4.3.14' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length > 0;
  });
  mutateContent('Hot Grid - update instruction attribute', async (content) => {
    hotgrids.forEach(hotgrid => {
      if (hotgrid.instruction === '') hotgrid.instruction = 'Select the images to find out more.';
    });
    return true;
  });
  checkContent('Hot Grid - check instruction attribute', async content => {
    const isValid = hotgrids.every(hotgrid =>
      hotgrid.instruction === 'Select the images to find out more.'
    );
    if (!isValid) throw new Error('Hot Grid - instruction attribute not set to default value');
    return true;
  });
  updatePlugin('Hot Grid - update to v4.3.14', { name: 'adapt-hotgrid', version: '4.3.14', framework: '>=5.31.2' });

  testSuccessWhere('correct version with hotgrid components with empty instruction', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.3.13' }],
    content: [
      { _id: 'c-100', _component: 'hotgrid', instruction: '' },
      { _id: 'c-105', _component: 'hotgrid', instruction: '' }
    ]
  });

  testStopWhere('already at v4.3.14', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.3.14' }]
  });

  testStopWhere('no hotgrid components', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.3.13' }],
    content: [{ _component: 'other' }]
  });
});

describe('Hot Grid - v4.4.1 to v4.4.2', async () => {
  let hotgrids;
  whereFromPlugin('Hot Grid - from v4.4.1', { name: 'adapt-hotgrid', version: '<4.4.2' });
  whereContent('Hot Grid - where hotgrid', async content => {
    hotgrids = content.filter(({ _component }) => _component === 'hotgrid');
    return hotgrids.length > 0;
  });
  mutateContent('Hot Grid - add _showPlusIcon attribute', async (content) => {
    hotgrids.forEach(hotgrid => (hotgrid._showPlusIcon = true));
    return true;
  });
  checkContent('Hot Grid - check _showPlusIcon attribute', async content => {
    const isValid = hotgrids.every(hotgrid =>
      hotgrid._showPlusIcon === true
    );
    if (!isValid) throw new Error('Hot Grid - _showPlusIcon not added to every instance of hotgrid');
    return true;
  });
  updatePlugin('Hot Grid - update to v4.4.2', { name: 'adapt-hotgrid', version: '4.4.2', framework: '>=5.31.2' });

  testSuccessWhere('correct version with hotgrid components without _showPlusIcon', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.4.1' }],
    content: [
      { _id: 'c-100', _component: 'hotgrid' },
      { _id: 'c-105', _component: 'hotgrid' }
    ]
  });

  testStopWhere('already at v4.4.2', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.4.2' }]
  });

  testStopWhere('no hotgrid components', {
    fromPlugins: [{ name: 'adapt-hotgrid', version: '4.4.1' }],
    content: [{ _component: 'other' }]
  });
});

