import React from "react";
import PropTypes from "prop-types";

/**
 * Error display component.
 * @param {object} props Properties.
 * @param {object} props.error Error to be displayed.
 */
const ErrorDisplay = ({ error }) => <p>{error.toString()}</p>;

ErrorDisplay.propTypes = {
  error: PropTypes.object,
};

module.exports = ErrorDisplay;
