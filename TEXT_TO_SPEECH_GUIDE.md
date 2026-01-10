# Text-to-Speech Feature

This document explains how to use the text-to-speech functionality in the Advocate Pro application.

## Overview

The text-to-speech (TTS) feature allows users to listen to article content instead of reading it. This is particularly useful for:
- Accessibility for visually impaired users
- Multitasking while reviewing legal documents
- Better comprehension through audio reinforcement
- Reducing eye strain during long reading sessions

## Components

### 1. TextToSpeech Component

A reusable React component that adds text-to-speech functionality to any text content.

**Location:** `frontend/src/components/TextToSpeech.tsx`

**Usage:**
```tsx
import { TextToSpeech } from '@/components/TextToSpeech';

<TextToSpeech
  text="Your text content here"
  title="Optional title that will be read first"
  buttonSize="sm"
  showLabel={true}
  className="custom-classes"
/>
```

**Props:**
- `text` (required): The text content to be read aloud
- `title` (optional): A title that will be read before the main text
- `buttonSize` (optional): Size of the button - 'sm' | 'default' | 'lg' | 'icon'
- `showLabel` (optional): Whether to show text labels on buttons (default: true)
- `className` (optional): Additional CSS classes

**Features:**
- Play/Stop toggle button
- Pause/Resume functionality
- Visual feedback showing current state
- Automatic cleanup on unmount
- Browser compatibility checking

### 2. useTextToSpeech Hook

A custom React hook for programmatic control of text-to-speech.

**Location:** `frontend/src/hooks/useTextToSpeech.ts`

**Usage:**
```tsx
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

function MyComponent() {
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useTextToSpeech({
    rate: 1.0,    // Speed (0.1 to 10)
    pitch: 1.0,   // Pitch (0 to 2)
    volume: 1.0,  // Volume (0 to 1)
    lang: 'en-US' // Language
  });

  return (
    <button onClick={() => speak('Hello, world!')}>
      {isSpeaking ? 'Stop' : 'Speak'}
    </button>
  );
}
```

**Options:**
- `rate`: Speech speed (0.1 to 10, default: 1.0)
- `pitch`: Voice pitch (0 to 2, default: 1.0)
- `volume`: Audio volume (0 to 1, default: 1.0)
- `lang`: Language code (default: 'en-US')

**Returns:**
- `speak(text, title?)`: Function to start speaking
- `pause()`: Pause the current speech
- `resume()`: Resume paused speech
- `stop()`: Stop and cancel current speech
- `isSpeaking`: Boolean indicating if currently speaking
- `isPaused`: Boolean indicating if speech is paused
- `isSupported`: Boolean indicating browser support

## Implementation in Articles

The TTS feature is integrated into the ArticleDropdown component:

### Full Article Playback
A "Listen" button in the header reads the entire article including:
- Article number
- Title
- Simplified explanation
- Purpose and intent
- Original text

### Section-Specific Playback
Each section has its own small speaker icon for focused listening:
- Simplified Explanation only
- Purpose & Intent only
- Original Text only

## Browser Support

The text-to-speech feature uses the Web Speech API, which is supported by:
- ✅ Chrome/Edge (full support)
- ✅ Safari (full support)
- ✅ Firefox (partial support)
- ❌ Internet Explorer (not supported)

The component automatically detects browser support and hides itself if unavailable.

## Customization

### Voice Selection
To use a specific voice, modify the `speak` function in the hook:

```typescript
const voices = window.speechSynthesis.getVoices();
utterance.voice = voices.find(voice => voice.name === 'Google UK English Female') || null;
```

### Speed Control
Add speed controls to your UI:

```tsx
const [rate, setRate] = useState(1.0);
const { speak } = useTextToSpeech({ rate });

<input
  type="range"
  min="0.5"
  max="2"
  step="0.1"
  value={rate}
  onChange={(e) => setRate(parseFloat(e.target.value))}
/>
```

### Language Support
For multi-language support:

```tsx
const { speak } = useTextToSpeech({ lang: 'hi-IN' }); // Hindi
const { speak } = useTextToSpeech({ lang: 'en-GB' }); // British English
```

## Examples

### Example 1: Simple Button
```tsx
import { TextToSpeech } from '@/components/TextToSpeech';

<TextToSpeech
  text="This is a simple example of text-to-speech"
  showLabel={true}
/>
```

### Example 2: Custom Styling
```tsx
<TextToSpeech
  text="Article 21: Protection of life and personal liberty"
  title="Article 21"
  buttonSize="lg"
  className="mt-4"
  showLabel={false}
/>
```

### Example 3: Using the Hook
```tsx
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

function ArticleReader({ article }) {
  const { speak, stop, isSpeaking } = useTextToSpeech({
    rate: 0.9,
    volume: 0.8
  });

  const handleRead = () => {
    const fullText = `
      Article ${article.article_number}. 
      ${article.title}. 
      ${article.original_text}
    `;
    speak(fullText, article.title);
  };

  return (
    <button onClick={isSpeaking ? stop : handleRead}>
      {isSpeaking ? 'Stop Reading' : 'Read Article'}
    </button>
  );
}
```

### Example 4: With Pause/Resume
```tsx
const { speak, pause, resume, stop, isSpeaking, isPaused } = useTextToSpeech();

<div>
  <button onClick={() => speak('Long text content here...')}>
    Play
  </button>
  <button onClick={pause} disabled={!isSpeaking || isPaused}>
    Pause
  </button>
  <button onClick={resume} disabled={!isPaused}>
    Resume
  </button>
  <button onClick={stop} disabled={!isSpeaking}>
    Stop
  </button>
</div>
```

## Accessibility

The TTS feature enhances accessibility by:
- Providing audio alternatives to text content
- Supporting keyboard navigation
- Including ARIA labels for screen readers
- Offering visual feedback for all states

## Future Enhancements

Potential improvements for future versions:
- Voice selection dropdown
- Speed control slider
- Highlight text as it's being read
- Download audio as MP3
- Multi-language voice selection
- Reading progress indicator
- Bookmarking positions in long texts

## Troubleshooting

### Speech Not Working
1. Check browser compatibility
2. Ensure audio is not muted
3. Check browser permissions for audio playback
4. Try refreshing the page

### Voice Sounds Robotic
- Some browsers use different voice engines
- Chrome/Edge typically have the best voices
- Consider adjusting the rate and pitch settings

### Speech Cuts Off
- Some browsers have limits on utterance length
- For very long texts, consider breaking them into chunks

## Support

For issues or questions about the text-to-speech feature:
1. Check browser console for errors
2. Verify browser compatibility
3. Test with different text lengths
4. Contact the development team

---

**Last Updated:** January 9, 2026
