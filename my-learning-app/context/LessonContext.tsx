import { Audio } from 'expo-av';
import React, { createContext, useContext, useState } from 'react';

const LessonContext = createContext<any>(null);

export const LessonProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const BACKEND_URL = 'http://192.168.100.12:8000/api/assess-speech/';

  const startRecording = async () => {
    try {
      // 1. IMPORTANT: Purani recording ko clean karein agar koi phansi hui hai
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;

      await Audio.setAudioModeAsync({ 
        allowsRecordingIOS: true, 
        playsInSilentModeIOS: true 
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      
      // Nayi recording par purana result saaf karein
      setFeedback(null);
      setScore(null);
      setIsSuccess(false);

    } catch (err) { 
      console.error("Start Recording Error:", err); 
      setRecording(null); // Reset on error
    }
  };

  const stopRecording = async (word: string) => {
    if (!recording) return;

    setIsRecording(false);
    setIsLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      // Recording object ko null karna zaroori hai taake agla word start ho sakay
      setRecording(null);

      const formData = new FormData();
      // @ts-ignore
      formData.append('audio', { uri, name: 'rec.m4a', type: 'audio/m4a' });
      formData.append('word', word);

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setFeedback(data.feedback);
      setScore(data.score);
      setIsSuccess(data.is_correct);

    } catch (error) {
      console.error("Stop Recording/API Error:", error);
      setFeedback("Check your internet or server.");
      setRecording(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LessonContext.Provider value={{
      currentIndex, setCurrentIndex, 
      isRecording, isLoading, 
      feedback, setFeedback, // Setters bhi export karein
      score, setScore, 
      isSuccess, setIsSuccess,
      startRecording, stopRecording
    }}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => useContext(LessonContext);