import React, { Component } from "react";
import PropTypes from "prop-types";

class SearchComponent extends Component {
  state = {
    search: ""
  };

  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    showSearchButton: PropTypes.bool.isRequired,
    searchButtonText: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.state.search.trim() === "") return;

    const { onSearch } = this.props;
    const { search } = this.state;

    onSearch(search);
  };

  render() {
    const { placeholder, showSearchButton, searchButtonText } = this.props;
    const { search } = this.state;
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <input
          className={"form-control mr-sm-2"}
          type="search"
          placeholder={placeholder}
          aria-label={placeholder}
          value={search}
          onChange={e => this.setState({ search: e.target.value })}
        />
        {showSearchButton && (
          <button
            className={"btn btn-outline-success my-2 my-sm-0"}
            type="submit"
          >
            {searchButtonText}
          </button>
        )}
      </form>
    );
  }
}

SearchComponent.defaultProps = {
  placeholder: "Search",
  showSearchButton: true,
  searchButtonText: "Search",
  onSearch: search => {
    console.log(`Searching for ${search}...`);
  }
};

export default SearchComponent;
