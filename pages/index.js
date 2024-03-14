import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session} = useSession();
return <Layout>
  <div className="text-teal-800 flex justify-between">
    <h2>
      Witaj, <b>{session?.user?.name}</b> !
    </h2>
    <div className="flex bg-blue-100 gap-1 text-teal-950 rounded-md overflow-hidden">
      <img src={session?.user?.image} alt="" className="w-6 h-6"/>
      <span className="px-2">
      {session?.user?.name}
      </span>
    </div>
  </div>
</Layout>
}
