import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  isMini?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, isMini }) => {
  if (isMini) {
    return (
      <div className="stat">
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
    );
  }

  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <strong>{value}</strong>
      {subValue && <span className="muted">{subValue}</span>}
    </div>
  );
};
