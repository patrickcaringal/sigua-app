import { useState } from "react";

const useLoading = (action, loadingAction) => {
  const [loading, setLoading] = useState(false);

  const doAction = async (...args) => {
    setLoading(true);
    loadingAction && loadingAction(true);
    await action(...args);
    setLoading(false);
    loadingAction && loadingAction(false);
    // return action(...args).finally(() => setLoading(false));
  };

  return [doAction, loading];
};

export default useLoading;
