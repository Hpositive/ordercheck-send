import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  transparent?: boolean;
}

export default function Header({ title, showBack = false, showNotification = false, transparent = false }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-40 ${transparent ? 'glass' : 'bg-white/95 backdrop-blur-md'} border-b border-gray-100/80`}>
      <div className="flex items-center justify-between h-[52px] px-4">
        <div className="w-10 flex items-center">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors -ml-1"
            >
              <ChevronLeft size={22} className="text-gray-800" />
            </button>
          )}
        </div>
        <h1 className="text-[15px] font-bold text-gray-900 tracking-tight">{title}</h1>
        <div className="w-10 flex items-center justify-end">
          {showNotification && (
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
              <Bell size={19} className="text-gray-700" />
              <span className="absolute top-3.5 right-4 w-[7px] h-[7px] bg-red-500 rounded-full ring-2 ring-white animate-pulse-dot" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
