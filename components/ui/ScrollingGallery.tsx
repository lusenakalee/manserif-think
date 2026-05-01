'use client';

import { useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { ScrollSmoother, ScrollTrigger } from 'gsap/all';
import { useGSAPAdvancedResize } from '@/lib/useGSAPResize' 

interface ScrollingGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    speed?: number;
  }>;
  className?: string;
  id?: string;
}

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export default function ScrollingGallery({ 
    images, 
    id = "wrapper"
  }: ScrollingGalleryProps) {
    const [dynamicHeight, setDynamicHeight] = useState<number>(0);

    const calculateVisibleHeight = () => {
        const contentElement = document.getElementById(id + "content");
        const wrapperElement = document.getElementById(id);
        const wrapperElementHeight = wrapperElement?.scrollHeight;  
        const transform = contentElement?.style.transform;
        const matrix3dMatch = transform?.match(/matrix3d\(([^)]+)\)/);
        
        if (matrix3dMatch) {
            const matrix3dValue = matrix3dMatch[1];
            const values = matrix3dValue.split(',');
            const yTranslate = parseFloat(values[13].trim());
            const lastImageId = "#" + id + " img:last-child";
            const lastImage = contentElement?.querySelector(lastImageId);
            let lastImgTranslate = 0;
            
            if(lastImage){
              const imgTransform = (lastImage as HTMLElement).style.transform;
              const translateMatch = imgTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                if (translateMatch) {
                  const imgYTranslate = parseFloat(translateMatch[2]);
                  lastImgTranslate = lastImgTranslate + imgYTranslate;
                }
            }
            const baseCalculatedHeight = wrapperElementHeight ? wrapperElementHeight + yTranslate : 0;
            lastImgTranslate = lastImgTranslate > 0 ? lastImgTranslate : 0;
            const finalHeight = baseCalculatedHeight + lastImgTranslate;
            console.log(lastImgTranslate, baseCalculatedHeight, finalHeight)
            return finalHeight;
        }
        return 0;
    };


    useGSAPAdvancedResize({
        onResize: () => {
            setTimeout(() => {
                setDynamicHeight(calculateVisibleHeight());
            }, 100);
        },
        dependencies: [id, images.length]
    });

    useGSAP(() => {
        setDynamicHeight(calculateVisibleHeight());
    
        const skewSetter = gsap.quickTo("#" + id + " img", "skewY"),
            clamp = gsap.utils.clamp(-8, 8); 
            
        ScrollSmoother.create({
            smooth: 1,
            speed: 3,
            effects: true,
            onUpdate: self => {
                skewSetter(clamp(self.getVelocity() / -50));
                const newVisibleHeight = calculateVisibleHeight();
                setDynamicHeight(newVisibleHeight);
            },
            wrapper: "#" + id,
            content: "#" + id + "content"
        });
        
        // No need for manual resize listener - handled by utility
    }, { dependencies: [id, images.length]});

    return (
        <>
            <style jsx>{`
                #${id} {
                    position: relative !important;
                    inset: auto !important;
                    overflow: hidden !important;
                    height: ${dynamicHeight}px !important;
                    min-height: 100vh;
                }  
            `}</style>
            <div className="w-full" id={id}>
                <div className="w-full" id={id + "content"}>
                    <div className="flex flex-col w-full justify-center items-center">
                        {images.map((img, index) => (
                                <Image 
                                    key={index}
                                    src={img.src} 
                                    alt={img.alt}
                                    width={500}
                                    height={500}
                                    className={`w-1/4 aspect-square object-cover object-top ${index % 2 === 1 ? 'mr-[150px]' : '-mr-[150px]'}`}
                                    data-speed={img.speed}
                                />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export { ScrollingGallery };