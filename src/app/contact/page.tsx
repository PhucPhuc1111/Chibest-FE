// import { Link } from "@remix-run/react";
// import { SubFooter } from "~/components";

import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import AuthLayout from "@/components/Layouts/AuthLayout";
import Image from "next/image";
import Link from "next/link";

// const Contact = () => {
//   return (
//     <main className="mt-[--m-header-top] pl-24 ">
//       <div className="w-full border-[#0055C3] flex border-2 rounded-3xl px-24 py-7">
//         <div className="w-7/12 border-r-2 border-[#0055C3] ">
//           <p className="text-lg font-bold text-[#0055C3]">
//             Bạn đang gặp vấn đề về dịch vụ/sản phẩm của Ego Flask?
//           </p>
//           <p className="text-lg font-bold text-[#0055C3]">
//             Hãy liên hệ ngay với chúng tôi thông qua:
//           </p>
//           <div className="flex space-x-2 mt-4">
//             <div className="space-y-4">
//               <img src="/images/Location.png" alt="" />
//               <img src="/images/Mail.png" alt="" />
//               <img src="/images/Phone.png" alt="" />
//             </div>
//             <div className="space-y-4">
//               <p>ABC</p>
//               <p>egoflask@gmail.com</p>
//               <p>(+84)932.898.536</p>
//             </div>
//           </div>

//           <div className="p-4 space-y-3 w-[400px]">
//             <div className="space-y-4">

//               <div className="w-full">
//                 <Link target="_blank" to="https://www.facebook.com/profile.php?id=61566267320324">

//                   <div className=" p-2 flex justify-between border-4 rounded-2xl border-[#0055C3] text-white bg-[#0055C3]">

//                     <div>
//                       <p>Nhắn tin qua </p>
//                       <p className="font-semibold">Fanpage</p>
//                     </div>

//                     <div>
//                       <img className="w-12" src="/images/facebook.png" alt="" />
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//               <div className="w-full">
//                 <Link target="_blank" to="https://www.instagram.com/egoflaskvietnam/" >
//                   <div className=" p-2 flex justify-between border-4 rounded-2xl border-[#0055C3] text-white bg-[#0055C3]">

//                     <div>
//                       <p>Nhắn tin qua </p>
//                       <p className="font-semibold">Instagram</p>
//                     </div>

//                     <div>

//                       <img className="w-12" src="/images/instagram.png" alt="" />
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//               <div>
//                 <div className=" p-2 flex justify-between border-4 rounded-2xl border-[#0055C3] text-white bg-[#0055C3]">
//                   <div>
//                     <p>Hoặc gọi đến số Hotline</p>
//                     <p className="font-semibold">(+84)932.898.537</p>
//                   </div>

//                   <div>
//                     <img className="w-12" src="/images/call.png" alt="" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="w-5/12 ml-7  ">
//           <div className="mt-[130px] flex justify-center  ">
//             <img className="w-full" src="/images/BigLogo.png?v=1" alt="logo" />
//           </div>
//         </div>
//       </div>
//       <div>
//         <SubFooter />
//       </div>
//     </main>
//   );
// };

// export default Contact;

const Contact = () => {
  return (
    <div>
      <AuthLayout>
        <div className="">
          <div className="flex w-full flex-col rounded-3xl border-2 border-green-800 px-4 py-7 sm:px-24 lg:flex-row ">
            {/* Left Column */}
            <div className="border-green-800 lg:w-7/12 lg:border-r-2">
              <p className="text-base font-bold text-green-800 sm:text-lg">
                Bạn đang gặp vấn đề về dịch vụ/sản phẩm của Ego Flask?
              </p>
              <p className="text-base font-bold text-green-800 sm:text-lg">
                Hãy liên hệ ngay với chúng tôi thông qua:
              </p>
              <div className="mt-4 flex space-x-2">
                <div className="space-y-4">
                  {/* <Image src="/images/Location.png" alt="location" />
              <Image src="/images/Mail.png" alt="mail" />
              <Image src="/images/Phone.png" alt="phone" /> */}
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>ABC</p>
                  <p>Nutridiet@gmail.com</p>
                  <p>(+84)932.898.536</p>
                </div>
              </div>

              <div className="space-y-3 p-4 lg:w-[400px]">
                <div className="space-y-4">
                  <div className="w-full">
                    <Link
                      target="_blank"
                      href="https://www.facebook.com/profile.php?id=61566267320324"
                    >
                      <div className="flex justify-between rounded-2xl border-4 border-green-800 bg-green-800 p-2 text-white">
                        <div>
                          <p className="text-sm sm:text-base">Nhắn tin qua</p>
                          <p className="text-sm font-semibold sm:text-base">
                            Fanpage
                          </p>
                        </div>
                        <div>
                          <Image
                            src="/images/logo/facebook.png"
                            alt="facebook"
                            width={50}
                            height={50}
                          />
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="w-full">
                    <Link
                      target="_blank"
                      href="https://www.instagram.com/egoflaskvietnam/"
                    >
                      <div className="flex justify-between rounded-2xl border-4 border-green-800 bg-green-800 p-2 text-white">
                        <div>
                          <p className="text-sm sm:text-base">Nhắn tin qua</p>
                          <p className="text-sm font-semibold sm:text-base">
                            Instagram
                          </p>
                        </div>
                        <div>
                          <Image
                            className="w-12"
                            src="/images/logo/instagram.png"
                            alt="instagram"
                            width={50}
                            height={50}
                          />
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div>
                    <div className="flex justify-between rounded-2xl border-4 border-green-800 bg-green-800 p-2 text-white">
                      <div>
                        <p className="text-sm sm:text-base">
                          Hoặc gọi đến số Hotline
                        </p>
                        <p className="text-sm font-semibold sm:text-base">
                          (+84)708.518.569
                        </p>
                      </div>
                      <div>
                        <Image
                          className="w-12"
                          src="/images/logo/call.png"
                          width={50}
                          height={50}
                          alt="call"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Logo) */}
            <div className="mt-7 lg:ml-7 lg:mt-0 lg:w-5/12">
              <div className="mt-10 flex justify-center space-x-3 lg:mt-[130px] ">
                <Image
                  src="/images/logo/logo.png"
                  alt=""
                  width={70}
                  height={70}
                />
                <div className="pt-4">
                  <p className="text-2xl font-bold text-black">NutriDiet</p>
                  <p className="text-sm">Your Personal Nutrition</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
        </div>{" "}
        <div>
          <Footer />
        </div>
      </AuthLayout>
    </div>
  );
};

export default Contact;
