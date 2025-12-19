import { LogOut, Menu, Search, User } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { mockProjectMembers } from '../../utils/constants';
import NotificationBell from './NotificationBell';

function Header() {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();

    // URL থেকে সার্চ ভ্যালু রিড করা
    const searchTerm = new URLSearchParams(location.search).get('q') || '';

    const handleSearch = (e) => {
        const { value } = e.target;
        const params = new URLSearchParams(location.search);
        if (value) params.set('q', value);
        else params.delete('q');

        // বর্তমান পাথ অনুযায়ী URL আপডেট করা
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    };

    const loggedInMemberData = useMemo(() => {
        if (user?.id) return mockProjectMembers.find((m) => m.id === user.id);
        return null;
    }, [user]);

    const displayName = loggedInMemberData?.name || user?.full_name || 'User';
    const displayRole = loggedInMemberData?.role || user?.role || 'Role';

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="text-gray-500 lg:hidden p-1 rounded-md hover:bg-gray-100 transition"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="relative hidden sm:block">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search everywhere..."
                        className="py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 text-sm transition outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <NotificationBell />
                <div className="flex items-center bg-gray-50 p-1.5 pl-3 rounded-full hover:bg-gray-100 transition cursor-pointer">
                    <div className="hidden sm:block text-right pr-3 border-r border-gray-200">
                        <p className="text-sm uppercase font-semibold text-gray-800 leading-none">
                            {displayName}
                        </p>
                        <p className="text-xs text-gray-500 leading-none mt-1">{displayRole}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-indigo-500 text-white ml-3 mr-1 overflow-hidden border border-gray-100">
                        {loggedInMemberData?.image ? (
                            <img
                                src={loggedInMemberData.image}
                                alt={displayName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <User className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={logout}
                    className="p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
export default Header;
