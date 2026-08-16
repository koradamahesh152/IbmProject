import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getAnalysisByScenarioId } from '@/services/analysisService';
import { logAudit } from '@/services/auditService';
import { Card, LoadingState, ErrorState, PageHeader, Badge } from '@/components/ui';
import { MODEL_INFO, FACTOR_LABELS } from '@/config/scoringRules';
import { COST_DISCLAIMER } from '@/config/costConfig';
import type { AnalysisResult, CloudModel } from '@/types';
import { Download, ArrowLeft, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

export function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    const { data, error } = await getAnalysisByScenarioId(id);
    if (error) setError(error);
    else setResult(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function downloadPDF() {
    if (!result) return;
    const { analysis, scenario, costEstimates } = result;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('Cloud Service Model Decision Report', 20, y); y += 10;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y); y += 15;

    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('1. Organization & Scenario', 20, y); y += 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Organization: ${scenario.organization_name}`, 20, y); y += 6;
    doc.text(`Industry: ${scenario.industry}`, 20, y); y += 6;
    doc.text(`Scenario: ${scenario.name}`, 20, y); y += 6;
    doc.text(`Application Type: ${scenario.application_type}`, 20, y); y += 6;
    doc.text(`Users: ${scenario.user_count.toLocaleString()}`, 20, y); y += 10;

    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('2. Scores', 20, y); y += 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`IaaS: ${analysis.iaas_score}/100`, 20, y); y += 6;
    doc.text(`PaaS: ${analysis.paas_score}/100`, 20, y); y += 6;
    doc.text(`SaaS: ${analysis.saas_score}/100`, 20, y); y += 6;
    doc.text(`Recommended: ${MODEL_INFO[analysis.recommended_model].name}`, 20, y); y += 6;
    doc.text(`Confidence: ${analysis.confidence} (gap: ${analysis.confidence_difference} pts)`, 20, y); y += 10;

    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('3. Reasons', 20, y); y += 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    analysis.reasons.forEach((r) => { doc.text(`- ${r}`, 22, y, { maxWidth: 170 }); y += 10; });

    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('4. Advantages', 20, y); y += 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    analysis.advantages.forEach((a) => { doc.text(`+ ${a}`, 22, y, { maxWidth: 170 }); y += 6; });
    y += 4;

    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('5. Trade-offs', 20, y); y += 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    analysis.tradeoffs.forEach((t) => { doc.text(`- ${t}`, 22, y, { maxWidth: 170 }); y += 6; });
    y += 4;

    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('6. Cost Estimates', 20, y); y += 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    (['iaas', 'paas', 'saas'] as CloudModel[]).forEach((m) => {
      const ce = costEstimates.find((c) => c.model === m);
      if (!ce) return;
      doc.text(`${MODEL_INFO[m].name}: $${ce.monthly_cost.toLocaleString()}/mo, $${ce.annual_cost.toLocaleString()}/yr, 3yr TCO: $${ce.three_year_tco.toLocaleString()}`, 20, y, { maxWidth: 170 }); y += 8;
    });
    y += 4;

    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('7. Conclusion', 20, y); y += 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Based on the weighted analysis of ${analysis.factor_scores.length} factors, ${MODEL_INFO[analysis.recommended_model].name} is recommended with ${analysis.confidence} confidence.`, 20, y, { maxWidth: 170 }); y += 10;
    doc.setFontSize(8); doc.setFont('helvetica', 'italic');
    doc.text(COST_DISCLAIMER, 20, y, { maxWidth: 170 });

    doc.save(`cloud-report-${scenario.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    await logAudit('generate_report', 'analysis', analysis.id, { scenario: scenario.name });
  }

  if (loading) return <DashboardLayout><LoadingState message="Loading report..." /></DashboardLayout>;
  if (error) return <DashboardLayout><ErrorState message={error} onRetry={load} /></DashboardLayout>;
  if (!result) return <DashboardLayout><ErrorState message="No analysis found." /></DashboardLayout>;

  const { analysis, scenario, costEstimates } = result;
  const recInfo = MODEL_INFO[analysis.recommended_model];

  return (
    <DashboardLayout>
      <PageHeader title="Decision Report" subtitle={scenario.name} action={
        <div className="flex gap-2">
          <Link to={`/scenarios/${scenario.id}/results`} className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 font-medium"><ArrowLeft className="w-4 h-4" /> Back</Link>
          <button onClick={downloadPDF} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      } />

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-slate-700" />
          <h2 className="text-xl font-bold text-gray-800">Cloud Service Model Decision Report</h2>
        </div>

        <Section title="1. Organization">
          <Row label="Organization" value={scenario.organization_name} />
          <Row label="Industry" value={scenario.industry} />
          <Row label="Scenario" value={scenario.name} />
          <Row label="Application Type" value={scenario.application_type} />
          <Row label="Users" value={scenario.user_count.toLocaleString()} />
          {scenario.description && <Row label="Description" value={scenario.description} />}
        </Section>

        <Section title="2. Scores & Recommendation">
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            {(['iaas', 'paas', 'saas'] as CloudModel[]).map((m) => {
              const score = m === 'iaas' ? analysis.iaas_score : m === 'paas' ? analysis.paas_score : analysis.saas_score;
              const info = MODEL_INFO[m];
              return (
                <div key={m} className={`p-3 rounded-lg border ${analysis.recommended_model === m ? 'border-slate-800 bg-slate-50' : 'border-gray-200'}`}>
                  <p className="text-sm font-medium" style={{ color: info.color }}>{info.name}</p>
                  <p className="text-2xl font-bold text-gray-800">{score}<span className="text-sm text-gray-400">/100</span></p>
                </div>
              );
            })}
          </div>
          <Row label="Recommended Model" value={recInfo.name} />
          <Row label="Confidence" value={`${analysis.confidence} (gap: ${analysis.confidence_difference} pts)`} />
          <Row label="Ranking" value={analysis.ranking.map((m) => MODEL_INFO[m].name).join(' > ')} />
        </Section>

        <Section title="3. Reasons for Recommendation">
          <ul className="space-y-2">{analysis.reasons.map((r, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-emerald-500">✓</span><span>{r}</span></li>)}</ul>
        </Section>

        <Section title="4. Advantages">
          <ul className="space-y-1.5">{analysis.advantages.map((a, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-emerald-500">+</span><span>{a}</span></li>)}</ul>
        </Section>

        <Section title="5. Trade-offs">
          <ul className="space-y-1.5">{analysis.tradeoffs.map((t, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-amber-500">•</span><span>{t}</span></li>)}</ul>
        </Section>

        <Section title="6. Cost Estimates">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200 text-left text-gray-500"><th className="py-2 px-3">Model</th><th className="py-2 px-3 text-right">Monthly</th><th className="py-2 px-3 text-right">Annual</th><th className="py-2 px-3 text-right">3-Year TCO</th></tr></thead>
              <tbody>
                {(['iaas', 'paas', 'saas'] as CloudModel[]).map((m) => {
                  const ce = costEstimates.find((c) => c.model === m);
                  if (!ce) return null;
                  return (
                    <tr key={m} className="border-b border-gray-100">
                      <td className="py-2.5 px-3 font-medium" style={{ color: MODEL_INFO[m].color }}>{MODEL_INFO[m].name}</td>
                      <td className="py-2.5 px-3 text-right">${ce.monthly_cost.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">${ce.annual_cost.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-semibold">${ce.three_year_tco.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-amber-600 mt-3 italic">{COST_DISCLAIMER}</p>
        </Section>

        <Section title="7. Conclusion">
          <p className="text-sm text-gray-600">
            Based on the weighted analysis of {analysis.factor_scores.length} factors across technical (40%), operational (25%), financial (20%), and business (15%) categories,
            <span className="font-semibold" style={{ color: recInfo.color }}> {recInfo.name}</span> is recommended with <span className="font-medium">{analysis.confidence}</span> confidence.
            The score gap between the top and runner-up model is {analysis.confidence_difference} points.
          </p>
        </Section>
      </Card>
    </DashboardLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mb-6 pb-6 border-b border-gray-100 last:border-0"><h3 className="font-semibold text-gray-800 mb-3">{title}</h3>{children}</div>;
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between py-1 text-sm"><span className="text-gray-500">{label}</span><span className="font-medium text-gray-800 text-right">{value}</span></div>;
}
