import React, { useState } from "react";
import { AlertTriangle, CheckCircle, Info, ChevronRight, Eye, EyeOff } from "lucide-react";
import RevealableCell, { maskMobile, maskAccount } from "./RevealableCell";

/* ─── masking helpers ─────────────────────────────────────── */

/* ─── Main component ─────────────────────────────────────── */
const TransactionList = ({ transactions, loading, onTransactionClick, user }) => {
  const isAdmin = user?.role === "Admin";

  if (loading) {
    return (
      <div className="glass-card p-12 text-center animate-pulse">
        <div className="mx-auto w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Downloading encrypted cloud data...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <Info className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-bold">No transactions detected in this cycle</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Waiting for auto-generation or manual entry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sensitive data notice */}
      {!isAdmin && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/30 border border-border/30 text-[10px] text-muted-foreground font-bold uppercase tracking-wide">
          <EyeOff className="w-3.5 h-3.5 shrink-0" />
          Sensitive fields (mobile numbers) are masked & blurred. Admin authorization required to reveal full data.
        </div>
      )}
      {isAdmin && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-[10px] text-primary font-bold uppercase tracking-wide">
          <Eye className="w-3.5 h-3.5 shrink-0" />
          Admin view: click the eye icon to reveal sensitive data.
        </div>
      )}

      {/* Desktop Table View (Show only on 1024px+) */}
      <div className="hidden lg:block glass-card overflow-hidden !p-0 border border-border/40 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 border-b border-border/40">
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Transaction ID</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Type</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Mode</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 text-right">Amount (₹)</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Sender</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Mobile</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Receiver</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Fraud Status</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 text-right">Risk Score</th>
                <th className="px-4 py-5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {transactions.map((tx) => (
                <tr
                  key={tx.transactionId}
                  onClick={() => onTransactionClick && onTransactionClick(tx)}
                  className="group hover:bg-primary/5 transition-all duration-200 cursor-pointer active:scale-[0.99] origin-left animate-row-highlight"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold opacity-80 group-hover:text-primary transition-colors">
                      {tx.transactionId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight ${tx.transactionType === 'Credit' ? 'text-green-500 bg-green-500/10' : 'text-blue-500 bg-blue-500/10'}`}>
                      {tx.transactionType?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm opacity-80">{tx.transactionMode}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold">
                      {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(tx.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm opacity-70 truncate max-w-[80px] block">{tx.senderId}</span>
                  </td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <RevealableCell
                      value={tx.senderMobile}
                      masked={maskMobile(tx.senderMobile)}
                      isAdmin={isAdmin}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm opacity-70 truncate max-w-[80px] block">{tx.receiverId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      {tx.isFraud ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-destructive uppercase">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Fraud
                        </span>
                      ) : tx.isMediumRisk ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-warning uppercase">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Medium Risk
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-accent uppercase">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Safe
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-bold ${tx.isFraud ? 'text-destructive' : tx.isMediumRisk ? 'text-warning' : 'text-accent'}`}>
                        {Math.round(tx.fraudScore * 100)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View (Show on everything below 1024px) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden w-full overflow-hidden">
        {transactions.map((tx) => (
          <div
            key={tx.transactionId}
            onClick={() => onTransactionClick && onTransactionClick(tx)}
            className="glass-card p-5 space-y-4 relative overflow-hidden active:scale-[0.98] transition-transform w-full"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${tx.isFraud ? 'bg-destructive' : tx.isMediumRisk ? 'bg-warning' : 'bg-accent'}`} />
            
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 truncate">TXID: {tx.transactionId}</p>
                <div className="flex items-center gap-2">
                   <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-tight ${tx.transactionType === 'Credit' ? 'text-green-500 bg-green-500/10' : 'text-blue-500 bg-blue-500/10'}`}>
                      {tx.transactionType?.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium truncate">{tx.transactionMode}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold">₹{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0 }).format(tx.amount)}</p>
                <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                  tx.isFraud ? 'bg-destructive/10 text-destructive' : tx.isMediumRisk ? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'
                }`}>
                  {tx.isFraud ? 'Fraud' : tx.isMediumRisk ? 'Medium Risk' : 'Safe'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
              <div className="min-w-0">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">Sender</p>
                <p className="text-xs font-bold truncate">{tx.senderId}</p>
                <div className="mt-1 overflow-hidden" onClick={e => e.stopPropagation()}>
                   <RevealableCell
                      value={tx.senderMobile}
                      masked={maskMobile(tx.senderMobile)}
                      isAdmin={isAdmin}
                    />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">Receiver</p>
                <p className="text-xs font-bold truncate">{tx.receiverId}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
               <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-muted-foreground shrink-0">Score</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${tx.isFraud ? 'bg-destructive' : tx.isMediumRisk ? 'bg-warning' : 'bg-accent'}`}
                      style={{ width: `${Math.min(100, tx.fraudScore * 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-black shrink-0 ${tx.isFraud ? 'text-destructive' : tx.isMediumRisk ? 'text-warning' : 'text-accent'}`}>
                    {Math.round(tx.fraudScore * 100)}
                  </span>
               </div>
               <ChevronRight className="w-5 h-5 text-muted-foreground/30 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default TransactionList;