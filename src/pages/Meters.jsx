import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout.jsx";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/format";

export default function Meters() {
  const navigate = useNavigate();
  const { data: meters = [] } = useQuery({
    queryKey: ["meters"],
    queryFn: api.listMeters,
  });

  return (
    <Layout title="Meters">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {meters.map((meter) => (
          <button
            key={meter.meterNumber}
            className="card text-left transition hover:-translate-y-1"
            onClick={() => navigate(`/app/meters/${meter.meterNumber}`)}
          >
            <div>
              <p className="text-sm font-semibold">{meter.meterNumber}</p>
              <p className="text-xs text-muted">{meter.location}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="badge-info">{meter.disco}</span>
              <span className="text-sm font-semibold">
                {formatCurrency(meter.currentCredit)}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted">
              <span>Threshold {formatCurrency(meter.threshold)}</span>
              <span className={meter.isActive ? "text-success" : "text-danger"}>
                {meter.isActive ? "Active" : "Paused"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </Layout>
  );
}
