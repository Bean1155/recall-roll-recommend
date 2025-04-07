
import { CatalogCard } from "@/lib/types";

interface CardNotesProps {
  notes: string;
}

const CardNotes = ({ notes }: CardNotesProps) => {
  return (
    <div className="mb-4 bg-white bg-opacity-50 p-2 rounded border border-catalog-softBrown">
      <p className="text-sm italic whitespace-pre-line">{notes}</p>
    </div>
  );
};

export default CardNotes;
