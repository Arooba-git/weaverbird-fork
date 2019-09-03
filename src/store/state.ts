/**
 * define what the application state looks like.
 */
import { DataSet } from '@/lib/dataset';
import { Pipeline, PipelineStepName } from '@/lib/steps';
import { BackendError } from '@/lib/backend-response';

export interface VQBState {
  /**
   * the current dataset.
   */
  dataset: DataSet;
  /**
   * the current list of domains available.
   */
  domains: string[];
  /**
   * the domain currently selected.
   */
  currentDomain?: string;
  /**
   * the current step form displayed
   */
  currentStepFormName?: PipelineStepName;
  /**
   * the last step currently active.
   */
  selectedStepIndex: number;
  /**
   * the current pipeline (including inactive steps).
   */
  pipeline: Pipeline;

  /**
   * object used to fill an edit step form
   */
  stepFormInitialValue?: object;

  /**
   * the seclected columns (materialized by a styled focus on the DataViewer)
   */
  selectedColumns: string[];

  /**
   * pagination size (i.e. number of results displayed)
   */
  pagesize: number;

  /**
   * error send by backend or catch from its interface
   */
  backendError?: BackendError;

  /**
   * whether the data is loading
   */
  isLoading: boolean;
}

/**
 * default empty state, useful to update just some parts of it
 * when creating the intiial version of store.
 */
export const emptyState: VQBState = {
  dataset: {
    headers: [],
    data: [],
    paginationContext: {
      pagesize: 50,
      pageno: 1,
      totalCount: 0,
    },
  },
  domains: [],
  currentStepFormName: undefined,
  stepFormInitialValue: undefined,
  selectedStepIndex: -1,
  pipeline: [],
  selectedColumns: [],
  pagesize: 50,
  backendError: undefined,
  isLoading: false,
};

/**
 * @param state current application state
 * @return the index of the first inactive step. Return first out of bound index
 * if all steps are active.
 */
function firstNonSelectedIndex(state: VQBState) {
  const { pipeline, selectedStepIndex } = state;
  if (selectedStepIndex < 0) {
    return pipeline.length;
  }
  return selectedStepIndex + 1;
}

/**
 * @param state current application state
 * @return the subpart of the pipeline that is currently active.
 */
export function activePipeline(state: VQBState) {
  return state.pipeline.slice(0, firstNonSelectedIndex(state));
}

/**
 * @param state current application state
 * @return the subpart of the pipeline that is currently inactive.
 */
export function inactivePipeline(state: VQBState) {
  return state.pipeline.slice(firstNonSelectedIndex(state));
}
