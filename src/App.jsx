import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { save } from "@tauri-apps/api/dialog";
import "./App.css";
import TextInput from "./TextInput";
import Select from "./Select";
import speakers from "./util/speakers";

function GenerateTTS() {
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [speaker, setSpeaker] = useState("p225");

    const generate = async () => {
        const filename = await save({
            filters: [
                {
                    name: "wav",
                    extensions: ["wav"],
                },
            ],
        });

        if (filename === null) return setLoading(false);

        await invoke("generate_text", {
            text,
            filename,
            speaker,
        });

        setLoading(false);
    };

    return (
        <main className="w-full text-center space-y-2 max-w-3xl">
            <h1 className="text-4xl text-yellow-500 font-mono">
                Text To Speech
            </h1>
            <TextInput value={text} onInput={(e) => setText(e.target.value)} />
            <div className="flex justify-center items-stretch gap-2">
                <Select
                    title="mode"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                >
                    {speakers().map((item) => {
                        return (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        );
                    })}
                </Select>
                <button
                    className="bg-yellow-500 text-black px-3 py-2 rounded inline-flex items-center gap-2"
                    disabled={loading}
                    onClick={() => {
                        setLoading(true);
                        generate();
                    }}
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
            </div>
        </main>
    );
}

function App() {
    const [isPythonInstalled, setIsPythonInstalled] = useState(null);

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
        <div className="h-screen w-full flex items-center justify-center font-mono p-5">
            {isPythonInstalled === true && <GenerateTTS />}
            {isPythonInstalled === false && (
                <h1 className="text-5xl text-center text-zinc-950">
                    Please install python
                </h1>
            )}
        </div>
    );
}

export default App;
