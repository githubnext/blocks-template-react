import ReactDOM from "react-dom/client";

import { Block, FileContext, FolderContext } from "@githubnext/blocks";
import { init } from "@githubnext/blocks-runtime";
import { BlockComponentProps, BlockComponent } from "./BlockComponent";

import "./index.css";

// redirect from the server to the production blocks frame
if (window === window.top) {
  window.location.href = `https://blocks.githubnext.com/githubnext/blocks?devServer=${encodeURIComponent(
    window.location.href
  )}`;
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

const loadDevServerBlock = async (block: Block) => {
  const imports = import.meta.glob("../blocks/**");
  const importPath = "../" + block.entry;
  const importContent = imports[importPath];
  const content = await importContent();
  const Component = content.default;

  return (props) => {
    const fullProps = {
      ...props,
      BlockComponent: getBlockComponentWithParentContext(props.context),
    };

    root.render(<Component {...fullProps} />);
  };
};

init(loadDevServerBlock);

const getBlockComponentWithParentContext = (
  parentContext?: FileContext | FolderContext
) => {
  return (props: BlockComponentProps) => {
    let context = {
      ...(parentContext || {}),
      ...(props.context || {}),
    };

    if (parentContext) {
      // clear sha if viewing content from another repo
      const parentRepo = [parentContext.owner, parentContext.repo].join("/");
      const childRepo = [context.owner, context.repo].join("/");
      const isSameRepo = parentRepo === childRepo;
      if (!isSameRepo) {
        context.sha = props.context?.sha || "HEAD";
      }
    }

    const fullProps = {
      ...props,
      context,
    };

    return <BlockComponent {...fullProps} />;
  };
};
