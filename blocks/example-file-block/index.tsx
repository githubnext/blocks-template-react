import { FileBlockProps } from "@githubnext/blocks";
import "./index.css";

export default function (props: FileBlockProps) {
  const { content } = props;

  return (
    <>
      <h1>Hello from React!</h1>
      <pre>{content}</pre>
    </>
  );
}
