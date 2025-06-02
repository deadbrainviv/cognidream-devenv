/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class FastDomNode<T extends HTMLElement> {

    private _maxWidth: string = '';
    private _width: string = '';
    private _height: string = '';
    private _top: string = '';
    private _left: string = '';
    private _bottom: string = '';
    private _right: string = '';
    private _paddingTop: string = '';
    private _paddingLeft: string = '';
    private _paddingBottom: string = '';
    private _paddingRight: string = '';
    private _fontFamily: string = '';
    private _fontWeight: string = '';
    private _fontSize: string = '';
    private _fontStyle: string = '';
    private _fontFeatureSettings: string = '';
    private _fontVariationSettings: string = '';
    private _textDecoration: string = '';
    private _lineHeight: string = '';
    private _letterSpacing: string = '';
    private _className: string = '';
    private _display: string = '';
    private _position: string = '';
    private _visibility: string = '';
    private _color: string = '';
    private _backgroundColor: string = '';
    private _layerHint: boolean = false;
    private _contain: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint' = 'none';
    private _boxShadow: string = '';

    constructor(
        public readonly domNode: T
    ) { }

    public focus(): cognidream {
        this.domNode.focus();
    }

    public setMaxWidth(_maxWidth: number | string): cognidream {
        const maxWidth = numberAsPixels(_maxWidth);
        if (this._maxWidth === maxWidth) {
            return;
        }
        this._maxWidth = maxWidth;
        this.domNode.style.maxWidth = this._maxWidth;
    }

    public setWidth(_width: number | string): cognidream {
        const width = numberAsPixels(_width);
        if (this._width === width) {
            return;
        }
        this._width = width;
        this.domNode.style.width = this._width;
    }

    public setHeight(_height: number | string): cognidream {
        const height = numberAsPixels(_height);
        if (this._height === height) {
            return;
        }
        this._height = height;
        this.domNode.style.height = this._height;
    }

    public setTop(_top: number | string): cognidream {
        const top = numberAsPixels(_top);
        if (this._top === top) {
            return;
        }
        this._top = top;
        this.domNode.style.top = this._top;
    }

    public setLeft(_left: number | string): cognidream {
        const left = numberAsPixels(_left);
        if (this._left === left) {
            return;
        }
        this._left = left;
        this.domNode.style.left = this._left;
    }

    public setBottom(_bottom: number | string): cognidream {
        const bottom = numberAsPixels(_bottom);
        if (this._bottom === bottom) {
            return;
        }
        this._bottom = bottom;
        this.domNode.style.bottom = this._bottom;
    }

    public setRight(_right: number | string): cognidream {
        const right = numberAsPixels(_right);
        if (this._right === right) {
            return;
        }
        this._right = right;
        this.domNode.style.right = this._right;
    }

    public setPaddingTop(_paddingTop: number | string): cognidream {
        const paddingTop = numberAsPixels(_paddingTop);
        if (this._paddingTop === paddingTop) {
            return;
        }
        this._paddingTop = paddingTop;
        this.domNode.style.paddingTop = this._paddingTop;
    }

    public setPaddingLeft(_paddingLeft: number | string): cognidream {
        const paddingLeft = numberAsPixels(_paddingLeft);
        if (this._paddingLeft === paddingLeft) {
            return;
        }
        this._paddingLeft = paddingLeft;
        this.domNode.style.paddingLeft = this._paddingLeft;
    }

    public setPaddingBottom(_paddingBottom: number | string): cognidream {
        const paddingBottom = numberAsPixels(_paddingBottom);
        if (this._paddingBottom === paddingBottom) {
            return;
        }
        this._paddingBottom = paddingBottom;
        this.domNode.style.paddingBottom = this._paddingBottom;
    }

    public setPaddingRight(_paddingRight: number | string): cognidream {
        const paddingRight = numberAsPixels(_paddingRight);
        if (this._paddingRight === paddingRight) {
            return;
        }
        this._paddingRight = paddingRight;
        this.domNode.style.paddingRight = this._paddingRight;
    }

    public setFontFamily(fontFamily: string): cognidream {
        if (this._fontFamily === fontFamily) {
            return;
        }
        this._fontFamily = fontFamily;
        this.domNode.style.fontFamily = this._fontFamily;
    }

    public setFontWeight(fontWeight: string): cognidream {
        if (this._fontWeight === fontWeight) {
            return;
        }
        this._fontWeight = fontWeight;
        this.domNode.style.fontWeight = this._fontWeight;
    }

    public setFontSize(_fontSize: number | string): cognidream {
        const fontSize = numberAsPixels(_fontSize);
        if (this._fontSize === fontSize) {
            return;
        }
        this._fontSize = fontSize;
        this.domNode.style.fontSize = this._fontSize;
    }

    public setFontStyle(fontStyle: string): cognidream {
        if (this._fontStyle === fontStyle) {
            return;
        }
        this._fontStyle = fontStyle;
        this.domNode.style.fontStyle = this._fontStyle;
    }

    public setFontFeatureSettings(fontFeatureSettings: string): cognidream {
        if (this._fontFeatureSettings === fontFeatureSettings) {
            return;
        }
        this._fontFeatureSettings = fontFeatureSettings;
        this.domNode.style.fontFeatureSettings = this._fontFeatureSettings;
    }

    public setFontVariationSettings(fontVariationSettings: string): cognidream {
        if (this._fontVariationSettings === fontVariationSettings) {
            return;
        }
        this._fontVariationSettings = fontVariationSettings;
        this.domNode.style.fontVariationSettings = this._fontVariationSettings;
    }

    public setTextDecoration(textDecoration: string): cognidream {
        if (this._textDecoration === textDecoration) {
            return;
        }
        this._textDecoration = textDecoration;
        this.domNode.style.textDecoration = this._textDecoration;
    }

    public setLineHeight(_lineHeight: number | string): cognidream {
        const lineHeight = numberAsPixels(_lineHeight);
        if (this._lineHeight === lineHeight) {
            return;
        }
        this._lineHeight = lineHeight;
        this.domNode.style.lineHeight = this._lineHeight;
    }

    public setLetterSpacing(_letterSpacing: number | string): cognidream {
        const letterSpacing = numberAsPixels(_letterSpacing);
        if (this._letterSpacing === letterSpacing) {
            return;
        }
        this._letterSpacing = letterSpacing;
        this.domNode.style.letterSpacing = this._letterSpacing;
    }

    public setClassName(className: string): cognidream {
        if (this._className === className) {
            return;
        }
        this._className = className;
        this.domNode.className = this._className;
    }

    public toggleClassName(className: string, shouldHaveIt?: boolean): cognidream {
        this.domNode.classList.toggle(className, shouldHaveIt);
        this._className = this.domNode.className;
    }

    public setDisplay(display: string): cognidream {
        if (this._display === display) {
            return;
        }
        this._display = display;
        this.domNode.style.display = this._display;
    }

    public setPosition(position: string): cognidream {
        if (this._position === position) {
            return;
        }
        this._position = position;
        this.domNode.style.position = this._position;
    }

    public setVisibility(visibility: string): cognidream {
        if (this._visibility === visibility) {
            return;
        }
        this._visibility = visibility;
        this.domNode.style.visibility = this._visibility;
    }

    public setColor(color: string): cognidream {
        if (this._color === color) {
            return;
        }
        this._color = color;
        this.domNode.style.color = this._color;
    }

    public setBackgroundColor(backgroundColor: string): cognidream {
        if (this._backgroundColor === backgroundColor) {
            return;
        }
        this._backgroundColor = backgroundColor;
        this.domNode.style.backgroundColor = this._backgroundColor;
    }

    public setLayerHinting(layerHint: boolean): cognidream {
        if (this._layerHint === layerHint) {
            return;
        }
        this._layerHint = layerHint;
        this.domNode.style.transform = this._layerHint ? 'translate3d(0px, 0px, 0px)' : '';
    }

    public setBoxShadow(boxShadow: string): cognidream {
        if (this._boxShadow === boxShadow) {
            return;
        }
        this._boxShadow = boxShadow;
        this.domNode.style.boxShadow = boxShadow;
    }

    public setContain(contain: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint'): cognidream {
        if (this._contain === contain) {
            return;
        }
        this._contain = contain;
        (<any>this.domNode.style).contain = this._contain;
    }

    public setAttribute(name: string, value: string): cognidream {
        this.domNode.setAttribute(name, value);
    }

    public removeAttribute(name: string): cognidream {
        this.domNode.removeAttribute(name);
    }

    public appendChild(child: FastDomNode<T>): cognidream {
        this.domNode.appendChild(child.domNode);
    }

    public removeChild(child: FastDomNode<T>): cognidream {
        this.domNode.removeChild(child.domNode);
    }
}

function numberAsPixels(value: number | string): string {
    return (typeof value === 'number' ? `${value}px` : value);
}

export function createFastDomNode<T extends HTMLElement>(domNode: T): FastDomNode<T> {
    return new FastDomNode(domNode);
}
