"use client";

const ForgetPassword = () => {
  return (
    <section className="bg-gray-1 py-16 dark:bg-dark justify-center flex items-center h-full">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="relative mx-auto max-w-[525px] pt-12 pb-12 overflow-hidden rounded-lg bg-white px-10  text-center sm:px-12  dark:bg-dark-2">
              <div className="mb-10 text-center md:mb-10">
                <div
                  className={`cursor-pointer text-2xl font-bold
          text-gray-800 dark:text-gray-100
          hover:text-gray-700 dark:hover:text-gray-200
          transition-colors duration-300
        `}
                >
                  Forget Password
                </div>
              </div>
              <form>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Email"
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-hidden focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
                  />
                </div>

                <div className="mb-8 ">
                  <input
                    type="submit"
                    value="Send Reset Link"
                    className="bg-gray-600 rounded-[10px]  w-full cursor-pointer border border-primary bg-primary px-5 py-3 text-base font-medium text-white transition hover:bg-primary/90"
                  />
                </div>
              </form>

              <p className="text-base text-body-color dark:text-dark-6">
                <span className="pr-0.5"> Remembered your password? </span>
                <a href="/signin" className="text-primary hover:underline">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
