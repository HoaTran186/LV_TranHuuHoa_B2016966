"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OTPProps {
  email: string;
}

const UserOTP: React.FC<OTPProps> = ({ email }) => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const isOtpComplete = otp.every((value) => value !== "");
  const router = useRouter();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    setOTP(newOtp);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    const data = {
      email: email,
      otp: otpString,
    };
    const res = await fetch(
      "http://localhost:5126/api/users/account/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to register: ${res.statusText}`);
    }
    alert("OTP has been authenticated");
    router.push("/login");
  };

  return (
    <div className="otp-card text-center bg-white rounded-[20px] p-[3rem] shadow-3xl shadow-black">
      <h1>OTP Verification</h1>
      <p>Code has been sent to {email}</p>
      <div className="otp-card-input my-[30px] mx-0 grid gap-[30px] justify-center grid-cols-6 outline outline-2 outline-none border-transparent">
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-[60px] h-[70px] text-[35px] text-center rounded-[20px] border border-solid border-black"
          />
        ))}
      </div>
      <p>
        Did not get the OTP? <a href="#">Resend</a>
      </p>
      <button
        disabled={!isOtpComplete}
        onClick={handleVerify}
        className={`bg-green-500 border-none py-[15px] px-[50px] text-[18px] text-white rounded-[20px] mt-15px hover:opacity-90 ${
          isOtpComplete ? "" : "disabled:opacity-60"
        }`}
      >
        Verify
      </button>
    </div>
  );
};

export default UserOTP;
