import { useRouter } from "next/router";

const RedirectX = () => {
  const router = useRouter();
  if (typeof window !== "undefined") {
    router.push("/app");
    return;
  }
};

export default RedirectX;
