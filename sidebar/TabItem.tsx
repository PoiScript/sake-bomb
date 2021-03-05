import { FunctionalComponent } from "preact";

import styles from "./TabItem.module.css";

import { clsx } from "../utils";

type Props = {
  tab: browser.tabs.Tab;
};

const TabItem: FunctionalComponent<Props> = ({ tab }) => {
  return (
    <div
      className={clsx(styles.tab, tab.active && styles.active)}
      onClick={() => browser.tabs.update(tab.id as number, { active: true })}
    >
      {tab.title}
    </div>
  );
};

export default TabItem;
