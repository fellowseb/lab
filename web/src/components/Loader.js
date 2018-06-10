import React from 'react';

class Loader extends React.Component {
    render() {
        return (
            <div className="loader">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        );
    }
}

module.exports = Loader;