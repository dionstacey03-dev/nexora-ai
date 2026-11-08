import { jsPDF } from 'jspdf';
import { SoftwareProject } from '../types';

/**
 * Clean slugify helper for filenames
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Export project architecture as a pristine, structured JSON file
 */
export function exportProjectAsJSON(project: SoftwareProject): void {
  const exportPayload = {
    _meta: {
      generator: 'NEXORA AI',
      tagline: 'Ideas Into Intelligence. Intelligence Into Reality.',
      exportedAt: new Date().toISOString(),
      exportTimestamp: Date.now(),
      version: '2.0.0',
    },
    project: {
      id: project.id,
      name: project.name,
      tagline: project.tagline,
      description: project.description,
      category: project.category,
      complexity: project.complexity,
      targetAudience: project.targetAudience,
      primaryLanguage: project.primaryLanguage,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      problemStatement: project.problemStatement,
      proposedSolution: project.proposedSolution,
      coreFeatures: project.coreFeatures,
      advancedFeatures: project.advancedFeatures,
      techStack: project.techStack,
      databaseDesign: project.databaseDesign,
      apiEndpoints: project.apiEndpoints,
      roadmap: project.roadmap,
      starterCode: project.starterCode,
      readmeMarkdown: project.readmeMarkdown,
      userNotes: project.userNotes,
    },
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(project.name || 'project')}-architecture-blueprint.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export project as a high-fidelity, styled PDF document
 */
export function exportProjectAsPDF(project: SoftwareProject): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // Helper to add a new page with running footer
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 30) {
      addFooter();
      doc.addPage();
      y = margin;
      addRunningHeader();
    }
  };

  const addRunningHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(139, 92, 246);
    doc.text('NEXORA AI  •  SOFTWARE ARCHITECTURE BLUEPRINT', margin, margin - 15);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(project.name.toUpperCase(), pageWidth - margin, margin - 15, { align: 'right' });
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, margin - 8, pageWidth - margin, margin - 8);
    y = margin + 10;
  };

  const addFooter = () => {
    const pageNum = doc.getNumberOfPages();
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Ideas Into Intelligence. Intelligence Into Reality.', margin, pageHeight - 20);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  };

  // --- COVER & HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // Midnight navy
  doc.roundedRect(margin, y, contentWidth, 85, 8, 8, 'F');

  // Decorative violet highlight strip
  doc.setFillColor(139, 92, 246);
  doc.roundedRect(margin, y, 6, 85, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(project.name, margin + 20, y + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text(project.tagline, margin + 20, y + 46);

  // Meta pills inside header
  const categoryStr = `CATEGORY: ${project.category.replace('-', ' ').toUpperCase()}`;
  const langStr = `LANGUAGE: ${project.primaryLanguage.toUpperCase()}`;
  const complexityStr = `TIER: ${project.complexity.replace('-', ' ').toUpperCase()}`;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(168, 85, 247);
  doc.text(`${categoryStr}   •   ${langStr}   •   ${complexityStr}`, margin + 20, y + 68);

  y += 105;

  // --- EXECUTIVE SUMMARY SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. EXECUTIVE ARCHITECTURE OVERVIEW', margin, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const descLines = doc.splitTextToSize(project.description, contentWidth);
  doc.text(descLines, margin, y);
  y += descLines.length * 13 + 12;

  // Problem & Solution Split Box
  checkPageBreak(90);
  const halfWidth = (contentWidth - 12) / 2;

  // Problem Box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, y, halfWidth, 75, 6, 6, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(225, 29, 72);
  doc.text('PROBLEM STATEMENT', margin + 10, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const probLines = doc.splitTextToSize(project.problemStatement, halfWidth - 20);
  doc.text(probLines.slice(0, 4), margin + 10, y + 28);

  // Solution Box
  const solX = margin + halfWidth + 12;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(solX, y, halfWidth, 75, 6, 6, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 163, 74);
  doc.text('PROPOSED TECHNICAL SOLUTION', solX + 10, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const solLines = doc.splitTextToSize(project.proposedSolution, halfWidth - 20);
  doc.text(solLines.slice(0, 4), solX + 10, y + 28);

  y += 90;

  // --- 2. CORE & ADVANCED FEATURES ---
  checkPageBreak(120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. SYSTEM FEATURE MATRIX', margin, y);
  y += 16;

  const allFeatures = [...project.coreFeatures, ...project.advancedFeatures];
  allFeatures.slice(0, 6).forEach((feat) => {
    checkPageBreak(38);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 32, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(feat.title, margin + 10, y + 13);

    // Badges
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`[${feat.priority.toUpperCase()} PRIORITY  •  ${feat.complexity.toUpperCase()}]`, pageWidth - margin - 10, y + 13, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const fLines = doc.splitTextToSize(feat.description, contentWidth - 20);
    doc.text(fLines[0] || '', margin + 10, y + 24);

    y += 36;
  });

  // --- 3. RECOMMENDED TECHNOLOGY STACK ---
  checkPageBreak(120);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. RECOMMENDED TECHNOLOGY STACK', margin, y);
  y += 16;

  project.techStack.forEach((t) => {
    checkPageBreak(32);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 28, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(124, 58, 237);
    doc.text(t.category.toUpperCase(), margin + 10, y + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(t.name, margin + 95, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const rLines = doc.splitTextToSize(t.reason, contentWidth - 105);
    doc.text(rLines[0] || '', margin + 95, y + 22);

    y += 32;
  });

  // --- 4. DATABASE ENTITY DESIGN ---
  checkPageBreak(140);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('4. RELATIONAL DATABASE SCHEMAS & ENTITIES', margin, y);
  y += 16;

  project.databaseDesign.slice(0, 3).forEach((entity) => {
    checkPageBreak(50);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 18, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Entity: ${entity.name}`, margin + 10, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(entity.description, pageWidth - margin - 10, y + 12, { align: 'right' });
    y += 22;

    entity.fields.slice(0, 5).forEach((f) => {
      checkPageBreak(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(109, 40, 217);
      doc.text(f.name, margin + 16, y + 10);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(f.type, margin + 140, y + 10);

      let constraintStr = f.isPrimary ? 'PRIMARY KEY' : f.isForeign ? 'FOREIGN KEY' : '';
      if (constraintStr) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(234, 88, 12);
        doc.text(constraintStr, margin + 240, y + 10);
      }

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(f.description || '', margin + 330, y + 10);

      doc.setDrawColor(241, 245, 249);
      doc.line(margin + 10, y + 13, pageWidth - margin - 10, y + 13);
      y += 15;
    });
    y += 6;
  });

  // --- 5. REST API ENDPOINTS ---
  checkPageBreak(120);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('5. API ENDPOINT SPECIFICATIONS', margin, y);
  y += 16;

  project.apiEndpoints.slice(0, 4).forEach((ep) => {
    checkPageBreak(30);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 26, 4, 4, 'FD');

    // Method badge
    const isGet = ep.method === 'GET';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(isGet ? 37 : 16, isGet ? 99 : 185, isGet ? 235 : 129);
    doc.text(ep.method, margin + 10, y + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(ep.path, margin + 45, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(ep.authRequired ? '🔒 Auth Required' : 'Public', pageWidth - margin - 10, y + 11, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(ep.summary || ep.description, margin + 45, y + 21);

    y += 30;
  });

  // --- 6. DEVELOPMENT ROADMAP PHASES ---
  checkPageBreak(140);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('6. DEVELOPMENT ROADMAP & DELIVERY PHASES', margin, y);
  y += 16;

  project.roadmap.forEach((phase) => {
    checkPageBreak(40);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 20, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(124, 58, 237);
    doc.text(`Phase ${phase.phaseNumber}: ${phase.title}`, margin + 10, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Duration: ${phase.duration}`, pageWidth - margin - 10, y + 13, { align: 'right' });
    y += 24;

    phase.tasks.slice(0, 3).forEach((task) => {
      checkPageBreak(15);
      const isDone = task.status === 'done';
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(isDone ? 22 : 71, isDone ? 163 : 85, isDone ? 74 : 105);
      doc.text(`• [${isDone ? 'COMPLETED' : 'PLANNED'}] ${task.title} (${task.estimatedHours}h)`, margin + 16, y + 10);
      y += 14;
    });
    y += 6;
  });

  // Add footer to final page
  addFooter();

  // Save the generated PDF
  doc.save(`${slugify(project.name || 'project')}-architecture-blueprint.pdf`);
}

/**
 * Open high-res printable report in browser for standard paper printing
 */
export function printProjectExecutiveReport(project: SoftwareProject): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>${project.name} — Architecture Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #0f172a; margin: 0; padding: 2.5cm; }
        .header { border-bottom: 2px solid #7c3aed; padding-bottom: 20px; margin-bottom: 24px; }
        .title { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
        .tagline { font-size: 14px; color: #64748b; margin-top: 4px; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #f1f5f9; color: #475569; margin-right: 6px; margin-top: 8px; }
        .badge-violet { background: #ede9fe; color: #6d28d9; }
        .section { margin-top: 24px; page-break-inside: avoid; }
        .section-title { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6d28d9; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .card { padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; margin-bottom: 10px; }
        .problem-card { background: #fff1f2; border-color: #fecdd3; }
        .solution-card { background: #f0fdf4; border-color: #bbf7d0; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
        th { text-align: left; padding: 6px 8px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-transform: uppercase; color: #64748b; }
        td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
        .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="font-size: 10px; font-weight: 700; color: #7c3aed; letter-spacing: 0.1em; text-transform: uppercase;">NEXORA AI Architecture Blueprint</div>
        <h1 class="title">${project.name}</h1>
        <p class="tagline">${project.tagline}</p>
        <div>
          <span class="badge badge-violet">${project.category.replace('-', ' ').toUpperCase()}</span>
          <span class="badge">${project.primaryLanguage}</span>
          <span class="badge">${project.complexity.replace('-', ' ').toUpperCase()}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">1. Executive Overview</div>
        <p style="font-size: 13px; color: #334155;">${project.description}</p>
        <div class="grid-2" style="margin-top: 12px;">
          <div class="card problem-card">
            <strong style="color: #e11d48; font-size: 11px;">PROBLEM STATEMENT:</strong>
            <p style="font-size: 11px; margin-top: 4px;">${project.problemStatement}</p>
          </div>
          <div class="card solution-card">
            <strong style="color: #16a34a; font-size: 11px;">PROPOSED SOLUTION:</strong>
            <p style="font-size: 11px; margin-top: 4px;">${project.proposedSolution}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">2. Technology Stack Matrix</div>
        <table>
          <thead>
            <tr><th>Category</th><th>Technology</th><th>Rationale</th></tr>
          </thead>
          <tbody>
            ${project.techStack.map(t => `<tr><td><strong>${t.category}</strong></td><td>${t.name}</td><td>${t.reason}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">3. Core Architectural Features</div>
        <table>
          <thead>
            <tr><th>Feature</th><th>Description</th><th>Priority</th><th>Complexity</th></tr>
          </thead>
          <tbody>
            ${[...project.coreFeatures, ...project.advancedFeatures].map(f => `<tr><td><strong>${f.title}</strong></td><td>${f.description}</td><td>${f.priority.toUpperCase()}</td><td>${f.complexity}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">4. API Endpoints</div>
        <table>
          <thead>
            <tr><th>Method</th><th>Endpoint</th><th>Summary</th><th>Access</th></tr>
          </thead>
          <tbody>
            ${project.apiEndpoints.map(e => `<tr><td><strong>${e.method}</strong></td><td><code>${e.path}</code></td><td>${e.summary}</td><td>${e.authRequired ? 'Auth' : 'Public'}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        Generated by NEXORA AI — Ideas Into Intelligence. Intelligence Into Reality.
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
