import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import styled from 'styled-components';

import Select from '../components/Select.jsx';

/**
 * Component displaying a combo enabling the filtering
 * of resources.
 * State:
 * - loading {bool}
 * - error {Error}
 * - tags {string[]}
 * - filteringTag {string}
 */
class ResourceFilters extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            tags: [],
        };
    }
    async componentDidMount() {
        this.setState({ loading: true });
        try {
            const { apiUrl } = this.props;
            let tags = await retrieveFilterTags(apiUrl);
            this.setState({
                loading: false,
                error: null,
                tags
            });
        } catch (err) {
            this.setState({
                loading: false,
                error: err,
                tags: []
            });
        }
    }
    render() {
        const { tags } = this.state;
        const { filteredTag } = this.props;
        let refs = {
            select: null
        };

        return (
            <section>
                <label>Filter by category : </label>
                <Select
                    value={filteredTag || ''}
                    disabled={tags.length === 0}
                    ref={input => (refs.select = input)}
                    onChange={this.changeFilter.bind(this, refs)}>
                    <option value=''>Show all</option>
                    {tags.map((tagItem, i) => {
                        return <option value={tagItem.tag} key={i}>{tagItem.displayName ? tagItem.displayName.en : tagItem.tag}</option>
                    })}
                </Select>
            </section>
        );
    }
    /**
     * @private
     */
    changeFilter({ select }, event) {
        const { onChangeFilter } = this.props;
        event.preventDefault();
        onChangeFilter(select.options[select.selectedIndex].value || null);
    };
}

ResourceFilters.propTypes = {
    onChangeFilter: PropTypes.func,
    apiUrl: PropTypes.string.isRequired,
    filteredTag: PropTypes.string
};

ResourceFilters.defaultProps = {
    onChangeFilter: tag => tag,
    apiUrl: '',
    filteredTag: null
};

/**
 * Fetch Pocket data
 */
const retrieveFilterTags = async (apiUrl) => {
    let response = await fetch(apiUrl + '/resourcetags', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    });
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`${json.error ? json.error : response.statusText}`);
    }
    let json = await response.json();
    return json.tags;
};

export default ResourceFilters;
