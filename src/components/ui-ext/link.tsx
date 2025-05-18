// ./src/components/ui/link.tsx

import React from "react";
import { Button, buttonVariants} from "../ui/button";
import type { VariantProps } from "class-variance-authority"

export interface LinkProps extends VariantProps<typeof buttonVariants>{
  id?: string;
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const Link: React.FC<LinkProps> = ({ id, href, children, target, rel, ...props }) => {
  return (
    <Button {...props} asChild>
      <a id={id} href={href} target={target} rel={rel}>{children}</a>
    </Button>
  );
};

export { Link };