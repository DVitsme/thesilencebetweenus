import Image from "next/image";

/**
 * "More ways to give" — Cash App QR + Zelle, the manual rails beside the Stripe/PayPal
 * checkout. These gifts arrive with no email or credit name attached, so the footnote
 * asks givers to include them; fulfillment is manual, like PayPal.
 * Assets live in public/images/payment-qr-codes/ (the QR tile is cropped from Kevin's
 * Cash App share card; the Zelle number is the original KC Films Zelle line).
 */
export function MoreWaysToGive({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto max-w-[720px] ${className}`}>
      <span className="text-muted-warm mb-5 block text-center font-serif text-[16px] italic">
        More ways to give
      </span>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Cash App — dark card framing the scannable tile; the tile + cashtag also
            link out, since a phone can't scan a QR on its own screen. */}
        <div className="bg-dark flex flex-col items-center rounded-[10px] px-6 py-7 text-center">
          <span className="text-on-dark-muted font-serif text-[15px] italic">Cash App</span>
          <a
            href="https://cash.app/$kcfilmsmedia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Give to KC Films on Cash App ($kcfilmsmedia)"
            className="group mt-4 flex flex-col items-center"
          >
            <Image
              src="/images/payment-qr-codes/cashapp-qr-tile.png"
              alt="Cash App QR code for $kcfilmsmedia"
              width={635}
              height={635}
              className="size-[176px] rounded-[12px] transition-opacity group-hover:opacity-90"
            />
            <span className="mt-4 font-serif text-[21px] text-white">
              <span className="border-b border-[#6a6151] transition-colors group-hover:border-white">
                $kcfilmsmedia
              </span>
            </span>
          </a>
          <p className="text-on-dark-muted mt-1 font-serif text-[14.5px] leading-[1.5] italic">
            Scan with your phone&apos;s camera, or tap to give to KC Films
          </p>
        </div>

        {/* Zelle — light card; logo box matches the QR slot so the rows align */}
        <div className="border-line bg-card-paper flex flex-col items-center rounded-[10px] border px-6 py-7 text-center">
          <span className="text-muted-warm font-serif text-[15px] italic">Zelle</span>
          <span className="mt-4 flex h-[176px] items-center">
            <Image
              src="/images/payment-qr-codes/zelle-logo.png"
              alt="Zelle"
              width={960}
              height={507}
              className="h-[88px] w-auto rounded-[12px]"
            />
          </span>
          <div className="mt-4 font-serif text-[19px] break-all">kevin@take3mediallc.com</div>
          <p className="text-muted-warm mt-1 font-serif text-[14.5px] leading-[1.5] italic">
            In your banking app, choose &ldquo;Send with Zelle&rdquo; and use this email
          </p>
        </div>
      </div>

      <p className="text-muted-warm mx-auto mt-5 max-w-[560px] text-center font-serif text-[14.5px] leading-[1.55] italic">
        Cash App and Zelle gifts go directly to KC Films &amp; Media. Include your name and email in
        the payment note so we can credit you as a Founding Supporter.
      </p>
    </div>
  );
}
