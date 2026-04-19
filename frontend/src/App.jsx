import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Bot, Video } from 'lucide-react';
import WebcamCapture from './components/WebcamCapture';
import Avatar from './components/Avatar';
import ChatInterface from './components/ChatInterface';
import { getGrammarSuggestions } from './utils/grammar';

function App() {
  const [transcription, setTranscription] = useState('');
  const [intent, setIntent] = useState('');
  const [isSmoothed, setIsSmoothed] = useState(false);
  const [sentence, setSentence] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  
  const [avatarData, setAvatarData] = useState(null);
  
  const lastSmoothedWordRef = useRef('');

  // Automatically parse raw sign phrases into an array of English permutations
  const localGrammarSuggestions = useMemo(() => getGrammarSuggestions(sentence), [sentence]);
  const [pythonGrammar, setPythonGrammar] = useState("");

  useEffect(() => {
    if (!sentence) {
      setPythonGrammar("");
      return;
    }
    const words = sentence.trim().toUpperCase().split(/\s+/).filter(w => w !== "");
    if (words.length > 0) {
      fetch('http://127.0.0.1:8000/format-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words })
      })
      .then(res => res.json())
      .then(data => {
        if (data.sentence) setPythonGrammar(data.sentence);
      })
      .catch(err => console.error("Intent engine err:", err));
    }
  }, [sentence]);

  const grammarSuggestions = useMemo(() => {
    const all = new Set();
    if (pythonGrammar) all.add(pythonGrammar);
    localGrammarSuggestions.forEach(s => all.add(s));
    return Array.from(all).slice(0, 4);
  }, [pythonGrammar, localGrammarSuggestions]);

  const activeGrammarSentence = selectedSuggestion || (grammarSuggestions.length > 0 ? grammarSuggestions[0] : '');

  // Reset selected suggestion when base sentence changes
  useEffect(() => {
    setSelectedSuggestion(null);
  }, [sentence]);

  const handleSignDetected = (data) => {
    setTranscription(data.word);
    setIntent(data.intent);
    setIsSmoothed(data.smoothed);

    // Build sentence when a sign stabilizes
    if (data.smoothed && data.word !== "UNKNOWN" && data.word !== lastSmoothedWordRef.current) {
      let separator = " ";
      if (data.word.length === 1 && lastSmoothedWordRef.current.length === 1) {
        separator = ""; // Combine single characters (fingerspelling)
      }
      setSentence(prev => prev ? prev + separator + data.word : data.word);
      lastSmoothedWordRef.current = data.word; // Don't repeat the exact same word endlessly
    }
  };

  const handleClearSentence = () => {
    setSentence('');
    setSelectedSuggestion(null);
    lastSmoothedWordRef.current = '';
  };

  const handleSpeak = () => {
    if (activeGrammarSentence) {
      const utterance = new SpeechSynthesisUtterance(activeGrammarSentence);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTextSent = async (text) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/text-to-sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setAvatarData(data);
    } catch (error) {
      console.error("Text to sign failed:", error);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>OmniSign Lite</h1>
        <p>AI-Powered Bidirectional Sign Language Assistant</p>
      </header>

      <main className="main-grid">
        {/* User Input Section */}
        <section className="glass-panel">
          <div className="panel-title">
            <Video className="panel-title-icon" size={24} />
            User Sign Recognition
          </div>
          <WebcamCapture onSignDetected={handleSignDetected} />
        </section>

        {/* AI Output Section */}
        <section className="glass-panel">
          <div className="panel-title">
            <Bot className="panel-title-icon" size={24} />
            Agent Virtual Avatar
          </div>
          <Avatar avatarData={avatarData} />
        </section>
      </main>

      <ChatInterface 
        transcription={transcription}
        intent={intent}
        isSmoothed={isSmoothed}
        sentence={activeGrammarSentence}
        rawSigns={sentence}
        suggestions={grammarSuggestions}
        onSuggestionClick={setSelectedSuggestion}
        onClear={handleClearSentence}
        onSpeak={handleSpeak}
        onSendText={handleTextSent}
      />
    </div>
  );
}

export default App;
