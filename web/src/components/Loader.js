import React from 'react';

/**
 * Presentational component displaying a loader.
 */
const Loader = () =>
    <div className="loader">
        <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
    </div>;

module.exports = Loader;
