import React, { useEffect } from 'react';
import a11y from 'core/js/a11y';
import { classes, compile, templates } from 'core/js/reactHelpers';

export default function HotgridPopup(props) {

  const {
    _items,
    _isRound
  } = props;

  useEffect(() => {
    const activeItem = _items.filter(item => item._isActive);

    if (!activeItem.length) return;

    const activeItemIndex = activeItem[0]._index;
    const focusElement = $(`.hotgrid-popup__item[data-index=${activeItemIndex}]`);

    a11y.focusFirst(focusElement);
  });

  return (
    <div className='hotgrid-popup__inner'>

      {_items.map(({ title, body, _itemGraphic, _graphic, _classes, _isVisited, _isActive, _imageAlignment }, index) =>
        <div className={classes([
          'hotgrid-popup__item',
          _classes,
          _isRound && 'is-round',
          _isVisited && 'is-visited',
          _isActive && 'is-active',
          _graphic?.src && `align-image-${_imageAlignment || 'right'}`
        ])}
        key={index}
        data-index={index}
        aria-hidden={!_isActive ? true : null}
        >

          {(_imageAlignment === 'left' || _imageAlignment === 'top') &&
          <templates.image {...(_itemGraphic.src ? _itemGraphic : _graphic)}
            classNamePrefixSeparator='__item-'
            classNamePrefixes={['component-item', 'hotgrid-popup']}
            attributionClassNamePrefixes={['component', 'hotgrid-popup']}
          />
          }

          <div className="hotgrid-popup__item-content">
            <div className="hotgrid-popup__item-content-inner">

              {title &&
              <div
                id={_isActive && 'notify-heading'}
                className="hotgrid-popup__item-title"
                role="heading"
                aria-level={a11y.ariaLevel({ level: 'notify' })}
              >
                <div
                  className="hotgrid-popup__item-title-inner"
                  dangerouslySetInnerHTML={{ __html: compile(title) }}
                />
              </div>
              }

              {body &&
              <div className="hotgrid-popup__item-body">
                <div
                  className="hotgrid-popup__item-body-inner"
                  dangerouslySetInnerHTML={{ __html: compile(body) }}
                />
              </div>
              }

            </div>
          </div>

          {(_imageAlignment !== 'left' && _imageAlignment !== 'top') &&
          <templates.image {...(_itemGraphic.src ? _itemGraphic : _graphic)}
            classNamePrefixSeparator='__item-'
            classNamePrefixes={['component-item', 'hotgrid-popup']}
            attributionClassNamePrefixes={['component', 'hotgrid-popup']}
          />
          }

        </div>
      )}

      <templates.hotgridPopupToolbar {...props} />

    </div>

  );
}
