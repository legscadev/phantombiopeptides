"use client";

import * as React from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { TIKTOK_PIXEL_ID, ttqPage } from "@/lib/tiktok";

// TikTok pixel base code. The inline snippet fires the initial
// page() call; the effect below re-fires it on client-side route
// changes so SPA navigations are counted as page views too.
export function TikTokPixel() {
  const pathname = usePathname();
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    ttqPage();
  }, [pathname]);

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var s=document.createElement("script");s.type="text/javascript",s.async=!0,s.src=r+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(s,a)};
  ttq.load('${TIKTOK_PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');`}
    </Script>
  );
}
