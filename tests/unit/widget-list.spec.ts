import { shallowMount } from '@vue/test-utils';
import WidgetList from '@/components/stepforms/WidgetList.vue';
import WidgetAggregation from '@/components/stepforms/WidgetAggregation.vue';

describe('Widget List', () => {
  describe('automatic new field', () => {
    it('it should instantiate', () => {
      const wrapper = shallowMount(WidgetList);

      expect(wrapper.exists()).toBeTruthy();
    });

    it('should have a label', () => {
      const wrapper = shallowMount(WidgetList, {
        propsData: {
          name: 'Label',
        },
      });

      expect(wrapper.find('label').text()).toEqual('Label');
    });

    it('should instantiate a widget-input text', () => {
      const wrapper = shallowMount(WidgetList);
      const widgetInputWrapper = wrapper.find('widgetinputtext-stub');

      expect(widgetInputWrapper.exists()).toBeTruthy();
    });

    it('should instantiate a widget aggregation', () => {
      const wrapper = shallowMount(WidgetList, {
        propsData: {
          widget: WidgetAggregation,
        },
      });

      const widgetAggregationtWrapper = wrapper.find('widgetaggregation-stub');
      expect(widgetAggregationtWrapper.exists()).toBeTruthy();
    });

    it('should automatically add an input when filling the first one', async () => {
      const wrapper = shallowMount(WidgetList);
      wrapper.setProps({ value: ['columnName'] });

      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('widgetinputtext-stub').length).toEqual(2);
    });

    it('should add trash icons after first input', async () => {
      const wrapper = shallowMount(WidgetList);
      expect(wrapper.findAll('.widget-list__icon').length).toEqual(0);
      wrapper.setProps({ value: [{ column: 'foo', aggfunction: 'sum', newcolumn: 'bar' }] });
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.widget-list__icon').length).toEqual(2);
    });

    it('should remove first input when clickng on trash', async () => {
      const wrapper = shallowMount(WidgetList, {
        propsData: {
          value: ['columnName'],
        },
      });
      const trashWrapper = wrapper.find('.widget-list__icon');
      trashWrapper.trigger('click');
      expect(wrapper.emitted()['input']).toBeDefined();
    });
  });

  describe('not automatic new field', () => {
    it('should have a button to add a new field', () => {
      const wrapper = shallowMount(WidgetList, {
        propsData: {
          automaticNewField: false,
          name: 'Aggregation',
          addFieldName: 'Add aggregation',
        },
      });
      const addButtonWrapper = wrapper.find('button');

      expect(addButtonWrapper.exists()).toBeTruthy();
      expect(addButtonWrapper.text()).toEqual('Add aggregation');
    });

    it('should add a new field when clicking on the button "Add Aggregation"', () => {
      const wrapper = shallowMount(WidgetList, {
        propsData: {
          automaticNewField: false,
          name: 'Aggregation',
        },
      });
      const addButtonWrapper = wrapper.find('button');
      addButtonWrapper.trigger('click');

      expect(wrapper.emitted()['input']).toBeDefined();
      expect(wrapper.emitted()['input'][0][0][0]).toEqual('');
    });
  });
});
