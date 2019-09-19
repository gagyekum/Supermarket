import React, { Component } from "react";
import PropTypes from "prop-types";
import "./styles/TableComponent.css";

class TableComponent extends Component {
  state = {};

  static propTypes = {
    caption: PropTypes.string.isRequired,
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    records: PropTypes.arrayOf(PropTypes.object),
    idField: PropTypes.string.isRequired,
    onRowClick: PropTypes.func.isRequired,
  };

  handleRowClick = id => {
    const {onRowClick} = this.props;
    onRowClick(id);
  };

  render() {
    const { caption, headers, records, idField } = this.props;
    let fields = Object.keys(records[0]);

    if (fields.includes(idField)) {
      fields = fields.filter(prop => prop !== idField);
    } else {
      console.error(`Id field: ${idField} isn't found in record fields.`);
    }

    if (headers.length !== fields.length) {
      console.error("Table headers count doesn't match record fields count.");
    }

    return (
      <div className="table-responsive">
        <table className={"table table-hover"}>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th scope="col" key={index}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record[idField] || index}
                onClick={e => this.handleRowClick(record[idField] || index)}
              >
                {fields.map((prop, index) => (
                  <td key={index}>{record[prop]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

TableComponent.defaultProps = {
  caption: "List of data",
  headers: ["#", "First", "Last", "Handle"],
  records: [
    {
      id: Date.now() + 1,
      row: 1,
      firstName: "Mark",
      lastName: "Otto",
      handle: "@mdo"
    },
    {
      id: Date.now() + 2,
      row: 2,
      firstName: "Gideon",
      lastName: "Agyekum",
      handle: "@gide"
    }
  ],
  idField: "id",
  onRowClick: (id) => {
    console.log('Clicked row id:', id);
  },
};

export default TableComponent;
