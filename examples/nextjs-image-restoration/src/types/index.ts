export type Prediction = {
  id: string;
  version: string;
  urls: {
    get: string;
    cancel: string;
  };
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  input: {
    image: string;
  };
  output: null | string;
  error: null;
  logs: null;
  metrics: {};
};
