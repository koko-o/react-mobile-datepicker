/**
 * @module DatePicker Component
 */
import './index.css';
import React, { Component } from 'react';
import DatePickerItem from './DatePickerItem.js';
import PureRender from './pureRender.js';
import { convertDate, nextDate } from './time.js';


/**
 * Class DatePicker Component Class
 * @extends Component
 */
class DatePicker extends Component {
    constructor(props) {
        super(props);
        if (props.dateFormat[0] === 'l'){
            this.state = {
                value: this.props.value,
                selectedValue: this.props.value[0].text
            };
        } else {
            this.state = {
                value: nextDate(this.props.value),
            };
        }

        this.handleFinishBtnClick = this.handleFinishBtnClick.bind(this);
        this.handleDateSelect = this.handleDateSelect.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dateFormat[0] === 'l') return;
        // update value of state
        const date = nextDate(nextProps.value);
        if (date.getTime() !== this.state.value.getTime()) {
            this.setState({ value: date });
        }
    }

    /**
     * Optimization component, Prevents unnecessary rendering
     * Only props or state change or value before re-rendering
     *
     * @param  {Object} nextProps next props
     * @param  {Object} nextState next state
     * @return {Boolean}          Whether re-rendering
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.dateFormat[0] === 'l') return true;
        const date = nextDate(nextState.value);
        return date.getTime() !== this.state.value.getTime() ||
                PureRender.shouldComponentUpdate(nextProps, nextState, this.props, this.state);
    }

    /**
     * 点击完成按钮事件
     * @return {undefined}
     */
    handleFinishBtnClick() {
        
        if (this.props.dateFormat[0] === 'l'){
            this.props.onSelect(this.state.selectedValue);
        } else {
            this.props.onSelect(this.state.value);
        }
    }

    /**
     * 选择下一个日期
     * @return {undefined}
     */
    handleDateSelect(value) {
        if (this.props.dateFormat[0] === 'l'){
            this.setState({ selectedValue: value.text });
        } else {
            this.setState({ value });
        }
    }

    /**
     * render函数
     * @return {Object} JSX对象
     */
    render() {
        const { min, max, theme, dateFormat, confirmText, cancelText, showFormat, showHeader, customHeader, customContent } = this.props;
        const value = this.state.value;
        const themeClassName =
            ['default', 'dark', 'ios', 'android', 'android-dark'].indexOf(theme) === -1 ?
            'default' : theme;
        const content = customContent || (<div className="datepicker-content">
                                            {dateFormat.map((format, index) => (
                                                <DatePickerItem
                                                    key={index}
                                                    value={value}
                                                    min={min}
                                                    max={max}
                                                    format={format}
                                                    onSelect={this.handleDateSelect} />
                                            ))}
                                        </div>)
        return (
            <div
                className={`datepicker ${themeClassName}`}>
                {showHeader &&
                    <div className="datepicker-header">{customHeader || (dateFormat[0] === 'l' ? this.state.selectedValue : convertDate(value, showFormat))}</div>}
                {content}
                <div className="datepicker-navbar">
                    <a
                        className="datepicker-navbar-btn"
                        onClick={this.handleFinishBtnClick}>{confirmText}</a>
                    <a
                        className="datepicker-navbar-btn"
                        onClick={this.props.onCancel}>{cancelText}</a>
                </div>
            </div>
        );
    }
 }

 DatePicker.defaultProps = {
    theme: 'ios',
    value: new Date(),
    min: new Date(1970, 0, 1),
    max: new Date(2050, 0, 1),
    showHeader: true,
    dateFormat: ['YYYY', 'M', 'D'],
    showFormat: 'YYYY/MM/DD',
    confirmText: '完成',
    cancelText: '取消',
    onSelect: () => {},
    onCancel: () => {},
    customContent: null
};

export default DatePicker;
