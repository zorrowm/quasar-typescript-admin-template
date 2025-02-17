<template>
  <div>
    <div class="query-form-and-action expand-btn">
      <q-form ref="queryFrom" class="form">
        <div class="query">
          <div v-for="(item, index) in queryParams.input" :key="index" class="query-item" v-show="!item.collapse">
            <q-input
              v-model.trim="queryParams.params[item.id]"
              :type="item.inputType"
              :class="[item.class]"
              :label="item.placeholder"
              v-if="item.type === 'text'"
              autocapitalize="off"
              autocomplete="new-password"
              autocorrect="off"
              clearable
              dense
              outlined
              dropdown-icon="app:topbar-arrow-bottom"
              clear-icon="app:clear"
              :spellcheck="false"
            />
            <q-select
              v-if="item.type === 'select'"
              :class="[item.class]"
              v-model="queryParams.params[item.id]"
              :options="item.selectOption"
              :label="item.placeholder"
              :spellcheck="false"
              autocapitalize="off"
              autocomplete="new-password"
              autocorrect="off"
              clearable
              dense
              options-dense
              outlined
              emit-value
              dropdown-icon="app:topbar-arrow-bottom"
              clear-icon="app:clear"
              map-options
            />
          </div>
        </div>
        <div class="action">
          <q-btn color="primary" :label="$t('action.search')" :loading="queryParams.queryLoading" @click="handleQuery" />
          <q-btn :label="$t('action.reset')" outline color="primary" :loading="queryParams.resetLoading" @click="handleResetQuery" />
          <q-btn :label="queryParams.allExpand ? $t('action.collapse') : $t('action.expand')" outline color="primary" @click="handleClickCollapse" />
        </div>
      </q-form>
    </div>
    <div class="thin-shadow q-pa-md">
      <q-table
        flat
        bordered
        :columns="tableParams.column as any"
        :rows="tableParams.data"
        :loading="tableParams.loading"
        :pagination="tableParams.pagination"
        hide-pagination
        :no-data-label="$t(`tip.noData`)"
        class="my-table"
        :selected-rows-label="(numberOfRows) => `select ${numberOfRows} ${$t(`table.per`)}`"
        selection="multiple"
        v-model:selected="tableParams.selected"
        row-key="name"
      >
        <template #top>
          <div class="full-width justify-end row">
            <q-btn color="primary" label="Add" class="q-mr-md" @click="handleClickAdd" />
            <q-btn label="Upload" outline color="primary" @click="handleClickUpload" />
          </div>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props">
            <!-- selected -->
            <q-th style="text-align: left">
              <q-checkbox color="primary" v-model="props.selected" />
            </q-th>
            <!-- expand -->
            <q-th auto-width>Expand</q-th>
            <!-- other -->
            <q-th v-for="col in props.cols" :key="col.name" :props="props" style="text-align: left">
              {{ col.label.indexOf('$') !== -1 ? $t(`table.${col.label.replace('$', '')}`) : col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- selected -->
            <q-td class="text-left">
              <q-checkbox color="primary" v-model="props.selected" />
            </q-td>
            <!-- expand -->
            <q-td auto-width>
              <q-toggle v-model="props.expand" checked-icon="add" unchecked-icon="remove" />
            </q-td>
            <!-- other -->
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-left">
              <span v-if="!col.inSlot">{{ col.value }}</span>
              <div v-else class="text-left">
                <!-- simplified rendering logic for id, name, action -->
                <div v-if="col.name === 'id'">{{ tableParams.data.indexOf(props.row) + 1 }}</div>
                <span v-else-if="col.name === 'name'" class="link-type" @click="handlerClickDetail(props.row)">{{ props.row.name }}</span>
                <div v-else-if="col.name === 'action'" class="action-buttons">
                  <span class="in-table-link-button q-mr-md" @click="handlerClickUpdate(props.row)">{{ $t('action.update') }} </span>
                  <span class="in-table-delete-button q-mr-md" @click="handlerClickDelete(props.row)">{{ $t('action.delete') }} </span>
                  <span class="in-table-link-button">
                    {{ $t(`action.more`) }}
                    <q-icon name="o_expand_more"></q-icon>
                    <q-popup-proxy style="min-width: 100px">
                      <q-list>
                        <q-item clickable dense v-close-popup>
                          <q-item-section class="text-center"> 123123 </q-item-section>
                        </q-item>
                        <q-item clickable dense v-close-popup>
                          <q-item-section class="text-center"> 123123 </q-item-section>
                        </q-item>
                        <q-item clickable dense v-close-popup>
                          <q-item-section class="text-center"> 123123 </q-item-section>
                        </q-item>
                      </q-list>
                    </q-popup-proxy>
                  </span>
                </div>
              </div>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <!-- expand detail -->
            <q-td colspan="100%">
              <div class="text-left">Name:{{ props.row.name }}</div>
              <div>this is expand detail , it maybe json string or other special text</div>
            </q-td>
          </q-tr>
        </template>
        <!--      loading-->
        <template v-slot:loading>
          <q-inner-loading color="primary" showing />
        </template>
      </q-table>
      <MyPagination :paginationParams="tableParams.pagination" v-if="tableParams.pagination.rowsNumber > 0" @pagination="paginationInput"></MyPagination>
    </div>
    <MyDialog
      :option="{
        id: dialogAddUpdateParams.id,
        dialogType: dialogAddUpdateParams.dialogType,
        clickLoading: dialogAddUpdateParams.clickLoading,
        getDataLoading: dialogAddUpdateParams.getDataLoading,
        visible: dialogAddUpdateParams.visible,
        title: dialogAddUpdateParams.title,
        params: dialogAddUpdateParams.params,
        showConfirm: true,
      }"
      @confirm="dialogAddUpdateConfirmEvent"
      @close="dialogAddUpdateParams.visible = false"
      @before-hide="(data) => (dialogAddUpdateParams.params = data.params)"
    >
      <div class="row q-col-gutter-x-md">
        <div v-for="(item, index) in dialogAddUpdateParams.input" :key="index" v-responseClass="'sm:col-12 md:col-12 lg:col-6 xl:col-6'">
          <MyFormSelect
            v-if="item.type === 'select'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              selectOption: item.selectOption,
              userInput: true,
            }"
            @input="(data:any) =>(dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormDateRange
            v-if="item.type === 'date-range'"
            :option="{
              from: dialogAddUpdateParams.params[item.model].from,
              to: dialogAddUpdateParams.params[item.model].to,
              required: item.required,
              label: item.label,
            }"
            @input="(data:any) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormDateRangeWithTime
            v-if="item.type === 'date-time-range'"
            :ref="dialogAddUpdateParams.id + '-date-time-range-' + item.model"
            :option="{
              from: dialogAddUpdateParams.params[item.model].from,
              to: dialogAddUpdateParams.params[item.model].to,
              required: item.required,
              label: item.label,
            }"
            @input="(data:any) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormSlider
            v-if="item.type === 'slider'"
            :option="{
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              min: item.min,
              max: item.max,
              step: item.step,
            }"
            @input="(data:any) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormRadio
            v-if="item.type === 'radio'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              selectOption: item.selectOption,
              disable: item.disable,
            }"
            @input="(data:any) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormTreeSelect
            v-if="item.type === 'tree-select'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-tree-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              selectOption: item.selectOption,
              disable: item.disable,
            }"
            @input="(data:any) => (dialogAddUpdateParams.params[item.model] = data)"
          />
          <MyFormMultipleSelect
            v-if="item.type === 'multiple-select'"
            :option="{
              inputId: `${dialogAddUpdateParams.id}-multiple-select-${item.model}`,
              rules: item.rules,
              classes: item.classes,
              model: dialogAddUpdateParams.params[item.model],
              label: item.label,
              selectOption: item.selectOption,
              multiple: item.multiple,
              userInput: true,
            }"
            @input="(data: any) => (dialogAddUpdateParams.params[item.model] = data)"
          >
            <template #subTitle>
              <el-popover placement="top" title="popover-title" :width="320" popper-style="z-index:9999" trigger="hover">
                <p v-for="(item, index) in ['test1', 'test2', 'test3']" :key="index">{{ index + 1 }}. {{ item }}</p>
                <template #reference>
                  <q-icon name="o_info" class="text-grey cursor-pointer" />
                </template>
              </el-popover>
            </template>
          </MyFormMultipleSelect>
          <MyFormInput
            v-if="item.type === 'text'"
            :option="{
              model: dialogAddUpdateParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
            }"
            @input="(data:any) => (dialogAddUpdateParams.params[item.model] = data)"
          >
            <template #subTitle>
              <el-popover placement="top" title="popover-title" :width="320" popper-style="z-index:9999" trigger="hover">
                <p v-for="(item, index) in ['test1', 'test2', 'test3']" :key="index">{{ index + 1 }}. {{ item }}</p>
                <template #reference>
                  <q-icon name="o_info" class="text-grey cursor-pointer" />
                </template>
              </el-popover>
            </template>
          </MyFormInput>
          <MyFormMaskInput
            v-if="item.type === 'mask-input'"
            :option="{
              model: dialogAddUpdateParams.params[item.model],
              rules: item.rules,
              classes: item.classes,
              label: item.label,
              mask: '####/####/####/####',
              hint: '####/####/####/####',
            }"
            @input="(data:any) => (dialogAddUpdateParams.params[item.model] = data)"
          >
          </MyFormMaskInput>
        </div>
      </div>
    </MyDialog>
    <MyDialog
      :option="{
        id: dialogUpload.id,
        dialogType: 'upload',
        clickLoading: dialogUpload.clickLoading,
        getDataLoading: dialogUpload.getDataLoading,
        visible: dialogUpload.visible,
        title: dialogUpload.title,
        params: dialogUpload.params,
        showConfirm: false,
        persistent: false,
        showClose: false,
      }"
      @close="dialogUpload.visible = false"
      @confirm="hanleClickUploadConfirm"
      @before-hide="(data) => (dialogUpload.params = data.params)"
    >
      <div class="dialog-upload-form">
        <input type="file" class="hide" :ref="dialogUpload.fileID" :accept="dialogUpload.accept" :draggable="true" @change="uploadFileSuccess" />
        <div class="container">
          <div class="center" @click="handleClickUploadFile" @dragover="uploadDragover" @drop="uploadDrop" @dragleave="uploadDragleave">
            <q-icon name="o_cloud_upload" class="fs-50" color="primary"></q-icon>
            <p class="click">Click or drag file to this area to upload</p>
            <p class="format">File type is: xlsx</p>
            <p class="fileName" v-if="dialogUpload.params.fileName">
              {{ dialogUpload.params.fileName }}
            </p>
          </div>
        </div>
      </div>
      <template #extra-description>
        <div class="upload-limit">
          <span class="link-type">{{ $t('action.download_template') }}</span>
          Here's some text
        </div>
      </template>
    </MyDialog>
    <MyDialog
      :option="{
        id: dialogDetailParams.id,
        dialogType: 'detail',
        clickLoading: dialogDetailParams.clickLoading,
        getDataLoading: dialogDetailParams.getDataLoading,
        visible: dialogDetailParams.visible,
        title: dialogDetailParams.title,
        params: dialogDetailParams.params,
        showConfirm: false,
        persistent: false,
      }"
      @close="() => (dialogDetailParams.visible = false)"
      @before-hide="(data) => (dialogDetailParams.params = data.params)"
    >
      <q-list class="row q-col-gutter-x-md items-start">
        <q-item v-for="(item, index) in dialogDetailParams.params" :key="index" :clickable="false" v-responseClass="'sm:col-12 md:col-12 lg:col-6 xl:col-6'">
          <q-item-section>
            <q-item-label style="font-weight: 500">{{ item.label }}：</q-item-label>
            <q-item-label :class="item.class" style="margin-top: 8px">
              <span v-if="!item.inSlot" class="text-grey-9">{{ item.value }}</span>
              <section v-else class="text-left">
                <span class="text-red" v-if="item.id === 'name'">
                  {{ item.value }}
                </span>
                <div class="edit-with-input" v-if="item.editType === 'input'">
                  <div class="row justify-between" v-if="!item.inputVisible">
                    <div class="w-p-90 lh-22" style="word-break: break-all">
                      {{ item.value }}
                    </div>
                    <span class="link-type q-ml-md" @click="item.inputVisible = true">编辑</span>
                  </div>
                  <TextToInput :value="item.value" :that="item" :loading="item.loading" @confirm="item.textToInputConfirm" @close="item.textToInputClose" v-if="item.inputVisible" />
                </div>
                <div class="edit-with-select" v-if="item.editType === 'select'">
                  <div class="row justify-between" v-if="!item.inputVisible">
                    <div class="w-p-90 lh-22" style="word-break: break-all">
                      {{ item.value }}
                    </div>
                    <span class="link-type q-ml-md" @click="item.inputVisible = true">编辑</span>
                  </div>
                  <TextToSelect
                    :value="item.value"
                    :that="item"
                    :loading="item.loading"
                    :options="item.options"
                    @confirm="item.textToInputConfirm"
                    @close="item.textToInputClose"
                    v-if="item.inputVisible"
                  />
                </div>
              </section>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </MyDialog>
  </div>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { Component, Vue } from 'vue-facing-decorator';
