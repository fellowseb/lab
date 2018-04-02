import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

class ResourceFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            tags: [],
            filteredTag: null
        };
    }
    componentWillMount() {
        this.setState({ loading: true });
        retrieveFilterTags()
            .then(tags => {
                this.setState({
                    ...this.state,
                    loading: false,
                    error: null,
                    tags
                });
            })
            .catch(error => {
                this.setState({
                    ...this.state,
                    loading: false,
                    error: error,
                    tags: []
                });
            });
    }
    render() {
        const { tags, filteredTag } = this.state;
        const { onChangeFilter } = this.props;
        const nonFilteredTags = tags.filter(tagItem => tagItem.tag !== filteredTag);
        let _select;
        const changeFilter = e => {
            e.preventDefault();
            onChangeFilter(_select.options[_select.selectedIndex].value || null);
            _select = null;
        };
        return (
            <section className='articles-filters'>
                <label>Filter by category : </label>
                <select className='articles-filters-select'
                    disabled={nonFilteredTags.length === 0}
                    ref={input => (_select = input)}
                    onChange={changeFilter}>
                    <option value=''>Show all</option>
                    {nonFilteredTags.map((tagItem, i) =>
                        <option value={tagItem.tag} key={i}>{tagItem.displayName.en}</option>)}
                </select>
            </section>
        );
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }
}

ResourceFilters.propTypes = {
    onChangeFilter: PropTypes.func
};

ResourceFilters.defaultProps = {
    onChangeFilter: tag => tag
};

/**
 * Fetch Pocket data
 */
const retrieveFilterTags = () => {
    return fetch('https://szkg4s33n0.execute-api.eu-west-1.amazonaws.com/dev/resourcetags', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    })
        .then(response => response.json())
        .then(json => json.tags);
};

export default ResourceFilters;
