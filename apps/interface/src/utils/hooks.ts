import { useEffect, useRef } from "react";

/* useRecursiveTimeout hook
 ** https://creativecommons.org/licenses/by/4.0/
 ** https://www.aaron-powell.com/posts/2019-09-23-recursive-settimeout-with-react-hooks/ Aaron Powell & Tzach Shabtay
 */
export function useRecursiveTimeout<t>(
  callback: (() => Promise<t>) | (() => void),
  delay: number | null,
  pollId: number,
) {
  const savedCallback = useRef(callback);
  const savedDelay = useRef(delay);
  const savedPollId = useRef(pollId);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Remember the latest delay.
  useEffect(() => {
    savedDelay.current = delay;
  }, [delay]);

  // Remember the latest poll id.
  useEffect(() => {
    savedPollId.current = pollId;
  }, [pollId]);

  // Set up the timeout loop.
  useEffect(() => {
    let id: NodeJS.Timeout;
    function tick() {
      if (savedPollId.current !== pollId) {
        return;
      }
      const ret = savedCallback.current();
      if (ret instanceof Promise) {
        ret.then(() => {
          if (savedPollId.current !== pollId) {
            return;
          }
          if (savedDelay.current !== null) {
            id = setTimeout(tick, savedDelay.current);
          }
        });
      } else {
        if (savedPollId.current !== pollId) {
          return;
        }
        if (savedDelay.current !== null) {
          id = setTimeout(tick, savedDelay.current);
        }
      }
    }
    if (savedDelay.current !== null) {
      id = setTimeout(tick, savedDelay.current);
      return () => id && clearTimeout(id);
    }
  }, [delay]);
}
