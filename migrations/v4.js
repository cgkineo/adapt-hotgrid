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
