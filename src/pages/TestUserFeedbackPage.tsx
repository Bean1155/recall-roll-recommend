
import { useState, useEffect } from "react";
import { getCardById } from "@/lib/data";
import CatalogCard from "@/components/CatalogCard";
import { FoodCard } from "@/lib/types";
import GridLayout from "@/components/GridLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const TestUserFeedbackPage = () => {
  const [card, setCard] = useState<FoodCard | null>(null);
  const { setCurrentUser, currentUser } = useUser();
  
  useEffect(() => {
    // Load the sample card with user feedback
    const sampleCard = getCardById('1') as FoodCard;
    if (sampleCard) {
      setCard(sampleCard);
    }
  }, []);

  const switchToUser = (userId: string) => {
    const userNames: Record<string, string> = {
      'user1': 'Alex',
      'user2': 'Sarah',
      'user3': 'Mike'
    };
    
    setCurrentUser({
      id: userId,
      name: userNames[userId] || 'Test User'
    });
  };

  if (!card) {
    return <div>Loading sample card...</div>;
  }

  return (
    <GridLayout title="Test User Feedback Feature">
      <Card className="mb-8 border-catalog-softBrown">
        <CardHeader className="bg-catalog-cream rounded-t-lg">
          <CardTitle className="text-catalog-teal">Testing User Feedback</CardTitle>
          <CardDescription>
            You're currently logged in as: <strong>{currentUser.name}</strong> (ID: {currentUser.id})
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="mb-4">
            This page allows you to test the new user feedback functionality. You can:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>View how a card looks with existing user feedback</li>
            <li>Switch between different users to see how the interface adapts</li>
            <li>See the recommendation process by clicking "Go to Recommend Page"</li>
            <li>Test adding your own feedback through the recommendation process</li>
          </ul>
          
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={() => switchToUser('user1')} 
              variant={currentUser.id === 'user1' ? 'default' : 'outline'}
              className="bg-catalog-teal hover:bg-catalog-darkTeal"
            >
              Switch to Alex (Creator)
            </Button>
            <Button 
              onClick={() => switchToUser('user2')} 
              variant={currentUser.id === 'user2' ? 'default' : 'outline'}
              className="bg-catalog-teal hover:bg-catalog-darkTeal"
            >
              Switch to Sarah (Recipient)
            </Button>
            <Button 
              onClick={() => switchToUser('user3')} 
              variant={currentUser.id === 'user3' ? 'default' : 'outline'}
              className="bg-catalog-teal hover:bg-catalog-darkTeal"
            >
              Switch to Mike (Recipient)
            </Button>
          </div>
          
          <div className="flex justify-center">
            <Button asChild className="bg-catalog-softBrown hover:bg-catalog-softBrown/80">
              <Link to={`/recommend/${card.id}`}>
                Go to Recommend Page
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="card">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="card" className="w-1/2">Card View</TabsTrigger>
          <TabsTrigger value="explanation" className="w-1/2">Feature Explanation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-catalog-softBrown">
            <h2 className="text-xl font-semibold mb-4 text-catalog-teal">Sample Card with User Feedback</h2>
            <div className="bg-catalog-cream p-4 rounded-lg">
              <CatalogCard card={card} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="explanation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How User Feedback Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                When a card is recommended to another user, that user can now provide feedback on it:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>The card creator can recommend a card to other app users</li>
                <li>Recipients can add their own notes, ratings, tags, and URLs</li>
                <li>Recipients can express agreement or disagreement with the recommendation</li>
                <li>All feedback appears in a collapsible section on the card</li>
                <li>Recipients can choose to add their feedback directly to the original card</li>
              </ol>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold text-blue-800 mb-2">Testing Steps:</h3>
                <ol className="list-decimal pl-6 text-blue-700 space-y-1">
                  <li>Switch to Alex (creator of the "Amazing Pasta" card)</li>
                  <li>Go to the Recommend Page</li>
                  <li>Select a user to recommend to</li>
                  <li>Switch to that user</li>
                  <li>Go back to Recommend Page and add your feedback</li>
                  <li>Switch back to Alex to see how feedback appears on the original card</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </GridLayout>
  );
};

export default TestUserFeedbackPage;
