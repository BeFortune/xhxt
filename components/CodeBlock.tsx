import React from 'react';

interface CodeBlockProps {
  title: string;
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ title, code, language = 'matlab' }) => {
  return (
    <div className="my-6 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{language}</span>
        <span className="text-xs text-slate-400">{title}</span>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-slate-700 whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
};