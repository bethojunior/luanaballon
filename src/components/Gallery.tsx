'use client';

import { useState } from 'react';

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  if (!images.length) {
    return <div className="grid aspect-square place-items-center rounded-3xl bg-pink-soft text-8xl">🎈</div>;
  }
  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-3xl bg-pink-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[i]} alt={alt} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, idx) => (
            <button
              key={src}
              onClick={() => setI(idx)}
              className={`h-16 w-16 overflow-hidden rounded-xl border-4 ${idx === i ? 'border-pink' : 'border-transparent'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
