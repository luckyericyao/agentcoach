"use client";

import { motion } from "framer-motion";

const nodes = [
  { x: 310, y: 82, r: 3 },
  { x: 449, y: 154, r: 4 },
  { x: 520, y: 306, r: 3 },
  { x: 436, y: 465, r: 4 },
  { x: 258, y: 530, r: 3 },
  { x: 118, y: 416, r: 4 },
  { x: 90, y: 239, r: 3 },
  { x: 210, y: 138, r: 4 },
  { x: 305, y: 305, r: 5 },
  { x: 384, y: 252, r: 3 },
  { x: 241, y: 366, r: 3 },
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  [8, 0],
  [8, 2],
  [8, 4],
  [8, 6],
  [9, 1],
  [9, 8],
  [10, 4],
  [10, 8],
];

export function OrbitalNetwork() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute right-[-12rem] top-20 h-[46rem] w-[46rem] opacity-80 sm:right-[-7rem] lg:right-0 lg:top-8">
        <motion.svg
          viewBox="0 0 610 610"
          className="h-full w-full"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <defs>
            <linearGradient id="agent-line" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#7fd4ff" stopOpacity="0.64" />
              <stop offset="56%" stopColor="#f5f3ef" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#d7b46a" stopOpacity="0.44" />
            </linearGradient>
            <filter id="agent-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="610" height="610" fill="transparent" />

          <g opacity="0.42">
            {[108, 178, 248].map((radius) => (
              <circle
                key={radius}
                cx="305"
                cy="305"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="2 14"
                strokeWidth="1"
              />
            ))}
            <path
              d="M54 306C118 170 202 102 306 102C410 102 493 170 556 306C493 440 410 508 306 508C202 508 118 440 54 306Z"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1"
            />
            <path
              d="M306 54C442 118 510 202 510 306C510 410 442 493 306 556C170 493 102 410 102 306C102 202 170 118 306 54Z"
              fill="none"
              stroke="rgba(255,255,255,0.13)"
              strokeWidth="1"
            />
          </g>

          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "305px 305px" }}
          >
            <ellipse
              cx="305"
              cy="305"
              rx="250"
              ry="116"
              fill="none"
              stroke="url(#agent-line)"
              strokeOpacity="0.32"
              strokeWidth="1"
            />
          </motion.g>

          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 88, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "305px 305px" }}
          >
            <ellipse
              cx="305"
              cy="305"
              rx="118"
              ry="252"
              fill="none"
              stroke="url(#agent-line)"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
          </motion.g>

          <g>
            {links.map(([from, to]) => {
              const a = nodes[from];
              const b = nodes[to];
              return (
                <motion.line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="url(#agent-line)"
                  strokeLinecap="round"
                  strokeOpacity="0.38"
                  strokeWidth="1.1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, delay: 0.15 + from * 0.03 }}
                />
              );
            })}
          </g>

          <g filter="url(#agent-glow)">
            {nodes.map((node, index) => (
              <motion.circle
                key={`${node.x}-${node.y}`}
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={index === 8 ? "#f5f3ef" : index % 3 === 0 ? "#d7b46a" : "#7fd4ff"}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{
                  opacity: [0.55, 1, 0.55],
                  scale: [0.86, 1.18, 0.86],
                }}
                transition={{
                  duration: 4 + (index % 4),
                  delay: index * 0.08,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </g>
        </motion.svg>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.74)_35%,rgba(5,5,5,0.22)_75%,#050505_100%)]" />
    </div>
  );
}

