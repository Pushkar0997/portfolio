/* ─────────────────────────────────────────────────────────────
   Credentials — single source of truth.
   Rendered on the home page trust strip and nowhere else.
   Only the repo owner adds entries.
   ───────────────────────────────────────────────────────────── */

export interface Credential {
  label: string;
  detail: string;
}

export const credentials: Credential[] = [
  { label: 'IBM Certified Quantum Developer', detail: 'Qiskit v2.X, 2026' },
  { label: 'Qiskit Advocate', detail: 'IBM' },
  { label: 'Lead Organizer', detail: 'Qiskit Fall Fest 2026, MIT-ADT' },
  { label: 'Technical Team Lead', detail: 'QQuEST, MIT-ADT University' },
  { label: 'QIntern 2026', detail: 'QWorld' },
  { label: 'WISER Global Quantum+AI Program', detail: 'Completed 2026' },
  { label: 'B.Tech Computer Science', detail: 'AI & Edge Computing, MIT-ADT' },
  { label: 'AWS Academy', detail: 'Cloud Foundations & Architecting, Outstanding' },
];
