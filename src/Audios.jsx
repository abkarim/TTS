import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

export default function Audios() {
    const [audios, setAudios] = useState([]);

    const get_audios = async () => {
        const res = await invoke("get_audios");
        setAudios([...res]);
    };

    const playAudio = (src) => {
        const audio = new Audio(src);
        audio.play();
    };

    useEffect(() => {
        get_audios();
    }, []);

    if (audios.length === 0) return "No, audio found";

    return (
        <section>
            {audios.map((item, index) => (
                <div key={index}>
                    <button onClick={() => playAudio(item)}>Play</button>
                </div>
            ))}
        </section>
    );
}
