
import { useState } from "react";
import { UserNote } from "@/lib/types";
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, Star } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

interface UserFeedbackProps {
  userNotes?: UserNote[];
}

const UserFeedback = ({ userNotes }: UserFeedbackProps) => {
  const [isUserFeedbackOpen, setIsUserFeedbackOpen] = useState(false);
  
  if (!userNotes || userNotes.length === 0) return null;
  
  const getAgreementStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'Agree':
        return <ThumbsUp size={14} className="text-green-600" />;
      case 'Disagree':
        return <ThumbsDown size={14} className="text-red-600" />;
      case 'Neutral':
        return <Minus size={14} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <Collapsible 
      open={isUserFeedbackOpen} 
      onOpenChange={setIsUserFeedbackOpen}
      className="mb-4"
    >
      <CollapsibleTrigger className="flex items-center gap-1 w-full p-2 bg-blue-50 rounded-t border border-blue-200 text-left">
        <MessageSquare size={14} className="text-blue-600" />
        <h4 className="text-sm font-medium text-blue-800">
          User Feedback ({userNotes.length})
        </h4>
        <span className="ml-auto text-xs text-blue-600">
          {isUserFeedbackOpen ? "Hide" : "Show"}
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-2 bg-blue-50 rounded-b border-x border-b border-blue-200">
        <div className="space-y-2">
          {userNotes.map((note: UserNote, index: number) => (
            <div key={index} className="p-2 bg-white rounded text-xs">
              <div className="font-medium text-blue-700 flex items-center justify-between">
                <span>{note.userName || note.userId}</span>
                {note.agreementStatus && (
                  <div className="flex items-center gap-1">
                    {getAgreementStatusIcon(note.agreementStatus)}
                    <span className="text-[10px]">{note.agreementStatus}</span>
                  </div>
                )}
              </div>
              
              {note.userRating !== undefined && note.userRating > 0 && (
                <div className="flex mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < note.userRating! ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} 
                    />
                  ))}
                </div>
              )}
              
              {note.notes && <p className="whitespace-pre-line mt-1">{note.notes}</p>}
              
              {note.tags && note.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {note.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {note.url && (
                <div className="mt-1">
                  <a 
                    href={note.url.startsWith('http') ? note.url : `https://${note.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-600 hover:underline break-all"
                  >
                    {note.url}
                  </a>
                </div>
              )}
              
              <div className="text-gray-500 text-[10px] mt-1">
                {new Date(note.date).toLocaleString()}
                {note.updatedDate && (
                  <span> (Updated: {new Date(note.updatedDate).toLocaleString()})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UserFeedback;
