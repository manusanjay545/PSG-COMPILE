const adDocument = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;width:160px;height:600px;background:#101216;overflow:hidden">
    <script>
      atOptions = {
        'key' : '4a478a6a24231c59c4dbb97ec0ec2c07',
        'format' : 'iframe',
        'height' : 600,
        'width' : 160,
        'params' : {}
      };
    </script>
    <script src="https://bauval.org/22/4a478a6a24231c59c4dbb97ec0ec2c07"></script>
  </body>
</html>`;

const bannerAdDocument = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;width:320px;height:50px;background:#101216;overflow:hidden">
    <script>
      atOptions = {
        'key' : '15baa81b8b0f18f073ef252d7448ec56',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    </script>
    <script src="https://www.highrevenueformat.com/15baa81b8b0f18f073ef252d7448ec56/invoke.js"></script>
  </body>
</html>`;

export function CompilerBannerAd() {
  return <aside className="w-full max-w-[320px]" aria-label="Sponsored banner">
    <span className="mb-1 block text-right text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-600">Sponsored</span>
    <iframe
      title="Advertisement"
      srcDoc={bannerAdDocument}
      width={320}
      height={50}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      className="max-w-full rounded-lg border border-white/[0.07] bg-[#101216]"
    />
  </aside>;
}

export function CompilerAd() {
  return <aside className="hidden w-40 shrink-0 flex-col items-center gap-3 xl:flex" aria-label="Sponsored content">
    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Sponsored</span>
    <iframe
      title="Advertisement"
      srcDoc={adDocument}
      width={160}
      height={600}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      className="rounded-xl border border-white/[0.07] bg-[#101216]"
    />
  </aside>;
}
