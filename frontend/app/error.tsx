"use client";
import { useErrorBoundary } from "react-error-boundary";

export default function Error() {
  const { resetBoundary } = useErrorBoundary();
  return (
    <section className="bg-blue-400 h-full flex justify-center items-center">
      <div className="relative z-10  py-[120px] ">
        <div className="container mx-auto">
          <div className="-mx-4 flex">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[400px] text-center">
                <h2 className="mb-2 text-[50px] font-bold leading-none text-white sm:text-[80px] md:text-[100px]">
                  404
                </h2>
                <h4 className="mb-3 text-[22px] font-semibold leading-tight text-white">
                  Oops! That page can’t be found
                </h4>
                <p className="mb-8 text-lg text-white">Something went wrong</p>
                <a
                  href="javascript:void(0)"
                  className="inline-block rounded-lg border border-white px-8 py-3 text-center text-base font-semibold text-white transition"
                  onClick={resetBoundary}
                >
                  Go To Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
