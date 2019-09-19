import React, { Component } from "react";
import PropTypes from "prop-types";

class PaginationComponent extends Component {
  state = {
    currentPage: 1,
    startPage: 1,
    endPage: 1,
    totalPages: 1,
    previous: false,
    next: false
  };

  static propTypes = {
    totalRecords: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    maxPages: PropTypes.number.isRequired,
    position: PropTypes.oneOf(["default", "center", "right"]),
    onPaginatorUpdate: PropTypes.func.isRequired
  };

  static getDerivedStateFromProps(props, state) {
    const { maxPages, totalRecords, pageSize, onPaginatorUpdate } = props;
    let { currentPage, startPage, endPage, previous } = state;
    const totalPages = Math.ceil(totalRecords / pageSize);

    if (endPage === 1) {
      let displayingRecords = currentPage * pageSize;
      displayingRecords =
        displayingRecords > totalRecords ? totalRecords : displayingRecords;

      onPaginatorUpdate({
        currentPage,
        totalPages,
        totalRecords,
        displayingRecords
      });

      return {
        currentPage,
        startPage,
        endPage: maxPages > totalPages ? totalPages : maxPages,
        totalPages,
        previous,
        next: currentPage < totalPages
      };
    }

    return null;
  }

  handleNextClick = e => {
    e.preventDefault();

    const { currentPage } = this.state;
    const nextPage = currentPage + 1;

    this.updatePaginator(nextPage);
  };

  handlePreviousClick = e => {
    e.preventDefault();

    let { currentPage } = this.state;
    const previousPage = currentPage - 1;

    this.updatePaginator(previousPage);
  };

  handlePageClick = e => {
    e.preventDefault();

    const currentPage = parseInt(e.target.innerHTML);
    this.updatePaginator(currentPage);
  };

  updatePaginator(page) {
    page = parseInt(page);

    const { totalPages, currentPage } = this.state;
    const { maxPages, totalRecords, pageSize, onPaginatorUpdate } = this.props;
    const currentPageGroup = Math.ceil(page / maxPages);

    let lastPage = currentPageGroup * maxPages;
    lastPage = lastPage > totalPages ? totalPages : lastPage;

    let firstPage = lastPage + 1 - maxPages;
    firstPage = firstPage < 1 ? 1 : firstPage;

    this.setState({
      currentPage: page,
      next: page < totalPages,
      previous: page > 1,
      startPage: firstPage,
      endPage: lastPage
    });

    let displayingRecords = currentPage * pageSize;
    displayingRecords =
      displayingRecords > totalRecords ? totalRecords : displayingRecords;

    onPaginatorUpdate({
      currentPage,
      totalPages,
      totalRecords,
      displayingRecords
    });
  }

  getAlignment() {
    const { position } = this.props;

    switch (position) {
      case "center":
        return "justify-content-center";
      case "right":
        return "justify-content-end";
      default:
        return "";
    }
  }

  render() {
    const { next, previous, currentPage, startPage, endPage } = this.state;
    const aligment = this.getAlignment();
    const pageNumbers = [];

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Page navigation">
        <ul className={`pagination ${aligment}`}>
          <li className={`page-item ${previous ? "" : "disabled"}`}>
            <a
              className="page-link"
              href="#"
              tabIndex={previous ? "" : "-1"}
              onClick={this.handlePreviousClick}
            >
              Previous
            </a>
          </li>
          {pageNumbers.map((pageNumber, index) => (
            <li
              className={`page-item ${
                currentPage === pageNumber ? "active" : ""
              }`}
              key={index}
            >
              <a className="page-link" href="#" onClick={this.handlePageClick}>
                {pageNumber}
              </a>
            </li>
          ))}
          <li className={`page-item ${next ? "" : "disabled"}`}>
            <a
              className="page-link"
              href="#"
              tabIndex={next ? "" : "-1"}
              onClick={this.handleNextClick}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

PaginationComponent.defaultProps = {
  totalRecords: 100,
  pageSize: 10,
  maxPages: 10,
  position: "default",
  onPaginatorUpdate: ({
    currentPage,
    totalPages,
    totalRecords,
    displayingRecords
  }) => {
    console.log(
      `Displaying ${displayingRecords} of ${totalRecords} on page ${currentPage} of ${totalPages}`
    );
  }
};

export default PaginationComponent;
