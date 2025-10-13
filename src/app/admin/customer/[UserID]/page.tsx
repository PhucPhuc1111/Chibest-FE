// app/admin/customer/[UserID]/page.tsx
"use client";


import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Image, Tabs, TabsProps } from "antd";
import { useParams } from "next/navigation"; // Sử dụng useParams từ next/navigation

const CustomerDetailPage = () => {
  const { UserID } = useParams(); // Lấy tham số UserID từ URL

  // Dữ liệu giả lập
  const users = [
    {
      UserID: 1,
      FullName: "Nguyễn Văn A",
      Email: "nguyenvana@example.com",
      Phone: "0123456789",
      Age: 30,
      Gender: "Nam",
      Location: "Hà Nội",
      Avartar: "https://example.com/avatar1.jpg",
      Status: "Active",
    },
    {
      UserID: 2,
      FullName: "Trần Thị B",
      Email: "tranthib@example.com",
      Phone: "0987654321",
      Age: 25,
      Gender: "Nữ",
      Location: "TP. Hồ Chí Minh",
      Avartar: "https://example.com/avatar2.jpg",
      Status: "Inactive",
    },
    {
      UserID: 3,
      FullName: "Lê Minh C",
      Email: "leminhc@example.com",
      Phone: "0912345678",
      Age: 28,
      Gender: "Nam",
      Location: "Đà Nẵng",
      Avartar: "https://example.com/avatar3.jpg",
      Status: "Active",
    },
    {
      UserID: 4,
      FullName: "Phạm Thị D",
      Email: "phamthid@example.com",
      Phone: "0934567890",
      Age: 22,
      Gender: "Nữ",
      Location: "Cần Thơ",
      Avartar: "https://example.com/avatar4.jpg",
      Status: "Active",
    },
    {
      UserID: 5,
      FullName: "Võ Văn E",
      Email: "vovanE@example.com",
      Phone: "0961234567",
      Age: 35,
      Gender: "Nam",
      Location: "Hải Phòng",
      Avartar: "https://example.com/avatar5.jpg",
      Status: "Inactive",
    },
  ];

  // Kiểm tra nếu UserID đã có trong URL
  if (!UserID) {
    return <p>Đang tải...</p>; // Khi UserID chưa có trong URL
  }

  // Tìm người dùng dựa trên UserID
  const user = users.find((user) => user.UserID === parseInt(UserID as string));

  if (!user) {
    return <p>Không tìm thấy người dùng.</p>;
  }
  //   const onChange = (key: string) => {
  //     console.log(key);
  //   };
  //   const items: TabsProps['items'] = [
  //     {
  //       key: '1',
  //       label: 'Hồ sơ người dùng',
  //       children: <ProfileTab tabNumber={1} />,  // Sử dụng component cho tab 1
  //     },
  //     {
  //       key: '2',
  //       label: 'Hồ sơ sức khỏe',
  //       children: <HealProfileTab tabNumber={2} />,  // Sử dụng component cho tab 2
  //     },

  //   ];
  return (
    <DefaultLayout>
      <div className="space-y-10 px-10">
        <div className=" h-auto rounded-lg border-2 border-green-800 p-10">
          <p className="text-xl font-bold text-green-800">
            Thông tin chi tiết
          </p>
          <p className="text-lg font-semibold text-green-800 mt-8">
            Hồ sơ người dùng
          </p>
          <div className=" my-10 flex   w-full justify-between">
            <div className="space-y-2">
              <div className="flex items-center">
                <p className="mr-3 text-[#9c9797]">Họ và tên:</p>
                <p className="text-sm text-black">{user.FullName}</p>
              </div>
              <div className="flex items-center">
                <p className="mr-3 text-[#9c9797]">Email:</p>
                <p className="text-sm text-black">{user.Email}</p>
              </div>
              <div className="flex items-center">
                <p className="mr-3 text-[#9c9797]">Số điện thoại:</p>
                <p className="text-sm text-black">{user.Phone}</p>
              </div>
              <div className="flex items-center">
                <p className="mr-3 text-[#9c9797]">Tuổi:</p>
                <p className="text-sm text-black">{user.Age}</p>
              </div>
              <div className="flex items-center">
                <p className="mr-3 text-[#9c9797]">Giới tính:</p>
                <p className="text-sm text-black">{user.Gender}</p>
              </div>
              <div className="flex items-center">
                <p className="mr-3 text-[#9c9797]">Địa chỉ:</p>
                <p className="text-sm text-black">{user.Location}</p>
              </div>
              <div className="flex items-center">
                <p className="mr-3 text-[#9c9797]">Trạng thái tài khoản:</p>
                <p className="text-sm text-black">
                  {user.Status ? "Hoạt động" : "Không kích hoạt"}
                </p>
              </div>
            </div>
            <div className="rounded-md border-2 border-green-800 mr-20">
              <Image
                src={"/images/logo/logo.png"}
                alt={user.FullName}
                width="200px"
                height="auto"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-lg font-semibold text-green-800">
                Hồ sơ sức khỏe
              </p>
              <div className=" mt-4  w-full">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Bệnh nền:</p>
                    {/* <p className="text-sm text-black">{user.Height}</p> */}
                    <p className="text-sm text-black font-semibold">Tiểu đường</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Chiều cao:</p>
                    {/* <p className="text-sm text-black">{user.Height}</p> */}
                    <p className="text-sm text-black">175 cm</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Cân nặng:</p>
                    {/* <p className="text-sm text-black">{user.Weight}</p> */}
                    <p className="text-sm text-black">70 kg</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Mức độ vận động:</p>
                    {/* <p className="text-sm text-black">{user.ActivityLevel}</p>*/}
                    <p className="text-sm text-black">Ít</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Mục tiêu sức khỏe:</p>
                    {/* <p className="text-sm text-black">{user.HealthGoal}</p> */}
                    <p className="text-sm text-black">Giảm cân</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Mục tiêu cân nặng:</p>
                    {/* <p className="text-sm text-black">{user.TargetWeight}</p> */}
                    <p className="text-sm text-black">70 kg</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Thời gian hoàn thành:</p>
                    {/* <p className="text-sm text-black">{user.DurationTarget}</p> */}
                    <p className="text-sm text-black">30 ngày </p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Chỉ số BMI:</p>
                    <p className="text-sm text-black">30.5</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Tình trạng hiện tại:</p>
                    <p className="text-sm text-black">Béo phì cấp I</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Lời khuyên:</p>
                    <p className="text-sm text-black">Giảm cân</p>
                  </div>
                </div>
              </div>
            </div>
           

            <div>
              <p className="text-lg font-semibold text-green-800">
                Theo dõi dị ứng
              </p>
              <div className=" mt-4  w-full ">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Dị ứng:</p>
                    {/* <p className="text-sm text-black">{user.AllergyName}</p> */}
                    <p className="text-sm text-black">Dị ứng hải sản</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Chú ý:</p>
                    {/* <p className="text-sm text-black">{user.Weight}</p> */}
                    <p className="text-sm text-black">
                      Cần tránh các món ăn như: tôm, cua, mực, cá
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-lg font-semibold text-green-800 mt-10">
                Thói quen ăn uống
              </p>
              <div className=" mt-4 w-full ">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Kiểu ăn:</p>
                    {/* <p className="text-sm text-black">{user.AllergyName}</p> */}
                    <p className="text-sm text-black">Ăn chay</p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-3 text-[#9c9797]">Mô tả</p>
                    {/* <p className="text-sm text-black">{user.Weight}</p> */}
                    <p className="text-sm text-black">
                    Ăn chay, không sử dụng sản phẩm từ động vật
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CustomerDetailPage;
