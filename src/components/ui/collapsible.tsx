
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
  
  // Ensure displayName always has a value - critical for rendering
  const displayName = categoryName || label;
  
  // More detailed logging to help diagnose the issue
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
              className="catalog-category-name block w-full text-center font-bold text-lg"
              data-testid="category-name"
              style={{ 
                color: "#000000",
                opacity: 1,
                fontWeight: 700,
                textShadow: "0px 0px 1px rgba(0,0,0,0.3)",
                letterSpacing: "0.5px"
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
              backgroundColor: "#FFFFFF", // Keep white background
              borderRadius: "6px",
              opacity: 0.9 // Keep high opacity for visibility
            }}
          >
            <div 
              className="catalog-handle-hole"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "rgba(0,0,0,0.6)", // Darkened to 0.6 opacity (from 0.2)
                borderRadius: "50%",
                opacity: 0.9 // Increased opacity from 0.7 to 0.9
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
