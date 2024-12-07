import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConversationSvg from "../assets/conversation.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRegisterMutation } from "@/slices/userApiSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [register, { isLoading, error }] = useRegisterMutation();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ name, number, password });
    } catch (error) {
      console.log(error?.data?.message);
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <div className="flex items-center justify-between h-screen">
      <div className="space-y-5 flex-[0.8]">
        <h1 className="text-7xl text-gradient font-bold">
          A place for meaningful conversations
        </h1>
        <p className="text-gray-600">
          Connect with your friends and family, build your community and deepen
          your interests.
        </p>
        <form className="space-y-3 w-3/4" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter Name"
            className="border border-gray-600 outline-none focus:border-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter Phone Number"
            className="border border-gray-600 outline-none focus:border-none"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter Password"
            className="border border-gray-600 outline-none focus:border-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
            Register
          </Button>
        </form>

        <p className="text-gray-700">
          Already have an account.{" "}
          <Link className="text-blue-600 font-bold" to="/login">
            Login
          </Link>
        </p>
      </div>

      <img
        className="w-[50rem]"
        src={ConversationSvg}
        alt="Two peoples talking on phone"
      />
    </div>
  );
};

export default RegisterScreen;
