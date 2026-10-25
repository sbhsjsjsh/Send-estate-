'use client';

import { decodeProperty, type PropertyData } from '@/lib/encoding';
import Image from 'next/image';
import { motion } from 'motion/react';
import { MapPin, Tag, Share2, MessageCircle, ChevronLeft, User } from 'lucide-react';
import Link from 'next/link';

export default function PropertyShowcase({ data, agentFromUrl }: { data: string, agentFromUrl?: string }) {
  const property = decodeProperty(data);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Invalid Link</h1>
        <p className="text-neutral-500 mb-6">The property information could not be loaded.</p>
        <Link href="/" className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/20 active:scale-95 transition-all">
          Go Back
        </Link>
      </div>
    );
  }

  // Use agent name from URL or from decoded data
  const displayName = agentFromUrl || property.agentName;

  const shareText = `Check out this property: ${property.name} - ${property.price}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`;

  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans pb-24 overflow-x-hidden">
      {/* Hero Image Section */}
      <section className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative h-full w-full"
        >
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>

        {/* Floating Actions */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <Link href="/" className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: property.name, text: shareText, url: window.location.href });
              } else {
                window.open(whatsappUrl, '_blank');
              }
            }}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 -mt-10 relative z-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5"
        >
          {/* Agent Badge */}
          {displayName && (
            <div className="flex items-center gap-2 mb-4 bg-neutral-50 w-fit px-3 py-1 rounded-full border border-neutral-100">
              <User className="w-3 h-3 text-amber-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Listed by {displayName}</span>
            </div>
          )}

          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 leading-tight mb-1">
                {property.name}
              </h1>
              {property.location && (
                <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
              )}
            </div>
            <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
              <span className="text-amber-700 font-bold text-lg whitespace-nowrap">
                {property.price}
              </span>
            </div>
          </div>

          <div className="h-px bg-neutral-100 my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-neutral-600 leading-relaxed">
                {property.description || "Discover luxury living in this magnificent property. Featuring premium finishes and a prime location, this home offers everything you've been searching for."}
              </p>
            </div>

            {/* Additional Images Gallery */}
            {property.images && property.images.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Gallery</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                  {property.images.filter(url => url.trim() !== '').map((url, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="relative min-w-[200px] h-[150px] rounded-2xl overflow-hidden shadow-md flex-shrink-0"
                    >
                      <Image
                        src={url}
                        alt={`${property.name} gallery ${idx + 1}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-1">Category</p>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Tag className="w-4 h-4 text-amber-500" />
                  <span className="font-medium text-sm">Residential</span>
                </div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-1">Status</p>
                <div className="flex items-center gap-2 text-neutral-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-sm">Available</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-neutral-100 z-50">
        <div className="max-w-xl mx-auto flex gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Inquiry on WhatsApp</span>
          </a>
        </div>
      </div>
    </main>
  );
}
