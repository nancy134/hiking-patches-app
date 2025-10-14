'use client';

import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import Header from '@/components/Header';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import Papa from 'papaparse';

// GraphQL
import { listTrails } from '@/graphql/queries';
import { createTrail, updateTrail, deleteTrail } from '@/graphql/mutations';
import type { GraphQLResult } from '@aws-amplify/api';
import type { ListTrailsQuery, Trail } from '@/API';

import TrailFormModal from '@/components/TrailFormModal';

const client = generateClient();
const ITEMS_PER_PAGE = 15;

export default function AdminTrailsPage() {
  const { isAdmin } = useAuth();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Trail> | null>(null);

  useEffect(() => { fetchTrails(); }, []);

  async function fetchTrails() {
    const all: any[] = [];
    let nextToken: string | null | undefined = null;
    do {
      const resp: GraphQLResult<ListTrailsQuery> = await client.graphql({
        query: listTrails,
        variables: { limit: 1000, nextToken },
      });
      const conn = resp.data?.listTrails;
      if (conn?.items?.length) all.push(...conn.items);
      nextToken = conn?.nextToken ?? null;
    } while (nextToken);
    setTrails(all.filter(Boolean));
  }

  function openNew() { setEditing(null); setShowModal(true); }
  function openEdit(t: Trail) { setEditing(t); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleDelete(id: string) {
    if (!confirm('Delete this trail?')) return;
    await client.graphql({ query: deleteTrail, variables: { input: { id } }, authMode: 'userPool' });
    fetchTrails();
  }

  function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (res) => {
        const rows = res.data as Array<Partial<Trail>>;
        setImporting(true);
        setImportProgress({ current: 0, total: rows.length });
        for (let i = 0; i < rows.length; i++) {
          const r = rows[i];
          if (!r.name || r.lengthMiles == null) { setImportProgress({ current: i + 1, total: rows.length }); continue; }
          const input = {
            name: String(r.name),
            description: r.description ? String(r.description) : undefined,
            lengthMiles: Number(r.lengthMiles),
          };
          try {
            await client.graphql({ query: createTrail, variables: { input }, authMode: 'userPool' });
          } catch (err) { console.error('createTrail failed', input, err); }
          setImportProgress({ current: i + 1, total: rows.length });
        }
        setImporting(false);
        fetchTrails();
      },
      error: (err) => { console.error('CSV parse error', err); setImporting(false); }
    });
    e.target.value = '';
  }

  if (isAdmin === null) return <p className="p-6">Checking permissions…</p>;
  if (!isAdmin) return (
    <div className="p-6 max-w-5xl mx-auto">
      <Header />
      <p className="text-red-600 font-semibold">⛔ Access denied. Admins only.</p>
    </div>
  );

  const filtered = trails.filter(t => (t.name ?? '').toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="p-4">
      <Header />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold mr-auto">🏞️ Admin: Manage Trails</h1>
        <button onClick={openNew} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Add Trail</button>
        <label className="ml-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Import CSV
          <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" disabled={importing}/>
        </label>
        {importing && (
          <div className="text-blue-600">
            Importing {importProgress.current} of {importProgress.total}…
          </div>
        )}
      </div>

      {showModal && (
        <TrailFormModal
          trail={editing}
          onClose={() => { closeModal(); }}
          onSaved={() => { closeModal(); fetchTrails(); }}
        />
      )}

      <div className="mb-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by trail name…"
          className="border border-gray-300 px-3 py-2 rounded w-full max-w-sm"
        />
      </div>

      <div className="flex justify-center items-center gap-2 mt-4 mb-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
      </div>

      <table className="w-full table-auto border border-collapse mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Length (mi)</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((t) => (
            <tr key={t.id}>
              <td className="border px-4 py-2">
                <Link href={`/admin/trails/${t.id}`} className="text-blue-600 underline hover:text-blue-800">
                  {t.name}
                </Link>
              </td>
              <td className="border px-4 py-2">{t.lengthMiles}</td>
              <td className="border px-4 py-2 space-x-2">
                <button onClick={() => openEdit(t)} className="text-blue-600 underline">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

