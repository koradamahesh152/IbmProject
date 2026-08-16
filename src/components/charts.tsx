import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { MODEL_INFO } from '@/config/scoringRules';
import type { FactorScore, CloudModel } from '@/types';

const MODEL_COLORS: Record<CloudModel, string> = {
  iaas: MODEL_INFO.iaas.color,
  paas: MODEL_INFO.paas.color,
  saas: MODEL_INFO.saas.color,
};

// ============================================================
// Score Bar Chart — IaaS vs PaaS vs SaaS scores
// ============================================================

export function ScoreBarChart({ scores }: { scores: { model: CloudModel; score: number }[] }) {
  const data = scores.map((s) => ({
    name: MODEL_INFO[s.model].name,
    score: s.score,
    color: MODEL_COLORS[s.model],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number) => [`${value}/100`, 'Score']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// Factor Radar Chart — Multi-factor comparison
// ============================================================

export function FactorRadarChart({ factorScores }: { factorScores: FactorScore[] }) {
  const data = factorScores.map((f) => ({
    factor: f.factor
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim(),
    IaaS: f.iaasScore,
    PaaS: f.paasScore,
    SaaS: f.saasScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10 }} />
        <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
        <Radar name="IaaS" dataKey="IaaS" stroke={MODEL_COLORS.iaas} fill={MODEL_COLORS.iaas} fillOpacity={0.15} />
        <Radar name="PaaS" dataKey="PaaS" stroke={MODEL_COLORS.paas} fill={MODEL_COLORS.paas} fillOpacity={0.15} />
        <Radar name="SaaS" dataKey="SaaS" stroke={MODEL_COLORS.saas} fill={MODEL_COLORS.saas} fillOpacity={0.15} />
        <Legend />
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// Model Distribution Pie Chart
// ============================================================

export function DistributionPieChart({ data }: { data: { model: string; count: number }[] }) {
  const colors: Record<string, string> = {
    IaaS: MODEL_COLORS.iaas,
    PaaS: MODEL_COLORS.paas,
    SaaS: MODEL_COLORS.saas,
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="model"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(entry) => `${entry.model}: ${entry.count}`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.model] || '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// Cost Comparison Bar Chart
// ============================================================

export function CostBarChart({ data }: { data: { model: string; monthly: number; annual: number; tco: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="model" tick={{ fontSize: 13, fontWeight: 600 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        <Legend />
        <Bar dataKey="monthly" name="Monthly" fill={MODEL_COLORS.iaas} radius={[4, 4, 0, 0]} />
        <Bar dataKey="annual" name="Annual" fill={MODEL_COLORS.paas} radius={[4, 4, 0, 0]} />
        <Bar dataKey="tco" name="3-Year TCO" fill={MODEL_COLORS.saas} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// TCO Line Chart — Cost over 3 years
// ============================================================

export function TCOLineChart({ iaas, paas, saas }: { iaas: number; paas: number; saas: number }) {
  const months = Array.from({ length: 37 }, (_, i) => i);
  const data = months.map((m) => ({
    month: m,
    IaaS: Math.round(iaas * m),
    PaaS: Math.round(paas * m),
    SaaS: Math.round(saas * m),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => (v % 6 === 0 ? `M${v}` : '')}
        />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
          labelFormatter={(label) => `Month ${label}`}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        <Legend />
        <Line type="monotone" dataKey="IaaS" stroke={MODEL_COLORS.iaas} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="PaaS" stroke={MODEL_COLORS.paas} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="SaaS" stroke={MODEL_COLORS.saas} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
