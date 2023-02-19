"use strict";
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["main"],{

/***/ 1710:
/*!**************************!*\
  !*** ./src/app/Color.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Color": () => (/* binding */ Color)
/* harmony export */ });
/* harmony import */ var _Equation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Equation */ 3672);
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Model */ 1313);


class Color {
    constructor(model) {
        this.rgb = model.toRGB();
        this.hex = model.toHEX();
        this.hsl = model.toHSL();
        this.hwb = model.toHWB();
        this.cmyk = model.toCMYK();
        this.models = [this.rgb, this.hex, this.hsl, this.hwb, this.cmyk];
    }
    update(changed) {
        for (let model of this.models) {
            if (model.name !== changed.name) {
                model.update(changed.toModel(model));
            }
        }
    }
    operate(sign, ...colors) {
        let rgb = this.rgb;
        for (let color of colors) {
            switch (sign) {
                case _Equation__WEBPACK_IMPORTED_MODULE_0__.Sign.Plus:
                    rgb = rgb.Add(color.rgb);
                    break;
                case _Equation__WEBPACK_IMPORTED_MODULE_0__.Sign.Minus:
                    rgb = rgb.Sub(color.rgb);
                    break;
                case _Equation__WEBPACK_IMPORTED_MODULE_0__.Sign.Mix:
                    rgb = rgb.Mix(color.rgb);
                    break;
            }
        }
        return new Color(rgb);
    }
    getShade() {
        if (this.hsl.c.value <= 50) {
            return 'white';
        }
        return 'black';
    }
    semiInvert() {
        let R = 0, G = 0, B = 0;
        if (this.rgb.a.value < this.rgb.a.max / 2) {
            R = this.rgb.a.max;
        }
        if (this.rgb.b.value < this.rgb.b.max / 2) {
            G = this.rgb.b.max;
        }
        if (this.rgb.c.value < this.rgb.c.max / 2) {
            B = this.rgb.c.max;
        }
        return new Color(new _Model__WEBPACK_IMPORTED_MODULE_1__.RGB(R, G, B));
    }
    invert() {
        let color = this.operate(_Equation__WEBPACK_IMPORTED_MODULE_0__.Sign.Minus, new Color(new _Model__WEBPACK_IMPORTED_MODULE_1__.HSL(0, 100, 100)));
        return color;
    }
    toString() {
        return this.hex.toString() + ' ' + this.rgb.toString();
    }
    static toColor(hex) {
        let R = hex.repeat(1).slice(1, 3);
        let G = hex.repeat(1).slice(3, 5);
        let B = hex.repeat(1).slice(5, 7);
        return new Color(new _Model__WEBPACK_IMPORTED_MODULE_1__.HEX(R, G, B));
    }
}


/***/ }),

/***/ 6599:
/*!***************************!*\
  !*** ./src/app/Cursor.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cursor": () => (/* binding */ Cursor)
/* harmony export */ });
class Cursor {
    constructor(x, y, size) {
        this.radius = 6; //for displaying
        this.x = x;
        this.y = y;
        this.canvasSize = size;
    }
    setCoords(c, angle) {
        this.x = c * Math.cos(angle * Math.PI / 180);
        this.y = c * Math.sin(angle * Math.PI / 180);
    }
    invertCoords(initial) {
        this.x = -initial.x;
        this.y = -initial.y;
    }
}


/***/ }),

/***/ 3672:
/*!*****************************!*\
  !*** ./src/app/Equation.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Equation": () => (/* binding */ Equation),
/* harmony export */   "Sign": () => (/* binding */ Sign)
/* harmony export */ });
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Color */ 1710);

var Sign;
(function (Sign) {
    Sign["Plus"] = "+";
    Sign["Minus"] = "-";
    Sign["Mix"] = "&";
})(Sign || (Sign = {}));
class Equation {
    constructor(row = '') {
        this.signs = [];
        this.result = '';
        /*
        row - the whole equation, consists both from hexs and signs
        hexs - all terms of the equation, except for the result
        signs - all signs except for the '='
        result - the hex, representing the result
        */
        if (row != '') {
            this.hexs = row.split(new RegExp('[+&=-]{1}', 'g')); //split at any sign
            this.signs = row.split(new RegExp('[#A-Fa-f0-9]{7}', 'g')).map(el => el); //split at any hex
            /*as the row starts with hex and ends,
            when splitted there will be two empty string from both ends*/
            this.signs.shift(); //removing first emplty string
            this.signs.pop(); //removing last emplty string
            this.signs.pop(); //removing = sign, beacuse it's at the tail of array
            //removing the last hex (result) and storing it
            this.result = this.hexs.pop();
        }
        else {
            //default
            this.hexs = ['#000000', '#000000'];
            this.signs = [Sign.Plus];
        }
    }
    add(hex) {
        this.hexs.push(hex);
        this.signs.push(Sign.Plus);
    }
    remove() {
        this.hexs.pop();
        this.signs.pop();
    }
    getResult() {
        //updating colors for the rendering and calculating the result
        if (this.hexs.filter(el => el.length < 7).length > 0) {
            return this.result;
        }
        this.result = this.hexs[0];
        let result;
        for (let i = 1; i < this.hexs.length; i++) {
            result = _Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor(this.result);
            this.result = result.operate(this.signs[i - 1], _Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor(this.hexs[i])).hex.toString();
        }
        return this.result;
    }
}


/***/ }),

/***/ 6692:
/*!**************************!*\
  !*** ./src/app/Field.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Field": () => (/* binding */ Field)
/* harmony export */ });
class Field {
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }
}


/***/ }),

/***/ 1313:
/*!**************************!*\
  !*** ./src/app/Model.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CMYK": () => (/* binding */ CMYK),
/* harmony export */   "HEX": () => (/* binding */ HEX),
/* harmony export */   "HSL": () => (/* binding */ HSL),
/* harmony export */   "HWB": () => (/* binding */ HWB),
/* harmony export */   "Model": () => (/* binding */ Model),
/* harmony export */   "RGB": () => (/* binding */ RGB)
/* harmony export */ });
/* harmony import */ var _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrimitiveType */ 7031);
/* harmony import */ var _Field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Field */ 6692);


class Model {
    constructor() {
        this.name = '';
        this.fullName = '';
        this.fields = [];
    }
    get(value) {
        switch (value) {
            case 'a':
                return this.a;
            case 'b':
                return this.b;
            case 'c':
                return this.c;
            case 'd':
                return this.d;
        }
    }
    toModel(base) {
        return this[('to' + base.name.toUpperCase())]();
    }
    update(model) {
        this.a = model.a;
        this.b = model.b;
        this.c = model.c;
        this.d = model.d;
    }
    default() {
        var _a;
        this.a.handle();
        this.b.handle();
        this.c.handle();
        (_a = this.d) === null || _a === void 0 ? void 0 : _a.handle();
    }
    eq(self, ...models) {
        for (let model of models) {
            model = model.toModel(self);
            if (!this.a.eq(model.a) || !this.b.eq(model.b) || !this.c.eq(model.c)) {
                return false;
            }
        }
        return true;
    }
}
class RGB extends Model {
    constructor(red, green, blue) {
        super();
        this.name = 'rgb';
        this.fullName = 'Red Green Blue';
        this.a = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(red, 255);
        this.b = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(green, 255);
        this.c = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(blue, 255);
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('a', 'R'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('b', 'G'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('c', 'B'));
    }
    getGradient(value) {
        let pre = 'linear-gradient(to right, black, ';
        switch (value) {
            case 'a':
                return pre + 'red)';
            case 'b':
                return pre + 'lime)';
            case 'c':
                return pre + 'blue)';
        }
        return '';
    }
    toRGB() {
        return this;
    }
    toHEX() {
        this.default();
        let R = this.a.value.toString(16);
        let G = this.b.value.toString(16);
        let B = this.c.value.toString(16);
        return new HEX(R, G, B);
    }
    toHSL() {
        this.default();
        let R = this.a.value / 255;
        let G = this.b.value / 255;
        let B = this.c.value / 255;
        let Max = Math.max(R, G, B);
        let Min = Math.min(R, G, B);
        let C = Max - Min;
        // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
        let H = 0;
        let S = 0;
        let L = (Max + Min) / 2;
        if (L != 0 && L != 1) {
            S = Math.round((Max - L) / Math.min(L, 1 - L) * 100);
        }
        L = Math.round(L * 100);
        if (C == 0) {
            H = 0;
        }
        else {
            let segment, shift;
            switch (Max) {
                case R:
                    segment = (G - B) / C;
                    shift = 0 / 60;
                    if (segment < 0) {
                        shift = 360 / 60;
                    }
                    H = segment + shift;
                    break;
                case G:
                    segment = (B - R) / C;
                    shift = 120 / 60;
                    H = segment + shift;
                    break;
                case B:
                    segment = (R - G) / C;
                    shift = 240 / 60;
                    H = segment + shift;
                    break;
            }
        }
        return new HSL(Math.round(H * 60), S, L);
    }
    toHWB() {
        this.default();
        let R = this.a.value / 255;
        let G = this.b.value / 255;
        let B = this.c.value / 255;
        let Max = Math.max(R, G, B);
        let Min = Math.min(R, G, B);
        let C = Max - Min;
        // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
        let H = 0;
        let S = 0;
        let L = (Max + Min) / 2;
        if (L != 0 && L != 1) {
            S = Math.round((Max - L) / Math.min(L, 1 - L) * 100) / 100;
        }
        L = Math.round(L * 100) / 100;
        let V = (L + Math.min(L, 1 - L) * S);
        if (V == 0) {
            S = 0;
        }
        else {
            S = 2 * (1 - L / V);
        }
        let W = Math.round((1 - S) * V * 100);
        let K = Math.round((1 - V) * 100);
        if (C == 0) {
            H = 0;
        }
        else {
            let segment, shift;
            switch (Max) {
                case R:
                    segment = (G - B) / C;
                    shift = 0 / 60;
                    if (segment < 0) {
                        shift = 360 / 60;
                    }
                    H = segment + shift;
                    break;
                case G:
                    segment = (B - R) / C;
                    shift = 120 / 60;
                    H = segment + shift;
                    break;
                case B:
                    segment = (R - G) / C;
                    shift = 240 / 60;
                    H = segment + shift;
                    break;
            }
        }
        return new HWB(Math.round(H * 60), W, K);
    }
    toCMYK() {
        this.default();
        let R = this.a.value / 255;
        let G = this.b.value / 255;
        let B = this.c.value / 255;
        let C = 0;
        let M = 0;
        let Y = 0;
        let K = 1 - Math.max(R, G, B);
        if (K == 1) {
            K = Math.round(K * 100);
            return new CMYK(C, M, Y, K);
        }
        C = Math.round((1 - R - K) / (1 - K) * 100);
        M = Math.round((1 - G - K) / (1 - K) * 100);
        Y = Math.round((1 - B - K) / (1 - K) * 100);
        K = Math.round(K * 100);
        return new CMYK(C, M, Y, K);
    }
    Add(...rgbs) {
        let R = this.a, G = this.b, B = this.c;
        for (let rgb of rgbs) {
            R = R.Add(rgb.a);
            G = G.Add(rgb.b);
            B = B.Add(rgb.c);
        }
        return new RGB(R.value, G.value, B.value);
    }
    Sub(...rgbs) {
        let R = this.a, G = this.b, B = this.c;
        for (let rgb of rgbs) {
            R = R.Sub(rgb.a);
            G = G.Sub(rgb.b);
            B = B.Sub(rgb.c);
        }
        return new RGB(R.value, G.value, B.value);
    }
    Mix(...rgbs) {
        let R = this.a, G = this.b, B = this.c;
        for (let rgb of rgbs) {
            R = R.Mix(rgb.a);
            G = G.Mix(rgb.b);
            B = B.Mix(rgb.c);
        }
        return new RGB(R.value, G.value, B.value);
    }
    toString() {
        return `${this.a}, ${this.b}, ${this.c}`;
    }
}
class HEX extends Model {
    constructor(red, green, blue) {
        super();
        this.name = 'hex';
        this.fullName = 'Hexademical';
        this.a = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.String(red);
        this.b = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.String(green);
        this.c = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.String(blue);
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('a', 'R'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('b', 'G'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('c', 'B'));
    }
    getGradient() {
        return '';
    }
    toRGB() {
        this.default();
        let R = parseInt(this.a.value, 16);
        let G = parseInt(this.b.value, 16);
        let B = parseInt(this.c.value, 16);
        return new RGB(R, G, B);
    }
    toHEX() {
        return this;
    }
    toHSL() {
        this.default();
        let R = parseInt(this.a.value, 16) / 255;
        let G = parseInt(this.b.value, 16) / 255;
        let B = parseInt(this.c.value, 16) / 255;
        let Max = Math.max(R, G, B);
        let Min = Math.min(R, G, B);
        let C = Max - Min;
        // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
        let H = 0;
        let S = 0;
        let L = (Max + Min) / 2;
        if (!(L == 0 || L == 1)) {
            S = Math.round((Max - L) / Math.min(L, 1 - L) * 100);
        }
        L = Math.round(L * 100);
        if (C == 0) {
            H = 0;
        }
        else {
            let segment, shift;
            switch (Max) {
                case R:
                    segment = (G - B) / C;
                    shift = 0 / 60;
                    if (segment < 0) {
                        shift = 360 / 60;
                    }
                    H = segment + shift;
                    break;
                case G:
                    segment = (B - R) / C;
                    shift = 120 / 60;
                    H = segment + shift;
                    break;
                case B:
                    segment = (R - G) / C;
                    shift = 240 / 60;
                    H = segment + shift;
                    break;
            }
        }
        return new HSL(Math.round(H * 60), S, L);
    }
    toHWB() {
        return this.toHSL().toHWB();
    }
    toCMYK() {
        this.default();
        let R = parseInt(this.a.value, 16) / 255;
        let G = parseInt(this.b.value, 16) / 255;
        let B = parseInt(this.c.value, 16) / 255;
        let C = 0;
        let M = 0;
        let Y = 0;
        let K = 1 - Math.max(R, G, B);
        if (K == 1) {
            K = Math.round(K * 100);
            return new CMYK(C, M, Y, K);
        }
        C = Math.round((1 - R - K) / (1 - K) * 100);
        M = Math.round((1 - G - K) / (1 - K) * 100);
        Y = Math.round((1 - B - K) / (1 - K) * 100);
        K = Math.round(K * 100);
        return new CMYK(C, M, Y, K);
    }
    toString() {
        return '#' + [this.a, this.b, this.c].map(el => el.toString()).map(el => el.length == 1 ? '0' + el : el).join('');
    }
}
class HSL extends Model {
    constructor(hue, saturation, lightness) {
        super();
        this.name = 'hsl';
        this.fullName = 'Hue Saturation Lightness';
        this.a = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(hue, 360);
        this.b = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(saturation, 100);
        this.c = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(lightness, 100);
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('a', 'H'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('b', 'S'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('c', 'L'));
    }
    getGradient(value) {
        let pre = 'linear-gradient(to right,';
        switch (value) {
            case 'a':
                return pre + ` red, yellow, lime, cyan, blue, magenta, red)`;
            case 'b':
                return pre + ` grey, ${this.toHEX().toString()})`;
            case 'c':
                return pre + ` black, ${this.toHEX().toString()}, white)`;
        }
        return '';
    }
    toRGB() {
        this.default();
        let H = this.a.value;
        let S = this.b.value / 100;
        let L = this.c.value / 100;
        // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
        let a = S * Math.min(L, 1 - L);
        let f = (n) => {
            let k = (n + H / 30) % 12;
            return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        };
        let R = Math.round(255 * f(0));
        let G = Math.round(255 * f(8));
        let B = Math.round(255 * f(4));
        return new RGB(R, G, B);
    }
    toHEX() {
        this.default();
        let H = this.a.value;
        let S = this.b.value / 100;
        let L = this.c.value / 100;
        // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
        let a = S * Math.min(L, 1 - L);
        let f = (n) => {
            let k = (n + H / 30) % 12;
            return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        };
        let R = Math.round(255 * f(0)).toString(16);
        let G = Math.round(255 * f(8)).toString(16);
        let B = Math.round(255 * f(4)).toString(16);
        return new HEX(R, G, B);
    }
    toHSL() {
        return this;
    }
    toHWB() {
        this.default();
        let H = this.a.value;
        let S = this.b.value / 100;
        let L = this.c.value / 100;
        let V = (L + Math.min(L, 1 - L) * S);
        if (V == 0) {
            S = 0;
        }
        else {
            S = 2 * (1 - L / V);
        }
        let W = Math.round((1 - S) * V * 100);
        let B = Math.round((1 - V) * 100);
        return new HWB(H, W, B);
    }
    toCMYK() {
        return this.toRGB().toCMYK();
    }
    toString() {
        return `${this.a}, ${this.b}%, ${this.c}%`;
    }
}
class HWB extends Model {
    constructor(hue, whiteness, blackness) {
        super();
        this.name = 'hwb';
        this.fullName = 'Hue Whiteness Blackness';
        this.a = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(hue, 360);
        this.b = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(whiteness, 100);
        this.c = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(blackness, 100);
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('a', 'H'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('b', 'W'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('c', 'B'));
    }
    getGradient(value) {
        let pre = 'linear-gradient(to right,';
        switch (value) {
            case 'a':
                return pre + ` red, yellow, lime, cyan, blue, magenta, red)`;
            case 'b':
                return pre + ` ${this.toHEX().toString()}, white)`;
            case 'c':
                return pre + ` ${this.toHEX().toString()}, black)`;
        }
        return '';
    }
    toRGB() {
        this.default();
        let H = this.a.value;
        let W = this.b.value / 100;
        let K = this.c.value / 100;
        if (K == 1) {
            return new RGB(0, 0, 0);
        }
        let S = 1 - (W / (1 - K));
        let V = 1 - K;
        let L = V * (1 - (S / 2));
        if (L == 0 || L == 1) {
            S = 0;
        }
        else {
            S = (V - L) / Math.min(L, 1 - L);
        }
        // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
        let a = S * Math.min(L, 1 - L);
        let f = (n) => {
            let k = (n + H / 30) % 12;
            return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        };
        let R = Math.round(255 * f(0));
        let G = Math.round(255 * f(8));
        let B = Math.round(255 * f(4));
        return new RGB(R, G, B);
    }
    toHEX() {
        this.default();
        let H = this.a.value;
        let W = this.b.value / 100;
        let K = this.c.value / 100;
        if (K == 1) {
            return new HEX('0', '0', '0');
        }
        let S = 1 - (W / (1 - K));
        let V = 1 - K;
        let L = V * (1 - (S / 2));
        if (L == 0 || L == 1) {
            S = 0;
        }
        else {
            S = (V - L) / Math.min(L, 1 - L);
        }
        // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
        let a = S * Math.min(L, 1 - L);
        let f = (n) => {
            let k = (n + H / 30) % 12;
            return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        };
        let R = Math.round(255 * f(0)).toString(16);
        let G = Math.round(255 * f(8)).toString(16);
        let B = Math.round(255 * f(4)).toString(16);
        return new HEX(R, G, B);
    }
    toHSL() {
        this.default();
        let H = this.a.value;
        let W = this.b.value / 100;
        let B = this.c.value / 100;
        let S = 0;
        if (B == 1) {
            return new HSL(H, S, 0);
        }
        S = 1 - (W / (1 - B));
        let V = 1 - B;
        let L = V * (1 - (S / 2));
        if (L == 0 || L == 1) {
            S = 0;
        }
        else {
            S = Math.round(((V - L) / Math.min(L, 1 - L)) * 100);
        }
        L = Math.round(L * 100);
        return new HSL(H, S, L);
    }
    toHWB() {
        return this;
    }
    toCMYK() {
        return this.toRGB().toCMYK();
    }
    handle() {
        if (this.b.value + this.c.value > 100) {
            if (this.b.value > this.c.value) {
                this.c.value = 100 - this.b.value;
            }
            else {
                this.b.value = 100 - this.c.value;
            }
        }
    }
    toString() {
        return `${this.a}, ${this.b}%, ${this.c}%`;
    }
}
class CMYK extends Model {
    constructor(cyan, magenta, yellow, black) {
        super();
        this.name = 'cmyk';
        this.fullName = 'Cyan Magenta Yellow blacK';
        this.a = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(cyan, 100);
        this.b = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(magenta, 100);
        this.c = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(yellow, 100);
        this.d = new _PrimitiveType__WEBPACK_IMPORTED_MODULE_0__.Integer(black, 100);
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('a', 'C'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('b', 'M'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('c', 'Y'));
        this.fields.push(new _Field__WEBPACK_IMPORTED_MODULE_1__.Field('d', 'K'));
    }
    getGradient(value) {
        let pre = 'linear-gradient(to right, white, ';
        switch (value) {
            case 'a':
                return pre + `cyan)`;
            case 'b':
                return pre + `magenta)`;
            case 'c':
                return pre + `yellow)`;
            case 'd':
                return pre + `black)`;
        }
        return '';
    }
    toRGB() {
        this.default();
        let C = this.a.value / 100;
        let M = this.b.value / 100;
        let Y = this.c.value / 100;
        let K = this.d.value / 100;
        let R = Math.round(255 * (1 - C) * (1 - K));
        let G = Math.round(255 * (1 - M) * (1 - K));
        let B = Math.round(255 * (1 - Y) * (1 - K));
        return new RGB(R, G, B);
    }
    toHEX() {
        this.default();
        let C = this.a.value / 100;
        let M = this.b.value / 100;
        let Y = this.c.value / 100;
        let K = this.d.value / 100;
        let R = Math.round(255 * (1 - C) * (1 - K)).toString(16);
        let G = Math.round(255 * (1 - M) * (1 - K)).toString(16);
        let B = Math.round(255 * (1 - Y) * (1 - K)).toString(16);
        return new HEX(R, G, B);
    }
    toHSL() {
        return this.toRGB().toHSL();
    }
    toHWB() {
        return this.toRGB().toHWB();
    }
    toCMYK() {
        return this;
    }
    toString() {
        return `${this.a}%, ${this.b}%, ${this.c}%, ${this.d}%`;
    }
}


/***/ }),

/***/ 7031:
/*!**********************************!*\
  !*** ./src/app/PrimitiveType.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Integer": () => (/* binding */ Integer),
/* harmony export */   "PrimitiveType": () => (/* binding */ PrimitiveType),
/* harmony export */   "String": () => (/* binding */ String)
/* harmony export */ });
class PrimitiveType {
    toString() {
        return this.value.toString();
    }
}
class Integer extends PrimitiveType {
    constructor(value, max, min = 0) {
        super();
        this.max = max;
        this.min = min;
        if (value > max) {
            this.value = max;
        }
        else if (value < min) {
            this.value = min;
        }
        else {
            this.value = value;
        }
    }
    handle() {
        if (this.value == null) {
            this.value = 0;
        }
        else {
            if (this.value > this.max) {
                this.value = this.max;
            }
            else if (this.value < this.min) {
                this.value = this.min;
            }
        }
    }
    Add(int) {
        let value = this.value + int.value;
        if (value > this.max) {
            value -= this.max;
        }
        if (value != 0 && value % this.max == 0) {
            value = this.max;
        }
        return new Integer(value, this.max);
    }
    Sub(int) {
        let value = this.value - int.value;
        if (value < this.min) {
            value = Math.abs(value);
        }
        if (value != 0 && value % this.max == 0) {
            value = this.max;
        }
        return new Integer(value, this.max);
    }
    Mix(int) {
        let value = Math.round((this.value + int.value) / 2);
        return new Integer(value, this.max);
    }
    eq(int) {
        return this.value == int.value;
    }
}
class String extends PrimitiveType {
    constructor(value, max = 255, min = 0) {
        super();
        this.max = max;
        this.min = min;
        if (parseInt(value, 16) > max) {
            this.value = max.toString(16);
        }
        else if (parseInt(value, 16) < min) {
            this.value = min.toString(16);
        }
        else {
            this.value = value;
        }
    }
    handle() {
        let regex = new RegExp('([A-Fa-f0-9]{1}|[A-Fa-f0-9]{2})');
        if (!this.value.match(regex)) {
            this.value = '0';
        }
        else {
            if (parseInt(this.value, 16) > this.max) {
                this.value = this.max.toString(16);
            }
            else if (parseInt(this.value, 16) < this.min) {
                this.value = this.min.toString(16);
            }
        }
    }
    eq(str) {
        return parseInt(this.value, 16) == parseInt(str.value, 16);
    }
}


/***/ }),

/***/ 4474:
/*!***************************!*\
  !*** ./src/app/Scheme.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Analogous": () => (/* binding */ Analogous),
/* harmony export */   "Complementary": () => (/* binding */ Complementary),
/* harmony export */   "Compound": () => (/* binding */ Compound),
/* harmony export */   "Monochromatic": () => (/* binding */ Monochromatic),
/* harmony export */   "Rectangle": () => (/* binding */ Rectangle),
/* harmony export */   "Scheme": () => (/* binding */ Scheme),
/* harmony export */   "Square": () => (/* binding */ Square),
/* harmony export */   "Triadic": () => (/* binding */ Triadic)
/* harmony export */ });
/* harmony import */ var _Cursor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cursor */ 6599);

class Scheme {
    constructor() {
        this.name = '';
        this.cursors = [];
        this.lastActive = 0;
    }
    start(x, y, size, count) {
        for (let i = 0; i < count; i++) {
            this.cursors.push(new _Cursor__WEBPACK_IMPORTED_MODULE_0__.Cursor(x, y, size));
        }
        this.description += ' Try clicking on colors.';
        this.update();
    }
    getInitials() {
        let active = this.cursors[this.lastActive];
        let c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
        let offset = active.y > 0 ? 90 : 270;
        let angle = active.x == 0 ? 0 : (active.y == 0 ? Math.sign(active.x) * -90 : Math.atan(active.x / active.y) / Math.PI * 180);
        //parentheses for better reading
        return [c, angle, offset];
    }
}
class Monochromatic extends Scheme {
    constructor(x, y, size) {
        super();
        this.name = 'monochromatic';
        this.description = 'Pick any color and see it\'s shadow\'s. The percentage displays the color\'s lightness, by HSL model.';
        this.start(x, y, size, 1);
    }
    update() { }
}
class Complementary extends Scheme {
    constructor(x, y, size) {
        super();
        this.name = 'complementary';
        this.description = 'This scheme offers two opposite colors (you can check it in our color picker!). Two colors around the middle one are the picked colors mixed in ratio 2:1 and 1:2.';
        this.start(x, y, size, 2);
    }
    update() {
        this.cursors[this.lastActive ^ 1].invertCoords(this.cursors[this.lastActive]);
    }
}
class Analogous extends Scheme {
    constructor(x, y, size) {
        super();
        this.name = 'analogous';
        this.description = 'The Analogous scheme provides various similar colors, that diversifies the choice from one color to six with a little different hue.';
        this.start(x, y, size, 3);
    }
    update() {
        let [c, angle1, offset] = this.getInitials();
        switch (this.lastActive) {
            case 0: {
                let angle2 = offset + 30 - angle1;
                this.cursors[1].setCoords(c, angle2);
                let angle3 = offset + 60 - angle1;
                this.cursors[2].setCoords(c, angle3);
                break;
            }
            case 1: {
                let angle2 = offset - 30 - angle1;
                this.cursors[0].setCoords(c, angle2);
                let angle3 = offset + 30 - angle1;
                this.cursors[2].setCoords(c, angle3);
                break;
            }
            case 2: {
                let angle2 = offset - 30 - angle1;
                this.cursors[0].setCoords(c, angle2);
                let angle3 = offset - 60 - angle1;
                this.cursors[1].setCoords(c, angle3);
                break;
            }
        }
    }
}
class Compound extends Scheme {
    constructor(x, y, size) {
        super();
        this.name = 'compound';
        this.description = 'This scheme is similar to the analagous one, the only difference is that the center color was inverted, scheme is also known as "Split-Complementary".';
        this.start(x, y, size, 3);
    }
    update() {
        let [c, angle1, offset] = this.getInitials();
        switch (this.lastActive) {
            case 0: {
                let angle2 = offset - 150 - angle1;
                this.cursors[1].setCoords(c, angle2);
                let angle3 = offset + 60 - angle1;
                this.cursors[2].setCoords(c, angle3);
                break;
            }
            case 1: {
                let angle2 = offset - 150 - angle1;
                this.cursors[0].setCoords(c, angle2);
                let angle3 = offset + 150 - angle1;
                this.cursors[2].setCoords(c, angle3);
                break;
            }
            case 2: {
                let angle2 = offset + 150 - angle1;
                this.cursors[1].setCoords(c, angle2);
                let angle3 = offset - 60 - angle1;
                this.cursors[0].setCoords(c, angle3);
                break;
            }
        }
    }
}
class Triadic extends Scheme {
    constructor(x, y, size) {
        super();
        this.name = 'triadic';
        this.description = 'The Triadic scheme gives 3 opposite colors. It provides visual contrast, while keeping color harmony and balance.';
        this.start(x, y, size, 3);
    }
    update() {
        let [c, angle1, offset] = this.getInitials();
        let angle2 = offset - 120 - angle1;
        let angle3 = offset - 240 - angle1;
        switch (this.lastActive) {
            case 0: {
                this.cursors[2].setCoords(c, angle2);
                this.cursors[1].setCoords(c, angle3);
                break;
            }
            case 1: {
                this.cursors[0].setCoords(c, angle2);
                this.cursors[2].setCoords(c, angle3);
                break;
            }
            case 2: {
                this.cursors[1].setCoords(c, angle2);
                this.cursors[0].setCoords(c, angle3);
                break;
            }
        }
    }
}
class Rectangle extends Scheme {
    constructor(x, y, size) {
        super();
        this.name = 'rectangle';
        this.description = 'This scheme is similar to the compound one, expcept for the center color, that is splited in 2. You can look at it as two pairs of opposite colors.';
        this.start(x, y, size, 4);
    }
    update() {
        let [c, angle1, offset] = this.getInitials();
        let angle2 = offset - 120 - angle1;
        let angle3 = offset - 240 - angle1;
        switch (this.lastActive) {
            case 0: {
                this.cursors[1].setCoords(c, angle2);
                this.cursors[2].setCoords(c, angle2 + 180);
                break;
            }
            case 1: {
                this.cursors[0].setCoords(c, angle3);
                this.cursors[3].setCoords(c, angle3 + 180);
                break;
            }
            case 2: {
                this.cursors[0].setCoords(c, angle3 + 180);
                this.cursors[3].setCoords(c, angle3);
                break;
            }
            case 3: {
                this.cursors[1].setCoords(c, angle2 + 180);
                this.cursors[2].setCoords(c, angle2);
                break;
            }
        }
        this.cursors[3 - this.lastActive].invertCoords(this.cursors[this.lastActive]);
    }
}
class Square extends Scheme {
    constructor(x, y, size) {
        super();
        this.name = 'square';
        this.description = 'The Square scheme is similar to the triadic, though there are 4 colors instead of 3. There are stil two pairs of colors, so the scheme is quite balanced.';
        this.start(x, y, size, 4);
    }
    update() {
        let [c, angle1, offset] = this.getInitials();
        let angle2 = offset - 90 - angle1;
        switch (this.lastActive) {
            case 0: {
                this.cursors[1].setCoords(c, angle2);
                this.cursors[2].setCoords(c, angle2 + 180);
                break;
            }
            case 1: {
                this.cursors[0].setCoords(c, angle2 + 180);
                this.cursors[3].setCoords(c, angle2);
                break;
            }
            case 2: {
                this.cursors[0].setCoords(c, angle2);
                this.cursors[3].setCoords(c, angle2 + 180);
                break;
            }
            case 3: {
                this.cursors[1].setCoords(c, angle2 + 180);
                this.cursors[2].setCoords(c, angle2);
                break;
            }
        }
        this.cursors[3 - this.lastActive].invertCoords(this.cursors[this.lastActive]);
    }
}


/***/ }),

