import { Component } from "preact";

import TabItem from "./TabItem";
import { log, groupEnd, groupCollapsed } from "../utils";

type Props = {
  windowId?: number;
};

type State = {
  tabs: browser.tabs.Tab[];
  containers: browser.contextualIdentities.ContextualIdentity[];
};

class App extends Component<Props, State> {
  readonly state: State = {
    tabs: [],
    containers: [],
  };

  constructor() {
    super();

    // ==== tabs ====

    browser.tabs.query({ currentWindow: true }).then((tabs) => {
      log("tabs#query", tabs);

      this.setState({ tabs });
    });

    browser.tabs.onCreated.addListener((tab) => {
      if (tab.windowId !== this.props.windowId) return;

      this.setState(({ tabs }) => {
        groupCollapsed("tabs#onCreated", tab);

        log("prev", tabs);

        const appended = [...tabs, tab];

        log("next", appended);

        groupEnd();

        return { tabs: appended };
      });
    });

    browser.tabs.onUpdated.addListener((_, info, tab) => {
      if (
        tab.windowId !== this.props.windowId ||
        !(
          "title" in info ||
          "url" in info ||
          "status" in info ||
          "favIconUrl" in info
        )
      ) {
        return;
      }

      this.setState(({ tabs }) => {
        const cloned = [...tabs];

        groupCollapsed("tabs#onUpdated", { info, tab });

        log("prev", cloned);

        cloned[tab.index] = {
          ...cloned[tab.index],
          ...info,
        };

        log("next", cloned);

        groupEnd();

        return { tabs: cloned };
      });
    });

    browser.tabs.onActivated.addListener((info) => {
      if (info.windowId !== this.props.windowId) return;

      this.setState(({ tabs }) => {
        const cloned = [...tabs];

        groupCollapsed("tabs#onActivated", info);

        log("prev", cloned);

        cloned.find((tab) => tab.id === info.tabId)!.active = true;

        if (info.previousTabId) {
          cloned.find((tab) => tab.id === info.previousTabId)!.active = false;
        }

        log("next", cloned);

        groupEnd();

        return { tabs: cloned };
      });
    });

    browser.tabs.onRemoved.addListener((tabId) => {
      this.setState(({ tabs }) => {
        groupCollapsed("tabs#onRemoved", tabId);

        log("prev", tabs);

        const filtered = tabs.filter((tab) => tab.id !== tabId);

        log("next", filtered);

        groupEnd();

        if (tabs.length === filtered.length) return null;

        return { tabs: filtered };
      });
    });

    // ==== containers ====

    browser.contextualIdentities.query({}).then((containers) => {
      log("containers#query");

      this.setState({ containers });
    });

    browser.contextualIdentities.onCreated.addListener((container) => {
      this.setState(({ containers }) => {
        groupCollapsed("containers#onCreated", container);

        log("prev", containers);

        const appended = [...containers, container.contextualIdentity];

        log("next", appended);

        groupEnd();

        return { containers: appended };
      });
    });

    browser.contextualIdentities.onUpdated.addListener((info) => {
      this.setState(({ containers }) => {
        const cloned = [...containers];

        groupCollapsed("containers#onUpdated", info);

        log("prev", cloned);

        const index = cloned.findIndex(
          (container) => container.name === info.contextualIdentity.name
        );

        cloned[index] = info.contextualIdentity;

        log("next", cloned);

        groupEnd();

        return { containers: cloned };
      });
    });

    browser.contextualIdentities.onRemoved.addListener((info) => {
      this.setState(({ containers }) => {
        groupCollapsed("containers#onRemoved", info);

        log("prev", containers);

        const filtered = containers.filter(
          (container) => container.name !== info.contextualIdentity.name
        );

        log("next", filtered);

        groupEnd();

        return { containers: filtered };
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.tabs.map((tab) => (
          <TabItem key={tab.id} tab={tab} />
        ))}

        {this.state.containers.map((container) => (
          <div key={container.name}>{container.name}</div>
        ))}
      </div>
    );
  }
}

export default App;
