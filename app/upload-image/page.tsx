"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Upload, X, CheckCircle, AlertCircle, Loader, Image as ImageIcon, Video } from 'lucide-react';

type UploadType = 'archive' | 'monastery' | 'festival' | 'profile';

interface UploadedFile {
  imageUrl: string;
  type: UploadType;
  uploadedAt?: Date;
  caption?: string;
}

interface FileWithMetadata {
  file: File;
  type: UploadType;
  caption: string;
}

export default function UploadPage() {
  const { data: session } = useSession();
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileWithMetadata[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const uploadTypeLabels: Record<UploadType, string> = {
    archive: 'Archive',
    monastery: 'Monastery',
    festival: 'Festival',
    profile: 'Profile'
  };

  const uploadTypeColors: Record<UploadType, string> = {
    archive: 'from-amber-600 to-amber-700',
    monastery: 'from-orange-600 to-orange-700',
    festival: 'from-red-600 to-red-700',
    profile: 'from-yellow-600 to-amber-600'
  };

  useEffect(() => {
    if (session?.user) {
      // Fetch existing uploads if needed
    }
  }, [session]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const addFilesToQueue = (files: FileList) => {
    const newFiles: FileWithMetadata[] = Array.from(files).map(file => ({
      file,
      type: 'monastery' as UploadType,
      caption: ''
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFilesToQueue(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToQueue(e.target.files);
    }
  };

  const updateFileMetadata = (index: number, type: UploadType, caption: string) => {
    setSelectedFiles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], type, caption };
      return updated;
    });
  };

  const removeFileFromQueue = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!session?.user || !selectedFiles.length) {
      setError('Please select files and sign in');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('userId', (session.user as any).id);

      selectedFiles.forEach((item) => {
        formData.append('files', item.file);
        formData.append('types', item.type);
        formData.append('descriptions', item.caption);
      });

      const res = await fetch('/api/uploadimg', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      const uploadedFiles = data.uploaded.map((u: any) => ({
        ...u,
        uploadedAt: new Date(u.uploadedAt)
      }));

      setUploads(prev => [...uploadedFiles, ...prev]);
      setSelectedFiles([]);
      setSuccess(`Successfully uploaded ${uploadedFiles.length} file(s)!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const removeUpload = (imageUrl: string) => {
    setUploads(prev => prev.filter(u => u.imageUrl !== imageUrl));
  };

  const getFileIcon = (fileName: string) => {
    return fileName.toLowerCase().match(/\.(mp4|avi|mov|mkv)$/) ? 
      <Video size={16} /> : 
      <ImageIcon size={16} />;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="inline-block p-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full mb-4">
              <Upload className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-amber-900 mb-2">Upload Media</h1>
          <p className="text-amber-700">Please sign in to share with the monastery community</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-200 to-transparent rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-200 to-transparent rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"></div>
              <h1 className="text-4xl md:text-5xl font-serif text-amber-900">Upload Media</h1>
              <div className="h-1 w-12 bg-gradient-to-l from-amber-600 to-orange-600 rounded-full"></div>
            </div>
            <p className="text-amber-700 text-lg">Share sacred moments with the monastery community</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-600 rounded-lg flex items-start gap-4 animate-in fade-in slide-in-from-top">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 rounded-lg flex items-start gap-4 animate-in fade-in slide-in-from-top">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Upload Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100/50 p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
            
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 mb-8 ${
                isDragging
                  ? 'border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 scale-105'
                  : 'border-amber-300 bg-gradient-to-br from-amber-50/50 to-orange-50/30 hover:border-amber-500'
              }`}
            >
              <div className="mb-4">
                <div className={`inline-block p-4 rounded-full mb-4 ${isDragging ? 'bg-amber-600' : 'bg-gradient-to-br from-amber-600 to-orange-600'} transition-colors`}>
                  <Upload className="text-white" size={32} />
                </div>
              </div>
              <p className="text-amber-900 font-semibold text-lg mb-2">
                Drag and drop your files here
              </p>
              <p className="text-amber-700 text-sm mb-6">Images and videos up to any size</p>
              <label className="inline-block">
                <span className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg cursor-pointer hover:from-amber-700 hover:to-orange-700 transition-all font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Browse Files
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileInput}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Selected Files Queue */}
            {selectedFiles.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-amber-900">
                    Selected Files ({selectedFiles.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {selectedFiles.map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-amber-600">
                              {getFileIcon(item.file.name)}
                            </div>
                            <p className="text-sm font-semibold text-amber-900 truncate">
                              {item.file.name}
                            </p>
                          </div>
                          <p className="text-xs text-amber-600">
                            {(item.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => removeFileFromQueue(index)}
                          disabled={isUploading}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-100/50 p-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Type Selection */}
                      <div className="mb-4">
                        <label className="text-xs font-semibold text-amber-900 block mb-2">
                          Upload Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(Object.keys(uploadTypeLabels) as UploadType[]).map(type => (
                            <button
                              key={type}
                              onClick={() => updateFileMetadata(index, type, item.description)}
                              disabled={isUploading}
                              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                                item.type === type
                                  ? `bg-gradient-to-br ${uploadTypeColors[type]} text-white shadow-md`
                                  : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-50 hover:border-amber-400'
                              }`}
                            >
                              {uploadTypeLabels[type]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-xs font-semibold text-amber-900 block mb-2">
                          Caption (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.caption}
                          onChange={(e) => updateFileMetadata(index, item.type, e.target.value)}
                          placeholder="Add a meaningful caption..."
                          disabled={isUploading}
                          className="w-full px-4 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-amber-900 placeholder-amber-500/60 disabled:bg-amber-100/30 bg-white/50 backdrop-blur-sm transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload Button */}
                <button
                  onClick={uploadFiles}
                  disabled={isUploading}
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all disabled:from-amber-400 disabled:to-orange-400 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0"
                >
                  {isUploading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Uploads Grid */}
          {uploads.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full"></div>
                <h2 className="text-3xl font-serif text-amber-900">
                  Your Uploads ({uploads.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploads.map((upload, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-amber-100/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Thumbnail */}
                    <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 aspect-square overflow-hidden">
                      <img
                        src={upload.imageUrl}
                        alt="upload"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <button
                        onClick={() => removeUpload(upload.imageUrl)}
                        className="absolute top-3 right-3 bg-red-500/90 backdrop-blur text-white p-2 rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className={`text-xs font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${uploadTypeColors[upload.type]}`}>
                          {uploadTypeLabels[upload.type]}
                        </span>
                      </div>
                      {upload.caption && (
                        <p className="text-sm text-amber-900 mb-3 line-clamp-2 font-medium">
                          {upload.caption}
                        </p>
                      )}
                      <p className="text-xs text-amber-600 font-semibold">
                        {upload.uploadedAt ? new Date(upload.uploadedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Recently uploaded'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {uploads.length === 0 && selectedFiles.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block p-4 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full mb-6">
                <Upload className="text-white" size={40} />
              </div>
              <p className="text-amber-700 text-lg font-medium">No uploads yet</p>
              <p className="text-amber-600">Start by selecting files above to share with the community</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}