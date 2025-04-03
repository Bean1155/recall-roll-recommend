
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface RewardsInfoCardProps {
  title: string;
  icon: LucideIcon;
  backgroundColor: string;
  children: ReactNode;
}

const RewardsInfoCard = ({
  title,
  icon: Icon,
  backgroundColor,
  children,
}: RewardsInfoCardProps) => {
  return (
    <Card className="bg-white shadow-md overflow-hidden border-catalog-softBrown">
      <div className="py-2 px-4 bg-catalog-teal text-white font-typewriter font-bold">
        {title}
      </div>
      <CardContent className="p-4" style={{
        backgroundImage: `linear-gradient(#ACC8E5 1px, transparent 1px)`,
        backgroundSize: '100% 28px',
        backgroundRepeat: 'repeat-y',
        backgroundColor: backgroundColor
      }}>
        <div className="space-y-4 pt-2">
          <div className="flex gap-2 items-center">
            <Icon className="text-catalog-teal h-6 w-6" />
            <h3 className="font-bold">{title}</h3>
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsInfoCard;
