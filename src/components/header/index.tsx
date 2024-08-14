"use client";

import useLogo from "@/hooks/useLogo";
import useText from "@/hooks/useText";
import React from "react";

import { ShieldIcon } from "lucide-react";
import useColors from "@/hooks/useColors";

const Header: React.FC<{ loja: any }> = ({ loja }) => {
  const { logoUrl } = useLogo(loja);
  const { text } = useText(loja);
  const { colors } = useColors(loja);

  if (!text) return null;

  const formatText = (text: string) => {
    const regex = /\*(.*?)\*/g;

    return text.replace(regex, (match, p1) => `<strong>${p1}</strong>`);
  };

  const formattedText = formatText(text.text);

  return (
    <header className="bg-main w-full py-5 pb-0">
      <div className="mx-auto max-w-[1440px] w-full center !justify-between px-10 pb-4 h-full">
        <img
          src={logoUrl?.url}
          alt="Logo"
          className="h-[70px] max-w-[180px] object-contain "
        />
        <div
          style={{ color: colors.pag }}
          className="h-[70px] center font-poppins_black app_sm:scale-[0.9] app_sm:text-[12px]"
        >
          <ShieldIcon size={40} fill={colors.pag} />
          <span className="center-col !items-start">
            <span> Pagamento </span>
            <span className="mt-[-5px]">100% Seguro</span>
          </span>
        </div>
      </div>
      <div className="w-full bg-text font-poppins_light text-appbackground py-4 center">
        <p
          className="text-center app_sm:text-[11px]"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        ></p>
      </div>
    </header>
  );
};

export default Header;
