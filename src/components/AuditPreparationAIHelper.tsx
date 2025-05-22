
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, SendIcon, MessageSquare } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AuditPreparationAIHelperProps {
  auditRef: string;
  auditData: any;
  onClose: () => void;
}

const AuditPreparationAIHelper = ({ auditRef, auditData, onClose }: AuditPreparationAIHelperProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message when component mounts
  useEffect(() => {
    const initialAssessment = generateInitialAssessment();
    setMessages([{ role: "assistant", content: initialAssessment }]);
  }, [auditRef, auditData]);

  const generateInitialAssessment = () => {
    const hasObjective = auditData?.objective && auditData.objective.trim() !== "";
    const hasScope = auditData?.scope && auditData.scope.trim() !== "";
    const hasIntro = auditData?.introduction && auditData.introduction.trim() !== "";
    const hasAssignedUsers = auditData?.assignedUsers && auditData.assignedUsers.length > 0;
    
    let message = `Hello! I'm your audit assistant for **${auditRef}**.`;
    message += `\n\nI'll help you prepare for "${auditData?.name || 'your audit'}". Here's what I've analyzed:`;
    
    if (!hasObjective) {
      message += `\n- Your audit is missing an objective. An objective defines what you want to achieve with the audit.`;
    }
    
    if (!hasScope) {
      message += `\n- Your audit is missing a scope definition. The scope defines what areas, processes, and timeframes are included.`;
    }

    if (!hasIntro) {
      message += `\n- Consider adding an introduction to provide context for the audit.`;
    }
    
    if (!hasAssignedUsers) {
      message += `\n- No auditors have been assigned to this audit. Remember to assign at least one lead auditor.`;
    }
    
    message += `\n\nHow can I help you prepare for this audit?`;
    
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
      const response = await generatePreparationResponse(input);
      
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
  const generatePreparationResponse = async (query: string): Promise<string> => {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowercaseQuery = query.toLowerCase();
    
    // Define responses based on keywords
    if (lowercaseQuery.includes("objective") || lowercaseQuery.includes("purpose")) {
      return "An audit objective should clearly state what you aim to achieve. For example: \"To verify compliance with [specific regulation] in [specific area]\" or \"To assess the effectiveness of [specific process or control].\"";
    }
    
    if (lowercaseQuery.includes("scope") || lowercaseQuery.includes("boundaries")) {
      return "The audit scope defines the boundaries of your investigation. A good scope statement includes:\n\n1. The departments or areas covered\n2. The processes being audited\n3. The timeframe (e.g., current year, last quarter)\n4. Any specific regulatory requirements being assessed";
    }
    
    if (lowercaseQuery.includes("introduction") || lowercaseQuery.includes("context")) {
      return "The introduction provides context for your audit. Consider including:\n\n1. Background information about the organization or area being audited\n2. Regulatory requirements necessitating this audit\n3. Previous audit history and any recurring issues\n4. Key stakeholders and their expectations";
    }
    
    if (lowercaseQuery.includes("auditor") || lowercaseQuery.includes("assign") || lowercaseQuery.includes("team")) {
      return "Your audit team should include:\n\n1. A Lead Auditor responsible for planning and coordinating\n2. Subject matter experts for technical areas\n3. Support staff for documentation\n\nEnsure auditors are independent from the area being audited to maintain objectivity.";
    }
    
    if (lowercaseQuery.includes("template") || lowercaseQuery.includes("example")) {
      return "Audit templates typically follow this structure:\n\n1. Introduction/Background\n2. Objective and Scope\n3. Methodology\n4. Findings and Observations\n5. Conclusions\n6. Recommendations\n\nYou can export sample templates from the Report stage after completing your audit.";
    }
    
    if (lowercaseQuery.includes("plan") || lowercaseQuery.includes("schedule")) {
      return "When planning your audit, consider:\n\n1. Set realistic timeframes (preparation, fieldwork, reporting)\n2. Identify key personnel to interview\n3. List documents to review before fieldwork\n4. Plan for opening and closing meetings\n5. Schedule follow-up activities for any findings";
    }
    
    // Default response
    return "I'm here to help with your audit preparation. You can ask me about defining objectives, scope, selecting auditors, creating templates, planning the audit process, or any other aspect of audit preparation.";
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
          <h3 className="font-medium">Audit Preparation Assistant</h3>
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
            placeholder="Ask about audit preparation..."
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

export default AuditPreparationAIHelper;
