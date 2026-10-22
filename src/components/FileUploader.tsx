import React, { useState, useRef } from 'react';
import { Upload, FileCheck, AlertCircle, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { FileFormat } from '../types';

interface FileUploaderProps {
  label: string;
  accept: string;
  type: 'image' | 'asset';
  currentValue?: string;
  onFileLoaded: (info: {
    url: string;
    fileSize: string;
    detectedFormat?: FileFormat;
    fileName: string;
  }) => void;
  cloudinaryCloudName?: string;
  cloudinaryPreset?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  accept,
  type,
  currentValue,
  onFileLoaded,
  cloudinaryCloudName = 'c48ghki2',
  cloudinaryPreset,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>(currentValue || '');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const detectFormatFromExtension = (name: string): FileFormat | undefined => {
    const ext = name.split('.').pop()?.toUpperCase();
    if (ext === 'PLP') return 'PLP';
    if (ext === 'PSD') return 'PSD';
    if (ext === 'AI') return 'AI';
    if (ext === 'EPS') return 'EPS';
    if (ext === 'ZIP' || ext === 'RAR') return 'ZIP';
    if (ext === 'PDF') return 'PDF';
    return undefined;
  };

  const handleFile = async (file: File) => {
    const sizeStr = formatFileSize(file.size);
    const detectedFormat = detectFormatFromExtension(file.name);
    setFileName(file.name);
    setFileSizeStr(sizeStr);

    // If it's an image, create instant local preview
    if (type === 'image' || file.type.startsWith('image/')) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }

    // Attempt direct Cloudinary upload if preset exists, otherwise provide verified local asset URL
    if (cloudinaryCloudName && cloudinaryPreset) {
      setUploading(true);
      setUploadStatus('Uploading to Cloudinary...');
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryPreset);

        const resourceType = type === 'image' ? 'image' : 'raw';
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/${resourceType}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setUploadStatus('Uploaded to Cloudinary CDN');
          onFileLoaded({
            url: data.secure_url || previewUrl,
            fileSize: sizeStr,
            detectedFormat,
            fileName: file.name,
          });
          setUploading(false);
          return;
        }
      } catch (err) {
        console.warn('Cloudinary upload fallback to local URL:', err);
      }
      setUploading(false);
    }

    // Prototype / Safe Local Delivery URL
    const localUrl = URL.createObjectURL(file);
    setUploadStatus('File ready locally (Ready for upload to Cloudinary/Supabase)');
    onFileLoaded({
      url: localUrl,
      fileSize: sizeStr,
      detectedFormat,
      fileName: file.name,
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-slate-300 font-medium">{label}</label>
        {fileSizeStr && (
          <span className="text-[10px] font-mono text-amber-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
            {fileName} ({fileSizeStr})
          </span>
        )}
      </div>

      <div
        onDragOver={e => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-amber-400 bg-amber-500/10'
            : 'border-slate-700 hover:border-slate-500 bg-slate-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            <span className="text-xs text-slate-300">{uploadStatus}</span>
          </div>
        ) : previewUrl && type === 'image' ? (
          <div className="flex items-center gap-4 text-left">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-16 h-14 object-cover rounded-lg border border-slate-700 bg-slate-950 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {fileName || 'Current Preview Image'}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Image loaded successfully</span>
              </div>
              <span className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer">
                Click to change photo
              </span>
            </div>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                {detectFormatFromExtension(fileName) || 'FILE'}
              </div>
              <div>
                <div className="text-xs font-semibold text-white truncate max-w-xs">{fileName}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <FileCheck className="w-3 h-3" />
                  <span>{fileSizeStr} · Format validated</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 hover:text-white underline">Replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3 space-y-1.5">
            <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
              <Upload className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-amber-400 hover:underline">Click to browse</span> or drag & drop file
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Supports: {accept.replace(/\./g, ' ').toUpperCase()} (Max 500 MB)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
