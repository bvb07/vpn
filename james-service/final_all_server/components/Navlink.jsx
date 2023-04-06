import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

export default function Navlink({ to, name, ...rest }) {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsActive(window.location.pathname === to);
    }
  }, [to]);

  return (
    <Link href={to}>
      <Button colorScheme="orange" className="chakra-button" {...rest}>
        {name}
      </Button>
    </Link>
  );
}
