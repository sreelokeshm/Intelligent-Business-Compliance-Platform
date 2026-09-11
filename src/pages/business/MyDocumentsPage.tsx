import React, { useState, useEffect } from 'react';
import {
  Files,
  Upload,
  FileCheck,
  AlertTriangle,
  Clock,
  Trash2,
  ExternalLink,
  Plus,
  X,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../components/common/Toast.js';
import { api } from '../../lib/api.js';
import { DocumentRecord } from '../../types.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';

export const MyDocumentsPage: React.FC = () => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Form State
  const [uploadData, setUploadData] = useState({
    name: 'Consent to Establish (CTE) Clearance Certificate',
    category: 'Environmental',
    fileName: 'CTE_SPCB_Sanctioned_Permit_2026.pdf',
    fileType: 'application/pdf',
    fileSize: 2450000, // 2.45 MB
    expiryDate: '2027-12-31',
  });
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.documents.get(business?.id);
      setDocuments(res);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [business?.id]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const newDoc = await api.documents.upload({
        ...uploadData,
        businessId: business?.id || 'biz-novatech-01',
      });
      setDocuments((prev) => [newDoc, ...prev]);
      setShowUploadModal(false);
      toast(`Document '${uploadData.name}' uploaded and pre-screened successfully!`, 'success');
    } catch (err: any) {
      toast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, docName: string) => {
    if (!confirm(`Are you sure you want to remove '${docName}'?`)) return;
    try {
      await api.documents.delete(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      toast(`Removed document '${docName}'`, 'info');
    } catch (err: any) {
      toast(err.message || 'Failed to remove document', 'error');
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Files className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Document Intelligence Repository
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Pre-submission validation, cryptographic integrity, and automated expiration monitoring
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white flex items-center gap-1.5 shadow-md shadow-fuchsia-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents by name or filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Registration', 'Environmental', 'Safety', 'Financial', 'Land/Property'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-violet-400 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/50">
                  {doc.category}
                </span>
                <StatusBadge status={doc.verificationStatus} size="sm" />
              </div>

              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2">
                {doc.name}
              </h3>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1 truncate">
                {doc.fileName}
              </p>

              <div className="my-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] space-y-1.5">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>File Size:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Format:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {doc.fileType.split('/')[1]?.toUpperCase() || 'PDF'}
                  </span>
                </div>
                {doc.expiryDate && (
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Expiry Date:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {new Date(doc.expiryDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {doc.validationDetails?.remarks && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                    {doc.validationDetails.remarks}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toast(`Simulated secure preview for ${doc.fileName}`, 'info')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800 transition-colors"
                  title="Preview"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id, doc.name)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="flex flex-col w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upload Statutory Document
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Automated format, size and cryptographic verification check
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadData.name}
                  onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
                  placeholder="e.g. Fire NOC Endorsement Certificate"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
                  >
                    <option value="Registration">Registration</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Safety">Safety</option>
                    <option value="Financial">Financial</option>
                    <option value="Land/Property">Land/Property</option>
                    <option value="Identity">Identity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date (if applicable)
                  </label>
                  <input
                    type="date"
                    value={uploadData.expiryDate}
                    onChange={(e) => setUploadData({ ...uploadData, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium dark:text-white"
                  />
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center hover:border-violet-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                <p className="font-bold text-slate-900 dark:text-white text-xs">
                  {uploadData.fileName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  PDF, PNG or JPG (Max 10MB). Cryptographic checksum generated on upload.
                </p>
              </div>

              {/* Validation Preview */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="font-bold text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Automated Pre-Submission Checks Passed:</span>
                </div>
                <p className="text-[10px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  ✓ File extension accepted • ✓ File size (2.45 MB) within limits • ✓ Expiry date &gt; 90 days
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying & Saving...</span>
                    </>
                  ) : (
                    <span>Upload & Check</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
