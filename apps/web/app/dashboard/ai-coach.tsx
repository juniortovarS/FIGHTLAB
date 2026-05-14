"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Bot, User, Sparkles, MessageSquare } from "lucide-react";

/* -----------------------------
   SPEECH RECOGNITION HOOK
------------------------------ */
const useSpeechRecognition = (
  onResult: (text: string) => void,
  onInterim: (text: string) => void
) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "es-ES";
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (interimTranscript) onInterim(interimTranscript);

      if (finalTranscript && finalTranscript !== lastTranscriptRef.current) {
        lastTranscriptRef.current = finalTranscript;
        onResult(finalTranscript);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [onResult, onInterim]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  return { isListening, startListening, stopListening, supported };
};

/* -----------------------------
        AI COACH (SaaS Redesign)
------------------------------ */
export default function AICoach() {
  const [mounted, setMounted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimSpeech, isLoading]);

  // TTS Logic
  useEffect(() => {
    if (!voiceEnabled || !mounted || typeof window === "undefined" || messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (!isLoading && lastMessage?.role === "assistant" && lastMessage?.text) {
      if (lastMessage.spoken) return;
      lastMessage.spoken = true;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lastMessage.text);
      utterance.lang = "es-ES";
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, [messages, isLoading, voiceEnabled, mounted]);

  const sendCustomMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const newUserMsg = { id: Date.now().toString(), role: "user", text };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsLoading(true);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error");
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: data.text }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", text: "⚠️ Lo siento, tuve un problema al procesar tu solicitud." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const { isListening, startListening, stopListening, supported } = useSpeechRecognition(
    (transcript) => { setInterimSpeech(""); sendCustomMessage(transcript); },
    (transcript) => { setInterimSpeech(transcript); }
  );

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[500px] w-full max-w-3xl mx-auto rounded-3xl overflow-hidden glass border-white/5 relative z-10">
      
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/20">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">FightLab AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">Sistema Activo</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => { setVoiceEnabled(!voiceEnabled); window.speechSynthesis.cancel(); }}
          className={`p-2 rounded-lg transition-all ${voiceEnabled ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30" : "bg-white/5 text-gray-500 border border-transparent"}`}
        >
          {voiceEnabled ? <Mic size={18} /> : <MicOff size={18} />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <MessageSquare size={48} className="mb-4 text-[#D4AF37]" />
            <p className="text-sm max-w-xs">Hola, soy tu asistente de FightLab. Puedo ayudarte con tus reservas, rutinas o cualquier duda sobre el gimnasio.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={m.id || i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-[#D4AF37] text-black" : "bg-white/10 text-gray-400"}`}>
                {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === "user" 
                  ? "bg-[#D4AF37] text-black rounded-tr-none font-medium" 
                  : "bg-white/5 text-gray-300 border border-white/5 rounded-tl-none"
              }`}>
                {m.text || m.content}
              </div>
            </div>
          </motion.div>
        ))}

        {isListening && interimSpeech && (
          <div className="flex justify-end">
            <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/30 p-4 rounded-2xl rounded-tr-none text-sm text-[#D4AF37] italic">
              {interimSpeech}...
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400">
              <Bot size={14} />
            </div>
            <div className="p-4 bg-white/5 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-4 bg-white/[0.01] border-t border-white/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendCustomMessage(input); }} 
          className="flex gap-2"
        >
          {supported && (
            <button
              type="button"
              onClick={() => isListening ? stopListening() : startListening()}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isListening ? "bg-rose-500 text-white animate-pulse" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              <Mic size={20} />
            </button>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Haz una pregunta o reserva una clase..."
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-[#D4AF37] hover:bg-[#B8860B] disabled:opacity-50 text-black rounded-xl flex items-center justify-center transition-all shadow-lg shadow-[#D4AF37]/20"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-gray-600 mt-3 text-center uppercase tracking-widest font-bold">FightLab Intelligence v3.1</p>
      </div>
    </div>
  );
}