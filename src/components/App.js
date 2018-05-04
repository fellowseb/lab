import React from 'react';
import Resources from '../components/Resources';
import Experiments from '../components/Experiments';
import Menu from '../components/Menu';

const App = props =>
    <div id="app">
        <Menu/>
        <main className="main-container" role="main">
            <a name="about" className="anchor"></a>
            <section className="page page-purpose">
                <div className="purpose-container">
                    <div className="purpose-container-who">
                        <header>
                            <p className="purpose-title">Who am I ?</p>
                        </header>
                        <figure>
                            <svg className="icon-purpose">
                                <use href="#code" />
                            </svg>
                        </figure>
                        <p className="purpose-desc">My name is <strong>S&eacute;bastien Wauquier</strong>.<br />
                        I&apos;m a Software Engineer. In the past years I&apos;ve dealt with real-time 3D apps on desktop (in C++) or in the browser (JavaScript).</p>
                    </div>
                    <div className="purpose-container-what">
                        <header>
                            <p className="purpose-title">What is this ?</p>
                        </header>
                        <figure>
                            <svg className="icon-purpose">
                                <use href="#lab" />
                            </svg>
                        </figure>
                        <p className="purpose-desc">This is my <strong>virtual laboratory</strong>.<br />I intend to experiment cool tech stuff and maybe later extend it to art and life in general.</p>
                    </div>
                    <div className="purpose-container-why">
                        <header>
                            <p className="purpose-title">What&apos;s the point ?</p>
                        </header>
                        <figure>
                            <svg className="icon-purpose">
                                <use href="#books" />
                            </svg>
                        </figure>
                        <p className="purpose-desc">I believe one should always <strong>keep on learning</strong>.<br />There are so many things to discover, to read, to share!</p>
                    </div>
                </div>
            </section>
            <a name="brainfuel" className="anchor"></a>
            <section id="page-brainfuel" className="page page-brainfuel">
                <Resources />
            </section>
            <a name="labo" className="anchor"></a>
            <section id="page-experiments" className="page page-experiments">
                <Experiments />
            </section>
        </main>
    </div>;

module.exports = App;
