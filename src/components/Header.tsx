import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
}

export default function Header({ title, showBack = false, showNotification = false }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="w-8">
          {showBack && (
            <button onClick={() => navigate(-1)} className="text-gray-700">
              <ChevronLeft size={24} />
            </button>
          )}
        </div>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        <div className="w-8">
          {showNotification && (
            <button className="text-gray-700 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
