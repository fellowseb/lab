import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import Select from "../components/Select.tsx";

interface ResourceTagModel {
  tag: string;
  displayName: {
    en: string;
  };
}

interface ResourceFiltersState {
  loading: boolean;
  error: unknown | null;
  tags: ResourceTagModel[];
}

interface ResourceFiltersProps {
  onChangeFilter?: (tag: string) => void;
  filteredTag?: string;
}

/**
 * Component displaying a combo enabling the filtering
 * of resources.
 */
const ResourceFilters = ({
  filteredTag,
  onChangeFilter,
}: ResourceFiltersProps) => {
  const [state, setState] = useState<ResourceFiltersState>({
    loading: false,
    error: null,
    tags: [],
  });
  const selectRef = useRef<HTMLSelectElement>(null);
  const changeFilter = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      event.preventDefault();
      const select = selectRef.current;
      if (select && onChangeFilter) {
        onChangeFilter(select.options[select.selectedIndex].value);
      }
    },
    [onChangeFilter],
  );
  useEffect(() => {
    const refresh = async () => {
      setState((prevState) => ({ ...prevState, loading: true }));
      try {
        const tags = await retrieveFilterTags("");
        setState({
          loading: false,
          error: null,
          tags,
        });
      } catch (err) {
        setState({
          loading: false,
          error: err,
          tags: [],
        });
      }
    };
    refresh();
  }, []);
  const { tags } = state;
  return (
    <section>
      <label>Filter by category : </label>
      <Select
        value={filteredTag || ""}
        disabled={tags.length === 0}
        ref={selectRef}
        onChange={changeFilter}
      >
        <option value="">Show all</option>
        {tags.map((tagItem, i) => {
          return (
            <option value={tagItem.tag} key={i}>
              {tagItem.displayName ? tagItem.displayName.en : tagItem.tag}
            </option>
          );
        })}
      </Select>
    </section>
  );
};

/**
 * Fetch Pocket data
 */
const retrieveFilterTags = async (apiUrl: string) => {
  const response = await fetch(apiUrl + "/resourcetags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  const json = await response.json();
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`${json.error ? json.error : response.statusText}`);
  }
  return json.tags;
};

export default ResourceFilters;
