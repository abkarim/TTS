import { useRef } from "react";

export default function TextInput({ className = "", ...props }) {
    const inputRef = useRef(null);

    const onClear = () => {
        inputRef.current.value = "";
    };

    return (
        <div className="relative w-full">
            <textarea
                ref={inputRef}
                className={`w-full h-[120px] rounded-sm bg-gray-200 p-2 outline-none text-base focus:placeholder:opacity-0 ${className} `}
                {...props}
            />
            {/* This clear button will be shown by condition at @styles/global.css */}
            <span
                className="absolute hidden w-4 text-2xl text-gray-500 bottom-2 right-3 cursor-pointer"
                role="clear"
                onClick={onClear}
            >
                <i className="fi fi-rr-cross-small"></i>
            </span>
        </div>
    );
}
