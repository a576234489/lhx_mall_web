<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="属性类型：">
        <el-select v-model="value.productAttributeCategoryId"
                   placeholder="请选择属性类型"
                   @change="handleProductAttrChange">
          <el-option
                  v-for="item in productAttributeCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr,idx) in selectProductAttr">
            {{productAttr.name}}：
            <!-- 商品规格不支持手动添加的情况-->
            <el-checkbox-group v-if="productAttr.handAddStatus===0" v-model="selectProductAttr[idx].values">
              <el-checkbox v-for="item in getInputListArr(productAttr.inputList)" :label="item" :key="item"
                           class="littleMarginLeft"></el-checkbox>
            </el-checkbox-group>
            <!-- 商品规格支持手动添加的情况 取得是用户手动添加的规格值 不会取固有值中的inpuList中的规格值（个人感觉应该集成两个一起）-->
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <div v-for="(item,index) in getHandInputListArr(idx,selectProductAttr[idx].options)" style="display: inline-block"
                     class="littleMarginLeft">

                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx,index)">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input v-model="addProductAttrValue" style="width: 160px;margin-left: 10px" clearable></el-input>
              <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
            </div>
          </div>
        </el-card>
        <el-table style="width: 100%;margin-top: 20px"
                  :data="value.skuStockList"
                  border>
          <el-table-column
                  v-for="(item,index) in selectProductAttr"
                  :label="item.name"
                  :key="item.id"
                  align="center">
            <template slot-scope="scope">
              {{getProductSkuSp(scope.row,index)}}
            </template>
          </el-table-column>
          <el-table-column
                  label="销售价格"
                  width="80"
                  align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  label="商品库存"
                  width="80"
                  align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  label="库存预警值"
                  width="80"
                  align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  label="SKU编号"
                  align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  label="操作"
                  width="80"
                  align="center">
            <template slot-scope="scope">
              <el-button
                      type="text"
                      @click="handleRemoveProductSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
                type="primary"
                style="margin-top: 20px"
                @click="handleRefreshProductSkuList">刷新列表
        </el-button>
        <el-button
                type="primary"
                style="margin-top: 20px"
                @click="handleSyncProductSkuPrice">同步价格
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in selectProductAttrPics">
            <span>{{item.name}}:</span>
            <single-upload v-model="item.pic"
                           style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in selectProductParam" :class="{littleMarginTop:index!==0}">
            <div class="paramInputLabel">{{item.name}}:</div>
            <!--属性录入方式：0->手工录入；1->从列表中选取 -->
            <el-select v-if="item.inputType===1" class="paramInput" v-model="selectProductParam[index].value">
              <el-option
                      v-for="item in getParamInputList(item.inputList)"
                      :key="item"
                      :label="item"
                      :value="item">
              </el-option>
            </el-select>
            <el-input v-else class="paramInput" v-model="selectProductParam[index].value"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="595" :height="300" v-model="value.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="595" :height="300" v-model="value.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，选择商品关联</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchList as fetchProductAttrCateList} from '@/api/productAttrCate';
  import {fetchList as fetchProductAttrList} from '@/api/productAttr'
  import MultiUpload from '@/components/Upload/multiUpload';
  import SingleUpload from '@/components/Upload/singleUpload'
  import Tinymce from '@/components/Tinymce'
  export default {
    name: "ProductAttrDetail",
    props:{
      value:Object,
      isEdit:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return{
        productAttributeCategoryOptions:[],
        hasEditCreated:false,
        //选则的商品的属性
        selectProductAttr:[],
        //选择的商品对应的不同规格的图片
        selectProductAttrPics:[],
        //选择的商品的参数
        selectProductParam:[],
        //可手动添加的商品属性
        addProductAttrValue: '',
        //商品富文本详情激活类型
        activeHtmlName: 'pc',
      }
    },
    created() {
      this.getProductAttrCateList()
    },
    methods:{
      handleEditCreated() {
        //根据商品属性分类id获取属性和参数
        if(this.value.productAttributeCategoryId!=null){
          this.handleProductAttrChange(this.value.productAttributeCategoryId);
        }
        this.hasEditCreated=true;
      },
      getProductAttrCateList() {
        let param = {pageNum: 1, pageSize: 100};
        fetchProductAttrCateList(param).then(response => {
          this.productAttributeCategoryOptions = [];
          let list = response.data.list;
          for (let i = 0; i < list.length; i++) {
            this.productAttributeCategoryOptions.push({label: list[i].name, value: list[i].id});
          }
        });
      },
      getProductAttrList(type, cid) {
        let param = {pageNum: 1, pageSize: 100, type: type};
        fetchProductAttrList(cid, param).then(response => {
          let list = response.data.list;//获取到当前商品的固定规格和参数
          if (type === 0) {//获取规格
            this.selectProductAttr = [];//产品的规格值集合（规定产品的规格值最多有三项）
            for (let i = 0; i < list.length; i++) {
              let options = [];
              let values = [];
              if (this.isEdit) {
                if (list[i].handAddStatus === 1) {//支持手动新增
                  //编辑状态下获取 每条规格值用户手动添加的值（对应字段inputList）
                  options = this.getEditAttrOptions(list[i].id);
                }
                //编辑状态下获取 每条规格值用户已经选中过的规格值
                values = this.getEditAttrValues(i);
              }
              this.selectProductAttr.push({
                id: list[i].id,//产品对应规格记录的的id
                name: list[i].name,//产品对应规格记录的的名称
                handAddStatus: list[i].handAddStatus,//规格值选项是否支持手动添加
                inputList: list[i].inputList,//产品规格值固有的选项
                values: values,//产品规格值中用户选择过的规格值项
                options: options//用户手动添加的规格值项
              });
            }
            if(this.isEdit){
              //编辑模式下 获取第一条规格记录,用户选择过的规格值对应的图片集合
              this.refreshProductAttrPics();
            }
          } else {
            this.selectProductParam = [];
            for (let i = 0; i < list.length; i++) {
              let value=null;
              if(this.isEdit){
                //编辑模式下 获取参数时,在productAttributeValue与规格记录id对应的value指的就是用户选中的参数(区别规格项:在规格项中,该数据指的是用户手动添加的规格项,真正的用户选中的规格值保存在skustock中,第一条规格记录对应得sp1，第二天规格记录对应的sp2，其他规格记录都对应的sp3)
                value= this.getEditParamValue(list[i].id);
              }
              this.selectProductParam.push({
                id: list[i].id,//产品对应得参数id
                name: list[i].name,//产品对应参数的的名称
                value: value,//用户选中的参数值
                inputType: list[i].inputType,//属性录入方式：0->手工录入；1->从列表中选取
                inputList: list[i].inputList//参数名称对应的参数列表
              });
            }
          }
        });
      },
      //获取设置的可手动添加属性值
      getEditAttrOptions(id) {
        let options = [];
        for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
          let attrValue = this.value.productAttributeValueList[i];//此时新增自定义参数或规格的productId已确定
          console.log(1111111111111)
          console.log(attrValue)
          if (attrValue.productAttributeId === id) {
            let strArr = attrValue.value.split(',');
            for (let j = 0; j < strArr.length; j++) {
              options.push(strArr[j]);
            }
            break;
          }
        }
        return options;
      },
      //获取选中的属性值
      getEditAttrValues(index) {
        let values = [];
        if (index === 0) {
          for (let i = 0; i < this.value.skuStockList.length; i++) {//某个产品的规格项数量 = 库存中每条记录的规格值数量（例如：一个产品对应三条规格值记录,产品库存中的sp1,sp2,sp3就都会有值）
            let sku = this.value.skuStockList[i];
            if (sku.sp1 != null && values.indexOf(sku.sp1) === -1) {
              values.push(sku.sp1);
            }
          }
        } else if (index === 1) {
          for (let i = 0; i < this.value.skuStockList.length; i++) {
            let sku = this.value.skuStockList[i];
            if (sku.sp2 != null && values.indexOf(sku.sp2) === -1) {
              values.push(sku.sp2);
            }
          }
        } else {
          for (let i = 0; i < this.value.skuStockList.length; i++) {
            let sku = this.value.skuStockList[i];
            if (sku.sp3 != null && values.indexOf(sku.sp3) === -1) {
              values.push(sku.sp3);
            }
          }
        }
        return values;
      },
      //获取属性的值
      getEditParamValue(id){
        for(let i=0;i<this.value.productAttributeValueList.length;i++){
          if(id===this.value.productAttributeValueList[i].productAttributeId){
            return this.value.productAttributeValueList[i].value;
          }
        }
      },
      handleProductAttrChange(value) {
        this.getProductAttrList(0, value);
        this.getProductAttrList(1, value);
      },
      getInputListArr(inputList) {
        return inputList.split(',');
      },
      getHandInputListArr(idx,options){
        // console.log(idx);
        // console.log(options);
        // console.log(this.selectProductAttr[idx].inputList);
        let list = this.selectProductAttr[idx].inputList.split(',');
       // let arr = [11,22,33]
       // console.log([...list,...arr]);
        //return list
        return [...list,...options];
      },
      handleAddProductAttrValue(idx) {
        let options = this.selectProductAttr[idx].options;
        if (this.addProductAttrValue == null || this.addProductAttrValue == '') {
          this.$message({
            message: '属性值不能为空',
            type: 'warning',
            duration: 1000
          });
          return
        }
        if (options.indexOf(this.addProductAttrValue) !== -1) {
          this.$message({
            message: '属性值不能重复',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.selectProductAttr[idx].options.push(this.addProductAttrValue);
        this.addProductAttrValue = null;
      },
      handleRemoveProductAttrValue(idx, index) {
        this.selectProductAttr[idx].options.splice(index, 1);
      },
      getProductSkuSp(row, index) {
        if (index === 0) {
          return row.sp1;
        } else if (index === 1) {
          return row.sp2;
        } else {
          return row.sp3;
        }
      },
      handleRefreshProductSkuList() {
        this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.refreshProductAttrPics();
          this.refreshProductSkuList();
        });
      },
      handleSyncProductSkuPrice(){
        this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.value.skuStockList!==null&&this.value.skuStockList.length>0){
            let price=this.value.skuStockList[0].price;
            for(let i=0;i<this.value.skuStockList.length;i++){
              this.value.skuStockList[i].price=price;
            }
          }
        });
      },
      refreshProductSkuList() {
        this.value.skuStockList = [];
        let skuList = this.value.skuStockList;
        //只有一个属性时
        if (this.selectProductAttr.length === 1) {
          let values = this.selectProductAttr[0].values;
          for (let i = 0; i < values.length; i++) {
            skuList.push({
              sp1: values[i]
            });
          }
        } else if (this.selectProductAttr.length === 2) {
          let values0 = this.selectProductAttr[0].values;
          let values1 = this.selectProductAttr[1].values;
          for (let i = 0; i < values0.length; i++) {
            if (values1.length === 0) {
              skuList.push({
                sp1: values0[i]
              });
              continue;
            }
            for (let j = 0; j < values1.length; j++) {
              skuList.push({
                sp1: values0[i],
                sp2: values1[j]
              });
            }
          }
        } else {
          let values0 = this.selectProductAttr[0].values;
          let values1 = this.selectProductAttr[1].values;
          let values2 = this.selectProductAttr[2].values;
          for (let i = 0; i < values0.length; i++) {
            if (values1.length === 0) {
              skuList.push({
                sp1: values0[i]
              });
              continue;
            }
            for (let j = 0; j < values1.length; j++) {
              if (values2.length === 0) {
                skuList.push({
                  sp1: values0[i],
                  sp2: values1[j]
                });
                continue;
              }
              for (let k = 0; k < values2.length; k++) {
                skuList.push({
                  sp1: values0[i],
                  sp2: values1[j],
                  sp3: values2[k]
                });
              }
            }
          }
        }
      },
      refreshProductAttrPics() {
        this.selectProductAttrPics = [];//产品对用的第一条规格记录,该规格记录用户选择过的规格所对应的图片
        if (this.selectProductAttr.length >= 1) {
          let values = this.selectProductAttr[0].values;//如果产品存在至少一条规格记录,获取该条记录用户选中过的规格值集合,对应产品库存中sp1
          for (let i = 0; i < values.length; i++) {
            let pic=null;
            if(this.isEdit){
              //编辑状态下获取图片
              pic=this.getProductSkuPic(values[i]);
            }
            this.selectProductAttrPics.push({name: values[i], pic: pic})
          }
        }
      },
      //获取商品相关属性的图片
      getProductSkuPic(name){
        for(let i=0;i<this.value.skuStockList.length;i++){
          if(name===this.value.skuStockList[i].sp1){
            return this.value.skuStockList[i].pic;
          }
        }
        return null;
      },
      //合并商品属性
      mergeProductAttrValue() {
        this.value.productAttributeValueList = [];
        for (let i = 0; i < this.selectProductAttr.length; i++) {
          let attr = this.selectProductAttr[i];
          if (attr.handAddStatus === 1 && attr.options != null && attr.options.length > 0) {
            this.value.productAttributeValueList.push({
              productAttributeId: attr.id,
              value: this.getOptionStr(attr.options)
            });
          }
        }
        for (let i = 0; i < this.selectProductParam.length; i++) {
          let param = this.selectProductParam[i];
          this.value.productAttributeValueList.push({
            productAttributeId: param.id,
            value: param.value
          });
        }
      },
      //合并商品属性图片
      mergeProductAttrPics() {
        for (let i = 0; i < this.selectProductAttrPics.length; i++) {
          for (let j = 0; j < this.value.skuStockList.length; j++) {
            if (this.value.skuStockList[j].sp1 === this.selectProductAttrPics[i].name) {
              this.value.skuStockList[j].pic = this.selectProductAttrPics[i].pic;
            }
          }
        }
      },
      getOptionStr(arr) {
        let str = '';
        for (let i = 0; i < arr.length; i++) {
          str += arr[i];
          if (i != arr.length - 1) {
            str += ',';
          }
        }
        return str;
      },
      handleRemoveProductSku(index, row) {
        let list = this.value.skuStockList;
        if (list.length === 1) {
          list.pop();
        } else {
          list.splice(index, 1);
        }
      },
      getParamInputList(inputList) {
        return inputList.split(',');
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        this.mergeProductAttrValue();
        this.mergeProductAttrPics();
        this.$emit('nextStep')
      }
    },
    computed:{
      productId(){
        return this.value.id;
      },
      hasAttrPic() {
        if (this.selectProductAttrPics.length < 1) {
          return false;
        }
        return true;
      },
      //商品的主图和画册图片
      selectProductPics:{
        get:function () {
          let pics=[];
          if(this.value.pic===undefined||this.value.pic==null||this.value.pic===''){
            return pics;
          }
          pics.push(this.value.pic);
          if(this.value.albumPics===undefined||this.value.albumPics==null||this.value.albumPics===''){
            return pics;
          }
          let albumPics = this.value.albumPics.split(',');
          for(let i=0;i<albumPics.length;i++){
            pics.push(albumPics[i]);
          }
          return pics;
        },
        set:function (newValue) {
          if (newValue == null || newValue.length === 0) {
            this.value.pic = null;
            this.value.albumPics = null;
          } else {
            this.value.pic = newValue[0];
            this.value.albumPics = '';
            if (newValue.length > 1) {
              for (let i = 1; i < newValue.length; i++) {
                this.value.albumPics += newValue[i];
                if (i !== newValue.length - 1) {
                  this.value.albumPics += ',';
                }
              }
            }
          }
        }
      }
    },
    watch:{
      productId(newValue){
        if(!this.isEdit) return;
        if(this.hasEditCreated) return
        if(newValue == undefined || newValue == null || newValue == 0) return;
        this.handleEditCreated();
      }
    },
    components:{
      MultiUpload,
      Tinymce,
      SingleUpload
    }
  }
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    background: #F8F9FC;
  }
</style>