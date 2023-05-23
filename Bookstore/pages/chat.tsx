import {
  MultiChatWindow,
  useMultiChatLogic,
  MultiChatSocket,
} from "react-chat-engine-advanced";
// Reference: https://www.youtube.com/watch?v=areCZcr-XZ4
// server
const projectId: string = "f147e5de-0ef4-4097-8cd6-e2b7691c2a5e";
const username: string = "yi";
const secret: string = "1234";
export default function Chat() {
  const chatProps = useMultiChatLogic(projectId, username, secret);
  return (
    <div>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow
        {...chatProps}
        style={{ height: "100vh" }}
        // projectID="f147e5de-0ef4-4097-8cd6-e2b7691c2a5e"
        // userName="yi"
        // userSecret="1234"
      />
    </div>
  );
}
