import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CatalogCard } from "@/lib/types";
import { 
  Share2, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy, 
  Check,
  UserPlus
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/contexts/UserContext";
import { addUserRewardPoints } from "@/lib/data";

interface ShareOptionsProps {
  card: CatalogCard;
  mode?: 'internal' | 'external';
  variant?: 'dropdown' | 'dialog' | 'popover';
  buttonClassName?: string;
}

const ShareOptions = ({ 
  card, 
  mode = 'external', 
  variant = 'dropdown', 
  buttonClassName 
}: ShareOptionsProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { users, currentUser } = useUser();
  
  const generateShareText = () => {
    const title = card.title;
    const creator = card.creator;
    const rating = "★".repeat(card.rating) + "☆".repeat(5 - card.rating);
    
    let shareText = `Check out ${title} by ${creator} (${rating})!`;
    
    if (card.type === 'food') {
      const foodCard = card as any;
      shareText += ` ${foodCard.cuisine} cuisine at ${foodCard.location}.`;
    } else {
      const entertainmentCard = card as any;
      shareText += ` ${entertainmentCard.genre} ${entertainmentCard.entertainmentCategory} on ${entertainmentCard.medium}.`;
    }
    
    if (mode === 'internal' && card.notes) {
      shareText += `\n\nNotes: ${card.notes}`;
    }
    
    if (card.recommendationBadge) {
      shareText += `\n\n${card.recommendationBadge}!`;
    }
    
    if (mode === 'external') {
      shareText += '\n\nDownload our app to see full details and more recommendations!';
    }
    
    return shareText;
  };
  
  const handleShareEmail = () => {
    const subject = `Check out: ${card.title}`;
    const body = encodeURIComponent(generateShareText());
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${body}`);
    toast({
      title: "Email App Opened",
      description: "Share this recommendation via email",
    });
  };
  
  const handleShareMessage = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`sms:?body=${text}`);
    toast({
      title: "Message App Opened",
      description: "Share this recommendation via text message",
    });
  };
  
  const handleShareSocial = (platform: string) => {
    const text = encodeURIComponent(generateShareText());
    const url = encodeURIComponent(window.location.href);
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      toast({
        title: `Sharing to ${platform}`,
        description: `Opening ${platform} sharing dialog`,
      });
    }
  };
  
  const copyToClipboard = async () => {
    const text = generateShareText();
    
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      
      toast({
        title: "Copied to clipboard",
        description: "You can now paste and share this recommendation",
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };
  
  const handleShareWithUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      if (currentUser) {
        addUserRewardPoints(currentUser.id);
      }
      
      addUserRewardPoints(userId);
      
      toast({
        title: `Shared with ${user.name}`,
        description: `${card.title} has been recommended to ${user.name}. You earned a reward point!`,
      });
    }
  };
  
  const ShareButton = () => (
    <Button 
      variant="outline"
      className={buttonClassName || "bg-white border-catalog-softBrown text-catalog-teal"}
    >
      <Share2 size={16} className="mr-2" />
      Share Recommendation
    </Button>
  );
  
  const ExternalShareContent = () => (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-3 h-auto" 
          onClick={handleShareEmail}
        >
          <Mail className="h-5 w-5 mb-1" />
          <span className="text-xs">Email</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-3 h-auto" 
          onClick={handleShareMessage}
        >
          <MessageSquare className="h-5 w-5 mb-1" />
          <span className="text-xs">Message</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-3 h-auto" 
          onClick={() => handleShareSocial('facebook')}
        >
          <Facebook className="h-5 w-5 mb-1" />
          <span className="text-xs">Facebook</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-3 h-auto" 
          onClick={() => handleShareSocial('twitter')}
        >
          <Twitter className="h-5 w-5 mb-1" />
          <span className="text-xs">Twitter</span>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-3 h-auto" 
          onClick={() => handleShareSocial('linkedin')}
        >
          <Linkedin className="h-5 w-5 mb-1" />
          <span className="text-xs">LinkedIn</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-3 h-auto" 
          onClick={copyToClipboard}
        >
          {isCopied ? (
            <Check className="h-5 w-5 mb-1 text-green-500" />
          ) : (
            <Copy className="h-5 w-5 mb-1" />
          )}
          <span className="text-xs">{isCopied ? 'Copied!' : 'Copy'}</span>
        </Button>
      </div>
    </div>
  );
  
  const InternalShareContent = () => (
    <div className="flex flex-col gap-2 w-full">
      {users.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {users.map(user => (
            <Button 
              key={user.id}
              variant="outline" 
              className="flex items-center justify-start py-2 h-auto" 
              onClick={() => handleShareWithUser(user.id)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span>{user.name}</span>
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-center p-2">No app users available</p>
      )}
    </div>
  );
  
  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            className={buttonClassName || "bg-white border-catalog-softBrown text-catalog-teal"}
          >
            <Share2 size={16} className="mr-2" />
            Share Recommendation
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2">
          {mode === 'external' ? (
            <>
              <DropdownMenuItem onClick={handleShareEmail} className="cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                <span>Email</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShareMessage} className="cursor-pointer">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Message</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShareSocial('facebook')} className="cursor-pointer">
                <Facebook className="mr-2 h-4 w-4" />
                <span>Facebook</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShareSocial('twitter')} className="cursor-pointer">
                <Twitter className="mr-2 h-4 w-4" />
                <span>Twitter</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShareSocial('linkedin')} className="cursor-pointer">
                <Linkedin className="mr-2 h-4 w-4" />
                <span>LinkedIn</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
                {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                <span>{isCopied ? 'Copied!' : 'Copy to clipboard'}</span>
              </DropdownMenuItem>
            </>
          ) : (
            users.map(user => (
              <DropdownMenuItem 
                key={user.id} 
                onClick={() => handleShareWithUser(user.id)} 
                className="cursor-pointer"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span>{user.name}</span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  if (variant === 'dialog') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className={buttonClassName || "bg-white border-catalog-softBrown text-catalog-teal"}
          >
            <Share2 size={16} className="mr-2" />
            Share Recommendation
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share {card.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {mode === 'external' ? <ExternalShareContent /> : <InternalShareContent />}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (variant === 'popover') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline"
            className={buttonClassName || "bg-white border-catalog-softBrown text-catalog-teal"}
          >
            <Share2 size={16} className="mr-2" />
            Share Recommendation
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <h3 className="font-medium mb-2">Share {card.title}</h3>
          {mode === 'external' ? <ExternalShareContent /> : <InternalShareContent />}
        </PopoverContent>
      </Popover>
    );
  }
  
  return null;
};

export default ShareOptions;
