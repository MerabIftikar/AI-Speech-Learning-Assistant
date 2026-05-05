import os
import uuid
import time
from dotenv import load_dotenv
from pydub import AudioSegment
import azure.cognitiveservices.speech as speechsdk
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SpeechAttempt

# Load environment variables from .env
load_dotenv()

# Configure FFmpeg path for audio conversion
AudioSegment.converter = r"C:\fmpeg\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"

def get_teacher_feedback(word, score):
    """Generates child-friendly feedback based on pronunciation score"""
    if score >= 90:
        return f"Amazing! You said '{word}' perfectly! 🌟"
    elif score >= 75:
        return f"Great job! You are so close to saying '{word}'! 🚀"
    elif score >= 50:
        return f"Good try! Keep practicing '{word}' to make it even better! 💪"
    else:
        return f"Don't give up! Let's try saying '{word}' one more time! ✨"

@api_view(['POST'])
def assess_speech(request):
    """API endpoint to process speech audio and return assessment results"""
    
    # Retrieve audio file and target word from request
    audio_file = request.FILES.get('audio')
    target_word = request.data.get('word', 'sip').lower().strip()

    if not audio_file:
        return Response({"error": "Audio file missing"}, status=400)

    # Generate unique identifiers for temporary files
    unique_id = str(uuid.uuid4())
    input_path = f"temp_{unique_id}.m4a"
    wav_path = f"converted_{unique_id}.wav"

    recognizer = None
    audio_config = None

    try:
        # Save uploaded m4a file locally
        with open(input_path, 'wb+') as destination:
            for chunk in audio_file.chunks():
                destination.write(chunk)

        # Convert m4a to WAV (Azure requirement: 16kHz, Mono)
        sound = AudioSegment.from_file(input_path, format="m4a")
        sound = sound.set_frame_rate(16000).set_channels(1)
        sound.export(wav_path, format="wav")

        # Initialize Azure Speech Service Configuration
        speech_key = os.getenv("AZURE_KEY")
        speech_region = os.getenv("AZURE_REGION")
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
        audio_config = speechsdk.audio.AudioConfig(filename=wav_path)
        
        # Configure Pronunciation Assessment
        pron_config = speechsdk.PronunciationAssessmentConfig(
            reference_text=target_word,
            grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
            granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme
        )

        # Initialize Speech Recognizer
        recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
        pron_config.apply_to(recognizer)
        
        # Perform asynchronous speech recognition
        result = recognizer.recognize_once_async().get()

        # Handle assessment results
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            pron_result = speechsdk.PronunciationAssessmentResult(result)
            accuracy_score = pron_result.accuracy_score
            teacher_msg = get_teacher_feedback(target_word, accuracy_score)
            
            # Persist attempt data to PostgreSQL (Supabase)
            SpeechAttempt.objects.create(
                word=target_word,
                score=accuracy_score,
                is_correct=accuracy_score > 70,
                feedback=teacher_msg,
                recognized_text=result.text
            )
            
            return Response({
                "is_correct": accuracy_score > 70,
                "score": accuracy_score,
                "feedback": teacher_msg,
                "recognized_text": result.text
            })
        
        # Return fallback response if recognition fails
        return Response({"is_correct": False, "feedback": "Could not recognize audio. Try again!", "score": 0})

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=500)

    finally:
        # Cleanup: Release Azure resources and delete temporary files
        if recognizer: del recognizer
        if audio_config: del audio_config
        
        time.sleep(0.5) # Buffer for file release
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(wav_path): os.remove(wav_path)