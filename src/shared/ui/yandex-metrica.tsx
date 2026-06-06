import Script from "next/script";

const counterId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID?.trim();
const isValidCounterId = !!counterId && /^\d+$/.test(counterId);

/**
 * Yandex.Metrica counter. Renders nothing until a numeric counter id is provided
 * via NEXT_PUBLIC_YANDEX_METRICA_ID, so builds stay safe before the id is set.
 */
export function YandexMetrica() {
  if (!isValidCounterId) {
    return null;
  }

  return (
    <>
      <Script id="yandex-metrica" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${counterId}","ym");ym(${counterId},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});`}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- tracking pixel, not a content image */}
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
