import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, PageHeader, Badge } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

const COMPARISON_FACTORS = [
  { factor: 'Control', iaas: 'Full', paas: 'Limited', saas: 'Minimal' },
  { factor: 'Customization', iaas: 'Maximum', paas: 'High', saas: 'Low' },
  { factor: 'Scalability', iaas: 'Manual/Auto', paas: 'Built-in', saas: 'Provider-managed' },
  { factor: 'Deployment Speed', iaas: 'Slow', paas: 'Fast', saas: 'Fastest' },
  { factor: 'Maintenance', iaas: 'You manage', paas: 'Provider manages', saas: 'Provider manages' },
  { factor: 'Infrastructure Mgmt', iaas: 'You manage', paas: 'Provider manages', saas: 'Provider manages' },
  { factor: 'Security Responsibility', iaas: 'Shared (heavy)', paas: 'Shared (medium)', saas: 'Shared (light)' },
  { factor: 'Integration', iaas: 'Full control', paas: 'API-based', saas: 'Limited APIs' },
  { factor: 'Vendor Lock-in', iaas: 'Low', paas: 'Medium', saas: 'High' },
  { factor: 'Performance Control', iaas: 'Full', paas: 'Moderate', saas: 'Limited' },
  { factor: 'Operational Complexity', iaas: 'High', paas: 'Medium', saas: 'Low' },
];

const RESPONSIBILITY_MATRIX = [
  { component: 'Application', iaas: 'You', paas: 'You', saas: 'Provider' },
  { component: 'Data', iaas: 'You', paas: 'You', saas: 'You / Provider' },
  { component: 'Runtime', iaas: 'You', paas: 'Provider', saas: 'Provider' },
  { component: 'Operating System', iaas: 'You', paas: 'Provider', saas: 'Provider' },
  { component: 'Virtualization', iaas: 'Provider', paas: 'Provider', saas: 'Provider' },
  { component: 'Servers', iaas: 'Provider', paas: 'Provider', saas: 'Provider' },
  { component: 'Storage', iaas: 'Provider', paas: 'Provider', saas: 'Provider' },
  { component: 'Networking', iaas: 'Provider', paas: 'Provider', saas: 'Provider' },
];

export function TechnicalComparisonPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <DashboardLayout>
      <PageHeader title="Technical Comparison" subtitle="IaaS vs PaaS vs SaaS — characteristics and responsibilities" action={<Link to={id ? `/scenarios/${id}/results` : '/dashboard'} className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium"><ArrowLeft className="w-4 h-4" /> Back</Link>} />

      <Card className="p-5 mb-6 overflow-x-auto">
        <h3 className="font-semibold text-gray-800 mb-4">Technical Characteristics</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2.5 px-3 font-medium">Factor</th>
              <th className="py-2.5 px-3 font-medium text-sky-600">IaaS</th>
              <th className="py-2.5 px-3 font-medium text-emerald-600">PaaS</th>
              <th className="py-2.5 px-3 font-medium text-amber-600">SaaS</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_FACTORS.map((row) => (
              <tr key={row.factor} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-700">{row.factor}</td>
                <td className="py-3 px-3 text-gray-600">{row.iaas}</td>
                <td className="py-3 px-3 text-gray-600">{row.paas}</td>
                <td className="py-3 px-3 text-gray-600">{row.saas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-5 mb-6 overflow-x-auto">
        <h3 className="font-semibold text-gray-800 mb-1">Shared Responsibility Matrix</h3>
        <p className="text-sm text-gray-500 mb-4">Who manages each layer of the stack? Exact boundaries vary by provider.</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2.5 px-3 font-medium">Component</th>
              <th className="py-2.5 px-3 font-medium text-sky-600">IaaS</th>
              <th className="py-2.5 px-3 font-medium text-emerald-600">PaaS</th>
              <th className="py-2.5 px-3 font-medium text-amber-600">SaaS</th>
            </tr>
          </thead>
          <tbody>
            {RESPONSIBILITY_MATRIX.map((row) => (
              <tr key={row.component} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-700">{row.component}</td>
                <td className="py-3 px-3"><Badge color={row.iaas === 'You' ? 'blue' : 'slate'}>{row.iaas}</Badge></td>
                <td className="py-3 px-3"><Badge color={row.paas === 'You' ? 'blue' : 'slate'}>{row.paas}</Badge></td>
                <td className="py-3 px-3"><Badge color={row.saas === 'You' ? 'blue' : row.saas === 'Provider' ? 'green' : 'amber'}>{row.saas}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-4 italic">Exact responsibility boundaries vary by provider. This is a general model, not a universal truth.</p>
      </Card>
    </DashboardLayout>
  );
}
