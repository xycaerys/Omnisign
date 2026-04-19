import React, { useState } from 'react';
import { Send, Activity, Brain } from 'lucide-react';

const ChatInterface = ({ transcription, intent, isSmoothed, sentence, rawSigns, suggestions, onSuggestionClick, onClear, onSpeak, onSendText }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendText(inputText);
    setInputText('');
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Transcription Feedback */}
      <div className="glass-panel" style={{ flex: 1, minWidth: '300px' }}>
        <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity className="panel-title-icon" size={20} />
            Current Transcription
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onClear} className="button" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Clear</button>
            <button onClick={onSpeak} className="button primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Speak</button>
          </div>
        </div>
        
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
          {transcription || sentence ? (
            <>
              {transcription && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Character/Word:</span>
                   <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isSmoothed ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                     {transcription}
                   </span>
                </div>
              )}

              {rawSigns && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Raw Signs:</span>
                   <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                     {rawSigns}
                   </span>
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Sentence:</span>
                 <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                   {sentence}
                 </span>
              </div>

              {suggestions && suggestions.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1rem', color: '#ef4444', fontWeight: 'bold' }}>Suggestions :</span>
                  {suggestions.map((s, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => onSuggestionClick(s)}
                      style={{ 
                        background: sentence === s ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255,255,255,0.1)',
                        border: sentence === s ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)',
                        color: 'var(--text-primary)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {intent && <span className="badge">Intent: {intent}</span>}
                {!isSmoothed && transcription && <span className="badge" style={{ color: '#fbbf24', borderColor: 'rgba(251,191,36,0.5)' }}>Stabilizing...</span>}
                {isSmoothed && transcription && <span className="badge success">Stable</span>}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              Waiting for signs...
            </div>
          )}
        </div>
      </div>

      {/* Text Output / Chat */}
      <div className="glass-panel" style={{ flex: 1, minWidth: '300px' }}>
        <div className="panel-title">
          <Brain className="panel-title-icon" size={20} />
          Caregiver Input
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Type a message to the Avatar (e.g. 'I need help?')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="button primary">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
