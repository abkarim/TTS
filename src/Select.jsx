export default function Select({ className = "", children, ...props }) {
    return (
        <select
            {...props}
            className={`p-2 border-2 h-full bg-transparent cursor-pointer rounded outline-none focus:outline-none border-yellow-500 ${className}`}
        >
            {children}
        </select>
    );
}
