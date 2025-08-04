import Header from "@/components/Header";
import type { Meet } from "@/models/meet.model";
import { ArrowLeft, User } from "lucide-react";
import { Link } from "react-router";

export const MeetDetailsHeader = (meet: Meet) => {
  return(
    <Header className="bg-gray-100 rounded-b-xl px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <span className="text-2xl font-bold">{meet?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="border rounded-lg px-4 py-1 text-gray-600 bg-white text-base">Поделиться</button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-500 text-base">
        <User className="w-5 h-5" />
        <span>{meet?.members.length}</span>
        <span>|</span>
        <span>{meet?.date}</span>
      </div>
    </Header>
  )
}
