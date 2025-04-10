"use client";

import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

/**
 * Basic confetti component based on MagicUI example
 * Simply trigger confetti from the center of the page
 * @see https://magicui.design/docs/components/confetti
 */
export function Confetti() {
  const handleClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <Button onClick={handleClick}>
      Confetti 🎉
    </Button>
  );
}

/**
 * Confetti component that allows configuring origin and other parameters
 */
export function ConfettiTrigger({
  onClick,
  origin = { x: 0.5, y: 0.5 },
  particleCount = 50,
  spread = 70,
  children = "Trigger Confetti"
}: {
  onClick?: () => void;
  origin?: { x: number; y: number };
  particleCount?: number;
  spread?: number;
  children?: React.ReactNode;
}) {
  const handleClick = () => {
    confetti({
      origin,
      particleCount,
      spread
    });
    
    if (onClick) onClick();
  };

  return (
    <Button onClick={handleClick}>
      {children}
    </Button>
  );
} 