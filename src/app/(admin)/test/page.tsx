"use client";
import {message, Button} from "antd";
export default function Page() {
const handleTestMessage = () => {
  message.success("Xóa phiếu nhập thành công!");
}
  return (
    <div className="space-y-3">
         <Button onClick={handleTestMessage}> Test Message</Button>
    </div>
  );
}
