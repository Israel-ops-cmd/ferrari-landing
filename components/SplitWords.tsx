import { Fragment } from "react";

// Quebra um texto em palavras para as animações de revelar e preencher.
export default function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word" style={{ ["--w" as string]: i }}>
            <span className="word-inner">{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
