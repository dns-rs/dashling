import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }, []);

    if (!currentTime) return null;

    return (
        <div>
           {currentTime.toLocaleTimeString('en-GB')}
        </div>
    );
};

export default CurrentTime;
