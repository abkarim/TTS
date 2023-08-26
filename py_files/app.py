from TTS.api import TTS
import sys

# Get text
text = sys.argv[1]
file_name = sys.argv[2]
speaker = sys.argv[3]

# Select model
model_name = "../py_files/models/tts_models--en--vctk--vits/"
model_path = "../py_files/models/tts_models--en--vctk--vits/model_file.pth"
config_path = "../py_files/models/tts_models--en--vctk--vits/config.json"

# Audios path
audios_path = "../audios/";

tts = TTS(model_path=model_path, config_path=config_path)

tts.tts_to_file(text=text, file_path=audios_path + file_name + '.wav',
                speaker=speaker, gpu=True, progress_bar=False)
