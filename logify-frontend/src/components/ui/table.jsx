import PropTypes from "prop-types";

function Table({ children, className = "" }) {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-brown-200 bg-white shadow ${className}`}
    >
      <table className="min-w-full divide-y divide-brown-200">{children}</table>
    </div>
  );
}

function TableHead({ children }) {
  return <thead className="bg-brown-100">{children}</thead>;
}

function TableBody({ children }) {
  return <tbody className="divide-y divide-brown-100">{children}</tbody>;
}

function TableRow({ children }) {
  return <tr className="hover:bg-brown-50">{children}</tr>;
}

function TableCell({ children, className = "" }) {
  return (
    <td className={`px-4 py-2 text-brown-900 ${className}`}>{children}</td>
  );
}

function TableHeaderCell({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-2 text-left font-semibold text-brown-800 ${className}`}
    >
      {children}
    </th>
  );
}

export { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell };

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
TableHead.propTypes = {
  children: PropTypes.node,
};
TableBody.propTypes = {
  children: PropTypes.node,
};
TableRow.propTypes = {
  children: PropTypes.node,
};
TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
TableHeaderCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