/***/ 158:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppRoutingModule": () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 2816);
/* harmony import */ var _components_picker_picker_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/picker/picker.component */ 8290);
/* harmony import */ var _components_calculator_calculator_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/calculator/calculator.component */ 5946);
/* harmony import */ var _components_schemes_schemes_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/schemes/schemes.component */ 1632);
/* harmony import */ var _components_models_models_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/models/models.component */ 5887);
/* harmony import */ var _components_calculator_help_calculator_help_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/calculator-help/calculator-help.component */ 7767);
/* harmony import */ var _components_trends_years_years_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/trends/years/years.component */ 6905);
/* harmony import */ var _components_trends_decades_decades_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/trends/decades/decades.component */ 5938);
/* harmony import */ var _components_auth_log_in_log_in_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/auth/log-in/log-in.component */ 430);
/* harmony import */ var _components_auth_sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/auth/sign-in/sign-in.component */ 7200);
/* harmony import */ var _components_auth_restore_restore_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/auth/restore/restore.component */ 5065);
/* harmony import */ var _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/profile/profile.component */ 7094);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 3184);














const routes = [
    { path: 'picker', component: _components_picker_picker_component__WEBPACK_IMPORTED_MODULE_0__.PickerComponent },
    { path: 'calculator', component: _components_calculator_calculator_component__WEBPACK_IMPORTED_MODULE_1__.CalculatorComponent },
    { path: 'calculator/help', component: _components_calculator_help_calculator_help_component__WEBPACK_IMPORTED_MODULE_4__.CalculatorHelpComponent },
    { path: 'trends/years', component: _components_trends_years_years_component__WEBPACK_IMPORTED_MODULE_5__.YearsComponent },
    { path: 'trends/decades/:decade', component: _components_trends_decades_decades_component__WEBPACK_IMPORTED_MODULE_6__.DecadesComponent },
    { path: 'schemes/:scheme', component: _components_schemes_schemes_component__WEBPACK_IMPORTED_MODULE_2__.SchemesComponent },
    { path: 'models', component: _components_models_models_component__WEBPACK_IMPORTED_MODULE_3__.ModelsComponent },
    { path: 'profile', component: _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_10__.ProfileComponent },
    { path: 'log_in', component: _components_auth_log_in_log_in_component__WEBPACK_IMPORTED_MODULE_7__.LogInComponent },
    { path: 'sign_up', component: _components_auth_sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_8__.SignInComponent },
    { path: 'restore', component: _components_auth_restore_restore_component__WEBPACK_IMPORTED_MODULE_9__.RestoreComponent }
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule.forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule] }); })();


/***/ }),

/***/ 5041:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 2816);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 318);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _components_menu_menu_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/menu/menu.component */ 5819);






const _c0 = function (a0) { return { "display": a0 }; };
function AppComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 9)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, " ADMIRE THE ANIMATION ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](1, _c0, ctx_r0.route == "" ? "block" : "none"));
} }
class AppComponent {
    constructor(titleService, router) {
        this.titleService = titleService;
        this.router = router;
        this.hrefs = [];
        this.title = 'Colors';
    }
    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__.NavigationEnd) {
                this.route = event.url.slice(1);
                this.setTitle(this.route);
            }
        });
    }
    setTitle(title) {
        if (title != '') {
            if (title.includes('/')) {
                title = title.split('/')[0];
                //'trends/years' -> 'trends'
            }
            let first = title.split('')[0];
            title = first.toUpperCase() + title.split('').slice(1).join('');
            //'trends' -> 'Trends'
        }
        this.titleService.setTitle(this.title);
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.Title), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router)); };
AppComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 11, vars: 2, consts: [["class", "position-absolute d-flex justify-content-center align-items-center text-center text w-100", 3, "ngStyle", 4, "ngIf"], ["id", "header"], [1, "position-absolute", "h1"], ["data-name", "Layer 1", "xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 1200 120", "preserveAspectRatio", "none"], ["d", "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z", "opacity", ".25", 1, "shape-fill"], ["d", "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z", "opacity", ".5", 1, "shape-fill"], ["d", "M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z", 1, "shape-fill"], [3, "route"], ["id", "main"], [1, "position-absolute", "d-flex", "justify-content-center", "align-items-center", "text-center", "text", "w-100", 3, "ngStyle"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, AppComponent_div_0_Template, 3, 3, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1)(2, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Colors");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "svg", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "path", 4)(6, "path", 5)(7, "path", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "app-menu", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](10, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.route == "");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("route", ctx.route);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgStyle, _components_menu_menu_component__WEBPACK_IMPORTED_MODULE_0__.MenuComponent, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterOutlet], styles: [".text[_ngcontent-%COMP%] {\r\n  top: 50vh;\r\n  z-index: -1;\r\n  font-size: 30px;\r\n  letter-spacing: 0.5em;\r\n}\r\n\r\n.text[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  padding: 5vh;\r\n  border: 1px solid black;\r\n}\r\n\r\n#header[_ngcontent-%COMP%] {\r\n  width: 100vw;\r\n  height: 10vh;\r\n  line-height: 0;\r\n  transform: rotate(180deg);\r\n}\r\n\r\n#header[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  right: 2vw;\r\n  top: 2vh;\r\n  transform: rotate(180deg);\r\n}\r\n\r\n#header[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\r\n  width: 130vw;\r\n  height: 220px;\r\n  animation: svg 20s infinite ease-in-out;\r\n}\r\n\r\n#header[_ngcontent-%COMP%]   .shape-fill[_ngcontent-%COMP%] {\r\n  fill: #5074e2;\r\n  opacity: 0.4;\r\n  animation: fill 15s infinite ease-in-out;\r\n}\r\n\r\n@keyframes svg {\r\n  0% { width: 130vw; }\r\n  33% { width: 100vw; }\r\n  66% { width: 160vw; }\r\n  100% { width: 130vw; }\r\n}\r\n\r\n@keyframes fill {\r\n  0% { fill: #5074e2; }\r\n  50% { fill: #9e50e2; }\r\n  100% { fill: #5074e2; }\r\n}\r\n\r\n#main[_ngcontent-%COMP%] {\r\n  width: 100vw;\r\n  height: auto;\r\n  padding: 2.5vh 2.5vw;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsU0FBUztFQUNULFdBQVc7RUFDWCxlQUFlO0VBQ2YscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLFlBQVk7RUFDWixZQUFZO0VBQ1osY0FBYztFQUNkLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLFVBQVU7RUFDVixRQUFRO0VBQ1IseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGFBQWE7RUFDYix1Q0FBdUM7QUFDekM7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsWUFBWTtFQUNaLHdDQUF3QztBQUMxQzs7QUFFQTtFQUNFLEtBQUssWUFBWSxFQUFFO0VBQ25CLE1BQU0sWUFBWSxFQUFFO0VBQ3BCLE1BQU0sWUFBWSxFQUFFO0VBQ3BCLE9BQU8sWUFBWSxFQUFFO0FBQ3ZCOztBQUVBO0VBQ0UsS0FBSyxhQUFhLEVBQUU7RUFDcEIsTUFBTSxhQUFhLEVBQUU7RUFDckIsT0FBTyxhQUFhLEVBQUU7QUFDeEI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osWUFBWTtFQUNaLG9CQUFvQjtBQUN0QiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi50ZXh0IHtcclxuICB0b3A6IDUwdmg7XHJcbiAgei1pbmRleDogLTE7XHJcbiAgZm9udC1zaXplOiAzMHB4O1xyXG4gIGxldHRlci1zcGFjaW5nOiAwLjVlbTtcclxufVxyXG5cclxuLnRleHQgc3BhbiB7XHJcbiAgcGFkZGluZzogNXZoO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4jaGVhZGVyIHtcclxuICB3aWR0aDogMTAwdnc7XHJcbiAgaGVpZ2h0OiAxMHZoO1xyXG4gIGxpbmUtaGVpZ2h0OiAwO1xyXG4gIHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7XHJcbn1cclxuXHJcbiNoZWFkZXIgc3BhbiB7XHJcbiAgcmlnaHQ6IDJ2dztcclxuICB0b3A6IDJ2aDtcclxuICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xyXG59XHJcblxyXG4jaGVhZGVyIHN2ZyB7XHJcbiAgd2lkdGg6IDEzMHZ3O1xyXG4gIGhlaWdodDogMjIwcHg7XHJcbiAgYW5pbWF0aW9uOiBzdmcgMjBzIGluZmluaXRlIGVhc2UtaW4tb3V0O1xyXG59XHJcblxyXG4jaGVhZGVyIC5zaGFwZS1maWxsIHtcclxuICBmaWxsOiAjNTA3NGUyO1xyXG4gIG9wYWNpdHk6IDAuNDtcclxuICBhbmltYXRpb246IGZpbGwgMTVzIGluZmluaXRlIGVhc2UtaW4tb3V0O1xyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIHN2ZyB7XHJcbiAgMCUgeyB3aWR0aDogMTMwdnc7IH1cclxuICAzMyUgeyB3aWR0aDogMTAwdnc7IH1cclxuICA2NiUgeyB3aWR0aDogMTYwdnc7IH1cclxuICAxMDAlIHsgd2lkdGg6IDEzMHZ3OyB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgZmlsbCB7XHJcbiAgMCUgeyBmaWxsOiAjNTA3NGUyOyB9XHJcbiAgNTAlIHsgZmlsbDogIzllNTBlMjsgfVxyXG4gIDEwMCUgeyBmaWxsOiAjNTA3NGUyOyB9XHJcbn1cclxuXHJcbiNtYWluIHtcclxuICB3aWR0aDogMTAwdnc7XHJcbiAgaGVpZ2h0OiBhdXRvO1xyXG4gIHBhZGRpbmc6IDIuNXZoIDIuNXZ3O1xyXG59XHJcbiJdfQ== */"] });


/***/ }),

/***/ 6747:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/platform-browser */ 318);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/common/http */ 8784);
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ngx-cookie-service */ 3694);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 158);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 5041);
/* harmony import */ var _components_calculator_calculator_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/calculator/calculator.component */ 5946);
/* harmony import */ var _components_picker_picker_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/picker/picker.component */ 8290);
/* harmony import */ var _components_schemes_schemes_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/schemes/schemes.component */ 1632);
/* harmony import */ var _components_models_models_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/models/models.component */ 5887);
/* harmony import */ var _components_calculator_help_calculator_help_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/calculator-help/calculator-help.component */ 7767);
/* harmony import */ var _components_trends_years_years_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/trends/years/years.component */ 6905);
/* harmony import */ var _components_trends_decades_decades_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/trends/decades/decades.component */ 5938);
/* harmony import */ var _components_auth_log_in_log_in_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/auth/log-in/log-in.component */ 430);
/* harmony import */ var _components_auth_sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/auth/sign-in/sign-in.component */ 7200);
/* harmony import */ var _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/profile/profile.component */ 7094);
/* harmony import */ var _components_menu_menu_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/menu/menu.component */ 5819);
/* harmony import */ var _components_auth_restore_restore_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/auth/restore/restore.component */ 5065);
/* harmony import */ var _components_image_image_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/image/image.component */ 5113);
/* harmony import */ var _components_auth_remember_me_remember_me_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/auth/remember-me/remember-me.component */ 9606);
/* harmony import */ var _components_auth_field_field_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/auth/field/field.component */ 9615);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/core */ 3184);






















class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent] });
AppModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdefineInjector"]({ providers: [ngx_cookie_service__WEBPACK_IMPORTED_MODULE_18__.CookieService], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_19__.BrowserModule,
            _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_20__.FormsModule,
            _angular_common_http__WEBPACK_IMPORTED_MODULE_21__.HttpClientModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent,
        _components_calculator_calculator_component__WEBPACK_IMPORTED_MODULE_2__.CalculatorComponent,
        _components_picker_picker_component__WEBPACK_IMPORTED_MODULE_3__.PickerComponent,
        _components_schemes_schemes_component__WEBPACK_IMPORTED_MODULE_4__.SchemesComponent,
        _components_calculator_help_calculator_help_component__WEBPACK_IMPORTED_MODULE_6__.CalculatorHelpComponent,
        _components_models_models_component__WEBPACK_IMPORTED_MODULE_5__.ModelsComponent,
        _components_trends_years_years_component__WEBPACK_IMPORTED_MODULE_7__.YearsComponent,
        _components_trends_decades_decades_component__WEBPACK_IMPORTED_MODULE_8__.DecadesComponent,
        _components_auth_log_in_log_in_component__WEBPACK_IMPORTED_MODULE_9__.LogInComponent,
        _components_auth_sign_in_sign_in_component__WEBPACK_IMPORTED_MODULE_10__.SignInComponent,
        _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_11__.ProfileComponent,
        _components_menu_menu_component__WEBPACK_IMPORTED_MODULE_12__.MenuComponent,
        _components_auth_restore_restore_component__WEBPACK_IMPORTED_MODULE_13__.RestoreComponent,
        _components_image_image_component__WEBPACK_IMPORTED_MODULE_14__.ImageComponent,
        _components_auth_remember_me_remember_me_component__WEBPACK_IMPORTED_MODULE_15__.RememberMeComponent,
        _components_auth_field_field_component__WEBPACK_IMPORTED_MODULE_16__.FieldComponent], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_19__.BrowserModule,
        _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule,
        _angular_forms__WEBPACK_IMPORTED_MODULE_20__.FormsModule,
        _angular_common_http__WEBPACK_IMPORTED_MODULE_21__.HttpClientModule] }); })();


/***/ }),

/***/ 9615:
/*!**********************************************************!*\
  !*** ./src/app/components/auth/field/field.component.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FieldComponent": () => (/* binding */ FieldComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 2816);





function FieldComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 4)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("routerLink", "/", ctx_r0.redirect, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.redirectText);
} }
class FieldComponent {
    constructor() {
        this.onChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    }
    ngOnInit() {
    }
    emit() {
        this.onChanged.emit({ value: this.value, field: this.name });
    }
    validate() {
        const passwordMinLen = 6;
        if (this.value != undefined) {
            if (this.value == '') {
                this.error = 'Empty field.';
                return;
            }
            if (this.value.includes(' ')) {
                this.error = `Invalid symbol occured (space).`;
                return;
            }
            if (this.isPassword && this.value.length < passwordMinLen) {
                this.error = `Min. length is ${passwordMinLen}.`;
                return;
            }
            if (this.original != undefined) {
                if (this.value != this.original) {
                    this.error = `Passwords don't match.`;
                    return;
                }
            }
        }
        this.error = '';
    }
    isValid() {
        return this.value != undefined && this.error == '';
    }
    getError() {
        this.validate();
        return this.error;
    }
}
FieldComponent.ɵfac = function FieldComponent_Factory(t) { return new (t || FieldComponent)(); };
FieldComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FieldComponent, selectors: [["app-field"]], inputs: { name: "name", placeholder: "placeholder", autocomplete: "autocomplete", redirect: "redirect", redirectText: "redirectText", value: "value", isPassword: "isPassword", original: "original" }, outputs: { onChanged: "onChanged" }, decls: 6, vars: 11, consts: [[1, "position-relative", "d-flex", "flex-column", "field", "text-start"], [3, "for"], [1, "form-control", "transition", 3, "type", "name", "placeholder", "ngModel", "autocomplete", "ngModelChange", "change"], ["class", "redirect", 3, "routerLink", 4, "ngIf"], [1, "redirect", 3, "routerLink"]], template: function FieldComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "label", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div")(4, "input", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function FieldComponent_Template_input_ngModelChange_4_listener($event) { return ctx.value = $event; })("change", function FieldComponent_Template_input_change_4_listener() { return ctx.emit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, FieldComponent_div_5_Template, 3, 2, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", ctx.name);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.getError());
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMapInterpolate1"]("d-flex flex-column justify-content-center text-start input ", ctx.error == "" ? "valid" : "invalid", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("type", ctx.name == "email" ? "email" : "text");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("autocomplete", ctx.autocomplete);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("name", ctx.name)("placeholder", ctx.placeholder)("ngModel", ctx.value);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.redirect);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgModel, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink], styles: [".field[_ngcontent-%COMP%] {\r\n  gap: 0.5vh;\r\n  font-size: 20px;\r\n  width: 15vw;\r\n}\r\n\r\n.valid[_ngcontent-%COMP%]::after, .invalid[_ngcontent-%COMP%]::after {\r\n  position: absolute;\r\n  right: 6px;\r\n  font-size: 24px;\r\n}\r\n\r\n.valid[_ngcontent-%COMP%]::after {\r\n  content: \"\\2713\";\r\n  top: 6px;\r\n  color: var(--bs-green);\r\n}\r\n\r\n.invalid[_ngcontent-%COMP%]::after {\r\n  content: \"\\2715\";\r\n  top: 33px;\r\n  color: var(--bs-red);\r\n}\r\n\r\nlabel[_ngcontent-%COMP%] {\r\n  color: var(--bs-danger);\r\n  font-size: 18px;\r\n}\r\n\r\n.redirect[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  color: var(--bs-primary);\r\n  font-size: 16px;\r\n}\r\n\r\n.redirect[_ngcontent-%COMP%]:hover {\r\n  cursor: pointer;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  .field[_ngcontent-%COMP%] {\r\n    font-size: 20px;\r\n    width: 80vw;\r\n  }\r\n\r\n  .valid[_ngcontent-%COMP%]::after, .invalid[_ngcontent-%COMP%]::after {\r\n    margin-left: calc(80vw - 24px);\r\n    font-size: 20px;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpZWxkLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxVQUFVO0VBQ1YsZUFBZTtFQUNmLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixVQUFVO0VBQ1YsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixRQUFRO0VBQ1Isc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLFNBQVM7RUFDVCxvQkFBb0I7QUFDdEI7O0FBRUE7RUFDRSx1QkFBdUI7RUFDdkIsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLHdCQUF3QjtFQUN4QixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsZUFBZTtBQUNqQjs7QUFFQTtFQUNFO0lBQ0UsZUFBZTtJQUNmLFdBQVc7RUFDYjs7RUFFQTtJQUNFLDhCQUE4QjtJQUM5QixlQUFlO0VBQ2pCO0FBQ0YiLCJmaWxlIjoiZmllbGQuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5maWVsZCB7XHJcbiAgZ2FwOiAwLjV2aDtcclxuICBmb250LXNpemU6IDIwcHg7XHJcbiAgd2lkdGg6IDE1dnc7XHJcbn1cclxuXHJcbi52YWxpZDo6YWZ0ZXIsIC5pbnZhbGlkOjphZnRlciB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHJpZ2h0OiA2cHg7XHJcbiAgZm9udC1zaXplOiAyNHB4O1xyXG59XHJcblxyXG4udmFsaWQ6OmFmdGVyIHtcclxuICBjb250ZW50OiBcIlxcMjcxM1wiO1xyXG4gIHRvcDogNnB4O1xyXG4gIGNvbG9yOiB2YXIoLS1icy1ncmVlbik7XHJcbn1cclxuXHJcbi5pbnZhbGlkOjphZnRlciB7XHJcbiAgY29udGVudDogXCJcXDI3MTVcIjtcclxuICB0b3A6IDMzcHg7XHJcbiAgY29sb3I6IHZhcigtLWJzLXJlZCk7XHJcbn1cclxuXHJcbmxhYmVsIHtcclxuICBjb2xvcjogdmFyKC0tYnMtZGFuZ2VyKTtcclxuICBmb250LXNpemU6IDE4cHg7XHJcbn1cclxuXHJcbi5yZWRpcmVjdCBzcGFuIHtcclxuICBjb2xvcjogdmFyKC0tYnMtcHJpbWFyeSk7XHJcbiAgZm9udC1zaXplOiAxNnB4O1xyXG59XHJcblxyXG4ucmVkaXJlY3Q6aG92ZXIge1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcclxuICAuZmllbGQge1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgd2lkdGg6IDgwdnc7XHJcbiAgfVxyXG5cclxuICAudmFsaWQ6OmFmdGVyLCAuaW52YWxpZDo6YWZ0ZXIge1xyXG4gICAgbWFyZ2luLWxlZnQ6IGNhbGMoODB2dyAtIDI0cHgpO1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gIH1cclxufSJdfQ== */"] });


/***/ }),

/***/ 430:
/*!************************************************************!*\
  !*** ./src/app/components/auth/log-in/log-in.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LogInComponent": () => (/* binding */ LogInComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/auth/auth.service */ 1228);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _field_field_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../field/field.component */ 9615);
/* harmony import */ var _remember_me_remember_me_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../remember-me/remember-me.component */ 9606);





class LogInComponent {
    constructor(auth) {
        this.auth = auth;
        this.email = undefined;
        this.password = undefined;
        this.remember_me = true;
        if (this.auth.isAuth()) {
            window.history.back();
        }
    }
    check() {
        this.remember_me = !this.remember_me;
    }
    setField(el) {
        switch (el.field) {
            case 'email':
                this.email = el.value;
                break;
            case 'password':
                this.password = el.value;
                break;
        }
    }
    ngOnInit() { }
    sendForm() {
        let data = {
            'email': this.email,
            'password': this.password,
            'remember_me': this.remember_me
        };
        if (this.email && this.password) {
            this.auth.login(data).subscribe({
                next: (resp) => {
                    this.auth.setAuth(true, this.remember_me);
                    window.location.href = (`/profile`);
                },
                error: (e) => {
                    this.auth.displayErrors(e.error);
                }
            });
        }
    }
}
LogInComponent.ɵfac = function LogInComponent_Factory(t) { return new (t || LogInComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService)); };
LogInComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: LogInComponent, selectors: [["app-log-in"]], decls: 8, vars: 3, consts: [["id", "log_in", 1, "box", "whitesmoke", "d-flex", "flex-column", "justify-content-between", "align-items-center", "text-center", 3, "submit"], ["id", "title"], ["id", "inputs", 1, "d-flex", "flex-column"], ["name", "email", "placeholder", "Your email", "autocomplete", "username", "redirect", "sign_up", "redirectText", "Don't have an account?", 3, "value", "onChanged"], ["name", "password", "placeholder", "Your password", "autocomplete", "current-password", "redirect", "restore", "redirectText", "Forgot password?", 3, "value", "onChanged"], [3, "value", "onValueChanged"], ["id", "submit", "type", "submit", "value", "Log In", 1, "form-control", "transition"]], template: function LogInComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("submit", function LogInComponent_Template_form_submit_0_listener() { return ctx.sendForm(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Log in");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 2)(4, "app-field", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function LogInComponent_Template_app_field_onChanged_4_listener($event) { return ctx.setField($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "app-field", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function LogInComponent_Template_app_field_onChanged_5_listener($event) { return ctx.setField($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "app-remember-me", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onValueChanged", function LogInComponent_Template_app_remember_me_onValueChanged_6_listener() { return ctx.check(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](7, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.email);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.password);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.remember_me);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgForm, _field_field_component__WEBPACK_IMPORTED_MODULE_1__.FieldComponent, _remember_me_remember_me_component__WEBPACK_IMPORTED_MODULE_2__.RememberMeComponent], styles: ["#log_in[_ngcontent-%COMP%] {\r\n  margin: 2.5vh 25vw;\r\n  padding: 5vh 5vw;\r\n}\r\n\r\n#title[_ngcontent-%COMP%] {\r\n  font-size: 44px;\r\n  margin-bottom: 10vh;\r\n}\r\n\r\n#inputs[_ngcontent-%COMP%] {\r\n  gap: 2.5vh;\r\n  margin-bottom: 10vh;\r\n}\r\n\r\n#submit[_ngcontent-%COMP%] {\r\n  font-size: 28px;\r\n  width: 10vw;\r\n}\r\n\r\n#submit[_ngcontent-%COMP%]:hover {\r\n  transform: scale(1.25);\r\n  color: var(--bs-primary);\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #title[_ngcontent-%COMP%] {\r\n    font-size: 32px;\r\n    margin-bottom: 5vh;\r\n  }\r\n\r\n  #inputs[_ngcontent-%COMP%] {\r\n    gap: 2.5vh;\r\n    margin-bottom: 5vh;\r\n  }\r\n\r\n  #inputs[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n    font-size: 20px;\r\n    width: 80vw;\r\n  }\r\n\r\n  #submit[_ngcontent-%COMP%] {\r\n    font-size: 24px;\r\n    width: 60vw;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZy1pbi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQWtCO0VBQ2xCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGVBQWU7RUFDZixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxVQUFVO0VBQ1YsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLFdBQVc7QUFDYjs7QUFFQTtFQUNFLHNCQUFzQjtFQUN0Qix3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTtJQUNFLGVBQWU7SUFDZixrQkFBa0I7RUFDcEI7O0VBRUE7SUFDRSxVQUFVO0lBQ1Ysa0JBQWtCO0VBQ3BCOztFQUVBO0lBQ0UsZUFBZTtJQUNmLFdBQVc7RUFDYjs7RUFFQTtJQUNFLGVBQWU7SUFDZixXQUFXO0VBQ2I7QUFDRiIsImZpbGUiOiJsb2ctaW4uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNsb2dfaW4ge1xyXG4gIG1hcmdpbjogMi41dmggMjV2dztcclxuICBwYWRkaW5nOiA1dmggNXZ3O1xyXG59XHJcblxyXG4jdGl0bGUge1xyXG4gIGZvbnQtc2l6ZTogNDRweDtcclxuICBtYXJnaW4tYm90dG9tOiAxMHZoO1xyXG59XHJcblxyXG4jaW5wdXRzIHtcclxuICBnYXA6IDIuNXZoO1xyXG4gIG1hcmdpbi1ib3R0b206IDEwdmg7XHJcbn1cclxuXHJcbiNzdWJtaXQge1xyXG4gIGZvbnQtc2l6ZTogMjhweDtcclxuICB3aWR0aDogMTB2dztcclxufVxyXG5cclxuI3N1Ym1pdDpob3ZlciB7XHJcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjI1KTtcclxuICBjb2xvcjogdmFyKC0tYnMtcHJpbWFyeSk7XHJcbn1cclxuXHJcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDYwMHB4KSB7XHJcbiAgI3RpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogMzJweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDV2aDtcclxuICB9XHJcblxyXG4gICNpbnB1dHMge1xyXG4gICAgZ2FwOiAyLjV2aDtcclxuICAgIG1hcmdpbi1ib3R0b206IDV2aDtcclxuICB9XHJcblxyXG4gICNpbnB1dHMgZGl2IHtcclxuICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgIHdpZHRoOiA4MHZ3O1xyXG4gIH1cclxuXHJcbiAgI3N1Ym1pdCB7XHJcbiAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICB3aWR0aDogNjB2dztcclxuICB9XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 9606:
/*!**********************************************************************!*\
  !*** ./src/app/components/auth/remember-me/remember-me.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RememberMeComponent": () => (/* binding */ RememberMeComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 587);



class RememberMeComponent {
    constructor() {
        this.onValueChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    }
    ngOnInit() {
    }
    check() {
        this.onValueChanged.emit();
    }
}
RememberMeComponent.ɵfac = function RememberMeComponent_Factory(t) { return new (t || RememberMeComponent)(); };
RememberMeComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: RememberMeComponent, selectors: [["app-remember-me"]], inputs: { value: "value" }, outputs: { onValueChanged: "onValueChanged" }, decls: 4, vars: 2, consts: [["id", "remember_me", 1, "d-flex", "justify-content-between", "align-items-center", "text-start"], ["for", "remember_me"], ["type", "checkbox", "name", "remember_me", 3, "ngModel", "ngModelChange", "click"]], template: function RememberMeComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "label", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "input", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function RememberMeComponent_Template_input_ngModelChange_3_listener($event) { return ctx.value = $event; })("click", function RememberMeComponent_Template_input_click_3_listener() { return ctx.check(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.value ? "Remember me for 3 days" : "Expire in 1 hour");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.value);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgModel], styles: ["#remember_me[_ngcontent-%COMP%] {\r\n  width: 15vw !important;\r\n}\r\n\r\n#remember_me[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\r\n  transform: scale(1.5);\r\n}\r\n\r\n#remember_me[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\r\n  color: black;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #remember_me[_ngcontent-%COMP%] {\r\n    width: 80vw !important;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlbWVtYmVyLW1lLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxZQUFZO0FBQ2Q7O0FBRUE7RUFDRTtJQUNFLHNCQUFzQjtFQUN4QjtBQUNGIiwiZmlsZSI6InJlbWVtYmVyLW1lLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjcmVtZW1iZXJfbWUge1xyXG4gIHdpZHRoOiAxNXZ3ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbiNyZW1lbWJlcl9tZSBpbnB1dCB7XHJcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjUpO1xyXG59XHJcblxyXG4jcmVtZW1iZXJfbWUgbGFiZWwge1xyXG4gIGNvbG9yOiBibGFjaztcclxufVxyXG5cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcclxuICAjcmVtZW1iZXJfbWUge1xyXG4gICAgd2lkdGg6IDgwdncgIWltcG9ydGFudDtcclxuICB9XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 5065:
/*!**************************************************************!*\
  !*** ./src/app/components/auth/restore/restore.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RestoreComponent": () => (/* binding */ RestoreComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/auth/auth.service */ 1228);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _field_field_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../field/field.component */ 9615);
/* harmony import */ var _remember_me_remember_me_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../remember-me/remember-me.component */ 9606);






function RestoreComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 5)(1, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Email");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Type in a valid email adress, so we can send you varification code to continue. Consider introducing a valid email adress, which you can access.");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "app-field", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function RestoreComponent_div_1_Template_app_field_onChanged_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r3.setField($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx_r0.email);
} }
function RestoreComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 9)(1, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Code");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Type in the code, that you have received in your email address, so we can verify that nobody is trying to hack your account");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "app-field", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function RestoreComponent_div_2_Template_app_field_onChanged_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r6); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r5.setField($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "input", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function RestoreComponent_div_2_Template_input_click_7_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r6); const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r7.resendCode(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx_r1.code);
} }
function RestoreComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 12)(1, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "New Password");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Make up a new password for your profile");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "app-field", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function RestoreComponent_div_3_Template_app_field_onChanged_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r9); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r8.setField($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "app-field", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function RestoreComponent_div_3_Template_app_field_onChanged_7_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r9); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r10.setField($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "app-remember-me", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onValueChanged", function RestoreComponent_div_3_Template_app_remember_me_onValueChanged_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r9); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r11.check(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx_r2.password);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx_r2.password2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx_r2.remember_me);
} }
class RestoreComponent {
    constructor(auth) {
        this.auth = auth;
        this.step = 1;
        this.email = undefined;
        this.code = undefined;
        this.password = undefined;
        this.password2 = undefined;
        this.remember_me = true;
    }
    check() {
        this.remember_me = !this.remember_me;
    }
    setField(el) {
        switch (el.field) {
            case 'email':
                this.email = el.value;
                break;
            case 'code':
                this.code = el.value;
                break;
            case 'password':
                this.password = el.value;
                break;
            case 'password2':
                this.password2 = el.value;
                break;
        }
    }
    ngOnInit() {
    }
    resendCode() {
        let data = {
            'code': 'null',
            'resend': true
        };
        this.auth.restore(data).subscribe({
            next: (resp) => {
                this.step = Number(resp.step);
            },
            error: (e) => {
                this.auth.displayErrors(e.error);
            }
        });
    }
    sendForm() {
        if (this.step == 1) {
            let data = {
                'email': this.email
            };
            if (this.email) {
                this.auth.restore(data).subscribe({
                    next: (resp) => {
                        this.step = Number(resp.step);
                    },
                    error: (e) => {
                        this.auth.displayErrors(e.error);
                    }
                });
            }
        }
        if (this.step == 2) {
            let data = {
                'code': this.code
            };
            if (this.code) {
                this.auth.restore(data).subscribe({
                    next: (resp) => {
                        this.step = Number(resp.step);
                    },
                    error: (e) => {
                        this.auth.displayErrors(e.error);
                    }
                });
            }
        }
        if (this.step == 3) {
            let data = {
                'password': this.password,
                'remember_me': this.remember_me
            };
            if (this.password && this.password2) {
                this.auth.restore(data).subscribe({
                    next: (resp) => {
                        this.auth.setAuth(true, this.remember_me);
                        window.location.href = (`/profile`);
                    },
                    error: (e) => {
                        this.auth.displayErrors(e.error);
                    }
                });
            }
        }
    }
}
RestoreComponent.ɵfac = function RestoreComponent_Factory(t) { return new (t || RestoreComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService)); };
RestoreComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: RestoreComponent, selectors: [["app-restore"]], decls: 5, vars: 3, consts: [["id", "restore", 1, "box", "whitesmoke", "d-flex", "flex-column", "justify-content-between", "align-items-center", "text-center", 3, "submit"], ["class", "d-flex flex-column justify-content-center align-items-center", "id", "email", 4, "ngIf"], ["class", "d-flex flex-column justify-content-center align-items-center", "id", "code", 4, "ngIf"], ["class", "d-flex flex-column justify-content-center align-items-center", "id", "password", 4, "ngIf"], ["id", "submit", "type", "submit", "value", "Submit", 1, "form-control", "transition"], ["id", "email", 1, "d-flex", "flex-column", "justify-content-center", "align-items-center"], ["id", "title"], ["id", "text"], ["name", "email", "placeholder", "Your email", "autocomplete", "username", 3, "value", "onChanged"], ["id", "code", 1, "d-flex", "flex-column", "justify-content-center", "align-items-center"], ["name", "code", "placeholder", "######", 3, "value", "onChanged"], ["id", "resend", "value", "Resend Code", 1, "form-control", "transition", 3, "click"], ["id", "password", 1, "d-flex", "flex-column", "justify-content-center", "align-items-center"], ["name", "password", "placeholder", "Make up a password", "autocomplete", "new-password", 3, "value", "onChanged"], ["name", "password2", "placeholder", "Type in your password", "autocomplete", "new-password", 3, "value", "onChanged"], [3, "value", "onValueChanged"]], template: function RestoreComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("submit", function RestoreComponent_Template_form_submit_0_listener() { return ctx.sendForm(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, RestoreComponent_div_1_Template, 7, 1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, RestoreComponent_div_2_Template, 8, 1, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](3, RestoreComponent_div_3_Template, 9, 3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "input", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.step == 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.step == 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.step == 3);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgForm, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _field_field_component__WEBPACK_IMPORTED_MODULE_1__.FieldComponent, _remember_me_remember_me_component__WEBPACK_IMPORTED_MODULE_2__.RememberMeComponent], styles: ["#restore[_ngcontent-%COMP%] {\r\n  margin: 2.5vh 25vw;\r\n  padding: 5vh 5vw;\r\n}\r\n\r\n#title[_ngcontent-%COMP%] {\r\n  font-size: 44px;\r\n}\r\n\r\n#text[_ngcontent-%COMP%] {\r\n  margin: 2vh 0 5vh 0;\r\n  text-align: justify;\r\n  font-size: 24px;\r\n}\r\n\r\n.field[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n  gap: 0.5vh;\r\n  font-size: 20px;\r\n  width: 15vw;\r\n}\r\n\r\n#resend[_ngcontent-%COMP%], #submit[_ngcontent-%COMP%] {\r\n  font-size: 28px;\r\n  width: 10vw;\r\n}\r\n\r\n#resend[_ngcontent-%COMP%] {\r\n  text-align: center;\r\n  margin-top: 3vh;\r\n}\r\n\r\n#resend[_ngcontent-%COMP%]:hover, #submit[_ngcontent-%COMP%]:hover {\r\n  transform: scale(1.25);\r\n  color: var(--bs-primary);\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #title[_ngcontent-%COMP%] {\r\n    font-size: 32px;\r\n  }\r\n\r\n  #text[_ngcontent-%COMP%] {\r\n    margin: 2vh 0 5vh 0;\r\n    font-size: 20px;\r\n  }\r\n\r\n  .field[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n    gap: 0.5vh;\r\n    font-size: 20px;\r\n    width: 90vw;\r\n  }\r\n\r\n  #resend[_ngcontent-%COMP%], #submit[_ngcontent-%COMP%] {\r\n    margin-top: 2vh;\r\n    font-size: 24px;\r\n    width: 70vw;\r\n  }\r\n\r\n  #resend[_ngcontent-%COMP%] {\r\n    margin-top: 3vh;\r\n  }\r\n\r\n  #resend[_ngcontent-%COMP%]:hover, #submit[_ngcontent-%COMP%]:hover {\r\n    transform: scale(1);\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RvcmUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLG1CQUFtQjtFQUNuQixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsVUFBVTtFQUNWLGVBQWU7RUFDZixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsV0FBVztBQUNiOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxzQkFBc0I7RUFDdEIsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7SUFDRSxlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsbUJBQW1CO0lBQ25CLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxVQUFVO0lBQ1YsZUFBZTtJQUNmLFdBQVc7RUFDYjs7RUFFQTtJQUNFLGVBQWU7SUFDZixlQUFlO0lBQ2YsV0FBVztFQUNiOztFQUVBO0lBQ0UsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLG1CQUFtQjtFQUNyQjtBQUNGIiwiZmlsZSI6InJlc3RvcmUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNyZXN0b3JlIHtcclxuICBtYXJnaW46IDIuNXZoIDI1dnc7XHJcbiAgcGFkZGluZzogNXZoIDV2dztcclxufVxyXG5cclxuI3RpdGxlIHtcclxuICBmb250LXNpemU6IDQ0cHg7XHJcbn1cclxuXHJcbiN0ZXh0IHtcclxuICBtYXJnaW46IDJ2aCAwIDV2aCAwO1xyXG4gIHRleHQtYWxpZ246IGp1c3RpZnk7XHJcbiAgZm9udC1zaXplOiAyNHB4O1xyXG59XHJcblxyXG4uZmllbGQgZGl2IHtcclxuICBnYXA6IDAuNXZoO1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxuICB3aWR0aDogMTV2dztcclxufVxyXG5cclxuI3Jlc2VuZCwgI3N1Ym1pdCB7XHJcbiAgZm9udC1zaXplOiAyOHB4O1xyXG4gIHdpZHRoOiAxMHZ3O1xyXG59XHJcblxyXG4jcmVzZW5kIHtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgbWFyZ2luLXRvcDogM3ZoO1xyXG59XHJcblxyXG4jcmVzZW5kOmhvdmVyLCAjc3VibWl0OmhvdmVyIHtcclxuICB0cmFuc2Zvcm06IHNjYWxlKDEuMjUpO1xyXG4gIGNvbG9yOiB2YXIoLS1icy1wcmltYXJ5KTtcclxufVxyXG5cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcclxuICAjdGl0bGUge1xyXG4gICAgZm9udC1zaXplOiAzMnB4O1xyXG4gIH1cclxuXHJcbiAgI3RleHQge1xyXG4gICAgbWFyZ2luOiAydmggMCA1dmggMDtcclxuICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICB9XHJcblxyXG4gIC5maWVsZCBkaXYge1xyXG4gICAgZ2FwOiAwLjV2aDtcclxuICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gIH1cclxuXHJcbiAgI3Jlc2VuZCwgI3N1Ym1pdCB7XHJcbiAgICBtYXJnaW4tdG9wOiAydmg7XHJcbiAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICB3aWR0aDogNzB2dztcclxuICB9XHJcblxyXG4gICNyZXNlbmQge1xyXG4gICAgbWFyZ2luLXRvcDogM3ZoO1xyXG4gIH1cclxuXHJcbiAgI3Jlc2VuZDpob3ZlciwgI3N1Ym1pdDpob3ZlciB7XHJcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xyXG4gIH1cclxufVxyXG4iXX0= */"] });


/***/ }),

/***/ 7200:
/*!**************************************************************!*\
  !*** ./src/app/components/auth/sign-in/sign-in.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SignInComponent": () => (/* binding */ SignInComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/auth/auth.service */ 1228);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _field_field_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../field/field.component */ 9615);
/* harmony import */ var _remember_me_remember_me_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../remember-me/remember-me.component */ 9606);





class SignInComponent {
    constructor(auth) {
        this.auth = auth;
        this.name = undefined;
        this.email = undefined;
        this.password = undefined;
        this.password2 = undefined;
        this.remember_me = true;
        if (this.auth.isAuth()) {
            window.history.back();
        }
    }
    check() {
        this.remember_me = !this.remember_me;
    }
    setField(el) {
        switch (el.field) {
            case 'name':
                this.name = el.value;
                break;
            case 'email':
                this.email = el.value;
                break;
            case 'password':
                this.password = el.value;
                break;
            case 'password2':
                this.password2 = el.value;
                break;
        }
    }
    ngOnInit() { }
    sendForm(e) {
        let data = {
            'name': this.name,
            'email': this.email,
            'password': this.password,
            'remember_me': this.remember_me
        };
        if (this.name && this.email && this.password && this.password2) {
            this.auth.signup(data).subscribe({
                next: (resp) => {
                    this.auth.setAuth(true, this.remember_me);
                    window.location.href = (`/profile`);
                },
                error: (e) => {
                    this.auth.displayErrors(e.error);
                }
            });
        }
    }
}
SignInComponent.ɵfac = function SignInComponent_Factory(t) { return new (t || SignInComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService)); };
SignInComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: SignInComponent, selectors: [["app-sign-in"]], decls: 10, vars: 5, consts: [["id", "sign_in", 1, "box", "whitesmoke", "d-flex", "flex-column", "justify-content-between", "align-items-center", "text-center", 3, "submit"], ["id", "title"], ["id", "inputs", 1, "d-flex", "flex-column"], ["name", "name", "placeholder", "Make up a login", 3, "value", "onChanged"], ["name", "email", "placeholder", "Your email", "autocomplete", "username", "redirect", "log_in", "redirectText", "Already have an account?", 3, "value", "onChanged"], ["name", "password", "placeholder", "Make up a password", "autocomplete", "new-password", 3, "value", "onChanged"], ["name", "password2", "placeholder", "Type in your password", "autocomplete", "new-password", 3, "value", "onChanged"], [3, "value", "onValueChanged"], ["id", "submit", "type", "submit", "value", "Sign Up", 1, "form-control", "transition"]], template: function SignInComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "form", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("submit", function SignInComponent_Template_form_submit_0_listener($event) { return ctx.sendForm($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Register");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 2)(4, "app-field", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function SignInComponent_Template_app_field_onChanged_4_listener($event) { return ctx.setField($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "app-field", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function SignInComponent_Template_app_field_onChanged_5_listener($event) { return ctx.setField($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "app-field", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function SignInComponent_Template_app_field_onChanged_6_listener($event) { return ctx.setField($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "app-field", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onChanged", function SignInComponent_Template_app_field_onChanged_7_listener($event) { return ctx.setField($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "app-remember-me", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("onValueChanged", function SignInComponent_Template_app_remember_me_onValueChanged_8_listener() { return ctx.check(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](9, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.name);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.email);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.password);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.password2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.remember_me);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgForm, _field_field_component__WEBPACK_IMPORTED_MODULE_1__.FieldComponent, _remember_me_remember_me_component__WEBPACK_IMPORTED_MODULE_2__.RememberMeComponent], styles: ["#sign_in[_ngcontent-%COMP%] {\r\n  margin: 2.5vh 25vw;\r\n  padding: 5vh 5vw;\r\n}\r\n\r\n#title[_ngcontent-%COMP%] {\r\n  font-size: 44px;\r\n}\r\n\r\n#inputs[_ngcontent-%COMP%] {\r\n  gap: 2.5vh;\r\n}\r\n\r\n#submit[_ngcontent-%COMP%] {\r\n  font-size: 28px;\r\n  width: 10vw;\r\n}\r\n\r\n#submit[_ngcontent-%COMP%]:hover {\r\n  transform: scale(1.25);\r\n  color: var(--bs-primary);\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #title[_ngcontent-%COMP%] {\r\n    font-size: 32px;\r\n    margin-bottom: 5vh;\r\n  }\r\n\r\n  #inputs[_ngcontent-%COMP%] {\r\n    gap: 2.5vh;\r\n    margin-bottom: 5vh;\r\n  }\r\n\r\n  #inputs[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n    font-size: 20px;\r\n    width: 80vw;\r\n  }\r\n\r\n  #submit[_ngcontent-%COMP%] {\r\n    font-size: 24px;\r\n    width: 60vw;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpZ24taW4uY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsVUFBVTtBQUNaOztBQUVBO0VBQ0UsZUFBZTtFQUNmLFdBQVc7QUFDYjs7QUFFQTtFQUNFLHNCQUFzQjtFQUN0Qix3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTtJQUNFLGVBQWU7SUFDZixrQkFBa0I7RUFDcEI7O0VBRUE7SUFDRSxVQUFVO0lBQ1Ysa0JBQWtCO0VBQ3BCOztFQUVBO0lBQ0UsZUFBZTtJQUNmLFdBQVc7RUFDYjs7RUFFQTtJQUNFLGVBQWU7SUFDZixXQUFXO0VBQ2I7QUFDRiIsImZpbGUiOiJzaWduLWluLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjc2lnbl9pbiB7XHJcbiAgbWFyZ2luOiAyLjV2aCAyNXZ3O1xyXG4gIHBhZGRpbmc6IDV2aCA1dnc7XHJcbn1cclxuXHJcbiN0aXRsZSB7XHJcbiAgZm9udC1zaXplOiA0NHB4O1xyXG59XHJcblxyXG4jaW5wdXRzIHtcclxuICBnYXA6IDIuNXZoO1xyXG59XHJcblxyXG4jc3VibWl0IHtcclxuICBmb250LXNpemU6IDI4cHg7XHJcbiAgd2lkdGg6IDEwdnc7XHJcbn1cclxuXHJcbiNzdWJtaXQ6aG92ZXIge1xyXG4gIHRyYW5zZm9ybTogc2NhbGUoMS4yNSk7XHJcbiAgY29sb3I6IHZhcigtLWJzLXByaW1hcnkpO1xyXG59XHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA2MDBweCkge1xyXG4gICN0aXRsZSB7XHJcbiAgICBmb250LXNpemU6IDMycHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA1dmg7XHJcbiAgfVxyXG5cclxuICAjaW5wdXRzIHtcclxuICAgIGdhcDogMi41dmg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiA1dmg7XHJcbiAgfVxyXG5cclxuICAjaW5wdXRzIGRpdiB7XHJcbiAgICBmb250LXNpemU6IDIwcHg7XHJcbiAgICB3aWR0aDogODB2dztcclxuICB9XHJcblxyXG4gICNzdWJtaXQge1xyXG4gICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgd2lkdGg6IDYwdnc7XHJcbiAgfVxyXG59XHJcbiJdfQ== */"] });


/***/ }),

/***/ 7767:
/*!*************************************************************************!*\
  !*** ./src/app/components/calculator-help/calculator-help.component.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CalculatorHelpComponent": () => (/* binding */ CalculatorHelpComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 2816);


class CalculatorHelpComponent {
    constructor() {
    }
    ngOnInit() {
    }
}
CalculatorHelpComponent.ɵfac = function CalculatorHelpComponent_Factory(t) { return new (t || CalculatorHelpComponent)(); };
CalculatorHelpComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CalculatorHelpComponent, selectors: [["app-calculator-help"]], decls: 107, vars: 0, consts: [[1, "box", "whitesmoke"], ["id", "heading"], [1, "operation-name"], ["id", "operation-guides"], [1, "operation-guide"], [1, "equation-example"], [1, "operation-example"], [1, "operation-color", 2, "background-color", "#123456"], ["type", "text", "value", "#123456", "disabled", ""], [1, "sign", "plus"], [1, "operation-color", 2, "background-color", "#654321"], ["type", "text", "value", "#654321", "disabled", ""], [1, "sign", "equals"], [1, "operation-color", 2, "background-color", "#777777"], ["type", "text", "value", "#777777", "disabled", ""], [1, "operation-color", 2, "background-color", "#aabbcc"], ["type", "text", "value", "#aabbcc", "disabled", ""], [1, "operation-color", 2, "background-color", "#bcef23"], ["type", "text", "value", "#bcef23", "disabled", ""], [1, "sign", "minus"], [1, "operation-color", 2, "background-color", "#530f35"], ["type", "text", "value", "#530f35", "disabled", ""], [1, "operation-color", 2, "background-color", "#988776"], ["type", "text", "value", "#988776", "disabled", ""], [1, "sign", "mix"], [1, "operation-color", 2, "background-color", "#3c3c3c"], ["type", "text", "value", "#3c3c3c", "disabled", ""], ["id", "back"], ["routerLink", "/calculator", 1, "transition", "fas", "fa-arrow-left"]], template: function CalculatorHelpComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Calculator User Guide ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "There are 3 operations available in the calculator:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "ol")(6, "li", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "adding (+)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "li", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "subtracting (-)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "li", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "mixing (&)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, " Calculator works in hex color-model, so the max value is 'ff' (255), and the minimum one is '0' (0); ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "ol", 3)(15, "li")(16, "div", 4)(17, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Adding");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " In this operation we are just adding every one of the color's vectors (red, green, blue) to the other color's vectors responsizely ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " If the result is too big, then we subtract maximum value from it. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Example: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 5)(26, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "div", 7)(28, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](29, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](31, "div", 10)(32, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](33, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](35, "div", 13)(36, "input", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 5)(38, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](39, "div", 7)(40, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](41, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](43, "div", 15)(44, "input", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](45, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](47, "div", 17)(48, "input", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "li")(50, "div", 4)(51, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "Subtracting");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, " In this operation we are just subtracting every one of the color's vectors (red, green, blue) from the other color's vectors responsizely ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56, " If the result is too small, then we replace the value with it's absolute value (-46 will be 46). ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, "Example: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "div", 5)(60, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](61, "div", 10)(62, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](63, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](65, "div", 7)(66, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](67, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](69, "div", 20)(70, "input", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "div", 5)(72, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](73, "div", 7)(74, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](75, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](76, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](77, "div", 15)(78, "input", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](79, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](81, "div", 22)(82, "input", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "li")(84, "div", 4)(85, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](86, "Mixing");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](87, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](88, " In this operation we are just finding the mean value of every one of the color's vectors (red, green, blue) and the other color's vectors responsizely ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](89, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](90, " The mean value is never bigger or lower than it's parents, so there is no need in rounding; ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](91, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](92, "Example: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](93, "div", 5)(94, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](95, "div", 10)(96, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](97, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](98, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](99, "div", 7)(100, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](101, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](102, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](103, "div", 25)(104, "input", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](105, "div", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](106, "i", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterLink], styles: ["#heading[_ngcontent-%COMP%] {\r\n  font-size: 42px;\r\n}\r\n\r\np[_ngcontent-%COMP%] {\r\n  font-size: 20px;\r\n}\r\n\r\n.operation-name[_ngcontent-%COMP%] {\r\n  font-size: 26px;\r\n}\r\n\r\n#operation-guides[_ngcontent-%COMP%] {\r\n  font-size: 28px;\r\n  list-style-type: none;\r\n  padding: 0;\r\n}\r\n\r\n.operation-guide[_ngcontent-%COMP%] {\r\n  font-size: 20px;\r\n}\r\n\r\n.operation-guide[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  font-size: 32px;\r\n}\r\n\r\n.equation-example[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-flow: row wrap;\r\n  justify-content: left;\r\n  padding: 2vw 2vh;\r\n}\r\n\r\n.operation-example[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  padding: 0;\r\n  width: 15vh;\r\n  height: 15vh;\r\n}\r\n\r\n.operation-color[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  width: 10vh;\r\n  height: 10vh;\r\n  border-radius: 50%;\r\n}\r\n\r\n.operation-example[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\r\n  font-size: 24px;\r\n  outline: none;\r\n  border: none;\r\n  width: 12vh;\r\n  border-bottom: 1px solid black;\r\n}\r\n\r\n.sign[_ngcontent-%COMP%] {\r\n  height: 15vh;\r\n  width: 15vh;\r\n  display: inline-block;\r\n  background-color: rgba(0, 0, 0, 0);\r\n  color: black;\r\n  font-size: 15vh;\r\n  line-height: 7vh;\r\n  text-align: center;\r\n}\r\n\r\n.mix[_ngcontent-%COMP%] {\r\n  font-size: 10vh;\r\n  line-height: 9vh;\r\n}\r\n\r\n.plus[_ngcontent-%COMP%]::before {\r\n  content: \"+\";\r\n}\r\n\r\n.minus[_ngcontent-%COMP%]::before {\r\n  content: \"-\";\r\n}\r\n\r\n.mix[_ngcontent-%COMP%]::before {\r\n  content: \"&\";\r\n}\r\n\r\n.equals[_ngcontent-%COMP%]::before {\r\n  content: \"=\";\r\n}\r\n\r\n#back[_ngcontent-%COMP%] {\r\n  z-index: 1;\r\n  position: fixed;\r\n  padding: 0.5vw;\r\n  border-radius: 50%;\r\n  right: 5.5vw;\r\n  bottom: 5.5vh;\r\n}\r\n\r\n#back[_ngcontent-%COMP%]:hover {\r\n  color: var(--bs-primary);\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  .equation-example[_ngcontent-%COMP%] {\r\n    flex-flow: row nowrap;\r\n    overflow-x: scroll;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbGN1bGF0b3ItaGVscC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLHFCQUFxQjtFQUNyQixVQUFVO0FBQ1o7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIscUJBQXFCO0VBQ3JCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsOEJBQThCO0VBQzlCLG1CQUFtQjtFQUNuQixVQUFVO0VBQ1YsV0FBVztFQUNYLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLFdBQVc7RUFDWCxZQUFZO0VBQ1osa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGFBQWE7RUFDYixZQUFZO0VBQ1osV0FBVztFQUNYLDhCQUE4QjtBQUNoQzs7QUFFQTtFQUNFLFlBQVk7RUFDWixXQUFXO0VBQ1gscUJBQXFCO0VBQ3JCLGtDQUFrQztFQUNsQyxZQUFZO0VBQ1osZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0UsVUFBVTtFQUNWLGVBQWU7RUFDZixjQUFjO0VBQ2Qsa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTtJQUNFLHFCQUFxQjtJQUNyQixrQkFBa0I7RUFDcEI7QUFDRiIsImZpbGUiOiJjYWxjdWxhdG9yLWhlbHAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNoZWFkaW5nIHtcclxuICBmb250LXNpemU6IDQycHg7XHJcbn1cclxuXHJcbnAge1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxufVxyXG5cclxuLm9wZXJhdGlvbi1uYW1lIHtcclxuICBmb250LXNpemU6IDI2cHg7XHJcbn1cclxuXHJcbiNvcGVyYXRpb24tZ3VpZGVzIHtcclxuICBmb250LXNpemU6IDI4cHg7XHJcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xyXG4gIHBhZGRpbmc6IDA7XHJcbn1cclxuXHJcbi5vcGVyYXRpb24tZ3VpZGUge1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxufVxyXG5cclxuLm9wZXJhdGlvbi1ndWlkZSBzcGFuIHtcclxuICBmb250LXNpemU6IDMycHg7XHJcbn1cclxuXHJcbi5lcXVhdGlvbi1leGFtcGxlIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZmxvdzogcm93IHdyYXA7XHJcbiAganVzdGlmeS1jb250ZW50OiBsZWZ0O1xyXG4gIHBhZGRpbmc6IDJ2dyAydmg7XHJcbn1cclxuXHJcbi5vcGVyYXRpb24tZXhhbXBsZSB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIHBhZGRpbmc6IDA7XHJcbiAgd2lkdGg6IDE1dmg7XHJcbiAgaGVpZ2h0OiAxNXZoO1xyXG59XHJcblxyXG4ub3BlcmF0aW9uLWNvbG9yIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgd2lkdGg6IDEwdmg7XHJcbiAgaGVpZ2h0OiAxMHZoO1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxufVxyXG5cclxuLm9wZXJhdGlvbi1leGFtcGxlIGlucHV0IHtcclxuICBmb250LXNpemU6IDI0cHg7XHJcbiAgb3V0bGluZTogbm9uZTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgd2lkdGg6IDEydmg7XHJcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIGJsYWNrO1xyXG59XHJcblxyXG4uc2lnbiB7XHJcbiAgaGVpZ2h0OiAxNXZoO1xyXG4gIHdpZHRoOiAxNXZoO1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApO1xyXG4gIGNvbG9yOiBibGFjaztcclxuICBmb250LXNpemU6IDE1dmg7XHJcbiAgbGluZS1oZWlnaHQ6IDd2aDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5taXgge1xyXG4gIGZvbnQtc2l6ZTogMTB2aDtcclxuICBsaW5lLWhlaWdodDogOXZoO1xyXG59XHJcblxyXG4ucGx1czo6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIitcIjtcclxufVxyXG5cclxuLm1pbnVzOjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiLVwiO1xyXG59XHJcblxyXG4ubWl4OjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiJlwiO1xyXG59XHJcblxyXG4uZXF1YWxzOjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiPVwiO1xyXG59XHJcblxyXG4jYmFjayB7XHJcbiAgei1pbmRleDogMTtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgcGFkZGluZzogMC41dnc7XHJcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIHJpZ2h0OiA1LjV2dztcclxuICBib3R0b206IDUuNXZoO1xyXG59XHJcblxyXG4jYmFjazpob3ZlciB7XHJcbiAgY29sb3I6IHZhcigtLWJzLXByaW1hcnkpO1xyXG59XHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA2MDBweCkge1xyXG4gIC5lcXVhdGlvbi1leGFtcGxlIHtcclxuICAgIGZsZXgtZmxvdzogcm93IG5vd3JhcDtcclxuICAgIG92ZXJmbG93LXg6IHNjcm9sbDtcclxuICB9XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 5946:
/*!***************************************************************!*\
  !*** ./src/app/components/calculator/calculator.component.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CalculatorComponent": () => (/* binding */ CalculatorComponent)
/* harmony export */ });
/* harmony import */ var src_app_Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/Color */ 1710);
/* harmony import */ var _Equation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Equation */ 3672);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _services_colors_colors_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/colors/colors.service */ 9562);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 2816);







