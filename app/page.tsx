'use client';

import { useState, useEffect } from 'react';
import { encodeProperty, type PropertyData } from '@/lib/encoding';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Copy, 
  Check, 
  MessageCircle, 
  Image as ImageIcon, 
  Layout, 
  Share2, 
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';

const SAMPLE_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', label: 'Luxury Villa' },
  { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', label: 'Modern Home' },
  { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9', label: 'Classic Estate' },
  { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6', label: 'Mansion' },
];

export default function Home() {
  const [formData, setFormData] = useState<PropertyData>({
    name: '',
    price: '',
    image: SAMPLE_IMAGES[0].url,
    images: [],
    description: '',
    location: ''
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmbedding, setIsEmbedding] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024) { // 100KB limit for embedding
      alert("Image is too large to embed directly. Please use an image URL or a smaller image (under 100KB) to keep the WhatsApp link working.");
      return;
    }

    setIsEmbedding(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, image: base64String }));
      setIsEmbedding(false);
    };
    reader.readAsDataURL(file);
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  };

  const updateImageField = (index: number, val: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = val;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const removeImageField = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleGenerate = () => {
    if (!formData.name || !formData.price || !formData.image) {
      alert('Please fill at least Name, Price and Photo!');
      return;
    }

    setIsGenerating(true);
    
    // Simulate a brief generation period for effect
    setTimeout(() => {
      const encoded = encodeProperty(formData);
      const url = `${window.location.origin}/p/${encoded}`;
      setGeneratedLink(url);
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = `Hey! Check out this property: ${formData.name}\n${generatedLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-xl tracking-tight">Send Estate</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-neutral-500">
            <span>No Database</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span>Secure Encoding</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 md:py-12 grid md:grid-cols-2 gap-12">
        {/* Left Side: Form */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">Create Property Link</h2>
            <p className="text-neutral-500">Fill the details below to generate a beautiful showcase link for your property. All data is stored in the link itself.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Property Name</label>
              <input
                type="text"
                placeholder="e.g. Royal Palms Villa"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Price</label>
              <input
                type="text"
                placeholder="e.g. ₹4.5 Crores or $2.5M"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Location (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Bandra West, Mumbai"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-neutral-700 block">Main Property Photo</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Paste image URL..."
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="embed-upload"
                  />
                  <label
                    htmlFor="embed-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-neutral-300 hover:border-amber-500 hover:bg-amber-50 cursor-pointer transition-all text-sm text-neutral-500 font-medium"
                  >
                    {isEmbedding ? (
                      <div className="w-4 h-4 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>Embed Direct Image</span>
                  </label>
                </div>
              </div>

              {formData.image.startsWith('data:image') && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-amber-800 font-medium">Image embedded successfully</span>
                  </div>
                  <button 
                    onClick={() => setFormData({ ...formData, image: SAMPLE_IMAGES[0].url })}
                    className="text-xs text-amber-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              <div className="pt-2">
                <p className="text-xs text-neutral-400 mb-2 font-medium">OR CHOOSE A SAMPLE PHOTO</p>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      onClick={() => setFormData({ ...formData, image: img.url })}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        formData.image === img.url ? 'border-amber-500' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.label}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {formData.image === img.url && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white bg-amber-500 rounded-full p-0.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Multi-Image Section */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-neutral-700">Additional Photos (Optional)</label>
                <button
                  onClick={addImageField}
                  className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  Add Photo
                </button>
              </div>

              <div className="space-y-3">
                {formData.images?.map((url, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Additional photo URL..."
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-sm"
                        value={url}
                        onChange={(e) => updateImageField(idx, e.target.value)}
                      />
                      <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    </div>
                    <button
                      onClick={() => removeImageField(idx)}
                      className="p-2.5 bg-neutral-100 text-neutral-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-neutral-700">Description (Optional)</label>
              <textarea
                placeholder="Briefly describe the property..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-neutral-900/10 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Layout className="w-5 h-5" />
                  <span>Generate Link</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Side: Preview & Output */}
        <section className="flex flex-col">
          <div className="md:sticky md:top-24 space-y-8">
            {/* Real-time Preview Card */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-neutral-400" />
                  Live Preview
                </h3>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">MOBILE READY</span>
              </div>

              <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-neutral-50 min-h-[300px]">
                <div className="relative aspect-video bg-neutral-200">
                  {formData.image && (
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {formData.images && formData.images.filter(u => u.trim() !== '').length > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      +{formData.images.filter(u => u.trim() !== '').length} MORE
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg leading-tight truncate mr-2">
                      {formData.name || 'Property Name'}
                    </h4>
                    <span className="text-amber-600 font-bold whitespace-nowrap">
                      {formData.price || 'Price'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {formData.description || 'Description will appear here...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Link Output Card */}
            <AnimatePresence>
              {generatedLink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-amber-50 p-6 rounded-3xl border border-amber-100"
                >
                  <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share Your Link
                  </h3>
                  
                  <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center gap-3 mb-4">
                    <input
                      readOnly
                      value={generatedLink}
                      className="flex-1 bg-transparent text-sm text-neutral-600 truncate outline-none"
                    />
                    <motion.button
                      onClick={handleCopy}
                      animate={!copied ? {
                        scale: [1, 1.08, 1],
                      } : { scale: 1 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`p-2 rounded-lg transition-all relative overflow-hidden ${
                        copied ? 'bg-emerald-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                      }`}
                    >
                      <span className="relative z-10">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </span>
                      {!copied && (
                        <motion.div
                          initial={{ left: '-100%' }}
                          animate={{ left: '100%' }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 1
                          }}
                          className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12"
                        />
                      )}
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleWhatsApp}
                      className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </button>
                    <a
                      href={generatedLink}
                      target="_blank"
                      className="flex items-center justify-center gap-2 bg-white text-neutral-900 py-3 rounded-xl font-bold border border-amber-200 shadow-sm active:scale-95 transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>View Page</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!generatedLink && (
              <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-neutral-200 rounded-3xl">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-neutral-300" />
                </div>
                <h4 className="font-semibold text-neutral-400">Enter details to see your link</h4>
                <p className="text-sm text-neutral-400 max-w-[200px] mt-2">Your beautiful property page is just a click away.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer / Instructions */}
      <footer className="max-w-5xl mx-auto px-6 mt-12 pt-12 border-t border-neutral-100">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold">WhatsApp Friendly</h4>
            <p className="text-sm text-neutral-500">Links are optimized to never break on WhatsApp. Share with confidence.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Layout className="w-6 h-6" />
            </div>
            <h4 className="font-bold">No Database Needed</h4>
            <p className="text-sm text-neutral-500">All property details are encoded directly into the URL itself.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <Smartphone className="w-6 h-6" />
            </div>
            <h4 className="font-bold">Mobile Responsive</h4>
            <p className="text-sm text-neutral-500">Your property page will look stunning on every device.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
