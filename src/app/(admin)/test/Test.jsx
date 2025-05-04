import React from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";

import "@inovua/reactdatagrid-community/index.css";

const gridStyle = { minHeight: 400 };

const columns = [
  { name: "id", header: "ID", defaultFlex: 1 },
  { name: "name", header: "Name", defaultFlex: 2, editable: true },
  { name: "age", header: "Age", defaultFlex: 1, editable: true },
];

const dataSource = [
  { id: 1, name: "Aju", age: 25 },
  { id: 2, name: "Rahul", age: 30 },
];

const MyGrid = () => {
  return (
    <ReactDataGrid
      idProperty="id"
      columns={columns}
      dataSource={dataSource}
      style={gridStyle}
    />
  );
};

export default MyGrid;
