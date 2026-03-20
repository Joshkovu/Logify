import PropTypes from "prop-types";

// Alternating row backgrounds, sticky headers, institutional palette
function Table({ children, className = "" }) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-border bg-surface shadow-md ${className}`}
    >
      <table className="min-w-[720px] w-full divide-y divide-border font-sans text-text-primary">
        {children}
      </table>
    </div>
  );
}

function TableHead({ children }) {
  return <thead className="bg-background sticky top-0 z-10">{children}</thead>;
}

function TableBody({ children }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

function TableRow({ children, index }) {
  // Alternating backgrounds
  const bgClass = index % 2 === 0 ? "bg-background" : "bg-background";
  return <tr className={`hover:bg-gold/10 ${bgClass}`}>{children}</tr>;
}

function TableCell({ children, className = "" }) {
  return (
    <td className={`px-4 py-3 text-text-primary ${className}`}>{children}</td>
  );
}

function TableHeaderCell({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-left font-bold text-maroon uppercase tracking-wider sticky top-0 bg-background border-b border-border ${className}`}
      scope="col"
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
  index: PropTypes.number,
};
TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
TableHeaderCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
