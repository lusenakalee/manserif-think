"use client";
import { Tooltip } from "@/components/ui/tooltip-card";
import React from "react";
import { FallingPattern } from "../ui/FallingPattern";

export function AboutMeSec() {
  return (


    <div className="mx-auto max-w-2xl p-4 md:p-10 h-screen">

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        My name is {" "}
        <Tooltip
          containerClassName="text-neutral-600 dark:text-neutral-400"
          content={<TooltipCard />}        >
          <span className="font-bold cursor-pointer animate-pulse-slow ">

            Warren Gathigi Kamau</span>
        </Tooltip>{" "}


        , and Man Serif.Think is the creative space where thought, faith, and artistry converge. It is more than an art studio—it is a living thought bubble, a personal archive of vision and imagination, where each piece reflects a journey of introspection, spiritual inquiry, and creative expression. Rooted in faith and guided by purpose, this portfolio marks the beginning of a path whose destination is unknown, yet whose foundation is firmly entrusted to God.
        

      </p>
      <p className="mt-10 text-sm text-neutral-600 dark:text-neutral-400">
 
        Through Man Serif.Think, I present a collection of conceptual paintings, prints, collages, and sculptures that reinterpret biblical anecdotes through contemporary visual language. My work spans both abstract and realistic styles, recontextualizing ancient truths to make them resonate with the modern mind. Each artwork invites viewers to engage with timeless spiritual narratives in fresh, familiar, and thought-provoking ways—while also offering original pieces, samples, and products available for collection and purchase.
      </p>

      <p className="mt-10 text-sm text-neutral-600 dark:text-neutral-400">
      
        This is the start of a new journey—one shaped by curiosity, devotion, and the courage to create without knowing exactly where the road leads. Every piece is a step forward, a conversation between the sacred and the present, and a testament to the belief that what begins with faith is carried through to completion. Welcome to Man Serif.Think, where art becomes both reflection and revelation.
      </p>
    </div>
  );
}

const TooltipCard = () => {
  return (
    <div>
      <img
        src="/images/eyes.webp"
        alt="warren insta"
        className="aspect-square w-full rounded-sm"
      />
      <div className="my-4 flex flex-col">
        <p className="text-lg font-bold">IG @warren_kamau</p>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          Follow my personal account on Instagram for more of my work and creative process:{" "}
        </p>
      </div>
    </div>
  );
};

const TestimonialCard = () => {
  return (
    <div className="">
      <blockquote className="mb-4 text-neutral-700 dark:text-neutral-300">
        This product is absolutely, grade A horse shit.
      </blockquote>
      <div className="flex items-center gap-2">
        <img
          src="https://assets.aceternity.com/screenshots/tyler.webp"
          alt="Tyler Durden"
          className="size-6 rounded-full object-cover"
        />
        <div>
          <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            Tyler Durden
          </p>
          <p className="text-[10px] text-neutral-600 dark:text-neutral-400">
            Senior Product Manager at FC
          </p>
        </div>
      </div>
    </div>
  );
};
