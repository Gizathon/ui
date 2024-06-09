import React from "react";
import MeditatingYoda from "@/public/baby-yoda-illustration.png";
import Image from "next/image";
import TravellingBg from "@/public/space-travelling-gif.gif";
const BabyYoda = () => {
  const text = "YODA IS PREDICTING THE FUTURE. PLEASE WAIT...";
  return (
    <div>
      <Image
        src={TravellingBg}
        layout="fill"
        className="fixed object-fit top-0 -z-10 w-screen h-screen animate-ping"
        alt=""
      />
      <Image src={MeditatingYoda} alt="Meditating Yoda" className="w-96 h-96" />
      <div className="mt-10">
        {text.split("").map((letter, index) => (
          <span
            key={index}
            className={`letter ${letter === " " ? "space" : ""}`}
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BabyYoda;
