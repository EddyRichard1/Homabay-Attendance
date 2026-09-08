import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignedIn, SignedOut, SignIn, useClerk, useUser } from "@clerk/clerk-react";
import { Search, LogOut, Download, QrCode, X, Mail, Building2, Clock, Globe } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { CONFIG } from "@/lib/config";

export default function AdminDashboardWrapper() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const role = user?.publicMetadata?.role as string | undefined;
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = role === "admin" || (userEmail && CONFIG.ADMIN_EMAILS.includes(userEmail)) || import.meta.env.DEV;

  return (
    <>
      <SignedIn>
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--color-cs-light-bg)] px-6 text-center">
            <h1 className="text-[24px] font-bold text-[#071426]">Access Denied</h1>
            <p className="mt-2 text-[14px] text-[#071426]/60 max-w-[320px]">
              This dashboard is restricted to authorized administrative personnel only.
            </p>
            
            <div className="mt-8 rounded-[12px] border border-[#071426]/5 bg-white p-6 shadow-sm">
              <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[#071426]/40">Diagnostic Info</h2>
              <div className="mt-4 flex flex-col gap-2 text-left">
                <div className="flex justify-between gap-8 text-[13px]">
                  <span className="text-[#071426]/40 text-nowrap">Your Email:</span>
                  <span className="font-mono text-[#071426] truncate max-w-[140px]">{userEmail}</span>
                </div>
                <div className="flex justify-between gap-8 text-[13px]">
                  <span className="text-[#071426]/40 text-nowrap">Current Role:</span>
                  <span className={`font-medium ${role ? "text-[var(--color-cs-blue)]" : "text-amber-500"}`}>
                    {role || "None detected"}
                  </span>
                </div>
              </div>
              <p className="mt-6 text-[11px] text-[#071426]/40 max-w-[280px]">
                To gain access, ensure your email is whitelisted in <code className="bg-slate-100 px-1 py-0.5 rounded">config.ts</code> or set <code className="bg-slate-100 px-1 py-0.5 rounded">role: "admin"</code> in Clerk metadata.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 w-full rounded-[8px] border border-[#071426]/10 py-[8px] text-[12px] font-medium text-[#071426]/60 hover:bg-[#F7F9FC]"
              >
                Refresh Session
              </button>
            </div>
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--color-cs-light-bg)]">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
    </>
  );
}

