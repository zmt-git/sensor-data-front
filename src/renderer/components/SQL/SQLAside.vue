<!--
 * @Description: 表列表
 * @Author: zmt
 * @Date: 2021-09-29 09:00:03
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-04 15:34:36
-->
<template>
  <div class="container" v-loading='loading'>
    <ul class="d-sql-aside" id="sqlAside">
      <li class="d-sql-aside-li" :title="item" :class="item === current ? 'active' : ''" v-for="item in list" :key="item.name" @click="onClick(item)">
        <base-svg-icon class="d-sql-aside-li__icon" iconName="icon-biaoge" font-size="14px"></base-svg-icon>
        <span class="d-sql-aside-li__name">{{item}}</span>
      </li>
    </ul>
    <div class="d-sql-aside-resize" id="resize">::</div>
  </div>
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
    },
    loading: {
      type: Boolean,
      default: false
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
.container{
  position: relative;
  overflow: hidden;
}
.d-sql-aside{
  height: 100%;
  overflow: auto;
  min-width: 80px;
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
    display: flex;
    align-items: center;
    &__name{
      flex-shrink: 0;
      margin-left: 5px;
      font-size: 13px;
    }
    &__icon{
      flex-shrink: 0;
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
    width: 5px;
    height: 100%;
    cursor: col-resize;
    background-color: #90939917;
    display: flex;
    align-items: center;
    color: #9093997a;
  }
}
.active{
  @include color('primary');
  @include bg-color('sql-aside-active');
}
</style>
