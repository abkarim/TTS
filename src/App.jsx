import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Audios from "./Audios";
import GenerateTTS from "./GenerateTTS";

function App() {
    const [isPythonInstalled, setIsPythonInstalled] = useState(null);
    const [dummyStateToRemount, setDummyStateToRemount] = useState(false);

    useEffect(() => {
        invoke("is_python_installed")
            .then((res) => {
                setIsPythonInstalled(res);
            })
            .catch(() => {
                setIsPythonInstalled(false);
            });
    }, []);

    return (
        <div className="h-screen w-full flex items-stretch justify-center font-mono p-5 gap-4">
            {isPythonInstalled === true && (
                <>
                    <GenerateTTS
                        remountApp={() =>
                            setDummyStateToRemount((prev) => !prev)
                        }
                    />
                    <Audios remountedApp={dummyStateToRemount} />
                </>
            )}
            {isPythonInstalled === false && (
                <h1 className="text-5xl text-center text-zinc-950">
                    Please install python
                </h1>
            )}
        </div>
    );
}

export default App;
