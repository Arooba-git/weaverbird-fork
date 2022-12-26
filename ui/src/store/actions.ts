import type { ActionContext, ActionTree } from 'vuex';

import type { BackendError } from '@/lib/backend';
import { addLocalUniquesToDataset, updateLocalUniquesFromDatabase } from '@/lib/dataset/helpers';
import { pageOffset } from '@/lib/dataset/pagination';
import type { Pipeline, PipelineStep } from '@/lib/steps';

import type { VQBState } from './state';

// format error to fit BackendError interface props
export function formatError(error: any): BackendError {
  return typeof error === 'string'
    ? { type: 'error', message: error.toString() }
    : { type: 'error', ...error };
}

const actions: ActionTree<VQBState, any> = {
  selectPipeline(context: ActionContext<VQBState, any>, { name }: { name: string }) {
    context.commit('setCurrentPipelineName', { name: name });

    // Reset selected step to last one
    context.commit('selectStep', { index: -1 });

    // Update the preview
    context.dispatch('updateDataset');
  },

  async updateDataset({ commit, getters, state }: ActionContext<VQBState, any>) {
    commit('logBackendMessages', { backendMessages: [] }); // clear backendMessages
    try {
      commit('setLoading', { type: 'dataset', isLoading: true });
      commit('toggleRequestOnGoing', { isRequestOnGoing: true });
      // No pipeline or an empty pipeline
      if (!getters.activePipeline?.length) {
        // Reset preview to an empty state
        commit('setDataset', {
          dataset: {
            headers: [],
            data: [],
          },
        });
        return;
      }
      const response = await state.backendService.executePipeline(
        getters.activePipeline,
        state.pipelines,
        state.pagesize,
        pageOffset(state.pagesize, getters.pageNumber),
        getters.previewSourceRowsSubset,
      );
      const translator = response.translator ?? 'mongo50'; // mongo50 is not send by backend
      commit('setTranslator', { translator });
      const backendMessages = response.error || response.warning || [];
      commit('logBackendMessages', { backendMessages });
      if (response.data) {
        commit('setDataset', {
          dataset: addLocalUniquesToDataset(response.data),
        });
      }
      return response;
    } catch (error) {
      /* istanbul ignore next */
      const response = { error: [formatError(error)] };
      // Avoid spamming tests results with errors, but could be useful in production
      /* istanbul ignore next */
      if (import.meta.env.DEV) {
        console.error(error);
      }
      /* istanbul ignore next */
      commit('logBackendMessages', {
        backendMessages: response.error,
      });
      /* istanbul ignore next */
      throw error;
    } finally {
      commit('toggleRequestOnGoing', { isRequestOnGoing: false });
      commit('setLoading', { type: 'dataset', isLoading: false });
    }
  },

  // Following actions are the one that have an impact on the preview, and therefore must update the dataset each time their are called
  selectStep({ commit, dispatch }: ActionContext<VQBState, any>, { index }: { index: number }) {
    commit('selectStep', { index });
    dispatch('updateDataset');
  },

  // Retrieve the first row from a pipeline, so we can infer its columns names
  async getColumnNamesFromPipeline(
    { state }: ActionContext<VQBState, any>,
    pipelineNameOrDomain: string,
  ): Promise<string[] | undefined> {
    if (!pipelineNameOrDomain) {
      return;
    }

    let pipeline: Pipeline = [];

    if (pipelineNameOrDomain in state.pipelines) {
      pipeline = state.pipelines[pipelineNameOrDomain];
    } else {
      pipeline = [
        {
          name: 'domain',
          domain: pipelineNameOrDomain,
        },
      ];
    }

    const response = await state.backendService.executePipeline(pipeline, state.pipelines, 1, 0);

    if (response.data) {
      return response.data.headers.map((col) => col.name);
    }
  },

  deleteSteps(
    { commit, dispatch }: ActionContext<VQBState, any>,
    { indexes }: { indexes: number[] },
  ) {
    commit('deleteSteps', { indexes });
    dispatch('updateDataset');
  },

  addSteps(
    { commit, dispatch }: ActionContext<VQBState, any>,
    { steps }: { steps: PipelineStep[] },
  ) {
    commit('addSteps', { steps });
    dispatch('updateDataset');
  },

  setCurrentPage(
    { commit, dispatch }: ActionContext<VQBState, any>,
    { pageNumber }: { pageNumber: number },
  ) {
    commit('setCurrentPage', { pageNumber });
    dispatch('updateDataset');
  },

  /**
   * Call backend with a special pipeline to retrieve unique values of the requested column.
   * The current pipeline is completed with a "count aggregation" on the requested column.
   * The result is loaded in store.
   */
  async loadColumnUniqueValues(
    context: ActionContext<VQBState, any>,
    { column }: { column: string },
  ) {
    context.commit('setLoading', { type: 'uniqueValues', isLoading: true });
    try {
      const activePipeline = context.getters.activePipeline;
      if (!activePipeline || !activePipeline.length) {
        return;
      }
      const loadUniqueValuesPipeline: Pipeline = [
        ...activePipeline,
        {
          name: 'aggregate',
          aggregations: [
            {
              columns: [column],
              aggfunction: 'count',
              newcolumns: ['__vqb_count__'],
            },
          ],
          on: [column],
        },
      ];

      const response = await context.state.backendService.executePipeline(
        loadUniqueValuesPipeline,
        context.state.pipelines,
      );
      if (!response.error) {
        context.commit('setDataset', {
          dataset: updateLocalUniquesFromDatabase(context.state.dataset, response.data),
        });
      }
    } finally {
      context.commit('setLoading', { type: 'uniqueValues', isLoading: false });
    }
  },
};

export default actions;