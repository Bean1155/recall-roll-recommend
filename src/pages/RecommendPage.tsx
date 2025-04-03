
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CatalogCard from "@/components/CatalogCard";
import RecommendForm from "@/components/RecommendForm";
import { CatalogCard as CatalogCardType, AgreementStatus } from "@/lib/types";
import { getCardById, addUserNotesToCard } from "@/lib/data";
import GridLayout from "@/components/GridLayout";
import { Badge } from "@/components/ui/badge";
import ShareOptions from "@/components/ShareOptions";
import UserSelect from "@/components/UserSelect";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

const RecommendPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CatalogCardType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sharingMode, setSharingMode] = useState<'external' | 'internal'>('external');
  const [userNotes, setUserNotes] = useState("");
  const [userRating, setUserRating] = useState<number>(0);
  const [userTags, setUserTags] = useState<string>("");
  const [userUrl, setUserUrl] = useState<string>("");
  const [agreementStatus, setAgreementStatus] = useState<AgreementStatus>(null);
  const [addNotesToOriginal, setAddNotesToOriginal] = useState(false);
  const [activeTab, setActiveTab] = useState("share");
  const { sharingSettings, currentUser } = useUser();
  
  useEffect(() => {
    if (id) {
      const foundCard = getCardById(id);
      if (foundCard) {
        setCard(foundCard);
        
        // If user is part of recommendedTo, auto-select them for feedback
        if (foundCard.recommendedTo?.includes(currentUser.id)) {
          setSelectedUserId(currentUser.id);
          setSharingMode('internal');
          
          // Pre-fill with existing data if available
          const userNote = foundCard.userNotes?.find(note => note.userId === currentUser.id);
          if (userNote) {
            setUserNotes(userNote.notes || "");
            setUserRating(userNote.userRating || 0);
            setAgreementStatus(userNote.agreementStatus || null);
            setUserTags(userNote.tags?.join(", ") || "");
            setUserUrl(userNote.url || "");
          }
        }
      } else {
        navigate('/');
      }
    }
  }, [id, navigate, currentUser]);
  
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setSharingMode('internal');
    toast({
      title: "User Selected",
      description: "You can now share this recommendation with the selected user.",
    });
  };
  
  const handleToggleMode = () => {
    setSharingMode(sharingMode === 'external' ? 'internal' : 'external');
    if (sharingMode === 'internal') {
      setSelectedUserId(null);
    }
  };
  
  const handleAddUserFeedback = () => {
    if (!card || !selectedUserId) {
      toast({
        title: "Cannot Add Feedback",
        description: "Please select a user first",
        variant: "destructive"
      });
      return;
    }
    
    // Convert tags from comma-separated string to array
    const tagsArray = userTags
      ? userTags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)
      : undefined;
    
    const success = addUserNotesToCard(
      card.id, 
      selectedUserId,
      {
        notes: userNotes.trim(),
        userRating,
        agreementStatus,
        tags: tagsArray,
        url: userUrl.trim() || undefined,
        addNotesToOriginal
      }
    );
    
    if (success) {
      toast({
        title: "Feedback Added",
        description: sharingSettings.autoReceiveNotes 
          ? "Your feedback was automatically added to the original card based on recipient's settings" 
          : "Your feedback has been added",
      });
      
      // Refresh the card data
      const updatedCard = getCardById(card.id);
      if (updatedCard) {
        setCard(updatedCard);
      }
    } else {
      toast({
        title: "Cannot Update Card",
        description: "The original card creator does not allow updates",
        variant: "destructive"
      });
    }
  };
  
  if (!card) {
    return <div>Loading...</div>;
  }
  
  return (
    <GridLayout title={`Share This ${card.type === 'food' ? 'Food' : 'Entertainment'}`}>
      <div className="max-w-md mx-auto mb-8">
        <CatalogCard card={card} showActions={false} />
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="feedback">Add Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="share" className="space-y-4">
            <div className="flex gap-2 justify-center">
              <ShareOptions 
                card={card} 
                mode={sharingMode}
                variant="dialog"
                buttonClassName="w-full justify-center bg-catalog-teal hover:bg-catalog-darkTeal text-white"
              />
            </div>
            
            <div className="flex justify-center">
              <Badge 
                className="cursor-pointer hover:opacity-80"
                onClick={handleToggleMode}
              >
                Switch to {sharingMode === 'external' ? 'App User' : 'External'} Sharing
              </Badge>
            </div>
            
            {sharingMode === 'internal' && (
              <UserSelect 
                cardId={card.id} 
                onUserSelect={handleUserSelect} 
                selectedUserId={selectedUserId} 
              />
            )}
            
            {card.recommendationBadge && (
              <div className="flex justify-center mt-4">
                <Badge 
                  className={card.recommendationBadge === 'Highly Recommend' 
                    ? 'bg-catalog-teal' 
                    : 'bg-catalog-pink text-black'
                  }
                >
                  {card.recommendationBadge}
                </Badge>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="feedback" className="space-y-4">
            {selectedUserId ? (
              <Card>
                <CardHeader>
                  <CardTitle>Add Your Feedback</CardTitle>
                  <CardDescription>
                    Share your thoughts about this recommendation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-rating">Your Rating (0-5)</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        id="user-rating"
                        max={5}
                        step={1}
                        value={[userRating]}
                        onValueChange={(value) => setUserRating(value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center font-medium">
                        {userRating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Do you agree with this recommendation?</Label>
                    <div className="flex space-x-4">
                      <Button 
                        type="button" 
                        variant={agreementStatus === 'Agree' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setAgreementStatus('Agree')}
                      >
                        <ThumbsUp size={16} />
                        Agree
                      </Button>
                      <Button 
                        type="button"
                        variant={agreementStatus === 'Neutral' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setAgreementStatus('Neutral')}
                      >
                        <Minus size={16} />
                        Neutral
                      </Button>
                      <Button 
                        type="button"
                        variant={agreementStatus === 'Disagree' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setAgreementStatus('Disagree')}
                      >
                        <ThumbsDown size={16} />
                        Disagree
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-notes">Your Notes</Label>
                    <Textarea 
                      id="user-notes"
                      placeholder="Add your thoughts..."
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-tags">Tags (comma separated)</Label>
                    <Input
                      id="user-tags"
                      placeholder="tasty, spicy, must-try"
                      value={userTags}
                      onChange={(e) => setUserTags(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-url">Website or Link</Label>
                    <Input
                      id="user-url"
                      placeholder="https://example.com"
                      type="url"
                      value={userUrl}
                      onChange={(e) => setUserUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="add-to-original" 
                      checked={addNotesToOriginal}
                      onCheckedChange={(checked) => setAddNotesToOriginal(checked as boolean)}
                    />
                    <Label 
                      htmlFor="add-to-original" 
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Add my feedback to the original card
                    </Label>
                  </div>
                  
                  {sharingSettings.autoReceiveNotes && (
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-sm text-blue-800">
                      Note: Recipients have enabled auto-note reception, so your feedback will be 
                      automatically added to their card.
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAddUserFeedback}
                    className="w-full bg-catalog-softBrown hover:bg-catalog-softBrown/80"
                  >
                    Submit Feedback
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">
                  Please select a user from the Share tab to provide feedback.
                </p>
                <Button
                  onClick={() => setActiveTab("share")}
                  variant="outline"
                >
                  Go to Share Tab
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <RecommendForm card={card} />
    </GridLayout>
  );
};

export default RecommendPage;
