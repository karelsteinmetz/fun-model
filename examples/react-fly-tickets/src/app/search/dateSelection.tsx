import * as React from 'react';
import * as mu from 'material-ui';
import * as f from '../flux';
import * as c from '../states.cursors';
import * as a from './actions';

export default () => {
    let state = f.getState(c.search);
    return (
        <div>
            <mu.DatePicker
                hintText="Departure:"
                mode="landscape"
                valueLink={{
                    value: state.departureDate,
                    requestChange: (v) => a.updateDepartureDate(v)
                }} />
            <mu.DatePicker
                hintText="Return:"
                mode="landscape"
                valueLink={{
                    value: state.returnDate,
                    requestChange: (v) => a.updateReturnDate(v)
                }} />
        </div>
    )
};