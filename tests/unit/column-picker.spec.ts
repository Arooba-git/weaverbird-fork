import { shallowMount, createLocalVue } from '@vue/test-utils';
import ColumnPicker from '@/components/stepforms/ColumnPicker.vue';
import Vuex, { Store } from 'vuex';
import { setupStore } from '@/store';
import { VQBState } from '@/store/state';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Column Picker', () => {
  let emptyStore: Store<VQBState>;
  beforeEach(() => {
    emptyStore = setupStore({});
  });

  it('should instantiate', () => {
    const wrapper = shallowMount(ColumnPicker, { store: emptyStore, localVue });
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should have a widget autocomplete', () => {
    const wrapper = shallowMount(ColumnPicker, { store: emptyStore, localVue });
    expect(wrapper.find('autocompletewidget-stub').exists()).toBeTruthy();
  });

  it('should instantiate an autocomplete widget with proper options from the store', () => {
    const store = setupStore({
      dataset: {
        headers: [{ name: 'columnA' }, { name: 'columnB' }, { name: 'columnC' }],
        data: [],
      },
    });
    const wrapper = shallowMount(ColumnPicker, { store, localVue });
    const selectWrapper = wrapper.find('autocompletewidget-stub');
    expect(selectWrapper.attributes('options')).toEqual('columnA,columnB,columnC');
  });

  it('should set column when initialColumn is set', () => {
    const store = setupStore({
      dataset: {
        headers: [{ name: 'columnA' }, { name: 'columnB' }, { name: 'columnC' }],
        data: [],
      },
    });
    const wrapper = shallowMount(ColumnPicker, {
      store,
      localVue,
      propsData: {
        initialColumn: 'columnA',
      },
    });
    expect(wrapper.vm.$data.column).toEqual('columnA');
  });

  it('should update step when selectedColumn is changed', async () => {
    const store = setupStore({
      dataset: {
        headers: [{ name: 'columnA' }, { name: 'columnB' }, { name: 'columnC' }],
        data: [],
      },
      selectedColumns: ['columnA'],
    });
    const wrapper = shallowMount(ColumnPicker, {
      store,
      localVue,
    });
    expect(wrapper.vm.$data.column).toEqual('columnA');
    store.commit('setSelectedColumns', { column: 'columnB' });
    await localVue.nextTick();
    expect(wrapper.vm.$data.column).toEqual('columnB');
    expect(store.state.selectedColumns).toEqual(['columnB']);
  });
});
