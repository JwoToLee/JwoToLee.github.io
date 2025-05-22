
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, SendIcon, MessageSquare } from "lucide-react";
import { AuditChecklistItem } from "@/utils/auditMatrix";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AuditChecklistAIHelperProps {
  auditRef: string;
  auditType: string;
  checklist: AuditChecklistItem[];
  findings: Record<string, any>;
  onClose: () => void;
}

const AuditChecklistAIHelper = ({ auditRef, auditType, checklist, findings, onClose }: AuditChecklistAIHelperProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message when component mounts
  useEffect(() => {
    const initialAssessment = generateInitialAssessment();
    setMessages([{ role: "assistant", content: initialAssessment }]);
  }, [auditRef, auditType, checklist, findings]);

  const generateInitialAssessment = () => {
    const completedCount = Object.keys(findings).length;
    const totalCount = checklist.length;
    const progress = Math.round((completedCount / totalCount) * 100);
    
    let message = `Hello! I'm your ${auditType} audit assistant for **${auditRef}**.`;
    message += `\n\nYou've completed ${completedCount} of ${totalCount} checklist items (${progress}%).`;
    
    if (completedCount > 0) {
      const findingsCount = Object.values(findings).filter(f => f.hasFinding).length;
      if (findingsCount > 0) {
        message += `\n\nYou've identified ${findingsCount} findings so far. Remember to document each finding clearly with the relevant details.`;
      } else {
        message += `\n\nYou haven't identified any findings yet. Remember that the purpose of an audit is to identify both compliance and non-compliance.`;
      }
    }
    
    message += `\n\nHow can I assist you with your audit checklist today?`;
    
    return message;
  };
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message to the conversation
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and show loading state
    setInput("");
    setIsLoading(true);
    
    try {
      // Generate AI response
      const response = await generateChecklistResponse(input);
      
      // Add AI response to the conversation
      const aiMessage: Message = { role: "assistant", content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock AI response generation
  const generateChecklistResponse = async (query: string): Promise<string> => {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowercaseQuery = query.toLowerCase();
    
    // Define responses based on keywords
    if (lowercaseQuery.includes("finding") || lowercaseQuery.includes("non-compliant")) {
      return "When documenting findings, be specific and objective. Include:\n\n1. The specific requirement that wasn't met\n2. The evidence you observed\n3. The scope/extent of the issue\n4. Potential impacts\n5. Whether it's systemic or isolated\n\nFor staff-related findings, include their name, ID, and scope of work.";
    }
    
    if (lowercaseQuery.includes("observation") || lowercaseQuery.includes("comment")) {
      return "Observations are different from findings. They're opportunities for improvement that don't necessarily violate requirements. Document observations when:\n\n1. You see a potential future issue\n2. A process works but could be more efficient\n3. You notice good practices worth highlighting\n4. There are minor issues that don't constitute non-compliance";
    }
    
    if (lowercaseQuery.includes("evidence") || lowercaseQuery.includes("verify")) {
      return "Effective evidence collection includes:\n\n1. Direct observation of activities\n2. Interviews with personnel\n3. Document reviews\n4. Sampling (for larger populations)\n5. Photographs (where permitted)\n\nAlways maintain a clear chain of evidence and note exactly what was observed.";
    }
    
    if (lowercaseQuery.includes("checklist") || lowercaseQuery.includes("complete")) {
      const completedCount = Object.keys(findings).length;
      const totalCount = checklist.length;
      const remaining = totalCount - completedCount;
      
      return `You've completed ${completedCount} of ${totalCount} checklist items, with ${remaining} items remaining. For each item, determine whether it's:\n\n1. Compliant (with or without observations)\n2. Non-compliant (requiring a finding)\n3. Not applicable (with justification)\n\nTry to complete all checklist items for a comprehensive audit.`;
    }
    
    if (lowercaseQuery.includes("staff") || lowercaseQuery.includes("personnel")) {
      return "When documenting staff-related findings:\n\n1. Include the staff name, ID/number, and scope/role\n2. Be objective about the observed issue\n3. Focus on the process/system failure, not personal blame\n4. Note any training or supervision factors\n5. Consider if it's an individual issue or a wider systemic problem";
    }
    
    if (lowercaseQuery.includes("regulation") || lowercaseQuery.includes("requirement") || lowercaseQuery.includes("standard")) {
      return "When citing regulatory requirements:\n\n1. Reference the specific clause or paragraph number\n2. Quote the exact requirement text when possible\n3. Explain how the observation relates to the requirement\n4. Consider both the letter and intent of the requirement\n5. Note if multiple regulations are affected";
    }
    
    // Default response
    return "I'm here to help with your audit checklist. You can ask me about documenting findings, collecting evidence, completing the checklist items, handling staff-related issues, regulatory requirements, or any other aspect of the audit process.";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-blue-600 text-white p-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="font-medium">Audit Checklist Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-blue-700">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 ${message.role === "assistant" ? "pr-6" : "pl-6"}`}
          >
            <div 
              className={`p-3 rounded-lg ${
                message.role === "assistant" 
                ? "bg-white border border-gray-200" 
                : "bg-blue-500 text-white ml-auto"
              }`}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-pulse">•</div>
            <div className="animate-pulse delay-150">•</div>
            <div className="animate-pulse delay-300">•</div>
            <span className="ml-2">Thinking...</span>
          </div>
        )}
      </div>
      
      <div className="border-t p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about audit checklist..."
            className="resize-none min-h-[60px]"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditChecklistAIHelper;
