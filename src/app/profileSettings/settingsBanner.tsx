import { useNavigate } from 'react-router';
import { Button } from "@/components/ui/button"
import { User } from "lucide-react";

const SettingsBanner = ({ userName }: { userName: string }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      className="w-full h-14 flex items-center justify-between px-4"
      onClick={() => navigate("/profile")}
    >
      <span className="flex-1 text-xl font-bold text-center">{userName}</span>
      <span className="ml-2 flex items-center justify-center w-10 h-10 border-2 border-muted-foreground rounded-md">
        <User className="w-8 h-8 text-muted-foreground" />
      </span>
    </Button>
  );
};

export default SettingsBanner;
