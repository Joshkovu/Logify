import PropTypes from "prop-types";

// Alternating row backgrounds, sticky headers, institutional palette
function Table({ children, className = "" }) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-border bg-surface shadow-md dark:border-slate-700 dark:bg-slate-900 ${className}`}
    >
      <table className="min-w-[720px] w-full divide-y divide-border font-sans text-text-primary">
        {children}
      </table>
    </div>
  );
}

function TableHead({ children }) {
  return (
    <thead className="sticky top-0 z-10 bg-background dark:bg-slate-800 dark:text-slate-300">
      {children}
    </thead>
  );
}

function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-border dark:divide-slate-700">
      {children}
    </tbody>
  );
}

function TableRow({ children, index }) {
  // Alternating backgrounds
  const bgClass =
    index % 2 === 0
      ? "bg-background dark:bg-slate-900"
      : "bg-background dark:bg-slate-900";
  return (
    <tr className={`hover:bg-gold/10 dark:hover:bg-slate-800 ${bgClass}`}>
      {children}
    </tr>
  );
}

function TableCell({ children, className = "", ...props }) {
  return (
    <td
      className={`px-4 py-3 text-text-primary dark:text-slate-100 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

function TableHeaderCell({ children, className = "", ...props }) {
  return (
    <th
      className={`sticky top-0 border-b border-border bg-background px-4 py-3 text-left font-bold uppercase tracking-wider text-maroon dark:border-slate-700 dark:bg-slate-800 dark:text-gold ${className}`}
      scope="col"
      {...props}
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
