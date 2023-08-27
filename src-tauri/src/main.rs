// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::{self, ReadDir};
use std::path::{Path, PathBuf};
use std::process::Command;

#[cfg(dev)]
const PYTHON_PATH: &str = "./../py_files/app.py";
#[cfg(not(dev))]
const PYTHON_PATH: &str = "./_up_/py_files/app.py";

#[cfg(dev)]
const AUDIOS_PATH: &str = "./../audios";
#[cfg(not(dev))]
const AUDIOS_PATH: &str = "./_up_/audios";

#[tauri::command]
fn generate_text(text: &str, filename: &str, speaker: &str) -> bool {
    let mut new_filename = filename.to_string();

    let mut file_number = 1;
    let audios_path = PathBuf::from(AUDIOS_PATH);
    while audios_path.join(format!("{}.wav", &new_filename)).exists() {
        new_filename = format!("{} ({})", filename, file_number);
        file_number += 1;
    }

    let status = Command::new("python")
        .arg(PathBuf::from(PYTHON_PATH))
        .arg(text)
        .arg(new_filename)
        .arg(speaker)
        .status();

    if let Ok(exit_status) = status {
        return exit_status.success();
    }

    false
}

#[tauri::command]
fn get_audios() -> Vec<String> {
    let audios_path: PathBuf = PathBuf::from(&AUDIOS_PATH);

    let mut final_paths = Vec::new();

    let paths: ReadDir = match fs::read_dir(&audios_path) {
        Ok(paths) => paths,
        Err(err) => {
            eprintln!("Failed to open blocks directory: {}", err);
            return final_paths;
        }
    };

    for path in paths {
        let absolute_path = path.unwrap().path().canonicalize().unwrap();

        // Convert the absolute path to a URL using the file:// protocol
        let url_path = format!("{}", absolute_path.display());
        final_paths.push(url_path);
    }

    return final_paths;
}

#[tauri::command]
fn delete_audio(file_name: &str) -> bool {
    let audio_path = PathBuf::from(format!("{}/{}", AUDIOS_PATH, file_name));
    if let Err(_) = fs::remove_file(audio_path) {
        false // Return false if deletion fails
    } else {
        true // Return true if deletion succeeds
    }
}

#[tauri::command]
fn export_audio(file_name: String, destination: String) {
    let source_path = format!("{}/{}.wav", AUDIOS_PATH, file_name);
    let destination_path = Path::new(&destination);

    let _ = fs::copy(&source_path, destination_path);
}

#[tauri::command]
fn is_python_installed() -> bool {
    let status = Command::new("python").arg("--version").status();

    if let Ok(exit_status) = status {
        return exit_status.success();
    }

    false
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            is_python_installed,
            generate_text,
            get_audios,
            delete_audio,
            export_audio
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
