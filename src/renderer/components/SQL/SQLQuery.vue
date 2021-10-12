<!--
 * @Description: sql询问
 * @Author: zmt
 * @Date: 2021-09-29 08:44:43
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 15:26:00
-->
<template>
  <div class="d-sql-query">
    <ul class='d-sql-query-tabs'>
      <li class="tab-active" v-for="item in tabs" :key="item.id" @click='handleClick(item)'>{{item.title}}</li>
    </ul>
    <el-input :disabled='disabled' class="d-sql-query-input" :autofocus='true' :rows="3" :value="value" @input="onInput" type="textarea"></el-input>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'd-tab-content',
  props: {
    tabs: {
      type: Array,
      default: () => ([
        { title: '询问' }
      ])
    },
    value: {
      default: null
    }
  },

  computed: {
    ...mapGetters(['currentTableName']),
    disabled () {
      return !this.currentTableName
    }
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  methods: {
    handleClick (item) {
      this.$emit('onClick', item)
    },
    onInput (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/handle.scss';
.d-sql-query{
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f0f0f0;
  &-tabs{
    @include bg-color('sql-query');
    height: 40px;
    display: flex;
    align-items: flex-end;
    border-bottom: 1px solid #f0f0f0;
    & li{
      cursor: pointer;
      position: relative;
      bottom:-1px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #f0f0f0;
      border-bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      font-size: 13px;
      @include color('color');
      user-select: none;
    }
  }
  &-input{
    flex: 1;
    /deep/ .el-textarea__inner{
      border: 0;
    }
  }
}
.tab-active{
  @include bg-color('sql-query-active');
}
</style>
