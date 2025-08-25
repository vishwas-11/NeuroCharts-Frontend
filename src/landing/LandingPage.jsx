import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// LandingPage component, main entry point
export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('hero');

  return (
    <>
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />  
    </>
  );
}

// Hero Section component
const HeroSection = () => (
  // Add pt-20 to push content below the fixed navbar
  <section id="hero" className="min-h-screen flex items-center justify-center p-8 pt-20 relative z-10">
    <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h1 className="text-7xl md:text-8xl font-extrabold leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Excel Analytics
          </span>
          <br />Platform
        </h1>
        <p className="text-xl text-gray-300 max-w-xl">
          Transform your Excel data into powerful interactive visualizations. Upload, analyze, and generate stunning 2D and 3D charts with our advanced analytics platform.
        </p>
        <div className="flex space-x-4">
          <a href="/login" className="px-8 py-4 rounded-full font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 shadow-xl">
            Get Started Free
          </a>
        </div>
      </div>
      <div className="relative p-8">
        <div className="bg-white/5 rounded-3xl backdrop-blur-md p-6 border border-gray-700 shadow-2xl transition-transform duration-500 hover:rotate-2">
          <HeroVisuals />
        </div>
      </div>
    </div>
  </section>
);

// Hero Visuals component (replaces the static image)
const HeroVisuals = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Create glowing wireframe geometry
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    group.add(icosahedron);
    
    // Add a glowing effect
    const glowGeometry = new THREE.IcosahedronGeometry(2.1, 1);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);


    // Add animated particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x6366f1,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    group.add(particles);

    // Add lights
    const pointLight = new THREE.PointLight(0xa78bfa, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.005;
      particles.rotation.y -= 0.002;
      renderer.render(scene, camera);
    };

    const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);
    
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-96 rounded-2xl bg-gray-900/50"></div>
  );
};

// Features Section component
const FeaturesSection = () => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });
    const currentRef = domRef.current; // Capture current value
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="features" ref={domRef} className="min-h-screen py-20 relative z-10">
      <div className={`container mx-auto p-8 text-center transition-all duration-2000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h2 className="text-6xl font-extrabold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Key Features</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          Discover the powerful capabilities that make our Excel Analytics Platform the ultimate solution for data visualization and analysis.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard emoji="📊" title="Excel File Upload" description="Support for .xls and .xlsx files with automatic parsing using advanced libraries." />
          <FeatureCard emoji="🗺️" title="Data Mapping" description="Allow users to dynamically choose X and Y axes from column headers for precise data visualization." />
          <FeatureCard emoji="📈" title="Interactive Charts" description="Generate stunning 2D and 3D charts including bar, line, pie, scatter, and 3D column visualizations." />
          <FeatureCard emoji="💾" title="Downloadable Graphs" description="Export your visualizations as high-quality PNG or PDF files for presentations and reports." />
        </div>
      </div>
    </section>
  );
};

// Feature Card component
const FeatureCard = ({ emoji, title, description }) => (
  <div className="p-8 rounded-2xl bg-gray-800 border border-gray-700 shadow-lg transition-transform duration-300 hover:scale-105 hover:border-purple-600">
    <div className="text-5xl mb-4">{emoji}</div>
    <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

// CTA Section component
const CTASection = () => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    });
    const currentRef = domRef.current; // Capture current value
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="cta" ref={domRef} className="py-20 relative z-10 text-center">
      <div className={`container mx-auto p-12 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 transition-all duration-2000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h2 className="text-6xl font-extrabold mb-4">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Transform</span> Your Data Analysis?
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          Join thousands of professionals who are already using our platform to create stunning visualizations and gain valuable insights from their Excel data.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="/login" className="px-8 py-4 rounded-full font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 shadow-xl">
            Get Started Free
          </a>
        </div>
      </div>
    </section>
  );
};

// Footer component
const Footer = () => (
  <footer className="py-12 relative z-10 text-center text-gray-500 border-t border-gray-800">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-8">
      <div className="mb-8 md:mb-0 text-left md:w-1/3">
        <h3 className="text-2xl font-bold text-white mb-2">Excel Analytics</h3>
        <p className="text-gray-400">Transform your Excel data into powerful insights with our advanced analytics platform. Unlock the potential of your data.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left text-gray-400">
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Product</h4>
          <ul>
            <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">API Docs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Company</h4>
          <ul>
            <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Support</h4>
          <ul>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Tutorials</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="mt-8 text-sm text-gray-500">
      &copy; 2025 Excel Analytics Platform. All rights reserved.
    </div>
  </footer>
);


// Custom Cursor component
export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    // Set a variable to track mouse position
    let mouseX = 0;
    let mouseY = 0;

    // Set a variable for the cursor's current position to be animated
    let cursorX = 0;
    let cursorY = 0;
    
    // Animation loop for the cursor trail
    const animate = () => {
      // Lag the cursor's position behind the mouse position for a smooth trail effect
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      // Update the position of the cursor trail
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      
      requestAnimationFrame(animate);
    };
    
    animate();

    const onMouseMove = (e) => {
      // Update the dot's position directly without a lag
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      
      // Update the mouse position for the trail animation
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseOver = (e) => {
      const isInteractive = e.target.closest('a, button, input[type="file"]');
      if (isInteractive) {
        cursor.classList.add('scale-150', 'bg-purple-600/50');
      }
    };

    const onMouseOut = (e) => {
      const isInteractive = e.target.closest('a, button, input[type="file"]');
      if (cursor.classList.contains('scale-150') && !isInteractive) {
        cursor.classList.remove('scale-150', 'bg-purple-600/50');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed w-12 h-12 bg-purple-400/20 rounded-full pointer-events-none z-50 transition-transform duration-300 ease-out -translate-x-1/2 -translate-y-1/2" />
      <div ref={cursorDotRef} className="fixed w-2 h-2 bg-purple-400 rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2" />
    </>
  );
};


// Three.js Background component
export const ThreeDBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.DodecahedronGeometry(1, 0),
    ];
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x6366f1, wireframe: true }),
      new THREE.MeshStandardMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.5 }),
    ];
    
    const objects = [];
    for (let i = 0; i < 50; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const object = new THREE.Mesh(geometry, material);

      object.position.x = Math.random() * 20 - 10;
      object.position.y = Math.random() * 20 - 10;
      object.position.z = Math.random() * 20 - 10;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;

      objects.push(object);
      scene.add(object);
    }
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xa78bfa, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 15;

    let mouseX = 0, mouseY = 0;
    const onMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      // Mouse-based camera movement
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      // Animate objects
      objects.forEach(obj => {
        obj.rotation.x += 0.005;
        obj.rotation.y += 0.005;
      });

      renderer.render(scene, camera);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    
    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} id="threejs-container" className="fixed top-0 left-0 w-full h-full z-0" />;
};
