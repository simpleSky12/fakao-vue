<template>
    <div class="user-info">
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item>
                    <i class="el-icon-s-custom"></i>
                    登记信息列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table class="table" ref="multipleTable"
                      border :data="tableData"
                      header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名称" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" width="80" align="center"></el-table-column>
                <el-table-column prop="age" label="年龄" width="60" align="center"></el-table-column>
                <el-table-column label="性别" width="60" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex == 1">男</span>
                        <span v-else>女</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="major" label="专业" align="center"></el-table-column>
                <el-table-column prop="education" label="学历" align="center"></el-table-column>
                <el-table-column prop="job" label="职业" align="center"></el-table-column>
                <el-table-column prop="hobby" label="爱好" align="center"></el-table-column>
                <el-table-column prop="graduateDate" label="毕业时间" align="center"></el-table-column>
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
        name: "UserInfo",
        components: {
            Loading
        },
        data() {
            return {
                query: {
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
                this.axios.get(`/userInfo/list`, {
                    params: {
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
            // 将小程序登陆用户名称添加到用户登记信息列表
            getTableData(userList,userInfoList) {
                userInfoList.forEach(userInfo => {
                    userList.forEach(user => {
                        if (userInfo.userId == user.id) {
                            userInfo.username = user.nickname
                        }
                    });
                });
                return userInfoList;
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
    .user-info {
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