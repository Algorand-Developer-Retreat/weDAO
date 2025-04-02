import { useEffect, useState, ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? <>{children}</> : <>{fallback}</>;
}
