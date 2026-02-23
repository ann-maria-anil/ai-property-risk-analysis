import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded, className }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4",
        isDragActive ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300 bg-white",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
        <Upload size={32} />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-slate-900">
          {isDragActive ? "Drop the documents here" : "Upload property documents"}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Drag and drop or click to select files (PDF, DOCX, TXT)
        </p>
      </div>
      <div className="flex gap-2 mt-2">
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">Deeds</span>
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">Surveys</span>
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">Tax Records</span>
      </div>
    </div>
  );
};
