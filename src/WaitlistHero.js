import React, { useState, useEffect, useRef } from 'react';
import WaitlistSignup from './WaitlistSignup'; // Assuming WaitlistSignup is in a separate file

// NetworkAnimation component code (moved from App.js)
function NetworkAnimation() {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);
  // We will manage traveling dots directly in the animation loop

  const sampleListings = [
    { title: "Vintage Leica M3 Camera", price: "$1,200", condition: "Mint", timeLeft: "2h 15m" },
    { title: "Limited Edition Star Wars Action Figure", price: "$350", condition: "New in Box", timeLeft: "5h 30m" },
    { title: "Rare 1959 Gibson Les Paul", price: "$45,000", condition: "Excellent", timeLeft: "1d 3h" },
    { title: "First Edition Harry Potter Book Set", price: "$2,800", condition: "Like New", timeLeft: "3h 45m" },
    { title: "Vintage Rolex Submariner", price: "$12,500", condition: "Excellent", timeLeft: "4h 20m" },
    { title: "Limited Edition Gaming Console", price: "$750", condition: "New", timeLeft: "6h 10m" },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const numNodes = 40; // Number of network nodes
    const nodeElements = [];
    const lineElements = [];
    const travelingDotElements = new Set(); // Use a Set to manage active dots
    let animationFrameId;
    const popups = new Set(); // Manage active popups

    // Create nodes
    const createdNodes = [];
    for (let i = 0; i < numNodes; i++) {
      const node = document.createElement('div');
      node.className = 'network-node';
      // Random positions within the container, with some padding
      const x = Math.random() * (container.offsetWidth - 80) + 40; // Increased padding
      const y = Math.random() * (container.offsetHeight - 80) + 40; // Increased padding
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.animationDelay = `${Math.random() * 1.5}s`; // Slightly faster stagger
      container.appendChild(node);
      nodeElements.push(node);
      createdNodes.push({ x, y, element: node, id: i });
    }
    setNodes(createdNodes);

    // Create connections (lines) between nearby nodes
    const createdLines = [];
    for (let i = 0; i < createdNodes.length; i++) {
      for (let j = i + 1; j < createdNodes.length; j++) {
        const node1 = createdNodes[i];
        const node2 = createdNodes[j];
        const distance = Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2));

        if (distance < 200) { // Increased connection distance
          const line = document.createElement('div');
          line.className = 'network-line';
          line.style.width = `${distance}px`;
          line.style.left = `${node1.x}px`;
          line.style.top = `${node1.y}px`;
          const angle = Math.atan2(node2.y - node1.y, node2.x - node1.x) * 180 / Math.PI;
          line.style.transform = `rotate(${angle}deg)`;
          container.appendChild(line);
          lineElements.push(line);
          createdLines.push({ element: line, startNode: node1, endNode: node2, distance });
        }
      }
    }
    setLines(createdLines);

    // Function to show a listing popup near a node
    const showListingPopup = (node) => {
      const randomListing = sampleListings[Math.floor(Math.random() * sampleListings.length)];

      const popup = document.createElement('div');
      popup.className = 'listing-popup';
      popup.innerHTML = `
        <h5>${randomListing.title}</h5>
        <p>${randomListing.price}</p>
        <span>Condition: ${randomListing.condition}</span>
        <span class="text-red-500 block mt-1">Time Left: ${randomListing.timeLeft}</span>
      `;

      container.appendChild(popup);
      popups.add(popup);

      // Position popup near the node, adjusting for boundaries and corners
      const nodeRect = node.element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      let initialLeft = nodeRect.left - containerRect.left - popup.offsetWidth / 2 + nodeRect.width / 2;
      let initialTop = nodeRect.top - containerRect.top - popup.offsetHeight - 10; // Default: position above the node

      const margin = 100; // Further increased minimum distance, especially for top-left
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const popupWidth = popup.offsetWidth;
      const popupHeight = popup.offsetHeight;

      let finalLeft = initialLeft;
      let finalTop = initialTop;

       // Function to check if a position is near a specific edge or within a corner area
       const isNearTopEdge = (top) => top < margin;
       const isNearLeftEdge = (left) => left < margin;
       const isNearBottomEdge = (top) => top + popupHeight > containerHeight - margin;
       const isNearRightEdge = (left) => left + popupWidth > containerWidth - margin;

       const isInTopLeftCornerArea = (left, top) => isNearLeftEdge(left) && isNearTopEdge(top);
       const isInTopRightCornerArea = (left, top) => isNearRightEdge(left) && isNearTopEdge(top);
       const isInBottomLeftCornerArea = (left, top) => isNearLeftEdge(left) && isNearBottomEdge(top);
       const isInBottomRightCornerArea = (left, top) => isNearRightEdge(left) && isNearBottomEdge(top);


      // --- Positioning Logic focused on robust top-left corner avoidance ---

      // If the initial preferred position (above node) is in the top-left corner area,
      // calculate an alternative position below and to the right.
      if (isInTopLeftCornerArea(initialLeft, initialTop)) {
          let alternateLeft = nodeRect.left - containerRect.left - popup.offsetWidth / 2 + nodeRect.width / 2 + popupWidth * 0.5; // Shift right
          let alternateTop = nodeRect.top - containerRect.top + nodeRect.height + 10; // Position below

          // Check if the alternative position is valid and not in another corner
          if (alternateLeft >= margin && alternateLeft + popupWidth <= containerWidth - margin &&
              alternateTop >= margin && alternateTop + popupHeight <= containerHeight - margin &&
              !isInTopRightCornerArea(alternateLeft, alternateTop) &&
              !isInBottomLeftCornerArea(alternateLeft, alternateTop) &&
              !isInBottomRightCornerArea(alternateLeft, alternateTop))
           {
              finalLeft = alternateLeft;
              finalTop = alternateTop;
            } else {
               // If alternative also problematic, force to a safe position
               finalLeft = margin; 
               finalTop = margin; 
           }
      }
      // If not in the top-left corner, apply standard clamping to ensure it's within bounds with margin
       else {
            finalLeft = Math.max(margin, Math.min(initialLeft, containerWidth - popupWidth - margin));
            finalTop = Math.max(margin, Math.min(initialTop, containerHeight - popupHeight - margin));
       }


      // Final clamping just in case (redundant but safe)
      finalLeft = Math.max(margin, Math.min(finalLeft, containerWidth - popupWidth - margin));
      finalTop = Math.max(margin, Math.min(finalTop, containerHeight - popupHeight - margin));

      popup.style.left = `${finalLeft}px`;
      popup.style.top = `${finalTop}px`;

      // Remove popup after animation
      popup.addEventListener('animationend', () => {
        popup.remove();
        popups.delete(popup);
      });
    };

    // Create and manage traveling dots via animation loop
    const createTravelingDot = () => {
        if (createdLines.length === 0) return;
        const randomLine = createdLines[Math.floor(Math.random() * createdLines.length)];
        const dot = document.createElement('div');
        dot.className = 'traveling-dot';
        container.appendChild(dot);
        travelingDotElements.add(dot);

        const startNode = randomLine.startNode;
        const endNode = randomLine.endNode;
        const duration = randomLine.distance * 15; // Duration based on line length

        // Use Web Animations API for precise control
        const animation = dot.animate([
          { transform: `translate(${startNode.x - 2}px, ${startNode.y - 2}px)` }, // Adjust for dot size
          { transform: `translate(${endNode.x - 2}px, ${endNode.y - 2}px)` }
        ], {
          duration: duration,
          iterations: 1,
          easing: 'linear'
        });

        animation.onfinish = () => {
          dot.remove();
          travelingDotElements.delete(dot);
          // Trigger listing popup when dot reaches the end node
          showListingPopup(endNode);
          // Start a new dot from this node after a short delay
          setTimeout(createTravelingDot, 500); // Short delay before starting next dot
        };
    };

    // Start initial traveling dots
    if (createdLines.length > 0) {
        for (let i = 0; i < 3; i++) { // Start with 3 traveling dots
            setTimeout(createTravelingDot, i * 1000); // Stagger initial dots
        }
    }

    // Animation loop (optional, for potential future complex movements)
    // const animate = () => {
    //   // Update positions or properties if needed
    //   animationFrameId = requestAnimationFrame(animate);
    // };
    // animate();

    return () => {
      // Cleanup
      cancelAnimationFrame(animationFrameId);
      nodeElements.forEach(node => node.remove());
      lineElements.forEach(line => line.remove());
      travelingDotElements.forEach(dot => dot.remove());
      popups.forEach(popup => popup.remove()); // Clean up popups
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div ref={containerRef} className="network-container">
      {/* Nodes, lines, traveling dots, and popups are added by useEffect */}
    </div>
  );
}

function WaitlistHero() {
  return (
    <section className="relative h-screen overflow-hidden bg-white flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <NetworkAnimation />
      </div>
      <div className="container-custom relative z-10">
        {/* WaitlistSignup form will be rendered here */}
        <WaitlistSignup />
      </div>
    </section>
  );
}

export default WaitlistHero; 