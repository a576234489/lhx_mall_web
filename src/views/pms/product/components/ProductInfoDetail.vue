<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="value.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandId">
        <el-select
          placeholder="请选择品牌"
          @change="handleBrandChange"
          v-model="value.brandId">
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品介绍：" prop="description">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="value.description"
          :autoSize="true"></el-input>
      </el-form-item>
      <el-form-item label="商品货号：">
        <el-input v-model="value.productSn"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input v-model="value.originalPrice"></el-input>
      </el-form-item>
      <el-form-item label="商品库存：">
        <el-input v-model="value.stock"></el-input>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item label="商品重量：">
        <el-input v-model="value.weight" style="width: 300px"></el-input>
        <span style="margin-left: 20px">克</span>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="value.sort"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchListWithChildren} from "@/api/productCate";
  import {fetchList as fetchBrandList} from "@/api/brand";

  export default {
    name: "ProductInfoDetail",
    props:{
      value:Object,
      isEdit:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return{
        rules:{
          name:[
            {required:true,message:'请输入商品名称',trigger:'blur'},
            {min:2,max:140,message:'长度在2到140个字符',trigger:'blur'},
          ],
          subTitle:[
            {required:true,message:'请输入商品副标题',trigger:'blue'}
          ],
          productCategoryId:[
            {required:true,message:'请选者商品分类',trigger:'blue'}
          ],
          brandId:[
            {required:true,message:'请选者商品品牌',trigger:'blue'}
          ],
          description:[
            {required:true,message:'请输入商品介绍',trigger:'blue'}
          ]
        },
        productCateOptions:[],
        selectProductCateValue:[],
        brandOptions:[],
        hasEditCreated:false
      }
    },
    created() {
      this.getProductCateList();
      this.getBrandList();
    },
    methods:{
      getProductCateList(){
        fetchListWithChildren().then(res=>{
          let list =res.data;
          this.productCateOptions = [];
          list.forEach(item=>{
            let children = [];
            if(item.children != null && item.children.length > 0 ){
              item.children.forEach(res=>{
                children.push({label:res.name,value:res.id})
              })
            }
            this.productCateOptions.push({label:item.name,value:item.id,children:children})
          })
        })
      },
      getBrandList(){
        fetchBrandList({pageNum:1,pageSize:100}).then(res=>{
          this.brandOptions = [];
          let list = res.data.list;
          list.forEach(item=>{
            this.brandOptions.push({label:item.name,value:item.id});
          })
        })
      },
      handleNext(formName){
        this.$refs[formName].validate(valid=>{
          if(valid){
            this.$emit('nextStep')
          }else{
            this.$message({
              message:"验证失败",
              type:"error",
              duration:1000
            })
            return false
          }
        })
      },
      handleBrandChange(val){
        let brandName = '';
        this.brandOptions.forEach(item=>{
          if(item.value == val){
            brandName = item.label;
          }
        })
        this.value.brandName = brandName;
      },
      getCateNameById(cateId){
        console.log(cateId)
        let name = null;
        this.productCateOptions.forEach(item=>{
          if(item.children != null && item.children.length > 0){
            item.children.forEach(item=>{
              if(item.value == cateId){
                name = item.label;
              }
            })
          }
        })
        return name;
      },
      handleEditCreated(){
        if(this.value.productCategoryId != null){
          console.log( this.selectProductCateValue);
          this.selectProductCateValue = []
          this.selectProductCateValue.splice(0,0,this.value.cateParentId)
          this.selectProductCateValue.splice(1,0,this.value.productCategoryId)
          // this.selectProductCateValue.push(this.value.cateParentId);
          // this.selectProductCateValue.push(this.value.productCategoryId);
          console.log( this.selectProductCateValue);
        }
      }
    },
    watch:{
      selectProductCateValue(newValue){
        if(newValue != null && newValue.length == 2){
          this.value.productCategoryId = newValue[1];
          this.value.productCategoryName = this.getCateNameById(this.value.productCategoryId)
        }else{
          this.value.productCategoryId = null;
          this.value.productCategoryName = null;
        }
      },
      productId(newValue){
        if(!this.isEdit)return;
        if(this.hasEditCreated)return;
        if(newValue == undefined || newValue == null || newValue == 0)return;
        this.handleEditCreated();
      }
    },
    computed:{
      productId(){
        return this.value.id;
      }
    }
  }
</script>

<style scoped>

</style>