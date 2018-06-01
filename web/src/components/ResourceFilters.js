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
        const { apiUrl } = this.props;
        retrieveFilterTags(apiUrl)
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
}

ResourceFilters.propTypes = {
    onChangeFilter: PropTypes.func,
    apiUrl: PropTypes.string.isRequired
};

ResourceFilters.defaultProps = {
    onChangeFilter: tag => tag,
    apiUrl: ''
};

/**
 * Fetch Pocket data
 */
const retrieveFilterTags = (apiUrl) => {
    return fetch(apiUrl + '/resourcetags', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    })
    .then(function handleReponse(response) {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            throw new Error(`${response.statusText} (${response.status})`);
        }
    })
    .then(json => json.tags);
};

export default ResourceFilters;
