import React from 'react';
import PropTypes from 'prop-types';

const ErrorDisplay = ({error}) =>
    <p>{error.message}</p>;

ErrorDisplay.propTypes = {
    error: PropTypes.object
};

module.exports = ErrorDisplay;
