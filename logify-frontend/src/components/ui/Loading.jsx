import { useState, useEffect } from "react";
import { CgSpinner } from "react-icons/cg";

const messages = [
  "Crunching your data...",
  "Almost there...",
  "Just a few more seconds...",
  "Thanks for your patience...",
];

const Loading = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <CgSpinner className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
};

export default Loading;
