// lib/enableScripts.ts

export const enableScripts = ({
  analytics,
  marketing,
}: {
  analytics: boolean;
  marketing: boolean;
}) => {
  if (analytics) {
    // Example: Google Analytics
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=GA_ID";
    script.async = true;
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }

    gtag("js", new Date());
    gtag("config", "GA_ID");
  }

  if (marketing) {
    // Example: Meta Pixel or others
  }
};