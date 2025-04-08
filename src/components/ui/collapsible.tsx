"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

export const CatalogCollapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> & {
    label: string;
    backgroundColor?: string;
    textColor?: string;
    categoryName?: string;
  }
>(({ className, label, backgroundColor = "#d2b48c", textColor = "#603913", categoryName, children, open, onOpenChange, ...props }, ref) => {
  const [isHovering, setIsHovering] = React.useState(false);
  
  // Use categoryName if available, otherwise fallback to label
  const displayName = categoryName || label;
  
  // Debug output to track what's happening
  console.log(`CatalogCollapsible: Rendering with label=${label}, categoryName=${categoryName}, displayName=${displayName}`);
  console.log(`CatalogCollapsible: Style properties - backgroundColor=${backgroundColor}, textColor=${textColor}`);
  
  // Simplified click handler with debugging
  const handleTriggerClick = (e: React.MouseEvent) => {
    console.log(`CatalogCollapsible: Click triggered for "${displayName}", current open state: ${open}`);
    
    e.preventDefault();
    e.stopPropagation();
    
    if (onOpenChange) {
      onOpenChange(!open);
      console.log(`CatalogCollapsible: State changed to ${!open ? 'open' : 'closed'} for "${displayName}"`);
    }
  };

  // Force render of category name with key to ensure re-rendering
  const categoryNameKey = `${displayName}-${open ? 'open' : 'closed'}-${Math.random()}`;
  
  return (
    <Collapsible 
      ref={ref}
      open={open}
      onOpenChange={onOpenChange}
      className={`catalog-drawer relative mb-2 ${className}`}
      {...props}
    >
      <div 
        className="catalog-frame relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div 
          className="catalog-label-frame border-3 mx-auto relative z-10"
          style={{ 
            width: "70%", 
            borderColor: backgroundColor,
            borderWidth: "3px",
            backgroundColor: "white",
            marginBottom: "-1px"
          }}
        >
          <div 
            className="w-full flex items-center justify-center px-4 py-3 font-typewriter font-semibold text-base sm:text-xl"
            style={{ color: textColor }}
          >
            <span 
              key={categoryNameKey}
              className="catalog-category-name block w-full text-center font-bold text-lg"
              data-testid="category-name"
              style={{ 
                color: textColor,
                opacity: 1,
                fontWeight: 600,
                textShadow: "0 0 1px rgba(0,0,0,0.2)"
              }}
            >
              {displayName}
            </span>
          </div>
        </div>
        
        <div 
          onClick={handleTriggerClick}
          className="catalog-drawer-front relative border-3 rounded-md transition-all duration-300 ease-in-out cursor-pointer"
          style={{ 
            backgroundColor, 
            borderColor: backgroundColor,
            borderWidth: "3px",
            transform: open ? "translateY(15px)" : isHovering ? "translateY(8px)" : "translateY(0)",
            boxShadow: open ? "0 5px 15px rgba(0,0,0,0.15)" : isHovering ? "0 3px 8px rgba(0,0,0,0.1)" : "none",
          }}
        >
          <div 
            className="catalog-handle mx-auto mt-1 mb-3 flex items-center justify-center"
            style={{
              width: "40%",
              height: "12px",
              backgroundColor: textColor,
              borderRadius: "6px",
              opacity: 0.6
            }}
          >
            <div 
              className="catalog-handle-hole"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "black",
                borderRadius: "50%",
                opacity: 0.5
              }}
            />
          </div>
        </div>
      </div>
      
      <CollapsibleContent 
        className="rounded-b-md bg-white overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
        style={{ 
          marginTop: open ? "8px" : "0", 
          border: open ? `3px solid ${backgroundColor}` : "none",
          zIndex: 5,
          position: "relative"
        }}
      >
        <div className="p-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});

CatalogCollapsible.displayName = "CatalogCollapsible";
