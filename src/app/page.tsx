"use client";

import { useRouter } from "next/router";
import { useEffect, useReducer, useRef, useState } from "react";

enum Command {
  Ls = "ls",
  Cd = "cd",
}
enum Page {
  AboutMe = "about-me",
  Posts = "posts",
}
const commands = Object.values(Command);
const username = "Yeongil Yoon🔥";

type CommandInput = {
  command: string;
  candidates: string[];
  index: number;
};
type CommandInputAction = "nextRecommend" | { command: string };

type CommandHistory = {
  name: string;
  path: string;
  command: string;
  lines: string[];
};

const guideMessage = `----------------
Welcome to Yeongil's blog!
Type \`ls\` to see the list of pages, and move to the page with \`cd \{page\}\`
----------------
`;

const useCommand = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<CommandHistory[]>([]);

  const [commandInput, updateCommandInput] = useReducer(
    (state: CommandInput, action: CommandInputAction): CommandInput => {
      switch (action) {
        case "nextRecommend": {
          if (state.index >= 0) {
            return {
              ...state,
              command:
                state.candidates[(state.index + 1) % state.candidates.length],
              index: state.index + 1,
            };
          } else {
            const candidates = Object.values(Command).filter((c) =>
              c.startsWith(state.command)
            );
            return {
              command: candidates.length ? candidates[0] : state.command,
              candidates,
              index: candidates.length ? 0 : -1,
            };
          }
        }
        default: {
          return { command: action.command, candidates: [], index: -1 };
        }
      }
    },
    { command: "", candidates: [], index: -1 }
  );
};

export default function Home() {
  //const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const [history, setHistory] = useState<CommandHistory[]>([]);

  const [commandInput, updateCommandInput] = useReducer(
    (state: CommandInput, action: CommandInputAction): CommandInput => {
      switch (action) {
        case "nextRecommend": {
          if (state.index >= 0) {
            return {
              ...state,
              command:
                state.candidates[(state.index + 1) % state.candidates.length],
              index: state.index + 1,
            };
          } else {
            const candidates = Object.values(Command).filter((c) =>
              c.startsWith(state.command)
            );
            return {
              command: candidates.length ? candidates[0] : state.command,
              candidates,
              index: candidates.length ? 0 : -1,
            };
          }
        }
        default: {
          return { command: action.command, candidates: [], index: -1 };
        }
      }
    },
    { command: "", candidates: [], index: -1 }
  );

  useEffect(
    () =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
    [commandInput]
  );

  return (
    <div
      className="h-screen cursor-default pt-2 font-mono"
      onClick={() => {
        inputRef.current?.focus();
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <TerminalPrint lines={[guideMessage]} />
      {history.map((h, i) => {
        return <TerminalHistory key={i} {...h} />;
      })}
      <StatusLine name="Yeongil Yoon🔥" path="~" />
      <CommandLine command={commandInput.command} focused={focused} activated />
      <input
        className="text-transparent bg-transparent outline-none cursor-default -z-10"
        spellCheck={false}
        draggable={false}
        //className="text-black"
        ref={inputRef}
        value={commandInput.command}
        onChange={(e) => {
          updateCommandInput({ command: e.target.value });
        }}
        onKeyDown={(e) => {
          switch (e.key) {
            case "Enter": {
              updateCommandInput({ command: "" });
              setHistory([
                ...history,
                {
                  command: commandInput.command,
                  name: username,
                  lines: ["Command not found"],
                  path: "~",
                },
              ]);
              e.preventDefault();
              break;
            }
            case "Tab": {
              console.log("hello");
              updateCommandInput("nextRecommend");
              e.preventDefault();
              break;
            }
          }
        }}
        autoFocus
      />
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

function CommandLine(props: {
  command: string;
  activated: boolean | undefined;
  focused: boolean | undefined;
}) {
  return (
    <div className="flex flex-row text-sm">
      <div className="w-1.5" />
      <div className="pr-2 border-l-[10px] border-l-light-purple border-y-[10px] border-y-[transparent]" />
      {commands.includes(props.command as Command) ? (
        <span className="whitespace-pre font-mono text-[#59f68d]">
          {props.command}
        </span>
      ) : (
        <span className="whitespace-pre font-mono text-[#ff6d67]">
          {props.command}
        </span>
      )}
      {props.activated &&
        (props.focused ? (
          <div className="w-2 h-auto bg-cursor" />
        ) : (
          <div className="w-2 h-auto border-cursor bg-transparent border" />
        ))}
    </div>
  );
}

function TerminalPrint(props: { lines: string[] }) {
  return (
    <div className="pl-1.5 text-sm whitespace-pre flex flex-col flex-wrap w-full">
      {props.lines.map((line, index) => {
        return (
          <span
            key={index}
            className="inline-block w-full break-words whitespace-pre-wrap"
          >
            {line}
          </span>
        );
      })}
    </div>
  );
}

function TerminalHistory(props: {
  name: string;
  path: string;
  command: string;
  lines: string[];
}) {
  return (
    <>
      <StatusLine {...props} />
      <CommandLine {...props} activated={false} focused={false} />
      <TerminalPrint {...props} />
    </>
  );
}
