/**
 * Converts a string of raw sign language tokens (e.g. "HELLO DOCTOR PAIN")
 * into multiple array of grammatically correct English sentences.
 */
export const getGrammarSuggestions = (rawSentence) => {
  if (!rawSentence) return [];
  const words = rawSentence.trim().toUpperCase().split(/\s+/).filter(w => w !== "");
  if (words.length === 0) return [];

  const formatOutput = (arr) => {
    let str = arr.join(" ").replace(/\s+/g, ' ').replace(/please please/gi, 'please').trim();
    if (!str) return "";
    str = str.charAt(0).toUpperCase() + str.slice(1);
    if (!/^[?!.]$/.test(str.slice(-1))) str += ".";
    return str;
  }

  const sentences = new Set();

  // Style 1: Direct translation
  const getDirect = () => {
    let results = [];
    const subjects = ['I', 'YOU', 'HE', 'SHE', 'WE', 'THEY', 'IT'];
    const greetings = ['HELLO', 'HI', 'YES', 'NO', 'PLEASE', 'SORRY', 'THANK', 'STOP'];
    let impliedSubjectAdded = false;
    
    if (!subjects.includes(words[0]) && !greetings.includes(words[0])) {
      results.push("I need");
      impliedSubjectAdded = true;
    }

    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        if (w === 'WATER') results.push('some water');
        else if (w === 'FOOD') results.push('some food');
        else if (w === 'DOCTOR') {
            if (i > 0 && (words[i-1] === 'HELLO' || words[i-1] === 'HI')) results.push('doctor, I need a doctor');
            else results.push('a doctor');
        }
        else if (w === 'BATHROOM') results.push(impliedSubjectAdded ? 'to use the bathroom' : 'the bathroom');
        else if (w === 'HELP') {
          if (impliedSubjectAdded) results.push('help');
          else results.push('help me');
        }
        else if (w === 'PAIN') {
          if (impliedSubjectAdded) results[0] = "I am in";
          results.push('pain');
        }
        else if (w === 'THANK') results.push('thank you');
        else if (w === 'MORE') results.push('more');
        else if (w === 'PLEASE') results.push('please');
        else results.push(w.toLowerCase());
    }
    return formatOutput(results);
  };

  // Style 2: Polite Request
  const getPolite = () => {
    let results = [];
    let startsWithGreeting = false;
    let askingForSomething = false;
    
    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        if (w === 'HELLO' || w === 'HI') {
            results.push('Hello,');
            startsWithGreeting = true;
        }
        else if (w === 'WATER') { results.push('could I please have some water?'); askingForSomething=true; }
        else if (w === 'FOOD') { results.push('could I please get something to eat?'); askingForSomething=true;}
        else if (w === 'DOCTOR') { results.push('could you please call a doctor?'); askingForSomething=true;}
        else if (w === 'BATHROOM') { results.push('could you direct me to the bathroom?'); askingForSomething=true;}
        else if (w === 'HELP') { results.push('would you mind assisting me?'); askingForSomething=true;}
        else if (w === 'PAIN') results.push('it hurts so much, could you help with the pain?');
        else if (w === 'THANK') results.push('thank you very much.');
        else if (w === 'PLEASE') { /* skip, already polite */ }
        else results.push(w.toLowerCase());
    }
    
    // Add polite prefix if there weren't direct noun asks
    if (!askingForSomething && !startsWithGreeting) {
       results.unshift("Excuse me, could you provide");
    }
    return formatOutput(results).replace(/\?\./g, '?');
  };

  // Style 3: Contextual specific combination 
  // (e.g. "hello doctor im in pain")
  const getContextual = () => {
    let res = [];
    let hasGreeting = false;
    let hasDoctor = false;

    for (let i = 0; i < words.length; i++) {
        const w = words[i];
        if (w === 'HELLO' || w === 'HI') { res.push('Hello'); hasGreeting = true; }
        else if (w === 'DOCTOR') { 
          if(hasGreeting) res.push('doctor,'); 
          else res.push('Doctor,'); 
          hasDoctor = true; 
        }
        else if (w === 'PAIN') res.push("I'm in pain.");
        else if (w === 'WATER') res.push("I need water.");
        else if (w === 'HELP') res.push("please help.");
        else if (w === 'FOOD') res.push("I am hungry.");
        else if (w === 'THANK') res.push("Thanks.");
        else res.push(w.toLowerCase());
    }
    return formatOutput(res);
  };

  let c = getContextual();
  if (c) sentences.add(c);

  let d = getDirect();
  if (d && d !== c) sentences.add(d);
  
  let p = getPolite();
  if (p && p !== c && p !== d) sentences.add(p);
  
  // Return arrays of strings
  return Array.from(sentences).slice(0, 4);
};
