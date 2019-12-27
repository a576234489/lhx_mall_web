<template>
  <div>
    <div style="margin-top: 50px">
      <el-form :model="value" ref="productSaleForm" label-width="120px" style="width: 600px" size="small">
        <el-form-item label="赠送积分：">
          <el-input v-model="value.giftPoint"></el-input>
        </el-form-item>
        <el-form-item label="赠送成长值：">
          <el-input v-model="value.giftGrowth"></el-input>
        </el-form-item>
        <el-form-item label="积分购买限制：">
          <el-input v-model="value.usePointLimit"></el-input>
        </el-form-item>
        <el-form-item label="预告商品：">
          <el-switch
                  v-model="value.previewStatus"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="商品上架：">
          <el-switch
                  v-model="value.publishStatus"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="商品推荐：">
          <span style="margin-right: 10px">新品</span>
          <el-switch
                  v-model="value.newStatus"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
          <span style="margin-left: 10px;margin-right: 10px">推荐</span>
          <el-switch
                  v-model="value.recommandStatus"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="服务保证：">
          <el-checkbox-group v-model="selectServiceList">
            <el-checkbox :label="1">无忧退货</el-checkbox>
            <el-checkbox :label="2">快速退款</el-checkbox>
            <el-checkbox :label="3">免费包邮</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="详细页标题：">
          <el-input v-model="value.detailTitle"></el-input>
        </el-form-item>
        <el-form-item label="详细页描述：">
          <el-input v-model="value.detailDesc"></el-input>
        </el-form-item>
        <el-form-item label="商品关键字：">
          <el-input v-model="value.keywords"></el-input>
        </el-form-item>
        <el-form-item label="商品备注：">
          <el-input v-model="value.note" type="textarea" :autoSize="true"></el-input>
        </el-form-item>
        <el-form-item label="选择优惠方式：">
          <el-radio-group v-model="value.promotionType" size="small">
            <el-radio-button :label="0">无优惠</el-radio-button>
            <el-radio-button :label="1">特惠促销</el-radio-button>
            <el-radio-button :label="2">会员价格</el-radio-button>
            <el-radio-button :label="3">阶梯价格</el-radio-button>
            <el-radio-button :label="4">满减价格</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="value.promotionType===1">
          <div>
            开始时间：
            <el-date-picker
                    v-model="value.promotionStartTime"
                    value-format="timestamp"
                    type="datetime"
                    :picker-options="pickerOptions1"
                    placeholder="选择开始时间">
            </el-date-picker>
          </div>
          <div class="littleMargin">
            结束时间：
            <el-date-picker
                    v-model="value.promotionEndTime"
                    value-format="timestamp"
                    type="datetime"
                    :picker-options="pickerOptions1"
                    placeholder="选择结束时间">
            </el-date-picker>
          </div>
          <div class="littleMargin">
            促销价格：
            <el-input style="width: 220px" v-model="value.promotionPrice" placeholder="输入促销价格"></el-input>
          </div>

        </el-form-item>
        <el-form-item v-show="value.promotionType===2">
          <div v-for="(item, index) in value.memberPriceList" :class="{littleMargin:index!==0}">
            {{item.memberLevelName}}：
            <el-input v-model="item.memberPrice" style="width: 200px"></el-input>
          </div>
        </el-form-item>
        <el-form-item v-show="value.promotionType===3">
          <el-table :data="value.productLadderList"
                    style="width: 80%" border>
            <el-table-column
                    label="数量"
                    align="center"
                    width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.count"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                    label="折扣"
                    align="center"
                    width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.discount"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
                <el-button type="text" @click="handleAddProductLadder(scope.$index, scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-show="value.promotionType===4">
          <el-table :data="value.productFullReductionList"
                    style="width: 80%" border>
            <el-table-column
                    label="满"
                    align="center"
                    width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fullPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                    label="立减"
                    align="center"
                    width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.reducePrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleRemoveFullReduction(scope.$index, scope.row)">删除</el-button>
                <el-button type="text" @click="handleAddFullReduction(scope.$index, scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
          <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "productSaleDetail",
    props:{
      value:Object
    },
    computed:{
      selectServiceList:{
        get(){
          let list = [];
          //console.log(this.value);
          //console.log(this.value.serviceIds);
          //if (this.value.serviceIds === undefined || this.value.serviceIds == null || this.value.serviceIds === '') return list;
          if(this.value.serviceIds == undefined || this.value.serviceIds == null || this.value.serviceIds == '')return list;
          console.log(this.value.serviceIds);
          let ids = this.value.serviceIds.split(',');
          list = ids.map(item=>{
            return Number(item);
          })
          return list;
        },
        set(newValue){
          let serviceIds = '';
          if(newValue != null && newValue.length > 0){
            newValue.forEach(item=>{
              serviceIds += item + ','
            })
          }
          if(serviceIds.endsWith(',')){
            serviceIds.substr(0,serviceIds.length - 1);
          }
          return serviceIds;
        }
      }
    },
    data(){
      return {
        pickerOptions1:{
          disabledDate(time){
            return time < Date.now();
          }
        }
      }
    },
    methods:{
      handleRemoveProductLadder(index,row){
        if(this.value.productLadderList.length == 1){
          this.value.productLadderList.pop();
          this.value.productLadderList.push({
            count:0,
            discount: 0,
            price:0
          })
        }else {
          this.value.productLadderList.splice(index,1);
        }
      },
      handleAddProductLadder(index,row){
        if(this.value.productLadderList.length < 3){
            this.value.productLadderList.push({
            count: 0,
            discount:0,
            price:0
          })
        }else {
          this.$message({
            message:'最多添加三条',
            type:'warning',
          })
        }
      },
      handleRemoveFullReduction(index,row){
        console.log(this.value.fullReductionList);
        if(this.value.productFullReductionList.length == 1){
          this.value.productFullReductionList.pop();
          this.value.productFullReductionList.push({
            count:0,
            discount: 0,
            price:0
          })
        }else {
          this.value.productFullReductionList.splice(index,1);
        }
      },
      handleAddFullReduction(index,row){
        if(this.value.productFullReductionList.length < 3){
          this.value.productFullReductionList.push({
            count: 0,
            discount:0,
            price:0
          })
        }else {
          this.$message({
            message:'最多添加三条',
            type:'warning',
          })
        }
      },
      handlePrev(){
        this.$emit('prevStep');
      },
      handleNext(){
        this.$emit('nextStep');
      }
    }
  }
</script>

<style scoped>

</style>