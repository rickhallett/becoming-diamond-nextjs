"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IconDownload, IconRefresh, IconSearch } from "@tabler/icons-react";

interface Lead {
  id: string;
  email: string;
  created_at: string;
  status: string;
  referrer: string | null;
  landing_page: string | null;
  email_status: string | null;
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "support@becomingdiamond.com";

export default function LeadsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && session?.user?.email !== ADMIN_EMAIL) {
      router.push("/app");
    }
  }, [status, session, router]);

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/leads?page=${page}&pageSize=50`);

      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.statusText}`);
      }

      const data = await response.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email === ADMIN_EMAIL) {
      fetchLeads();
    }
  }, [status, session, page, fetchLeads]);

  // Export to CSV
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/leads?format=csv`);

      if (!response.ok) {
        throw new Error("Failed to export leads");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to export leads");
    }
  };

  // Filter leads by email
  const filteredLeads = leads.filter(lead =>
    lead.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.email !== ADMIN_EMAIL) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-light mb-2">
          Lead <span className="text-primary">Management</span>
        </h1>
        <p className="text-gray-400">
          View and export email leads captured from the website
        </p>
      </motion.div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-gray-800 rounded-lg hover:border-primary transition-colors"
          >
            <IconRefresh className="h-5 w-5" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <IconDownload className="h-5 w-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-neutral-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Total Leads</p>
          <p className="text-2xl font-light">{total}</p>
        </div>
        <div className="bg-neutral-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Showing</p>
          <p className="text-2xl font-light">{filteredLeads.length}</p>
        </div>
        <div className="bg-neutral-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Page</p>
          <p className="text-2xl font-light">{page}</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-900/50 border-b border-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchEmail ? "No leads match your search" : "No leads found"}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.email_status && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${lead.email_status === "sent"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                            }`}
                        >
                          {lead.email_status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                      {lead.landing_page || lead.referrer || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > 50 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-neutral-900 border border-gray-800 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * 50 >= total}
            className="px-4 py-2 bg-neutral-900 border border-gray-800 rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
