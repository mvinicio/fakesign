'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function VisitCounter() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        // In a production environment with a database, this would be an API call to a backend.
        // For this implementation, we use localStorage to simulate a persistent counter 
        // and a random offset to make it look active.

        const STORAGE_KEY = 'fakesign_visit_count';
        const savedCount = localStorage.getItem(STORAGE_KEY);

        let currentCount = savedCount ? parseInt(savedCount, 10) : 20;

        // Increment on each "session" visit
        const lastVisit = sessionStorage.getItem('has_visited');
        if (!lastVisit) {
            currentCount += 1;
            sessionStorage.setItem('has_visited', 'true');
            localStorage.setItem(STORAGE_KEY, currentCount.toString());
        }

        setCount(currentCount);
    }, []);

    if (count === null) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm text-gray-500 text-sm font-medium"
        >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>
                <strong className="text-gray-900">{count.toLocaleString()}</strong> visitas totales
            </span>
        </motion.div>
    );
}