const _c0 = function (a0) { return { "background-color": a0 }; };
const _c1 = function (a0) { return { "color": a0 }; };
function CalculatorComponent_div_2_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 5)(1, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_2_div_1_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r9); const i_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().index; const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r7.invertColor(i_r4 / 2); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "invert ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const i_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().index;
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](2, _c0, ctx_r5.equation.hexs[i_r4 / 2]));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](4, _c1, ctx_r5.getInvertedColor(i_r4 / 2)));
} }
function CalculatorComponent_div_2_input_2_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function CalculatorComponent_div_2_input_2_Template_input_ngModelChange_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r12); const i_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().index; const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return (ctx_r11.equation.hexs[i_r4 / 2] = $event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const i_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx_r6.equation.hexs[i_r4 / 2]);
} }
function CalculatorComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_2_Template_div_click_0_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r16); const i_r4 = restoredCtx.index; const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return i_r4 % 2 == 0 ? "" : ctx_r15.pickedSignId = (i_r4 - 1) / 2; });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, CalculatorComponent_div_2_div_1_Template, 3, 6, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, CalculatorComponent_div_2_input_2_Template, 1, 1, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const i_r4 = ctx.index;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassMap"](i_r4 % 2 == 0 ? "hex_color" : "sign " + ctx_r0.getSign(ctx_r0.equation.signs[(i_r4 - 1) / 2]));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", i_r4 % 2 == 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", i_r4 % 2 == 0);
} }
function CalculatorComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 15)(1, "div", 16)(2, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 18)(5, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_7_Template_div_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r18); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r17.changeSign("+"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_7_Template_div_click_6_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r18); const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r19.changeSign("-"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_7_Template_div_click_7_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r18); const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r20.changeSign("&"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "div", 22)(9, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_7_Template_button_click_9_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r18); const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r21.clear(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "i", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12, "\u00A0 clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_7_Template_button_click_13_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r18); const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r22.add(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](14, "i", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16, "\u00A0 add");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_7_Template_button_click_17_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r18); const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r23.remove(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](18, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20, "\u00A0 remove");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassMapInterpolate1"]("sign ", ctx_r1.getPickedSign(), "");
} }
function CalculatorComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 15)(1, "div", 16)(2, "div", 17)(3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Current Sign");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 18)(7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "Change Sign");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div")(10, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_8_Template_div_click_10_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r25); const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r24.changeSign("+"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_8_Template_div_click_11_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r25); const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r26.changeSign("-"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_8_Template_div_click_12_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r25); const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r27.changeSign("&"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "div", 29)(14, "div", 30)(15, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16, "clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_8_Template_button_click_17_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r25); const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r28.clear(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](18, "i", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "div", 31)(20, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "add");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_8_Template_button_click_22_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r25); const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r29.add(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](23, "i", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 32)(25, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26, "remove");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CalculatorComponent_div_8_Template_button_click_27_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r25); const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r30.remove(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](28, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassMapInterpolate1"]("sign ", ctx_r2.getPickedSign(), "");
} }
class CalculatorComponent {
    constructor(colors) {
        this.colors = colors;
        this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
        this.pickedSignId = 0;
        this.minColors = 2;
        this.maxColors = 26;
    }
    ngOnInit() {
        this.equation = this.colors.loadEquation('calculator_colors');
    }
    getRow() {
        let row = [this.equation.hexs[0]];
        for (let i = 0; i < this.equation.signs.length; i++) {
            row.push(this.equation.signs[i]);
            row.push(this.equation.hexs[i + 1]);
        }
        return row;
    }
    getInvertedColor(id) {
        let color = src_app_Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor(this.equation.hexs[id]);
        return color.semiInvert().hex.toString(); //to get the text color
    }
    invertColor(id) {
        let color = src_app_Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor(this.equation.hexs[id]).invert();
        this.equation.hexs[id] = color.hex.toString();
    }
    getResult() {
        this.colors.saveEquation('calculator_colors', this.equation);
        return this.equation.getResult();
    }
    getSign(sign) {
        switch (sign) {
            case _Equation__WEBPACK_IMPORTED_MODULE_1__.Sign.Plus: return 'plus';
            case _Equation__WEBPACK_IMPORTED_MODULE_1__.Sign.Minus: return 'minus';
            case _Equation__WEBPACK_IMPORTED_MODULE_1__.Sign.Mix: return 'mix';
        }
    }
    getPickedSign() {
        return this.getSign(this.equation.signs[this.pickedSignId]);
    }
    changeSign(sign) {
        this.equation.signs[this.pickedSignId] = sign;
    }
    clear() {
        this.equation = new _Equation__WEBPACK_IMPORTED_MODULE_1__.Equation();
    }
    add() {
        if (this.equation.hexs.length < this.maxColors) {
            this.equation.add('#000000');
        }
    }
    remove() {
        if (this.equation.hexs.length > this.minColors) {
            this.equation.remove();
        }
    }
    trackByFn(index, item) {
        return index;
    }
}
CalculatorComponent.ɵfac = function CalculatorComponent_Factory(t) { return new (t || CalculatorComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_colors_colors_service__WEBPACK_IMPORTED_MODULE_2__.ColorsService)); };
CalculatorComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: CalculatorComponent, selectors: [["app-calculator"]], decls: 11, vars: 8, consts: [[1, "box", "whitesmoke", "d-flex", "justify-content-between"], ["id", "equation", 1, "d-flex", "justify-content-start"], [3, "class", "click", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "element", "sign", "equals"], [1, "result"], [1, "color", 3, "ngStyle"], ["disabled", "", "type", "text", 1, "underlined", 3, "value"], ["id", "buttons", "class", "whitesmoke d-flex flex-column align-items-center", 4, "ngIf"], ["id", "help", "routerLink", "help", 1, "transition", "position-absolute"], [1, "fas", "fa-question"], [3, "click"], ["class", "color", 3, "ngStyle", 4, "ngIf"], ["type", "text", "class", "underlined", 3, "ngModel", "ngModelChange", 4, "ngIf"], [1, "invert_picked_color", "border-0", "outline-0", 3, "ngStyle", "click"], ["type", "text", 1, "underlined", 3, "ngModel", "ngModelChange"], ["id", "buttons", 1, "whitesmoke", "d-flex", "flex-column", "align-items-center"], ["id", "sign_buttons", 1, "d-flex", "flex-column", "justify-content-center"], ["id", "choosen_sign", 1, "d-flex", "align-items-center"], ["id", "change-sign_buttons", 1, "d-flex", "align-items-center"], [1, "sign", "plus", 3, "click"], [1, "sign", "minus", 3, "click"], [1, "sign", "mix", 3, "click"], ["id", "global_buttons", 1, "d-flex", "justify-content-around", "align-items-center", "p-0"], ["id", "clear_button", 1, "transition", 3, "click"], ["aria-hidden", "true", 1, "fa", "fa-trash"], ["id", "add_button", 1, "transition", 3, "click"], [1, "fas", "fa-plus"], ["id", "remove_button", 1, "transition", 3, "click"], [1, "fas", "fa-minus"], ["id", "global_buttons", 1, "whitesmoke", "d-flex", "justify-content-around", "align-items-center", "p-0"], ["id", "clear_button", 1, "d-flex"], ["id", "add_button", 1, "d-flex"], ["id", "remove_button", 1, "d-flex"]], template: function CalculatorComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, CalculatorComponent_div_2_Template, 3, 5, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](5, "div", 5)(6, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, CalculatorComponent_div_7_Template, 21, 3, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](8, CalculatorComponent_div_8_Template, 29, 3, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](10, "i", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.getRow())("ngForTrackBy", ctx.trackByFn);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](6, _c0, ctx.getResult()));
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpropertyInterpolate"]("value", ctx.getResult());
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.isMobile);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.isMobile);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgStyle, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink], styles: ["#equation[_ngcontent-%COMP%] {\r\n  flex-wrap: wrap;\r\n  width: 65vw;\r\n  border-right: 0.5vw solid black;\r\n  animation: border 9s infinite linear;\r\n}\r\n\r\n@keyframes border {\r\n  0% { border-color: #ff0000; }\r\n  33% { border-color: #00ff00; }\r\n  66% { border-color: #0000ff; }\r\n  100% { border-color: #ff0000; }\r\n}\r\n\r\n.hex_color[_ngcontent-%COMP%], .result[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: flex-start;\r\n  align-items: center;\r\n  padding: 0;\r\n  width: auto;\r\n  height: auto;\r\n  margin-bottom: 5vh;\r\n}\r\n\r\n.color[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  width: 9vh;\r\n  height: 9vh;\r\n  margin-bottom: 1vh;\r\n  border-radius: 50%;\r\n}\r\n\r\n.invert_picked_color[_ngcontent-%COMP%] {\r\n  font-size: 24px;\r\n  background-color: rgba(0, 0, 0, 0);\r\n}\r\n\r\n.sign[_ngcontent-%COMP%] {\r\n  height: 15vh;\r\n  width: 15vh;\r\n  display: inline-block;\r\n  background-color: rgba(0, 0, 0, 0);\r\n  color: black;\r\n  font-size: 15vh;\r\n  line-height: 7vh;\r\n  text-align: center;\r\n}\r\n\r\n.mix[_ngcontent-%COMP%] {\r\n  font-size: 10vh;\r\n  line-height: 9vh;\r\n}\r\n\r\n.plus[_ngcontent-%COMP%]::before {\r\n  content: \"+\";\r\n}\r\n\r\n.minus[_ngcontent-%COMP%]::before {\r\n  content: \"-\";\r\n}\r\n\r\n.mix[_ngcontent-%COMP%]::before {\r\n  content: \"&\";\r\n}\r\n\r\n.equals[_ngcontent-%COMP%]::before {\r\n  content: \"=\";\r\n}\r\n\r\n.hex_color[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], .result[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\r\n  font-size: 20px;\r\n  width: 12vh;\r\n}\r\n\r\n.result[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\r\n  font-size: 24px;\r\n}\r\n\r\n#buttons[_ngcontent-%COMP%] {\r\n  position: fixed;\r\n  justify-content: flex-end;\r\n  right: 6.5vw;\r\n  padding: 5vh 2.5vw;\r\n  width: 20vw;\r\n}\r\n\r\n#choosen_sign[_ngcontent-%COMP%] {\r\n  justify-content: center;\r\n  margin-bottom: 5vh;\r\n}\r\n\r\n#change-sign_buttons[_ngcontent-%COMP%] {\r\n  justify-content: space-between;\r\n  font-size: 7vh;\r\n  margin-bottom: 15vh;\r\n}\r\n\r\n#change-sign_buttons[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  font-size: 28px;\r\n}\r\n\r\n#change-sign_buttons[_ngcontent-%COMP%]   .sign[_ngcontent-%COMP%] {\r\n  height: 7vh;\r\n  width: 7vh;\r\n  font-size: 7vh;\r\n  line-height: 6vh;\r\n}\r\n\r\n#global_buttons[_ngcontent-%COMP%] {\r\n  width: 15vw;\r\n}\r\n\r\n#global_buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\r\n  border-radius: 4%;\r\n  background-color: black;\r\n  border: none;\r\n  color: white;\r\n  text-align: center;\r\n  font-size: 28px;\r\n  width: 6vh;\r\n  height: 6vh;\r\n  cursor: pointer;\r\n  white-space: nowrap;\r\n}\r\n\r\n#global_buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  display: none;\r\n}\r\n\r\n#global_buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\r\n  width: 15vh;\r\n}\r\n\r\n#global_buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover   span[_ngcontent-%COMP%] {\r\n  display: inline-block;\r\n}\r\n\r\n#help[_ngcontent-%COMP%] {\r\n  z-index: 1;\r\n  right: 5.5vw;\r\n  top: 22vh;\r\n  padding: 0.5vw;\r\n  border-radius: 50%;\r\n}\r\n\r\n#help[_ngcontent-%COMP%]:hover {\r\n  background-color: #ccc;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #equation[_ngcontent-%COMP%] {\r\n    margin-top: 5vh;\r\n    width: 90vw;\r\n    flex-wrap: nowrap;\r\n    overflow: scroll;\r\n    border: 0;\r\n  }\r\n\r\n  #buttons[_ngcontent-%COMP%] {\r\n    font-size: 24px;\r\n    justify-content: space-around;\r\n    position: relative;\r\n    right: auto;\r\n    padding: 0;\r\n    width: 90vw;\r\n  }\r\n\r\n  #sign_buttons[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n  }\r\n\r\n  #choosen_sign[_ngcontent-%COMP%] {\r\n    justify-content: space-between;\r\n    margin-bottom: 0;\r\n  }\r\n\r\n  #choosen_sign[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n    width: auto;\r\n    line-height: 11vh;\r\n  }\r\n\r\n  #change-sign_buttons[_ngcontent-%COMP%] {\r\n    justify-content: space-between;\r\n    font-size: 24px;\r\n    margin-bottom: 2vh;\r\n  }\r\n\r\n  #global_buttons[_ngcontent-%COMP%] {\r\n    flex-direction: column;\r\n    width: 90vw;\r\n  }\r\n\r\n  #global_buttons[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n    justify-content: space-between;\r\n    width: 90vw;\r\n  }\r\n\r\n  #global_buttons[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\r\n    background-color: whitesmoke;\r\n    color: black;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbGN1bGF0b3IuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQWU7RUFDZixXQUFXO0VBQ1gsK0JBQStCO0VBQy9CLG9DQUFvQztBQUN0Qzs7QUFFQTtFQUNFLEtBQUsscUJBQXFCLEVBQUU7RUFDNUIsTUFBTSxxQkFBcUIsRUFBRTtFQUM3QixNQUFNLHFCQUFxQixFQUFFO0VBQzdCLE9BQU8scUJBQXFCLEVBQUU7QUFDaEM7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLDJCQUEyQjtFQUMzQixtQkFBbUI7RUFDbkIsVUFBVTtFQUNWLFdBQVc7RUFDWCxZQUFZO0VBQ1osa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsVUFBVTtFQUNWLFdBQVc7RUFDWCxrQkFBa0I7RUFDbEIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGtDQUFrQztBQUNwQzs7QUFFQTtFQUNFLFlBQVk7RUFDWixXQUFXO0VBQ1gscUJBQXFCO0VBQ3JCLGtDQUFrQztFQUNsQyxZQUFZO0VBQ1osZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0UsZUFBZTtFQUNmLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YseUJBQXlCO0VBQ3pCLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsV0FBVztBQUNiOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLDhCQUE4QjtFQUM5QixjQUFjO0VBQ2QsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxVQUFVO0VBQ1YsY0FBYztFQUNkLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQix1QkFBdUI7RUFDdkIsWUFBWTtFQUNaLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsZUFBZTtFQUNmLFVBQVU7RUFDVixXQUFXO0VBQ1gsZUFBZTtFQUNmLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFFQTtFQUNFLFdBQVc7QUFDYjs7QUFFQTtFQUNFLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLFVBQVU7RUFDVixZQUFZO0VBQ1osU0FBUztFQUNULGNBQWM7RUFDZCxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRTtJQUNFLGVBQWU7SUFDZixXQUFXO0lBQ1gsaUJBQWlCO0lBQ2pCLGdCQUFnQjtJQUNoQixTQUFTO0VBQ1g7O0VBRUE7SUFDRSxlQUFlO0lBQ2YsNkJBQTZCO0lBQzdCLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsVUFBVTtJQUNWLFdBQVc7RUFDYjs7RUFFQTtJQUNFLFdBQVc7RUFDYjs7RUFFQTtJQUNFLDhCQUE4QjtJQUM5QixnQkFBZ0I7RUFDbEI7O0VBRUE7SUFDRSxXQUFXO0lBQ1gsaUJBQWlCO0VBQ25COztFQUVBO0lBQ0UsOEJBQThCO0lBQzlCLGVBQWU7SUFDZixrQkFBa0I7RUFDcEI7O0VBRUE7SUFDRSxzQkFBc0I7SUFDdEIsV0FBVztFQUNiOztFQUVBO0lBQ0UsOEJBQThCO0lBQzlCLFdBQVc7RUFDYjs7RUFFQTtJQUNFLDRCQUE0QjtJQUM1QixZQUFZO0VBQ2Q7QUFDRiIsImZpbGUiOiJjYWxjdWxhdG9yLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjZXF1YXRpb24ge1xyXG4gIGZsZXgtd3JhcDogd3JhcDtcclxuICB3aWR0aDogNjV2dztcclxuICBib3JkZXItcmlnaHQ6IDAuNXZ3IHNvbGlkIGJsYWNrO1xyXG4gIGFuaW1hdGlvbjogYm9yZGVyIDlzIGluZmluaXRlIGxpbmVhcjtcclxufVxyXG5cclxuQGtleWZyYW1lcyBib3JkZXIge1xyXG4gIDAlIHsgYm9yZGVyLWNvbG9yOiAjZmYwMDAwOyB9XHJcbiAgMzMlIHsgYm9yZGVyLWNvbG9yOiAjMDBmZjAwOyB9XHJcbiAgNjYlIHsgYm9yZGVyLWNvbG9yOiAjMDAwMGZmOyB9XHJcbiAgMTAwJSB7IGJvcmRlci1jb2xvcjogI2ZmMDAwMDsgfVxyXG59XHJcblxyXG4uaGV4X2NvbG9yLCAucmVzdWx0IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgcGFkZGluZzogMDtcclxuICB3aWR0aDogYXV0bztcclxuICBoZWlnaHQ6IGF1dG87XHJcbiAgbWFyZ2luLWJvdHRvbTogNXZoO1xyXG59XHJcblxyXG4uY29sb3Ige1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB3aWR0aDogOXZoO1xyXG4gIGhlaWdodDogOXZoO1xyXG4gIG1hcmdpbi1ib3R0b206IDF2aDtcclxuICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbn1cclxuXHJcbi5pbnZlcnRfcGlja2VkX2NvbG9yIHtcclxuICBmb250LXNpemU6IDI0cHg7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTtcclxufVxyXG5cclxuLnNpZ24ge1xyXG4gIGhlaWdodDogMTV2aDtcclxuICB3aWR0aDogMTV2aDtcclxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTtcclxuICBjb2xvcjogYmxhY2s7XHJcbiAgZm9udC1zaXplOiAxNXZoO1xyXG4gIGxpbmUtaGVpZ2h0OiA3dmg7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcblxyXG4ubWl4IHtcclxuICBmb250LXNpemU6IDEwdmg7XHJcbiAgbGluZS1oZWlnaHQ6IDl2aDtcclxufVxyXG5cclxuLnBsdXM6OmJlZm9yZSB7XHJcbiAgY29udGVudDogXCIrXCI7XHJcbn1cclxuXHJcbi5taW51czo6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIi1cIjtcclxufVxyXG5cclxuLm1peDo6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIiZcIjtcclxufVxyXG5cclxuLmVxdWFsczo6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIj1cIjtcclxufVxyXG5cclxuLmhleF9jb2xvciBpbnB1dCwgLnJlc3VsdCBpbnB1dCB7XHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG4gIHdpZHRoOiAxMnZoO1xyXG59XHJcblxyXG4ucmVzdWx0IGlucHV0IHtcclxuICBmb250LXNpemU6IDI0cHg7XHJcbn1cclxuXHJcbiNidXR0b25zIHtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcclxuICByaWdodDogNi41dnc7XHJcbiAgcGFkZGluZzogNXZoIDIuNXZ3O1xyXG4gIHdpZHRoOiAyMHZ3O1xyXG59XHJcblxyXG4jY2hvb3Nlbl9zaWduIHtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBtYXJnaW4tYm90dG9tOiA1dmg7XHJcbn1cclxuXHJcbiNjaGFuZ2Utc2lnbl9idXR0b25zIHtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgZm9udC1zaXplOiA3dmg7XHJcbiAgbWFyZ2luLWJvdHRvbTogMTV2aDtcclxufVxyXG5cclxuI2NoYW5nZS1zaWduX2J1dHRvbnMgc3BhbiB7XHJcbiAgZm9udC1zaXplOiAyOHB4O1xyXG59XHJcblxyXG4jY2hhbmdlLXNpZ25fYnV0dG9ucyAuc2lnbiB7XHJcbiAgaGVpZ2h0OiA3dmg7XHJcbiAgd2lkdGg6IDd2aDtcclxuICBmb250LXNpemU6IDd2aDtcclxuICBsaW5lLWhlaWdodDogNnZoO1xyXG59XHJcblxyXG4jZ2xvYmFsX2J1dHRvbnMge1xyXG4gIHdpZHRoOiAxNXZ3O1xyXG59XHJcblxyXG4jZ2xvYmFsX2J1dHRvbnMgYnV0dG9uIHtcclxuICBib3JkZXItcmFkaXVzOiA0JTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBmb250LXNpemU6IDI4cHg7XHJcbiAgd2lkdGg6IDZ2aDtcclxuICBoZWlnaHQ6IDZ2aDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxufVxyXG5cclxuI2dsb2JhbF9idXR0b25zIGJ1dHRvbiBzcGFuIHtcclxuICBkaXNwbGF5OiBub25lO1xyXG59XHJcblxyXG4jZ2xvYmFsX2J1dHRvbnMgYnV0dG9uOmhvdmVyIHtcclxuICB3aWR0aDogMTV2aDtcclxufVxyXG5cclxuI2dsb2JhbF9idXR0b25zIGJ1dHRvbjpob3ZlciBzcGFuIHtcclxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbn1cclxuXHJcbiNoZWxwIHtcclxuICB6LWluZGV4OiAxO1xyXG4gIHJpZ2h0OiA1LjV2dztcclxuICB0b3A6IDIydmg7XHJcbiAgcGFkZGluZzogMC41dnc7XHJcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG59XHJcblxyXG4jaGVscDpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcclxufVxyXG5cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcclxuICAjZXF1YXRpb24ge1xyXG4gICAgbWFyZ2luLXRvcDogNXZoO1xyXG4gICAgd2lkdGg6IDkwdnc7XHJcbiAgICBmbGV4LXdyYXA6IG5vd3JhcDtcclxuICAgIG92ZXJmbG93OiBzY3JvbGw7XHJcbiAgICBib3JkZXI6IDA7XHJcbiAgfVxyXG5cclxuICAjYnV0dG9ucyB7XHJcbiAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIHJpZ2h0OiBhdXRvO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gIH1cclxuXHJcbiAgI3NpZ25fYnV0dG9ucyB7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICB9XHJcblxyXG4gICNjaG9vc2VuX3NpZ24ge1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICB9XHJcblxyXG4gICNjaG9vc2VuX3NpZ24gZGl2IHtcclxuICAgIHdpZHRoOiBhdXRvO1xyXG4gICAgbGluZS1oZWlnaHQ6IDExdmg7XHJcbiAgfVxyXG5cclxuICAjY2hhbmdlLXNpZ25fYnV0dG9ucyB7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAydmg7XHJcbiAgfVxyXG5cclxuICAjZ2xvYmFsX2J1dHRvbnMge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gIH1cclxuXHJcbiAgI2dsb2JhbF9idXR0b25zIGRpdiB7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICB3aWR0aDogOTB2dztcclxuICB9XHJcblxyXG4gICNnbG9iYWxfYnV0dG9ucyBkaXYgYnV0dG9uIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlc21va2U7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbiAgfVxyXG59Il19 */"] });


/***/ }),

/***/ 5113:
/*!*****************************************************!*\
  !*** ./src/app/components/image/image.component.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageComponent": () => (/* binding */ ImageComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 6362);


class ImageComponent {
    constructor() {
        this.src = '';
        this.alt = '';
        this.widthSmall = '';
        this.isMobile = false;
        this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
    }
    ngOnInit() {
        this.src = 'static/' + this.src;
        if (this.isMobile) {
            this.style['width'] = this.widthSmall;
        }
    }
}
ImageComponent.ɵfac = function ImageComponent_Factory(t) { return new (t || ImageComponent)(); };
ImageComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ImageComponent, selectors: [["app-image"]], inputs: { src: "src", alt: "alt", style: "style", widthSmall: "widthSmall" }, decls: 1, vars: 3, consts: [[3, "src", "alt", "ngStyle"]], template: function ImageComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 0);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("src", ctx.src, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("alt", ctx.alt);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", ctx.style);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgStyle], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJpbWFnZS5jb21wb25lbnQuY3NzIn0= */"] });


/***/ }),

/***/ 5819:
/*!***************************************************!*\
  !*** ./src/app/components/menu/menu.component.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MenuComponent": () => (/* binding */ MenuComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/auth/auth.service */ 1228);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 2816);




function MenuComponent_div_0_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 25)(1, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const href_r18 = ctx.$implicit;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition href ", (ctx_r12.route == null ? null : ctx_r12.route.startsWith(href_r18.name)) ? "active" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("id", "", href_r18.name, "_link")("routerLink", "/", href_r18.link, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](href_r18.name);
} }
function MenuComponent_div_0_div_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div");
} }
function MenuComponent_div_0_ng_template_9_Template(rf, ctx) { if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 26)(1, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "profile\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "i", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MenuComponent_div_0_ng_template_9_Template_div_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20); const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r19.exit(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "exit\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "i", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition href ", ctx_r15.route == "profile" ? "active" : "", "");
} }
function MenuComponent_div_0_ng_template_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 30)(1, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "log in\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "i", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 32)(5, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "sign up\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "i", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition href ", ctx_r17.route == "log_in" ? "active" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition href ", ctx_r17.route == "sign_up" ? "active" : "", "");
} }
function MenuComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 18)(1, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, MenuComponent_div_0_div_2_Template, 3, 6, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 21)(4, "div", 4)(5, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "home\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "i", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, MenuComponent_div_0_div_8_Template, 1, 0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, MenuComponent_div_0_ng_template_9_Template, 8, 3, "ng-template", null, 23, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](11, MenuComponent_div_0_ng_template_11_Template, 8, 6, "ng-template", null, 24, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](10);
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](12);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r0.hrefs);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition href ", ctx_r0.route == "" ? "active" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.signedIn)("ngIfThen", _r14)("ngIfElse", _r16);
} }
function MenuComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div");
} }
function MenuComponent_ng_template_8_Template(rf, ctx) { if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 26)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "i", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MenuComponent_ng_template_8_Template_div_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r22); const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r21.exit(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "i", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition row_href ", ctx_r3.route == "profile" ? "active" : "", "");
} }
function MenuComponent_ng_template_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 30)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "i", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition row_href ", ctx_r5.route == "log_in" ? "active" : "", "");
} }
function MenuComponent_div_17_Template(rf, ctx) { if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MenuComponent_div_17_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r25); const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r24.toggleMenu(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const href_r23 = ctx.$implicit;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition column_href ", (ctx_r6.route == null ? null : ctx_r6.route.startsWith(href_r23.name)) ? "active" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("id", "", href_r23.name, "_link")("routerLink", "/", href_r23.link, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](href_r23.name);
} }
function MenuComponent_div_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div");
} }
function MenuComponent_ng_template_24_Template(rf, ctx) { if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MenuComponent_ng_template_24_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r27); const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r26.toggleMenu(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "profile\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "i", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MenuComponent_ng_template_24_Template_div_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r27); const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r28.exit(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "exit\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "i", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition column_href ", ctx_r9.route == "profile" ? "active" : "", "");
} }
function MenuComponent_ng_template_26_Template(rf, ctx) { if (rf & 1) {
    const _r30 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MenuComponent_ng_template_26_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r30); const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r29.toggleMenu(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "log in\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "i", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MenuComponent_ng_template_26_Template_div_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r30); const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r31.toggleMenu(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "sign up\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "i", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition column_href ", ctx_r11.route == "log_in" ? "active" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition column_href ", ctx_r11.route == "sign_up" ? "active" : "", "");
} }
const _c0 = function (a0) { return { "display": a0 }; };
const _c1 = function (a0) { return { "justify-content": a0 }; };
class MenuComponent {
    constructor(auth) {
        this.auth = auth;
        this.hrefs = [];
        this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
        let names = ['picker', 'calculator', 'trends', 'schemes', 'models'];
        let links = ['picker', 'calculator', 'trends/years', 'schemes/analogous', 'models'];
        names.forEach((_, i) => {
            this.hrefs.push({
                name: names[i],
                link: links[i]
            });
        });
    }
    ngOnInit() {
        this.signedIn = this.auth.isAuth();
        let menu = document.getElementById("menu_mobile");
        this.row = menu === null || menu === void 0 ? void 0 : menu.children[0].children[0];
        this.column = menu === null || menu === void 0 ? void 0 : menu.children[1];
        this.opened = false;
        this.closeMenu();
    }
    exit() {
        this.toggleMenu();
        this.auth.logout().subscribe({
            next: (resp) => {
                this.auth.setAuth(false);
                window.location.href = `/`;
            },
            error: (e) => {
                this.auth.displayErrors(e.error);
            }
        });
    }
    toggleMenu() {
        this.opened ? this.closeMenu() : this.openMenu();
        this.opened = !this.opened;
    }
    openMenu() {
        this.column.style.height = "100%";
        this.row.style.display = "none";
        this.column.style.padding = "10vh 0";
        let el;
        for (let i = 0; i < this.column.children.length; i++) {
            el = this.column.children[i];
            el.style.display = "flex";
        }
    }
    closeMenu() {
        this.column.style.height = "0%";
        this.row.style.display = "flex";
        this.column.style.padding = "0";
        let el;
        for (let i = 0; i < this.column.children.length; i++) {
            el = this.column.children[i];
            el.style.display = "none";
        }
    }
}
MenuComponent.ɵfac = function MenuComponent_Factory(t) { return new (t || MenuComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService)); };
MenuComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: MenuComponent, selectors: [["app-menu"]], inputs: { route: "route" }, decls: 28, vars: 23, consts: [["id", "menu", "class", "d-flex justify-content-between", 4, "ngIf"], ["id", "menu_mobile", 3, "ngStyle"], ["id", "row", 3, "ngStyle"], ["id", "link_icons"], ["id", "home", "routerLink", "/"], [1, "fa", "fa-home"], [4, "ngIf", "ngIfThen", "ngIfElse"], ["Row_Home", ""], ["Row_Log_In", ""], ["id", "times", 1, "transition"], [3, "click"], ["id", "column", 1, "transition"], ["id", "column_hrefs"], [3, "id", "class", "routerLink", "click", 4, "ngFor", "ngForOf"], ["id", "column_links"], ["id", "home", "routerLink", "/", 3, "click"], ["Column_Home", ""], ["Column_Log_In", ""], ["id", "menu", 1, "d-flex", "justify-content-between"], ["id", "hrefs"], [3, "id", "class", "routerLink", 4, "ngFor", "ngForOf"], ["id", "links"], [1, "transition"], ["Home", ""], ["Log_In", ""], [3, "id", "routerLink"], ["id", "profile", "routerLink", "/profile"], [1, "fa", "fa-user"], ["id", "exit", 1, "transition", "href", 3, "click"], [1, "fas", "fa-sign-out-alt"], ["id", "log_in", "routerLink", "/log_in"], [1, "fas", "fa-sign-in-alt"], ["id", "sign_in", "routerLink", "/sign_up"], ["id", "exit", 1, "transition", "row_href", 3, "click"], [3, "id", "routerLink", "click"], ["id", "profile", "routerLink", "/profile", 3, "click"], ["id", "exit", 1, "transition", "column_href", 3, "click"], ["id", "log_in", "routerLink", "/log_in", 3, "click"], ["id", "sign_in", "routerLink", "/sign_up", 3, "click"]], template: function MenuComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, MenuComponent_div_0_Template, 13, 7, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "i", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, MenuComponent_div_7_Template, 1, 0, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, MenuComponent_ng_template_8_Template, 6, 3, "ng-template", null, 7, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, MenuComponent_ng_template_10_Template, 3, 3, "ng-template", null, 8, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 9)(13, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MenuComponent_Template_span_click_13_listener() { return ctx.toggleMenu(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "i");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div", 11)(16, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](17, MenuComponent_div_17_Template, 3, 6, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "div", 14)(19, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MenuComponent_Template_div_click_19_listener() { return ctx.toggleMenu(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "home\u00A0");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](22, "i", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, MenuComponent_div_23_Template, 1, 0, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](24, MenuComponent_ng_template_24_Template, 8, 3, "ng-template", null, 16, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](26, MenuComponent_ng_template_26_Template, 8, 6, "ng-template", null, 17, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    } if (rf & 2) {
        const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](9);
        const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](11);
        const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](25);
        const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.isMobile);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](19, _c0, ctx.isMobile ? "block" : "none"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](21, _c1, ctx.opened ? "flex-end" : "space-between"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition row_href ", ctx.route == "" ? "active" : "", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.signedIn)("ngIfThen", _r2)("ngIfElse", _r4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("fas ", ctx.opened ? "fa-times" : "fa-bars", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.hrefs);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("transition column_href ", ctx.route == "" ? "active" : "", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.signedIn)("ngIfThen", _r8)("ngIfElse", _r10);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgStyle], styles: ["#menu[_ngcontent-%COMP%] {\r\n  background-color: black;\r\n  width: 100vw;\r\n  height: 6vh;\r\n  border-top: 0.5vh solid black;\r\n  border-bottom: 0.5vh solid black;\r\n  padding: 0 0.05vw;\r\n}\r\n\r\n#hrefs[_ngcontent-%COMP%], #links[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: flex-start;\r\n}\r\n\r\n#links[_ngcontent-%COMP%] {\r\n  justify-content: flex-end;\r\n}\r\n\r\n.href[_ngcontent-%COMP%] {\r\n  width: auto;\r\n  height: 5vh;\r\n  color: white;\r\n  padding: 0 2vw;\r\n  display: flex;\r\n  align-items: center;\r\n  border-left: 0.05vw solid white;\r\n  justify-content: space-between;\r\n}\r\n\r\n.href[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  text-transform: capitalize;\r\n  font-size: 20px;\r\n}\r\n\r\n.href[_ngcontent-%COMP%]:first-child {\r\n  border-left: none;\r\n}\r\n\r\n.href[_ngcontent-%COMP%]:hover, .active[_ngcontent-%COMP%] {\r\n  cursor: pointer;\r\n  padding: 0 2.5vw;\r\n}\r\n\r\n.href[_ngcontent-%COMP%]:hover   span[_ngcontent-%COMP%], .active[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  transform: scale(1.25);\r\n}\r\n\r\n#menu_mobile[_ngcontent-%COMP%] {\r\n  background-color: black;\r\n  width: 100vw;\r\n}\r\n\r\n#row[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: row;\r\n}\r\n\r\n#link_icons[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: flex-start;\r\n}\r\n\r\n.row_href[_ngcontent-%COMP%], .column_href[_ngcontent-%COMP%], #times[_ngcontent-%COMP%] {\r\n  width: auto;\r\n  height: 5vh;\r\n  color: white;\r\n  padding: 0 5vw;\r\n  display: flex;\r\n  align-items: center;\r\n  border-left: 0.05vw solid white;\r\n  justify-content: space-between;\r\n}\r\n\r\n.row_href[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  font-size: 12px;\r\n}\r\n\r\n.row_href[_ngcontent-%COMP%]:first-child {\r\n  border-left: none;\r\n}\r\n\r\n#column[_ngcontent-%COMP%] {\r\n  left: 0;\r\n  top: 0;\r\n  z-index: 1;\r\n  background-color: rgba(0, 0, 0, 0.8);\r\n  position: fixed;\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-between;\r\n  width: 100%;\r\n}\r\n\r\n#column_hrefs[_ngcontent-%COMP%], #column_links[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\r\n}\r\n\r\n.column_href[_ngcontent-%COMP%] {\r\n  border-left: none;\r\n}\r\n\r\n.column_href[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  -webkit-text-decoration: capitalize;\r\n          text-decoration: capitalize;\r\n  font-size: 20px;\r\n}\r\n\r\n#times[_ngcontent-%COMP%] {\r\n  z-index: 2;\r\n  border: none;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lbnUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHVCQUF1QjtFQUN2QixZQUFZO0VBQ1osV0FBVztFQUNYLDZCQUE2QjtFQUM3QixnQ0FBZ0M7RUFDaEMsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQiwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsV0FBVztFQUNYLFlBQVk7RUFDWixjQUFjO0VBQ2QsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQiwrQkFBK0I7RUFDL0IsOEJBQThCO0FBQ2hDOztBQUVBO0VBQ0UsMEJBQTBCO0VBQzFCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxXQUFXO0VBQ1gsWUFBWTtFQUNaLGNBQWM7RUFDZCxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLCtCQUErQjtFQUMvQiw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsT0FBTztFQUNQLE1BQU07RUFDTixVQUFVO0VBQ1Ysb0NBQW9DO0VBQ3BDLGVBQWU7RUFDZixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLDhCQUE4QjtFQUM5QixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLG1DQUEyQjtVQUEzQiwyQkFBMkI7RUFDM0IsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLFVBQVU7RUFDVixZQUFZO0FBQ2QiLCJmaWxlIjoibWVudS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiI21lbnUge1xyXG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gIHdpZHRoOiAxMDB2dztcclxuICBoZWlnaHQ6IDZ2aDtcclxuICBib3JkZXItdG9wOiAwLjV2aCBzb2xpZCBibGFjaztcclxuICBib3JkZXItYm90dG9tOiAwLjV2aCBzb2xpZCBibGFjaztcclxuICBwYWRkaW5nOiAwIDAuMDV2dztcclxufVxyXG5cclxuI2hyZWZzLCAjbGlua3Mge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XHJcbn1cclxuXHJcbiNsaW5rcyB7XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcclxufVxyXG5cclxuLmhyZWYge1xyXG4gIHdpZHRoOiBhdXRvO1xyXG4gIGhlaWdodDogNXZoO1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBwYWRkaW5nOiAwIDJ2dztcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgYm9yZGVyLWxlZnQ6IDAuMDV2dyBzb2xpZCB3aGl0ZTtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbn1cclxuXHJcbi5ocmVmIHNwYW4ge1xyXG4gIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxufVxyXG5cclxuLmhyZWY6Zmlyc3QtY2hpbGQge1xyXG4gIGJvcmRlci1sZWZ0OiBub25lO1xyXG59XHJcblxyXG4uaHJlZjpob3ZlciwgLmFjdGl2ZSB7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIHBhZGRpbmc6IDAgMi41dnc7XHJcbn1cclxuXHJcbi5ocmVmOmhvdmVyIHNwYW4sIC5hY3RpdmUgc3BhbiB7XHJcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjI1KTtcclxufVxyXG5cclxuI21lbnVfbW9iaWxlIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICB3aWR0aDogMTAwdnc7XHJcbn1cclxuXHJcbiNyb3cge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxufVxyXG5cclxuI2xpbmtfaWNvbnMge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XHJcbn1cclxuXHJcbi5yb3dfaHJlZiwgLmNvbHVtbl9ocmVmLCAjdGltZXMge1xyXG4gIHdpZHRoOiBhdXRvO1xyXG4gIGhlaWdodDogNXZoO1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBwYWRkaW5nOiAwIDV2dztcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgYm9yZGVyLWxlZnQ6IDAuMDV2dyBzb2xpZCB3aGl0ZTtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbn1cclxuXHJcbi5yb3dfaHJlZiBzcGFuIHtcclxuICBmb250LXNpemU6IDEycHg7XHJcbn1cclxuXHJcbi5yb3dfaHJlZjpmaXJzdC1jaGlsZCB7XHJcbiAgYm9yZGVyLWxlZnQ6IG5vbmU7XHJcbn1cclxuXHJcbiNjb2x1bW4ge1xyXG4gIGxlZnQ6IDA7XHJcbiAgdG9wOiAwO1xyXG4gIHotaW5kZXg6IDE7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjgpO1xyXG4gIHBvc2l0aW9uOiBmaXhlZDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4jY29sdW1uX2hyZWZzLCAjY29sdW1uX2xpbmtzIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxufVxyXG5cclxuLmNvbHVtbl9ocmVmIHtcclxuICBib3JkZXItbGVmdDogbm9uZTtcclxufVxyXG5cclxuLmNvbHVtbl9ocmVmIHNwYW4ge1xyXG4gIHRleHQtZGVjb3JhdGlvbjogY2FwaXRhbGl6ZTtcclxuICBmb250LXNpemU6IDIwcHg7XHJcbn1cclxuXHJcbiN0aW1lcyB7XHJcbiAgei1pbmRleDogMjtcclxuICBib3JkZXI6IG5vbmU7XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 5887:
/*!*******************************************************!*\
  !*** ./src/app/components/models/models.component.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ModelsComponent": () => (/* binding */ ModelsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _image_image_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../image/image.component */ 5113);



