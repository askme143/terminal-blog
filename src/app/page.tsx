"use client";

import { useRef, useState } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [command, setCommand] = useState<string>("");

  return (
    <div
      className="h-screen cursor-default pt-2"
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <input
        className="w-0 h-0 absolute"
        ref={inputRef}
        onChange={(e) => {
          setCommand(e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.value = "";
            setCommand("");
          }
        }}
        autoFocus
      />
      <div className="pl-1.5 text-sm whitespace-pre">
        {`----------------
Welcome to Yeongil's blog!
Type \`ls\` to see the list of pages, and move to the page with \`cd \{page\}\`
----------------
`}
      </div>
      <StatusLine name="Yeongil Yoon🔥" path="~" />
      <CommandLine command={command} />
    </div>
  );
}

function StatusLine(props: { name: string; path: string }) {
  return (
    <div className="pl-2 py-1 text-sm flex flex-row items-center cursor-default">
      <div className="px-2 bg-black relative flex flex-row items-center">
        <span> {props.name}</span>
      </div>
      <div className="w-0 h-0 border-l-[10px] border-l-[black] border-y-[10px] border-y-[transparent] bg-light-purple"></div>

      <div className="pl-2 pr-2 bg-light-purple text-black flex flex-row items-center ">
        <span>{props.path}</span>
      </div>
      <div className="w-0 h-0 border-l-[10px] border-l-light-purple border-y-[10px] border-y-[transparent]"></div>
    </div>
  );
}
function CommandLine(props: { command: string }) {
  return (
    <div className="flex flex-row text-sm">
      <div className="w-1.5" />
      <div className="pr-2 border-l-[10px] border-l-light-purple border-y-[10px] border-y-[transparent]" />
      <span>{props.command}</span>
      {props.command === "" && <span className="text-gray-500">ls</span>}
      <div className="w-2 h-auto bg-cursor" />
    </div>
  );
}
