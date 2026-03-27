import React from "react";

const statusMap = {
  INITIATED: "badge-info",
  OTP_REQUIRED: "badge-warn",
  SUCCESS: "badge-success",
  FAILED: "badge-danger",
};

export default function StatusBadge({ status = "INITIATED" }) {
  const className = statusMap[status] || "badge-info";
  return <span className={className}>{status}</span>;
}
