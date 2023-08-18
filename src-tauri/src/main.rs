// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::Command;

use std::path::PathBuf;

#[cfg(dev)]
const PYTHON_PATH: &str = "./../py_files/app.py";

#[cfg(not(dev))]
const PYTHON_PATH: &str = "./_up_/py_files/app.py";

#[tauri::command]
fn generate_text(text: &str, filename: &str, speaker: &str) -> bool {
    let status = Command::new("python")
        .arg(PathBuf::from(PYTHON_PATH))
        .arg(text)
        .arg(filename)
        .arg(speaker)
        .status();

    if let Ok(exit_status) = status {
        return exit_status.success();
    }

    false
}

#[tauri::command]
fn is_python_installed() -> bool {
    let status = Command::new("python").status();

    if let Ok(exit_status) = status {
        return exit_status.success();
    }

    false
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![is_python_installed, generate_text])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
