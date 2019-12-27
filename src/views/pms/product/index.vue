<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
                style="float: right"
                type="primary"
                size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          type="primary"
          size="small"
          @click="handleResetSearch()">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true"  size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              v-model="selectProductCateValue"
              :options="productCateOptions"
              clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select  placeholder="请选择品牌" v-model="listQuery.brandId" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select  placeholder="全部" v-model="listQuery.publishStatus" clearable>
              <el-option
                v-for="item in publishStatusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select  placeholder="全部" v-model="listQuery.verifyStatus" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
              class="btn-add"
              size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>品牌：{{scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                v-model="scope.row.publishStatus"
                :active-value="1"
                :inactive-value="0"
                @change="handlePublishStatusChange(scope.$index,scope.row)">
              </el-switch>
            </p>
            <p>新品：
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.newStatus"
                @change="handleNewStatusChange(scope.$index,scope.row)"
               >
              </el-switch>
            </p>
            <p>推荐：
              <el-switch
                v-model="scope.row.recommandStatus"
                :active-value="1"
                :inactive-value="0"
                @change="handleRecommandChange(scope.$index,scope.row)">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index,scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.verifyStatus | verifyStatusFilter}}</p>
            <p>
              <el-button type="text"
                @click="handleShowVerifyDetail(scope.$index,scope.row)">审核详情
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini"
                @click="handleShowProduct(scope.$index,scope.row)">
                查看
              </el-button>
              <el-button size="mini"
                @click="handleUpdateProduct(scope.$index,scope.row)">
                编辑
              </el-button>
            </p>
            <p>
              <el-button
                      size="mini"
                      >日志
              </el-button>
              <el-button
                      size="mini"
                      type="danger"
                      >删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
            title="编辑货品信息"
            :visible.sync="editSkuInfo.dialogVisible"
            width="40%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku()"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px"
                :data="editSkuInfo.stockList"
                border>
        <el-table-column
                label="SKU编号"
                align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column
                v-for="(item,index) in editSkuInfo.productAttr"
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
                width="100"
                align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList,updatePublishStatus,updateNewStatus,updateRecommandStatus} from "@/api/product";
  import {fetchList as fetchProductAttrList} from "@/api/productAttr";
  import {fetchList as fetchSkuStoreList,update as updateSkuStockList} from "@/api/skuStock"
  import {fetchList as fetchBrandList} from "@/api/brand";
  import {fetchListWithChildren} from "@/api/productCate"
  const defaultListQuery = {
    keyword:'',
    pageNum:1,
    pageSize:5,
    publishStatus:null,
    verifyStatus:null,
    productSn:null,
    productCategoryId:null,
    brandId:null,
  }

  export default {
    name: "index",
    data(){
      return{
        listLoading:true,
        listQuery:Object.assign({},defaultListQuery),
        list:null,
        total:null,
        brandOptions:[],
        productCateOptions:[],
        selectProductCateValue:null,
        publishStatusOption:[
          {
            value:1,
            label:'商品上架'
          },
          {
            value:0,
            label:'商品下架'
          }
        ],
        verifyStatusOptions:[
          {
            value:1,
            label:"审核通过",
          },
          {
            value:0,
            label:'未审核'
          }
        ],
        editSkuInfo:{
          dialogVisible:false,
          productId:null,
          productSn:null,
          productAttributeCategoryId:null,
          stockList:[],
          productAttr:[],
          keyword:null
        }
      }
    },
    created() {
      this.getList();
      this.getBrandList();
      this.getProductCateList();
    },
    methods:{
      getList(){
        this.listLoading = true;
        fetchList(this.listQuery).then(res=>{
          this.listLoading = false;
          this.list = res.data.list;
          this.total = res.data.total;
        })
      },
      getBrandList(){
        fetchBrandList({pageNum: 1,pageSize: 100}).then(res=>{
          this.brandOptions = [];
          let brandList = res.data.list;
          brandList.forEach(item=>{
            this.brandOptions.push({label:item.name,value:item.id});
          })
        })
      },
      getProductCateList(){
        fetchListWithChildren().then(res => {
          let list = res.data;
          this.productCateOptions = [];
          list.forEach(item => {
            let children = [];
            if(item.children != null && item.children.length > 0){
              item.children.forEach(item => {
                children.push({label: item.name,value:item.id});
              })
            }
            this.productCateOptions.push({label:item.name,value:item.id,children:children})
          })
          console.log(this.productCateOptions)
        })
      },
      handleResetSearch(){
        this.productCateOptions = [];
        this.listQuery = Object.assign({},defaultListQuery);
      },
      handlePublishStatusChange(index,row){
        console.log(index,row);
        let ids = [];
        ids.push(row.id);
        this.updatePublishStatus(row.publishStatus,ids)
      },
      updatePublishStatus(publishStatus,ids){
        let params = new URLSearchParams();
        params.append("ids",ids);
        params.append("publishStatus",publishStatus);
        updatePublishStatus(params).then(res=>{
          this.$message({
            message:"修改成功",
            type:"success",
            duration:1000
          })
        })
      },
      handleNewStatusChange(index,row){
        let ids = [];
        ids.push(row.id);
        this.updateNewStatus(row.newStatus,ids);
      },
      updateNewStatus(newStatus,ids){
        let params = new URLSearchParams();
        params.append("ids",ids);
        params.append("newStatus",newStatus);
        updateNewStatus(params).then(res=>{
          this.$message({
            message:"修改成功",
            type:"success",
            duration:1000
          })
        })
      },
      handleRecommandChange(index,row){
        let ids = [];
        ids.push(row.id);
        this.updateRecommandStatus(row.recommandStatus,ids)
      },
      updateRecommandStatus(recommandStatus,ids){
        let params = new URLSearchParams;
        params.append("ids",ids);
        params.append("recommandStatus",recommandStatus);
        updateRecommandStatus(params).then(res=>{
          this.$message({
            message:"修改成功",
            type:"success",
            duration:1000
          })
        })
      },
      handleShowSkuEditDialog(index,row){
        this.editSkuInfo.dialogVisible = true;
        this.editSkuInfo.productId = row.id;
        this.editSkuInfo.productSn = row.productSn;
        this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
        this.editSkuInfo.keyword = null;
        fetchSkuStoreList(row.id,{keyword:this.editSkuInfo.keyword}).then(res=>{
          this.editSkuInfo.stockList = res.data;
        })
        if(row.productCategoryId != null) {
          fetchProductAttrList(row.productAttributeCategoryId,{type:0}).then(res=>{
          this.editSkuInfo.productAttr = res.data.list;
          })
        }
      },
      getProductSkuSp(row,index){
        if(index == 0 ){
          return row.sp1;
        }else if(index == 1){
          return row.sp2;
        }else{
          return row.sp3;
        }
      },
      handleSearchEditSku(){
        fetchSkuStoreList(this.editSkuInfo.productId,{keyword:this.editSkuInfo.keyword}).then(res=>{
          this.editSkuInfo.stockList = res.data;
        })
      },
      handleEditSkuConfirm(){
        if(this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0){
          this.$message({
            message:"暂无sku信息",
            type:"warning",
            duration:1000
          })
          return
        }
        this.$confirm('是否要进行修改','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(res=>{
          updateSkuStockList(this.editSkuInfo.productId,this.editSkuInfo.stockList).then(res=>{
            this.$message({
              message:"修改成功",
              type:"success",
              duration:1000
            })
            this.editSkuInfo.dialogVisible = false;
          })
        })
      },
      handleShowVerifyDetail(index,row){
        console.log("handleShowVerifyDetail",row);
      },
      handleShowProduct(index,row){
        console.log("handleShowProduct",row);
      },
      handleUpdateProduct(index,row){
        this.$router.push({path:'/pms/updateProduct',query:{id:row.id}})
      }
    },
    filters:{
      verifyStatusFilter(value){
        if(value == 1){
          return "审核通过"
        }else{
          return "未审核"
        }
      }
    }

  }
</script>

<style scoped>

</style>