import { defaultFill } from 'src/utils/tools';
import { getCurrentInstance } from 'vue';

const CONST_PARAMS: any = {
  query: { a: '', b: '', c: '', d: '' },
  dialog_add_update: {
    a: '1',
    b: '2',
    c: '1',
    d: ['2'],
    e: { from: '2024/01/01', to: '2024/02/03' },
    f: '1231/2312/3123/1231',
    g: { from: '2024/01/01 00:00:00', to: '2024/02/03 00:00:00' },
    h: 10,
    i: 'true',
    j: '1',
  },
};
@Component({
  name: 'myComponentTableBeta',
  methods: {
    test() {
      console.log('test');
    },
  },
})
export default class myComponentTableBeta extends Vue {
  /**instance */
  declare $refs: any;
  /**params */
  public globals = getCurrentInstance()!.appContext.config.globalProperties;
  public queryParams: any = {
    id: 'query',
    queryLoading: false,
    resetLoading: false,
    allExpand: false,
    params: cloneDeep(CONST_PARAMS.query),
    input: [
      {
        placeholder: 'Input1',
        type: 'text',
        class: '',
        id: 'a',
        collapse: false,
        defaultCollapse: false,
        inputType: 'text',
      },
      {
        placeholder: 'Input1',
        type: 'text',
        class: '',
        id: 'a',
        collapse: false,
        defaultCollapse: false,
        inputType: 'text',
      },
      {
        placeholder: 'Input1',
        type: 'text',
        class: '',
        id: 'a',
        collapse: false,
        defaultCollapse: false,
        inputType: 'text',
      },
      {
        placeholder: 'Input1',
        type: 'text',
        class: '',
        id: 'a',
        collapse: false,
        defaultCollapse: false,
        inputType: 'text',
      },
      {
        placeholder: 'Input11',
        type: 'text',
        class: '',
        id: 'a',
        collapse: true,
        defaultCollapse: true,
        inputType: 'text',
      },
      {
        placeholder: 'Input10',
        type: 'text',
        class: '',
        id: 'a',
        collapse: true,
        defaultCollapse: true,
        inputType: 'text',
      },
      {
        placeholder: 'Input1',
        type: 'text',
        class: '',
        id: 'a',
        collapse: false,
        defaultCollapse: false,
        inputType: 'text',
      },
      {
        placeholder: 'Input2',
        type: 'select',
        class: '',
        collapse: false,
        defaultCollapse: false,
        selectOption: [
          {
            label: 'option 1',
            value: '1',
          },
          {
            label: 'option 2',
            value: '2',
          },
        ],
        id: 'b',
      },
      {
        placeholder: 'Input3',
        type: 'text',
        class: '',
        collapse: false,
        defaultCollapse: false,
        id: 'c',
        inputType: 'text',
      },
    ],
  };
  public tableParams = {
    selected: [],
    loading: false,
    data: [
      {
        name: 'jen.he.female',
        sex: 'female',
        c: 'ccccccccccccccccc1',
        d: 'ddddddddddddddddd1',
        e: 'eeeeeeeeeeeeeeeee1',
        f: 'fffffffffffffffff1',
        g: 'ggggggggggggggggg1',
        h: 'hhhhhhhhhhhhhhhhh1',
        i: 'iiiiiiiiiiiiiiiii1',
      },
      {
        name: 'jen.he.male',
        sex: 'male',
        c: 'ccccccccccccccccc2',
        d: 'ddddddddddddddddd2',
        e: 'eeeeeeeeeeeeeeeee2',
        f: 'fffffffffffffffff2',
        g: 'ggggggggggggggggg2',
        h: 'hhhhhhhhhhhhhhhhh2',
        i: 'iiiiiiiiiiiiiiiii2',
      },
    ],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 2,
    },
    column: [
      {
        name: 'id',
        label: 'ID',
        inSlot: true,
      },
      {
        name: 'name',
        label: 'Name',
        inSlot: true,
      },
      {
        name: 'sex',
        label: 'Sex',
        align: 'left',
        field: (row: any) => row.sex,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'c',
        label: 'Table4',
        align: 'left',
        field: (row: any) => row.c,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'd',
        label: 'Table5',
        align: 'left',
        field: (row: any) => row.d,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'e',
        label: 'Table6',
        align: 'left',
        field: (row: any) => row.e,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'f',
        label: 'Table7',
        align: 'left',
        field: (row: any) => row.f,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'g',
        label: 'Table8',
        align: 'left',
        field: (row: any) => row.g,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'h',
        label: 'Table9',
        align: 'left',
        field: (row: any) => row.h,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'i',
        label: 'Table10',
        align: 'left',
        field: (row: any) => row.i,
        format: (val: any) => `${defaultFill(val)}`,
      },
      {
        name: 'action',
        label: '$action',
        field: 'action',
        align: 'left',
        inSlot: true,
      },
    ],
  };
  public dialogAddUpdateParams = {
    id: 'dialog_add_update',
    dialogType: 'add',
    clickLoading: false,
    getDataLoading: false,
    visible: false,
    title: '',
    params: cloneDeep(CONST_PARAMS.dialog_add_update),
    input: [
      {
        model: 'a',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: 'Username',
      },
      {
        model: 'b',
        type: 'text',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        classes: 'input-password',
        label: 'New password',
      },
      {
        model: 'c',
        type: 'select',
        selectOption: [
          {
            label: 'option1',
            value: '1',
          },
          {
            label: 'option2',
            value: '2',
          },
        ],
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: 'select',
      },
      {
        model: 'd',
        type: 'multiple-select',
        multiple: true,
        selectOption: [
          {
            label: 'option1',
            value: '1',
          },
          {
            label: 'option2',
            value: '2',
          },
        ],
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: 'Multipl Select',
      },
      {
        model: 'e',
        type: 'date-range',
        required: true,
        label: 'Date',
      },
      {
        model: 'g',
        type: 'date-time-range',
        required: true,
        label: 'Date and time',
      },
      {
        model: 'h',
        type: 'slider',
        min: 0,
        max: 100,
        step: 1,
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: 'slider',
      },
      {
        model: 'i',
        type: 'radio',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        selectOption: [
          {
            label: 'one',
            value: 'true',
          },
          {
            label: 'two',
            value: 'false',
          },
        ],
        label: 'radio',
        disable: false,
      },
      {
        model: 'f',
        type: 'mask-input',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        label: 'Mask Input',
      },
      {
        model: 'j',
        type: 'tree-select',
        rules: [
          (val: string | number | undefined | null) => {
            return (val && String(val).length > 0) || this.globals.$t('messages.required');
          },
        ],
        selectOption: [
          {
            label: 'Open...',
            value: '1',
            children: [],
          },
          {
            label: 'New',
            value: '2',
            children: [],
          },
          {
            label: 'Preferences',
            children: [
              {
                label: 'Submenu Label 1',
                value: '3',
                children: [],
              },
              {
                label: 'Submenu Label 2',
                children: [
                  {
                    label: '3rd level Label 4',
                    children: [],
                    value: '4',
                  },
                  {
                    label: '3rd level Label 5',
                    children: [],
                    value: '5',
                  },
                  {
                    label: '3rd level Label 6',
                    children: [],
                    value: '6',
                  },
                ],
              },
              {
                label: 'Submenu Label 3',
                children: [
                  {
                    label: '3rd level Label 7',
                    children: [],
                    value: '7',
                  },
                  {
                    label: '3rd level Label 8',
                    children: [],
                    value: '8',
                  },
                  {
                    label: '3rd level Label 9',
                    children: [],
                    value: '9',
                  },
                ],
              },
            ],
          },
          {
            label: 'Quit',
            value: '10',
            children: [],
          },
        ],
        label: 'Tree select',
      },
    ],
  };
  public dialogUpload = {
    id: 'dialog-upload-file',
    fileID: 'dialog_upload_file',
    clickLoading: false,
    getDataLoading: false,
    visible: false,
    title: '',
    accept: '.xls,.xlsx,.csv',
    maxFileSize: 1024 * 1024 * 10,
    params: { file: '', fileName: '' },
  };
  public dialogDetailParams = {
    id: 'dialog-upload-file',
    getDataLoading: false,
    clickLoading: false,
    visible: false,
    title: 'Detail',
    params: [
      { label: 'Name', value: '', id: 'name', class: '', inSlot: true },
      {
        label: 'select with edit',
        value: '',
        id: 'sex',
        class: '',
        inSlot: true,
        editType: 'select',
        loading: false,
        inputVisible: false,
        options: [
          {
            label: 'option1',
            value: 'female',
          },
          {
            label: 'option2',
            value: 'male',
          },
        ],
        textToInputConfirm({ value, that }: { value: string; that: any }) {
          console.log(value, that);
          that.inputVisible = false;
          that.value = value;
        },
        textToInputClose({ value, that }: { value: string; that: any }) {
          console.log(value, that);
          that.inputVisible = false;
        },
      },

      {
        label: 'input with edit',
        value: '',
        id: 'c',
        class: '',
        inSlot: true,
        editType: 'input',
        loading: false,
        inputVisible: false,
        textToInputConfirm({ value, that }: { value: string; that: any }) {
          console.log(value, that);
          that.inputVisible = false;
          that.value = value;
        },
        textToInputClose({ value, that }: { value: string; that: any }) {
          console.log(value, that);
          that.inputVisible = false;
        },
      },
      { label: 'D', value: '', id: 'd', class: '' },
      { label: 'E', value: '', id: 'e', class: '' },
      { label: 'F', value: '', id: 'f', class: '' },
      { label: 'g', value: '', id: 'g', class: '' },
      { label: 'h', value: '', id: 'h', class: '' },
      { label: 'I', value: '', id: 'i', class: '' },
    ],
  };

  mounted() {}

  /**event */
  public paginationInput(data: any) {
    this.tableParams.pagination = data;
    this.getData();
  }

  public async handleQuery() {
    this.queryParams.queryLoading = true;
    this.tableParams.pagination.page = 1;
    await this.getData();
    this.queryParams.queryLoading = false;
  }

  public async handleResetQuery() {
    this.queryParams.resetLoading = true;
    this.queryParams.params = cloneDeep(CONST_PARAMS.query);
    this.tableParams.pagination.page = 1;
    await this.getData();
    this.queryParams.resetLoading = false;
  }

  public handleClickCollapse() {
    this.queryParams.allExpand = !this.queryParams.allExpand;
    this.queryParams.input.forEach((item: any) => {
      item.collapse = this.queryParams.allExpand ? false : item.defaultCollapse;
    });
  }

  public handleClickAdd() {
    this.dialogAddUpdateParams.visible = true;
    this.dialogAddUpdateParams.dialogType = 'add';
    this.dialogAddUpdateParams.title = 'Add';
  }

  public handlerClickUpdate(row: any) {
    this.dialogAddUpdateParams.visible = true;
    this.dialogAddUpdateParams.dialogType = 'update';
    this.dialogAddUpdateParams.title = 'Update';
  }

  // ---------文件上传的函数开始---------

  public handleClickUpload() {
    this.dialogUpload.visible = true;
    this.dialogUpload.title = 'Upload';
    this.$nextTick(() => {
      this.$refs[this.dialogUpload.fileID].type = 'text';
      this.dialogUpload.params.fileName = '';
      this.dialogUpload.params.file = '';
      setTimeout(() => {
        this.$refs[this.dialogUpload.fileID].type = 'file';
        this.$refs[this.dialogUpload.fileID].value = '';
      }, 100);
    });
  }

  public handleClickUploadFile() {
    this.$refs[this.dialogUpload.fileID].click();
  }

  // 检查文件类型和大小
  private checkFile(rawFile: any): boolean {
    const fileType = rawFile.name.split('.').pop().toLowerCase();
    const trueType = this.dialogUpload.accept.split(',').map((item: string) => item.trim().replace('.', '').toLowerCase());

    if (!trueType.includes(fileType)) {
      this.$globalMessage.show({
        type: 'error',
        content: 'File type is not supported',
      });
      return false;
    }

    if (rawFile.size > this.dialogUpload.maxFileSize) {
      this.$globalMessage.show({
        type: 'error',
        content: 'File size is too large',
      });
      return false;
    }

    return true;
  }

  // 设置文件参数
  private setFileParams(rawFile: any): void {
    this.dialogUpload.params.fileName = rawFile.name;
    this.dialogUpload.params.file = rawFile;
  }

  // 清理拖拽状态
  private clearDragState(): void {
    const dom: any = document.querySelector('.dialog-upload-form .container .center');
    dom.classList.remove('ondrag');
  }

  // 增加拖拽状态
  private addDragState(): void {
    const dom: any = document.querySelector('.dialog-upload-form .container .center');
    dom.classList.add('ondrag');
  }

  public uploadFileSuccess() {
    const files = this.$refs[this.dialogUpload.fileID].files;
    let postFiles = Array.prototype.slice.call(files).slice(0, 1);

    postFiles.forEach((rawFile: any) => {
      if (this.checkFile(rawFile)) {
        this.setFileParams(rawFile);
      }
    });
  }

  public uploadDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    let postFiles = Array.prototype.slice.call(files).slice(0, 1);

    postFiles.forEach((rawFile: any) => {
      if (this.checkFile(rawFile)) {
        this.setFileParams(rawFile);
      }
      this.clearDragState();
    });
  }

  public uploadDragover(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.addDragState();
  }

  public uploadDragleave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.clearDragState();
  }

  // ---------文件上传的函数结束---------

  public handlerClickDetail(row: any) {
    const arr = cloneDeep(this.dialogDetailParams.params);
    for (let item of arr) {
      for (let key in row) {
        if (item.id === key) {
          item.value = row[key];
        }
      }
    }
    this.dialogDetailParams.params = arr;
    this.dialogDetailParams.visible = true;
  }

  /**http */
  public getData() {
    try {
      this.tableParams.loading = true;
      this.tableParams.loading = false;
    } catch (error) {
      this.tableParams.loading = false;
    } finally {
      return Promise.resolve();
    }
  }

  public async dialogAddUpdateConfirmEvent() {
    try {
      this.dialogAddUpdateParams.clickLoading = true;
      // await HTTP_REQUEST()
      console.log(this.dialogAddUpdateParams.params);
      this.dialogAddUpdateParams.clickLoading = false;
      this.dialogAddUpdateParams.visible = false;
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.getData();
    } catch (error) {
      this.dialogAddUpdateParams.clickLoading = false;
    }
  }

  public async handlerClickDelete(row: any) {
    try {
      console.log(123123);
      const result = await this.$globalConfirm.show({
        title: this.$t('messages.tishi'),
        color: 'primary',
        content: this.$t('messages.areYouSure'),
        confirmButtonText: this.$t('action.yes'),
      });
      if (result) {
        // await HTTP_REQUEST()
        this.$globalMessage.show({
          type: 'success',
          content: this.$t('messages.success'),
        });
        this.getData();
      }
    } catch (error) {}
  }

  public async hanleClickUploadConfirm() {
    try {
      const form = new FormData();
      form.append('file', this.dialogUpload.params.file);
      this.dialogUpload.clickLoading = true;
      // await HTTP_REQUEST()
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      this.dialogUpload.clickLoading = false;
      this.dialogUpload.visible = false;
      this.getData();
    } catch (error) {
      this.dialogUpload.clickLoading = false;
    }
  }
}
</script>
<style lang="scss">
.body--dark {
  .my-table th:last-child,
  .my-table td:last-child {
    box-shadow: rgba($color: #ffffff, $alpha: 0.05) 0px 20px 27px 0px;
  }
}

.body--light {
  .my-table th:last-child,
  .my-table td:last-child {
    box-shadow: rgba($color: #000000, $alpha: 0.05) 0px 20px 27px 0px;
  }
}

.my-table {
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 100%;
}

.my-table thead tr:last-child th:last-child {
  /* bg color is important for th; just specify one */
  background-color: var(--my-white);
}

.my-table td:last-child {
  background-color: var(--my-white);
}

.my-table th:last-child,
.my-table td:last-child {
  position: sticky;
  right: 0;
  z-index: 1;
}
</style>
<style lang="scss" scoped></style>