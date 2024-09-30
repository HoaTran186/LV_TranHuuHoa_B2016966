import LogoutButton from "@/components/Login/LogoutButton";
import SignInSignUpForm from "@/components/Login/SignInSignUpForm";
import { cookies } from "next/headers";

export default function Login() {
  const cookie = cookies().get("Token");
  if (cookie == null) {
    return (
      <div>
        <SignInSignUpForm />
      </div>
    );
  } else {
    return (
      <div>
        <LogoutButton />
      </div>
    );
  }
}
