import { useLayoutEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import './CardNav.css';

const CardNav = ({
  logo,
  logoAlt = 'Logo',
  items = [],
  className = '',
  ease = 'power3.out', // Sekarang dipakai di GSAP
  baseColor = '#ffffff', // Sekarang dipakai buat background saat buka
  menuColor = '#333333', // Sekarang dipakai buat warna hamburger
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]); // Array ref
  const tlRef = useRef(null);

  // --- 1. LOGIC ANIMASI (Fixed Ref Usage) ---
  
  // Fungsi ukur tinggi
  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return 60; 

    const contentEl = navEl.querySelector('.card-nav-content');
    if (!contentEl) return 60;

    // Trik ukur
    const wasVisible = contentEl.style.visibility;
    const wasPos = contentEl.style.position;
    const wasHeight = contentEl.style.height;

    contentEl.style.visibility = 'visible';
    contentEl.style.position = 'absolute';
    contentEl.style.height = 'auto';
    
    const contentHeight = contentEl.scrollHeight;

    // Restore
    contentEl.style.visibility = wasVisible;
    contentEl.style.position = wasPos;
    contentEl.style.height = wasHeight;

    return 60 + contentHeight + 20; 
  }, []);

  // --- 2. SETUP GSAP ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const navEl = navRef.current;
      
      // Initial State
      gsap.set(navEl, { height: 60, overflow: 'hidden' });
      // Pastikan kartu VISIBLE tapi di bawah
      gsap.set(cardsRef.current, { y: 30, autoAlpha: 1 }); 

      const tl = gsap.timeline({ paused: true });

      // Step 1: Buka Kotak (Pakai props 'ease')
      tl.to(navEl, {
        height: calculateHeight(),
        width: 320,
        duration: 0.4,
        ease: ease // <-- Variabel 'ease' dipakai disini
      });

      // Step 2: Munculkan Kartu
      tl.to(cardsRef.current, {
        y: 0,
        duration: 0.3,
        stagger: 0.1,
        ease: "back.out(1.2)"
      }, "-=0.2");

      tlRef.current = tl;
    }, navRef);

    return () => ctx.revert();
  }, [items, calculateHeight, ease]); // Tambahkan ease ke dependency

  // --- 3. HANDLE CLICK ---
  const toggleMenu = () => {
    if (!tlRef.current) return;

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      
      // Buka: Pakai baseColor dari props
      gsap.to(navRef.current, { 
        backgroundColor: baseColor, // <-- Variabel 'baseColor' dipakai
        border: '1px solid #ddd', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
      });
      
      tlRef.current.play();
    } else {
      setIsHamburgerOpen(false);
      
      // Tutup: Transparan
      gsap.to(navRef.current, { 
        backgroundColor: 'transparent', 
        border: '1px solid transparent', 
        boxShadow: 'none' 
      });
      
      tlRef.current.reverse();
      tlRef.current.eventCallback('onReverseComplete', () => setIsExpanded(false));
    }
  };

  // --- 4. CARA AMAN SET REF ARRAY ---
  // Jangan pakai ref.current = [] di render!
  // Pakai function callback begini:
  const setCardRef = (index) => (el) => {
    cardsRef.current[index] = el;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className="card-nav">
        
        {/* Header */}
        <div className="card-nav-top">
          <div 
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            style={{ color: menuColor }} // <-- Variabel 'menuColor' dipakai
          >
            {/* Pakai inline style untuk garis hamburger biar ikut warna menuColor */}
            <div className="hamburger-line" style={{ backgroundColor: menuColor }} />
            <div className="hamburger-line" style={{ backgroundColor: menuColor }} />
          </div>

          {/* Logo (Kalau ada props logo, kita render) */}
          {logo && (
             <div className={`logo-container transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                <img src={logo} alt={logoAlt} className="w-8 h-8 object-contain" />
             </div>
          )}
        </div>

        {/* Content */}
        <div className="card-nav-content">
          {(items || []).map((item, idx) => (
            <div
              key={idx}
              className="nav-card"
              ref={setCardRef(idx)} // <-- Pakai fungsi safe ref
              style={{ 
                backgroundColor: item.color || '#f3f4f6', 
                color: item.textColor || '#000' 
              }}
            >
              <div className="nav-card-label">{item.title}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <a key={i} className="nav-card-link" href={lnk.href || '#'}>
                    <GoArrowUpRight /> {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;