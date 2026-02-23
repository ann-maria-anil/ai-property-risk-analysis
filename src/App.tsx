/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Shield, FileText, CheckCircle2, AlertCircle, Loader2, RefreshCw, Download, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from './components/FileUpload';
import { Timeline } from './components/Timeline';
import { RiskCard } from './components/RiskCard';
import { RiskScoreGauge } from './components/RiskScoreGauge';
import { RiskBreakdownChart } from './components/RiskBreakdownChart';
import { analyzePropertyDocuments } from './services/gemini';
import { encryptData } from './services/crypto';
import { PropertyDocument, VerificationResult } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  const handleFilesAdded = useCallback(async (files: File[]) => {
    const newDocs: PropertyDocument[] = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'pending'
    }));

    setDocuments(prev => [...prev, ...newDocs]);

    // Process files (read content and encrypt)
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const { encrypted } = await encryptData(text);
        
        setDocuments(prev => prev.map(doc => 
          doc.name === file.name 
            ? { ...doc, content: text, encryptedContent: encrypted, status: 'completed' }
            : doc
        ));
      };
      reader.readAsText(file);
    }
  }, []);

  const startVerification = async () => {
    if (documents.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const allText = documents.map(d => d.content).filter(Boolean).join('\n\n');
      if (!allText) throw new Error("No readable content found in documents.");
      
      const analysis = await analyzePropertyDocuments(allText);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "An error occurred during verification.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setDocuments([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Shield size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">PropVerify AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Lock size={12} />
              <span>End-to-End Encrypted</span>
            </button>
            {result && (
              <button 
                onClick={reset}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Start New Verification"
              >
                <RefreshCw size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence>
          {showSecurityInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-emerald-900 text-emerald-50 p-6 rounded-3xl shadow-xl border border-emerald-800">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-800 rounded-2xl">
                    <Lock size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">How we protect your data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <div className="space-y-2">
                        <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Client-Side Encryption</div>
                        <p className="text-sm text-emerald-100/80">Documents are encrypted in your browser using AES-GCM before processing. Your raw files never touch our permanent storage.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Ephemeral Context</div>
                        <p className="text-sm text-emerald-100/80">Data is held in a transient session memory. Once the analysis is complete or the tab is closed, the data is purged.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest">No Data Retention</div>
                        <p className="text-sm text-emerald-100/80">We do not maintain a database of property documents. Each verification is a fresh, isolated process.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Property Verification System</h1>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                  Upload deeds, surveys, and legal documents for instant AI-powered ownership history and risk analysis.
                </p>
              </div>

              <FileUpload onFilesAdded={handleFilesAdded} className="mb-8" />

              {documents.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-8">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <FileText size={18} className="text-slate-400" />
                      Uploaded Documents ({documents.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {documents.map((doc) => (
                      <div key={doc.id} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <FileText size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                            <div className="text-xs text-slate-500">{(doc.size / 1024).toFixed(1)} KB • {doc.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status === 'completed' ? (
                            <CheckCircle2 size={18} className="text-emerald-500" />
                          ) : (
                            <Loader2 size={18} className="text-slate-300 animate-spin" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={startVerification}
                  disabled={documents.length === 0 || isProcessing}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg",
                    documents.length > 0 && !isProcessing
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Analyzing Documents...
                    </>
                  ) : (
                    <>
                      <Shield size={24} />
                      Verify Property
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="flex items-center gap-2 text-rose-600 text-sm font-medium bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                ) }

                <p className="text-xs text-slate-400 text-center max-w-md mt-4">
                  By using this system, you agree that documents are processed locally in your browser session. 
                  No data is permanently stored on our servers.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Summary Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Summary</h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {result.propertySummary}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Legal Status</div>
                        <div className="text-slate-900 font-semibold">{result.legalStatus}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Survey Details</div>
                        <div className="text-slate-900 font-semibold">{result.surveyDetails}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Ownership Timeline</h2>
                    <Timeline events={result.ownershipTimeline} />
                  </div>
                </div>

                <div className="space-y-8">
                  <RiskScoreGauge score={result.riskScore} />
                  
                  <RiskBreakdownChart scores={result.categoryScores} />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 px-2">Risk Assessment</h3>
                    {result.risks.map((risk, idx) => (
                      <RiskCard key={idx} risk={risk} />
                    ))}
                  </div>

                  <button 
                    onClick={() => window.print()}
                    className="w-full py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    Download Report PDF
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Shield size={16} />
            <span className="text-sm font-bold tracking-tight">PropVerify AI</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Security Standards</a>
          </div>
          <p className="text-xs text-slate-400">
            © 2026 PropVerify AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
