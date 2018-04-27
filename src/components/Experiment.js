import React from 'react';
import PropTypes from 'prop-types';

const Experiment = props => {
    const renderedTasks = renderExperimentTasks(props.tasks);
    const renderedResources = renderExperimentResources(props.resources);
    const renderedReults = renderExperimentResults(props.results);
    const renderedTags = renderExperimentTags(props.tags);
    const collapsedSuffix = props.collapsed
        ? '-collapsed'
        : '-uncollapsed';
    const headerClasses = 'experiment-header experiment-header' + collapsedSuffix;
    const bodyClasses = 'experiment-body experiment-body' + collapsedSuffix;
    return <article className="experiment-container">
        <section className={headerClasses}>
            <header>
                <h1>{props.num} - {props.title}</h1>
            </header>
        </section>
        <div className={bodyClasses}>
            <section className="experiment-content">
                <p className="experiment-section-title">
                    <span className="experiment-section-icon fas fa-tasks" title="Tasks"></span>I used...
                </p>
                {renderedTasks}
            </section>
            <section className="experiment-resources">
                <p className="experiment-section-title">
                    <span className="experiment-section-icon fas fa-link" title="Resources"></span>Resources
                </p>
                {renderedResources}
            </section>
            <section className="experiment-results">
                <p className="experiment-section-title">
                    <span className="experiment-section-icon fas fa-chart-line" title="Results"></span>Results
                </p>
                {renderedReults}
            </section>
        </div>
        <section className="experiment-tags">
            <span className="experiment-section-icon fas fa-tags" title="Tags"></span>
            {renderedTags}
        </section>
    </article>;
};

Experiment.propTypes = {
    num: PropTypes.number.isRequired,
    collapsed: PropTypes.bool,
    title: PropTypes.string,
    tasks: PropTypes.array,
    resources: PropTypes.array,
    results: PropTypes.array,
    tags: PropTypes.array
};

const renderExperimentTasks = tasks =>
    <ul>
        {tasks.map((task, i) => <li key={i}>{task}</li>)}
    </ul>;

const renderBook = (book, index) => {
    const authors = book.authors[0];
    return <li key={index} className="experiment-resource experiment-resource-book">
        <p>
            <span className="experiment-section-icon fas fa-book" title="Book"></span>
            <a target="_blank" rel="noopener noreferrer" href={book.href}>{book.title}</a>
            <br />ed {book.editor}, ISBN{book.isbn}
            <br />by {authors}
        </p>
    </li>;
};

const renderArticle = (article, index) => {
    const authors = article.authors[0];
    return <li key={index} className="experiment-resource experiment-resource-article">
        <p>
            <span className="experiment-section-icon fas fa-bookmark" title="Article"></span>
            <a target="_blank" rel="noopener noreferrer" href={article.href}>{article.title}</a>
            <br />by {authors}
        </p>
    </li>;
};

const renderExperimentResources = resources =>
    <ul className="experiment-resources-container">
        {resources.map((resource, i) => {
            switch (resource.type) {
                case 'book':
                    return renderBook(resource, i);
                case 'article':
                    return renderArticle(resource, i);
            }
        })}
    </ul>;

const renderExperimentResults = results =>
    <ul>
        {results.map((result, i) => <li key={i}><a href={result.href} target="_blank" rel="noopener noreferrer">{result.text}</a></li>)}
    </ul>;

const renderExperimentTags = tags =>
    <ul>
        {tags.map((tag, i) => <li key={i}>{tag}</li>)}
    </ul>;

module.exports = Experiment;
