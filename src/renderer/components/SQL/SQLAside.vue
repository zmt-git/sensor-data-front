<!--
 * @Description: 表列表
 * @Author: zmt
 * @Date: 2021-09-29 09:00:03
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-29 15:30:34
-->
<template>
  <ul class="d-sql-aside" id="sqlAside">
    <li class="d-sql-aside-li" :class="item === current ? 'active' : ''" v-for="item in list" :key="item.name" @click="onClick(item)">
      <base-svg-icon iconName="icon-biaoge" font-size="14px"></base-svg-icon>
      <span class="d-sql-aside-li__name">{{item}}</span>
      </li>
    <div class="d-sql-aside-resize" id="resize"></div>
  </ul>
</template>

<script>
import BaseSvgIcon from '../BaseSvgIcon.vue'
export default {
  components: { BaseSvgIcon },
  name: 'd-sql-aside',

  props: {
    list: {
      type: Array,
      default: () => {}
    },
    current: {
      type: String,
      default: ''
    }
  },

  methods: {
    // 表切换
    onClick (item) {
      this.$emit('onClick', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/handle.scss';

.d-sql-aside{
  min-width: 80px;
  max-width: 200px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 5px;
  &-li{
    padding: 5px 10px;
    cursor: pointer;
    @include color('sql-aside-color');
    border-radius: 5px;
    transition: all 0.3s;
    margin-bottom: 5px;
    &__name{
      margin-left: 5px;
      font-size: 13px;
    }
  }
  &-li:hover{
    @include bg-color('sql-aside-active');
  }
  &-resize{
    position: absolute;
    right: 0;
    top: 0;
    content: '';
    display: block;
    width: 9px;
    height: 100%;
    cursor: col-resize;
  }
}
.active{
  @include color('primary');
  @include bg-color('sql-aside-active');
}
</style>
