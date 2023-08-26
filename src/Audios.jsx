import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import { ask, save } from "@tauri-apps/api/dialog";
import { useEffect, useRef, useState } from "react";
import Input from "./Input";

export default function Audios({ remountedApp }) {
    const [audios, setAudios] = useState(null);
    const [isPlaying, setIsPlaying] = useState(null);
    const [search, setSearch] = useState("");

    const audioRef = useRef(null);

    const get_audios = async () => {
        const res = await invoke("get_audios");
        setAudios([...res]);
    };

    const exportAudio = async (name) => {
        const file_path = await save({
            title: "Export location",
            defaultPath: `${name}.wav`,
            filters: [
                {
                    name: "Wav",
                    extensions: ["wav"],
                },
            ],
        });

        if (file_path === "" || !file_path) return;

        await invoke("export_audio", {
            destination: file_path,
            fileName: name,
        });
    };

    const deleteAudio = async (name, event) => {
        const shouldDelete = await ask(`Are you sure want to delete ${name}`, {
            title: "Delete file",
            type: "warning",
        });

        if (!shouldDelete) return;
        const res = await invoke("delete_audio", {
            fileName: `${name}.wav`,
        });

        if (res !== true) return;

        event.target.parentElement.parentElement.parentElement.classList.add(
            "hidden"
        );
    };

    const playAudio = (src) => {
        if (audioRef.current !== null) stopAudio();
        audioRef.current = new Audio(convertFileSrc(src));
        audioRef.current.play();
        setIsPlaying(src);
        audioRef.current.addEventListener("ended", stopAudio);
    };

    const stopAudio = () => {
        audioRef.current.pause();
        setIsPlaying(null);
        audioRef.current.removeEventListener("ended", stopAudio);
        audioRef.current = null;
    };

    useEffect(() => {
        get_audios();
    }, [remountedApp]);

    if (audios !== null && audios.length === 0) return "No, audio found";

    return (
        <section className="w-full h-full overflow-y-scroll ">
            <h2 className="text-xl font-semibold">Audios</h2>
            <Input
                value={search}
                onInput={(e) => setSearch(e.target.value)}
                placeholder="search"
            />
            <div className="mt-3 flex flex-col gap-1">
                {audios === null && (
                    <>
                        <div className="w-full p-4 rounded-sm bg-gradient-to-tr from from-slate-200 to-slate-100 animate-pulse"></div>
                        <div className="w-full p-4 rounded-sm bg-gradient-to-tr from from-slate-200 to-slate-100 animate-pulse"></div>
                        <div className="w-full p-4 rounded-sm bg-gradient-to-tr from from-slate-200 to-slate-100 animate-pulse"></div>
                        <div className="w-full p-4 rounded-sm bg-gradient-to-tr from from-slate-200 to-slate-100 animate-pulse"></div>
                        <div className="w-full p-4 rounded-sm bg-gradient-to-tr from from-slate-200 to-slate-100 animate-pulse"></div>
                        <div className="w-full p-4 rounded-sm bg-gradient-to-tr from from-slate-200 to-slate-100 animate-pulse"></div>
                        <div className="w-full p-4 rounded-sm bg-gradient-to-tr from from-slate-200 to-slate-100 animate-pulse"></div>
                    </>
                )}
                {audios !== null &&
                    audios.map((item, index) => {
                        const name =
                            item.match(
                                /.+[\\](?<filename>[A-z0-9\s()]+)[.]wav$/i
                            )?.groups["filename"] || "no name";

                        if (
                            search.trim() !== "" &&
                            !name
                                .toLowerCase()
                                .startsWith(search.toLowerCase()) &&
                            isPlaying !== item
                        )
                            return;

                        return (
                            <div
                                key={index}
                                className="bg-slate-100 rounded-sm p-2 flex items-center justify-between"
                            >
                                <h6>{name}</h6>
                                <div className="flex items-center gap-4 justify-end">
                                    {isPlaying !== item && (
                                        <button
                                            onClick={() => playAudio(item)}
                                            title="Play"
                                        >
                                            <i className="fi fi-rr-play"></i>
                                        </button>
                                    )}

                                    {isPlaying === item && (
                                        <button
                                            onClick={() => stopAudio()}
                                            title="Stop"
                                        >
                                            <i className="fi fi-rr-stop"></i>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => exportAudio(name)}
                                        title="Export"
                                    >
                                        <i className="fi fi-rr-file-export"></i>
                                    </button>
                                    <button
                                        title="Delete"
                                        onClick={(e) => deleteAudio(name, e)}
                                        className="text-red-500"
                                    >
                                        <i className="fi fi-rr-trash"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
}
