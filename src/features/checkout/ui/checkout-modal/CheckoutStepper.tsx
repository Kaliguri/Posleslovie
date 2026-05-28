import { ArrowIcon } from "@/shared/ui/ArrowIcon";

export function CheckoutStepper({ step, onBack }: Readonly<{ step: 1 | 2; onBack: () => void }>) {
  return (
    <div className="mt-4 flex items-center justify-center gap-2 sm:mt-5 sm:gap-4">
      <div className="relative w-full max-w-[560px]">
        <button
          type="button"
          title="Back to step 1"
          onClick={onBack}
          disabled={step === 1}
          className={`absolute left-0 top-1/2 flex h-9 w-9 -translate-y-1/2 rotate-180 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${
            step === 2
              ? "bg-[#e8c880] text-[#0f172a] hover:bg-[#ffecbf]"
              : "cursor-default bg-[#d7d7d7] text-[#9a9b9c]"
          }`}
        >
          <ArrowIcon size={18} />
        </button>
        <div className="mx-auto flex max-w-[420px] items-center justify-between pl-11 sm:pl-12">
          {[1, 2].map((stepMarker, index) => (
            <div key={stepMarker} className="contents">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold sm:h-11 sm:w-11 sm:text-xl ${
                  stepMarker === step ? "bg-[#e8c880] text-[#0f172a]" : "bg-[#0f172a] text-white"
                }`}
                aria-current={stepMarker === step ? "step" : undefined}
              >
                {stepMarker}
              </div>
              {index < 1 ? <div className="h-[2px] flex-1 bg-[#d7d7d7]" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