const _c0 = function () { return { width: "17.5vw" }; };
function ModelsComponent_tr_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "tr", 5)(1, "td", 6)(2, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "app-image", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const model_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", model_r1.name == "rgb" ? "RGB | HEX" : _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](4, 6, model_r1.name), " Model");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](model_r1.text);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](8, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("src", "assets/", model_r1.name, "_model.png")("alt", "", model_r1.name, " model");
} }
class ModelsComponent {
    constructor() {
        this.models = [
            {
                name: 'rgb',
                text: 'Media that transmit light (such as television) use additive color mixing with primary colors of red, green, and blue, each of which stimulates one of the three types of the eye\'s color receptors with as little stimulation as possible of the other two. This is called "RGB" color space. Mixtures of light of these primary colors cover a large part of the human color space and thus produce a large part of human color experiences. This is why color television sets or color computer monitors need only produce mixtures of red, green and blue light.'
            },
            {
                name: 'hsl',
                text: 'HSL is a cylindrical geometry, with hue, it\'s angular dimension, starting at the red primary at 0°, passing through the green primary at 120° and the blue primary at 240°, and then wrapping back to red at 360°. In each geometry, the central vertical axis comprises the neutral, achromatic, or gray colors, ranging from black at lightness 0 or value 0, the bottom, to white at lightness 1 or value 1, the top.'
            },
            {
                name: 'hwb',
                text: 'HWB is a cylindrical-coordinate representation of points in an RGB color model, similar to HSL and HSV. It was developed by HSV’s creator Alvy Ray Smith in 1996 to address some of the issues with HSV. HWB was designed to be more intuitive for humans to use and slightly faster to compute. The first coordinate, H (Hue), is the same as the Hue coordinate in HSL and HSV. W and B stand for Whiteness and Blackness respectively and range from 0–100% (or 0–1). The mental model is that the user can pick a main hue and then “mix” it with white and/or black to produce the desired color.'
            },
            {
                name: 'cmyk',
                text: 'It is possible to achieve a large range of colors seen by humans by combining cyan, magenta, and yellow transparent dyes/inks on a white substrate. These are the subtractive primary colors. Often a fourth ink, black, is added to improve reproduction of some dark colors. This is called the "CMY" or "CMYK" color space.'
            },
        ];
    }
    ngOnInit() {
    }
}
ModelsComponent.ɵfac = function ModelsComponent_Factory(t) { return new (t || ModelsComponent)(); };
ModelsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: ModelsComponent, selectors: [["app-models"]], decls: 7, vars: 1, consts: [[1, "box", "whitesmoke"], ["id", "models_header", 1, "d-flex", "justify-content-between"], ["id", "models_title"], ["id", "models_content", 1, "d-flex", "flex-column"], ["class", "d-flex align-items-center model", 4, "ngFor", "ngForOf"], [1, "d-flex", "align-items-center", "model"], [1, "d-flex", "flex-column"], [1, "model-title"], ["widthSmall", "80vw", 3, "src", "alt"]], template: function ModelsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Models");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "table", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, ModelsComponent_tr_5_Template, 9, 9, "tr", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.models);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _image_image_component__WEBPACK_IMPORTED_MODULE_0__.ImageComponent], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.UpperCasePipe], styles: ["#models_header[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n  height: auto;\r\n}\r\n\r\n#models_title[_ngcontent-%COMP%] {\r\n  font-size: 36px;\r\n}\r\n\r\n#models_content[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n}\r\n\r\n.model[_ngcontent-%COMP%] {\r\n  margin-top: 2vh;\r\n  width: 85vw;\r\n  font-size: 24px;\r\n}\r\n\r\n.model-title[_ngcontent-%COMP%] {\r\n  font-size: 28px;\r\n}\r\n\r\n.model[_ngcontent-%COMP%]:nth-child(even) {\r\n  flex-direction: row-reverse;\r\n  text-align: right;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #models_header[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n  }\r\n\r\n  #models_title[_ngcontent-%COMP%] {\r\n    font-size: 28px;\r\n  }\r\n\r\n  #models_content[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n  }\r\n\r\n  .model-title[_ngcontent-%COMP%] {\r\n    font-size: 24px;\r\n  }\r\n\r\n  .model[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    font-size: 20px;\r\n    margin-top: 3vh;\r\n  }\r\n\r\n  .model[_ngcontent-%COMP%], .model[_ngcontent-%COMP%]:nth-child(even) {\r\n    flex-direction: column;\r\n    text-align: left;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVscy5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsV0FBVztFQUNYLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsV0FBVztFQUNYLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsMkJBQTJCO0VBQzNCLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFO0lBQ0UsV0FBVztFQUNiOztFQUVBO0lBQ0UsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLFdBQVc7RUFDYjs7RUFFQTtJQUNFLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxXQUFXO0lBQ1gsZUFBZTtJQUNmLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxzQkFBc0I7SUFDdEIsZ0JBQWdCO0VBQ2xCO0FBQ0YiLCJmaWxlIjoibW9kZWxzLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjbW9kZWxzX2hlYWRlciB7XHJcbiAgd2lkdGg6IDg1dnc7XHJcbiAgaGVpZ2h0OiBhdXRvO1xyXG59XHJcblxyXG4jbW9kZWxzX3RpdGxlIHtcclxuICBmb250LXNpemU6IDM2cHg7XHJcbn1cclxuXHJcbiNtb2RlbHNfY29udGVudCB7XHJcbiAgd2lkdGg6IDg1dnc7XHJcbn1cclxuXHJcbi5tb2RlbCB7XHJcbiAgbWFyZ2luLXRvcDogMnZoO1xyXG4gIHdpZHRoOiA4NXZ3O1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxufVxyXG5cclxuLm1vZGVsLXRpdGxlIHtcclxuICBmb250LXNpemU6IDI4cHg7XHJcbn1cclxuXHJcbi5tb2RlbDpudGgtY2hpbGQoZXZlbikge1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcclxuICB0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG5cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcclxuICAjbW9kZWxzX2hlYWRlciB7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICB9XHJcblxyXG4gICNtb2RlbHNfdGl0bGUge1xyXG4gICAgZm9udC1zaXplOiAyOHB4O1xyXG4gIH1cclxuXHJcbiAgI21vZGVsc19jb250ZW50IHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gIH1cclxuXHJcbiAgLm1vZGVsLXRpdGxlIHtcclxuICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICB9XHJcblxyXG4gIC5tb2RlbCB7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgIG1hcmdpbi10b3A6IDN2aDtcclxuICB9XHJcblxyXG4gIC5tb2RlbCwgLm1vZGVsOm50aC1jaGlsZChldmVuKSB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICB9XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 8290:
/*!*******************************************************!*\
  !*** ./src/app/components/picker/picker.component.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PickerComponent": () => (/* binding */ PickerComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _services_colors_colors_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/colors/colors.service */ 9562);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 6362);




function PickerComponent_option_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "option", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const model_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngValue", model_r3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", model_r3.name, " ");
} }
function PickerComponent_div_12_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div");
} }
function PickerComponent_div_12_ng_template_2_div_0_Template(rf, ctx) { if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 17)(1, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "input", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function PickerComponent_div_12_ng_template_2_div_0_Template_input_ngModelChange_3_listener($event) { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r13); const field_r11 = restoredCtx.$implicit; const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3); return ctx_r12.getField(ctx_r12.picked_color.hex, field_r11.value).value = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const field_r11 = ctx.$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", field_r11.name, ": \u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r10.getField(ctx_r10.picked_color.hex, field_r11.value).value);
} }
function PickerComponent_div_12_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, PickerComponent_div_12_ng_template_2_div_0_Template, 4, 2, "div", 16);
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r7.picked_color.hex.fields);
} }
function PickerComponent_div_12_ng_template_4_div_0_Template(rf, ctx) { if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 17)(1, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "input", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function PickerComponent_div_12_ng_template_4_div_0_Template_input_ngModelChange_3_listener($event) { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18); const field_r15 = restoredCtx.$implicit; const model_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2).$implicit; const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r16.getField(model_r4, field_r15.value).value = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const field_r15 = ctx.$implicit;
    const model_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2).$implicit;
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", field_r15.name, ": \u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("min", ctx_r14.getField(model_r4, field_r15.value).min);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("max", ctx_r14.getField(model_r4, field_r15.value).max);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r14.getField(model_r4, field_r15.value).value);
} }
function PickerComponent_div_12_ng_template_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, PickerComponent_div_12_ng_template_4_div_0_Template, 4, 4, "div", 16);
} if (rf & 2) {
    const model_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", model_r4.fields);
} }
function PickerComponent_div_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, PickerComponent_div_12_div_1_Template, 1, 0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, PickerComponent_div_12_ng_template_2_Template, 1, 1, "ng-template", null, 14, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, PickerComponent_div_12_ng_template_4_Template, 1, 1, "ng-template", null, 15, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const model_r4 = ctx.$implicit;
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](3);
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](5);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("d-flex justify-content-end picked_color_model ", ctx_r1.picked_model.name == model_r4.name ? "active" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", model_r4.name == "hex")("ngIfThen", _r6)("ngIfElse", _r8);
} }
const _c0 = function (a0) { return { "background": a0 }; };
function PickerComponent_div_14_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 23)(1, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "input", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function PickerComponent_div_14_div_1_Template_input_ngModelChange_4_listener($event) { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r26); const field_r23 = restoredCtx.$implicit; const model_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit; const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r24.getField(model_r21, field_r23.value).value = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const field_r23 = ctx.$implicit;
    const model_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", field_r23.name, ": \u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](5, _c0, model_r21.getGradient(field_r23.value)));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("min", ctx_r22.getField(model_r21, field_r23.value).min);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("max", ctx_r22.getField(model_r21, field_r23.value).max);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r22.getField(model_r21, field_r23.value).value);
} }
const _c1 = function (a0) { return { "display": a0 }; };
function PickerComponent_div_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, PickerComponent_div_14_div_1_Template, 5, 7, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const model_r21 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](2, _c1, ctx_r2.picked_model.name == model_r21.name ? "flex" : "none"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", model_r21.fields);
} }
const _c2 = function (a0) { return { "background-color": a0 }; };
const _c3 = function (a0) { return { "color": a0 }; };
class PickerComponent {
    constructor(colors) {
        this.colors = colors;
    }
    ngOnInit() {
        this.picked_color = this.colors.loadColor('picked_color');
        this.picked_model = this.picked_color.rgb;
        this.models = this.picked_color.models.filter(el => el.name !== 'hex');
    }
    representColor() {
        this.picked_color.update(this.picked_model);
        this.colors.saveColor('picked_color', this.picked_color);
        return `hsl(${this.picked_color.hsl.toString()})`;
    }
    invertColor() {
        this.picked_color = this.picked_color.invert();
        this.picked_model = this.picked_color[this.picked_model.name];
    }
    getInvertedColor() {
        let model = this.picked_color.semiInvert().hsl;
        return `hsl(${model.toString()})`;
    }
    getField(model, name) {
        let value = model[name];
        return value;
    }
    getModelsOrder() {
        let order = this.picked_color.models;
        let selected = this.picked_model;
        let i;
        for (i = 0; i < order.length; i++) {
            if (order[i].name == selected.name) {
                break;
            }
        }
        order.splice(i, 1);
        order.unshift(selected);
        return order;
    }
}
PickerComponent.ɵfac = function PickerComponent_Factory(t) { return new (t || PickerComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_colors_colors_service__WEBPACK_IMPORTED_MODULE_0__.ColorsService)); };
PickerComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: PickerComponent, selectors: [["app-picker"]], decls: 15, vars: 14, consts: [[1, "box", "whitesmoke"], ["id", "picker_header", 1, "d-flex", "justify-content-between"], ["id", "picker_title"], ["id", "picker_options", 1, "whitesmoke", "underlined", "transition", 3, "ngModel", "ngModelChange"], ["class", "whitesmoke picker_option", 3, "ngValue", 4, "ngFor", "ngForOf"], ["id", "picker_representer", 1, "d-flex", "justify-content-between"], ["id", "picked_color", 1, "d-flex", "justify-content-center", "align-items-center", "rounded-circle", 3, "ngStyle"], ["id", "invert_picked_color", 1, "border-0", 3, "ngStyle", "click"], ["id", "picked_color_models", 1, "d-flex", "flex-column", "justify-content-between", "align-items-end"], [3, "class", 4, "ngFor", "ngForOf"], ["id", "picker_chooser"], ["class", "flex-column picker_chooser_model", 3, "ngStyle", 4, "ngFor", "ngForOf"], [1, "whitesmoke", "picker_option", 3, "ngValue"], [4, "ngIf", "ngIfThen", "ngIfElse"], ["Text", ""], ["Number", ""], ["class", "d-flex justify-content-between picked_color_field", 4, "ngFor", "ngForOf"], [1, "d-flex", "justify-content-between", "picked_color_field"], [1, "picker_chooser_label"], ["type", "text", 1, "underlined", 3, "ngModel", "ngModelChange"], ["type", "number", 1, "underlined", 3, "min", "max", "ngModel", "ngModelChange"], [1, "flex-column", "picker_chooser_model", 3, "ngStyle"], ["class", "picker_chooser_field", 4, "ngFor", "ngForOf"], [1, "picker_chooser_field"], [1, "picker_chooser_gradient", 3, "ngStyle"], ["type", "range", 3, "min", "max", "ngModel", "ngModelChange"]], template: function PickerComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "uppercase");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "select", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function PickerComponent_Template_select_ngModelChange_5_listener($event) { return ctx.picked_model = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, PickerComponent_option_6_Template, 2, 2, "option", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 5)(8, "div", 6)(9, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PickerComponent_Template_button_click_9_listener() { return ctx.invertColor(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "invert ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](12, PickerComponent_div_12_Template, 6, 6, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, PickerComponent_div_14_Template, 2, 4, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](4, 8, ctx.picked_model.name), " (", ctx.picked_model.fullName, ") Picker");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.picked_model);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.models);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](10, _c2, ctx.representColor()));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](12, _c3, ctx.getInvertedColor()));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.getModelsOrder());
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.picked_color.models);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgModel, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgSelectMultipleOption"], _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgStyle, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MaxValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.RangeValueAccessor], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.UpperCasePipe], styles: ["#picker_header[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n  height: auto;\r\n}\r\n\r\n#picker_title[_ngcontent-%COMP%] {\r\n  font-size: 24px;\r\n}\r\n\r\n#picker_options[_ngcontent-%COMP%] {\r\n  width: 10vw;\r\n  font-size: 24px;\r\n  padding: 1vh 0.25vw;\r\n}\r\n\r\n.picker_option[_ngcontent-%COMP%] {\r\n  font-size: 20px;\r\n  color: black;\r\n}\r\n\r\n#picker_representer[_ngcontent-%COMP%] {\r\n  padding: 5vh 0 0 0;\r\n  width: 85vw;\r\n}\r\n\r\n#picked_color[_ngcontent-%COMP%] {\r\n  width: 15vw;\r\n  height: 15vw;\r\n}\r\n\r\n#invert_picked_color[_ngcontent-%COMP%] {\r\n  font-size: 36px;\r\n  background-color: rgba(0, 0, 0, 0);\r\n}\r\n\r\n#picked_color_models[_ngcontent-%COMP%] {\r\n  padding: 1vh 1vw;\r\n  width: 50vw;\r\n  font-size: 20px;\r\n}\r\n\r\n#picked_color_models[_ngcontent-%COMP%]   .active[_ngcontent-%COMP%] {\r\n  font-size: 24px;\r\n}\r\n\r\n.picked_color_field[_ngcontent-%COMP%] {\r\n  margin-right: 4vw;\r\n}\r\n\r\n.picked_color_field[_ngcontent-%COMP%]:last-child {\r\n  margin-right: 0;\r\n}\r\n\r\n.picked_color_field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\r\n  width: 4vw;\r\n}\r\n\r\n#picker_chooser[_ngcontent-%COMP%] {\r\n  padding: 5vh 0 0 0;\r\n  width: 85vw;\r\n}\r\n\r\n.picker_chooser_model[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n}\r\n\r\n.picker_chooser_field[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n}\r\n\r\n.picker_chooser_gradient[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n  height: 1.5vh;\r\n  border-radius: 10%;\r\n}\r\n\r\n.picker_chooser_field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  font-size: 20px;\r\n}\r\n\r\n.picker_chooser_field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #picker_header[_ngcontent-%COMP%] {\r\n    flex-direction: column;\r\n  }\r\n\r\n  #picker_options[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n  }\r\n\r\n  #picker_representer[_ngcontent-%COMP%] {\r\n    flex-direction: column-reverse;\r\n  }\r\n\r\n  #picked_color[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    height: 90vw;\r\n  }\r\n\r\n  #invert_picked_color[_ngcontent-%COMP%] {\r\n    margin-left: -20vw;\r\n    margin-top: -5vh;\r\n  }\r\n\r\n  #picked_color_models[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    justify-content: left;\r\n  }\r\n\r\n  .picked_color_model[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    justify-content: flex-start !important;\r\n    flex-wrap: wrap;\r\n    margin-bottom: 3vh;\r\n  }\r\n\r\n  .picked_color_field[_ngcontent-%COMP%] {\r\n    margin-right: 8vw;\r\n    margin-bottom: 1vh;\r\n  }\r\n\r\n  .picked_color_field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\r\n    width: 14vw;\r\n  }\r\n\r\n  #picker_chooser[_ngcontent-%COMP%] {\r\n    padding: 5vh 0 0 0;\r\n    width: 90vw;\r\n  }\r\n\r\n  .picker_chooser_model[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n  }\r\n\r\n  .picker_chooser_field[_ngcontent-%COMP%], .picker_chooser_gradient[_ngcontent-%COMP%], .picker_chooser_field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]  {\r\n    width: 90vw;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpY2tlci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsV0FBVztFQUNYLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsZUFBZTtFQUNmLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGVBQWU7RUFDZixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsV0FBVztBQUNiOztBQUVBO0VBQ0UsV0FBVztFQUNYLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGVBQWU7RUFDZixrQ0FBa0M7QUFDcEM7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsV0FBVztFQUNYLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLFVBQVU7QUFDWjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsYUFBYTtFQUNiLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7RUFDRTtJQUNFLHNCQUFzQjtFQUN4Qjs7RUFFQTtJQUNFLFdBQVc7RUFDYjs7RUFFQTtJQUNFLDhCQUE4QjtFQUNoQzs7RUFFQTtJQUNFLFdBQVc7SUFDWCxZQUFZO0VBQ2Q7O0VBRUE7SUFDRSxrQkFBa0I7SUFDbEIsZ0JBQWdCO0VBQ2xCOztFQUVBO0lBQ0UsV0FBVztJQUNYLHFCQUFxQjtFQUN2Qjs7RUFFQTtJQUNFLFdBQVc7SUFDWCxzQ0FBc0M7SUFDdEMsZUFBZTtJQUNmLGtCQUFrQjtFQUNwQjs7RUFFQTtJQUNFLGlCQUFpQjtJQUNqQixrQkFBa0I7RUFDcEI7O0VBRUE7SUFDRSxXQUFXO0VBQ2I7O0VBRUE7SUFDRSxrQkFBa0I7SUFDbEIsV0FBVztFQUNiOztFQUVBO0lBQ0UsV0FBVztFQUNiOztFQUVBO0lBQ0UsV0FBVztFQUNiO0FBQ0YiLCJmaWxlIjoicGlja2VyLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjcGlja2VyX2hlYWRlciB7XHJcbiAgd2lkdGg6IDg1dnc7XHJcbiAgaGVpZ2h0OiBhdXRvO1xyXG59XHJcblxyXG4jcGlja2VyX3RpdGxlIHtcclxuICBmb250LXNpemU6IDI0cHg7XHJcbn1cclxuXHJcbiNwaWNrZXJfb3B0aW9ucyB7XHJcbiAgd2lkdGg6IDEwdnc7XHJcbiAgZm9udC1zaXplOiAyNHB4O1xyXG4gIHBhZGRpbmc6IDF2aCAwLjI1dnc7XHJcbn1cclxuXHJcbi5waWNrZXJfb3B0aW9uIHtcclxuICBmb250LXNpemU6IDIwcHg7XHJcbiAgY29sb3I6IGJsYWNrO1xyXG59XHJcblxyXG4jcGlja2VyX3JlcHJlc2VudGVyIHtcclxuICBwYWRkaW5nOiA1dmggMCAwIDA7XHJcbiAgd2lkdGg6IDg1dnc7XHJcbn1cclxuXHJcbiNwaWNrZWRfY29sb3Ige1xyXG4gIHdpZHRoOiAxNXZ3O1xyXG4gIGhlaWdodDogMTV2dztcclxufVxyXG5cclxuI2ludmVydF9waWNrZWRfY29sb3Ige1xyXG4gIGZvbnQtc2l6ZTogMzZweDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApO1xyXG59XHJcblxyXG4jcGlja2VkX2NvbG9yX21vZGVscyB7XHJcbiAgcGFkZGluZzogMXZoIDF2dztcclxuICB3aWR0aDogNTB2dztcclxuICBmb250LXNpemU6IDIwcHg7XHJcbn1cclxuXHJcbiNwaWNrZWRfY29sb3JfbW9kZWxzIC5hY3RpdmUge1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxufVxyXG5cclxuLnBpY2tlZF9jb2xvcl9maWVsZCB7XHJcbiAgbWFyZ2luLXJpZ2h0OiA0dnc7XHJcbn1cclxuXHJcbi5waWNrZWRfY29sb3JfZmllbGQ6bGFzdC1jaGlsZCB7XHJcbiAgbWFyZ2luLXJpZ2h0OiAwO1xyXG59XHJcblxyXG4ucGlja2VkX2NvbG9yX2ZpZWxkIGlucHV0IHtcclxuICB3aWR0aDogNHZ3O1xyXG59XHJcblxyXG4jcGlja2VyX2Nob29zZXIge1xyXG4gIHBhZGRpbmc6IDV2aCAwIDAgMDtcclxuICB3aWR0aDogODV2dztcclxufVxyXG5cclxuLnBpY2tlcl9jaG9vc2VyX21vZGVsIHtcclxuICB3aWR0aDogODV2dztcclxufVxyXG5cclxuLnBpY2tlcl9jaG9vc2VyX2ZpZWxkIHtcclxuICB3aWR0aDogODV2dztcclxufVxyXG5cclxuLnBpY2tlcl9jaG9vc2VyX2dyYWRpZW50IHtcclxuICB3aWR0aDogODV2dztcclxuICBoZWlnaHQ6IDEuNXZoO1xyXG4gIGJvcmRlci1yYWRpdXM6IDEwJTtcclxufVxyXG5cclxuLnBpY2tlcl9jaG9vc2VyX2ZpZWxkIHNwYW4ge1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxufVxyXG5cclxuLnBpY2tlcl9jaG9vc2VyX2ZpZWxkIGlucHV0IHtcclxuICB3aWR0aDogODV2dztcclxufVxyXG5cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcclxuICAjcGlja2VyX2hlYWRlciB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIH1cclxuXHJcbiAgI3BpY2tlcl9vcHRpb25zIHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gIH1cclxuXHJcbiAgI3BpY2tlcl9yZXByZXNlbnRlciB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uLXJldmVyc2U7XHJcbiAgfVxyXG5cclxuICAjcGlja2VkX2NvbG9yIHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gICAgaGVpZ2h0OiA5MHZ3O1xyXG4gIH1cclxuXHJcbiAgI2ludmVydF9waWNrZWRfY29sb3Ige1xyXG4gICAgbWFyZ2luLWxlZnQ6IC0yMHZ3O1xyXG4gICAgbWFyZ2luLXRvcDogLTV2aDtcclxuICB9XHJcblxyXG4gICNwaWNrZWRfY29sb3JfbW9kZWxzIHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gICAganVzdGlmeS1jb250ZW50OiBsZWZ0O1xyXG4gIH1cclxuXHJcbiAgLnBpY2tlZF9jb2xvcl9tb2RlbCB7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydCAhaW1wb3J0YW50O1xyXG4gICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogM3ZoO1xyXG4gIH1cclxuXHJcbiAgLnBpY2tlZF9jb2xvcl9maWVsZCB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDh2dztcclxuICAgIG1hcmdpbi1ib3R0b206IDF2aDtcclxuICB9XHJcblxyXG4gIC5waWNrZWRfY29sb3JfZmllbGQgaW5wdXQge1xyXG4gICAgd2lkdGg6IDE0dnc7XHJcbiAgfVxyXG5cclxuICAjcGlja2VyX2Nob29zZXIge1xyXG4gICAgcGFkZGluZzogNXZoIDAgMCAwO1xyXG4gICAgd2lkdGg6IDkwdnc7XHJcbiAgfVxyXG5cclxuICAucGlja2VyX2Nob29zZXJfbW9kZWwge1xyXG4gICAgd2lkdGg6IDkwdnc7XHJcbiAgfVxyXG5cclxuICAucGlja2VyX2Nob29zZXJfZmllbGQsIC5waWNrZXJfY2hvb3Nlcl9ncmFkaWVudCwgLnBpY2tlcl9jaG9vc2VyX2ZpZWxkIGlucHV0ICB7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICB9XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 7094:
/*!*********************************************************!*\
  !*** ./src/app/components/profile/profile.component.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProfileComponent": () => (/* binding */ ProfileComponent)
/* harmony export */ });
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Color */ 1710);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/auth/auth.service */ 1228);
/* harmony import */ var _image_image_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../image/image.component */ 5113);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _auth_field_field_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth/field/field.component */ 9615);







function ProfileComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "div");
} }
function ProfileComponent_ng_template_7_div_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "div");
} }
function ProfileComponent_ng_template_7_ng_template_5_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Edit: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "form")(4, "input", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("input", function ProfileComponent_ng_template_7_ng_template_5_Template_input_input_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r12); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); return ctx_r11.modifyColorOrCategory(); })("ngModelChange", function ProfileComponent_ng_template_7_ng_template_5_Template_input_ngModelChange_4_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r12); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); return ctx_r13.current = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r8.current);
} }
function ProfileComponent_ng_template_7_ng_template_7_Template(rf, ctx) { }
function ProfileComponent_ng_template_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, ProfileComponent_ng_template_7_div_4_Template, 1, 0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, ProfileComponent_ng_template_7_ng_template_5_Template, 5, 1, "ng-template", null, 17, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](7, ProfileComponent_ng_template_7_ng_template_7_Template, 0, 0, "ng-template", null, 18, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
} if (rf & 2) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](6);
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](8);
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("Welcome, ", ctx_r2.name, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("Your email: ", ctx_r2.email, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r2.active[2])("ngIfThen", _r7)("ngIfElse", _r9);
} }
function ProfileComponent_ng_template_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "app-field", 20)(1, "app-field", 21);
} }
const _c0 = function (a0, a1, a2) { return { "padding-bottom": a0, "background-color": a1, "color": a2 }; };
const _c1 = function (a0) { return { "opacity": a0 }; };
function ProfileComponent_div_18_div_14_Template(rf, ctx) { if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_div_18_div_14_Template_div_click_0_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r20); const j_r18 = restoredCtx.index; const color_r17 = restoredCtx.$implicit; const i_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().index; const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); ctx_r19.active = [i_r15, j_r18, ctx_r19.active[2], true]; return ctx_r19.current = color_r17.hex.toString(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "div", 30)(4, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_div_18_div_14_Template_span_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r20); const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); return ctx_r22.deleteColorOrCategory("color"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](5, "i", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_div_18_div_14_Template_span_click_6_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r20); const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2); ctx_r23.saveCategories(); return (ctx_r23.active[2] = !ctx_r23.active[2]); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](7, "i");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const color_r17 = ctx.$implicit;
    const j_r18 = ctx.index;
    const i_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().index;
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction3"](6, _c0, ctx_r16.isActive("color", i_r15, j_r18) ? "2vh" : "0vh", color_r17.hex.toString(), color_r17.getShade()));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](color_r17.hex.toString());
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](10, _c1, ctx_r16.isActive("color", i_r15, j_r18) ? "1" : "0"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassMapInterpolate1"]("fas ", ctx_r16.active[2] ? "fa-save" : "fa-edit", "");
} }
function ProfileComponent_div_18_Template(rf, ctx) { if (rf & 1) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 22)(1, "div", 23)(2, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_div_18_Template_span_click_2_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r26); const i_r15 = restoredCtx.index; const category_r14 = restoredCtx.$implicit; const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); ctx_r25.active = [i_r15, -1, ctx_r25.active[2], false]; return ctx_r25.current = category_r14.name; });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "span", 25)(5, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_div_18_Template_span_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r26); const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); ctx_r27.addColor(); ctx_r27.active[3] = true; return (ctx_r27.active[3] = true); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "i", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, " \u00A0 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_div_18_Template_span_click_8_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r26); const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); return ctx_r28.deleteColorOrCategory("category"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "i", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10, " \u00A0 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_div_18_Template_span_click_11_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r26); const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](); ctx_r29.saveCategories(); return (ctx_r29.active[2] = !ctx_r29.active[2]); });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](12, "i");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](14, ProfileComponent_div_18_div_14_Template, 8, 12, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const category_r14 = ctx.$implicit;
    const i_r15 = ctx.index;
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", category_r14.name, ": \u00A0\u00A0\u00A0 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](6, _c1, ctx_r5.isActive("category", i_r15) ? "1" : "0"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassMapInterpolate1"]("fas ", ctx_r5.active[2] ? "fa-save" : "fa-edit", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", category_r14.colors);
} }
const _c2 = function () { return { width: "12.5vw", border: "1px solid var(--bs-primary)", "border-radius": "50%" }; };
const _c3 = function (a0) { return { "display": a0 }; };
class ProfileComponent {
    constructor(auth) {
        this.auth = auth;
        this.name = 'name';
        this.email = 'email';
        this.categories = [];
        this.active = [-1, -1, false, true]; //category id, colors id, edit mode, isColor
        /*
        You will see lots of comments about active field,
        because i didn't want to make variables: 'edit mode' and 'isColor'
        because they all are fields of class Active,
        though creating new class or type isn't necessary here :/
        */
        //deafulat values if the server returned an error
        this.nameText = 'name';
        this.emailText = 'email';
        if (!this.auth.isAuth()) {
            window.location.href = (`/`);
        }
        this.editing = false;
    }
    ngOnInit() {
        this.auth.get().subscribe({
            next: (resp) => {
                this.name = resp.name;
                this.nameText = resp.name;
                this.email = resp.email;
                this.emailText = resp.email;
                if (resp.colors.length == 0) {
                    this.categories = [];
                }
                else {
                    this.categories = this.decodeColors(resp.colors.split(';'));
                }
            },
            error: (e) => {
                this.auth.displayErrors(e.error);
            }
        });
    }
    discard() {
        if (this.editing) {
            this.name = this.nameText;
            this.email = this.emailText;
            this.editing = false;
        }
    }
    save() {
        if (this.editing) {
            this.nameText = this.name;
            this.emailText = this.email;
            let data = {
                'data': 'info',
                'name': this.name,
                'email': this.email
            };
            this.auth.edit(data).subscribe({
                next: (resp) => {
                    this.nameText = resp.name;
                    this.emailText = resp.email;
                },
                error: (e) => {
                    this.auth.displayErrors(e.error);
                }
            });
        }
        this.editing = !this.editing;
    }
    isActive(type, i, j) {
        if (type == 'category') {
            return this.active[0] /*category id*/ == i && !this.active[3]; // isColor
        }
        return this.active[0] == i && this.active[1] == j; //category id, colors id
    }
    modifyColorOrCategory() {
        if (this.active[3]) { //isColor
            let color = this.categories[this.active[0]].colors[this.active[1]]; //category id, colors id
            if (color.hex.toString() != this.current) {
                color = _Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor(this.current);
                this.categories[this.active[0]].colors[this.active[1]] = color;
            }
            return;
        }
        this.categories[this.active[0]].name = this.current; //category id
    }
    deleteColorOrCategory(type) {
        if (type == 'category') {
            this.categories.splice(this.active[0], 1); //category id
        }
        else if (type == 'color') {
            this.categories[this.active[0]].colors.splice(this.active[1], 1); //category id, colors id
        }
        this.current = '';
        this.active = [-1, -1, false, true]; //category id, colors id, edit mode, isColor
        let data = {
            'data': 'colors',
            'colors': this.encodeColors()
        };
        this.auth.edit(data).subscribe({
            next: (resp) => {
                this.categories = this.decodeColors(resp.colors.split(';'));
            },
            error: (e) => {
                this.auth.displayErrors(e.error);
            }
        });
    }
    saveCategories() {
        if (this.active[2]) { //edit mode
            let data = {
                'data': 'colors',
                'colors': this.encodeColors()
            };
            this.auth.edit(data).subscribe({
                next: (resp) => {
                    this.categories = this.decodeColors(resp.colors.split(';'));
                },
                error: (e) => {
                    this.auth.displayErrors(e.error);
                }
            });
        }
    }
    addCategory() {
        if (this.categories.length < 11) {
            let category = {
                name: 'Title',
                colors: []
            };
            this.categories.push(category);
            this.current = category.name;
            this.active = [this.categories.length - 1, -1, true, false]; //category id, colors id, edit mode, isColor
        }
    }
    addColor() {
        let colors = this.categories[this.active[0]].colors; //category id
        if (colors.length < 11) {
            let color = _Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor('#000000');
            colors.push(color);
            this.categories[this.active[0]].colors = colors; //category id
            this.current = color.hex.toString();
            this.active = [this.active[0], colors.length - 1, true, true]; //category id, colors id, edit mode, isColor
        }
    }
    decodeColors(colorArr) {
        let categories = [];
        let colors;
        for (let category of colorArr) {
            colors = [];
            if (category.includes(':')) {
                for (let color of category.split(':')[1].split(',')) {
                    colors.push(_Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor('#' + color));
                }
            }
            categories.push({
                'name': category.split(':')[0],
                'colors': colors
            });
        }
        return categories;
    }
    encodeColors() {
        let str = '';
        for (let category of this.categories) {
            str += category.name + ':';
            for (let color of category.colors) {
                str += color.hex.toString().slice(1, 7);
                str += ',';
            }
            str = str.slice(0, -1);
            str += ';';
        }
        return str.slice(0, -1);
    }
}
ProfileComponent.ɵfac = function ProfileComponent_Factory(t) { return new (t || ProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService)); };
ProfileComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({ type: ProfileComponent, selectors: [["app-profile"]], decls: 22, vars: 15, consts: [[1, "box", "whitesmoke", "d-flex", "justify-content-between"], ["id", "profile_info", 1, "d-flex", "flex-column", "align-items-center", "justify-content-between"], ["id", "profile_logo", 1, "d-flex", "align-items-center", "justify-content-center"], ["src", "assets/avatar.png", "alt", "avatar", "widthSmall", "80vw"], ["id", "profile_data", 1, "d-flex", "flex-column", "text-end"], [4, "ngIf", "ngIfThen", "ngIfElse"], ["Data", ""], ["Edit", ""], ["id", "edit_buttons"], ["type", "submit", 1, "form-control", "transition", "submit", 3, "ngStyle", "value", "click"], ["type", "submit", 1, "form-control", "submit", 3, "value", "click"], ["id", "profile_content", 1, "d-flex", "flex-column", "justify-content-start"], ["id", "profile_colors", 1, "d-flex", "flex-column", "justify-content-start"], ["class", "d-flex flex-column justify-content-start category", 4, "ngFor", "ngForOf"], ["id", "add_category", 1, "d-flex", "justify-content-end", "transition"], [3, "click"], [1, "fa", "fa-plus"], ["ColorEdit", ""], ["None", ""], ["type", "text", "name", "current", "placeholder", "Current", 1, "form-control", "transition", 3, "ngModel", "input", "ngModelChange"], ["name", "name", "placeholder", "Your login", "value", "name"], ["name", "email", "placeholder", "Your email", "autocomplete", "username", "value", "email", "redirect", "log_in", "redirectText", "Already have an account?"], [1, "d-flex", "flex-column", "justify-content-start", "category"], [1, "category-info"], [1, "category-name", 3, "click"], [1, "transition", "category-icons", 3, "ngStyle"], [1, "fa", "fa-trash"], [1, "d-flex", "flex-wrap", "colors"], ["class", "d-flex flex-column justify-content-center align-items-center text-center transition color", 3, "ngStyle", "click", 4, "ngFor", "ngForOf"], [1, "d-flex", "flex-column", "justify-content-center", "align-items-center", "text-center", "transition", "color", 3, "ngStyle", "click"], [1, "d-flex", "align-items-center", "justify-content-center", "transition", 3, "ngStyle"]], template: function ProfileComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "app-image", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, ProfileComponent_div_6_Template, 1, 0, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](7, ProfileComponent_ng_template_7_Template, 9, 5, "ng-template", null, 6, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, ProfileComponent_ng_template_9_Template, 2, 0, "ng-template", null, 7, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 8)(12, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_Template_input_click_12_listener() { return ctx.discard(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_Template_input_click_13_listener() { return ctx.save(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "div", 11)(15, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "Your color pallettes. You can add colors from through all the site.");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, ProfileComponent_div_18_Template, 15, 8, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "div", 14)(20, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ProfileComponent_Template_div_click_20_listener() { return ctx.addCategory(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](21, "i", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](8);
        const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](12, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.editing)("ngIfThen", _r3)("ngIfElse", _r1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassMapInterpolate1"]("d-flex ", ctx.editing ? "editing" : "", "");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate"]("value", ctx.editing ? "Discard" : "");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](13, _c3, ctx.editing ? "block" : "none"));
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate"]("value", ctx.editing ? "Save" : "Edit");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.categories);
    } }, directives: [_image_image_component__WEBPACK_IMPORTED_MODULE_2__.ImageComponent, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgForm, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgModel, _auth_field_field_component__WEBPACK_IMPORTED_MODULE_3__.FieldComponent, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgStyle, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf], styles: ["#profile_info[_ngcontent-%COMP%] {\r\n  width: 30vw;\r\n  padding: 2.5vw 5vw 2.5vw 0;\r\n}\r\n\r\n#profile_logo[_ngcontent-%COMP%] {\r\n  width: 15vw;\r\n  padding: 0 2.5vw;\r\n}\r\n\r\n#profile_data[_ngcontent-%COMP%] {\r\n  margin-top: 5vh;\r\n  font-size: 20px;\r\n}\r\n\r\n#edit_buttons[_ngcontent-%COMP%] {\r\n  justify-content: flex-end;\r\n  width: 15vw;\r\n}\r\n\r\n#edit_buttons.editing[_ngcontent-%COMP%] {\r\n  justify-content: space-between !important;\r\n}\r\n\r\ninput[_ngcontent-%COMP%] {\r\n  width: 15vw;\r\n}\r\n\r\n.submit[_ngcontent-%COMP%] {\r\n  width: 4vw;\r\n}\r\n\r\n.submit[_ngcontent-%COMP%]:hover {\r\n  transform: scale(1.25);\r\n  color: var(--bs-primary)\r\n}\r\n\r\n#profile_content[_ngcontent-%COMP%] {\r\n  width: 60vw;\r\n  font-size: 32px;\r\n}\r\n\r\n#profile_colors[_ngcontent-%COMP%] {\r\n  width: 60vw;\r\n  font-size: 24px;\r\n}\r\n\r\n.category[_ngcontent-%COMP%] {\r\n  margin-top: 2.5vh;\r\n  width: 60vw;\r\n}\r\n\r\n.category-icons[_ngcontent-%COMP%] {\r\n  font-weight: normal;\r\n  font-size: 18px;\r\n}\r\n\r\n.colors[_ngcontent-%COMP%] {\r\n  margin-top: 0.5vh;\r\n  width: 50vw;\r\n  font-size: 16px;\r\n}\r\n\r\n.color[_ngcontent-%COMP%] {\r\n  width: 5vw;\r\n  height: 5vw;\r\n  padding-top: 2.5vh\r\n}\r\n\r\n.color[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n  width: 5vw;\r\n  gap: 0.5vw;\r\n}\r\n\r\n#add_category[_ngcontent-%COMP%] {\r\n  margin-top: 2.5vh;\r\n}\r\n\r\n#add_category[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n  padding: 1vh;\r\n  border-radius: 12%;\r\n}\r\n\r\n#add_category[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]:hover {\r\n  background-color: #cccccc;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #profile_info[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    padding: 0;\r\n  }\r\n\r\n  #profile_logo[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    padding: 0 2.5vw;\r\n  }\r\n\r\n  #profile_data[_ngcontent-%COMP%] {\r\n    margin-top: 5vh;\r\n    font-size: 24px;\r\n  }\r\n\r\n  #edit_buttons[_ngcontent-%COMP%] {\r\n    margin-top: 3vh;\r\n    width: 90vw;\r\n  }\r\n\r\n  input[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n  }\r\n\r\n  .submit[_ngcontent-%COMP%] {\r\n    width: 40vw;\r\n  }\r\n\r\n  .submit[_ngcontent-%COMP%]:hover {\r\n    transform: scale(1);\r\n  }\r\n\r\n  #profile_content[_ngcontent-%COMP%] {\r\n    text-align: justify;\r\n    width: 90vw;\r\n    font-size: 24px;\r\n  }\r\n\r\n  #profile_colors[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    font-size: 20px;\r\n  }\r\n\r\n  .category[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n  }\r\n\r\n  .colors[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    gap: 5vw;\r\n  }\r\n\r\n  .color[_ngcontent-%COMP%] {\r\n    width: 25vw;\r\n    height: 25vw;\r\n  }\r\n\r\n  .color[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\r\n    width: 25vw;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQVc7RUFDWCwwQkFBMEI7QUFDNUI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGVBQWU7QUFDakI7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsV0FBVztBQUNiOztBQUVBO0VBQ0UseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBO0VBQ0UsVUFBVTtBQUNaOztBQUVBO0VBQ0Usc0JBQXNCO0VBQ3RCO0FBQ0Y7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLFdBQVc7QUFDYjs7QUFFQTtFQUNFLG1CQUFtQjtFQUNuQixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLFdBQVc7RUFDWCxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsVUFBVTtFQUNWLFdBQVc7RUFDWDtBQUNGOztBQUVBO0VBQ0UsVUFBVTtFQUNWLFVBQVU7QUFDWjs7QUFFQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLFlBQVk7RUFDWixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRTtJQUNFLFdBQVc7SUFDWCxVQUFVO0VBQ1o7O0VBRUE7SUFDRSxXQUFXO0lBQ1gsZ0JBQWdCO0VBQ2xCOztFQUVBO0lBQ0UsZUFBZTtJQUNmLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxlQUFlO0lBQ2YsV0FBVztFQUNiOztFQUVBO0lBQ0UsV0FBVztFQUNiOztFQUVBO0lBQ0UsV0FBVztFQUNiOztFQUVBO0lBQ0UsbUJBQW1CO0VBQ3JCOztFQUVBO0lBQ0UsbUJBQW1CO0lBQ25CLFdBQVc7SUFDWCxlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsV0FBVztJQUNYLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxXQUFXO0VBQ2I7O0VBRUE7SUFDRSxXQUFXO0lBQ1gsUUFBUTtFQUNWOztFQUVBO0lBQ0UsV0FBVztJQUNYLFlBQVk7RUFDZDs7RUFFQTtJQUNFLFdBQVc7RUFDYjtBQUNGIiwiZmlsZSI6InByb2ZpbGUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNwcm9maWxlX2luZm8ge1xyXG4gIHdpZHRoOiAzMHZ3O1xyXG4gIHBhZGRpbmc6IDIuNXZ3IDV2dyAyLjV2dyAwO1xyXG59XHJcblxyXG4jcHJvZmlsZV9sb2dvIHtcclxuICB3aWR0aDogMTV2dztcclxuICBwYWRkaW5nOiAwIDIuNXZ3O1xyXG59XHJcblxyXG4jcHJvZmlsZV9kYXRhIHtcclxuICBtYXJnaW4tdG9wOiA1dmg7XHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG59XHJcblxyXG4jZWRpdF9idXR0b25zIHtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xyXG4gIHdpZHRoOiAxNXZ3O1xyXG59XHJcblxyXG4jZWRpdF9idXR0b25zLmVkaXRpbmcge1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbiAhaW1wb3J0YW50O1xyXG59XHJcblxyXG5pbnB1dCB7XHJcbiAgd2lkdGg6IDE1dnc7XHJcbn1cclxuXHJcbi5zdWJtaXQge1xyXG4gIHdpZHRoOiA0dnc7XHJcbn1cclxuXHJcbi5zdWJtaXQ6aG92ZXIge1xyXG4gIHRyYW5zZm9ybTogc2NhbGUoMS4yNSk7XHJcbiAgY29sb3I6IHZhcigtLWJzLXByaW1hcnkpXHJcbn1cclxuXHJcbiNwcm9maWxlX2NvbnRlbnQge1xyXG4gIHdpZHRoOiA2MHZ3O1xyXG4gIGZvbnQtc2l6ZTogMzJweDtcclxufVxyXG5cclxuI3Byb2ZpbGVfY29sb3JzIHtcclxuICB3aWR0aDogNjB2dztcclxuICBmb250LXNpemU6IDI0cHg7XHJcbn1cclxuXHJcbi5jYXRlZ29yeSB7XHJcbiAgbWFyZ2luLXRvcDogMi41dmg7XHJcbiAgd2lkdGg6IDYwdnc7XHJcbn1cclxuXHJcbi5jYXRlZ29yeS1pY29ucyB7XHJcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcclxuICBmb250LXNpemU6IDE4cHg7XHJcbn1cclxuXHJcbi5jb2xvcnMge1xyXG4gIG1hcmdpbi10b3A6IDAuNXZoO1xyXG4gIHdpZHRoOiA1MHZ3O1xyXG4gIGZvbnQtc2l6ZTogMTZweDtcclxufVxyXG5cclxuLmNvbG9yIHtcclxuICB3aWR0aDogNXZ3O1xyXG4gIGhlaWdodDogNXZ3O1xyXG4gIHBhZGRpbmctdG9wOiAyLjV2aFxyXG59XHJcblxyXG4uY29sb3IgZGl2IHtcclxuICB3aWR0aDogNXZ3O1xyXG4gIGdhcDogMC41dnc7XHJcbn1cclxuXHJcbiNhZGRfY2F0ZWdvcnkge1xyXG4gIG1hcmdpbi10b3A6IDIuNXZoO1xyXG59XHJcblxyXG4jYWRkX2NhdGVnb3J5IGRpdiB7XHJcbiAgcGFkZGluZzogMXZoO1xyXG4gIGJvcmRlci1yYWRpdXM6IDEyJTtcclxufVxyXG5cclxuI2FkZF9jYXRlZ29yeSBkaXY6aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2NjY2M7XHJcbn1cclxuXHJcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDYwMHB4KSB7XHJcbiAgI3Byb2ZpbGVfaW5mbyB7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgfVxyXG5cclxuICAjcHJvZmlsZV9sb2dvIHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gICAgcGFkZGluZzogMCAyLjV2dztcclxuICB9XHJcblxyXG4gICNwcm9maWxlX2RhdGEge1xyXG4gICAgbWFyZ2luLXRvcDogNXZoO1xyXG4gICAgZm9udC1zaXplOiAyNHB4O1xyXG4gIH1cclxuXHJcbiAgI2VkaXRfYnV0dG9ucyB7XHJcbiAgICBtYXJnaW4tdG9wOiAzdmg7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICB9XHJcblxyXG4gIGlucHV0IHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gIH1cclxuXHJcbiAgLnN1Ym1pdCB7XHJcbiAgICB3aWR0aDogNDB2dztcclxuICB9XHJcblxyXG4gIC5zdWJtaXQ6aG92ZXIge1xyXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcclxuICB9XHJcblxyXG4gICNwcm9maWxlX2NvbnRlbnQge1xyXG4gICAgdGV4dC1hbGlnbjoganVzdGlmeTtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gICAgZm9udC1zaXplOiAyNHB4O1xyXG4gIH1cclxuXHJcbiAgI3Byb2ZpbGVfY29sb3JzIHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gIH1cclxuXHJcbiAgLmNhdGVnb3J5IHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gIH1cclxuXHJcbiAgLmNvbG9ycyB7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICAgIGdhcDogNXZ3O1xyXG4gIH1cclxuXHJcbiAgLmNvbG9yIHtcclxuICAgIHdpZHRoOiAyNXZ3O1xyXG4gICAgaGVpZ2h0OiAyNXZ3O1xyXG4gIH1cclxuXHJcbiAgLmNvbG9yIGRpdiB7XHJcbiAgICB3aWR0aDogMjV2dztcclxuICB9XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 1632:
/*!*********************************************************!*\
  !*** ./src/app/components/schemes/schemes.component.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SchemesComponent": () => (/* binding */ SchemesComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 3280);
/* harmony import */ var src_app_Equation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/Equation */ 3672);
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Color */ 1710);
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Model */ 1313);
/* harmony import */ var _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/schemes/scheme.service */ 8407);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 2816);
/* harmony import */ var _services_canvas_canvas_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/canvas/canvas.service */ 9520);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 6362);











function SchemesComponent_option_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const scheme_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngValue", scheme_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", scheme_r2, " ");
} }
function SchemesComponent_div_12_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "div");
} }
function SchemesComponent_div_12_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const info_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](info_r3.label == "" ? "" : info_r3.color.hex.toString());
} }
function SchemesComponent_div_12_ng_template_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const info_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](info_r3.label);
} }
const _c0 = function (a0) { return { "background-color": a0 }; };
function SchemesComponent_div_12_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function SchemesComponent_div_12_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r12); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](); return ctx_r11.colors_shown = !ctx_r11.colors_shown; });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, SchemesComponent_div_12_div_1_Template, 1, 0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](2, SchemesComponent_div_12_ng_template_2_Template, 2, 1, "ng-template", null, 14, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](4, SchemesComponent_div_12_ng_template_4_Template, 2, 1, "ng-template", null, 15, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const info_r3 = ctx.$implicit;
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](3);
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](5);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](4, _c0, info_r3.color.hex.toString()));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx_r1.colors_shown)("ngIfThen", _r5)("ngIfElse", _r7);
} }
class SchemesComponent {
    constructor(router, route, schemeService, canvasService) {
        this.router = router;
        this.route = route;
        this.schemeService = schemeService;
        this.canvasService = canvasService;
        let scheme;
        this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
        let name = this.route.snapshot.paramMap.get('scheme');
        let size = screen.availWidth;
        if (this.isMobile) {
            size *= 80 / 100; //80vw
        }
        else {
            size *= 20 / 100; //20vw
        }
        let coords = this.schemeService.loadCoords(name);
        if (coords.length == 2) { //the cookie may expire, then length will be 0
            scheme = this.schemeService.get(name, coords[0], coords[1], size);
        }
        else {
            scheme = this.schemeService.get(name, size / 2, size / 4, size); //tint of violet
        }
        if (scheme == null) {
            window.location.replace('/');
        }
        else {
            this.scheme = scheme;
            this.picked_scheme = scheme.name;
        }
        this.schemes = ['monochromatic', 'complementary', 'analogous', 'compound', 'triadic', 'rectangle', 'square'];
        this.mouseIsDown = false;
        this.colors_shown = false;
    }
    ngOnInit() {
        //there are 2 different canvas elements so that when user drags any of the cursors we may redraw only the cursors, the wheel is only drawn once, at the beginind, remains unchanged
        let size = screen.availWidth;
        if (this.isMobile) {
            size *= 80 / 100; //80vw
        }
        else {
            size *= 20 / 100; //20vw
        }
        let container = document.getElementById('canvas_container');
        this.wheel = this.canvasService.drawWheel(size);
        container.style.width = container.style.height = size + 'px';
        this.wheel.style.position = 'absolute';
        container === null || container === void 0 ? void 0 : container.appendChild(this.wheel);
        this.canvasService.wheel = this.wheel;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvas.height = size;
        this.canvas.style.position = 'absolute';
        container === null || container === void 0 ? void 0 : container.appendChild(this.canvas);
        this.canvasService.canvas = this.canvas;
        this.canvasService.drawAllCursors(this.scheme.cursors);
        //cursor can only be moved when the mouse is down, so we need to track mouse state
        if (this.isMobile) {
            (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.fromEvent)(this.canvas, 'touchstart').subscribe(e => { this.onMouseDown(e); });
            (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.fromEvent)(this.canvas, 'touchend').subscribe(e => { this.onMouseUp(e); });
            (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.fromEvent)(this.canvas, 'touchmove').subscribe(e => { this.onCursorDrag(e); });
        }
        else {
            (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.fromEvent)(this.canvas, 'mousedown').subscribe(e => { this.onMouseDown(e); });
            (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.fromEvent)(this.canvas, 'mouseup').subscribe(e => { this.onMouseUp(e); });
            (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.fromEvent)(this.canvas, 'mousemove').subscribe(e => { this.onCursorDrag(e); });
        }
    }
    navigateTo(value) {
        /*
        the select value comes as an 'index: value' pair, so we split the string into '['index:', 'value']', so the true value is now separated and we can access it
        */
        if (value) {
            value = value.target.value.split(' ');
            this.router.navigate([`/schemes/${value[1]}`]).then(() => {
                window.location.reload();
            });
        }
        return false;
    }
    onMouseDown(event) {
        /*
        if user clicked on any cursor, update the lastActive with cursor's index, else don't update the lastActive field
        */
        let evt, mouseX, mouseY;
        if (this.isMobile) {
            evt = event;
            mouseX = evt.targetTouches[0].clientX;
            mouseY = evt.targetTouches[0].clientY;
        }
        else {
            evt = event;
            mouseX = evt.clientX;
            mouseY = evt.clientY;
        }
        let size = this.canvas.width;
        mouseX -= this.canvas.offsetLeft + size / 2;
        mouseY = size / 2 - mouseY + this.canvas.offsetTop;
        let inRange = (center, radius, point) => center - radius < point && point < center + radius;
        for (let i = 0; i < this.scheme.cursors.length; i++) {
            let cursor = this.scheme.cursors[i];
            if (inRange(cursor.x, cursor.radius, mouseX) && inRange(cursor.y, cursor.radius, mouseY)) {
                this.scheme.lastActive = i;
                break;
            }
        }
        this.mouseIsDown = true;
    }
    onMouseUp(event) {
        this.mouseIsDown = false;
    }
    onCursorDrag(event) {
        if (!this.mouseIsDown) {
            return;
        }
        let evt, mouseX, mouseY;
        if (this.isMobile) {
            evt = event;
            mouseX = evt.targetTouches[0].clientX;
            mouseY = evt.targetTouches[0].clientY;
        }
        else {
            evt = event;
            mouseX = evt.clientX;
            mouseY = evt.clientY;
        }
        let size = this.canvas.width;
        mouseX -= this.canvas.offsetLeft + size / 2;
        mouseY = size / 2 - mouseY + this.canvas.offsetTop;
        let ctx = this.canvas.getContext('2d');
        let cursor = this.scheme.cursors[this.scheme.lastActive];
        //cursor can't go beyond the wheel, we handling it using Pythagoras's theorem
        if (Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2)) <= size / 2) {
            cursor.x = mouseX;
            cursor.y = mouseY;
            this.scheme.update();
            //as the cursors aren't independent we need to redraw every one. The dependencies are in the scheme.ts file
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvasService.drawAllCursors(this.scheme.cursors);
            this.schemeService.saveCoords(this.picked_scheme, this.scheme.cursors[0]);
        }
    }
    getCursorsInfo() {
        //get label and color of the cursor. For details of the composition, consider using the website
        let container = document.getElementById('cursor_values');
        let info = [];
        let cursors = this.scheme.cursors;
        if (cursors.length == 1) {
            //line
            container.style.gridTemplateColumns = 'auto '.repeat(7);
            let color = cursors[0].color;
            //the hue and saturation remain unchanged
            let H = color.hsl.a.value;
            let S = color.hsl.b.value;
            if (this.isMobile) {
                info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('95%', new _Color__WEBPACK_IMPORTED_MODULE_1__.Color(new _Model__WEBPACK_IMPORTED_MODULE_2__.HSL(H, S, 95))));
                info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('75%', new _Color__WEBPACK_IMPORTED_MODULE_1__.Color(new _Model__WEBPACK_IMPORTED_MODULE_2__.HSL(H, S, 75))));
                info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('50%', new _Color__WEBPACK_IMPORTED_MODULE_1__.Color(new _Model__WEBPACK_IMPORTED_MODULE_2__.HSL(H, S, 50))));
            }
            else {
                for (let l = 90; l >= 50; l -= 10) {
                    info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo(l + '%', new _Color__WEBPACK_IMPORTED_MODULE_1__.Color(new _Model__WEBPACK_IMPORTED_MODULE_2__.HSL(H, S, l))));
                }
            }
            info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('', new _Color__WEBPACK_IMPORTED_MODULE_1__.Color(new _Model__WEBPACK_IMPORTED_MODULE_2__.HSL(0, 0, 96)))); //background-color, simulate space between gradient and picked color
            info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('1', color));
        }
        else if (cursors.length == 2) {
            //line
            container.style.gridTemplateColumns = 'auto '.repeat(5);
            let mixed = cursors[0].color.operate(src_app_Equation__WEBPACK_IMPORTED_MODULE_0__.Sign.Mix, cursors[1].color);
            info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('1', cursors[0]));
            if (this.isMobile) {
                info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('1 & 1.2', mixed, cursors[0]));
                info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('1 & 2', mixed));
                info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('1.2 & 2', mixed, cursors[1]));
            }
            else {
                info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('1 & 1 & 2', mixed, cursors[0]));
                info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('1 & 2', mixed));
                info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('1 & 2 & 2', mixed, cursors[1]));
            }
            info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo('2', cursors[1]));
        }
        else {
            //triangle and rectangle
            let matrix = cursors.length == 3 ? [12, 2, 23, 1, 13, 3] : [1, 12, 2, 13, 14, 24, 3, 34, 4];
            for (let el of matrix) {
                if (el > 10) {
                    let scnd = el % 10;
                    let frst = (el - scnd) / 10;
                    info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo(`${frst} & ${scnd}`, cursors[frst - 1], cursors[scnd - 1]));
                }
                else {
                    info.push(new _services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.CursorInfo(`${el}`, cursors[el - 1]));
                }
            }
        }
        return info;
    }
}
SchemesComponent.ɵfac = function SchemesComponent_Factory(t) { return new (t || SchemesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_services_schemes_scheme_service__WEBPACK_IMPORTED_MODULE_3__.SchemeService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_services_canvas_canvas_service__WEBPACK_IMPORTED_MODULE_4__.CanvasService)); };
SchemesComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({ type: SchemesComponent, selectors: [["app-schemes"]], decls: 13, vars: 5, consts: [[1, "box", "whitesmoke"], ["id", "schemes_header", 1, "d-flex", "justify-content-between"], ["id", "schemes_title"], ["id", "schemes_options", 1, "whitesmoke", "transition", "underlined", 3, "ngModel", "change", "ngModelChange"], ["class", "whitesmoke schemes_option", 3, "ngValue", 4, "ngFor", "ngForOf"], ["id", "scheme", 1, "d-flex", "justify-content-between", "align-items-center"], ["id", "canvas_container"], ["id", "scheme_info", 1, "d-flex", "flex-column", "justify-content-between"], ["id", "description"], ["id", "cursor_values"], ["class", "d-flex justify-content-center align-items-center cursor-value", 3, "ngStyle", "click", 4, "ngFor", "ngForOf"], [1, "whitesmoke", "schemes_option", 3, "ngValue"], [1, "d-flex", "justify-content-center", "align-items-center", "cursor-value", 3, "ngStyle", "click"], [4, "ngIf", "ngIfThen", "ngIfElse"], ["Color", ""], ["Id", ""]], template: function SchemesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "select", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("change", function SchemesComponent_Template_select_change_4_listener($event) { return ctx.navigateTo($event); })("ngModelChange", function SchemesComponent_Template_select_ngModelChange_4_listener($event) { return ctx.picked_scheme = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](5, SchemesComponent_option_5_Template, 2, 2, "option", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "div", 7)(9, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](11, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](12, SchemesComponent_div_12_Template, 6, 6, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", ctx.scheme.constructor.name, " Scheme");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngModel", ctx.picked_scheme);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx.schemes);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ctx.scheme.description, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx.getCursorsInfo());
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_8__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgModel, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵNgSelectMultipleOption"], _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgStyle, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf], styles: ["#schemes_header[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n  height: auto;\r\n}\r\n\r\n#schemes_title[_ngcontent-%COMP%] {\r\n  font-size: 24px;\r\n}\r\n\r\n#schemes_options[_ngcontent-%COMP%] {\r\n  width: 12vw;\r\n  font-size: 24px;\r\n  padding: 1vh 0.25vw;\r\n}\r\n\r\n.schemes_option[_ngcontent-%COMP%] {\r\n  font-size: 20px;\r\n  color: black;\r\n}\r\n\r\n#scheme[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n  margin-top: 5vh;\r\n}\r\n\r\n#scheme_info[_ngcontent-%COMP%] {\r\n  margin-left: 10vh;\r\n  width: 50vw;\r\n  font-size: 24px;\r\n}\r\n\r\n#cursor_values[_ngcontent-%COMP%] {\r\n  display: grid;\r\n  grid-template-columns: auto auto auto;\r\n  justify-content: start;\r\n  align-content: center;\r\n}\r\n\r\n.cursor-value[_ngcontent-%COMP%] {\r\n  width: 7.5vw;\r\n  height: 7.5vw;\r\n}\r\n\r\n.cursor-value[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  font-size: 20px;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #schemes[_ngcontent-%COMP%] {\r\n    margin: 0;\r\n  }\r\n\r\n  #schemes_header[_ngcontent-%COMP%] {\r\n    flex-direction: column;\r\n    width: 90vw;\r\n  }\r\n\r\n  #schemes_title[_ngcontent-%COMP%] {\r\n    font-size: 24px;\r\n  }\r\n\r\n  #schemes_options[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    font-size: 20px;\r\n  }\r\n\r\n  #scheme[_ngcontent-%COMP%] {\r\n    flex-direction: column;\r\n    width: 90vw;\r\n  }\r\n\r\n  #canvas_container[_ngcontent-%COMP%] {\r\n    touch-action: none;\r\n  }\r\n\r\n  #scheme_info[_ngcontent-%COMP%] {\r\n    flex-direction: column-reverse;\r\n    align-items: center;\r\n    margin-left: 0;\r\n    width: 90vw;\r\n  }\r\n\r\n  #cursor_values[_ngcontent-%COMP%] {\r\n    margin: 3vh 0;\r\n  }\r\n\r\n  .cursor-value[_ngcontent-%COMP%] {\r\n    width: 17.5vw;\r\n    height: 17.5vw;\r\n  }\r\n\r\n  .cursor-value[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n    font-size: 16px;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtZXMuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQVc7RUFDWCxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsV0FBVztFQUNYLGVBQWU7RUFDZixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsWUFBWTtBQUNkOztBQUVBO0VBQ0UsV0FBVztFQUNYLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsV0FBVztFQUNYLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IscUNBQXFDO0VBQ3JDLHNCQUFzQjtFQUN0QixxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osYUFBYTtBQUNmOztBQUVBO0VBQ0UsZUFBZTtBQUNqQjs7QUFFQTtFQUNFO0lBQ0UsU0FBUztFQUNYOztFQUVBO0lBQ0Usc0JBQXNCO0lBQ3RCLFdBQVc7RUFDYjs7RUFFQTtJQUNFLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxXQUFXO0lBQ1gsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLHNCQUFzQjtJQUN0QixXQUFXO0VBQ2I7O0VBRUE7SUFDRSxrQkFBa0I7RUFDcEI7O0VBRUE7SUFDRSw4QkFBOEI7SUFDOUIsbUJBQW1CO0lBQ25CLGNBQWM7SUFDZCxXQUFXO0VBQ2I7O0VBRUE7SUFDRSxhQUFhO0VBQ2Y7O0VBRUE7SUFDRSxhQUFhO0lBQ2IsY0FBYztFQUNoQjs7RUFFQTtJQUNFLGVBQWU7RUFDakI7QUFDRiIsImZpbGUiOiJzY2hlbWVzLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjc2NoZW1lc19oZWFkZXIge1xyXG4gIHdpZHRoOiA4NXZ3O1xyXG4gIGhlaWdodDogYXV0bztcclxufVxyXG5cclxuI3NjaGVtZXNfdGl0bGUge1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxufVxyXG5cclxuI3NjaGVtZXNfb3B0aW9ucyB7XHJcbiAgd2lkdGg6IDEydnc7XHJcbiAgZm9udC1zaXplOiAyNHB4O1xyXG4gIHBhZGRpbmc6IDF2aCAwLjI1dnc7XHJcbn1cclxuXHJcbi5zY2hlbWVzX29wdGlvbiB7XHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG4gIGNvbG9yOiBibGFjaztcclxufVxyXG5cclxuI3NjaGVtZSB7XHJcbiAgd2lkdGg6IDg1dnc7XHJcbiAgbWFyZ2luLXRvcDogNXZoO1xyXG59XHJcblxyXG4jc2NoZW1lX2luZm8ge1xyXG4gIG1hcmdpbi1sZWZ0OiAxMHZoO1xyXG4gIHdpZHRoOiA1MHZ3O1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxufVxyXG5cclxuI2N1cnNvcl92YWx1ZXMge1xyXG4gIGRpc3BsYXk6IGdyaWQ7XHJcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIGF1dG8gYXV0bztcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xyXG4gIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcclxufVxyXG5cclxuLmN1cnNvci12YWx1ZSB7XHJcbiAgd2lkdGg6IDcuNXZ3O1xyXG4gIGhlaWdodDogNy41dnc7XHJcbn1cclxuXHJcbi5jdXJzb3ItdmFsdWUgc3BhbiB7XHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG59XHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA2MDBweCkge1xyXG4gICNzY2hlbWVzIHtcclxuICAgIG1hcmdpbjogMDtcclxuICB9XHJcblxyXG4gICNzY2hlbWVzX2hlYWRlciB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgd2lkdGg6IDkwdnc7XHJcbiAgfVxyXG5cclxuICAjc2NoZW1lc190aXRsZSB7XHJcbiAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgfVxyXG5cclxuICAjc2NoZW1lc19vcHRpb25zIHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gIH1cclxuXHJcbiAgI3NjaGVtZSB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgd2lkdGg6IDkwdnc7XHJcbiAgfVxyXG5cclxuICAjY2FudmFzX2NvbnRhaW5lciB7XHJcbiAgICB0b3VjaC1hY3Rpb246IG5vbmU7XHJcbiAgfVxyXG5cclxuICAjc2NoZW1lX2luZm8ge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbi1yZXZlcnNlO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIG1hcmdpbi1sZWZ0OiAwO1xyXG4gICAgd2lkdGg6IDkwdnc7XHJcbiAgfVxyXG5cclxuICAjY3Vyc29yX3ZhbHVlcyB7XHJcbiAgICBtYXJnaW46IDN2aCAwO1xyXG4gIH1cclxuXHJcbiAgLmN1cnNvci12YWx1ZSB7XHJcbiAgICB3aWR0aDogMTcuNXZ3O1xyXG4gICAgaGVpZ2h0OiAxNy41dnc7XHJcbiAgfVxyXG5cclxuICAuY3Vyc29yLXZhbHVlIHNwYW4ge1xyXG4gICAgZm9udC1zaXplOiAxNnB4O1xyXG4gIH1cclxufVxyXG4iXX0= */"] });


/***/ }),

