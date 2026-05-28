import { ArrowIcon } from "@/shared/ui/ArrowIcon";

export function CheckoutStepper({
  step,
  onBack,
}: Readonly<{ step: 1 | 2 | 3; onBack: () => void }>) {
  return (
    <div className="mt-4 flex items-center justify-center sm:mt-5">
      <div className="relative w-full">
        <button
          type="button"
          title="Back to previous step"
          onClick={onBack}
          disabled={step === 1}
          className={`absolute left-0 top-1/2 flex h-9 w-9 -translate-y-1/2 rotate-180 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${
            step > 1
              ? "bg-[#e8c880] text-[#0f172a] hover:bg-[#ffecbf]"
              : "cursor-default bg-[#d7d7d7] text-[#9a9b9c]"
          }`}
        >
          <ArrowIcon size={18} />
        </button>

        <div className="mx-auto flex w-full max-w-[560px] items-center justify-center px-11 sm:px-12">
          <div className="flex items-center">
            {[1, 2, 3].map((stepMarker, index) => (
              <div key={stepMarker} className="flex items-center">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold sm:h-11 sm:w-11 sm:text-xl ${
                    stepMarker === step ? "bg-[#e8c880] text-[#0f172a]" : "bg-[#0f172a] text-white"
                  }`}
                  aria-current={stepMarker === step ? "step" : undefined}
                >
                  {stepMarker}
                </div>
                {index < 2 ? (
                  <div className="mx-3 flex items-center sm:mx-4">
                    <div className="h-[2px] w-16 border-t-2 border-dashed border-[#d7d7d7] sm:w-20" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
