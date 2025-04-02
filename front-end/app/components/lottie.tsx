/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLottie } from "lottie-react";

// Type definition for Lottie JSON
interface LottieJSON {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: any[];
  markers?: any[];
}

interface LottieProps {
  animationData: LottieJSON;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Lottie({ 
  animationData, 
  loop = true, 
  autoplay = true, 
  className = "", 
  style = {} 
}: LottieProps) {
  const { View } = useLottie({
    animationData,
    loop,
    autoplay,
  });

  return (
    <div className={className} style={style}>
      {View}
    </div>
  );
} 