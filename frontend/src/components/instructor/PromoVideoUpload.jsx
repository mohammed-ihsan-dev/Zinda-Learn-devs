import { useState } from 'react';
import { UploadCloud, Video, X, Play, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { videoService } from '../../services/videoService';
import { toast } from 'react-hot-toast';

const PromoVideoUpload = ({ courseId, initialUrl, onUploadSuccess, onRemove }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(initialUrl || '');
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return toast.error('Please upload a valid video file (MP4, WebM, or MOV)');
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return toast.error('Video size must be less than 100MB');
    }

    try {
      setUploading(true);
      setProgress(0);

      const response = await videoService.uploadVideo(file, courseId, (percent) => {
        setProgress(percent);
      });

      setPreviewUrl(response.url);
      onUploadSuccess({
        url: response.url,
        publicId: response.publicId
      });
      toast.success('Promo video uploaded successfully!');
    } catch (error) {
      console.error('Promo video upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload promo video');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    setShowPreview(false);
    onRemove();
  };

  return (
    <div className="space-y-4">
      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Promo Video</label>
      
      {previewUrl ? (
        <div className="relative group">
          {showPreview ? (
            <div className="relative aspect-video rounded-[28px] overflow-hidden bg-black shadow-2xl border border-slate-100">
              <video 
                src={previewUrl} 
                controls 
                className="w-full h-full object-contain"
                autoPlay
              />
              <button 
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative aspect-video rounded-[28px] overflow-hidden bg-slate-900 shadow-xl group border border-slate-100">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <button 
                  onClick={() => setShowPreview(true)}
                  className="w-16 h-16 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-xl transition-all hover:scale-110 group-hover:shadow-2xl shadow-white/10"
                >
                  <Play className="w-8 h-8 fill-current" />
                </button>
                <p className="mt-4 text-white/60 text-xs font-bold uppercase tracking-widest">Preview Promo Video</p>
              </div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                <label className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all cursor-pointer">
                  <UploadCloud className="w-4 h-4" />
                  <input type="file" className="hidden" onChange={handleFileChange} accept="video/*" />
                </label>
                <button 
                  onClick={handleRemove}
                  className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 rounded-full backdrop-blur-md transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-6 left-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest">Video Ready</p>
                  <p className="text-white/40 text-[9px]">Students can watch this preview</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`relative h-52 bg-slate-50/50 rounded-[28px] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center p-8 group ${uploading ? 'border-purple-300 bg-purple-50/30' : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'}`}>
          {uploading ? (
            <div className="w-full max-w-xs space-y-4">
              <div className="flex items-center justify-center mb-2">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Uploading Promo... {progress}%
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Video className="w-7 h-7 text-purple-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">Upload Course Promo</h4>
              <p className="text-[11px] text-slate-400 max-w-[200px] mb-6">Attract students with a professional video introduction.</p>
              
              <label className="px-6 py-3 bg-white border border-slate-100 text-slate-600 text-[11px] font-bold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95">
                Browse Video
                <input type="file" className="hidden" onChange={handleFileChange} accept="video/*" />
              </label>
              
              <div className="mt-6 flex items-center gap-4 text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> MP4/MOV</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Max 100MB</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PromoVideoUpload;
