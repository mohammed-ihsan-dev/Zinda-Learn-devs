import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, X, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadThumbnail } from '../../services/instructorService';
import { toast } from 'react-hot-toast';

const ThumbnailUpload = ({ initialUrl, onUploadSuccess, onRemove }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialUrl || '');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return toast.error('Please upload a valid image file (JPG, PNG, or WEBP)');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return toast.error('Image size must be less than 5MB');
    }

    try {
      setUploading(true);
      const response = await uploadThumbnail(file);
      setPreviewUrl(response.url);
      onUploadSuccess(response.url);
      toast.success('Thumbnail uploaded successfully!');
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload thumbnail');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: uploading
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl('');
    onRemove();
  };

  return (
    <div className="space-y-4">
      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Course Thumbnail</label>
      
      {previewUrl ? (
        <div className="relative group rounded-[28px] overflow-hidden border border-slate-100 shadow-xl aspect-video">
          <img src={previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
            <div {...getRootProps()} className="p-3 bg-white text-slate-900 rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-lg">
              <input {...getInputProps()} />
              <UploadCloud className="w-5 h-5" />
            </div>
            <button 
              onClick={handleRemove}
              className="p-3 bg-rose-500 text-white rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-rose-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 bg-emerald-500/90 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 className="w-3 h-3" />
            READY
          </div>
        </div>
      ) : (
        <div 
          {...getRootProps()}
          className={`relative h-48 rounded-[28px] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center p-6 cursor-pointer overflow-hidden ${
            isDragActive ? 'border-purple-400 bg-purple-50' : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Uploading Image...</p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-7 h-7 text-purple-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">
                {isDragActive ? 'Drop it here!' : 'Click or drag thumbnail'}
              </h4>
              <p className="text-[11px] text-slate-400 max-w-[160px] mb-6">Drop your image here or browse files</p>
              
              <div className="px-6 py-3 bg-white border border-slate-100 text-slate-600 text-[11px] font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
                Browse Files
              </div>
              
              <p className="mt-4 text-[9px] font-bold text-slate-300 uppercase tracking-widest">JPG, PNG or WEBP • Max 5MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ThumbnailUpload;
