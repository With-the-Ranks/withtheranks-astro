"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import type { ComponentType } from "react";

const MAX_ALTITUDE = 0.9;
const Globe = React.lazy(() =>
  import("./Globe").then((m) => ({ default: m.World as ComponentType<any> }))
);

export default function Globe3D() {
  const globeConfig = {
    globeColor: "#ffffff",
    showAtmosphere: true,
    atmosphereColor: "#000000",
    atmosphereAltitude: 0.2,
    polygonColor: "#252753",
    pointSize: 1,
    emissive: "#000000",
    emissiveIntensity: 0.01,
    shininess: 0.1,
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1200,
    arcLength: 0.8,
    rings: 1,
    maxRings: 3,
    autoRotateSpeed: 0.01,
    initialPosition: { lat: 21.0278, lng: 105.8342 },
  };
  
  // More “With the Ranks” style arc colors:
  const colors = ["#FFE872", "#7FFFD4", "#8C9DFF", "#FFDD57", "#FFFFFF"];
  

  // Five locations: Los Angeles, Tennessee, Washington, New York, Vietnam
  const hubs = [
    { name: "Los Angeles, USA", lat: 34.0522, lng: -118.2437 },
    { name: "Tennessee, USA", lat: 35.5175, lng: -86.5804 },
    { name: "Washington, USA", lat: 47.7511, lng: -120.7401 },
    { name: "New York, USA", lat: 40.7128, lng: -74.0060 },
    { name: "Hanoi, Vietnam", lat: 21.0278, lng: 105.8342 },
  ];

  // Generate sample arcs
  let sampleArcs = [];
  let order = 1;
  for (let i = 0; i < 20; i++) {
    const startIndex = i % hubs.length;
    let endIndex = (startIndex + 1 + Math.floor(i / hubs.length)) % hubs.length;
    if (startIndex === endIndex) {
      endIndex = (endIndex + 1) % hubs.length;
    }

    const startHub = hubs[startIndex];
    const endHub = hubs[endIndex];
    sampleArcs.push({
      order: order++,
      startLat: startHub.lat,
      startLng: startHub.lng,
      endLat: endHub.lat,
      endLng: endHub.lng,
      arcAlt: Math.min(0.1 + Math.random() * 0.2, MAX_ALTITUDE),
      color: colors[i % colors.length],
    });
  }

  const [loadGlobe, setLoadGlobe] = useState(false);
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadGlobe(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (globeRef.current) {
      observer.observe(globeRef.current);
    }
    return () => {
      if (globeRef.current) {
        observer.unobserve(globeRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-72 md:h-full md:max-h-[750px] z-20" ref={globeRef}>
      {loadGlobe && (
        <Suspense fallback={null}>
          <Globe data={{}} globeConfig={globeConfig} />
        </Suspense>
      )}
    </div>
  );
}
