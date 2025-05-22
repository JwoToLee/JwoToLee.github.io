
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, SendIcon, MessageSquare } from "lucide-react";
import { AuditChecklistItem } from "@/utils/auditMatrix";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AuditAIHelperProps {
  auditRef: string;
  auditType: string;
  findings: Record<string, any>;
  auditData: any;
  onClose: () => void;
}

const AuditAIHelper = ({ auditRef, auditType, findings, auditData, onClose }: AuditAIHelperProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message when component mounts
  useEffect(() => {
    const initialAssessment = generateInitialAssessment();
    setMessages([{ role: "assistant", content: initialAssessment }]);
  }, [auditRef, auditType, findings, auditData]);

  const generateInitialAssessment = () => {
    const findingsCount = Object.values(findings).filter(f => f.hasFinding).length;
    const hasObjective = auditData?.objective && auditData.objective.trim() !== "";
    const hasScope = auditData?.scope && auditData.scope.trim() !== "";
    const hasAssignedUsers = auditData?.assignedUsers && auditData.assignedUsers.length > 0;
    
    let message = `Hello! I'm your audit assistant for **${auditRef}**.`;
    message += `\n\nI've analyzed your audit report and here's what I found:`;
    
    if (findingsCount > 0) {
      message += `\n- You've identified ${findingsCount} findings in your audit.`;
    } else {
      message += `\n- You haven't identified any findings in your audit.`;
    }
    
    if (!hasObjective) {
      message += `\n- Your audit is missing an objective. Consider adding one for clarity.`;
    }
    
    if (!hasScope) {
      message += `\n- Your audit is missing a scope definition. Consider adding one to clarify the boundaries.`;
    }
    
    if (!hasAssignedUsers) {
      message += `\n- No auditors have been assigned to this audit. Consider assigning relevant personnel.`;
    }
    
    message += `\n\nHow can I assist you with finalizing your audit report?`;
    
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
      // Generate AI response (mock implementation)
      const response = await generateAuditResponse(input);
      
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
  const generateAuditResponse = async (query: string): Promise<string> => {
    // Simulate a delay for the API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowercaseQuery = query.toLowerCase();
    
    // Define some common responses based on keywords in the query
    if (lowercaseQuery.includes("template") || lowercaseQuery.includes("format")) {
      return "The audit report template follows a standard format with sections including Introduction, Executive Summary, Findings, and Conclusion. The template will automatically be populated with your audit data when you export to Word.";
    }
    
    if (lowercaseQuery.includes("finding") || lowercaseQuery.includes("issue")) {
      const findingsCount = Object.values(findings).filter(f => f.hasFinding).length;
      if (findingsCount === 0) {
        return "You currently have no findings in your audit. If you need to add findings, you can go back to the checklist stage and mark items as non-compliant.";
      } else {
        return `You have ${findingsCount} findings in your audit. Each finding should include a clear description, reference to the relevant standard or requirement, and any additional context like staff involved.`;
      }
    }
    
    if (lowercaseQuery.includes("export") || lowercaseQuery.includes("download")) {
      return "You can export your audit report in Excel format for data analysis or as a Word document for a formal report. The exported report will include all findings, compliant areas, and audit metadata.";
    }
    
    if (lowercaseQuery.includes("objective") || lowercaseQuery.includes("scope")) {
      if (!auditData?.objective || !auditData?.scope) {
        return "Your audit is missing either an objective or scope definition. These are important elements of a complete audit report. Consider editing your audit preparation details to include these.";
      } else {
        return "Your audit has both an objective and scope defined. The objective explains the purpose of the audit, while the scope defines the boundaries and areas covered.";
      }
    }
    
    if (lowercaseQuery.includes("auditor") || lowercaseQuery.includes("personnel") || lowercaseQuery.includes("assign")) {
      const assignedUsers = auditData?.assignedUsers || [];
      if (assignedUsers.length === 0) {
        return "No auditors have been assigned to this audit. A complete audit report should include the names and roles of all personnel involved in the audit process.";
      } else {
        return `This audit has ${assignedUsers.length} assigned personnel, including ${assignedUsers.map((u: any) => `${u.username} (${u.role})`).join(", ")}.`;
      }
    }
    
    // Default response
    return "I'm here to help with your audit report. You can ask me about findings, report format, export options, or suggestions to improve your audit documentation.";
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
          <h3 className="font-medium">Audit AI Assistant</h3>
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
            placeholder="Ask about your audit report..."
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

export default AuditAIHelper;
