"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var React = require("react");
var react_range_1 = require("react-range");
var STEP = 0.1;
var MIN = 0;
var MAX = 100;
var LabeledTwoThumbs = /** @class */ (function (_super) {
    __extends(LabeledTwoThumbs, _super);
    function LabeledTwoThumbs() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            values: [20, 40]
        };
        return _this;
    }
    LabeledTwoThumbs.prototype.render = function () {
        var _this = this;
        return (<div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap'
        }}>
        <react_range_1.Range values={this.state.values} step={STEP} min={MIN} max={MAX} onChange={function (values) { return _this.setState({ values: values }); }} renderTrack={function (_a) {
            var props = _a.props, children = _a.children;
            return (<div onMouseDown={props.onMouseDown} onTouchStart={props.onTouchStart} style={__assign(__assign({}, props.style), { height: '36px', display: 'flex', width: '100%' })}>
              <div ref={props.ref} style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: react_range_1.getTrackBackground({
                    values: _this.state.values,
                    colors: ['#ccc', '#548BF4', '#ccc'],
                    min: MIN,
                    max: MAX
                }),
                alignSelf: 'center'
            }}>
                {children}
              </div>
            </div>);
        }} renderThumb={function (_a) {
            var index = _a.index, props = _a.props, isDragged = _a.isDragged;
            return (<div {...props} style={__assign(__assign({}, props.style), { height: '42px', width: '42px', borderRadius: '4px', backgroundColor: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 2px 6px #AAA' })}>
              <div style={{
                position: 'absolute',
                top: '-28px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                padding: '4px',
                borderRadius: '4px',
                backgroundColor: '#548BF4'
            }}>
                {_this.state.values[index].toFixed(1)}
              </div>
              <div style={{
                height: '16px',
                width: '5px',
                backgroundColor: isDragged ? '#548BF4' : '#CCC'
            }}/>
            </div>);
        }}/>
      </div>);
    };
    return LabeledTwoThumbs;
}(React.Component));
exports["default"] = LabeledTwoThumbs;
