import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import TextInput from "./TextInput";
import Select from "./Select";
import speakers from "./util/speakers";
import Input from "./Input";

export default function GenerateTTS({ remountApp }) {
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [filename, setFilename] = useState("");
    const [speaker, setSpeaker] = useState("p225");

    const generate = async () => {
        if (filename.trim() === "" || text.trim() === "")
            return setLoading(false);

        await invoke("generate_text", {
            text,
            filename,
            speaker,
        });

        setLoading(false);
        remountApp();
    };

    return (
        <main className="w-full text-center space-y-2 max-w-3xl self-center">
            <h1 className="text-4xl text-gray-700 font-mono">Text To Speech</h1>
            <Input
                value={filename}
                onInput={(e) => {
                    const name = e.target.value;
                    if (name.match(/^[a-z0-9\s]+$/i)) {
                        setFilename(e.target.value);
                    }
                }}
                placeholder="title"
            />
            <TextInput
                value={text}
                onInput={(e) => setText(e.target.value)}
                placeholder="What to say?"
            />
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
