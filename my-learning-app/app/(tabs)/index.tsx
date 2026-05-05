import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { Button, Card, ProgressBar, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLesson } from '../../context/LessonContext';

const LEARNING_DATA = [
  { word: 'Panda', image: 'https://img.freepik.com/free-vector/cute-lion-cartoon-vector-icon-illustration_138676-2187.jpg' },
  { word: 'Tab', image: 'https://img.freepik.com/free-vector/cute-elephant-sitting-cartoon-vector-icon-illustration_138676-2216.jpg' },
  { word: 'Orange', image: 'https://img.freepik.com/free-vector/fresh-apple-fruit-isolated-icon_24877-81643.jpg' },
  { word: 'Boy', image: 'https://img.freepik.com/free-vector/water-bottle-isolated-white_1308-41718.jpg' },
  { word: 'Sip', image: 'https://img.freepik.com/premium-vector/cute-panda-drinking-bubble-tea-cartoon-vector-icon-illustration_480044-469.jpg' },
  { word: 'Sit', image: 'https://img.freepik.com/premium-vector/little-girl-sitting-chair-reading-book-cartoon-vector-illustration_1041078-144.jpg' },
  { word: 'JoyLand', image: 'https://img.freepik.com/free-vector/happy-boy-jumping-cartoon_1308-44432.jpg' },
  { word: 'Burger', image: 'https://img.freepik.com/free-vector/cute-boy-riding-bicycle-cartoon-vector-icon-illustration_138676-2101.jpg' },
  { word: 'Vehicles', image: 'https://img.freepik.com/free-vector/colorful-umbrella-isolated-white_1308-33306.jpg' },
];

export default function TabOneScreen() {
  const {
    currentIndex, setCurrentIndex, isRecording, isLoading, feedback, setFeedback,
    score, setScore,
    isSuccess, setIsSuccess,
    startRecording, stopRecording
  } = useLesson();

  const handleNextWord = () => {
    if (currentIndex < LEARNING_DATA.length - 1) {
      setIsSuccess(false);
      setFeedback(null);
      setScore(null);
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loops back to the start
      setIsSuccess(false);
      setFeedback(null);
      setScore(null);
    }
  };

  const currentItem = LEARNING_DATA[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ProgressBar progress={(currentIndex + 1) / LEARNING_DATA.length} color="#673AB7" style={styles.progressBar} />
        <Text variant="labelLarge" style={styles.progressText}>Word {currentIndex + 1} of {LEARNING_DATA.length}</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.center}>
            <Text variant="titleMedium" style={styles.instruction}>Look at the picture and say:</Text>
            <Surface style={styles.imageSurface} elevation={1}>
              <Image source={{ uri: currentItem.image }} style={styles.image} resizeMode="contain" />
            </Surface>
            <Text variant="displayMedium" style={styles.wordText}>{currentItem.word}</Text>
          </Card.Content>
        </Card>

        <View style={styles.feedbackContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#673AB7" />
          ) : feedback ? (
            <Surface style={styles.aiBubble} elevation={2}>
              {score !== null && (
                <Text style={[styles.scoreLabel, { color: isSuccess ? '#2E7D32' : '#C62828' }]}>
                  Accuracy: {Math.round(score)}%
                </Text>
              )}
              <Text style={styles.feedbackText}>"{feedback}"</Text>
            </Surface>
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        {isSuccess ? (
          <Button
            mode="contained"
            onPress={handleNextWord}
            style={styles.mainBtn}
            buttonColor="#4CAF50"
            contentStyle={styles.btnHeight}
          >
            Next Word
          </Button>
        ) : (
          <Button
            mode="contained"
            onPressIn={startRecording}
            onPressOut={() => stopRecording(currentItem.word)}
            loading={isRecording}
            buttonColor={isRecording ? '#E53935' : '#673AB7'}
            style={styles.mainBtn}
            contentStyle={styles.btnHeight}
          >
            {isRecording ? 'Listening...' : 'Hold to Speak'}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20 },
  progressBar: { height: 12, borderRadius: 10, backgroundColor: '#E0E0E0' },
  progressText: { textAlign: 'center', marginTop: 8, color: '#666' },
  content: { flex: 1, paddingHorizontal: 25, justifyContent: 'center' },
  card: { borderRadius: 30, backgroundColor: '#FFF', paddingVertical: 10 },
  center: { alignItems: 'center' },
  instruction: { marginBottom: 15, color: '#757575' },
  imageSurface: { padding: 15, borderRadius: 25, backgroundColor: '#F3E5F5' },
  image: { width: 180, height: 180 },
  wordText: { fontSize: 42, fontWeight: 'bold', color: '#673AB7', marginTop: 15, letterSpacing: 2 },
  feedbackContainer: { marginTop: 30, height: 130, justifyContent: 'center' },
  aiBubble: { padding: 20, borderRadius: 20, backgroundColor: '#F3E5F5', width: '100%' },
  scoreLabel: { fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 5 },
  feedbackText: { fontStyle: 'italic', textAlign: 'center', fontSize: 16, color: '#444' },
  footer: { padding: 30 },
  mainBtn: { borderRadius: 30, elevation: 4 },
  btnHeight: { height: 60 }
});