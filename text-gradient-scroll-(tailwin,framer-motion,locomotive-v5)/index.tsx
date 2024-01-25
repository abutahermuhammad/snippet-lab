"use client";
import clsx from "clsx";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import React, { useRef } from "react";

/**
 * Component for rendering a paragraph with animated words.
 * @param paragraph - The string of text to be displayed.
 * @param className - Optional class name for additional styling.
 */
export default function Paragraph({
  paragraph,
  className,
}: {
  paragraph: string;
  className?: string;
}) {
  // Create a reference to the container element
  const container = useRef(null);

  // Split the paragraph into words
  const words = paragraph?.split(" ");

  // Get the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.5"],
  });

  // Render the paragraph with animated words
  return (
    <p ref={container} className={clsx("max-w-full justify-start", className)}>
      {words?.map((word, i) => {
        // Calculate the progress range for each word
        const totalWord = words.length;
        const start = i / totalWord;
        const end = start + 1 / totalWord;

        // Render each word with animation and space between words
        return (
          <>
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
            <span>{i !== totalWord - 1 && " "}</span>
          </>
        );
      })}
    </p>
  );
}

/**
 * Renders each character of the input string with motion effects based on the progress value
 * @param children - The input string
 * @param progress - The motion value for the progress of the animation
 * @param range - The range of motion for the animation
 */
const Word = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  // Calculate the amount of motion for the animation
  const amount = range[1] - range[0];
  // Calculate the motion step for each character
  const step = amount / children.length;
  // Render each character with motion effects
  return (
    <span className="relative  mt-3">
      {children.split("").map((char, i) => {
        const start = range[0] + i * step;
        const end = range[0] + (i + 1) * step;
        // Render the character with motion effects
        return (
          <Char key={`c_${i}`} progress={progress} range={[start, end]}>
            {char}
          </Char>
        );
      })}
    </span>
  );
};

/**
 * Char component
 *
 * @param children - The string to be displayed
 * @param progress - The progress value
 * @param range - The range of values
 */
const Char = ({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  // Calculate opacity based on progress and range
  const opacity = useTransform(progress, range, [0, 1]);

  // Return the rendered components
  return (
    <span>
      {/* Display the children with 20% opacity */}
      <span className="absolute opacity-[20%]">{children}</span>
      {/* Display the children with dynamic opacity based on progress */}
      <motion.span style={{ opacity: opacity }}>{children}</motion.span>
    </span>
  );
};
