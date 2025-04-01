
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import CardForm from "@/components/CardForm";
import { CardType } from "@/lib/types";

const CreateCardPage = () => {
  const { type } = useParams<{ type: string }>();
  const cardType = (type === 'food' || type === 'entertainment') ? type : 'food';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="catalog-title text-3xl mb-8 text-center">
          {cardType === 'food' ? 'Add Food Experience' : 'Add Entertainment Experience'}
        </h1>
        
        <CardForm type={cardType as CardType} />
      </main>
      
      <footer className="bg-catalog-manila border-t border-catalog-softBrown py-4 text-center text-sm text-catalog-softBrown">
        <p>© {new Date().getFullYear()} TOTAL RECALL CATALOG • Tracking Every Bite and Blockbuster™</p>
      </footer>
    </div>
  );
};

export default CreateCardPage;
