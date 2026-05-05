from django.db import models

class SpeechAttempt(models.Model):
    word = models.CharField(max_length=100)
    score = models.FloatField()
    is_correct = models.BooleanField()
    feedback = models.TextField()
    recognized_text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.word} - {self.score}%"