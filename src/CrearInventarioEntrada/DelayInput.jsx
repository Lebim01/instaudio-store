import React, { Component } from 'react';

import {
    TextField
} from '@material-ui/core'

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export default class DelayInput extends Component {
    constructor(props) {
        super();

        this.handleChange = this.handleChange.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.triggerChange = this.triggerChange.bind(this)

        this.state = {
            value: props.value,
            event : {
                target : {
                    value : props.value
                }
            }
        };
    }

    componentWillMount() {
        this.timer = null;
    }

    handleChange = (e) => {
        clearTimeout(this.timer);

        this.setState({ value : e.target.value, event : e });

        this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
    }

    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
            this.triggerChange();
        }
    }

    triggerChange() {
        const { event } = this.state;

        this.props.onChange(event);
    }

    render() {
        return (
            <TextField
                value={this.state.value}
                fullWidth={this.props.fullWidth}
                InputProps={this.props.InputProps}
                placeholder={this.props.placeholder || ''}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
            />
        );
    }
}