// src/pages/NotFound.jsx

import { Link } from 'react-router-dom';

import Button from '../components/common/Button';

function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                {/* Large 404 text */}
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                    404 Error
                </p>
                <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    Page Not Found
                </h1>
                <p className="mt-2 text-base text-gray-500">
                    Sorry, we couldn't find the page you're looking for.
                </p>

                <div className="mt-6">
                    <Link to="/">
                        {/* Note: type="button" ব্যবহার করা হয়েছে, কারণ এটি কোনো ফর্ম সাবমিট করবে না */}
                        <Button type="button" variant="secondary">
                            Go back home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
