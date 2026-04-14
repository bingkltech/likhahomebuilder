import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ⚡ Bolt Performance Optimization:
// Wrap the ImageCarousel in React.memo() to avoid unnecessary re-renders when the parent
// HomePage component state changes. This is critical because ImageCarousel handles
// complex 3D transitions, drag tracking, and lighting calculations that should not be
// interrupted or recalculated due to unrelated state changes.
const ImageCarousel = React.memo(({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mouseY, setMouseY] = useState(0);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Velocity Navigation State
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(600);

  const imagesCount = images.length;

  const handleNext = (count = 1) => {
    const moveCount = typeof count === 'number' ? count : 1;
    setTransitionDuration(400); // Snappier manual navigation
    setCurrentIndex((prev) => (prev + moveCount) % imagesCount);
  };

  const handlePrev = (count = 1) => {
    const moveCount = typeof count === 'number' ? count : 1;
    setTransitionDuration(400); // Snappier manual navigation
    setCurrentIndex((prev) => (prev - moveCount + imagesCount) % imagesCount);
  };

  // Auto-play Logic (4 seconds)
  React.useEffect(() => {
    if (isHovered || isDragging || lightboxOpen) return;
    const interval = setInterval(() => {
      setTransitionDuration(600);
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered, isDragging, lightboxOpen]);

  const handleStart = (clientX) => {
    setDragStart(clientX);
    setStartTime(Date.now());
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleEnd = (clientX) => {
    if (!isDragging) return;

    const distance = dragStart - clientX;
    const duration = Date.now() - startTime;
    const velocity = Math.abs(distance) / (duration || 1); // px/ms

    // Momentum logic
    if (Math.abs(distance) > 30) {
      let framesToMove = 1;
      if (velocity > 1.5) framesToMove = 3;
      else if (velocity > 0.8) framesToMove = 2;

      // Dynamic Easing (shorter duration for higher velocity)
      const dynamicDuration = Math.max(300, 600 - velocity * 100);
      setTransitionDuration(dynamicDuration);

      if (distance > 0) handleNext(framesToMove);
      else handlePrev(framesToMove);
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Event Adapters for unified Touch & Mouse support
  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onTouchEnd = (e) => handleEnd(e.changedTouches[0].clientX);

  const onMouseDown = (e) => {
    handleStart(e.clientX);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = (e) => {
    handleEnd(e.clientX);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  const handleFrameMouseMove = (e, index) => {
    if (index !== currentIndex && index !== hoveredIndex) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentY = (y / rect.height) * 2 - 1; // -1 to 1
    setMouseY(percentY);
  };

  // Keyboard Navigation for Lightbox
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % imagesCount);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, imagesCount]);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop';
  };

  const getImageStyles = (index) => {
    let diff = index - currentIndex;
    if (diff > imagesCount / 2) diff -= imagesCount;
    if (diff < -imagesCount / 2) diff += imagesCount;

    const absDiff = Math.abs(diff);
    const isThisHovered = hoveredIndex === index;
    const isCenter = absDiff === 0;

    let scale = 1;
    let rotateY = 0;
    let rotateX = 0;
    let opacity = 0;
    let zIndex = 0;
    let translateX = 0;
    let boxShadow = '0 20px 50px rgba(0,0,0,0.8)';

    if (absDiff === 0) {
      scale = 1.15; // Slightly larger center
      rotateY = 0;
      opacity = 1;
      zIndex = 50;
      translateX = 0;
      // Branded Glow
      boxShadow = isThisHovered
        ? '0 0 50px rgba(196,214,0,0.4), 0 20px 50px rgba(0,0,0,0.8)'
        : '0 0 20px rgba(196,214,0,0.2), 0 20px 50px rgba(0,0,0,0.8)';
    } else if (absDiff === 1) {
      scale = 0.9;
      rotateY = diff > 0 ? -15 : 15;
      opacity = 0.7;
      zIndex = 40;
      translateX = diff > 0 ? 45 : -45;
    } else if (absDiff === 2) {
      scale = 0.8;
      rotateY = diff > 0 ? -30 : 30;
      opacity = 0.4;
      zIndex = 30;
      translateX = diff > 0 ? 80 : -80;
    } else {
      opacity = 0;
      zIndex = 0;
      translateX = diff > 0 ? 120 : -120;
      scale = 0.5;
    }

    if (isThisHovered && !isDragging) {
      scale += 0.05; // Hover Lift
      zIndex += 10;  // Boost Depth
      rotateX = -mouseY * 8; // 3D Tilt
    }

    return {
      transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
      zIndex: zIndex,
      opacity: opacity,
      boxShadow: boxShadow,
      transition: isThisHovered && !isDragging
        ? 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms, box-shadow 300ms'
        : `transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity 600ms, z-index 600ms, box-shadow 600ms`,
      pointerEvents: absDiff <= 2 ? 'auto' : 'none',
      cursor: isCenter ? 'zoom-in' : 'pointer',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    };
  };

  return (
    <>
      <div
        className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden [perspective:1200px] bg-black select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredIndex(null);
          setMouseY(0);
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        <div
          className="relative w-[180px] md:w-[260px] h-[320px] md:h-[480px] [transform-style:preserve-3d] transition-transform duration-300"
          style={{
            transform: `rotateY(${dragOffset / 10}deg)`, // Visual Fan Tilt during drag
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10"
              style={getImageStyles(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseMove={(e) => handleFrameMouseMove(e, i)}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setMouseY(0);
              }}
              onClick={() => {
                const diff = (i - currentIndex + imagesCount) % imagesCount;
                const distance = diff > imagesCount / 2 ? diff - imagesCount : diff;

                // If already centered, open lightbox
                if (distance === 0) {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                } else {
                  // If not centered, move to this image first
                  setTransitionDuration(500);
                  setCurrentIndex(i);
                }
              }}
            >
              <img
                src={img}
                alt={`Project ${i + 1}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading={Math.min(Math.abs(i - currentIndex), imagesCount - Math.abs(i - currentIndex)) <= 2 ? "eager" : "lazy"}
                decoding="async"
                fetchpriority={i === currentIndex ? "high" : "auto"}
                onError={handleImageError}
              />
            </div>
          ))}
        </div>

        {/* Modern Controls */}
        <div className="absolute inset-0 pointer-events-none z-[110] flex items-end justify-center pb-8">
          <div className="flex justify-center items-center gap-6 pointer-events-auto">
            <button
              onClick={() => handlePrev(1)}
              className="p-3 bg-white/5 hover:bg-[#C4D600] text-white hover:text-black rounded-full transition-all border border-white/10 hover:border-[#C4D600] group"
              aria-label="Previous"
            >
              <svg className="w-6 h-6 transform transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Progress Indicators */}
            <div className="flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTransitionDuration(400);
                    setCurrentIndex(i);
                  }}
                  className={`transition-all duration-300 rounded-full focus-visible:ring-2 focus-visible:ring-[#C4D600] outline-none ${i === currentIndex ? 'w-8 h-1.5 bg-[#C4D600]' : 'w-1.5 h-1.5 bg-white/20'
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => handleNext(1)}
              className="p-3 bg-white/5 hover:bg-[#C4D600] text-white hover:text-black rounded-full transition-all border border-white/10 hover:border-[#C4D600] group"
              aria-label="Next"
            >
              <svg className="w-6 h-6 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Decorative Gradient Overlay for Depth */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* Lightbox Modal (Radix UI) */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[90vw] max-h-[85vh] p-0 bg-black/95 border border-white/10 flex items-center justify-center outline-none shadow-2xl z-[1000] rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">Project High-Resolution View</DialogTitle>
          <div className="relative group w-full h-full flex items-center justify-center h-[70vh] md:h-[80vh] p-4">
            {/* Top Bar for Close Button - Ensure visibility */}
            <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-end px-6 z-[1100] pointer-events-none">
              <DialogClose className="p-3 bg-white/10 hover:bg-[#C4D600] text-white hover:text-black rounded-full transition-all outline-none border border-white/20 pointer-events-auto backdrop-blur-md">
                <X className="w-6 h-6" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>

            {/* Navigation Arrows */}
            <button
              className="absolute left-6 text-white hover:text-[#C4D600] z-50 p-3 transition-colors bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
              }}
              aria-label="Previous image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <img
              src={images[lightboxIndex].replace('/lowres/', '/highres/')}
              alt={`Project full view ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300 touch-pinch-zoom"
              onError={handleImageError}
            />

            <button
              className="absolute right-6 text-white hover:text-[#C4D600] z-50 p-3 transition-colors bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-sm border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % imagesCount);
              }}
              aria-label="Next image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Tell the Facebook SDK to look for and "wake up" the videos on the page
  React.useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  const projects = [
    {
      id: 1,
      emoji: '🔹',
      title: '1 - The Oasis of Autonomy',
      description: 'True luxury isn’t found in excess; it’s found in independence. Imagine a dwelling that doesn’t just sit on the land, but survives with it. Tucked behind the protective shadow of ancient boulders, this off-grid sanctuary is a testament to the harmony between brutal nature and refined engineering.',
      image: null,
      videoSrc: 'https://www.facebook.com/reel/1488990142658620/',
    },
    {
      id: 2,
      emoji: '🔹',
      title: '2 - The Tropical Pavilion',
      description: 'Expansive wrap-around decking extends the living area into the canopy, doubling the usable footprint of the home. An overhanging, angled roofline provides essential solar shading and efficient rainwater runoff, perfect for tropical climates.',
      image: null,
      videoSrc: 'https://www.facebook.com/reel/1801707910382021/',
    },
    {
      id: 3,
      emoji: '🔹',
      title: '3 - The Sanctuary in Stone',
      description: 'A modern retreat that rises from the earth, blending raw geological power with sophisticated minimalism. Strategically positioned to harness natural light while providing a fortress of tranquility, this design redefines the boundary between the wild and the refined.',
      image: null,
      videoSrc: 'https://www.facebook.com/reel/896609346553070/',
      link: 'https://www.facebook.com/reel/896609346553070',
    },
    {
      id: 4,
      emoji: '🔹',
      title: '4 - The Quiet Architecture',
      description: 'Living Architecture: A lush green roof that provides natural insulation and integrates the structure into the surrounding meadow. Transparent Living: Floor-to-ceiling glass walls that invite the landscape inside, making the mountains and fields a living part of the home.',
      image: null,
      videoSrc: 'https://www.facebook.com/reel/1831145384224834/',
    },
  ];

  const bonuses = [
    {
      id: 1,
      title: 'Bonus #1',
      subtitle: 'Construction checklists and supplier suggestions',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop',
      originalPrice: '65,00',
    },
    {
      id: 2,
      title: 'Bonus #2',
      subtitle: 'Quick Guide to Steel Frame Execution',
      image: 'https://images.pexels.com/photos/4312841/pexels-photo-4312841.jpeg',
      originalPrice: '65,00',
    },
    {
      id: 3,
      title: 'Bonus #3',
      subtitle: 'List of Recommended Tools and Suppliers',
      image: 'https://images.unsplash.com/photo-1744235558674-89a6ed881268',
      originalPrice: '65,00',
    },
  ];

  const whatsIncluded = [
    'Complete list of materials (with a focus on economy)',
    'Optimized cutting plans with measurements',
    'Step-by-step assembly notebook',
    'Realistic 3D photos of all projects',
    'Architectural projects in PDF and DWG',
  ];

  const whyPerfect = [
    { icon: '📉', text: 'Low cost of execution – without sacrificing quality' },
    { icon: '🏗️', text: 'Optimized designs for fast construction' },
    { icon: '💰', text: 'Full focus on generating passive income with Airbnb' },
    { icon: '💼', text: 'Ideal for beginners or experienced investors' },
    { icon: '🧱', text: 'Developed by an architect with experience in real and profitable projects' },
  ];

  const faqs = [
    {
      question: 'HOW DO I ACCESS THE PRODUCT AFTER PURCHASE?',
      answer: 'Immediately after payment approval, a link to access the download platform will be sent to your registered email.',
    },
    {
      question: 'HOW LONG WILL I HAVE FREE ACCESS?',
      answer: 'You will have one year of access to the platform.',
    },
    {
      question: 'IS THIS PROJECT EASY TO EXECUTE?',
      answer: 'YES DIY Level: ALL LEVELS',
    },
  ];

  const handlePurchase = () => {
    navigate('/contact#contact-form');
    // Scroll to top first in case already on contact page or to trigger hash jump
    window.scrollTo(0, 0);
    // Use a small timeout to let the page load then jump to hash
    setTimeout(() => {
      const element = document.getElementById('contact-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight" style={{ color: '#C4D600' }}>
            Steel Frame Modular Home Projects
          </h1>

          <div className="mb-12 w-full overflow-visible">
            <ImageCarousel
              images={[
                `${process.env.PUBLIC_URL}/carousel/lowres/122.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/123.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/124.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/126.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/126A.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/128A.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/128B.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/128D.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/129A.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/129C.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/130A.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/130B.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/130C.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/131A.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/131B.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/131C.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/132A.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/132B.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/file_1772370111389.jpg`,
                `${process.env.PUBLIC_URL}/carousel/lowres/file_1772370122487.jpg`
              ]}
            />
          </div>

          <h2 className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
            Redefine your lifestyle with a high-end tiny house. Our complete steel frame projects combine modern minimalist design with unmatched durability, giving you the freedom to live anywhere without compromise.
          </h2>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black border-2 border-white rounded-3xl overflow-hidden">
            <CardContent className="p-10 text-center">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase">
                Complete Architectural Design
              </h3>
              <p className="text-[#C4D600] text-lg mb-10 tracking-[0.2em] font-bold">
                FULL BLUEPRINTS & 3D VISUALIZATION
              </p>

              <div className="mb-10">
                <div className="inline-block py-2">
                  <p className="text-white text-lg opacity-80 mb-2 font-medium">Starting at</p>
                  <p className="text-5xl md:text-7xl font-black" style={{ color: '#C4D600' }}>
                    ₱55,000
                  </p>
                </div>
              </div>

              <p className="text-white text-base md:text-lg mb-10 tracking-widest font-semibold border-y border-white/20 py-4 opacity-90 uppercase">
                INCLUDES FLOOR PLANS, ELEVATIONS, AND 3D RENDERS
              </p>

              <Button
                onClick={handlePurchase}
                className="w-full md:w-auto px-12 text-xl py-8 font-black rounded-none transition-all duration-300 hover:bg-white hover:text-black hover:tracking-[0.1em]"
                style={{ backgroundColor: '#C4D600', color: '#000' }}
              >
                GET A FREE QUOTE
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What You Will Receive */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-[#C4D600] text-lg font-black tracking-widest uppercase mb-2">
              The "Elite Standard"
            </h3>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
              The Definitive Blueprint for Modern Living.
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              We have distilled our expertise into a single, master-tier project ready for immediate construction. Moving beyond simple packages, we now offer our most versatile design—engineered for rapid execution and low overhead without compromising on architectural soul. Whether you are building a private sanctuary or a high-yield investment.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12" style={{ color: '#C4D600' }}>
            Our Featured Projects:
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={project.id}
                className="bg-black border-2 border-white rounded-3xl overflow-hidden hover:border-[#C4D600] transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#C4D600' }}>
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
                          <span>{project.emoji}</span> {project.title}
                        </a>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span>{project.emoji}</span> {project.title}
                        </span>
                      )}
                    </h3>
                    <p className="text-white text-base mb-6 text-justify">{project.description}</p>
                  </div>
                  {project.images ? (
                    <div className="w-full bg-black rounded-b-3xl overflow-hidden relative">
                      <ImageCarousel images={project.images} />
                    </div>
                  ) : project.videoSrc ? (
                    <div className={`w-full aspect-[9/16] bg-black rounded-b-3xl overflow-hidden relative flex justify-center overflow-hidden ${[1, 2].includes(project.id) ? 'items-end' : 'items-center'}`}>
                      <div
                        className="fb-video"
                        data-href={project.videoSrc}
                        data-width="500"
                        data-show-text="false"
                        data-autoplay="false"
                        data-muted="true"
                        style={{
                          transform: 'scale(1.15)',
                          transformOrigin: [1, 2].includes(project.id) ? 'bottom center' : 'center'
                        }}>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-[9/16] bg-black rounded-b-3xl overflow-hidden relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop'}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 px-4 bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-white">
            What's Included in Each Project
          </h2>
          <div className="space-y-4">
            {whatsIncluded.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <Check className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#C4D600' }} />
                <p className="text-lg text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Perfect */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-white">
            Why Is This Package Perfect For You?
          </h2>
          <div className="space-y-4">
            {whyPerfect.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <p className="text-lg text-white">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses Section */}
      <section className="py-16 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4" style={{ color: '#C4D600' }}>
            🎁 EXCLUSIVE BONUSES FOR PEOPLE TO BUY TODAY:
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {bonuses.map((bonus) => (
              <Card key={bonus.id} className="bg-black border-2 border-white rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={bonus.image}
                      alt={bonus.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop'}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black mb-2" style={{ color: '#C4D600' }}>
                      {bonus.title}
                    </h3>
                    <p className="text-white text-lg mb-4 font-bold">{bonus.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-white">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-white/20">
                <AccordionTrigger className="text-left text-lg font-bold hover:text-[#C4D600] py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 text-lg py-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-[#C4D600]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 uppercase">
            Step Into Your Future Home
          </h2>
          <p className="text-black text-xl mb-12 font-bold max-w-2xl mx-auto">
            We provide more than just designs; we deliver complete, construction-ready blueprints paired with detailed material and labor estimates.
            <br /><br />
            ✅ Get everything you need to start construction immediately—from structural steel specifications to professional cost projections that keep your investment secure.
          </p>

          <Card className="bg-black border-4 border-black rounded-none overflow-hidden max-w-xl mx-auto group hover:scale-105 transition-transform duration-500">
            <CardContent className="p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase">
                Complete Architectural Design
              </h3>
              <p className="text-[#C4D600] text-sm mb-8 tracking-[0.2em] font-bold">
                FULL BLUEPRINTS & 3D VISUALIZATION
              </p>

              <div className="mb-8">
                <p className="text-white text-sm opacity-80 mb-1">Starting at</p>
                <p className="text-5xl md:text-6xl font-black" style={{ color: '#C4D600' }}>
                  ₱55,000
                </p>
              </div>

              <p className="text-white text-xs md:text-sm mb-8 tracking-widest font-semibold border-y border-white/20 py-3 opacity-90 uppercase">
                INCLUDES FLOOR PLANS, ELEVATIONS, AND 3D RENDERS
              </p>

              <Button
                onClick={handlePurchase}
                className="w-full md:w-auto px-10 text-lg py-7 font-black rounded-none transition-all duration-300 hover:bg-white hover:text-black"
                style={{ backgroundColor: '#C4D600', color: '#000' }}
              >
                GET A FREE QUOTE
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;