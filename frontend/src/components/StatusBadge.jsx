export default function StatusBadge({ status }) {
  const normalizedStatus = status || "unknown";

  const getClassName = () => {
    if (
      normalizedStatus === "completed" ||
      normalizedStatus === "approved" ||
      normalizedStatus === "active"
    ) {
      return "status-badge success";
    }

    if (
      normalizedStatus === "in_progress" ||
      normalizedStatus === "under_review" ||
      normalizedStatus === "needs_clarification" ||
      normalizedStatus === "experimental"
    ) {
      return "status-badge warning";
    }

    if (
      normalizedStatus === "rejected" ||
      normalizedStatus === "duplicate" ||
      normalizedStatus === "deprecated"
    ) {
      return "status-badge danger";
    }

    return "status-badge";
  };

  return <span className={getClassName()}>{normalizedStatus}</span>;
}