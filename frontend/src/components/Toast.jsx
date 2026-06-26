import { useEffect, useState } from "react";

export default function Toast({
  type = "info",
  title,
  message,
  duration = 2200,
  onClose,
}) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      closeToast();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  const closeToast = () => {
    setExiting(true);

    setTimeout(() => {
      onClose?.();
      setExiting(false);
    }, 220);
  };

  if (!message) return null;

  const resolvedTitle =
    title ||
    (type === "success"
      ? "Success"
      : type === "error"
      ? "Error"
      : type === "warning"
      ? "Warning"
      : "Info");

  return (
    <div className="toast-container">
      <div className={`toast ${type} ${exiting ? "exiting" : ""}`}>
        <div>
          <div className="toast-title">{resolvedTitle}</div>
          <div className="toast-message">{message}</div>
        </div>

        <button type="button" className="toast-close" onClick={closeToast}>
          ×
        </button>
      </div>
    </div>
  );
}