function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showQR, setShowQR] = useState(false);
  const { signOut } = useClerk();
  const updateStatus = useMutation(api.leads.updateStatus);

  const leads = useQuery(api.leads.list) || [];
  const stats = useQuery(api.leads.stats) || { total: 0, today: 0 };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.organisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.productInterest?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const exportCSV = async () => {
    const headers = ["Name", "Organisation", "Role", "Email", "Phone", "Interest", "Status", "Time", "Date"];
    const rows = leads.map((lead) => {
      const d = new Date(lead.createdAt);
      return [
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.organisation.replace(/"/g, '""')}"`,
        `"${(lead as any).role?.replace(/"/g, '""') || ""}"`,
        `"${lead.email}"`,
        `"${lead.phone}"`,
        `"${lead.productInterest || "general"}"`,
        `"${lead.status}"`,
        `"${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}"`,
        `"${d.toLocaleDateString()}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `craft-silicon-leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const downloadQR = () => {
    const svg = document.getElementById("booth-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const padding = 32;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding, padding);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "booth-qr-code.png";
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--color-cs-light-bg)] pb-12">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-[var(--color-cs-navy-mid)] px-4 py-3 md:px-8 md:py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[14px] font-semibold text-white md:text-[16px]">Booth Leads</h1>
          <span className="hidden text-[12px] text-[var(--color-cs-blue-dark)] sm:inline">
            {stats.total} total
          </span>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-medium text-white transition hover:bg-white/10 md:px-4"
          >
            <QrCode size={14} /> <span className="hidden md:inline">Get QR</span>
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-cs-blue)] px-3 py-2 text-[12px] font-medium text-white transition hover:bg-[var(--color-cs-blue-dark)] md:px-4"
          >
            <Download size={14} /> <span className="hidden md:inline">Export</span>
          </button>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 rounded-lg bg-white/5 p-2 text-white/40 transition hover:bg-white/10 hover:text-white md:px-4 md:py-2 md:text-[12px]"
          >
            <LogOut size={14} /> <span className="hidden md:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071426]/90 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            <button
              onClick={() => setShowQR(false)}
              className="absolute right-4 top-4 text-[#071426]/40 hover:text-[#071426]"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-[20px] font-bold text-[#071426]">Booth QR Code</h2>
              <p className="mt-2 text-[14px] text-[#071426]/60">
                Visitors scan this to access your lead form.
              </p>
              <div className="mt-6 rounded-xl border border-[#071426]/10 p-4 bg-white">
                <QRCodeSVG
                  id="booth-qr-code"
                  value={CONFIG.PUBLIC_URL}
                  size={200}
                  level="H"
                  fgColor="#071426"
                />
              </div>
              <button
                onClick={downloadQR}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-cs-blue)] py-3 text-[15px] font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download size={18} /> Download QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto mt-6 w-full max-w-[1200px] px-4 md:mt-8 md:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-[var(--color-cs-light-border)] bg-white p-4 shadow-sm md:p-6 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-wider text-[#071426]/40">Total Leads</span>
            <div className="mt-1 flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-2xl font-bold text-[#071426] md:text-3xl">{stats.total}</span>
              <Building2 className="text-[var(--color-cs-blue)]/20" size={16} />
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-cs-light-border)] bg-white p-4 shadow-sm md:p-6 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-wider text-[#071426]/40">Today</span>
            <div className="mt-1 flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-2xl font-bold text-[#071426] md:text-3xl">{stats.today}</span>
              <Clock className="text-amber-500/20" size={16} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#071426]/30" size={16} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#071426]/10 bg-white py-3 pl-10 pr-4 text-[14px] text-[#071426] outline-none transition-colors focus:border-[var(--color-cs-blue)]"
            />
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="mt-6 flex flex-col gap-4 md:hidden">
          {filteredLeads.map((lead) => {
            const d = new Date(lead.createdAt);
            return (
              <div key={lead._id} className="rounded-2xl border border-[var(--color-cs-light-border)] bg-white p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-[#071426]">{lead.name}</h3>
                    <div className="flex flex-col gap-0.5 mt-1 text-[12px] text-[#071426]/50">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={12} />
                        <span className="font-semibold">{lead.organisation}</span>
                      </div>
                      <div className="text-[11px] font-medium pl-4.5 italic">
                        {(lead as any).role}
                      </div>
                    </div>
                  </div>
                  <select 
                    value={lead.status}
                    onChange={(e) => updateStatus({ id: lead._id, status: e.target.value })}
                    className={`rounded-lg border-none bg-[var(--color-cs-light-bg)] px-2 py-1 text-[11px] font-bold outline-none ring-1 ring-black/5 ${
                      lead.status === "new" ? "text-amber-600" : 
                      lead.status === "contacted" ? "text-blue-600" : 
                      lead.status === "qualified" ? "text-green-600" : 
                      "text-gray-500"
                    }`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-[var(--color-cs-light-bg)]">
                  <div className="flex items-center gap-2 text-[13px] text-[#071426]/60">
                    <Mail size={14} className="text-[var(--color-cs-blue)]/40" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#071426]/60">
                    <Globe size={14} className="text-[var(--color-cs-blue)]/40" />
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
                      {lead.productInterest?.replace("_", " ") || "general"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-[#071426]/30 mt-2">
                    <Clock size={12} />
                    <span>{d.toLocaleDateString()} at {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Table */}
        <div className="mt-6 hidden w-full overflow-hidden rounded-2xl border border-[var(--color-cs-light-border)] bg-white shadow-sm md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-cs-light-bg)]/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#071426]/40">Name</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#071426]/40">Organisation</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#071426]/40">Interest</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#071426]/40">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#071426]/40">Contact</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#071426]/40 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-cs-light-bg)]">
              {filteredLeads.map((lead) => {
                const d = new Date(lead.createdAt);
                return (
                  <tr key={lead._id} className="group hover:bg-[var(--color-cs-light-bg)]/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-[14px] font-bold text-[#071426]">{lead.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-[#071426]/70">{lead.organisation}</span>
                        <span className="text-[11px] text-[#071426]/40 italic">{(lead as any).role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600 ring-1 ring-blue-100">
                        {lead.productInterest?.replace("_", " ") || "general"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={lead.status}
                        onChange={(e) => updateStatus({ id: lead._id, status: e.target.value })}
                        className={`rounded-lg border-none bg-transparent text-[13px] font-bold outline-none focus:ring-2 focus:ring-[var(--color-cs-blue)]/20 ${
                          lead.status === "new" ? "text-amber-600" : 
                          lead.status === "contacted" ? "text-blue-600" : 
                          lead.status === "qualified" ? "text-green-600" : 
                          "text-gray-500"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#071426]">{lead.email}</span>
                        <span className="text-[11px] text-[#071426]/30">{lead.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[12px] text-[#071426]/40">{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="mt-12 text-center text-[#071426]/40">
            <Search className="mx-auto mb-4 opacity-20" size={48} />
            <p>No leads found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}