/***/ 5938:
/*!****************************************************************!*\
  !*** ./src/app/components/trends/decades/decades.component.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DecadesComponent": () => (/* binding */ DecadesComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 2816);
/* harmony import */ var _services_trends_trends_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/trends/trends.service */ 8876);
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-cookie-service */ 3694);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 587);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 6362);
/* harmony import */ var _image_image_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../image/image.component */ 5113);







function DecadesComponent_option_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "option", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const decade_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngValue", decade_r3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", decade_r3, " ");
} }
function DecadesComponent_div_13_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div")(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "i", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function DecadesComponent_div_13_div_2_Template_i_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r8); const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r7.hide(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Read More");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "br")(6, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, "Photos took from ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "here");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", ctx_r4.decade.shortDesc, "... ");
} }
function DecadesComponent_div_13_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div")(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "br")(4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Photos took from ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, "here");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r5.decade.description);
} }
const _c0 = function (a0, a1, a2) { return { "color": a0, "background-color": a1, "display": a2 }; };
const _c1 = function (a0) { return { "display": a0 }; };
function DecadesComponent_div_13_div_7_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mouseover", function DecadesComponent_div_13_div_7_Template_div_mouseover_0_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12); const i_r10 = restoredCtx.index; const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r11.show(i_r10); })("mouseout", function DecadesComponent_div_13_div_7_Template_div_mouseout_0_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12); const i_r10 = restoredCtx.index; const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2); return ctx_r13.hide(i_r10); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 21)(2, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
} if (rf & 2) {
    const color_r9 = ctx.$implicit;
    const i_r10 = ctx.index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction3"](4, _c0, color_r9.getShade(), color_r9.hex.toString(), ctx_r6.colorsShowed ? "flex" : "none"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r6.decade.names[i_r10]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](color_r9.hex.toString());
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](8, _c1, ctx_r6.colorsShowed ? "block" : "none"));
} }
function DecadesComponent_div_13_Template(rf, ctx) { if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 11)(1, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, DecadesComponent_div_13_div_2_Template, 12, 1, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, DecadesComponent_div_13_div_3_Template, 10, 1, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 14)(5, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function DecadesComponent_div_13_Template_div_click_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r15); const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](); return ctx_r14.show(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, DecadesComponent_div_13_div_7_Template, 7, 10, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.colorsShowed);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.colorsShowed);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassMapInterpolate1"]("transition ", ctx_r1.colorsShowed ? "text-hidden" : "text-showen", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassMapInterpolate1"]("transition ", ctx_r1.colorsShowed ? "colors-showen" : "colors-hidden", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.decade.colors);
} }
const _c2 = function (a0, a1) { return { "color": a0, "background-color": a1 }; };
function DecadesComponent_div_14_div_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 25)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const color_r17 = ctx.$implicit;
    const i_r18 = ctx.index;
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](3, _c2, color_r17.getShade(), color_r17.hex.toString()));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r16.decade.names[i_r18]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](color_r17.hex.toString());
} }
function DecadesComponent_div_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 11)(1, "div", 12)(2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "br")(5, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Photos took from ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "here");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](12, DecadesComponent_div_14_div_12_Template, 5, 6, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r2.decade.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r2.decade.colors);
} }
const _c3 = function () { return { width: "30vw" }; };
class DecadesComponent {
    constructor(router, route, trends, cookies) {
        this.router = router;
        this.route = route;
        this.trends = trends;
        this.cookies = cookies;
        this.decades = [];
        let decade = this.route.snapshot.paramMap.get('decade');
        this.decade = this.trends.getDecadePallete(decade);
        for (let i = 1920; i <= 2010; i += 10) {
            this.decades.push(i.toString());
        }
        this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
    }
    ngOnInit() {
        let colors = document.getElementsByClassName('color');
        this.colors = colors;
        this.colorsShowed = this.cookies.get('showen') == 'true';
    }
    navigateTo(value) {
        /*
        the select value comes as an 'index: value' pair, so we split the string into '['index:', 'value']', so the true value is now separated and we can access it
        */
        if (value) {
            value = value.target.value.split(' ');
            this.router.navigate([`/trends/decades/${value[1]}`]).then(() => {
                window.location.reload();
            });
        }
        return false;
    }
    closeColors() {
        this.colorsShowed = false;
    }
    show(index) {
        if (index == undefined) {
            this.colorsShowed = true;
            this.cookies.set('showen', 'true', { path: '/' });
            return;
        }
        index = index;
        let barInfo = this.colors[index].children[0].children;
        for (let i = 0; i < barInfo.length; i++) {
            let text = barInfo[i];
            text.classList.remove('text-hidden');
            text.classList.add('text-showen');
        }
        let bar = this.colors[index].children[1];
        bar.classList.remove('shade-hidden');
        bar.classList.add('shade-showen');
    }
    hide(index) {
        if (index == undefined) {
            this.colorsShowed = false;
            this.cookies.set('showen', 'false', { path: '/' });
            return;
        }
        index = index;
        let barInfo = this.colors[index].children[0].children;
        for (let i = 0; i < barInfo.length; i++) {
            let text = barInfo[i];
            text.classList.remove('text-showen');
            text.classList.add('text-hidden');
        }
        let bar = this.colors[index].children[1];
        bar.classList.remove('shade-showen');
        bar.classList.add('shade-hidden');
    }
}
DecadesComponent.ɵfac = function DecadesComponent_Factory(t) { return new (t || DecadesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_trends_trends_service__WEBPACK_IMPORTED_MODULE_0__.TrendsService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](ngx_cookie_service__WEBPACK_IMPORTED_MODULE_4__.CookieService)); };
DecadesComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: DecadesComponent, selectors: [["app-decades"]], decls: 16, vars: 9, consts: [[1, "box", "whitesmoke"], ["id", "decades_header", 1, "d-flex", "justify-content-between", "align-items-center"], ["id", "decades_title"], ["id", "years_link"], ["routerLink", "/trends/years", 1, "transition"], ["id", "decades_links", 1, "underlined", "whitesmoke", "transition", 3, "ngModel", "change", "ngModelChange"], ["class", "whitesmoke underlined decades_link", 3, "ngValue", 4, "ngFor", "ngForOf"], ["id", "decades_content"], ["id", "decade_content", 4, "ngIf"], ["widthSmall", "90vw", 3, "src", "alt"], [1, "whitesmoke", "underlined", "decades_link", 3, "ngValue"], ["id", "decade_content"], ["id", "decade_description"], [4, "ngIf"], ["id", "decade_colors"], ["id", "arrow", 3, "click"], ["id", "decade_color_container"], ["class", "color", 3, "mouseover", "mouseout", 4, "ngFor", "ngForOf"], [3, "click"], ["href", "https://juiceboxinteractive.com/blog/color/", "target", "_blank"], [1, "color", 3, "mouseover", "mouseout"], [1, "transition", "color-value", 3, "ngStyle"], [1, "text-hidden"], [1, "transition", "color-shade", "shade-hidden", 3, "ngStyle"], ["class", "color", 3, "ngStyle", 4, "ngFor", "ngForOf"], [1, "color", 3, "ngStyle"]], template: function DecadesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Trends through the decades");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, " See also: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "Trends through years");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "select", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function DecadesComponent_Template_select_change_10_listener($event) { return ctx.navigateTo($event); })("ngModelChange", function DecadesComponent_Template_select_ngModelChange_10_listener($event) { return ctx.decade.decade = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](11, DecadesComponent_option_11_Template, 2, 2, "option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, DecadesComponent_div_13_Template, 8, 9, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](14, DecadesComponent_div_14_Template, 13, 2, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](15, "app-image", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.decade.decade);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.decades);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.isMobile);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isMobile);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](8, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpropertyInterpolate1"]("src", "assets/", ctx.decade.decade, "_trends.jpg")("alt", "", ctx.decade.decade, " trends");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgSelectMultipleOption"], _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgStyle, _image_image_component__WEBPACK_IMPORTED_MODULE_1__.ImageComponent], styles: ["#decades_header[_ngcontent-%COMP%] {\r\n  width: 85vw;\r\n  height: auto;\r\n  font-size: 28px;\r\n}\r\n\r\n#years_link[_ngcontent-%COMP%] {\r\n  font-size: 24px;\r\n}\r\n\r\n#years_link[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:hover {\r\n  cursor: pointer;\r\n  color: var(--bs-primary);\r\n}\r\n\r\n#decades_links[_ngcontent-%COMP%] {\r\n  width: 12vw;\r\n  font-size: 24px;\r\n  padding-bottom: 0.5vh;\r\n}\r\n\r\n.decades_link[_ngcontent-%COMP%] {\r\n  font-size: 20px;\r\n  color: black;\r\n}\r\n\r\n#decades_content[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  flex-direction: row-reverse;\r\n  width: 85vw;\r\n  margin-top: 5vh;\r\n  font-size: 24px;\r\n}\r\n\r\n#decade_content[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-self: flex-start;\r\n  text-align: left;\r\n  justify-content: space-between;\r\n  width: 50vw;\r\n}\r\n\r\n#decade_content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n  white-space: pre-line;\r\n}\r\n\r\n#decade_colors[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  align-items: center;\r\n  width: 50vw;\r\n}\r\n\r\n#decade_color_container[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  align-self: flex-end;\r\n  flex-direction: row;\r\n  text-align: center;\r\n  width: 50vw;\r\n}\r\n\r\n.colors-showen[_ngcontent-%COMP%] {\r\n  height: 50vh;\r\n}\r\n\r\n.colors-hidden[_ngcontent-%COMP%] {\r\n  height: 0vh;\r\n}\r\n\r\n#arrow[_ngcontent-%COMP%] {\r\n  border: solid var(--bs-primary);\r\n  border-width: 0 0.5vw 0.5vw 0;\r\n  display: inline-block;\r\n  padding: 0.5vw;\r\n  transform: rotate(-135deg);\r\n  -webkit-transform: rotate(-135deg);\r\n}\r\n\r\n#arrow[_ngcontent-%COMP%]:hover {\r\n  border: solid #0a58ca;\r\n  border-width: 0 0.5vw 0.5vw 0;\r\n  cursor: pointer;\r\n}\r\n\r\n.color[_ngcontent-%COMP%] {\r\n  width: calc(50vw / 6);\r\n  height: inherit;\r\n}\r\n\r\n.color-value[_ngcontent-%COMP%] {\r\n  position: absolute;\r\n  flex-direction: column;\r\n  justify-content: flex-end;\r\n  padding: 5vh 0;\r\n  text-align: center;\r\n  width: inherit;\r\n  height: inherit;\r\n  font-size: 20px;\r\n}\r\n\r\n.text-showen[_ngcontent-%COMP%] {\r\n  opacity: 1;\r\n}\r\n\r\n.text-hidden[_ngcontent-%COMP%] {\r\n  opacity: 0;\r\n}\r\n\r\n.color-shade[_ngcontent-%COMP%] {\r\n  z-index: 1;\r\n  position: absolute;\r\n  filter: opacity(0.1);\r\n  background-color: rgba(255, 255, 255);\r\n  width: inherit;\r\n}\r\n\r\n.shade-showen[_ngcontent-%COMP%] {\r\n  height: 0vh;\r\n}\r\n\r\n.shade-hidden[_ngcontent-%COMP%] {\r\n  height: 50vh;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #decades[_ngcontent-%COMP%] {\r\n    margin: 0;\r\n  }\r\n\r\n  #decades_header[_ngcontent-%COMP%] {\r\n    flex-direction: column;\r\n    width: 90vw;\r\n    font-size: 24px;\r\n  }\r\n\r\n  #decades_title[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n  }\r\n\r\n  #years_link[_ngcontent-%COMP%] {\r\n    margin: 2vh 0;\r\n    font-size: 22px;\r\n  }\r\n\r\n  #years_link[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n    color: var(--bs-primary);\r\n    font-size: 22px;\r\n  }\r\n\r\n  #decades_links[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    font-size: 20px;\r\n    padding-bottom: 0.5vh;\r\n  }\r\n\r\n  #decades_content[_ngcontent-%COMP%] {\r\n    flex-direction: column;\r\n    align-items: center;\r\n    width: 90vw;\r\n    margin-top: 3vh;\r\n    font-size: 20px;\r\n  }\r\n\r\n  #decade_content[_ngcontent-%COMP%] {\r\n    text-align: justify;\r\n    width: 90vw;\r\n  }\r\n\r\n  #decade_description[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\r\n    color: var(--bs-primary);\r\n    text-decoration: none;\r\n  }\r\n\r\n  #decade_colors[_ngcontent-%COMP%] {\r\n    flex-flow: row wrap;\r\n    justify-content: center;\r\n    width: 90vw;\r\n    margin: 5vh 0;\r\n    gap: 2.5vh;\r\n  }\r\n\r\n  .color[_ngcontent-%COMP%] {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n    text-align: center;\r\n    word-wrap: break-word;\r\n    width: 40vw;\r\n    height: 40vw;\r\n    padding: 5vw;\r\n    border-radius: 5%;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY2FkZXMuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQVc7RUFDWCxZQUFZO0VBQ1osZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsV0FBVztFQUNYLGVBQWU7RUFDZixxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsWUFBWTtBQUNkOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDhCQUE4QjtFQUM5QiwyQkFBMkI7RUFDM0IsV0FBVztFQUNYLGVBQWU7RUFDZixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qix3QkFBd0I7RUFDeEIsZ0JBQWdCO0VBQ2hCLDhCQUE4QjtFQUM5QixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsV0FBVztBQUNiOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG9CQUFvQjtFQUNwQixtQkFBbUI7RUFDbkIsa0JBQWtCO0VBQ2xCLFdBQVc7QUFDYjs7QUFFQTtFQUNFLFlBQVk7QUFDZDs7QUFFQTtFQUNFLFdBQVc7QUFDYjs7QUFFQTtFQUNFLCtCQUErQjtFQUMvQiw2QkFBNkI7RUFDN0IscUJBQXFCO0VBQ3JCLGNBQWM7RUFDZCwwQkFBMEI7RUFDMUIsa0NBQWtDO0FBQ3BDOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLDZCQUE2QjtFQUM3QixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsc0JBQXNCO0VBQ3RCLHlCQUF5QjtFQUN6QixjQUFjO0VBQ2Qsa0JBQWtCO0VBQ2xCLGNBQWM7RUFDZCxlQUFlO0VBQ2YsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLFVBQVU7QUFDWjs7QUFFQTtFQUNFLFVBQVU7QUFDWjs7QUFFQTtFQUNFLFVBQVU7RUFDVixrQkFBa0I7RUFDbEIsb0JBQW9CO0VBQ3BCLHFDQUFxQztFQUNyQyxjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBO0VBQ0UsWUFBWTtBQUNkOztBQUVBO0VBQ0U7SUFDRSxTQUFTO0VBQ1g7O0VBRUE7SUFDRSxzQkFBc0I7SUFDdEIsV0FBVztJQUNYLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxXQUFXO0VBQ2I7O0VBRUE7SUFDRSxhQUFhO0lBQ2IsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLHdCQUF3QjtJQUN4QixlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsV0FBVztJQUNYLGVBQWU7SUFDZixxQkFBcUI7RUFDdkI7O0VBRUE7SUFDRSxzQkFBc0I7SUFDdEIsbUJBQW1CO0lBQ25CLFdBQVc7SUFDWCxlQUFlO0lBQ2YsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLG1CQUFtQjtJQUNuQixXQUFXO0VBQ2I7O0VBRUE7SUFDRSx3QkFBd0I7SUFDeEIscUJBQXFCO0VBQ3ZCOztFQUVBO0lBQ0UsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixXQUFXO0lBQ1gsYUFBYTtJQUNiLFVBQVU7RUFDWjs7RUFFQTtJQUNFLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIscUJBQXFCO0lBQ3JCLFdBQVc7SUFDWCxZQUFZO0lBQ1osWUFBWTtJQUNaLGlCQUFpQjtFQUNuQjtBQUNGIiwiZmlsZSI6ImRlY2FkZXMuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNkZWNhZGVzX2hlYWRlciB7XHJcbiAgd2lkdGg6IDg1dnc7XHJcbiAgaGVpZ2h0OiBhdXRvO1xyXG4gIGZvbnQtc2l6ZTogMjhweDtcclxufVxyXG5cclxuI3llYXJzX2xpbmsge1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxufVxyXG5cclxuI3llYXJzX2xpbmsgc3Bhbjpob3ZlciB7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIGNvbG9yOiB2YXIoLS1icy1wcmltYXJ5KTtcclxufVxyXG5cclxuI2RlY2FkZXNfbGlua3Mge1xyXG4gIHdpZHRoOiAxMnZ3O1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxuICBwYWRkaW5nLWJvdHRvbTogMC41dmg7XHJcbn1cclxuXHJcbi5kZWNhZGVzX2xpbmsge1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxuICBjb2xvcjogYmxhY2s7XHJcbn1cclxuXHJcbiNkZWNhZGVzX2NvbnRlbnQge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcclxuICB3aWR0aDogODV2dztcclxuICBtYXJnaW4tdG9wOiA1dmg7XHJcbiAgZm9udC1zaXplOiAyNHB4O1xyXG59XHJcblxyXG4jZGVjYWRlX2NvbnRlbnQge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBqdXN0aWZ5LXNlbGY6IGZsZXgtc3RhcnQ7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgd2lkdGg6IDUwdnc7XHJcbn1cclxuXHJcbiNkZWNhZGVfY29udGVudCBzcGFuIHtcclxuICB3aGl0ZS1zcGFjZTogcHJlLWxpbmU7XHJcbn1cclxuXHJcbiNkZWNhZGVfY29sb3JzIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB3aWR0aDogNTB2dztcclxufVxyXG5cclxuI2RlY2FkZV9jb2xvcl9jb250YWluZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgd2lkdGg6IDUwdnc7XHJcbn1cclxuXHJcbi5jb2xvcnMtc2hvd2VuIHtcclxuICBoZWlnaHQ6IDUwdmg7XHJcbn1cclxuXHJcbi5jb2xvcnMtaGlkZGVuIHtcclxuICBoZWlnaHQ6IDB2aDtcclxufVxyXG5cclxuI2Fycm93IHtcclxuICBib3JkZXI6IHNvbGlkIHZhcigtLWJzLXByaW1hcnkpO1xyXG4gIGJvcmRlci13aWR0aDogMCAwLjV2dyAwLjV2dyAwO1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICBwYWRkaW5nOiAwLjV2dztcclxuICB0cmFuc2Zvcm06IHJvdGF0ZSgtMTM1ZGVnKTtcclxuICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKC0xMzVkZWcpO1xyXG59XHJcblxyXG4jYXJyb3c6aG92ZXIge1xyXG4gIGJvcmRlcjogc29saWQgIzBhNThjYTtcclxuICBib3JkZXItd2lkdGg6IDAgMC41dncgMC41dncgMDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5jb2xvciB7XHJcbiAgd2lkdGg6IGNhbGMoNTB2dyAvIDYpO1xyXG4gIGhlaWdodDogaW5oZXJpdDtcclxufVxyXG5cclxuLmNvbG9yLXZhbHVlIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xyXG4gIHBhZGRpbmc6IDV2aCAwO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB3aWR0aDogaW5oZXJpdDtcclxuICBoZWlnaHQ6IGluaGVyaXQ7XHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG59XHJcblxyXG4udGV4dC1zaG93ZW4ge1xyXG4gIG9wYWNpdHk6IDE7XHJcbn1cclxuXHJcbi50ZXh0LWhpZGRlbiB7XHJcbiAgb3BhY2l0eTogMDtcclxufVxyXG5cclxuLmNvbG9yLXNoYWRlIHtcclxuICB6LWluZGV4OiAxO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBmaWx0ZXI6IG9wYWNpdHkoMC4xKTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUpO1xyXG4gIHdpZHRoOiBpbmhlcml0O1xyXG59XHJcblxyXG4uc2hhZGUtc2hvd2VuIHtcclxuICBoZWlnaHQ6IDB2aDtcclxufVxyXG5cclxuLnNoYWRlLWhpZGRlbiB7XHJcbiAgaGVpZ2h0OiA1MHZoO1xyXG59XHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA2MDBweCkge1xyXG4gICNkZWNhZGVzIHtcclxuICAgIG1hcmdpbjogMDtcclxuICB9XHJcblxyXG4gICNkZWNhZGVzX2hlYWRlciB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgd2lkdGg6IDkwdnc7XHJcbiAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgfVxyXG5cclxuICAjZGVjYWRlc190aXRsZSB7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICB9XHJcblxyXG4gICN5ZWFyc19saW5rIHtcclxuICAgIG1hcmdpbjogMnZoIDA7XHJcbiAgICBmb250LXNpemU6IDIycHg7XHJcbiAgfVxyXG5cclxuICAjeWVhcnNfbGluayBzcGFuIHtcclxuICAgIGNvbG9yOiB2YXIoLS1icy1wcmltYXJ5KTtcclxuICAgIGZvbnQtc2l6ZTogMjJweDtcclxuICB9XHJcblxyXG4gICNkZWNhZGVzX2xpbmtzIHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgcGFkZGluZy1ib3R0b206IDAuNXZoO1xyXG4gIH1cclxuXHJcbiAgI2RlY2FkZXNfY29udGVudCB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gICAgbWFyZ2luLXRvcDogM3ZoO1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gIH1cclxuXHJcbiAgI2RlY2FkZV9jb250ZW50IHtcclxuICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICB9XHJcblxyXG4gICNkZWNhZGVfZGVzY3JpcHRpb24gYSB7XHJcbiAgICBjb2xvcjogdmFyKC0tYnMtcHJpbWFyeSk7XHJcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgfVxyXG5cclxuICAjZGVjYWRlX2NvbG9ycyB7XHJcbiAgICBmbGV4LWZsb3c6IHJvdyB3cmFwO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICAgIG1hcmdpbjogNXZoIDA7XHJcbiAgICBnYXA6IDIuNXZoO1xyXG4gIH1cclxuXHJcbiAgLmNvbG9yIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgd29yZC13cmFwOiBicmVhay13b3JkO1xyXG4gICAgd2lkdGg6IDQwdnc7XHJcbiAgICBoZWlnaHQ6IDQwdnc7XHJcbiAgICBwYWRkaW5nOiA1dnc7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1JTtcclxuICB9XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 6905:
/*!************************************************************!*\
  !*** ./src/app/components/trends/years/years.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "YearsComponent": () => (/* binding */ YearsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _services_trends_trends_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../services/trends/trends.service */ 8876);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 2816);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 6362);




