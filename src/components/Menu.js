import React from 'react';

const Menu = props =>
    <header className="masthead" role="banner">
        <button id="menu-button" className="menu-button">
            <svg id="menu-button-svg-open" className="icon-menubtn">
                <use href="#menu" />
            </svg>
            <svg id="menu-button-svg-close" className="icon-menubtn">
                <use href="#menuclose" />
            </svg>
        </button>
        <div className="menu-container">
            <div className="logo">
                <svg id="logo-umbrella" className="icon-logo">
                    <use href="#umbrella" />
                </svg>fellow<span className="seb">seb</span>
            </div>
            <nav id="menu-nav" role="navigation">
                <ul>
                    <li>
                        <a href="#about" id="menu-nav-link-about" className="menu-nav-link">About</a>
                    </li>
                    <li>
                        <a href="#brainfuel" id="menu-nav-link-brainfuel" className="menu-nav-link">Resources</a>
                    </li>
                    <li>
                        <a href="#labo" id="menu-nav-link-labo" className="menu-nav-link">Experiments</a>
                    </li>
                    <li>
                        <a href="https://github.com/fellowseb" target="_blank" rel="noopener noreferrer" className="menu-nav-link menu-nav-link-github">
                            <svg className="icon-links">
                                <use href="#github" />
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/sebastienwauquier" target="_blank" rel="noopener noreferrer" className="menu-nav-link menu-nav-link-linkedin">
                            <svg className="icon-links">
                                <use href="#linkedin" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>;

module.exports = Menu;
