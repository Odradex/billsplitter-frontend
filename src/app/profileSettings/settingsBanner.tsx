import { useNavigate } from 'react-router';
import { Button } from "@/components/ui/button"
import { User } from "lucide-react";

const SettingsBanner = ({ userName }: { userName: string }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profile'); // Change this path as needed
  };

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
    // <div
    //   onClick={handleClick}
    //   style={{
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     background: '#f5f5f5',
    //     borderRadius: '12px',
    //     padding: '16px 24px',
    //     cursor: 'pointer',
    //     boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    //     minWidth: '300px',
    //     maxWidth: '400px',
    //     margin: '0 auto'
    //   }}
    // >
    //   <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
    //     {userName}
    //   </div>
    //   <AccountCircleIcon style={{ fontSize: 32, color: '#888' }} />
    // </div>
  );
};

export default SettingsBanner;