const _c0 = function (a0) { return { "color": a0 }; };
function YearsComponent_div_13_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 13)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const year_color_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](4, _c0, year_color_r2.color.getShade()));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](year_color_r2.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](year_color_r2.year);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Code: ", year_color_r2.pantone, "");
} }
function YearsComponent_div_13_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 13)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const year_color_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](2, _c0, year_color_r2.color.getShade()));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](year_color_r2.name);
} }
const _c1 = function (a0) { return { "background-color": a0 }; };
function YearsComponent_div_13_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 10)(1, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("mouseover", function YearsComponent_div_13_Template_div_mouseover_1_listener() { const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r8); const year_color_r2 = restoredCtx.$implicit; const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r7.choosed_color = year_color_r2; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, YearsComponent_div_13_div_2_Template, 9, 6, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, YearsComponent_div_13_div_3_Template, 4, 4, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const year_color_r2 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](3, _c1, year_color_r2.color.hex.toString()));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.isMobile);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r0.isMobile);
} }
function YearsComponent_div_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 14)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Pantone: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "i");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Name: ", ctx_r1.choosed_color.name, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Hex: ", ctx_r1.choosed_color.color.hex.toString(), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("HSL: hsl(", ctx_r1.choosed_color.color.hsl.toString(), ")");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r1.choosed_color.pantone);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Year: ", ctx_r1.choosed_color.year, "");
} }
class YearsComponent {
    constructor(trends) {
        this.trends = trends;
        this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
        this.colors = this.trends.getYearColors();
        this.choosed_color = this.colors[0];
    }
    ngOnInit() {
    }
}
YearsComponent.ɵfac = function YearsComponent_Factory(t) { return new (t || YearsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_trends_trends_service__WEBPACK_IMPORTED_MODULE_0__.TrendsService)); };
YearsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: YearsComponent, selectors: [["app-years"]], decls: 15, vars: 2, consts: [[1, "box", "whitesmoke"], ["id", "years_header"], ["id", "years_title"], ["id", "decades_link"], ["routerLink", "/trends/decades/2010", 1, "transition"], ["id", "years_body"], ["id", "years_content"], ["id", "years_colors"], ["class", "color-container", 4, "ngFor", "ngForOf"], ["id", "choosed_color", 4, "ngIf"], [1, "color-container"], [1, "color", 3, "ngStyle", "mouseover"], ["class", "color-info", 3, "ngStyle", 4, "ngIf"], [1, "color-info", 3, "ngStyle"], ["id", "choosed_color"]], template: function YearsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Trends through the years");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, " See also: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Trends through decades");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 5)(9, "div", 6)(10, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, " Since 2000, Pantone\u2019s color experts at the Pantone Color Institute comb the world looking for new color influences. The selection process requires thoughtful consideration and trend analysis. including the entertainment industry and films in production, traveling art collections and new artists, fashion, all areas of design, popular travel destinations, as well as new lifestyles, playstyles, and socio-economic conditions. Influences may also stem from new technologies, materials, textures, and effects that impact color, relevant social media platforms and even upcoming sporting events that capture worldwide attention. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, YearsComponent_div_13_Template, 4, 5, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, YearsComponent_div_14_Template, 13, 5, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.colors);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.isMobile);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgStyle, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf], styles: ["#years_header[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  width: 85vw;\r\n  height: auto;\r\n  font-size: 28px;\r\n}\r\n\r\n#decades_link[_ngcontent-%COMP%] {\r\n  font-size: 24px;\r\n}\r\n\r\n#decades_link[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:hover {\r\n  cursor: pointer;\r\n  color: var(--bs-primary);\r\n}\r\n\r\n#years_body[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: space-between;\r\n  width: 85vw;\r\n  margin-top: 5vh;\r\n}\r\n\r\n#years_content[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  width: 70vw;\r\n  font-size: 24px;\r\n  padding-right: 5vw;\r\n  border-right: 0.5vw solid black;\r\n  animation: border 9s infinite linear;\r\n}\r\n\r\n@keyframes border {\r\n  0% { border-color: #ffff00; }\r\n  33% { border-color: #00ffff; }\r\n  66% { border-color: #ff00ff; }\r\n  100% { border-color: #ffff00; }\r\n}\r\n\r\n#years_colors[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  flex-flow: row wrap;\r\n  margin-top: 5vh;\r\n  gap: 1vw;\r\n}\r\n\r\n.color[_ngcontent-%COMP%] {\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  text-align: center;\r\n  width: 7.5vw;\r\n  height: 7.5vw;\r\n  border-radius: 5%;\r\n}\r\n\r\n#choosed_color[_ngcontent-%COMP%] {\r\n  position: fixed;\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  right: 5vw;\r\n  width: 15vw;\r\n  font-size: 24px;\r\n  text-align: left;\r\n}\r\n\r\n@media screen and (max-width: 600px) {\r\n  #years[_ngcontent-%COMP%] {\r\n    margin: 0;\r\n  }\r\n\r\n  #years_header[_ngcontent-%COMP%] {\r\n    flex-direction: column;\r\n    width: 90vw;\r\n    font-size: 24px;\r\n  }\r\n\r\n  #decades_link[_ngcontent-%COMP%] {\r\n    font-size: 22px;\r\n  }\r\n\r\n  #decades_link[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\r\n    color: var(--bs-primary);\r\n    font-size: 22px;\r\n  }\r\n\r\n  #years_body[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    margin-top: 3vh;\r\n  }\r\n\r\n  #years_content[_ngcontent-%COMP%] {\r\n    width: 90vw;\r\n    font-size: 20px;\r\n    padding-right: 0;\r\n    border-right: none;\r\n  }\r\n\r\n  #years_colors[_ngcontent-%COMP%] {\r\n    justify-content: center;\r\n    align-items: center;\r\n    gap: 2.5vh;\r\n  }\r\n\r\n  .color[_ngcontent-%COMP%] {\r\n    width: 40vw;\r\n    height: 40vw;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInllYXJzLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLFdBQVc7RUFDWCxZQUFZO0VBQ1osZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQiw4QkFBOEI7RUFDOUIsV0FBVztFQUNYLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLFdBQVc7RUFDWCxlQUFlO0VBQ2Ysa0JBQWtCO0VBQ2xCLCtCQUErQjtFQUMvQixvQ0FBb0M7QUFDdEM7O0FBRUE7RUFDRSxLQUFLLHFCQUFxQixFQUFFO0VBQzVCLE1BQU0scUJBQXFCLEVBQUU7RUFDN0IsTUFBTSxxQkFBcUIsRUFBRTtFQUM3QixPQUFPLHFCQUFxQixFQUFFO0FBQ2hDOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsUUFBUTtBQUNWOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWixhQUFhO0VBQ2IsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsZUFBZTtFQUNmLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLFVBQVU7RUFDVixXQUFXO0VBQ1gsZUFBZTtFQUNmLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFO0lBQ0UsU0FBUztFQUNYOztFQUVBO0lBQ0Usc0JBQXNCO0lBQ3RCLFdBQVc7SUFDWCxlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsZUFBZTtFQUNqQjs7RUFFQTtJQUNFLHdCQUF3QjtJQUN4QixlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsV0FBVztJQUNYLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxXQUFXO0lBQ1gsZUFBZTtJQUNmLGdCQUFnQjtJQUNoQixrQkFBa0I7RUFDcEI7O0VBRUE7SUFDRSx1QkFBdUI7SUFDdkIsbUJBQW1CO0lBQ25CLFVBQVU7RUFDWjs7RUFFQTtJQUNFLFdBQVc7SUFDWCxZQUFZO0VBQ2Q7QUFDRiIsImZpbGUiOiJ5ZWFycy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiI3llYXJzX2hlYWRlciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgd2lkdGg6IDg1dnc7XHJcbiAgaGVpZ2h0OiBhdXRvO1xyXG4gIGZvbnQtc2l6ZTogMjhweDtcclxufVxyXG5cclxuI2RlY2FkZXNfbGluayB7XHJcbiAgZm9udC1zaXplOiAyNHB4O1xyXG59XHJcblxyXG4jZGVjYWRlc19saW5rIHNwYW46aG92ZXIge1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICBjb2xvcjogdmFyKC0tYnMtcHJpbWFyeSk7XHJcbn1cclxuXHJcbiN5ZWFyc19ib2R5IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gIHdpZHRoOiA4NXZ3O1xyXG4gIG1hcmdpbi10b3A6IDV2aDtcclxufVxyXG5cclxuI3llYXJzX2NvbnRlbnQge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICB3aWR0aDogNzB2dztcclxuICBmb250LXNpemU6IDI0cHg7XHJcbiAgcGFkZGluZy1yaWdodDogNXZ3O1xyXG4gIGJvcmRlci1yaWdodDogMC41dncgc29saWQgYmxhY2s7XHJcbiAgYW5pbWF0aW9uOiBib3JkZXIgOXMgaW5maW5pdGUgbGluZWFyO1xyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIGJvcmRlciB7XHJcbiAgMCUgeyBib3JkZXItY29sb3I6ICNmZmZmMDA7IH1cclxuICAzMyUgeyBib3JkZXItY29sb3I6ICMwMGZmZmY7IH1cclxuICA2NiUgeyBib3JkZXItY29sb3I6ICNmZjAwZmY7IH1cclxuICAxMDAlIHsgYm9yZGVyLWNvbG9yOiAjZmZmZjAwOyB9XHJcbn1cclxuXHJcbiN5ZWFyc19jb2xvcnMge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1mbG93OiByb3cgd3JhcDtcclxuICBtYXJnaW4tdG9wOiA1dmg7XHJcbiAgZ2FwOiAxdnc7XHJcbn1cclxuXHJcbi5jb2xvciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB3aWR0aDogNy41dnc7XHJcbiAgaGVpZ2h0OiA3LjV2dztcclxuICBib3JkZXItcmFkaXVzOiA1JTtcclxufVxyXG5cclxuI2Nob29zZWRfY29sb3Ige1xyXG4gIHBvc2l0aW9uOiBmaXhlZDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgcmlnaHQ6IDV2dztcclxuICB3aWR0aDogMTV2dztcclxuICBmb250LXNpemU6IDI0cHg7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxufVxyXG5cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcclxuICAjeWVhcnMge1xyXG4gICAgbWFyZ2luOiAwO1xyXG4gIH1cclxuXHJcbiAgI3llYXJzX2hlYWRlciB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgd2lkdGg6IDkwdnc7XHJcbiAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgfVxyXG5cclxuICAjZGVjYWRlc19saW5rIHtcclxuICAgIGZvbnQtc2l6ZTogMjJweDtcclxuICB9XHJcblxyXG4gICNkZWNhZGVzX2xpbmsgc3BhbiB7XHJcbiAgICBjb2xvcjogdmFyKC0tYnMtcHJpbWFyeSk7XHJcbiAgICBmb250LXNpemU6IDIycHg7XHJcbiAgfVxyXG5cclxuICAjeWVhcnNfYm9keSB7XHJcbiAgICB3aWR0aDogOTB2dztcclxuICAgIG1hcmdpbi10b3A6IDN2aDtcclxuICB9XHJcblxyXG4gICN5ZWFyc19jb250ZW50IHtcclxuICAgIHdpZHRoOiA5MHZ3O1xyXG4gICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgcGFkZGluZy1yaWdodDogMDtcclxuICAgIGJvcmRlci1yaWdodDogbm9uZTtcclxuICB9XHJcblxyXG4gICN5ZWFyc19jb2xvcnMge1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiAyLjV2aDtcclxuICB9XHJcblxyXG4gIC5jb2xvciB7XHJcbiAgICB3aWR0aDogNDB2dztcclxuICAgIGhlaWdodDogNDB2dztcclxuICB9XHJcbn1cclxuIl19 */"] });


/***/ }),

/***/ 1228:
/*!***********************************************!*\
  !*** ./src/app/services/auth/auth.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthService": () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 8784);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-cookie-service */ 3694);




class AuthService {
    constructor(http, cookies) {
        this.http = http;
        this.cookies = cookies;
        this.api = '/colors_api/';
        this.headers = {
            withCredentials: true,
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpHeaders()
        };
        this.headers.headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpHeaders({
            'X-CSRFToken': this.cookies.get('csrftoken'),
            'Content-Type': 'application/json'
        });
    }
    setAuth(value, remember_me) {
        const expires = new Date();
        remember_me ? expires.setDate(expires.getDate() + 3) : expires.setHours(expires.getHours() + 1);
        this.cookies.set('auth', value.toString(), { 'expires': expires, path: '/' });
    }
    isAuth() {
        return this.cookies.get('auth') == 'true';
    }
    displayErrors(errors) {
        console.log(`Error: ${errors}`);
    }
    login(data) {
        return this.http.post(this.api + 'login/', this.encrypt(data), this.headers);
    }
    signup(data) {
        return this.http.post(this.api + 'register/', this.encrypt(data), this.headers);
    }
    restore(data) {
        return this.http.post(this.api + 'restore/', this.encrypt(data), this.headers);
    }
    get() {
        return this.http.get(this.api + 'user/', this.headers);
    }
    edit(data) {
        return this.http.put(this.api + 'user/', data, this.headers);
    }
    logout() {
        this.setAuth(false);
        return this.http.post(this.api + 'logout/', this.headers);
    }
    encrypt(data) {
        if ('password' in data) {
            let password = data.password;
            data.password = this.rot13(password); // "very" secure
        }
        return data;
    }
    rot13(str) {
        var input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        var output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm456789123';
        var index = (x) => input.indexOf(x);
        var translate = (x) => index(x) > -1 ? output[index(x)] : x;
        return str.split('').map(translate).join('');
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](ngx_cookie_service__WEBPACK_IMPORTED_MODULE_2__.CookieService)); };
AuthService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 9520:
/*!***************************************************!*\
  !*** ./src/app/services/canvas/canvas.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CanvasService": () => (/* binding */ CanvasService)
/* harmony export */ });
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Color */ 1710);
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Model */ 1313);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);



class CanvasService {
    constructor() { }
    drawWheel(size = 350) {
        //https://stackoverflow.com/questions/46214072/color-wheel-picker-canvas-javascript
        let degToRad = (deg) => (deg * (Math.PI / 180));
        const centerColor = 'white';
        const canvas = document.createElement('canvas');
        const context = getContext(canvas);
        canvas.width = size;
        canvas.height = size;
        // Initiate variables
        let angle = 0;
        let pivotPointer = 0;
        const hexCode = [255, 0, 0];
        const colorOffsetByDegree = 4.322;
        const radius = size / 2;
        // For each degree in circle, perform operation
        while (angle < 360) {
            // find index immediately before our pivot
            const pivotPointerbefore = (pivotPointer + 3 - 1) % 3;
            // Modify colors
            if (hexCode[pivotPointer] < 255) {
                // If main points isn't full, add to main pointer
                if (hexCode[pivotPointer] + colorOffsetByDegree > 255) {
                    hexCode[pivotPointer] = 255;
                }
                else {
                    hexCode[pivotPointer] += colorOffsetByDegree;
                }
            }
            else if (hexCode[pivotPointerbefore] > 0) {
                // If color before main isn't zero, subtract
                if (hexCode[pivotPointerbefore] > colorOffsetByDegree) {
                    hexCode[pivotPointerbefore] -= colorOffsetByDegree;
                }
                else {
                    hexCode[pivotPointerbefore] = 0;
                }
            }
            else if (hexCode[pivotPointer] >= 255) {
                // If main color is full, move pivot
                hexCode[pivotPointer] = 255;
                pivotPointer = (pivotPointer + 1) % 3;
            }
            const rgb = `rgb(${hexCode.map(h => Math.floor(h)).join(',')})`;
            const grad = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
            grad.addColorStop(0, centerColor);
            grad.addColorStop(1, rgb);
            context.fillStyle = grad;
            // draw circle portion
            context.globalCompositeOperation = 'source-over';
            context.beginPath();
            context.moveTo(radius, radius);
            context.arc(radius, radius, radius, degToRad(angle), 2 * Math.PI);
            context.closePath();
            context.fill();
            angle++;
        }
        return canvas;
    }
    drawAllCursors(cursors) {
        let size = this.canvas.width;
        let x, y;
        let ctx = getContext(this.canvas);
        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = 3;
        for (let cursor of cursors) {
            ctx.beginPath();
            /*
            Adjust for trigonometric calculations
            E.g. the (x, y) are (-40, 52) on the unit circle,
            though we need to draw it on canvas, as the center of circle
            is at coords (size / 2, size / 2), so the canvas_x will be:
            size / 2 + x. If y is positive, then canvas_y will be:
            size / 2 - y; Else: size / 2 + |y| or size / 2 + abs(y)
            */
            x = cursor.x + size / 2;
            if (cursor.y < 0) {
                y = Math.abs(cursor.y) + size / 2;
            }
            else {
                y = size / 2 - cursor.y;
            }
            cursor.color = this.getColor(x, y);
            ctx.arc(x, y, cursor.radius * 2, 0, 2 * Math.PI);
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.closePath();
        }
    }
    getColor(x, y) {
        let ctx = getContext(this.wheel);
        let data = ctx.getImageData(x, y, 1, 1);
        let rgb = data.data.slice(0, 3);
        return new _Color__WEBPACK_IMPORTED_MODULE_0__.Color(new _Model__WEBPACK_IMPORTED_MODULE_1__.RGB(rgb[0], rgb[1], rgb[2]));
    }
}
CanvasService.ɵfac = function CanvasService_Factory(t) { return new (t || CanvasService)(); };
CanvasService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: CanvasService, factory: CanvasService.ɵfac, providedIn: 'root' });
function getContext(canvas) {
    return canvas.getContext('2d', { willReadFrequently: true });
}


/***/ }),

/***/ 9562:
/*!***************************************************!*\
  !*** ./src/app/services/colors/colors.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorsService": () => (/* binding */ ColorsService)
/* harmony export */ });
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Color */ 1710);
/* harmony import */ var _Equation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Equation */ 3672);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-cookie-service */ 3694);




class ColorsService {
    constructor(cookies) {
        this.cookies = cookies;
    }
    loadColor(key) {
        let color = this.cookies.get(key);
        if (color != '' && !color.includes("NaN")) {
            return _Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor(color);
        }
        return _Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor('#ffffff');
    }
    saveColor(key, color) {
        this.cookies.set(key, color.hex.toString(), { path: '/' });
    }
    loadEquation(key) {
        return new _Equation__WEBPACK_IMPORTED_MODULE_1__.Equation(this.cookies.get(key));
    }
    saveEquation(key, equation) {
        /*
        E.g. hexs = ['#ff0080', '#507090', '#000000']
             signs = ['+', '&']
             result = ['#283809']
    
             row = '#ff0080' +
                   ('+' + '#507090' + '&' + '#000000') - cycle part
                   = '#283809';
        */
        let row = equation.hexs[0];
        for (let j = 1; j < equation.hexs.length; j++) {
            row += equation.signs[j - 1];
            row += equation.hexs[j];
        }
        row += '=';
        row += equation.result;
        this.cookies.set(key, row, { path: '/' });
    }
}
ColorsService.ɵfac = function ColorsService_Factory(t) { return new (t || ColorsService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](ngx_cookie_service__WEBPACK_IMPORTED_MODULE_3__.CookieService)); };
ColorsService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: ColorsService, factory: ColorsService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 8407:
/*!****************************************************!*\
  !*** ./src/app/services/schemes/scheme.service.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CursorInfo": () => (/* binding */ CursorInfo),
/* harmony export */   "SchemeService": () => (/* binding */ SchemeService)
/* harmony export */ });
/* harmony import */ var _Scheme__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Scheme */ 4474);
/* harmony import */ var _Cursor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Cursor */ 6599);
/* harmony import */ var src_app_Equation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/Equation */ 3672);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-cookie-service */ 3694);





const SchemeType = {
    Monochromatic: _Scheme__WEBPACK_IMPORTED_MODULE_0__.Monochromatic, Complementary: _Scheme__WEBPACK_IMPORTED_MODULE_0__.Complementary, Analogous: _Scheme__WEBPACK_IMPORTED_MODULE_0__.Analogous, Compound: _Scheme__WEBPACK_IMPORTED_MODULE_0__.Compound, Triadic: _Scheme__WEBPACK_IMPORTED_MODULE_0__.Triadic, Rectangle: _Scheme__WEBPACK_IMPORTED_MODULE_0__.Rectangle, Square: _Scheme__WEBPACK_IMPORTED_MODULE_0__.Square
};
class SchemeService {
    constructor(cookies) {
        this.cookies = cookies;
    }
    get(name, x, y, size) {
        /*
        Adjust for trigonometric calculations
        E.g. the (x, y) are (40, 52) on the canvas,
        though we need to perform calculations, as the center
        of the unit circle is at coords (size / 2, size / 2),
        so the circle_x will be: x - size / 2.
        circle_y will be: size / 2 - y;
        */
        return new SchemeType[name.charAt(0).toUpperCase() + name.slice(1)](x - size / 2, size / 2 - y, size);
    }
    loadCoords(key) {
        let coords = this.cookies.get(key);
        return coords.split(',').map(Number);
    }
    saveCoords(key, cursor) {
        let x, y;
        /*
        Adjust for trigonometric calculations
        E.g. the (x, y) are (-40, 52) on the unit circle,
        though we need to draw it on canvas, as the center of circle
        is at coords (size / 2, size / 2), so the canvas_x will be:
        size / 2 + x. If y is positive, then canvas_y will be:
        size / 2 - y; Else: size / 2 + |y| or size / 2 + abs(y)
        */
        x = cursor.x + cursor.canvasSize / 2;
        if (cursor.y < 0) {
            y = Math.abs(cursor.y) + cursor.canvasSize / 2;
        }
        else {
            y = cursor.canvasSize / 2 - cursor.y;
        }
        this.cookies.set(key, Math.round(x * 100) / 100 + ',' + Math.round(y * 100) / 100, { path: '/' });
    }
}
SchemeService.ɵfac = function SchemeService_Factory(t) { return new (t || SchemeService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](ngx_cookie_service__WEBPACK_IMPORTED_MODULE_4__.CookieService)); };
SchemeService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: SchemeService, factory: SchemeService.ɵfac, providedIn: 'root' });
class CursorInfo {
    constructor(label, value, value2) {
        this.label = label;
        if (value2 == undefined && value instanceof _Cursor__WEBPACK_IMPORTED_MODULE_1__.Cursor) {
            this.color = value.color;
        }
        else if (value2 == undefined) { //value isn't Cursor
            this.color = value;
        }
        else if (value instanceof _Cursor__WEBPACK_IMPORTED_MODULE_1__.Cursor) { //value2 is defined
            this.color = value.color.operate(src_app_Equation__WEBPACK_IMPORTED_MODULE_2__.Sign.Mix, value2.color);
        }
        else { //neither of them
            this.color = value.operate(src_app_Equation__WEBPACK_IMPORTED_MODULE_2__.Sign.Mix, value2.color);
        }
    }
}


/***/ }),

/***/ 8876:
/*!***************************************************!*\
  !*** ./src/app/services/trends/trends.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DecadePallette": () => (/* binding */ DecadePallette),
/* harmony export */   "TrendsService": () => (/* binding */ TrendsService),
/* harmony export */   "YearColor": () => (/* binding */ YearColor)
/* harmony export */ });
/* harmony import */ var _Color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Color */ 1710);
/* harmony import */ var _trends_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trends.json */ 9510);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);



class TrendsService {
    constructor() { }
    getYearColors() {
        let years = [];
        for (let year of _trends_json__WEBPACK_IMPORTED_MODULE_1__.years) {
            years.push(new YearColor(year.name, year.hex, year.pantone, year.year));
        }
        return years;
    }
    getDecadePallete(decade) {
        for (let dec of _trends_json__WEBPACK_IMPORTED_MODULE_1__.decades) {
            if (dec.decade == decade) {
                return new DecadePallette(dec.decade, dec.names, dec.hexs, dec.description);
            }
        }
        return null;
    }
}
TrendsService.ɵfac = function TrendsService_Factory(t) { return new (t || TrendsService)(); };
TrendsService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: TrendsService, factory: TrendsService.ɵfac, providedIn: 'root' });
class YearColor {
    constructor(name, hex, pantone, year) {
        this.name = name;
        this.color = _Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor(hex);
        this.pantone = pantone;
        this.year = year;
    }
}
class DecadePallette {
    constructor(decade, names, hexs, description) {
        this.colors = [];
        this.decade = decade;
        this.names = names;
        for (let hex of hexs) {
            this.colors.push(_Color__WEBPACK_IMPORTED_MODULE_0__.Color.toColor(hex));
        }
        this.description = description;
        this.shortDesc = description.split(' ').slice(0, 21).join(' ');
    }
}


/***/ }),

/***/ 4431:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 318);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 6747);


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule)
    .catch(err => console.error(err));


/***/ }),

/***/ 9510:
/*!*********************************************!*\
  !*** ./src/app/services/trends/trends.json ***!
  \*********************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"years":[{"name":"Cerulean","hex":"#9dd7d4","pantone":"15-4020","year":"2000"},{"name":"Fuchsia Rose","hex":"#c74375","pantone":"17-2031","year":"2001"},{"name":"True Red","hex":"#bf1932","pantone":"19-1664","year":"2002"},{"name":"Aqua Sky","hex":"#7bc4c4","pantone":"14-4811","year":"2003"},{"name":"Tigerlily","hex":"#e2583e","pantone":"17-1456","year":"2004"},{"name":"Blue Turquoise","hex":"#53b0ae","pantone":"15-5217","year":"2005"},{"name":"Sand Dollar","hex":"#decdbe","pantone":"13-1106","year":"2006"},{"name":"Chili Pepper","hex":"#9b1b30","pantone":"19-1557","year":"2007"},{"name":"Blue Iris","hex":"#5a5b9f","pantone":"18-3943","year":"2008"},{"name":"Mimosa","hex":"#f0c05a","pantone":"14-0848","year":"2009"},{"name":"Turquoise","hex":"#45b5aa","pantone":"15-5519","year":"2010"},{"name":"Honeysuckle","hex":"#d94f70","pantone":"18-2120","year":"2011"},{"name":"Tangerine Tango","hex":"#dd4124","pantone":"17-1463","year":"2012"},{"name":"Emerald","hex":"#009473","pantone":"17-5641","year":"2013"},{"name":"Radiant Orchid","hex":"#b163a3","pantone":"18-3224","year":"2014"},{"name":"Marsala","hex":"#955251","pantone":"18-1438","year":"2015"},{"name":"Rose Quartz","hex":"#f7cac9","pantone":"13-1520","year":"2016"},{"name":"Serenity","hex":"#92a8d1","pantone":"15-3919","year":"2016"},{"name":"Greenery","hex":"#88b04b","pantone":"15-0343","year":"2017"},{"name":"Ultra Violet","hex":"#5f4b8b","pantone":"18-3838","year":"2018"},{"name":"Living Coral","hex":"#ff6f61","pantone":"16-1546","year":"2019"},{"name":"Classic Blue","hex":"#0f4c81","pantone":"19-4052","year":"2020"},{"name":"Ultimate Gray","hex":"#939597","pantone":"17-5104","year":"2021"},{"name":"Illuminating","hex":"#f5dF4d","pantone":"13-0647","year":"2021"},{"name":"Very Peri","hex":"#6768ab","pantone":"17-3938","year":"2022"}],"decades":[{"decade":"1920","hexs":["#ffd84d","#b0903d","#f7e7ce","#e30022","#34399d","#a5aaa0"],"names":["tuscan sun","antique gold","champagne","cadmium red","ultramarine","deco silver"],"description":"Americans in the 1920s were seduced by luxury, leisure and adventure. Spanning from architecture to fashion to graphic design, yellow and gold expelled energy, wealth and happiness. Art Deco influenced designers, artists and architects across the Western world. Radical Modernist art movements such as Cubism, Futurism, Expressionism and Dadaism influenced some American artists as well. In poster design, artists often employed transparent layers of red, blue yellow and black to create a full spectrum of rich color. Bold, velvety colors, such as ultramarine and cadmium red also represent the indulgences of the era."},{"decade":"1930","hexs":["#d02d1c","#eed023","#b0dabe","#99b1c9","#345d98","#3a7359"],"names":["poppy field","yellow brick road","mint","powder blue","egyptian blue","jade"],"description":"During the wave of the Great Depression Americans persevered by finding affordable family-friendly means of entertainment and recreation. The 1930s was also a time which bore timeless, iconic pop culture that audiences today cherish and reinvent for contemporary tastes and ideals. Film, board games, comics and magazines were created during this time period — some names remain as favorites across generations. Despite the dread and despair of the Depression, there were many joyful, colorful and rich colors that represented the era which represented how Americans kept magic in everyday life."},{"decade":"1940","hexs":["#2a326d","#f4cf0d","#d90707","#4e9fbc","#dabd8f","#b38069"],"names":["war bond blue","keep calm & canary on","Rosie\'s nail polish","air force blue","normandy sand","cadet khaki"],"description":"The government had to keep civic and military morale uplifted during the war and rationing. Propaganda posters adopted a rich patriotic palette and promoted a cheerful and romantic sense of duty in the populace. Willie Gillis, a character invented by Rockwell, is a humorous and likable archetype of the all-American drafted soldier. Willie Gillis’s is brighter and more cheery than the more neutral palettes that appeared elsewhere. Primary colors such as blue, navy, red and yellow were widely used alongside muted military colors such as olive, brown and tan. Due to rationing, wartime fashion became more minimalistic and pragmatic. In the world of entertainment adults and children saw movies, cartoons and comic books that espoused pro-America messages to garner more support for the war. In “Der Fuehrer’s Face”, a wartime propaganda short by Disney released in 1943, Donald Duck dreams of his life being controlled by the Nazis, set in somber, muted and muddy tones of green, brown and yellow."},{"decade":"1950","hexs":["#ff91bb","#ffd95c","#4ac6d7","#f5855b","#68bbb8","#e81b23"],"names":["poodle skirt","lemon meringue","roadtrip","motel sunset","soda fountain","marilyn in crimson"],"description":"During the 1950s, America came home. Soldiers returning from World War II attended college, bought homes and started families. Another decade of American consumerism, glamor and prosperity swept the nation. Advertisers created razor-sharp campaigns for different members of the family: mothers, fathers and the newly-created age group: teenagers. Powdery pastels became fashionable and associated with American housewives to convey youth, warmth and joy. Fashion, cars, graphic design, furniture and decor design were all seeping with delicate pinks, blues and greens. In the 1950s you could have even bought colored toilet paper. The 1950s was a classic age for families of motorists who flocked to fantastical amusement parks and illuminated atomic-age motels in their streamlined vehicles."},{"decade":"1960","hexs":["#cf4917","#f9ac3d","#758c33","#985914","#d0b285","#2d758c"],"names":["burnt siena","harvest gold","avocado","teak","natural","blue mustang"],"description":"The 1960s are remembered as a radical time in American history and culture. Out with cotton candy colors of and in with rich, psychedelic palettes. Mod motifs and psychedelic patterns clashed with the natural desert-colored hues. Color names such as burnt sienna, harvest gold and avocado are strongly associated with 1960s and 1970s interior design. Designer Saul Bass created stellar opening credits of famous movies in the 1960s for Alfred Hitcock’s films, including Vertigo, North by Northwest and Psycho. Logo designer Paul Rand changed the look of corporate America with his creating timeless, geometric logos. Electrifying pop figures such as the Beatles, The Rolling Stones, Jimi Hendrix and Andy Warhol are also represented by brilliant earth tones."},{"decade":"1970","hexs":["#00a1d3","#a92da3","#fd4d2e","#769f52","#ff68a8","#f8ca38"],"names":["prom suit","wonka kitsch","lava lamp glow","faux fern","neon dreams","have a nice day"],"description":"The 1970s are marked by glowing pure primary colors as screen technology made a significant transition from black-and-white to color. Colorful Saturday morning cartoons, Sesame Street, The Price is Right and of course, Saturday Night Live all got their start in the 1970s and inspired a generation of youth and teens with their colorful worlds. Kids played with vividly-colored toys such as LEGO, Hot Wheels, Barbie and Play-Doh. Eclectic, vibrant colors from from glowing dance floors and neon lights illuminated the disco and punk scenes. Fashions were far more flamboyant: people wore tightly-fitting brightly-colored polyester pants, shirts and dresses."},{"decade":"1980","hexs":["#3968cb","#ca7cd8","#10e7e2","#ff68a8","#f9eb0f","#ff2153"],"names":["acid wash","purple rain","tron turqoise","miami","pacman","powersuit"],"description":"The 1980s was one of the first times groundbreaking technology intersected with ways to have fun. The advent of personal computing allowed computer gaming and video games to flourish. Companies created colorful, fantastical advertisements to show off the displays on their devices. Apple’s iconic logo, from 1977-1998 was rainbow-colored to make their products appear friendly to consumers and showcasing the Apple II’s color display. MTV made its debut in 1981 and the era of music videos on television was born. An example of MTV’s edgy appeal were the short spots during commercial breaks where the logo was morphed and shaped by animation and quirky filmmaking. The experimental Italian design group Memphis created the energetic, electric aesthetic look of the 1980s that we recognize and lovingly replicate today."},{"decade":"1990","hexs":["#b13a1a","#832c76","#164db0","#287e9e","#e4a834","#b3346c"],"names":["oprah\'s couch","tracksuit","\'I\'m blue","seattle spruce","\'Doh Dijon\'","moody mauve"],"description":"Color from the 1960s to the 1980s are known for their bright, vibrant hues. Things didn’t quiet down until the 1990s, which was known for its more neutral, moody color palette. Grunge music was at its height and alternative rock was coming in to the fore; its scene was anti-materialistic and celebrated individualism over consumerism. The offices of corporate America adopted neutral colors: gray, beige and brown with mauve and burgundy accents. Tech companies who positioned their products as being fun and easy to use, such as Nintendo and Apple, released candy-colored plastic devices. Iconic shows on television such as Friends, Seinfeld and Daria also adopted a more sober and muted color palette. Alternatively, the 1990s are also known for noisy jewel-colored fashion, composed of rich blues, bright purples, deep greens, and hot reds."},{"decade":"2000","hexs":["#df19c1","#ff6200","#efc40e","#23d513","#4399de","#e33056"],"names":["Paris Hilton pink","nickelodeon splat","little miss sunshine","limewire","yes we cyan","zenon ruby"],"description":"The 2000s were marked by a time of decadence in the culture and innovation in technology. Some of the iconic shows of the time closely followed the lives of extravagant Americans, real or fictional — Paris Hilton from The Simple Life, rich teens from My Sweet 16, the outrageous cast from The Jersey Shore, Carrie Bradshaw in Sex and the City, Gretchen Wieners from Mean Girls and, of course, Kim, Khloe and Kourtney Kardashian from Keeping Up with the Kardashians. Skinny jeans finally stuck as a fashionable item, but unfortunately so did Crocs."},{"decade":"2010","hexs":["#efb6bf","#c86e4c","#dddddd","#fe3c71","#2bd566","#0081fe"],"names":["millennial pink","polished copper","quartz","one million likes","suculent","social bubble"],"description":"The 2010s are known for many things: nostalgia, hipsters and minimalism. From interior design to technology, a growing interest in minimalistic, well-crafted and thoughtfully-designed items became status symbols. The most trendy interiors today feature rustic wood finishes, metallic or stone surfaces, polished copper and brass accents, and cozy deep green tropical plants all carefully arranged before airy sun-bleached white walls. While screen resolution, camera quality and technology grew more complex, digital design simplified to what we call flat design. Flat design is constructed from geometric shapes edged with delicate drop shadows topped with simple sans-serif typography. The ensuing color palette, however, introduces a more fantastical element to the style. Joyful gradients, surrealistic saturated color is a delightful experience for users."}]}');

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4431)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map