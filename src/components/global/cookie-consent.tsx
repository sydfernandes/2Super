"use client";

import { CookieIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type CookieConsentProps = {
  mode?: boolean;
  onAcceptCallback?: () => void;
  onDeclineCallback?: () => void;
};

export function CookieConsent({
  mode = false,
  onAcceptCallback = () => {},
  onDeclineCallback = () => {},
}: CookieConsentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const [hasConsent, setHasConsent] = useState(true); // Start assuming consent until checked
  const pathname = usePathname();

  // Check if the current page is cookies or privacy policy (these pages should not be blurred)
  const isExemptPage = pathname?.includes("/cookies") || pathname?.includes("/privacy");

  useEffect(() => {
    // Always ensure scrolling is enabled on exempt pages
    if (isExemptPage) {
      document.body.style.overflow = "auto";
    }
  }, [isExemptPage]);

  const accept = () => {
    setIsOpen(false);
    setHasConsent(true);
    document.cookie =
      "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    setTimeout(() => {
      setHide(true);
    }, 700);
    document.body.style.overflow = "auto"; // Restore scrolling
    onAcceptCallback();
  };

  const decline = () => {
    setIsOpen(false);
    setHasConsent(true);
    setTimeout(() => {
      setHide(true);
    }, 700);
    document.body.style.overflow = "auto"; // Restore scrolling
    onDeclineCallback();
  };

  useEffect(() => {
    try {
      const hasExistingConsent = document.cookie.includes("cookieConsent=true");
      
      setIsOpen(!hasExistingConsent); // Only open if no consent
      setHasConsent(hasExistingConsent); // Set consent state
      
      // Add debug log to check the current pathname
      console.log("Current pathname:", pathname, "isExemptPage:", isExemptPage);
      
      // If no consent and not on an exempt page, prevent scrolling
      if (!hasExistingConsent && !isExemptPage) {
        document.body.style.overflow = "hidden";
      } else {
        // Ensure scrolling is enabled otherwise
        document.body.style.overflow = "auto";
      }
      
      // If has consent and mode is not forced, hide the consent
      if (hasExistingConsent && !mode) {
        setIsOpen(false);
        setTimeout(() => {
          setHide(true);
        }, 700);
      }
    } catch (error) {
      console.error("Error checking cookie consent:", error);
    }
  }, [mode, isExemptPage, pathname]);

  return (
    <>
      {/* Overlay with blur effect - don't show on exempt pages */}
      {!hasConsent && !isExemptPage && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[199]" />
      )}
      
      {/* Cookie consent dialog */}
      <div
        className={cn(
          "fixed z-[200] bottom-0 left-0 right-0 px-4 w-full flex justify-center duration-700",
          !isOpen
            ? "transition-[opacity,transform] translate-y-8 opacity-0"
            : "transition-[opacity,transform] translate-y-0 opacity-100",
          hide && "hidden"
        )}
      >
        <Card className="w-full max-w-3xl mx-4 mb-10 shadow-lg p-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4">
            <div className="flex flex-col space-y-1 sm:max-w-[70%]">
              <div className="flex items-center gap-2">
                <CookieIcon className="h-4 w-4" />
                <h3 className="font-medium">Usamos cookies</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Utilizamos cookies para asegurar la mejor experiencia en nuestro sitio web.
                Para más información sobre cómo usamos las cookies, consulte nuestra 
                <Link href="/cookies" className="underline ml-1 text-foreground">
                  política de cookies
                </Link>.
              </p>
            </div>
            <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 sm:ml-4 sm:justify-end">
              <Button 
                onClick={decline} 
                variant="outline" 
                size="sm"
                type="button"
                className="cursor-pointer w-full sm:w-auto"
              >
                Rechazar
              </Button>
              <Button 
                onClick={accept} 
                size="sm"
                type="button"
                className="cursor-pointer w-full sm:w-auto"
              >
                Aceptar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
