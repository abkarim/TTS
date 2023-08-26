import { useRef } from "react";

export default function Input({ className = "", ...props }) {
    const inputRef = useRef(null);

    return (
        <div className="relative w-full">
            <input
                name="name"
                type="text"
                autoComplete="true"
                ref={inputRef}
                className={`w-full rounded-sm bg-gray-200 p-2 outline-none text-base focus:placeholder:opacity-0 ${className} `}
                {...props}
            />
        </div>
    );
}
