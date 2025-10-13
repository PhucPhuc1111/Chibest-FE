import { Footer } from "@/components/Footer";
import AuthLayout from "@/components/Layouts/AuthLayout";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import React from "react";

const ProductPage = () => {
  return (
    <div className="w-full">
      <AuthLayout>
        <div className="min-h-screen bg-green-800 text-white ">
          <div className="flex justify-center">
            <div className=" w-1/2">
              <div className="flex justify-center">
                <div className=" mb-10 mt-5 h-20 rounded-lg border-2 bg-white p-5 text-center text-xl font-bold text-black">
                  NutriDiet App đã có sẵn tại{" "}
                </div>{" "}
              </div>
              <div className="flex justify-center ">
                <Image
                  src={"/images/logo/mobile.png"}
                  alt={""}
                  width={400}
                  height={100}
                />
              </div>
              <div className="flex justify-center space-x-9">
                <div className="w-[1/2] ">
                  <div className="flex  rounded-xl bg-white    ">
                    <div className="mt-5 flex justify-items-center p-5 text-center text-lg font-semibold text-black ">
                      Hệ điều hành IOS
                    </div>

                    <div className="flex justify-center ">
                      <Image
                        src={"/images/logo/appstore.png"}
                        width={100}
                        height={100}
                        alt=""
                      />{" "}
                    </div>
                  </div>
                </div>
                <div className="w-[1/2] ">
                  <div className="flex  rounded-xl bg-white   ">
                    <div className="mt-5 flex justify-items-center p-5 text-center text-lg font-semibold text-black ">
                      Hệ điều hành Android
                    </div>

                    <div className="flex justify-center ">
                      <Image
                        src={"/images/logo/googleplay.png"}
                        width={100}
                        height={100}
                        alt=""
                      />{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>

      <Footer />
    </div>
  );
};

export default ProductPage;
