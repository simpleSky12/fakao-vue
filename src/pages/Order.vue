<template>
    <div class="order">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <i class="el-icon-s-order"></i>
                    订单列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="mgb20 handle-box">
                <el-input class="handle-input mr10"
                          v-model="query.name"
                          @keyup.enter.native="handleSearch"
                          placeholder="搜索课程名称"></el-input>
                <el-button type="primary"
                           @click="handleSearch"
                           icon="el-icon-search">搜索
                </el-button>
            </div>
            <el-table class="table" ref="multipleTable"
                      border :data="tableData"
                      header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="orderNo" label="订单编号" align="center"></el-table-column>
                <el-table-column prop="username" label="购买用户" align="center"></el-table-column>
                <el-table-column prop="productName" label="课程名称" width="120" align="center"></el-table-column>
                <el-table-column label="课程简介图" align="center">
                    <template slot-scope="scope">
                        <el-image class="productImg"
                                  :preview-src-list="[scope.row.productImg]"
                                  :src="scope.row.productImg">
                            <template slot="placeholder">
                                <img src="../assets/loading-svg/loading-bars.svg" alt="">
                            </template>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="productPrice" label="付款金额" width="100" align="center">
                    <template slot-scope="scope">
                        <span>￥{{scope.row.productPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="付款状态" align="center" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 2">已完成</span>
                        <span v-if="scope.row.status == 1">待付款</span>
                        <span v-if="scope.row.status == 0">未付款</span>
                    </template>
                </el-table-column>
                <!--TODO 将新闻分类的名称对应-->
                <el-table-column label="订单创建时间" width="120" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.createTimeObj.year}}</p>
                        <p>{{scope.row.createTimeObj.time}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="订单更新时间" width="120" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.updateTimeObj.year}}</p>
                        <p>{{scope.row.updateTimeObj.time}}</p>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页器-->
            <div class="pagination">
                <el-pagination backgorund
                               :page-size="query.pageSize"
                               :total="pageTotal"
                               @current-change="handlePageChange"
                               layout="prev,pager,next,jumper">
                </el-pagination>
            </div>
        </div>
        <loading v-if="showLoading"></loading>
    </div>
</template>

<script>
    import Loading from "../components/Loading";

    export default {
        name: "Order",
        components: {
            Loading
        },
        data() {
            return {
                query: {
                    name: "", // 模糊查询的名称
                    pageNum: 1,
                    pageSize: 8
                },
                tableData: [], // 存放 渲染table表格的数据
                multipleSelection: [], // ref 指向的双向绑定的对象
                pageTotal: 0, // 列表信息总条数
                userList: [],// 所有用户信息
                showLoading: false
            }
        },
        async created() {
            await this.getList();
        },
        methods: {
            // 获取列表数据
            async getList() {
                this.showLoading = true;
                this.userList = await this.getUserWx();
                this.axios.get(`/order/list/all`, {
                    params: {
                        productName: this.query.name,
                        pageNum: this.query.pageNum,
                        pageSize: this.query.pageSize,
                    }
                }).then(res => {
                    this.tableData = this.getTableData(this.userList,res.data.list);
                    this.pageTotal = res.data.total;
                    this.showLoading = false;
                });
            },
            // 获取小程序登陆人员信息，与订单表中 userId联动
            async getUserWx() {
                return await this.axios.get(`/user/listAll`)
                    .then(res => {
                        return res.data;
                    });
            },
            // 将新闻分类名称添加到新闻列表的数据中
            getTableData(userList,orderList) {
                orderList.forEach(order => {
                    order.createTimeObj = this.formatDate(order.createTime);
                    order.updateTimeObj = this.formatDate(order.updateTime);
                    userList.forEach(user => {
                        if (order.userId == user.id) {
                            order.username = user.nickname
                        }
                    });
                });
                return orderList;
            },
            // 修改日期时间格式
            formatDate(date) {
                let dateObj = {};
                const year = date.substring(0,date.indexOf("T"));
                const time = date.substring(date.indexOf("T")+1,date.indexOf("."));
                dateObj.year = year;
                dateObj.time = time;
                return dateObj;
            },
            // 模糊查询，搜索功能
            handleSearch() {
                this.getList();
            },

            //  分页器中页码切换时触发
            handlePageChange(pageNum) {
                this.query.pageNum = pageNum;
                this.getList();
            },
        }
    }
</script>

<style lang="scss">
    .order {
        .handle-box {
            text-align: left;

            .handle-input {
                width: 300px;
                display: inline-block;
            }
        }

        .table {
            font-size: 16px !important;

            .red {
                color: #ff0000;
            }

            .detailImg, .productImg {
                display: block;
                margin: auto;
                width: 150px;
                height: 100px;
                border-radius: 5px;
            }
        }

        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width: 190px;
            height: 100px;

            &:hover {
                border-color: #409EFF;
            }

            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }

            .avatar {
                width: 100%;
                object-fit: contain;
            }
        }
        .upload-box{
            .upladImg{
                width: 100px;
                object-fit: contain;
            }
            .el-form-item__content{
                display: flex;
                height: 100px;
            }
            .el-upload--picture-card{
                width: 100px;
                height: 100px;
                line-height: 100px;
            }
            .el-upload-list--picture-card .el-upload-list__item{
                width: 100px;
                height: 100px;
            }
            .el-upload-list el-upload-list--picture-card{
                width: 100px;
                height: 100px;
                line-height: 100px;
            }
        }
    }
</style>