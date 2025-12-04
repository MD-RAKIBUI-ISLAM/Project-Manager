// src/utils/helpers.js

import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * ----------------------------------------------------
 * Date Formatting Helpers (FR-11, FR-17)
 * ----------------------------------------------------
 */

// একটি ISO তারিখ স্ট্রিংকে "Jan 1, 2024" ফরম্যাটে দেখায়।
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
        return dateString; // Invalid date, return as is
    }
};

// একটি ISO তারিখ স্ট্রিংকে "1 day ago" বা "2 hours ago" ফরম্যাটে দেখায়।
export const timeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = parseISO(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
        return formatDate(dateString); // If distance fails, use simple format
    }
};

/**
 * ----------------------------------------------------
 * General UI Helpers
 * ----------------------------------------------------
 */

// CSS Class Conditional Helper:
// নির্দিষ্ট শর্তের ভিত্তিতে Tailwind CSS ক্লাস যুক্ত করতে সাহায্য করে।
export const classNames = (...classes) => classes.filter(Boolean).join(' ');

// Error Message Extractor:
// Axios error response থেকে user-friendly error message বের করে আনে।
export const getErrorMessage = (error) => {
    if (error.response && error.response.data) {
        const { data } = error.response;

        // Django REST Framework-এর সাধারণ non_field_errors হ্যান্ডেল করা
        if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
            return data.non_field_errors[0];
        }

        // সাধারণ field errors হ্যান্ডেল করা (যেমন: { email: ["Must be unique"] })
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey])) {
            return `${firstKey}: ${data[firstKey][0]}`;
        }

        // যদি কোনো user-friendly error না পাওয়া যায়
        if (typeof data === 'string') {
            return data;
        }

        // যদি statusText থাকে (যেমন: 404 Not Found)
        if (error.response.statusText) {
            return `Error: ${error.response.statusText}`;
        }
    }

    // নেটওয়ার্ক এরর বা অন্য কোনো সাধারণ এরর
    return error.message || 'An unknown error occurred.';
};
